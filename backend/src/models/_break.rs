use chrono::{DateTime, NaiveTime, Utc};
use sqlx::Row;
use uuid::Uuid;

use super::Model;

struct Break {
    breaks_uuid: Uuid,
    start_time: NaiveTime,
    end_time: NaiveTime,
    added: DateTime<Utc>,
    updated: DateTime<Utc>
}

impl Model for Break {
    fn from_row(row: &sqlx::mysql::MySqlRow) -> Self {
        Break {
            breaks_uuid: Uuid::parse_str(row.get("break_uuid")).unwrap_or_default(),
            start_time: row.get("start_time"),
            end_time: row.get("end_time"),
            added: row.get("added"),
            updated: row.get("updated"),
        }
    }
}