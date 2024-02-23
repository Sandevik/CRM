use actix_web::web;
use chrono::{DateTime, Utc, NaiveDate};
use serde::{Serialize, Deserialize};
use sqlx::{mysql::MySqlRow, Row};
use uuid::Uuid;
use crate::{AppState, routes::Limit};
use super::{entry::Entry, meeting::Meeting, Model};

#[derive(Serialize, Deserialize)]

pub struct Customer {
    #[serde(rename(serialize = "crmUuid", deserialize = "crmUuid"))]
    pub crm_uuid: Uuid,
    pub uuid: Uuid,
    #[serde(rename(serialize = "firstName", deserialize = "firstName"))]
    pub first_name: Option<String>,
    #[serde(rename(serialize = "lastName", deserialize = "lastName"))]
    pub last_name: Option<String>,
    #[serde(rename(serialize = "dateOfBirth", deserialize = "dateOfBirth"))]
    pub date_of_birth: Option<NaiveDate>,
    pub email: String,
    pub address: Option<String>,
    #[serde(rename(serialize = "zipCode", deserialize = "zipCode"))]
    pub zip_code: Option<String>,
    pub city: Option<String>,
    pub country: Option<String>,
    pub company: Option<String>,
    #[serde(rename(serialize = "phoneNumber", deserialize = "phoneNumber"))]
    pub phone_number: Option<String>,
    #[serde(rename(serialize = "newsLetter", deserialize = "newsLetter"))]
    pub news_letter: bool,
    pub added: DateTime<Utc>,
    pub updated: DateTime<Utc>,
    pub note: Option<String>,
}

impl Model for Customer {
    fn from_row(row: &MySqlRow) -> Self {
        Customer {
            crm_uuid: Uuid::parse_str(row.get("crm_uuid")).unwrap_or_default(),
            uuid: Uuid::parse_str(row.get("uuid")).unwrap_or_default(),
            first_name: row.get("first_name"),
            last_name: row.get("last_name"),
            date_of_birth: row.get("date_of_birth"),
            email: row.get("email"),
            address: row.get("address"),
            zip_code: row.get("zip_code"),
            city: row.get("city"),
            country: row.get("country"),
            company: row.get("company"),
            phone_number: row.get("phone_number"),
            news_letter: row.get("news_letter"),
            added: row.get("added"),
            updated: row.get("updated"),
            note: row.get("note"),
        }
    }
}

impl Customer {

    pub fn default() -> Self {
        Customer { crm_uuid: Uuid::new_v4(), uuid: Uuid::new_v4(), first_name: None, last_name: None, date_of_birth: None, email: "".to_string(), address: None, zip_code: None, city: None, country: None, company: None, phone_number: None, news_letter: false, added: Utc::now(), updated: Utc::now(), note: None }
    }
    pub fn new(crm_uuid: &Uuid, first_name: Option<String>, last_name: Option<String>, date_of_birth: Option<NaiveDate>, email: String, address: Option<String>, zip_code: Option<String>, city: Option<String>, country: Option<String>, company: Option<String>, phone_number: Option<String>, news_letter: bool) -> Self {
        Customer {
            crm_uuid: crm_uuid.clone(),
            uuid: Uuid::new_v4(),
            first_name,
            last_name,
            date_of_birth,
            email,
            address,
            zip_code,
            city,
            country,
            company,
            phone_number,
            news_letter,
            added: Utc::now(),
            updated: Utc::now(),
            note: None,
        }
    }

