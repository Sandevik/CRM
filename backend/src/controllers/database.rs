use actix_web::web;
use sqlx::{mysql::MySqlQueryResult, Pool, MySql};
use crate::{AppState, models::user::User};
pub struct Database ();

impl Database {

    // Sets up the inital users table for people who sign up
    pub async fn setup_users_table(pool: &Pool<MySql>) -> Result<MySqlQueryResult, sqlx::Error> {
        let create_table_users_query: &str = r#"
            CREATE TABLE IF NOT EXISTS `crm`.`users` (
                `uuid` VARCHAR(36) CHARACTER SET utf8 COLLATE utf8_general_mysql500_ci NOT NULL,
                `email` VARCHAR(50) CHARACTER SET utf8 COLLATE utf8_general_mysql500_ci NOT NULL,
                `first_name` VARCHAR(30) CHARACTER SET utf8 COLLATE utf8_general_mysql500_ci,
                `last_name` VARCHAR(30) CHARACTER SET utf8 COLLATE utf8_general_mysql500_ci,
                `p_hash` TEXT CHARACTER SET utf8 COLLATE utf8_general_mysql500_ci NOT NULL,
                `phone_number` VARCHAR(15) NOT NULL,
                `admin` BOOLEAN NOT NULL DEFAULT FALSE,
                `joined` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                `last_sign_in` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                `crm_count` TINYINT UNSIGNED NOT NULL,
                `subscription_ends` TIMESTAMP,
                `legacy_user` BOOLEAN NOT NULL DEFAULT FALSE,
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
            `uuid` VARCHAR(36) CHARACTER SET utf8 COLLATE utf8_general_mysql500_ci NOT NULL,
            `user_uuid` VARCHAR(36) CHARACTER SET utf8 COLLATE utf8_general_mysql500_ci NOT NULL,
            `crm_uuid` VARCHAR(36) CHARACTER SET utf8 COLLATE utf8_general_mysql500_ci NOT NULL,
            PRIMARY KEY (`uuid`(36))
          ) ENGINE = InnoDB COLLATE utf8_general_mysql500_ci;
        "#;

        sqlx::query(create_table_crm_query).execute(pool).await
    }

    // Uses a logged in user's uuid to create a personal customers table like "81caabab-7e86-4547-beee-d2da511237c4-customers"
    pub async fn setup_customers_table(user: &User, data: web::Data<AppState>) -> Result<MySqlQueryResult, sqlx::Error>{
        let mut table_name = String::from("crm.");
        table_name.push_str(user.uuid.as_hyphenated().to_string().as_str());
        table_name.push_str("-customers");

        let create_table_customers_query: &str = r#"
        CREATE TABLE IF NOT EXISTS ? ( 
            `uuid` VARCHAR(36) NOT NULL, 
            `first_name` TEXT, 
            `last_name` TEXT,
            `email` TEXT, 
            `phone_number` VARCHAR, 
            `note` TEXT, 
            PRIMARY KEY (`uuid`)) ENGINE = InnoDB;
        "#;

        sqlx::query(create_table_customers_query).bind(table_name).execute(&data.pool).await
    }

    pub fn setup_customers_table_delimeter() {
        let query = r#"DELIMITER //
        CREATE PROCEDURE procedure_name ( IN | OUT | INOUT parameter_name parameter_datatype (length), … )
        BEGIN    
            SQL statements
        END //
        DELIMITER ;"#;
    }




}