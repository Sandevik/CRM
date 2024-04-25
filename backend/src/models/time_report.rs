use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::{MySql, Pool, Row};
use uuid::Uuid;

use crate::controllers::database::Database;

use super::Model;

#[derive(Serialize, Deserialize)]
pub struct TimeReport {
    #[serde(rename(serialize = "crmUuid", deserialize = "crmUuid"))]
    pub crm_uuid: Uuid,
    pub uuid: Uuid,
    #[serde(rename(serialize = "employeeUuid", deserialize = "employeeUuid"))]
    pub employee_uuid: Uuid,
    #[serde(rename(serialize = "startDateTime", deserialize = "startDateTime"))]
    pub start_date_time: Option<DateTime<Utc>>,
    #[serde(rename(serialize = "endDateTime", deserialize = "endDateTime"))]
    pub end_date_time: Option<DateTime<Utc>>,
    pub break_uuid: Option<Uuid>,
    pub note: Option<String>,
    #[serde(rename(serialize = "workTasks", deserialize = "workTasks"))]
    pub work_tasks: Option<Uuid>,
    pub added: DateTime<Utc>,
    pub updated: DateTime<Utc>
}

impl Model for TimeReport {

    fn sql_row_arrays() -> Vec<[&'static str; 2]> {
        vec![
            ["crm_uuid", "VARCHAR(36) NOT NULL"],
            ["uuid", "VARCHAR(36) NOT NULL PRIMARY KEY UNIQUE"],
            ["employee_uuid", "VARCHAR(36) NOT NULL"],
            ["start_date_time", "DATETIME"],
            ["end_date_time", "DATETIME"],
            ["break_uuid", "VARCHAR(36)"],
            ["note", "TEXT"],
            ["work_tasks", "VARCHAR(36)"],
            ["added", "DATETIME"],
            ["updated", "DATETIME"]
        ]
    }

    async fn create_table(pool: &Pool<MySql>) -> Result<(), sqlx::Error> {
        Database::create_table(Self::sql_row_arrays(), "time_reports", None, pool).await
    }

    async fn alter_table(pool: &Pool<MySql>) -> Result<(), sqlx::Error> {
        Database::alter_table(Self::sql_row_arrays(), "time_reports", pool).await
    }
   
    async fn migrate_table(pool: &Pool<MySql>) -> Result<(), sqlx::Error> {
        Database::migrate_table(Self::sql_row_arrays(), "time_reports", None, pool).await
    }

    fn from_row(row: &sqlx::mysql::MySqlRow) -> Self {
        TimeReport {
            crm_uuid: Uuid::parse_str(row.get("crm_uuid")).unwrap_or_default(),
            uuid: Uuid::parse_str(row.get("uuid")).unwrap_or_default(),
            employee_uuid: Uuid::parse_str(row.get("employee_uuid")).unwrap_or_default(),
            start_date_time: row.get("start_date_time"),
            end_date_time: row.get("end_date_time"),
            break_uuid: row.get("break_uuid"),
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
            start_date_time: None, 
            end_date_time: None, 
            break_uuid: None, 
            note: None, 
            work_tasks: None, 
            added: Utc::now(), 
            updated: Utc::now() 
        }
    }



}