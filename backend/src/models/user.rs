use actix_web::web;
use chrono::{Utc, DateTime};
use serde::{self, Serialize, Deserialize};
use sqlx::{Error, Row, mysql::MySqlRow};
use uuid::Uuid;
use crate::{AppState, controllers::{hashing::Hashing, database::Database}};

use super::{employee, Model};

#[derive(sqlx::FromRow, Debug, Serialize, Deserialize, Clone)]
pub struct User {
    pub uuid: Uuid, 
    pub email: String,
    #[serde(rename(serialize = "firstName", deserialize = "firstName"))]
    pub first_name: String,
    #[serde(rename(serialize = "lastName", deserialize = "lastName"))]
    pub last_name: String,
    #[serde(skip_serializing, skip_deserializing)]
    pub password_hash: String,
    #[serde(rename(serialize = "phoneNumber", deserialize = "phoneNumber"))]
    pub phone_number: Option<String>,
    pub admin: bool,
    pub joined: DateTime<Utc>,
    #[serde(rename(serialize = "lastSignIn", deserialize = "lastSignIn"))]
    pub last_sign_in: Option<DateTime<Utc>>,
    #[serde(rename(serialize = "subscriptionEnds", deserialize = "subscriptionEnds"))]
    pub subscription_ends: Option<DateTime<Utc>>,
    #[serde(rename(serialize = "legacyUser", deserialize = "legacyUser"))]
    pub legacy_user: bool,
    #[serde(skip_deserializing, skip_serializing)]
    pub current_jwt: Option<String>,
    #[serde(rename(serialize = "preferredLanguage", deserialize = "preferredLanguage"))]
    pub preferred_language: String,
}

impl Model for User {
    
    fn from_row(row: &MySqlRow) -> Self {
        User {
            uuid: Uuid::parse_str(row.get("uuid")).expect("ERROR: Could not parse uuid for this user."),
            email: row.get("email"),
            phone_number: row.get("phone_number"),
            password_hash: row.get("password_hash"),
            admin: row.get("admin"),
            joined: row.get("joined"),
            last_sign_in: row.get("last_sign_in"),
            first_name: row.get("first_name"),
            last_name: row.get("last_name"),
            legacy_user: row.get("legacy_user"),
            subscription_ends: row.get("subscription_ends"),   
            current_jwt: row.get("current_jwt"),
            preferred_language: row.get("preferred_language"),
        }
    }

    async fn insert(&self, data: &web::Data<AppState>) -> Result<(), sqlx::Error> {
        todo!();
    }

    async fn update(&self, data: &web::Data<AppState>) -> Result<(), sqlx::Error> {
        todo!();
    }

}

impl User {

    pub async fn get_all_users(amount: u16, offset: u16, data: &web::Data<AppState>) -> Result<Vec<User>, Error> {
        let res = sqlx::query("SELECT * FROM `crm`.`users` LIMIT ? OFFSET ?")
        .bind(amount)
        .bind(offset)
        .fetch_all(&data.pool).await;
        match res {
            Err(err) => Err(err),
            Ok(rows) => {
                let mut users: Vec<User> = Vec::new();
                rows.iter().for_each(|row: &MySqlRow| {
                    users.push(Self::from_row(row))
                });
                Ok(users)
            }
        }
    }

    pub async fn get_users_count(data: &web::Data<AppState>) -> Result<i32, Error> {
        let res = sqlx::query("SELECT COUNT(*) AS count FROM `crm`.`users`").fetch_one(&data.pool).await;
        match res {
            Err(err) => Err(err),
            Ok(mysql_resp) => Ok(mysql_resp.get("count"))
        }
    }


    pub async fn get_by_email(email: &str, data: &web::Data<AppState>) -> Result<Option<User>, Error> {
        let res = sqlx::query("SELECT * FROM `crm`.`users` WHERE email = ?").bind(email).fetch_optional(&data.pool).await;
        match res {
            Err(err) => return Err(err),
            Ok(row) => {
                match row {
                    Some(msql_row) => return Ok(Some(Self::from_row(&msql_row))),
                    None => return Ok(None),
                }
            }
        }
    }

    pub async fn get_by_phone_number(phone_number: &String, data: &web::Data<AppState>) -> Result<Option<User>, Error> {
        let res = sqlx::query("SELECT * FROM `crm`.`users` WHERE phone_number = ?").bind(phone_number).fetch_optional(&data.pool).await;
        match res {
            Err(err) => return Err(err),
            Ok(row) => {
                match row {
                    Some(msql_row) => return Ok(Some(Self::from_row(&msql_row))),
                    None => return Ok(None),
                }
            }
        }
    }

    pub async fn get_by_email_or_phone_number(email_or_phone_number: &str, data: &web::Data<AppState>) -> Result<Option<User>, Error> {
        let res = sqlx::query("SELECT * FROM `crm`.`users` WHERE email = ? OR phone_number = ?").bind(email_or_phone_number).bind(email_or_phone_number).fetch_optional(&data.pool).await;
        match res {
            Err(err) => return Err(err),
            Ok(row) => {
                match row {
                    Some(msql_row) => return Ok(Some(Self::from_row(&msql_row))),
                    None => return Ok(None),
                }
            }
        }
    }
    pub async fn get_by_email_or_phone_number_sep(email: &str, phone_number: &String, data: &web::Data<AppState>) -> Result<Option<User>, Error> {
        let res = sqlx::query("SELECT * FROM `crm`.`users` WHERE email = ? OR phone_number = ?").bind(email).bind(phone_number).fetch_optional(&data.pool).await;
        match res {
            Err(err) => return Err(err),
            Ok(row) => {
                match row {
                    Some(msql_row) => return Ok(Some(Self::from_row(&msql_row))),
                    None => return Ok(None),
                }
            }
        }
    }