    pub async fn get_by_uuid(customer_uuid: &Uuid, crm_uuid: &Uuid, data: &web::Data<AppState>) -> Result<Option<Self>, sqlx::Error> {
        let query = "SELECT * FROM `crm`.`customers` WHERE uuid = ? AND `crm_uuid` = ?";
        match sqlx::query(&query)
            .bind(customer_uuid.hyphenated().to_string())
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
        let mut customers: Vec<Customer> = Vec::new();
        let mut query = String::from("SELECT * FROM `crm`.`customers` WHERE `crm_uuid` = ? AND `first_name` LIKE ? OR `last_name` LIKE ? OR `email` LIKE ? OR `phone_number` LIKE ? OR `city` LIKE ?");
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
                    customers.push(Customer::from_row(row));
                });
            }
        }
        Ok(customers)
    }

    pub async fn get_all(crm_uuid: &Uuid, limit: Limit, offset: Option<u16>, data: &web::Data<AppState>) -> Result<Vec<Self>, sqlx::Error> {
        let mut customers: Vec<Customer> = Vec::new();
        let mut query = String::from("SELECT * FROM `crm`.`customers` WHERE `crm_uuid` = ?");
        //todo: create limits on how many customers a person can get
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
                        customers.push(Customer::from_row(row));
                    });
                }
            }
        Ok(customers)
    }

    pub async fn insert(&self, crm_uuid: &Uuid, data: &web::Data<AppState>) -> Result<(), sqlx::Error> {
        let query = "INSERT INTO `crm`.`customers` (crm_uuid, uuid, first_name, last_name, date_of_birth, email, address, zip_code, city, country, company, phone_number, news_letter, added, updated) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
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
            .bind(&self.company)
            .bind(&self.phone_number)
            .bind(&self.news_letter)
            .bind(&self.added)
            .bind(&self.updated)
            .execute(&data.pool)
            .await {
                Err(err) => Err(err),
                Ok(_) => Ok(())
            }
    }

    pub async fn update(&self, data: &web::Data<AppState>) -> Result<(), sqlx::Error> {
            match sqlx::query("UPDATE `crm`.`customers` SET `first_name` = ?, `last_name` = ?, `date_of_birth` = ?, `email` = ?, `address` = ?, `zip_code` = ?, `city` = ?, `country` = ?, `company` = ?, `phone_number` = ?, `news_letter` = ?, `updated` = ? WHERE `uuid` = ? AND `crm_uuid` = ?")
                .bind(&self.first_name)
                .bind(&self.last_name)
                .bind(&self.date_of_birth)
                .bind(&self.email)
                .bind(&self.address)
                .bind(&self.zip_code)
                .bind(&self.city)
                .bind(&self.country)
                .bind(&self.company)
                .bind(&self.phone_number)
                .bind(&self.news_letter)
                .bind(Utc::now())
                .bind(&self.uuid.hyphenated().to_string())
                .bind(&self.crm_uuid.hyphenated().to_string())
                .execute(&data.pool)
                .await {
                    Err(err) => Err(err),
                    Ok(_) => Ok(())
                }   
    }

    pub async fn update_note(&self, data: &web::Data<AppState>) -> Result<(), sqlx::Error> {
        match sqlx::query("UPDATE `crm`.`customers` SET `note` = ?, `updated` = ? WHERE `uuid` = ? AND `crm_uuid` = ?")
            .bind(&self.note)
            .bind(Utc::now())
            .bind(&self.uuid.hyphenated().to_string())
            .bind(&self.crm_uuid.hyphenated().to_string())
            .execute(&data.pool)
            .await {
                Err(err) => Err(err),
                Ok(_) => Ok(())
            }
    }

    pub async fn delete_customer(customer_uuid: &Uuid, crm_uuid: &Uuid, data: &web::Data<AppState>) -> Result<(), sqlx::Error> {
        //Remve Entries, Meetings, and then customer
        match Entry::delete_all_by_user_uuid(crm_uuid, &customer_uuid, data).await {
            Err(err) => Err(err),
            Ok(_) => {
                match Meeting::delete_all_by_user_uuid(&customer_uuid, crm_uuid, data).await {
                    Err(err) => Err(err),
                    Ok(_) => {
                        match sqlx::query("DELETE FROM `crm` . `customers` WHERE `uuid` = ? AND `crm_uuid` = ?")
                            .bind(customer_uuid.hyphenated().to_string())
                            .bind(crm_uuid.hyphenated().to_string())
                            .execute(&data.pool)
                            .await {
                                Err(err) => Err(err),
                                Ok(_) => Ok(())
                            }
                    }
                }
            }
        }
    }

    pub async fn get_statistics(&self, data: &web::Data<AppState>) -> Result<Option<CustomerStatistics>, sqlx::Error> {
        match sqlx::query(r#"SELECT 
        (SELECT COUNT(*) FROM `crm` . `entries` WHERE `crm_uuid` = ? AND `customer_uuid` = ?) AS entries_count, 
        (SELECT COUNT(*) FROM `crm` . `meetings` WHERE `crm_uuid` = ? AND `customer_uuid` = ?) AS meetings_count, 
        (SELECT COUNT(*) FROM `crm` . `tasks` WHERE `crm_uuid` = ? AND `customer_uuid` = ?) as `tasks_count`, 
        (SELECT COUNT(*) FROM `crm` . `tasks` WHERE `crm_uuid` = ? AND `customer_uuid` = ? AND NOT `status` = 'completed') as `tasks_todo_count`
        "#)
        .bind(&self.crm_uuid.hyphenated().to_string())
        .bind(&self.uuid.hyphenated().to_string())
        .bind(&self.crm_uuid.hyphenated().to_string())
        .bind(&self.uuid.hyphenated().to_string())
        .bind(&self.crm_uuid.hyphenated().to_string())
        .bind(&self.uuid.hyphenated().to_string())
        .bind(&self.crm_uuid.hyphenated().to_string())
        .bind(&self.uuid.hyphenated().to_string())
        .fetch_optional(&data.pool)
        .await {
            Err(err) => Err(err),
            Ok(stats) => {
                if let None = stats {
                    return Ok(None);
                }
                let unwrapped = stats.unwrap();
                let meetings_count = unwrapped.get::<i32, &str>("meetings_count") as usize;
                let entries_count = unwrapped.get::<i32, &str>("entries_count") as usize;
                let task_count = unwrapped.get::<i32, &str>("tasks_count") as usize;
                let tasks_todo_count = unwrapped.get::<i32, &str>("tasks_todo_count") as usize;
                return Ok(Some(CustomerStatistics {
                    meetings_count,
                    entries_count,
                    task_count,
                    tasks_todo_count
                }))
            }
        }
    }

}


#[derive(Serialize)]
pub struct CustomerStatistics {
    pub meetings_count: usize,
    pub entries_count: usize,
    pub task_count: usize,
    tasks_todo_count: usize,
}