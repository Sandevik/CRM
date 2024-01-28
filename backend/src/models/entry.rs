use chrono::{DateTime, Utc};
use serde::{Serialize, Deserialize};
use sqlx::{mysql::MySqlRow, Row};
use uuid::Uuid;

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
            client_uuid: row.get("client_uuid"),
            added_at_meeting: match row.get("added_at_meeting") {None => None, Some(uuid) => Some(Uuid::parse_str(uuid).unwrap_or_default())},
            content: row.get("content"),
            added: row.get("added"),
            updated: row.get("updated"),
        }
    }
}

impl Entry {

}