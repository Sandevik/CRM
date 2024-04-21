use actix_web::web;
use chrono::{DateTime, Utc};
use serde::{Serialize, Deserialize};
use sqlx::{mysql::MySqlRow, MySql, Pool, Row};
use uuid::Uuid;

use crate::{controllers::database::Database, AppState};

use super::Model;

#[derive(Serialize, Deserialize)]

pub struct Entry {
    #[serde(rename(serialize = "crmUuid", deserialize = "crmUuid"))]
    pub crm_uuid: Uuid,
    pub id: i32,
    #[serde(rename(serialize = "customerUuid", deserialize = "customerUuid"))]
    pub customer_uuid: Uuid,
    #[serde(rename(serialize = "addedAtMeeting", deserialize = "addedAtMeeting"))]
    pub added_at_meeting: Option<Uuid>,
    pub content: Option<String>,
    pub added: Option<DateTime<Utc>>,
    pub updated: Option<DateTime<Utc>>,
}

impl Model for Entry {

    

    fn sql_row_arrays() -> Vec<[&'static str; 2]> {
        vec![
        ["crm_uuid", "VARCHAR(36) CHARACTER SET utf8 COLLATE utf8_general_mysql500_ci NOT NULL"],
        ["id", "INT NOT NULL AUTO_INCREMENT PRIMARY KEY"],
        ["customer_uuid", "VARCHAR(36) CHARACTER SET utf8 COLLATE utf8_general_mysql500_ci NOT NULL"],
        ["added", "DATETIME"],
        ["added_at_meeting", "VARCHAR(36) CHARACTER SET utf8 COLLATE utf8_general_mysql500_ci"],
        ["updated", "DATETIME"],
        ["content", "TEXT"]
        ]
    }

    async fn create_table(pool: &Pool<MySql>) -> Result<(), sqlx::Error> {
        Database::create_table(Self::sql_row_arrays(), "entries", None, pool).await
    }

    async fn alter_table(pool: &Pool<MySql>) -> Result<(), sqlx::Error> {
        todo!();
    }
   
    async fn create_and_alter_table(pool: &Pool<MySql>) -> Result<(), sqlx::Error> {
       todo!()
    }

    fn from_row(row: &MySqlRow) -> Self {
        Entry {
            crm_uuid: Uuid::parse_str(row.get("crm_uuid")).unwrap_or_default(),
            id: row.get("id"),
            customer_uuid: Uuid::parse_str(row.get("customer_uuid")).unwrap_or_default(),
            added_at_meeting: match row.get("added_at_meeting") {None => None, Some(uuid) => Some(Uuid::parse_str(uuid).unwrap_or_default())},
            content: row.get("content"),
            added: row.get("added"),
            updated: row.get("updated"),
        }
    }

    async fn insert(&self, data: &web::Data<AppState>) -> Result<(), sqlx::Error> {
        let query = "INSERT INTO `crm`.`entries` (`crm_uuid`, `customer_uuid`, `added`, `added_at_meeting`, `updated`, `content`) VALUES (?,?,?,?,?,?)";
        match sqlx::query(&query)
            .bind(&self.crm_uuid.hyphenated().to_string())
            .bind(&self.customer_uuid.hyphenated().to_string())
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

    async fn update(&self, data: &web::Data<AppState>) -> Result<(), sqlx::Error> {
        match sqlx::query("UPDATE `crm`.`entries` SET `content` = ?, `added_at_meeting` = ?, `updated` = ? WHERE `customer_uuid` = ? AND `id` = ? AND `crm_uuid` = ? ")
            .bind(&self.content)
            .bind(&self.added_at_meeting)
            .bind(Utc::now())
            .bind(&self.customer_uuid.hyphenated().to_string())
            .bind(&self.id )
            .bind(&self.crm_uuid.hyphenated().to_string())
            .execute(&data.pool)
            .await {
                Err(err) => Err(err),
                Ok(_) => Ok(())
            }
    }
}

impl Entry {
    pub fn new(content: &str, crm_uuid: Uuid, customer_uuid: Uuid, added_at_meeting: Option<Uuid>) -> Self {
        Entry {
            crm_uuid,
            id: -1,
            content: Some(content.to_string()),
            customer_uuid,
            added_at_meeting,
            added: Some(Utc::now()),
            updated: Some(Utc::now())
        }
    }

    
    fn default() -> Self {
        Self { crm_uuid: Uuid::new_v4(), id: 0, customer_uuid: Uuid::new_v4(), added_at_meeting: None, content: None, added: Some(Utc::now()), updated: Some(Utc::now()) }
    }
    

    pub async fn get_all_by_customer_uuid(crm_uuid: &Uuid, customer_uuid: &Uuid, data: &web::Data<AppState>) -> Result<Vec<Self>, sqlx::Error> {
        match sqlx::query("SELECT * FROM `crm`.`entries` WHERE `customer_uuid` = ? AND `crm_uuid` = ? ORDER BY `added` DESC", )
            .bind(customer_uuid.hyphenated().to_string())
            .bind(crm_uuid.hyphenated().to_string())
            .fetch_all(&data.pool)
            .await {
                Err(err) => Err(err),
                Ok(rows) => {
                    return Ok(rows.iter().map(|row| Self::from_row(row)).collect::<Vec<Entry>>());
                }
            }
    }

    pub async fn delete_by_id(id: i32, crm_uuid: &Uuid, data: &web::Data<AppState>) -> Result<(), sqlx::Error> {
        match sqlx::query("DELETE FROM `entries` WHERE `id` = ? AND `crm_uuid` = ?")
            .bind(id)
            .bind(crm_uuid.hyphenated().to_string())
            .execute(&data.pool)
            .await {
                Err(err) => Err(err),
                Ok(_) => Ok(())
            }
    }

    pub async fn delete_all_by_user_uuid(crm_uuid: &Uuid, customer_uuid: &Uuid, data: &web::Data<AppState>) -> Result<(), sqlx::Error> {
        match sqlx::query("DELETE FROM `entries` WHERE `customer_uuid` = ? AND `crm_uuid` = ?")
            .bind(customer_uuid.hyphenated().to_string())
            .bind(crm_uuid.hyphenated().to_string())
            .execute(&data.pool)
            .await {
                Err(err) => Err(err),
                Ok(_) => Ok(())
            }
    }


}