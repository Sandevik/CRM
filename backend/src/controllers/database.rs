use sqlx::{mysql::MySqlQueryResult, Pool, MySql, Row};

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

    // this does not affect any primary keys.
    pub async fn alter_table(table_rows: Vec<[&'static str; 2]>, table_name: &'static str, pool: &Pool<MySql>) -> Result<(), sqlx::Error> {
        match sqlx::query(&format!("DESC `crm` . `{table_name}`")).fetch_all(pool).await {
            Err(err) => Err(err),
            Ok(rows) => {
                for i in 0..table_rows.len() {
                    let table_row = table_rows[i];
                    let current_db_row = rows.iter().find(|row| row.get::<&str, &str>("Field") == table_row[0]);

                    if let None = current_db_row {
                        // Add column "table_row[0]" as it does not exist
                        let query = format!("ALTER TABLE `crm` . `{table_name}` ADD COLUMN {} {}", table_row[0], table_row[1]);
                        if let Err(err) = sqlx::query(&query).execute(pool).await {
                            panic!("ERROR: Could not add column '{}' on table '{}', {err}", table_row[0], table_name);
                        }
                        
                    } else {
                        // Edit the type of a column in the db 
                        let mut skip: bool = false;
                        // This is a temporary fix and will probably be buggy
                        let mut sql_type = current_db_row.unwrap().get::<&str, &str>("Type").to_lowercase();
                        if current_db_row.unwrap().get::<&str, &str>("Null") == "NO".to_string() {
                            sql_type.push_str(" not null")
                        }

                        if current_db_row.unwrap().get::<&str, &str>("Key") == "PRI" {
                            skip = true;
                        }
                        
                        if sql_type != table_row[1].to_lowercase() && !skip {
                            // Modify Type of table_row[0] (or current_db_row) to be table_row[1]
                            let query = format!("ALTER TABLE `crm` . `{table_name}` MODIFY COLUMN {} {}", table_row[0], table_row[1]); 
                            if let Err(err) = sqlx::query(&query).execute(pool).await {
                                panic!("ERROR: Could not modify column '{}' on table '{}', {err} ", table_row[0], table_name);
                            }
                        }
                    }
                };

                // Remove unused columns in the db
                for i in 0..rows.len(){
                    if let None = table_rows.iter().find(|table_row| table_row[0] == rows[i].get::<&str, &str>("Field")) {
                        // column does not exist in db, Remove
                        let query = format!("ALTER TABLE `crm` . `{table_name}` DROP COLUMN `{}`", rows[i].get::<&str, &str>("Field"));
                        if let Err(err) = sqlx::query(&query).execute(pool).await {
                            panic!("ERROR: Could not drop column '{}' on table: {table_name}, {err}", rows[i].get::<&str, &str>("Field"))
                        } 
                    }
                }
                Ok(())
            }
        }
    }

    pub async fn migrate_table(table_rows: Vec<[&'static str; 2]>, table_name: &'static str, additional_sql_constraints: Option<&'static str>, pool: &Pool<MySql>) -> Result<(), sqlx::Error> {
        if let Err(err) = Self::create_table(table_rows.clone(), table_name, additional_sql_constraints, pool).await {
            return Err(err);
        }
        if let Err(err) = Self::alter_table(table_rows.clone(), table_name, pool).await {
            return Err(err);
        }
        Ok(())
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
        if let Err(err) = User::migrate_table(pool).await {
            return Err(err);
        }
        if let Err(err) = CRM::migrate_table(pool).await {
            return Err(err);
        }
        if let Err(err) = Customer::migrate_table(pool).await {
            return Err(err);
        } 
        if let Err(err) = Entry::migrate_table(pool).await {
            return Err(err);
        }
        if let Err(err) = Meeting::migrate_table(pool).await {
            return Err(err);
        }
        if let Err(err) = Employee::migrate_table(pool).await {
            return Err(err);
        }
        if let Err(err) = Task::migrate_table(pool).await {
            return Err(err);
        }
        if let Err(err) = Company::migrate_table(pool).await {
            return Err(err);
        }
        if let Err(err) = TimeReport::migrate_table(pool).await {
            return Err(err);
        }
        if let Err(err) = Break::migrate_table(pool).await {
            return Err(err);
        }
        
        if let Err(err) = Self::setup_employee_user_table(pool).await {
            return Err(err);
        }
        Ok(())
    }

}