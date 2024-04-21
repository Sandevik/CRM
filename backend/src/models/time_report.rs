use chrono::{DateTime, NaiveTime, Utc};
use sqlx::{MySql, Pool, Row};
use uuid::Uuid;

use crate::controllers::database::Database;

use super::Model;

pub struct TimeReport {
    pub crm_uuid: Uuid,
    pub uuid: Uuid,
    pub employee_uuid: Uuid,
    pub date: Option<DateTime<Utc>>,
    pub start_time: Option<NaiveTime>,
    pub end_time: Option<NaiveTime>,
    pub breaks: Option<Uuid>,
    pub note: Option<String>,
    pub work_tasks: Option<Uuid>,
    pub added: DateTime<Utc>,
    pub updated: DateTime<Utc>
}

impl Model for TimeReport {

    fn sql_row_arrays() -> Vec<[&'static str; 2]> {
        vec![
            ["crm_uuid", "VARCHAR(36) CHARACTER SET utf8 COLLATE utf8_general_mysql500_ci NOT NULL"],
            ["uuid", "VARCHAR(36) CHARACTER SET utf8 COLLATE utf8_general_mysql500_ci NOT NULL PRIMARY KEY UNIQUE"],
            ["employee_uuid", "VARCHAR(36) CHARACTER SET utf8 COLLATE utf8_general_mysql500_ci NOT NULL"],
            ["date", "DATE NOT NULL"],
            ["start_time", "TIME"],
            ["end_time", "TIME"],
            ["breaks", "VARCHAR(36) CHARACTER SET utf8 COLLATE utf8_general_mysql500_ci"],
            ["note", "TEXT"],
            ["work_tasks", "VARCHAR(36) CHARACTER SET utf8 COLLATE utf8_general_mysql500_ci"],
            ["added", "DATETIME"],
            ["updated", "DATETIME"]
        ]
    }

    async fn create_table(pool: &Pool<MySql>) -> Result<(), sqlx::Error> {
        Database::create_table(Self::sql_row_arrays(), "time_reports", None, pool).await
    }

    async fn alter_table(pool: &Pool<MySql>) -> Result<(), sqlx::Error> {
        todo!();
    }
   
    async fn create_and_alter_table(pool: &Pool<MySql>) -> Result<(), sqlx::Error> {
       todo!()
    }

    fn from_row(row: &sqlx::mysql::MySqlRow) -> Self {
        TimeReport {
            crm_uuid: Uuid::parse_str(row.get("crm_uuid")).unwrap_or_default(),
            uuid: Uuid::parse_str(row.get("uuid")).unwrap_or_default(),
            employee_uuid: Uuid::parse_str(row.get("employee_uuid")).unwrap_or_default(),
            date: row.get("date"),
            start_time: row.get("start_time"),
            end_time: row.get("end_time"),
            breaks: row.get("breaks"),
            note: row.get("note"),
            work_tasks: row.get("work_tasks"),
            added: row.get("added"),
            updated: row.get("updated"),
        }
    }

    async fn insert(&self, data: &actix_web::web::Data<crate::AppState>) -> Result<(), sqlx::Error> {
        todo!();
    }

    async fn update(&self, data: &actix_web::web::Data<crate::AppState>) -> Result<(), sqlx::Error> {
        todo!()
    }
}

impl TimeReport {

    pub fn default(crm_uuid: Uuid, employee_uuid: Uuid) -> Self {
        TimeReport { 
            crm_uuid, 
            uuid: Uuid::new_v4(), 
            employee_uuid, 
            date: None, 
            start_time: None, 
            end_time: None, 
            breaks: None, 
            note: None, 
            work_tasks: None, 
            added: Utc::now(), 
            updated: Utc::now() 
        }
    }



}