use actix_web::web;
use sqlx::{mysql::MySqlQueryResult, Pool, MySql};
use uuid::Uuid;

use crate::AppState;

pub struct Database ();

impl Database {

    // Sets up the inital users table for people who've signed up
    pub async fn setup_users_table(pool: &Pool<MySql>) -> Result<MySqlQueryResult, sqlx::Error> {
        let create_table_users_query: &str = r#"
        CREATE TABLE IF NOT EXISTS `crm`.`users` ( 
            `uuid` VARCHAR(36) CHARACTER SET utf8 COLLATE utf8_general_mysql500_ci NOT NULL ,
            `username` VARCHAR(40) NOT NULL ,
            `p_hash` TEXT NOT NULL ,
            `admin` BOOLEAN NOT NULL DEFAULT FALSE ,
        PRIMARY KEY (`uuid`(36)), UNIQUE (`username`(40))
        ) ENGINE = MyISAM;
        "#;
        sqlx::query(create_table_users_query).execute(pool).await
    }

    // Uses a logged in user's uuid to create a personal customers table like "81caabab-7e86-4547-beee-d2da511237c4-customers"
    pub async fn setup_customers_table(user_uuid: Uuid, data: web::Data<AppState>) -> Result<MySqlQueryResult, sqlx::Error>{
        let mut table_name = user_uuid.as_hyphenated().to_string();
        table_name.push_str("-customers");

        let create_table_customers_query: &str = r#"
        CREATE TABLE IF NOT EXISTS `crm`.`?` ( 
            `uuid` VARCHAR(36) CHARACTER SET utf8 COLLATE utf8_general_mysql500_ci NOT NULL ,
            `firstname` VARCHAR(40) NOT NULL,
            `email` TEXT,
            `lastname` TEXT,
            `note` TEXT,
        PRIMARY KEY (`uuid`(36)), UNIQUE (`username`(40))
        ) ENGINE = MyISAM;
        "#;

        sqlx::query(create_table_customers_query).bind(table_name).execute(&data.pool).await
    }









}