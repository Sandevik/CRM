use actix_web::web;
use chrono::{Utc, DateTime};
use serde::{self, Serialize, Deserialize};
use sqlx::{Error, Row, mysql::MySqlRow};
use uuid::Uuid;
use crate::{AppState, controllers::{hashing::Hashing, database::Database}};

#[derive(sqlx::FromRow, Debug, Serialize, Deserialize, Clone)]
pub struct User {
    pub uuid: Uuid, 
    pub email: String,
    #[serde(rename(serialize = "firstName", deserialize = "firstName"))]
    pub first_name: String,
    #[serde(rename(serialize = "lastName", deserialize = "lastName"))]
    pub last_name: String,
    #[serde(skip_serializing, skip_deserializing)]
    pub p_hash: String,
    #[serde(rename(serialize = "phoneNumber", deserialize = "phoneNumber"))]
    pub phone_number: Option<String>,
    pub admin: bool,
    pub joined: DateTime<Utc>,
    #[serde(rename(serialize = "lastSignIn", deserialize = "lastSignIn"))]
    pub last_sign_in: Option<DateTime<Utc>>,
    #[serde(rename(serialize = "crmCount", deserialize = "crmCount"))]
    pub crm_count: u8,
    #[serde(rename(serialize = "subscriptionEnds", deserialize = "subscriptionEnds"))]
    pub subscription_ends: Option<DateTime<Utc>>,
    #[serde(rename(serialize = "LegacyUser", deserialize = "LegacyUser"))]
    pub legacy_user: bool,
    #[serde(skip_deserializing, skip_serializing)]
    pub current_jwt: String,

}

impl User {

    pub fn from_row(row: &MySqlRow) -> Self {
        User {
            uuid: Uuid::parse_str(row.get("uuid")).expect("ERROR: Could not parse uuid for this user."),
            email: row.get("email"),
            phone_number: row.get("phone_number"),
            p_hash: row.get("p_hash"),
            admin: row.get("admin"),
            joined: row.get("joined"),
            last_sign_in: row.get("last_sign_in"),
            first_name: row.get("first_name"),
            last_name: row.get("last_name"),
            legacy_user: row.get("legacy_user"),
            crm_count: row.get("crm_count"),
            subscription_ends: row.get("subscription_ends"),   
            current_jwt: row.get("current_jwt")
        }
    }
    
    pub async fn get_all_users(amount: u16, offset: u16, data: &web::Data<AppState>) -> Result<Vec<User>, Error> {
        let res = sqlx::query("SELECT * FROM users LIMIT ? OFFSET ?")
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
        let res = sqlx::query("SELECT COUNT(*) AS count FROM users").fetch_one(&data.pool).await;
        match res {
            Err(err) => Err(err),
            Ok(mysql_resp) => Ok(mysql_resp.get("count"))
        }
    }


    pub async fn get_by_email(email: &str, data: &web::Data<AppState>) -> Result<Option<User>, Error> {
        let res = sqlx::query("SELECT * FROM users WHERE email = ?").bind(email).fetch_optional(&data.pool).await;
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
        let res = sqlx::query("SELECT * FROM users WHERE email = ? OR phone_number = ?").bind(email_or_phone_number).bind(email_or_phone_number).fetch_optional(&data.pool).await;
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
        let res = sqlx::query("SELECT * FROM users WHERE uuid = ?").bind(uuid).fetch_optional(&data.pool).await;
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

    pub async fn insert_user(email: &String, first_name: &String, last_name: & String, phone_number: &String, password: &String, data: &web::Data<AppState>) -> Result<sqlx::mysql::MySqlQueryResult, Error> {
        let res = Database::setup_users_table(&data.pool).await;
        if res.is_err() {
            return res;
        }
        let result = sqlx::query("INSERT INTO users (uuid, email, first_name, last_name, phone_number, p_hash, admin, joined, last_sign_in, crm_count, subscription_ends, legacy_user, current_jwt) VALUES (uuid(),?,?,?,?,?,0,?,?,?,NULL,false, \"\")")
            .bind(email)
            .bind(first_name)
            .bind(last_name)
            .bind(phone_number)
            .bind(Hashing::hash(password))
            .bind(Utc::now())
            .bind(Utc::now())
            .bind(0)
            .execute(&data.pool)
            .await;
        result
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

}
