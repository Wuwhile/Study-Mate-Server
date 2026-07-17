USE study_mate;

DROP PROCEDURE IF EXISTS add_column_if_missing;

DELIMITER $$
CREATE PROCEDURE add_column_if_missing(
  IN table_name_value VARCHAR(64),
  IN column_name_value VARCHAR(64),
  IN column_definition_value TEXT
)
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = DATABASE()
      AND table_name = table_name_value
      AND column_name = column_name_value
  ) THEN
    SET @alter_sql = CONCAT(
      'ALTER TABLE `',
      table_name_value,
      '` ADD COLUMN `',
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

CALL add_column_if_missing('questionnaire_results', 'questionnaire_name', 'VARCHAR(100) NOT NULL DEFAULT ''Study-mate 学情诊断'' COMMENT ''诊断名称''');
CALL add_column_if_missing('questionnaire_results', 'questionnaire_type', 'VARCHAR(50) NOT NULL DEFAULT ''foundation'' COMMENT ''诊断类型''');
CALL add_column_if_missing('questionnaire_results', 'score', 'INT DEFAULT 0 COMMENT ''诊断得分''');
CALL add_column_if_missing('questionnaire_results', 'depression_level', 'VARCHAR(50) COMMENT ''诊断等级''');
CALL add_column_if_missing('questionnaire_results', 'level_description', 'TEXT COMMENT ''等级描述''');
CALL add_column_if_missing('questionnaire_results', 'result_data', 'JSON COMMENT ''诊断详细数据''');

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

DROP PROCEDURE IF EXISTS add_column_if_missing;
