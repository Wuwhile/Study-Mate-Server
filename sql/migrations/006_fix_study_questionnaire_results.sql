USE study_mate;

ALTER TABLE questionnaire_results
  ADD COLUMN IF NOT EXISTS questionnaire_name VARCHAR(100) NOT NULL DEFAULT 'Study-mate 学情诊断' COMMENT '诊断名称',
  ADD COLUMN IF NOT EXISTS questionnaire_type VARCHAR(50) NOT NULL DEFAULT 'foundation' COMMENT '诊断类型',
  ADD COLUMN IF NOT EXISTS score INT DEFAULT 0 COMMENT '诊断得分',
  ADD COLUMN IF NOT EXISTS depression_level VARCHAR(50) COMMENT '诊断等级',
  ADD COLUMN IF NOT EXISTS level_description TEXT COMMENT '等级描述',
  ADD COLUMN IF NOT EXISTS result_data JSON COMMENT '诊断详细数据';

SET @has_type_column := (
  SELECT COUNT(*)
  FROM information_schema.columns
  WHERE table_schema = DATABASE()
    AND table_name = 'questionnaire_results'
    AND column_name = 'type'
);

SET @copy_type_sql := IF(
  @has_type_column > 0,
  'UPDATE questionnaire_results SET questionnaire_type = type WHERE questionnaire_type IS NULL',
  'SELECT 1'
);

PREPARE copy_type_stmt FROM @copy_type_sql;
EXECUTE copy_type_stmt;
DEALLOCATE PREPARE copy_type_stmt;
