use sqlx::{mysql::MySqlQueryResult, Pool, MySql};
pub struct Database ();

impl Database {

    fn create_table_if_not_exists() -> String {
        r#"
        CREATE SCHEMA `crm` IF NOT EXISTS COLLATE utf8_general_mysql500_ci
        "#.to_string()
    }

    fn default_customers_table() -> String {
        r#"
        `crm_uuid` VARCHAR(36) CHARACTER SET utf8 COLLATE utf8_general_mysql500_ci NOT NULL,
        `uuid` VARCHAR(36) CHARACTER SET utf8 COLLATE utf8_general_mysql500_ci NOT NULL UNIQUE PRIMARY KEY,
        `first_name` TEXT,
        `last_name` TEXT,
        `date_of_birth` DATE,
        `email` VARCHAR(50) CHARACTER SET utf8 COLLATE utf8_general_mysql500_ci NOT NULL,
        `address` TEXT,
        `zip_code` TEXT,
        `city` TEXT,
        `country` TEXT,
        `company` TEXT,
        `phone_number` TEXT,
        `news_letter` BOOLEAN NOT NULL DEFAULT FALSE,
        `added` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        `updated` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        `note` TEXT
        "#.to_string()
    }
    fn default_entries_table() -> String {
        r#"
        `crm_uuid` VARCHAR(36) CHARACTER SET utf8 COLLATE utf8_general_mysql500_ci NOT NULL,
        `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        `customer_uuid` VARCHAR(36) CHARACTER SET utf8 COLLATE utf8_general_mysql500_ci NOT NULL,
        `added` DATETIME,
        `added_at_meeting` VARCHAR(36) CHARACTER SET utf8 COLLATE utf8_general_mysql500_ci,
        `updated` DATETIME,
        `content` TEXT
        "#.to_string()
    }
    fn default_meetings_table() -> String {
        r#"
        `crm_uuid` VARCHAR(36) CHARACTER SET utf8 COLLATE utf8_general_mysql500_ci NOT NULL,
        `uuid` VARCHAR(36) CHARACTER SET utf8 COLLATE utf8_general_mysql500_ci NOT NULL PRIMARY KEY,
        `customer_uuid` VARCHAR(36) CHARACTER SET utf8 COLLATE utf8_general_mysql500_ci NOT NULL,
        `from` DATETIME,
        `to` DATETIME,
        `added` DATETIME,
        `updated` DATETIME,
        `entry_id` INT
        "#.to_string()
    }
    fn default_employees_table() -> String {
        r#"
        `crm_uuid` VARCHAR(36) CHARACTER SET utf8 COLLATE utf8_general_mysql500_ci NOT NULL,
        `uuid` VARCHAR(36) CHARACTER SET utf8 COLLATE utf8_general_mysql500_ci NOT NULL PRIMARY KEY,
        `user_uuid` VARCHAR(36) CHARACTER SET utf8 COLLATE utf8_general_mysql500_ci UNIQUE,
        `first_name` TEXT,
        `last_name` TEXT,
        `date_of_birth` DATE,
        `ssn` VARCHAR(12),
        `address` TEXT,
        `zip_code` TEXT,
        `city` TEXT,
        `country` TEXT,
        `phone_number` TEXT,
        `role` TEXT,
        `driving_license_class` TEXT,
        `period_of_validity` TEXT,
        `email` TEXT,
        `contract_uuid` VARCHAR(36) CHARACTER SET utf8 COLLATE utf8_general_mysql500_ci,
        `access_level` TEXT,
        `added` DATETIME,
        `updated` DATETIME
        "#.to_string()
    }
    fn default_company_table() -> String {
        r#"
        `crm_uuid` VARCHAR(36) CHARACTER SET utf8 COLLATE utf8_general_mysql500_ci NOT NULL PRIMARY KEY,
        `name` TEXT,
        `organization_number` TEXT,
        `address` TEXT,
        `zip_code` TEXT,
        `city` TEXT,
        `phone_number` TEXT,
        `place_of_stationing` TEXT,
        `added` DATETIME,
        `updated` DATETIME
        "#.to_string()
    }
    fn default_contract_table() -> String {
        r#"
        `crm_uuid` VARCHAR(36) CHARACTER SET utf8 COLLATE utf8_general_mysql500_ci NOT NULL,
        `uuid` VARCHAR(36) CHARACTER SET utf8 COLLATE utf8_general_mysql500_ci NOT NULL PRIMARY KEY,
        `employee_uuid` VARCHAR(36) CHARACTER SET utf8 COLLATE utf8_general_mysql500_ci NOT NULL,
        `is_template` BOOL,
        `employment_date` DATE,
        `title` TEXT,
        `new_employment` BOOL,
        `change` BOOL,
        `change_from_date` DATE,
        `probationary_employment` BOOL,
        `probationary_employment_from` DATE,
        `probationary_employment_until` DATE,
        `permanent_emloyment` BOOL,
        `temp_employment` BOOL,
        `temp_employment_for_name` TEXT,
        `temp_employment_reason` TEXT,
        `temp_employment_from` DATE,
        `temp_employment_until` DATE,
        `extra_employment` BOOL,
        `extra_employment_from` DATE,
        `extra_employment_until` DATE,
        `extra_employment_set_days` TEXT,
        `other_fixed_term_employment` BOOL,
        `other_fixed_term_employment_standard` BOOL,
        `other_fixed_term_employment_season_work` BOOL,
        `other_fixed_term_employment_special` BOOL,
        `other_fixed_term_employment_from` DATE,
        `other_fixed_term_employment_until` DATE,
        `working_hours_full_time` BOOL,
        `working_hours_part_time` BOOL,
        `working_hours_part_time_weekly_hours` INT,
        `salary_group` TEXT,
        `entry_salary` DECIMAL(13,2),
        `salary_form` TEXT,
        `payment_form` TEXT,
        `vacation` TEXT,
        `active_collective_agreement` TEXT, 
        `note` TEXT,
        `bank_number` TEXT,
        `clearing_number` TEXT,
        `bank_name` TEXT,
        `added` DATETIME,
        `updated` DATETIME
        "#.to_string()
    }
    fn default_time_reports_table() -> String {
        r#"
        `crm_uuid` VARCHAR(36) CHARACTER SET utf8 COLLATE utf8_general_mysql500_ci NOT NULL,
        `uuid` VARCHAR(36) CHARACTER SET utf8 COLLATE utf8_general_mysql500_ci NOT NULL PRIMARY KEY UNIQUE,
        `employee_uuid` VARCHAR(36) CHARACTER SET utf8 COLLATE utf8_general_mysql500_ci NOT NULL,
        `date` DATE NOT NULL,
        `start_time` TIME,
        `end_time` TIME,
        `breaks` VARCHAR(36) CHARACTER SET utf8 COLLATE utf8_general_mysql500_ci,
        `note` TEXT,
        `work_tasks` VARCHAR(36) CHARACTER SET utf8 COLLATE utf8_general_mysql500_ci,
        `added` DATETIME,
        `updated` DATETIME
        "#.to_string()
    }
    fn default_time_reports_breaks_table() -> String {
        r#"
        `crm_uuid`  VARCHAR(36) CHARACTER SET utf8 COLLATE utf8_general_mysql500_ci NOT NULL PRIMARY KEY,
        `time_report_uuid` VARCHAR(36) CHARACTER SET utf8 COLLATE utf8_general_mysql500_ci NOT NULL,
        `breaks_uuid` VARCHAR(36) CHARACTER SET utf8 COLLATE utf8_general_mysql500_ci NOT NULL
        "#.to_string()
    }
    fn default_breaks_table() -> String {
        r#"
        `breaks_uuid` VARCHAR(36) CHARACTER SET utf8 COLLATE utf8_general_mysql500_ci NOT NULL PRIMARY KEY,
        `start_time` TIME,
        `end_time` TIME,
        `added` DATETIME,
        `updated` DATETIME
        "#.to_string()
    }
    fn default_work_task_table() -> String {
        r#"
        `uuid` VARCHAR(36) CHARACTER SET utf8 COLLATE utf8_general_mysql500_ci NOT NULL PRIMARY KEY,
        `start_time` TIME,
        `end_time` TIME,
        `activity` TEXT,
        `vehicle` TEXT,
        `added` DATETIME,
        `updated` DATETIME
        "#.to_string()
    }
    fn default_deals_table() -> String {
        r#"
        `crm_uuid` VARCHAR(36) CHARACTER SET utf8 COLLATE utf8_general_mysql500_ci NOT NULL,
        `uuid` VARCHAR(36) CHARACTER SET utf8 COLLATE utf8_general_mysql500_ci NOT NULL PRIMARY KEY,
        `added_by` VARCHAR(36) CHARACTER SET utf8 COLLATE utf8_general_mysql500_ci NOT NULL UNIQUE,
        `title` VARCHAR(25),
        `product` TEXT,
        `stage` TEXT,
        `status` TEXT,
        `note` TEXT,
        `added` DATETIME,
        `updated` DATETIME
        "#.to_string()
    }
    fn default_task_table() -> String {
        r#"
        `uuid` VARCHAR(36) CHARACTER SET utf8 COLLATE utf8_general_mysql500_ci NOT NULL UNIQUE PRIMARY KEY,
        `crm_uuid` VARCHAR(36) CHARACTER SET utf8 COLLATE utf8_general_mysql500_ci NOT NULL,
        `start` DATETIME,
        `deadline` DATETIME,
        `recurrence` VARCHAR(7),
        `recurrence_count` INT,
        `status` VARCHAR(10),
        `customer_uuid` VARCHAR(36) CHARACTER SET utf8 COLLATE utf8_general_mysql500_ci,
        `employee_uuid` VARCHAR(36) CHARACTER SET utf8 COLLATE utf8_general_mysql500_ci,
        `title` VARCHAR(50),
        `added` DATETIME,
        `updated` DATETIME
        "#.to_string()
    }
    fn default_employee_crm_table() -> String {
        r#"
        CREATE TABLE IF NOT EXISTS `crm`.`user_employee` (
            `uuid` VARCHAR(36) CHARACTER SET utf8 COLLATE utf8_general_mysql500_ci NOT NULL UNIQUE PRIMARY KEY,
            `user_uuid` VARCHAR(36) CHARACTER SET utf8 COLLATE utf8_general_mysql500_ci NOT NULL,
            `crm_uuid` VARCHAR(36) CHARACTER SET utf8 COLLATE utf8_general_mysql500_ci NOT NULL,
          ) ENGINE = InnoDB COLLATE utf8_general_mysql500_ci;
        "#.to_string()
    }

    // Sets up the inital users table for people who sign up
    pub async fn setup_users_table(pool: &Pool<MySql>) -> Result<MySqlQueryResult, sqlx::Error> {
        let create_table_users_query: &str = r#"
            CREATE TABLE IF NOT EXISTS `crm`.`users` (
                `uuid` VARCHAR(36) CHARACTER SET utf8 COLLATE utf8_general_mysql500_ci NOT NULL UNIQUE,
                `email` VARCHAR(50) CHARACTER SET utf8 COLLATE utf8_general_mysql500_ci NOT NULL,
                `first_name` VARCHAR(30) CHARACTER SET utf8 COLLATE utf8_general_mysql500_ci,
                `last_name` VARCHAR(30) CHARACTER SET utf8 COLLATE utf8_general_mysql500_ci,
                `address` TEXT,
                `zip_code` TEXT,
                `city` TEXT,
                `country` TEXT,
                `password_hash` TEXT CHARACTER SET utf8 COLLATE utf8_general_mysql500_ci NOT NULL,
                `phone_number` VARCHAR(15) NOT NULL,
                `admin` BOOLEAN NOT NULL DEFAULT FALSE,
                `joined` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                `last_sign_in` DATETIME DEFAULT CURRENT_TIMESTAMP,
                `crm_count` TINYINT UNSIGNED NOT NULL,
                `subscription_ends` DATETIME,
                `legacy_user` BOOLEAN NOT NULL DEFAULT FALSE,
                `current_jwt` TEXT,
                `preferred_language` VARCHAR(3) NOT NULL DEFAULT 'eng',
                `employee_of_uuid` VARCHAR(36) UNIQUE,
                `employee_changed_pass` BOOL DEFAULT FALSE,
                PRIMARY KEY (`uuid`(36)),
                UNIQUE (`email`(50), `phone_number`(15))
              ) ENGINE = InnoDB COLLATE utf8_general_mysql500_ci;
        "#;
        sqlx::query(create_table_users_query).execute(pool).await
    }

    // Sets up the connection table between a user and a crm system, so a user can have multiple crms.
    pub async fn setup_crm_users_table(pool: &Pool<MySql>) -> Result<MySqlQueryResult, sqlx::Error> {
        let create_table_crm_query: &str = r#"
        CREATE TABLE IF NOT EXISTS `crm`.`crm_users` (
            `user_uuid` VARCHAR(36) CHARACTER SET utf8 COLLATE utf8_general_mysql500_ci NOT NULL,
            `crm_uuid` VARCHAR(36) CHARACTER SET utf8 COLLATE utf8_general_mysql500_ci NOT NULL UNIQUE PRIMARY KEY,
            `name` VARCHAR(40) CHARACTER SET utf8 COLLATE utf8_general_mysql500_ci NOT NULL UNIQUE,
            `added` DATETIME,
            `hidden` BOOLEAN NOT NULL DEFAULT FALSE
          ) ENGINE = InnoDB COLLATE utf8_general_mysql500_ci;
        "#;
        sqlx::query(create_table_crm_query).execute(pool).await
    }
    pub async fn setup_customers_table(pool: &Pool<MySql>) -> Result<MySqlQueryResult, sqlx::Error> {
        let query: String = format!(r#"CREATE TABLE IF NOT EXISTS `crm`.`customers` ({}) ENGINE = InnoDB COLLATE utf8_general_mysql500_ci;"#, Self::default_customers_table());
        sqlx::query(&query).execute(pool).await
    }
    pub async fn setup_entries_table(pool: &Pool<MySql>) -> Result<MySqlQueryResult, sqlx::Error> {
        let query: String = format!(r#"CREATE TABLE IF NOT EXISTS `crm`.`entries` ({}) ENGINE = InnoDB COLLATE utf8_general_mysql500_ci;"#,
        Self::default_entries_table());
        sqlx::query(&query).execute(pool).await
    }  
    pub async fn setup_meetings_table(pool: &Pool<MySql>) -> Result<MySqlQueryResult, sqlx::Error> {
        let query: String = format!(r#"CREATE TABLE IF NOT EXISTS `crm`.`meetings` ({}) ENGINE = InnoDB COLLATE utf8_general_mysql500_ci;"#, 
        Self::default_meetings_table());
        sqlx::query(&query).execute(pool).await
    }  
    pub async fn setup_employees_table(pool: &Pool<MySql>) -> Result<MySqlQueryResult, sqlx::Error> {
        let query: String = format!(r#"CREATE TABLE IF NOT EXISTS `crm`.`employees` ({}) ENGINE = InnoDB COLLATE utf8_general_mysql500_ci;"#, 
        Self::default_employees_table());
        sqlx::query(&query).execute(pool).await
    }
    pub async fn setup_deals_table(pool: &Pool<MySql>) -> Result<MySqlQueryResult, sqlx::Error> {
        let query: String = format!(r#"CREATE TABLE IF NOT EXISTS `crm`.`deals` ({}) ENGINE = InnoDB COLLATE utf8_general_mysql500_ci;"#,
        Self::default_deals_table());
        sqlx::query(&query).execute(pool).await
    }
    pub async fn setup_tasks_table(pool: &Pool<MySql>) -> Result<MySqlQueryResult, sqlx::Error> {
        let query: String = format!(r#"CREATE TABLE IF NOT EXISTS `crm`.`tasks` ({}) ENGINE = InnoDB COLLATE utf8_general_mysql500_ci;"#,
        Self::default_task_table());
        sqlx::query(&query).execute(pool).await
    }
    pub async fn setup_company_table(pool: &Pool<MySql>) -> Result<MySqlQueryResult, sqlx::Error> {
        let query: String = format!(r#"CREATE TABLE IF NOT EXISTS `crm`.`companies` ({}) ENGINE = InnoDB COLLATE utf8_general_mysql500_ci;"#,
        Self::default_company_table());
        sqlx::query(&query).execute(pool).await
    }
    pub async fn setup_contract_table(pool: &Pool<MySql>) -> Result<MySqlQueryResult, sqlx::Error> {
        let query: String = format!(r#"CREATE TABLE IF NOT EXISTS `crm`.`contracts` ({}) ENGINE = InnoDB COLLATE utf8_general_mysql500_ci;"#,
        Self::default_contract_table());
        sqlx::query(&query).execute(pool).await
    }
    pub async fn setup_time_reports_table(pool: &Pool<MySql>) -> Result<MySqlQueryResult, sqlx::Error> {
        let query: String = format!(r#"CREATE TABLE IF NOT EXISTS `crm`.`time_reports` ({}) ENGINE = InnoDB COLLATE utf8_general_mysql500_ci;"#,
        Self::default_time_reports_table());
        sqlx::query(&query).execute(pool).await
    }
    pub async fn setup_time_reports_breaks_table(pool: &Pool<MySql>) -> Result<MySqlQueryResult, sqlx::Error> {
        let query: String = format!(r#"CREATE TABLE IF NOT EXISTS `crm`.`time_reports_breaks` ({}) ENGINE = InnoDB COLLATE utf8_general_mysql500_ci;"#,
        Self::default_time_reports_breaks_table());
        sqlx::query(&query).execute(pool).await
    }
    pub async fn setup_breaks_table(pool: &Pool<MySql>) -> Result<MySqlQueryResult, sqlx::Error> {
        let query: String = format!(r#"CREATE TABLE IF NOT EXISTS `crm`.`breaks` ({}) ENGINE = InnoDB COLLATE utf8_general_mysql500_ci;"#,
        Self::default_breaks_table());
        sqlx::query(&query).execute(pool).await
    }
    pub async fn setup_work_tasks_table(pool: &Pool<MySql>) -> Result<MySqlQueryResult, sqlx::Error> {
        let query: String = format!(r#"CREATE TABLE IF NOT EXISTS `crm`.`work_tasks` ({}) ENGINE = InnoDB COLLATE utf8_general_mysql500_ci;"#,
        Self::default_work_task_table());
        sqlx::query(&query).execute(pool).await
    }
    pub async fn setup_tables(pool: &Pool<MySql>) -> Result<(), sqlx::Error> {
        if let Err(err) = sqlx::query(&Self::create_table_if_not_exists()).execute(pool).await {
            return Err(err);
        }
        if let Err(err) = Self::setup_users_table(pool).await {
            return Err(err);
        }
        if let Err(err) = Self::setup_crm_users_table(pool).await {
            return Err(err);
        }
        if let Err(err) = Self::setup_customers_table(pool).await {
            return Err(err);
        } 
        if let Err(err) = Self::setup_entries_table(pool).await {
            return Err(err);
        }
        if let Err(err) = Self::setup_meetings_table(pool).await {
            return Err(err);
        }
        if let Err(err) = Self::setup_employees_table(pool).await {
            return Err(err);
        }
        if let Err(err) = Self::setup_deals_table(pool).await {
            return Err(err);
        }
        if let Err(err) = Self::setup_tasks_table(pool).await {
            return Err(err);
        }
        if let Err(err) = Self::setup_company_table(pool).await {
            return Err(err);
        }
        if let Err(err) = Self::setup_contract_table(pool).await {
            return Err(err);
        }
        if let Err(err) = Self::setup_breaks_table(pool).await {
            return Err(err);
        }
        if let Err(err) = Self::setup_time_reports_breaks_table(pool).await {
            return Err(err);
        }
        if let Err(err) = Self::setup_time_reports_table(pool).await {
            return Err(err);
        }
        if let Err(err) = Self::setup_work_tasks_table(pool).await {
            return Err(err);
        }
        Ok(())
    }

   

}