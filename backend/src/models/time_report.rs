use chrono::{DateTime, NaiveTime, Utc};
use sqlx::Row;
use uuid::Uuid;

use super::Model;

struct TimeReport {
    crm_uuid: Uuid,
    uuid: Uuid,
    employee_uuid: Uuid,
    date: Option<DateTime<Utc>>,
    start_time: Option<NaiveTime>,
    end_time: Option<NaiveTime>,
    breaks: Option<Uuid>,
    note: Option<String>,
    work_tasks: Option<Uuid>,
    added: DateTime<Utc>,
    updated: DateTime<Utc>
}

impl Model for TimeReport {
    fn from_row(row: &sqlx::mysql::MySqlRow) -> Self {
        TimeReport {
            crm_uuid: Uuid::parse_str(row.get("crm_uuid")).unwrap_or_default(),
            uuid: Uuid::parse_str(row.get("uuid")).unwrap_or_default(),
            employee_uuid: Uuid::parse_str(row.get("employee_uuid")).unwrap_or_default(),
            date: row.get("date"),
            start_time: row.get("start_time"),
            end_time: row.get("end_time"),
            breaks: row.get("breaks"),
            note: row.get("note"),
            work_tasks: row.get("work_tasks"),
            added: row.get("added"),
            updated: row.get("updated"),
        }
    }
}