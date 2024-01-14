use chrono::{DateTime, Utc};
use serde::{Serialize, Deserialize};
use sqlx::{mysql::MySqlRow, Row};
use uuid::Uuid;

use super::Model;

#[derive(Serialize, Deserialize)]

pub struct Meeting {
    #[serde(rename(serialize = "customerUuid", deserialize = "customerUuid"))]
    pub customer_uuid: Uuid,
    #[serde(rename(serialize = "entryId", deserialize = "entryId"))]
    pub entry_id: i32,
    pub from: DateTime<Utc>,
    pub to: DateTime<Utc>,
    pub added: DateTime<Utc>,
    pub updated: DateTime<Utc>,
}

impl Model for Meeting {
    fn from_row(row: &MySqlRow) -> Self {
        Meeting {
            customer_uuid: Uuid::parse_str(row.get("customer_uuid")).unwrap_or_default(),
            from: row.get("from"),
            to: row.get("to"),
            added: row.get("added"),
            updated: row.get("updated"),
            entry_id: row.get("entry_id"),
        }
    }
}

impl Meeting {

}