use actix_web::web;
use serde::{self, Serialize, Deserialize};
use sqlx::{Error, Row};
use uuid::Uuid;
use crate::AppState;

#[derive(sqlx::FromRow, Debug, Serialize, Deserialize)]
pub struct User {
    pub uuid: Uuid, 
    pub username: String,
    #[serde(skip_serializing)]
    pub p_hash: String,
    pub admin: bool,
}

impl User {
    
    pub async fn get_by_username(username: &str, data: web::Data<AppState>) -> Result<Option<User>, Error> {
        let res = sqlx::query("SELECT * FROM users WHERE username = ?").bind(username).fetch_optional(&data.pool).await;
        match res {
            Err(err) => return Err(err),
            Ok(row) => {
                match row {
                    Some(msql_row) => return Ok(Some(User {
                        uuid: Uuid::parse_str(msql_row.get("uuid")).expect("ERROR: Could not parse uuid for this user."),
                        username: msql_row.get("username"),
                        p_hash: msql_row.get("p_hash"),
                        admin: msql_row.get("admin")
                    })),
                    None => return Ok(None),
                }
            }
        }
    }

    pub async fn get_by_uuid(uuid: &String, data: web::Data<AppState>) -> Result<Option<User>, Error> {
        let res = sqlx::query("SELECT * FROM users WHERE uuid = ?").bind(uuid).fetch_optional(&data.pool).await;
        match res {
            Err(err) => return Err(err),
            Ok(row) => {
                match row {
                    Some(msql_row) => return Ok(Some(User {
                        uuid: Uuid::parse_str(msql_row.get("uuid")).expect("ERROR: Could not parse uuid for this user."),
                        username: msql_row.get("username"),
                        p_hash: msql_row.get("p_hash"),
                        admin: msql_row.get("admin")
                    })),
                    None => return Ok(None),
                }
            }
        }
    } 

    pub async fn insert_user(username: String, password: String, data: web::Data<AppState>) -> Result<sqlx::mysql::MySqlQueryResult, Error> {
        let result = sqlx::query("INSERT INTO users (uuid, username, password_hash, admin) VALUES (uuid(),?,?,0)")
            .bind(username)
            .bind(password)
            .execute(&data.pool)
            .await;
        result
    }


}