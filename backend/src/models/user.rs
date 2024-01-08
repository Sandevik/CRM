use actix_web::web;
use chrono::{Utc, DateTime};
use serde::{self, Serialize, Deserialize};
use sqlx::{Error, Row};
use uuid::Uuid;
use crate::{AppState, controllers::hashing::Hashing};

#[derive(sqlx::FromRow, Debug, Serialize, Deserialize, Clone)]
pub struct User {
    pub uuid: Uuid, 
    pub email: String,
    #[serde(skip_serializing, skip_deserializing)]
    pub p_hash: String,
    #[serde(rename(serialize = "phoneNumber", deserialize = "phoneNumber"))]
    pub phone_number: Option<String>,
    pub admin: bool,
    pub joined: DateTime<Utc>,
    #[serde(rename(serialize = "lastSignIn", deserialize = "lastSignIn"))]
    pub last_sign_in: Option<DateTime<Utc>>,
}

impl User {
    
    pub async fn get_by_email(email: &str, data: &web::Data<AppState>) -> Result<Option<User>, Error> {
        let res = sqlx::query("SELECT * FROM users WHERE email = ?").bind(email).fetch_optional(&data.pool).await;
        match res {
            Err(err) => return Err(err),
            Ok(row) => {
                match row {
                    Some(msql_row) => return Ok(Some(User {
                        uuid: Uuid::parse_str(msql_row.get("uuid")).expect("ERROR: Could not parse uuid for this user."),
                        email: msql_row.get("email"),
                        phone_number: msql_row.get("phone_number"),
                        p_hash: msql_row.get("p_hash"),
                        admin: msql_row.get("admin"),
                        joined: msql_row.get("joined"),
                        last_sign_in: msql_row.get("last_sign_in")
                    })),
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
                    Some(msql_row) => return Ok(Some(User {
                        uuid: Uuid::parse_str(msql_row.get("uuid")).expect("ERROR: Could not parse uuid for this user."),
                        email: msql_row.get("email"),
                        phone_number: msql_row.get("phone_number"),
                        p_hash: msql_row.get("p_hash"),
                        admin: msql_row.get("admin"),
                        joined: msql_row.get("joined"),
                        last_sign_in: msql_row.get("last_sign_in")
                    })),
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
                    Some(msql_row) => return Ok(Some(User {
                        uuid: Uuid::parse_str(msql_row.get("uuid")).expect("ERROR: Could not parse uuid for this user."),
                        email: msql_row.get("email"),
                        phone_number: msql_row.get("phone_number"),
                        p_hash: msql_row.get("p_hash"),
                        admin: msql_row.get("admin"),
                        joined: msql_row.get("joined"),
                        last_sign_in: msql_row.get("last_sign_in")

                    })),
                    None => return Ok(None),
                }
            }
        }
    } 

    pub async fn insert_user(email: &String, phone_number: &String, password: &String, data: &web::Data<AppState>) -> Result<sqlx::mysql::MySqlQueryResult, Error> {
        let result = sqlx::query("INSERT INTO users (uuid, email, phone_number, p_hash, admin, joined, last_sign_in) VALUES (uuid(),?,?,?,0,?,?)")
            .bind(email)
            .bind(phone_number)
            .bind(Hashing::hash(password))
            .bind(Utc::now())
            .bind(Utc::now())
            .execute(&data.pool)
            .await;
        result
    }

    pub async fn update_last_sign_in(&self, data: &web::Data<AppState>) -> Result<sqlx::mysql::MySqlQueryResult, Error> {
        let result = sqlx::query("UPDATE users SET last_sign_in = ? WHERE uuid = ?")
            .bind(Utc::now())
            .bind(self.uuid)
            .execute(&data.pool).await;
        result
    }


}