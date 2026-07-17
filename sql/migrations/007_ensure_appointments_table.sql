USE study_mate;

CREATE TABLE IF NOT EXISTS appointments (
  id INT AUTO_INCREMENT PRIMARY KEY COMMENT '预约ID',
  user_id INT NOT NULL COMMENT '用户ID',
  doctor_id INT NOT NULL COMMENT '导师ID',
  doctor_name VARCHAR(100) COMMENT '导师姓名',
  patient_name VARCHAR(100) NOT NULL COMMENT '学习者姓名',
  patient_age INT DEFAULT 0 COMMENT '学习者阶段兼容字段',
  patient_gender VARCHAR(20) COMMENT '学习方向',
  patient_phone VARCHAR(20) NOT NULL COMMENT '学习者手机号',
  consultation_content TEXT COMMENT '学习需求',
  urgency VARCHAR(50) COMMENT '紧急程度',
  time_preference VARCHAR(100) COMMENT '时间偏好',
  status VARCHAR(50) DEFAULT 'pending' COMMENT '预约状态',
  notes TEXT COMMENT '备注',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  INDEX idx_user_id (user_id),
  INDEX idx_doctor_id (doctor_id),
  INDEX idx_patient_phone (patient_phone),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='学习导师预约表';

DROP PROCEDURE IF EXISTS add_appointment_column_if_missing;

DELIMITER $$
CREATE PROCEDURE add_appointment_column_if_missing(
  IN column_name_value VARCHAR(64),
  IN column_definition_value TEXT
)
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = DATABASE()
      AND table_name = 'appointments'
      AND column_name = column_name_value
  ) THEN
    SET @alter_sql = CONCAT(
      'ALTER TABLE `appointments` ADD COLUMN `',
      column_name_value,
      '` ',
      column_definition_value
    );
    PREPARE alter_stmt FROM @alter_sql;
    EXECUTE alter_stmt;
    DEALLOCATE PREPARE alter_stmt;
  END IF;
END$$
DELIMITER ;

CALL add_appointment_column_if_missing('user_id', 'INT NULL COMMENT ''用户ID''');
CALL add_appointment_column_if_missing('doctor_id', 'INT NOT NULL DEFAULT 0 COMMENT ''导师ID''');
CALL add_appointment_column_if_missing('doctor_name', 'VARCHAR(100) COMMENT ''导师姓名''');
CALL add_appointment_column_if_missing('patient_name', 'VARCHAR(100) NOT NULL DEFAULT '''' COMMENT ''学习者姓名''');
CALL add_appointment_column_if_missing('patient_age', 'INT DEFAULT 0 COMMENT ''学习者阶段兼容字段''');
CALL add_appointment_column_if_missing('patient_gender', 'VARCHAR(20) COMMENT ''学习方向''');
CALL add_appointment_column_if_missing('patient_phone', 'VARCHAR(20) NOT NULL DEFAULT '''' COMMENT ''学习者手机号''');
CALL add_appointment_column_if_missing('consultation_content', 'TEXT COMMENT ''学习需求''');
CALL add_appointment_column_if_missing('urgency', 'VARCHAR(50) COMMENT ''紧急程度''');
CALL add_appointment_column_if_missing('time_preference', 'VARCHAR(100) COMMENT ''时间偏好''');
CALL add_appointment_column_if_missing('status', 'VARCHAR(50) DEFAULT ''pending'' COMMENT ''预约状态''');
CALL add_appointment_column_if_missing('notes', 'TEXT COMMENT ''备注''');
CALL add_appointment_column_if_missing('created_at', 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT ''创建时间''');
CALL add_appointment_column_if_missing('updated_at', 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT ''更新时间''');

DROP PROCEDURE IF EXISTS add_appointment_column_if_missing;
