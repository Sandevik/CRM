use actix_web::web;
use chrono::{DateTime, NaiveDate, Utc};
use serde::{Serialize, Deserialize};
use sqlx::{mysql::MySqlRow, Row};
use uuid::Uuid;

use crate::{routes::Limit, AppState};

use super::Model;

#[derive(Serialize, Deserialize)]

pub struct Employee {
    #[serde(rename(serialize = "crmUuid", deserialize = "crmUuid"))]
    pub crm_uuid: Uuid,
    pub uuid: Uuid,
    #[serde(rename(serialize = "userUuid", deserialize = "userUuid"))]
    pub user_uuid: Option<Uuid>,
    #[serde(rename(serialize = "firstName", deserialize = "firstName"))]
    pub first_name: Option<String>,
    #[serde(rename(serialize = "lastName", deserialize = "lastName"))]
    pub last_name: Option<String>,
    #[serde(rename(serialize = "dateOfBirth", deserialize = "dateOfBirth"))]
    pub date_of_birth: Option<NaiveDate>,
    pub ssn: Option<String>,
    pub address: Option<String>,
    #[serde(rename(serialize = "zipCode", deserialize = "zipCode"))]
    pub zip_code: Option<String>,
    pub city: Option<String>,
    pub country: Option<String>,
    #[serde(rename(serialize = "phoneNumber", deserialize = "phoneNumber"))]
    pub phone_number: Option<String>,
    pub role: Option<String>,
    #[serde(rename(serialize = "drivingLicenseClass", deserialize = "drivingLicenseClass"))]
    pub driving_license_class: Option<String>,
    #[serde(rename(serialize = "periodOfValidity", deserialize = "periodOfValidity"))]
    pub period_of_validity: Option<String>,
    pub email: Option<String>,
    #[serde(rename(serialize = "contractUuid", deserialize = "contractUuid"))]
    pub contract_uuid: Option<Uuid>,
    #[serde(rename(serialize = "accessLevel", deserialize = "accessLevel"))]
    pub access_level: Option<String>,
    pub added: DateTime<Utc>,
    pub updated: DateTime<Utc>
}

impl Model for Employee {
    fn from_row(row: &MySqlRow) -> Self {
        Employee {
            crm_uuid: Uuid::parse_str(row.get("crm_uuid")).unwrap_or_default(), 
            uuid: Uuid::parse_str(row.get("uuid")).unwrap_or_default(),
            user_uuid: match row.get("user_uuid") { None => None, Some(str) => match Uuid::parse_str(str) {Err(_) => None, Ok(u) => Some(u)}},
            first_name: row.get("first_name"),
            last_name: row.get("last_name"),
            date_of_birth: row.get("date_of_birth"),
            address: row.get("address"),
            zip_code: row.get("zip_code"),
            city: row.get("city"),
            country: row.get("country"),
            ssn: row.get("ssn"),
            email: row.get("email"),
            access_level: row.get("access_level"),
            contract_uuid: match row.get("contract_uuid") {None => None, Some(str) => match Uuid::parse_str(str) {Err(_) => None, Ok(u) => Some(u)}},
            phone_number: row.get("phone_number"),
            role: row.get("role"),
            driving_license_class: row.get("driving_license_class"),
            period_of_validity: row.get("period_of_validity"),
            added: row.get("added"),
            updated: row.get("updated"),
        }
    }
}

impl Employee {

    pub fn default() -> Self {
        Employee { 
            crm_uuid: Uuid::new_v4(), 
            uuid: Uuid::new_v4(),
            user_uuid: None,
            first_name: None,
            last_name: None,
            date_of_birth: None,
            address: None,
            zip_code: None,
            city: None,
            country: None,
            ssn: None,
            email: None,
            access_level: None,
            contract_uuid: None,
            phone_number: None,
            role: None,
            driving_license_class: None,
            period_of_validity: None,
            added: Utc::now(),
            updated: Utc::now(),
        }
    
    }