    pub async fn get_by_uuid(uuid: &String, data: &web::Data<AppState>) -> Result<Option<User>, Error> {
        let res = sqlx::query("SELECT * FROM `crm`.`users` WHERE uuid = ?").bind(uuid).fetch_optional(&data.pool).await;
        match res {
            Err(err) => return Err(err),
            Ok(row) => {
                match row {
                    Some(msql_row) => return Ok(Some(Self::from_row(&msql_row))),
                    None => return Ok(None),
                }
            }
        }
    } 

    pub async fn insert_user(email: &String, first_name: &String, last_name: &String, phone_number: &String, password: &String, language: &String, data: &web::Data<AppState>) -> Result<sqlx::mysql::MySqlQueryResult, Error> {
        let res = Database::setup_users_table(&data.pool).await;
        if res.is_err() {
            return res;
        }
        let result = sqlx::query("INSERT INTO `crm`. `users` (uuid, email, first_name, last_name, phone_number, preferred_language, password_hash, admin, joined, last_sign_in, subscription_ends, legacy_user) VALUES (uuid(),?,?,?,?,?,?,0,?,?,NULL,false)")
            .bind(email)
            .bind(first_name)
            .bind(last_name)
            .bind(phone_number)
            .bind(language)
            .bind(Hashing::hash(password))
            .bind(Utc::now())
            .bind(Utc::now())
            .execute(&data.pool)
            .await;
        result
    }

    pub async fn update_language(user_uuid: &Uuid, language: &String, data: &web::Data<AppState>) -> Result<(), Error> {
        let result = sqlx::query("UPDATE `crm`.`users` SET `preferred_language` = ? WHERE `uuid` = ?")
            .bind(language)
            .bind(user_uuid.hyphenated().to_string())
            .execute(&data.pool).await;
        match result {
            Ok(_) => Ok(()),
            Err(err) => Err(err)
        }
        
    }

    pub async fn update_last_sign_in(&self, data: &web::Data<AppState>) -> Result<(), Error> {
        let result = sqlx::query("UPDATE `crm`.`users` SET last_sign_in = ? WHERE uuid = ?")
            .bind(DateTime::<Utc>::from(Utc::now()))
            .bind(self.uuid.hyphenated().to_string())
            .execute(&data.pool).await;
        match result {
            Ok(_) => Ok(()),
            Err(err) => Err(err)
        }
    }

    pub async fn update_current_jwt(&self, new_current_jwt: &String, data: &web::Data<AppState>) -> Result<(), Error> {
        let result = sqlx::query("UPDATE `crm`.`users` SET current_jwt = ? WHERE uuid = ?")
            .bind(new_current_jwt)
            .bind(self.uuid.hyphenated().to_string())
            .execute(&data.pool).await;
        match result {
            Ok(_) => Ok(()),
            Err(err) => Err(err)
        }
    }

    pub async fn add_employee_user(&self, crm_uuid: &Uuid, data: &web::Data<AppState>) -> Result<(), sqlx::Error> {
        // Check if user already is employee of crm 
        let query = "SELECT * FROM `crm` . `user_employee` WHERE `user_uuid` = ?";
        let employee_of = sqlx::query(query).bind(&self.uuid.hyphenated().to_string()).fetch_all(&data.pool).await;
        if let Err(err) = employee_of {
            return Err(err);
        } else {

            if let None = employee_of.unwrap().iter().find(|row| {
                row.get::<String, &str>("crm_uuid") == crm_uuid.hyphenated().to_string()
            }) {
                // Insert if not employee of crm
                let query = format!(r#"
                    INSERT INTO `crm` . `user_employee` (uuid, crm_uuid, user_uuid) VALUES (UUID(),?,?)
                "#);    
                match sqlx::query(&query)
                .bind(crm_uuid.hyphenated().to_string())
                .bind(&self.uuid.hyphenated().to_string())
                .execute(&data.pool)
                .await {
                    Err(err) => Err(err),
                    Ok(_) => {
                        Ok(())
                    }
                }

            } else {
                return Ok(());
            }
        }
        
        
    }

    pub fn new(email: &String, first_name: &String, last_name: &String, password_hash: &String, phone_number: Option<String>, preferred_language: String) -> Self {
        User { uuid: Uuid::new_v4(), email: email.to_string(), first_name: first_name.to_string(), last_name: last_name.to_string(), password_hash: password_hash.to_string(), phone_number, admin: false, joined: Utc::now(), last_sign_in: None, subscription_ends: None, legacy_user: false, current_jwt: None, preferred_language}
    }

    pub fn default() -> Self {
        User { uuid: Uuid::new_v4(), email: "".to_string(), first_name: "".to_string(), last_name: "".to_string(), password_hash: "".to_string(), phone_number: None, admin: false, joined: Utc::now(), last_sign_in: None, subscription_ends: None, legacy_user: false, current_jwt: None, preferred_language: "eng".to_string()}
    }


}
