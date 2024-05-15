use actix_web::web;
use chrono::{DateTime, NaiveDate, NaiveTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::{MySql, Pool, Row};
use uuid::Uuid;

use crate::{controllers::database::Database, AppState};

use super::{time_report::TimeReport, Model};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Break {
    #[serde(rename(serialize = "crmUuid", deserialize = "crmUuid"))]
    pub crm_uuid: Uuid,
    #[serde(rename(serialize = "timeReportUuid", deserialize = "timeReportUuid"))]
    pub time_report_uuid: Uuid,
    #[serde(rename(serialize = "employeeUuid", deserialize = "employeeUuid"))]
    pub employee_uuid: Uuid,
    #[serde(rename(serialize = "breakUuid", deserialize = "breakUuid"))]
    pub break_uuid: Uuid,
    #[serde(rename(serialize = "startDateTime", deserialize = "startDateTime"))]
    pub start_date_time: DateTime<Utc>,
    #[serde(rename(serialize = "endDateTime", deserialize = "endDateTime"))]
    pub end_date_time: DateTime<Utc>,
    #[serde(rename(serialize = "scheduleDate", deserialize = "scheduleDate"))]
    pub schedule_date: NaiveDate,
    pub note: Option<String>,
    pub added: DateTime<Utc>,
    pub updated: DateTime<Utc>
}

impl Model for Break {

    fn sql_row_arrays() -> Vec<[&'static str; 2]> {
        vec![
        ["crm_uuid", "VARCHAR(36) NOT NULL"],
        ["time_report_uuid", "VARCHAR(36) NOT NULL"],
        ["employee_uuid", "VARCHAR(36) NOT NULL"],
        ["break_uuid", "VARCHAR(36) NOT NULL PRIMARY KEY"],
        ["start_date_time", "DATETIME"],
        ["end_date_time", "DATETIME"],
        ["schedule_date", "DATE NOT NULL"],
        ["note", "TEXT"],
        ["added", "DATETIME"],
        ["updated", "DATETIME"]
        ]
    }

    async fn create_table(pool: &Pool<MySql>) -> Result<(), sqlx::Error> {
        Database::create_table(Self::sql_row_arrays(), "breaks", None, pool).await
    }

    async fn alter_table(pool: &Pool<MySql>) -> Result<(), sqlx::Error> {
        Database::alter_table(Self::sql_row_arrays(), "breaks", pool).await
    }
   
    async fn migrate_table(pool: &Pool<MySql>) -> Result<(), sqlx::Error> {
        Database::migrate_table(Self::sql_row_arrays(), "breaks", None, pool).await
    }

    fn from_row(row: &sqlx::mysql::MySqlRow) -> Self {
        Break {
            crm_uuid: Uuid::parse_str(row.get("crm_uuid")).expect("ERROR: Could not parse crm_uuid from breaks table"),
            time_report_uuid: Uuid::parse_str(row.get("time_report_uuid")).expect("ERROR: Could not parse time_report_uuid from breaks table"),
            employee_uuid: Uuid::parse_str(row.get("employee_uuid")).expect("ERROR: Could not parse employee_uuid from breaks table"),
            break_uuid: Uuid::parse_str(row.get("break_uuid")).expect("ERROR: Could not parse break_uuid from breaks table"),
            schedule_date: row.get("schedule_date"),
            start_date_time: row.get("start_date_time"),
            end_date_time: row.get("end_date_time"),
            note: row.get("note"),
            added: row.get("added"),
            updated: row.get("updated"),
        }
    }

    async fn insert(&self, data: &actix_web::web::Data<crate::AppState>) -> Result<(), sqlx::Error> {
        // create time report if it does not exist
        let row = sqlx::query("SELECT `uuid` FROM `crm`.`time_reports` WHERE `uuid` = ?")
        .bind(&self.time_report_uuid.hyphenated().to_string())
        .fetch_optional(&data.pool).await;
        if row.is_err() || (row.is_ok() && row.unwrap().is_none()) {
            if let Err(err) = (TimeReport {
                crm_uuid: self.crm_uuid.clone(),
                employee_uuid: self.employee_uuid.clone(),
                uuid: self.time_report_uuid.clone(),
                schedule_date: self.schedule_date.clone(),

                ..TimeReport::default()
            }).insert(data).await {
                return Err(err);
            }
        }
        
        // create break in time_report
        match sqlx::query("INSERT INTO `crm` . `breaks` (crm_uuid, time_report_uuid, break_uuid, start_date_time, end_date_time, schedule_date, employee_uuid, note, added, updated) VALUE (?,?,?,?,?,?,?,?,?,?)")
        .bind(&self.crm_uuid.hyphenated().to_string())
        .bind(&self.time_report_uuid.hyphenated().to_string())
        .bind(Uuid::new_v4().hyphenated().to_string())
        .bind(&self.start_date_time)
        .bind(&self.end_date_time)
        .bind(&self.schedule_date)
        .bind(&self.employee_uuid.hyphenated().to_string())
        .bind(&self.note)
        .bind(&self.added)
        .bind(&self.updated)
        .execute(&data.pool)
        .await {
            Err(err) => Err(err),
            Ok(_) => Ok(())
        }
    }

    async fn update(&self, data: &actix_web::web::Data<crate::AppState>) -> Result<(), sqlx::Error> {
        match sqlx::query("UPDATE `crm` . `breaks` SET start_date_time = ?, end_date_time = ?, note = ?, updated = ? WHERE `break_uuid` = ? AND `crm_uuid` = ? AND `time_report_uuid` = ?")
        .bind(&self.start_date_time)
        .bind(&self.end_date_time)
        .bind(&self.note)
        .bind(Utc::now())
        .bind(&self.break_uuid.hyphenated().to_string())
        .bind(&self.crm_uuid.hyphenated().to_string())
        .bind(&self.time_report_uuid.hyphenated().to_string())
        .execute(&data.pool)
        .await {
            Err(err) => Err(err),
            Ok(_) => Ok(())
        }
    }
}

impl Break {

    pub async fn get_all_by_time_report_uuid(time_report_uuid: &Uuid, data: &web::Data<AppState>) -> Result<Vec<Self>, sqlx::Error> {
        match sqlx::query("SELECT * FROM `crm` . `breaks` WHERE `time_report_uuid` = ? ORDER BY `start_date_time`")
        .bind(time_report_uuid.hyphenated().to_string())
        .fetch_all(&data.pool)
        .await {
            Err(err) => Err(err),
            Ok(rows) => Ok(rows.iter().map(|row| Self::from_row(row)).collect::<Vec<Self>>())
        }
    }



    pub async fn delete_by_uuid(break_uuid: &Uuid, data: &web::Data<AppState>) -> Result<(), sqlx::Error> {
        match sqlx::query("DELETE FROM `crm` . `breaks` WHERE `break_uuid` = ?")
        .bind(break_uuid.hyphenated().to_string())
        .execute(&data.pool)
        .await {
            Err(err) => Err(err),
            Ok(_) => Ok(())
        }

    }
    pub async fn delete_by_time_report_uuid(time_report_uuid: &Uuid, data: &web::Data<AppState>) -> Result<(), sqlx::Error> {
        match sqlx::query("DELETE FROM `crm` . `breaks` WHERE `time_report_uuid` = ?")
        .bind(time_report_uuid.hyphenated().to_string())
        .execute(&data.pool)
        .await {
            Err(err) => Err(err),
            Ok(_) => Ok(())
        }

    }

    

    pub fn default() -> Self {
        Self {
            crm_uuid: Uuid::new_v4(),
            time_report_uuid: Uuid::new_v4(),
            employee_uuid: Uuid::new_v4(),
            break_uuid: Uuid::new_v4(),
            start_date_time: Utc::now(),
            end_date_time: Utc::now(),
            schedule_date: Utc::now().date_naive(),
            note: None,
            added: Utc::now(),
            updated: Utc::now(),
        }
    }

}