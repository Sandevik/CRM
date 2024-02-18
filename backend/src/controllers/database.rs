use sqlx::{mysql::MySqlQueryResult, Pool, MySql};
pub struct Database ();

impl Database {

    fn default_clients_table() -> String {
        r#"
        `crm_uuid` VARCHAR(36) CHARACTER SET utf8 COLLATE utf8_general_mysql500_ci NOT NULL,
        `uuid` VARCHAR(36) CHARACTER SET utf8 COLLATE utf8_general_mysql500_ci NOT NULL UNIQUE,
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
        `client_uuid` VARCHAR(36) CHARACTER SET utf8 COLLATE utf8_general_mysql500_ci NOT NULL,
        `added` DATETIME,
        `added_at_meeting` VARCHAR(36) CHARACTER SET utf8 COLLATE utf8_general_mysql500_ci,
        `updated` DATETIME,
        `content` TEXT
        "#.to_string()
    }
    fn default_meetings_table() -> String {
        r#"
        `crm_uuid` VARCHAR(36) CHARACTER SET utf8 COLLATE utf8_general_mysql500_ci NOT NULL,
        `uuid` VARCHAR(36) CHARACTER SET utf8 COLLATE utf8_general_mysql500_ci NOT NULL,
        `client_uuid` VARCHAR(36) CHARACTER SET utf8 COLLATE utf8_general_mysql500_ci NOT NULL,
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
        `uuid` VARCHAR(36) CHARACTER SET utf8 COLLATE utf8_general_mysql500_ci NOT NULL,
        `user_uuid` VARCHAR(36) CHARACTER SET utf8 COLLATE utf8_general_mysql500_ci NOT NULL UNIQUE,
        `soc_sec` VARCHAR(12),
        `date_of_birth` DATETIME,
        `access_level` TEXT,
        `employment_type` TEXT,
        `salary` DOUBLE,
        `added` DATETIME,
        `updated` DATETIME
        "#.to_string()
    }
    fn default_deals_table() -> String {
        r#"
        `crm_uuid` VARCHAR(36) CHARACTER SET utf8 COLLATE utf8_general_mysql500_ci NOT NULL,
        `uuid` VARCHAR(36) CHARACTER SET utf8 COLLATE utf8_general_mysql500_ci NOT NULL,
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
        `uuid` VARCHAR(36) CHARACTER SET utf8 COLLATE utf8_general_mysql500_ci NOT NULL UNIQUE,
        `crm_uuid` VARCHAR(36) CHARACTER SET utf8 COLLATE utf8_general_mysql500_ci NOT NULL,
        `start` DATETIME,
        `deadline` DATETIME,
        `recurrence` VARCHAR(7),
        `recurrence_count` INT,
        `status` VARCHAR(10),
        `client_uuid` VARCHAR(36) CHARACTER SET utf8 COLLATE utf8_general_mysql500_ci,
        `title` VARCHAR(50),
        `added` DATETIME,
        `updated` DATETIME
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
                `p_hash` TEXT CHARACTER SET utf8 COLLATE utf8_general_mysql500_ci NOT NULL,
                `phone_number` VARCHAR(15) NOT NULL,
                `admin` BOOLEAN NOT NULL DEFAULT FALSE,
                `joined` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                `last_sign_in` DATETIME DEFAULT CURRENT_TIMESTAMP,
                `crm_count` TINYINT UNSIGNED NOT NULL,
                `subscription_ends` DATETIME,
                `legacy_user` BOOLEAN NOT NULL DEFAULT FALSE,
                `current_jwt` TEXT,
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
            `crm_uuid` VARCHAR(36) CHARACTER SET utf8 COLLATE utf8_general_mysql500_ci NOT NULL UNIQUE,
            `name` VARCHAR(40) CHARACTER SET utf8 COLLATE utf8_general_mysql500_ci NOT NULL UNIQUE,
            `added` DATETIME,
            `hidden` BOOLEAN NOT NULL DEFAULT FALSE
          ) ENGINE = InnoDB COLLATE utf8_general_mysql500_ci;
        "#;
        sqlx::query(create_table_crm_query).execute(pool).await
    }

    pub async fn setup_clients_table(pool: &Pool<MySql>) -> Result<MySqlQueryResult, sqlx::Error> {
        let query: String = format!(r#"CREATE TABLE IF NOT EXISTS `clients` ({}) ENGINE = InnoDB COLLATE utf8_general_mysql500_ci;"#, Self::default_clients_table());
        sqlx::query(&query).execute(pool).await
    }
    pub async fn setup_entries_table(pool: &Pool<MySql>) -> Result<MySqlQueryResult, sqlx::Error> {
        let query: String = format!(r#"CREATE TABLE IF NOT EXISTS `entries` ({}) ENGINE = InnoDB COLLATE utf8_general_mysql500_ci;"#,
        Self::default_entries_table());
        sqlx::query(&query).execute(pool).await
    }  
    pub async fn setup_meetings_table(pool: &Pool<MySql>) -> Result<MySqlQueryResult, sqlx::Error> {
        let query: String = format!(r#"CREATE TABLE IF NOT EXISTS `meetings` ({}) ENGINE = InnoDB COLLATE utf8_general_mysql500_ci;"#, 
        Self::default_meetings_table());
        sqlx::query(&query).execute(pool).await
    }  
    pub async fn setup_employees_table(pool: &Pool<MySql>) -> Result<MySqlQueryResult, sqlx::Error> {
        let query: String = format!(r#"CREATE TABLE IF NOT EXISTS `employees` ({}) ENGINE = InnoDB COLLATE utf8_general_mysql500_ci;"#, 
        Self::default_employees_table());
        sqlx::query(&query).execute(pool).await
    }
    pub async fn setup_deals_table(pool: &Pool<MySql>) -> Result<MySqlQueryResult, sqlx::Error> {
        let query: String = format!(r#"CREATE TABLE IF NOT EXISTS `deals` ({}) ENGINE = InnoDB COLLATE utf8_general_mysql500_ci;"#,
        Self::default_deals_table());
        sqlx::query(&query).execute(pool).await
    }
    pub async fn setup_todos_table(pool: &Pool<MySql>) -> Result<MySqlQueryResult, sqlx::Error> {
        let query: String = format!(r#"CREATE TABLE IF NOT EXISTS `tasks` ({}) ENGINE = InnoDB COLLATE utf8_general_mysql500_ci;"#,
        Self::default_task_table());
        sqlx::query(&query).execute(pool).await
    }

    pub async fn setup_tables(pool: &Pool<MySql>) -> Result<(), sqlx::Error> {
        if let Err(err) = Self::setup_users_table(pool).await {
            return Err(err);
        }
        if let Err(err) = Self::setup_crm_users_table(pool).await {
            return Err(err);
        }
        if let Err(err) = Self::setup_clients_table(pool).await {
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
        if let Err(err) = Self::setup_todos_table(pool).await {
            return Err(err);
        }
        Ok(())
    }

   

}