    pub async fn get_by_uuid(employee_uuid: &Uuid, crm_uuid: &Uuid, data: &web::Data<AppState>) -> Result<Option<Self>, sqlx::Error> {
        let query = "SELECT * FROM `crm`.`employees` WHERE uuid = ? AND `crm_uuid` = ?";
        match sqlx::query(&query)
            .bind(employee_uuid.hyphenated().to_string())
            .bind(crm_uuid.hyphenated().to_string())
            .fetch_optional(&data.pool)
            .await {
                Err(err) => Err(err),
                Ok(maybe_row) => {
                match maybe_row {
                    None => Ok(None),
                    Some(row) => Ok(Some(Self::from_row(&row)))
                }
            }
        }
    }

    pub async fn search(crm_uuid: &Uuid, q: &str, limit: Limit, data: &web::Data<AppState>) -> Result<Vec<Self>, sqlx::Error> {
        let mut employees: Vec<Employee> = Vec::new();
        let mut query = String::from("SELECT * FROM `crm`.`employees` WHERE `crm_uuid` = ? AND `first_name` LIKE ? OR `last_name` LIKE ? OR `email` LIKE ? OR `phone_number` LIKE ? OR `city` LIKE ?");
        match limit {
            Limit::None => (),
            Limit::Some(limit) => query.push_str(format!(" LIMIT {}", limit).as_str()),
        }
        let parsed_q: String = format!("%{}%", q);
        match sqlx::query(&query)
            .bind(crm_uuid.hyphenated().to_string())
            .bind(&parsed_q)
            .bind(&parsed_q)
            .bind(&parsed_q)
            .bind(&parsed_q)
            .bind(&parsed_q)
            .fetch_all(&data.pool)
            .await{
                Err(err) => println!("{err}"),
                Ok(rows) => {
                rows.iter().for_each(|row| {
                    employees.push(Employee::from_row(row));
                });
            }
        }
        Ok(employees)
    }

    pub async fn get_all(crm_uuid: &Uuid, limit: Limit, offset: Option<u16>, data: &web::Data<AppState>) -> Result<Vec<Self>, sqlx::Error> {
        let mut employees: Vec<Employee> = Vec::new();
        let mut query = String::from("SELECT * FROM `crm`.`employees` WHERE `crm_uuid` = ?");
        //todo: create limits on how many employees a person can get
        match limit {
            Limit::None => (),
            Limit::Some(limit) => query.push_str(format!(" LIMIT {}", limit).as_str()),
        }
        match offset {
            None => (),
            Some(num) => query.push_str(format!(" OFFSET {}", num).as_str()),
        }
        match sqlx::query(&query)
            .bind(crm_uuid.hyphenated().to_string())
            .fetch_all(&data.pool)
            .await {
                Err(err) => println!("{err}"),
                Ok(rows) => {
                    rows.iter().for_each(|row| {
                        employees.push(Employee::from_row(row));
                    });
                }
            }
        Ok(employees)
    }

    pub async fn insert(&self, crm_uuid: &Uuid, data: &web::Data<AppState>) -> Result<(), sqlx::Error> {
        let query = "INSERT INTO `crm`.`employees` (crm_uuid, uuid, first_name, last_name, date_of_birth, email, address, zip_code, city, country, ssn, access_level, contract_uuid, phone_number, role, driving_license_class, period_of_validity, added, updated) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
        match sqlx::query(&query)
            .bind(crm_uuid.hyphenated().to_string())
            .bind(&self.uuid.hyphenated().to_string())
            .bind(&self.first_name)
            .bind(&self.last_name)
            .bind(&self.date_of_birth)
            .bind(&self.email)
            .bind(&self.address)
            .bind(&self.zip_code)
            .bind(&self.city)
            .bind(&self.country)
            .bind(&self.ssn)
            .bind(&self.access_level)
            .bind(match &self.contract_uuid {None => None, Some(uuid) => Some(uuid.hyphenated().to_string())})
            .bind(&self.phone_number)
            .bind(&self.role)
            .bind(&self.driving_license_class)
            .bind(&self.period_of_validity)
            .bind(&self.added)
            .bind(&self.updated)
            .execute(&data.pool)
            .await {
                Err(err) => Err(err),
                Ok(_) => Ok(())
            }
    }



}