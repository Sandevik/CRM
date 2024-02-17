use actix_web::web;
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::Row;
use uuid::Uuid;

use crate::AppState;

use super::Model;

#[derive(Serialize, Deserialize)]
pub enum TaskStatus {
    Completed, 
    Ongoing,
    Unknown,
}

impl TaskStatus {
    pub fn to_string(&self) -> String {
        match self {
            TaskStatus::Completed => "completed".to_string(),
            TaskStatus::Ongoing => "ongoing".to_string(),
            TaskStatus::Unknown => "unknown".to_string()
        }
    }
    pub fn from_string(string: &str) -> Self {
        match string {
            "completed" => TaskStatus::Completed,
            "ongoing" => TaskStatus::Ongoing,
            _ => TaskStatus::Unknown
        }
    }
}

#[derive(Serialize, Deserialize)]
pub struct Task {
    pub uuid: Uuid,
    #[serde(rename(deserialize = "crmUuid", serialize = "crmUuid"))]
    pub crm_uuid: Uuid,
    pub deadline: Option<DateTime<Utc>>,
    pub status: Option<TaskStatus>,
    #[serde(rename(deserialize = "clientUuid", serialize = "clientUuid"))]
    pub client_uuid: Option<Uuid>,
    pub title: Option<String>,
    pub added: DateTime<Utc>,
    pub updated: DateTime<Utc>,
    pub percentage: Option<i32>
}

impl Model for Task {
    fn from_row(row: &sqlx::mysql::MySqlRow) -> Self {
        Task {
            uuid: Uuid::parse_str(row.get("uuid")).unwrap_or_default(),
            crm_uuid: Uuid::parse_str(row.get("crm_uuid")).unwrap_or_default(),
            client_uuid: match Uuid::parse_str(row.get("client_uuid")) {Err(_) => None, Ok(uuid) => Some(uuid)},
            deadline: row.get("deadline"),
            title: row.get("title"),
            status: match row.get("status") {None => None, Some(status_str) => Some(TaskStatus::from_string(status_str))},
            added: row.get("added"),
            updated: row.get("updated"),
            percentage: row.get("percentage")
        }
    }
}

impl Task {

    pub fn default() -> Self {
        Task {
            uuid: Uuid::new_v4(),
            crm_uuid: Uuid::new_v4(),
            client_uuid: None,
            deadline: None,
            status: None,
            title: None,
            added: Utc::now(),
            updated: Utc::now(),
            percentage: None
        }
    }


    pub async fn insert(&self, data: &web::Data<AppState>) -> Result<(), sqlx::Error> {
        match sqlx::query("INSERT INTO `crm` . `tasks` (`uuid`, `crm_uuid`, `client_uuid`, `deadline`, `status`, `title`, `added`, `updated`) VALUES (?,?,?,?,?,?,?,?)")
            .bind(&self.uuid.hyphenated().to_string())
            .bind(&self.crm_uuid.hyphenated().to_string())
            .bind(match &self.client_uuid { None => None, Some(uuid) => Some(uuid.hyphenated().to_string())})
            .bind(&self.deadline)
            .bind(match &self.status {None => None, Some(status) => Some(status.to_string())})
            .bind(&self.title)
            .bind(&self.added)
            .bind(&self.updated)
            .execute(&data.pool)
            .await {
                Err(err) => Err(err),
                Ok(_) => Ok(())
            }
    }

    pub async fn get_by_client_uuid(client_uuid: &Uuid, crm_uuid: &Uuid, data: &web::Data<AppState>) -> Result<Vec<Self>, sqlx::Error> {
        match sqlx::query("SELECT *, FLOOR((((UNIX_TIMESTAMP(NOW()) - UNIX_TIMESTAMP(`added`)) / (UNIX_TIMESTAMP(`deadline`) - UNIX_TIMESTAMP(`added`))) * 100)) as percentage FROM `crm` . `tasks` WHERE `crm_uuid` = ? AND `client_uuid` = ? ORDER BY ISNULL(`percentage`), `percentage` DESC")
            .bind(crm_uuid.hyphenated().to_string())
            .bind(client_uuid.hyphenated().to_string())
            .fetch_all(&data.pool)
            .await {
                Err(err) => Err(err),
                Ok(rows) =>  Ok(rows.iter().map(|row| Self::from_row(row)).collect())
            }
    }

}