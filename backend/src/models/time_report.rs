use actix_web::web;
use chrono::{DateTime, Datelike, Days, NaiveDate, Offset, Utc, Weekday};

use serde::{Deserialize, Serialize};
use sqlx::{MySql, Pool, Row};
use uuid::Uuid;

use crate::{controllers::database::Database, AppState};

use super::{Model, _break::Break};

#[derive(Serialize, Deserialize)]
pub struct TimeReport {
    #[serde(rename(serialize = "crmUuid", deserialize = "crmUuid"))]
    pub crm_uuid: Uuid,
    pub uuid: Uuid,
    #[serde(rename(serialize = "employeeUuid", deserialize = "employeeUuid"))]
    pub employee_uuid: Uuid,
    #[serde(rename(serialize = "scheduleDate", deserialize = "scheduleDate"))]
    pub schedule_date: NaiveDate,
    #[serde(rename(serialize = "startDateTime", deserialize = "startDateTime"))]
    pub start_date_time: Option<DateTime<Utc>>,
    #[serde(rename(serialize = "endDateTime", deserialize = "endDateTime"))]
    pub end_date_time: Option<DateTime<Utc>>,
    pub note: Option<String>,
    #[serde(rename(serialize = "workTasks", deserialize = "workTasks"))]
    pub work_tasks: Option<Uuid>,
    pub added: DateTime<Utc>,
    pub updated: DateTime<Utc>,

    pub breaks: Option<Vec<Break>>,
}

impl Model for TimeReport {

    fn sql_row_arrays() -> Vec<[&'static str; 2]> {
        vec![
            ["crm_uuid", "VARCHAR(36) NOT NULL"],
            ["uuid", "VARCHAR(36) NOT NULL PRIMARY KEY UNIQUE"],
            ["employee_uuid", "VARCHAR(36) NOT NULL"],
            ["schedule_date", "DATE NOT NULL"],
            ["start_date_time", "DATETIME"],
            ["end_date_time", "DATETIME"],
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
            crm_uuid: Uuid::parse_str(row.get("crm_uuid")).expect("ERROR: Could not parse crm_uuid @ time_report.rs"),
            uuid: Uuid::parse_str(row.get("uuid")).expect("ERROR: Could not parse uuid @ time_report.rs"),
            employee_uuid: Uuid::parse_str(row.get("employee_uuid")).expect("ERROR: Could not parse employee_uuid @ time_report.rs"),
            schedule_date: row.get("schedule_date"),
            start_date_time: row.get("start_date_time"),
            end_date_time: row.get("end_date_time"),
            note: row.get("note"),
            work_tasks: row.get("work_tasks"),
            added: row.get("added"),
            updated: row.get("updated"),

            breaks: None,
        }
    }

    async fn insert(&self, data: &actix_web::web::Data<crate::AppState>) -> Result<(), sqlx::Error> {
        match sqlx::query("INSERT INTO `crm` . `time_reports` (crm_uuid, uuid, employee_uuid, schedule_date, start_date_time, end_date_time, note, work_tasks, added, updated) VALUES (?,?,?,?,?,?,?,?,?,?)")
        .bind(&self.crm_uuid.hyphenated().to_string())
        .bind(&self.uuid.hyphenated().to_string())
        .bind(&self.employee_uuid.hyphenated().to_string())
        .bind(&self.schedule_date)
        .bind(&self.start_date_time)
        .bind(&self.end_date_time)
        .bind(&self.note)
        .bind(&self.work_tasks)
        .bind(Utc::now())
        .bind(Utc::now())
        .execute(&data.pool)
        .await {
            Err(err) => Err(err), 
            Ok(_) => Ok(())
        }
    }

