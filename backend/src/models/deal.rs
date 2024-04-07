use chrono::{DateTime, Utc};
use serde::{Serialize, Deserialize};
use sqlx::{mysql::MySqlRow, Row};
use uuid::Uuid;

use super::Model;

#[derive(Serialize, Deserialize)]

pub struct Deal {
    #[serde(rename(serialize = "crmUuid", deserialize = "crmUuid"))]
    pub crm_uuid: Uuid,
    pub uuid: Uuid,
    #[serde(rename(serialize = "addedBy", deserialize = "addedBy"))]
    pub added_by: Uuid,
    pub title: Option<String>,
    pub product: Option<String>,
    pub stage: Option<String>,
    pub status: Option<String>,
    pub note: Option<String>,
    pub added: DateTime<Utc>,
    pub updated: DateTime<Utc>,
}

impl Model for Deal {
    fn from_row(row: &MySqlRow) -> Self {
        Deal {
            crm_uuid: Uuid::parse_str(row.get("crm_uuid")).unwrap_or_default(),
            uuid: Uuid::parse_str(row.get("uuid")).unwrap_or_default(),
            added_by: Uuid::parse_str(row.get("added_by")).unwrap_or_default(),
            title: row.get("title"),
            product: row.get("product"),
            stage: row.get("stage"),
            status: row.get("status"),
            note: row.get("note"),
            added: row.get("added"),
            updated: row.get("updated"),
        }
    }

    async fn insert(&self, data: &actix_web::web::Data<crate::AppState>) -> Result<(), sqlx::Error> {
        todo!();
    }

    async fn update(&self, data: &actix_web::web::Data<crate::AppState>) -> Result<(), sqlx::Error> {
        todo!();
    }
}

impl Deal {
    
}