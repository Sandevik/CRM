use chrono::{DateTime, NaiveTime, Utc};
use sqlx::{MySql, Pool, Row};
use uuid::Uuid;

use crate::controllers::database::Database;

use super::Model;

pub struct Break {
    pub breaks_uuid: Uuid,
    pub start_time: NaiveTime,
    pub end_time: NaiveTime,
    pub added: DateTime<Utc>,
    pub updated: DateTime<Utc>
}

impl Model for Break {

    fn sql_row_arrays() -> Vec<[&'static str; 2]> {
        vec![
        ["break_uuid", "VARCHAR(36) NOT NULL PRIMARY KEY"],
        ["start_time", "TIME"],
        ["end_time", "TIME"],
        ["added", "DATETIME"],
        ["updated", "DATETIME"]
        ]
    }

    async fn create_table(pool: &Pool<MySql>) -> Result<(), sqlx::Error> {
        Database::create_table(Self::sql_row_arrays(), "breaks", None, pool).await
    }

    async fn alter_table(pool: &Pool<MySql>) -> Result<(), sqlx::Error> {
        Database::alter_table(Self::sql_row_arrays(), "breaks", pool).await
    }
   
    async fn migrate_table(pool: &Pool<MySql>) -> Result<(), sqlx::Error> {
        Database::migrate_table(Self::sql_row_arrays(), "breaks", None, pool).await
    }

    fn from_row(row: &sqlx::mysql::MySqlRow) -> Self {
        Break {
            breaks_uuid: Uuid::parse_str(row.get("break_uuid")).unwrap_or_default(),
            start_time: row.get("start_time"),
            end_time: row.get("end_time"),
            added: row.get("added"),
            updated: row.get("updated"),
        }
    }

    async fn insert(&self, data: &actix_web::web::Data<crate::AppState>) -> Result<(), sqlx::Error> {
        todo!()
    }

    async fn update(&self, data: &actix_web::web::Data<crate::AppState>) -> Result<(), sqlx::Error> {
        todo!();
    }
}