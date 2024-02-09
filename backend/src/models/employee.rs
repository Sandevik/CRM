use chrono::{DateTime, Utc};
use serde::{Serialize, Deserialize};
use sqlx::{mysql::MySqlRow, Row};
use uuid::Uuid;

use super::Model;

#[derive(Serialize, Deserialize)]

pub struct Employee {
    #[serde(rename(serialize = "crmUuid", deserialize = "crmUuid"))]
    pub crm_uuid: Uuid,
    pub uuid: Uuid,
    #[serde(rename(serialize = "userUuid", deserialize = "userUuid"))]
    pub user_uuid: Uuid,
    #[serde(rename(serialize = "socSec", deserialize = "socSec"))]
    pub soc_sec: Uuid,
    #[serde(rename(serialize = "dateOfBirth", deserialize = "dateOfBirth"))]
    pub date_of_birth: Option<DateTime<Utc>>,
    #[serde(rename(serialize = "accessLevel", deserialize = "accessLevel"))]
    pub access_level: Option<String>,
    #[serde(rename(serialize = "employmentType", deserialize = "employmentType"))]
    pub employment_type: Option<String>,
    pub salary: f32,
    pub added: DateTime<Utc>,
    pub updated: DateTime<Utc>,
}

impl Model for Employee {
    fn from_row(row: &MySqlRow) -> Self {
        Employee {
            crm_uuid: Uuid::parse_str(row.get("crm_uuid")).unwrap_or_default(), 
            uuid: Uuid::parse_str(row.get("uuid")).unwrap_or_default(),
            user_uuid: Uuid::parse_str(row.get("user_uuid")).unwrap_or_default(),
            soc_sec: row.get("soc_sec"),
            date_of_birth: row.get("date_of_birth"),
            access_level: row.get("access_level"),
            employment_type: row.get("employment_type"),
            salary: row.get("salary"),
            added: row.get("added"),
            updated: row.get("updated"),
        }
    }
}

impl Employee {

}