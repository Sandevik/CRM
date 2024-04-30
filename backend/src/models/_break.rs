use actix_web::web;
use chrono::{DateTime, NaiveTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::{MySql, Pool, Row};
use uuid::Uuid;

use crate::{controllers::database::Database, AppState};

use super::Model;

#[derive(Serialize, Deserialize)]
pub struct Break {
    #[serde(rename(serialize = "crmUuid", deserialize = "crmUuid"))]
    pub crm_uuid: Uuid,
    #[serde(rename(serialize = "timeReportUuid", deserialize = "timeReportUuid"))]
    pub time_report_uuid: Uuid,
    #[serde(rename(serialize = "breakUuid", deserialize = "breakUuid"))]
    pub break_uuid: Uuid,
    #[serde(rename(serialize = "startDateTime", deserialize = "startDateTime"))]
    pub start_date_time: NaiveTime,
    #[serde(rename(serialize = "endDateTime", deserialize = "endDateTime"))]
    pub end_date_time: NaiveTime,
    pub note: Option<String>,
    pub added: DateTime<Utc>,
    pub updated: DateTime<Utc>
}

impl Model for Break {

    fn sql_row_arrays() -> Vec<[&'static str; 2]> {
        vec![
        ["crm_uuid", "VARCHAR(36) NOT NULL"],
        ["time_report_uuid", "VARCHAR(36) NOT NULL"],
        ["break_uuid", "VARCHAR(36) NOT NULL PRIMARY KEY"],
        ["start_date_time", "TIME"],
        ["end_date_time", "TIME"],
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
            break_uuid: Uuid::parse_str(row.get("break_uuid")).expect("ERROR: Could not parse break_uuid from breaks table"),
            start_date_time: row.get("start_date_time"),
            end_date_time: row.get("end_date_time"),
            note: row.get("note"),
            added: row.get("added"),
            updated: row.get("updated"),
        }
    }

    async fn insert(&self, data: &actix_web::web::Data<crate::AppState>) -> Result<(), sqlx::Error> {
        match sqlx::query("INSERT INTO `crm` . `breaks` (crm_uuid, time_report_uuid, break_uuid, start_date_time, end_date_time, added, updated) VALUE (?,?,?,?,?,?,?)")
        .bind(&self.crm_uuid.hyphenated().to_string())
        .bind(&self.time_report_uuid.hyphenated().to_string())
        .bind(Uuid::new_v4())
        .bind(&self.start_date_time)
        .bind(&self.end_date_time)
        .bind(&self.added)
        .bind(&self.updated)
        .execute(&data.pool)
        .await {
            Err(err) => Err(err),
            Ok(_) => Ok(())
        }
    }

    async fn update(&self, data: &actix_web::web::Data<crate::AppState>) -> Result<(), sqlx::Error> {
        match sqlx::query("UPDATE `crm` . `breaks` SET time_report_uuid = ?, start_date_time = ?, end_date_time = ?, updated = ? WHERE `break_uuid` = ? AND `crm_uuid` = ?")
        .bind(&self.time_report_uuid.hyphenated().to_string())
        .bind(&self.start_date_time)
        .bind(&self.end_date_time)
        .bind(Utc::now())
        .bind(&self.break_uuid)
        .bind(&self.crm_uuid)
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



    pub async fn delete_by_uuid(time_report_uuid: &Uuid, data: &web::Data<AppState>) -> Result<(), sqlx::Error> {
        match sqlx::query("DELETE FROM `crm` . `breaks` WHERE `time_report_uuid` = ?")
        .bind(time_report_uuid.hyphenated().to_string())
        .execute(&data.pool)
        .await {
            Err(err) => Err(err),
            Ok(_) => Ok(())
        }

    }
}