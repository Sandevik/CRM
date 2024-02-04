use actix_web::web;
use chrono::{DateTime, Utc, Datelike, NaiveDate, NaiveDateTime};
use serde::{Serialize, Deserialize};
use sqlx::{mysql::MySqlRow, Row};
use uuid::Uuid;

use crate::{AppState, routes::{MeetingsOption, Limit}};

use super::Model;

#[derive(Serialize, Deserialize, Clone)]

pub struct Meeting {
    pub uuid: Uuid,
    #[serde(rename(serialize = "clientUuid", deserialize = "clientUuid"))]
    pub client_uuid: Uuid,
    #[serde(rename(serialize = "entryId", deserialize = "entryId"))]
    pub entry_id: Option<i32>,
    pub from: NaiveDateTime,
    pub to: NaiveDateTime,
    pub added: DateTime<Utc>,
    pub updated: DateTime<Utc>,
}

impl Model for Meeting {
    fn from_row(row: &MySqlRow) -> Self {
        Meeting {
            uuid: Uuid::parse_str(row.get("uuid")).unwrap_or_default(),
            client_uuid: Uuid::parse_str(row.get("client_uuid")).unwrap_or_default(),
            from: row.get("from"),
            to: row.get("to"),
            added: row.get("added"),
            updated: row.get("updated"),
            entry_id: row.get("entry_id"),
        }
    }
}

impl Meeting {

    pub async fn get_all(crm_uuid: &Uuid, meeting_option: MeetingsOption, limit: Limit, data: &web::Data<AppState>) -> Result<Vec<Self>, sqlx::Error> {
        let mut meetings: Vec<Meeting> = Vec::new();
        let mut query = format!("SELECT * FROM `crm`.`{}-meetings` ", crm_uuid.hyphenated().to_string());
        match meeting_option {
            MeetingsOption::All => (),
            MeetingsOption::Future => query.push_str("WHERE `from` >= ? ORDER BY `from` ASC"),
            MeetingsOption::Past => query.push_str("WHERE `to` <= ? ORDER BY `from` DESC"),
            MeetingsOption::ThisMonth => {
                let year = Utc::now().year();
                let month = Utc::now().month();
                let days = get_days_from_month(year, month);
                let mut start_date: String = NaiveDate::from_ymd_opt(year, month, 1).unwrap().to_string();
                start_date.push_str("T00:00:00Z");
                let mut end_date = NaiveDate::from_ymd_opt(year, month, days as u32).unwrap().to_string();
                end_date.push_str("T23:59:59Z");
                query.push_str(format!(r#"WHERE `from` >= "{start_date}" AND `to` <= "{end_date}""#).as_str())
            },
            MeetingsOption::ByYearAndMonth((year, month)) => {
                let days = get_days_from_month(year, month.into());
                let mut start_date: String = NaiveDate::from_ymd_opt(year, month.into(), 1).unwrap().to_string();
                start_date.push_str("T00:00:00Z");
                let mut end_date = NaiveDate::from_ymd_opt(year, month.into(), days as u32).unwrap().to_string();
                end_date.push_str("T23:59:59Z");
                query.push_str(format!(r#"WHERE `from` >= "{start_date}" AND `to` <= "{end_date}""#).as_str())
            }
        }

        match limit {
            Limit::None => (),
            Limit::Some(limit) => query.push_str(format!(" LIMIT {}", limit).as_str()),
        }

        let res = sqlx::query(&query)
            .bind(Utc::now())
            .fetch_all(&data.pool)
            .await;

        match res {
            Err(err) => println!("{err}"),
            Ok(rows) => {
                rows.iter().for_each(|row| {
                    meetings.push(Meeting::from_row(row));
                });
            }
        }
        Ok(meetings)
    }

    pub fn new(from: NaiveDateTime, to: NaiveDateTime, client_uuid: &Uuid) -> Self {
        Meeting {
            uuid: Uuid::new_v4(),
            from,
            to,
            client_uuid: client_uuid.clone(),
            added: Utc::now(),
            updated: Utc::now(),
            entry_id: None,
        }
    }

    pub async fn insert(&self, data: &web::Data<AppState>, crm_uuid: &Uuid) -> Result<(), sqlx::Error> {
        let query = format!("INSERT INTO `crm`.`{}-meetings` (`uuid`, `client_uuid`, `from`, `to`, `added`, `updated`, `entry_id`) VALUES (?,?,?,?,?,?,?)", crm_uuid.hyphenated().to_string());
        match sqlx::query(&query)
            .bind(&self.uuid.hyphenated().to_string())
            .bind(&self.client_uuid.hyphenated().to_string())
            .bind(&self.from)
            .bind(&self.to)
            .bind(&self.added)
            .bind(&self.updated)
            .bind(&self.entry_id)
            .execute(&data.pool)
            .await {
                Err(err) => Err(err),
                Ok(_) => Ok(())
            }
    }

    pub async fn get_by_uuid(uuid: &Uuid, crm_uuid: &Uuid, data: &web::Data<AppState>) -> Result<Option<Meeting>, sqlx::Error> {
        let query = format!("SELECT * FROM `crm`.`{}-meetings` WHERE `uuid` = ?", crm_uuid.hyphenated().to_string());
        match sqlx::query(&query)
            .bind(uuid.hyphenated().to_string())
            .fetch_optional(&data.pool)
            .await {
                Err(err) => Err(err),
                Ok(opt_row) => {
                    match opt_row {
                        None => Ok(None),
                        Some(row) => Ok(Some(Self::from_row(&row)))
                    }
                }
            }
    }

    pub async fn delete_by_uuid(uuid: &Uuid, crm_uuid: &Uuid, data: &web::Data<AppState>) -> Result<(), sqlx::Error> {
        let query = format!("DELETE FROM `crm`.`{}-meetings` WHERE `uuid` = ?", crm_uuid.hyphenated().to_string());
        match sqlx::query(&query)
            .bind(uuid.hyphenated().to_string())
            .execute(&data.pool)
            .await {
                Err(err) => Err(err),
                Ok(_) => Ok(())
            }
    }

    pub async fn delete_all_by_user_uuid(client_uuid: &Uuid, crm_uuid: &Uuid, data: &web::Data<AppState>) -> Result<(), sqlx::Error> {
        let query = format!("DELETE FROM `crm`.`{}-meetings` WHERE `client_uuid` = ?", crm_uuid.hyphenated().to_string());
        match sqlx::query(&query)
            .bind(client_uuid.hyphenated().to_string())
            .execute(&data.pool)
            .await {
                Err(err) => Err(err),
                Ok(_) => Ok(())
            }
    }


}


pub fn get_days_from_month(year: i32, month: u32) -> i64 {
    NaiveDate::from_ymd_opt(
        match month {
            12 => year + 1,
            _ => year,
        },
        match month {
            12 => 1,
            _ => month + 1,
        },
        1,
    ).unwrap()
    .signed_duration_since(NaiveDate::from_ymd_opt(year, month, 1).unwrap())
    .num_days()
}