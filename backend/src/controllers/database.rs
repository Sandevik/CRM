use sqlx::{mysql::MySqlQueryResult, Pool, MySql};

use crate::models::{company::Company, crm::CRM, customer::Customer, employee::Employee, entry::Entry, meeting::Meeting, task::Task, time_report::TimeReport, user::User, Model, _break::Break};

pub struct Database ();

impl Database {

    fn create_schema_if_not_exists() -> String {
        r#"
        CREATE SCHEMA IF NOT EXISTS `crm` COLLATE utf8_general_mysql500_ci
        "#.to_string()
    }

    pub async fn create_table(table_rows: Vec<[&'static str; 2]>, table_name: &'static str, additional_sql_constraints: Option<&'static str>, pool: &Pool<MySql>) -> Result<(), sqlx::Error> {
        let mut query = format!("CREATE TABLE IF NOT EXISTS `crm` . `{table_name}` (");
        for (i, arr) in table_rows.iter().enumerate() {
            let [k, t] = arr;
            query.push_str(&format!("`{k}` {t}"));
            if i < table_rows.len() -1  {
                query.push_str(", ")
            }
        }
        if additional_sql_constraints.is_some() {
            query.push_str(&format!(", {}", additional_sql_constraints.unwrap()));
        }
        query.push_str(r#") ENGINE = InnoDB COLLATE utf8_general_mysql500_ci; "#);
        match sqlx::query(&query)
        .execute(pool)
        .await {
            Err(err) => Err(err),
            Ok(_) => Ok(())
        }
    }
   
    fn default_employee_user_table() -> String {
        r#"
        CREATE TABLE IF NOT EXISTS `crm`.`user_employee` (
            `uuid` VARCHAR(36) CHARACTER SET utf8 COLLATE utf8_general_mysql500_ci NOT NULL UNIQUE PRIMARY KEY,
            `user_uuid` VARCHAR(36) CHARACTER SET utf8 COLLATE utf8_general_mysql500_ci NOT NULL,
            `crm_uuid` VARCHAR(36) CHARACTER SET utf8 COLLATE utf8_general_mysql500_ci NOT NULL,
            `access_level` INT NOT NULL DEFAULT 0,
            `can_report_time` BOOLEAN NOT NULL DEFAULT TRUE,
            `can_handle_customers` BOOLEAN NOT NULL DEFAULT FALSE,
            `can_handle_employees` BOOLEAN NOT NULL DEFAULT FALSE,
            `can_handle_vehicles` BOOLEAN NOT NULL DEFAULT FALSE,
            `is_admin` BOOLEAN NOT NULL DEFAULT FALSE,
            `can_access_crm` BOOLEAN NOT NULL DEFAULT FALSE
          ) ENGINE = InnoDB COLLATE utf8_general_mysql500_ci;
        "#.to_string()
    }
     
    pub async fn setup_employee_user_table(pool: &Pool<MySql>) -> Result<MySqlQueryResult, sqlx::Error> {
        sqlx::query(&Self::default_employee_user_table()).execute(pool).await
    }

    pub async fn setup_tables(pool: &Pool<MySql>) -> Result<(), sqlx::Error> {
        if let Err(err) = sqlx::query(&Self::create_schema_if_not_exists()).execute(pool).await {
            return Err(err);
        }
        if let Err(err) = User::create_table(pool).await {
            return Err(err);
        }
        if let Err(err) = CRM::create_table(pool).await {
            return Err(err);
        }
        if let Err(err) = Customer::create_table(pool).await {
            return Err(err);
        } 
        if let Err(err) = Entry::create_table(pool).await {
            return Err(err);
        }
        if let Err(err) = Meeting::create_table(pool).await {
            return Err(err);
        }
        if let Err(err) = Employee::create_table(pool).await {
            return Err(err);
        }
        if let Err(err) = Task::create_table(pool).await {
            return Err(err);
        }
        if let Err(err) = Company::create_table(pool).await {
            return Err(err);
        }
        if let Err(err) = TimeReport::create_table(pool).await {
            return Err(err);
        }
        if let Err(err) = Break::create_table(pool).await {
            return Err(err);
        }
        
        if let Err(err) = Self::setup_employee_user_table(pool).await {
            return Err(err);
        }
        Ok(())
    }

}