    async fn update(&self, data: &actix_web::web::Data<crate::AppState>) -> Result<(), sqlx::Error> {
        match sqlx::query("INSERT INTO `crm` . `time_reports` SET employee_uuid = ?, schedule_date = ?, start_date_time = ?, end_date_time = ?, note = ?, work_tasks = ?, updated = ?) WHERE crm_uuid = ? AND uuid = ?")
        .bind(&self.employee_uuid.hyphenated().to_string())
        .bind(&self.schedule_date)
        .bind(&self.start_date_time)
        .bind(&self.end_date_time)
        .bind(&self.note)
        .bind(&self.work_tasks)
        .bind(Utc::now())
        .bind(&self.crm_uuid.hyphenated().to_string())
        .bind(&self.uuid.hyphenated().to_string())
        .execute(&data.pool)
        .await {
            Err(err) => Err(err), 
            Ok(_) => Ok(())
        }
    }
}

impl TimeReport {

    /// Gets all time reports for a specified week and year from an employee
    ///
    /// # Errors
    ///
    /// Returns `sqlx::Error` 
    pub async fn get_all_by_week_and_year(crm_uuid: &Uuid, employee_uuid: &Uuid, week: u32, year: i32, data: &web::Data<AppState>) -> Result<Vec<Self>, sqlx::Error> {
        let (mon, sun) = week_bounds(week, year);
        match sqlx::query("SELECT * FROM `crm` . `time_reports` WHERE `employee_uuid` = ? AND `crm_uuid` = ? AND `schedule_date` >= ? AND `schedule_date` <= ? ORDER BY `schedule_date`")
        .bind(employee_uuid.hyphenated().to_string())
        .bind(crm_uuid.hyphenated().to_string())
        .bind(mon)
        .bind(sun)
        .fetch_all(&data.pool)
        .await {
            Err(err) => Err(err),
            Ok(rows) => { 
                let mut reports = rows.iter().map(|row| Self::from_row(row)).collect::<Vec<Self>>();
                for i in 0..7 {
                    let current_date = mon.checked_add_days(Days::new(i)).unwrap();
                    if let None = reports.iter().find(|day| day.schedule_date == current_date) {
                        let new_time_report: TimeReport = TimeReport {
                            crm_uuid: crm_uuid.clone(),
                            employee_uuid: employee_uuid.clone(),
                            schedule_date: current_date,  
                            ..Self::default()
                        };
                        reports.push(new_time_report);
                    }
                }
                reports.sort_by(|a, b| a.schedule_date.cmp(&b.schedule_date));
                for i in 0..reports.len() {
                    let _ = reports[i].get_breaks(data).await;
                }
                Ok(reports)
            }
        }
    }

    /* pub fn get_all_by_month(crm_uuid: &Uuid, employee_uuid: &Uuid) -> Result<Vec<Self>, sqlx::Error> {

    } */







    pub fn default() -> Self {
        TimeReport { 
            crm_uuid: Uuid::new_v4(), 
            uuid: Uuid::new_v4(), 
            employee_uuid: Uuid::new_v4(), 
            schedule_date: Utc::now().date_naive(),
            start_date_time: None, 
            end_date_time: None, 
            note: None, 
            work_tasks: None, 
            added: Utc::now(), 
            updated: Utc::now(),

            breaks: None,
        }
    }

    pub async fn get_breaks(&mut self, data: &web::Data<AppState>) -> Result<(), sqlx::Error> {
        let res = Break::get_all_by_time_report_uuid(&self.uuid, data).await;
        if let Err(err) = res {
            return Err(err);
        } else {
            self.breaks = Some(res.unwrap());
        }
        Ok(())
    } 

}


fn week_bounds(week: u32, year: i32) -> (NaiveDate, NaiveDate) {
    let mon = NaiveDate::from_isoywd_opt(year, week, Weekday::Mon).expect(&format!("Could not get monday of week {week}"));
    let sun = NaiveDate::from_isoywd_opt(year, week, Weekday::Sun).expect(&format!("Could not get monday of week {week}"));
    (mon, sun)
}