use std::default;

use actix_web::web;
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::{mysql::MySqlRow, MySql, Pool, Row};
use uuid::Uuid;

use crate::{controllers::database::Database, AppState};

use super::Model;


#[derive(Serialize, Deserialize)]
pub struct Company {
    #[serde(rename(serialize = "crmUuid", deserialize = "crmUuid"))]
    pub crm_uuid: Uuid,
    pub name: Option<String>,
    #[serde(rename(serialize = "organizationNumber", deserialize = "organizationNumber"))]
    pub organization_number: Option<String>,
    pub address: Option<String>,
    #[serde(rename(serialize = "zipCode", deserialize = "zipCode"))]
    pub zip_code: Option<String>,
    pub city: Option<String>,
    pub country: Option<String>,
    #[serde(rename(serialize = "phoneNumber", deserialize = "phoneNumber"))]
    pub phone_number: Option<String>,
    #[serde(rename(serialize = "placeOfStationing", deserialize = "placeOfStationing"))]
    pub place_of_stationing: Option<String>,
    pub added: Option<DateTime<Utc>>,
    pub updated: Option<DateTime<Utc>>
}

impl Model for Company {
    
    

    fn sql_row_arrays() -> Vec<[&'static str; 2]> {
        vec![
        ["crm_uuid", "VARCHAR(36) NOT NULL"],
        ["name", "TEXT"],
        ["organization_number", "TEXT"],
        ["address", "TEXT"],
        ["zip_code", "TEXT"],
        ["city", "TEXT"],
        ["company", "TEXT"],
        ["phone_number", "TEXT"],
        ["place_of_stationing", "TEXT"],
        ["added", "DATETIME"],
        ["updated", "DATETIME"]
        ]
    }

    

    async fn create_table(pool: &Pool<MySql>) -> Result<(), sqlx::Error> {
        Database::create_table(Self::sql_row_arrays(), "companies", None, pool).await
    }

    async fn alter_table(pool: &Pool<MySql>) -> Result<(), sqlx::Error> {
        Database::alter_table(Self::sql_row_arrays(), "companies", pool).await
    }
   
    async fn migrate_table(pool: &Pool<MySql>) -> Result<(), sqlx::Error> {
        Database::migrate_table(Self::sql_row_arrays(), "companies", None, pool).await
    }

    fn from_row(row: &MySqlRow) -> Self {
        Company {
            crm_uuid: Uuid::parse_str(row.get("crm_uuid")).unwrap_or_default(),
            name: row.get("name"),
            organization_number: row.get("organization_number"),
            address: row.get("address"),
            zip_code: row.get("zip_code"),
            city: row.get("city"),
            country: row.get("country"),
            phone_number: row.get("phone_number"),
            place_of_stationing: row.get("place_of_stationing"),
            added: row.get("added"),
            updated: row.get("updated"),
        }
    }

    async fn insert(&self, data: &web::Data<AppState>) -> Result<(), sqlx::Error> {
        match sqlx::query("INSERT INTO `crm` . `companies` (crm_uuid, name, organization_number, address, zip_code, city, country, phone_number, place_of_stationing, added, updated) VALUES (?,?,?,?,?,?,?,?,?,?,?)")
        .bind(&self.crm_uuid.hyphenated().to_string())
        .bind(&self.name)
        .bind(&self.organization_number)
        .bind(&self.address)
        .bind(&self.zip_code)
        .bind(&self.city)
        .bind(&self.phone_number)
        .bind(&self.place_of_stationing)
        .bind(Utc::now())
        .bind(Utc::now())
        .execute(&data.pool)
        .await {
            Err(err) => Err(err),
            Ok(_) => Ok(())
        }
    }

    async fn update(&self, data: &web::Data<AppState>) -> Result<(), sqlx::Error> {
        match sqlx::query("UPDATE `crm` . `companies` SET name = ?, organization_number = ?, address = ?, zip_code = ?, city = ?, country = ?, phone_number = ?, place_of_stationing = ?, updated = ? WHERE `crm_uuid` = ?")
        .bind(&self.name)
        .bind(&self.organization_number)
        .bind(&self.address)
        .bind(&self.zip_code)
        .bind(&self.city)
        .bind(&self.country)
        .bind(&self.phone_number)
        .bind(&self.place_of_stationing)
        .bind(Utc::now())
        .bind(&self.crm_uuid.hyphenated().to_string())
        .execute(&data.pool)
        .await {
            Err(err) => Err(err),
            Ok(_) => Ok(())
        }
    }


}


impl Company {

    pub fn default() -> Self {
        Self {
            crm_uuid: Uuid::new_v4(),
            name: None,
            organization_number: None,
            address: None,
            zip_code: None,
            city: None,
            country: None,
            phone_number: None,
            place_of_stationing: None,
            added: Some(Utc::now()),
            updated: Some(Utc::now()),
        }
    }

    pub async fn get_by_crm_uuid(crm_uuid: &Uuid, data: &web::Data<AppState>) -> Result<Option<Self>, sqlx::Error> {
        match sqlx::query("SELECT * FROM `crm` . `companies` WHERE `crm_uuid` = ?")
        .bind(&crm_uuid.hyphenated().to_string())
        .fetch_optional(&data.pool)
        .await {
            Err(err) => Err(err),
            Ok(row_opt) => {
                match row_opt {
                    None => Ok(None),
                    Some(row) => Ok(Some(Self::from_row(&row)))
                }
            }
        }
    }

    
    

    pub async fn delete(self, data: &web::Data<AppState>) -> Result<(), sqlx::Error> {
        match sqlx::query("DELETE FROM `crm` . `companies` WHERE crm_uuid = ?")
        .bind(self.crm_uuid.hyphenated().to_string())
        .execute(&data.pool)
        .await {
            Err(err) => Err(err),
            Ok(_) => Ok(())
        }
    }
    pub async fn delete_by_crm_uuid(crm_uuid: &Uuid, data: &web::Data<AppState>) -> Result<(), sqlx::Error> {
        match sqlx::query("DELETE FROM `crm` . `companies` WHERE crm_uuid = ?")
        .bind(crm_uuid.hyphenated().to_string())
        .execute(&data.pool)
        .await {
            Err(err) => Err(err),
            Ok(_) => Ok(())
        }
    }




}