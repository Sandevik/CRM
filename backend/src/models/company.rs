use actix_web::web;
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::{mysql::MySqlRow, Row};
use uuid::Uuid;

use crate::AppState;

use super::Model;


#[derive(Serialize, Deserialize)]
pub struct Company {
    #[serde(rename(serialize = "crmUuid", deserialize = "crmUuid"))]
    crm_uuid: Uuid,
    name: Option<String>,
    #[serde(rename(serialize = "organizationNumber", deserialize = "organizationNumber"))]
    organization_number: Option<String>,
    address: Option<String>,
    #[serde(rename(serialize = "zipCode", deserialize = "zipCode"))]
    zip_code: Option<String>,
    city: Option<String>,
    country: Option<String>,
    #[serde(rename(serialize = "phoneNumber", deserialize = "phoneNumber"))]
    phone_number: Option<String>,
    #[serde(rename(serialize = "placeOfStationing", deserialize = "placeOfStationing"))]
    place_of_stationing: Option<String>,
    added: Option<DateTime<Utc>>,
    updated: Option<DateTime<Utc>>
}

impl Model for Company {
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
        .bind(self.crm_uuid)
        .execute(&data.pool)
        .await {
            Err(err) => Err(err),
            Ok(_) => Ok(())
        }
    }




}