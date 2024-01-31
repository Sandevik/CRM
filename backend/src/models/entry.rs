use actix_web::web;
use chrono::{DateTime, Utc};
use serde::{Serialize, Deserialize};
use sqlx::{mysql::MySqlRow, Row};
use uuid::Uuid;

use crate::AppState;

use super::Model;

#[derive(Serialize, Deserialize)]

pub struct Entry {
    pub id: i32,
    #[serde(rename(serialize = "clientUuid", deserialize = "clientUuid"))]
    pub client_uuid: Uuid,
    #[serde(rename(serialize = "addedAtMeeting", deserialize = "addedAtMeeting"))]
    pub added_at_meeting: Option<Uuid>,
    pub content: Option<String>,
    pub added: Option<DateTime<Utc>>,
    pub updated: Option<DateTime<Utc>>,
}

impl Model for Entry {
    fn from_row(row: &MySqlRow) -> Self {
        Entry {
            id: row.get("id"),
            client_uuid: Uuid::parse_str(row.get("client_uuid")).unwrap_or_default(),
            added_at_meeting: match row.get("added_at_meeting") {None => None, Some(uuid) => Some(Uuid::parse_str(uuid).unwrap_or_default())},
            content: row.get("content"),
            added: row.get("added"),
            updated: row.get("updated"),
        }
    }
}

impl Entry {
    pub fn new(content: &str, client_uuid: Uuid, added_at_meeting: Option<Uuid>) -> Self {
        Entry {
            id: -1,
            content: Some(content.to_string()),
            client_uuid,
            added_at_meeting,
            added: Some(Utc::now()),
            updated: Some(Utc::now())
        }
    }

    pub async fn insert(&self, crm_uuid: Uuid, data: &web::Data<AppState>) -> Result<(), sqlx::Error> {
        let query = format!("INSERT INTO `crm`.`{}-entries` (`client_uuid`, `added`, `added_at_meeting`, `updated`, `content`) VALUES (?,?,?,?,?)", crm_uuid.hyphenated().to_string());
        match sqlx::query(&query)
            .bind(&self.client_uuid.hyphenated().to_string())
            .bind(&self.added)
            .bind(&self.added_at_meeting)
            .bind(&self.updated)
            .bind(&self.content)
            .execute(&data.pool)
            .await {
                Err(err) => Err(err),
                Ok(_) => Ok(())
            } 
    }

    pub async fn update(&self, crm_uuid: Uuid, data: &web::Data<AppState>) -> Result<(), sqlx::Error> {
        match sqlx::query(&format!("UPDATE `crm`.`{}-entries` SET `content` = ?, `added_at_meeting` = ?, `updated` = ? WHERE `client_uuid` = ?", crm_uuid.hyphenated().to_string()))
            .bind(&self.content)
            .bind(&self.added_at_meeting)
            .bind(Utc::now())
            .bind(&self.client_uuid.hyphenated().to_string())
            .execute(&data.pool)
            .await {
                Err(err) => Err(err),
                Ok(_) => Ok(())
            }
    }

    pub async fn get_all_by_client_uuid(crm_uuid: &Uuid, client_uuid: &Uuid, data: &web::Data<AppState>) -> Result<Vec<Self>, sqlx::Error> {
        match sqlx::query(&format!("SELECT * FROM `crm`.`{}-entries` WHERE `client_uuid` = ? ORDER BY `added` DESC", crm_uuid.hyphenated().to_string()))
            .bind(client_uuid.hyphenated().to_string())
            .fetch_all(&data.pool)
            .await {
                Err(err) => Err(err),
                Ok(rows) => {
                    return Ok(rows.iter().map(|row| Self::from_row(row)).collect::<Vec<Entry>>());
                }
            }
    }



}