use actix_web::web;
use chrono::{Utc, DateTime};
use serde::{Serialize, Deserialize};
use sqlx::{mysql::{MySqlQueryResult, MySqlRow}, Row};
use uuid::Uuid;
use crate::{AppState, models::user::User, controllers::database::Database};


#[derive(Serialize, Deserialize)]
pub struct CRM {
    #[serde(rename(serialize = "userUuid", deserialize = "userUuid"))]
    user_uuid: Uuid,
    #[serde(rename(serialize = "crmUuid", deserialize = "crmUuid"))]
    crm_uuid: Uuid,
    name: String,
    added: DateTime<Utc>,
    hidden: bool,
}

impl CRM {

    pub fn from_row(row: &MySqlRow) -> Self {
        CRM {
            user_uuid: Uuid::parse_str(row.get("user_uuid")).expect("ERROR: Could not parse uuid for this user."),
            crm_uuid: Uuid::parse_str(row.get("crm_uuid")).expect("ERROR: Could not parse uuid for this crm."),
            name: row.get("name"),
            added: row.get("added"),
            hidden: row.get("hidden")
        }
    }

    //creates a new crm system with all the associated tables
    pub async fn new(data: &web::Data<AppState>, user: &User, name: &String) -> Result<MySqlQueryResult, sqlx::Error> {
        let new_uuid: Uuid = Uuid::new_v4();
        let res: Result<MySqlQueryResult, sqlx::Error> = Database::setup_crm_users_table(&data.pool).await;
        if res.is_err() {return res;}
        let res: Result<MySqlQueryResult, sqlx::Error> = Database::setup_customers_table(&new_uuid, data).await;
        if res.is_err() {return res;}
        let res: Result<MySqlQueryResult, sqlx::Error> = Database::setup_entries_table(&new_uuid, data).await;
        if res.is_err() {return res;}
        let res: Result<MySqlQueryResult, sqlx::Error> = Database::setup_meetings_table(&new_uuid, data).await;
        if res.is_err() {return res;}
        let res: Result<MySqlQueryResult, sqlx::Error> = Database::setup_employees_table(&new_uuid, data).await;
        if res.is_err() {return res;}
        let res: Result<MySqlQueryResult, sqlx::Error> = Database::setup_deals_table(&new_uuid, data).await;
        if res.is_err() {return res;}

        sqlx::query("INSERT INTO `crm`.`crm_users`(`user_uuid`, `crm_uuid`, `added`, `name`) VALUES (?,?,?,?)")
            .bind(user.uuid.hyphenated().to_string())
            .bind(new_uuid.hyphenated().to_string())
            .bind(Utc::now())
            .bind(name)
            .execute(&data.pool)
            .await
    }


    pub async fn get_by_user(user: &User, data: &web::Data<AppState>) -> Result<Vec<Self>, sqlx::Error> {
        let mut crms: Vec<Self> = Vec::new();
        let result = sqlx::query("SELECT * FROM `crm`.`crm_users` WHERE `user_uuid` = ?")
            .bind(user.uuid.hyphenated().to_string())
            .fetch_all(&data.pool)
            .await;

        match result {
            Err(err) => Err(err),
            Ok(mysql_rows) => {
                mysql_rows.iter().for_each(|row| {
                    crms.push(Self::from_row(row));
                });
                Ok(crms)
            }
        }
    }

    pub async fn remove_by_uuid(data: &web::Data<AppState>, uuid: &Uuid) -> Result<MySqlQueryResult, sqlx::Error> {
        let uuid_string = uuid.hyphenated().to_string();
        // Drop all tables with a certain uuid
        let query = format!("DROP TABLE IF EXISTS `crm`.`{uuid_string}-customers`, `crm`.`{uuid_string}-entries`, `crm`.`{uuid_string}-meetings`, `crm`.`{uuid_string}-employees`, `crm`.`{uuid_string}-deals`");
        let res =sqlx::query(&query).execute(&data.pool).await;
        if res.is_err() {return res;}
        // clean the uuid record in crm_users
        sqlx::query("DELETE FROM `crm`.`crm_users` WHERE `crm_uuid` = ?")
            .bind(uuid_string)
            .execute(&data.pool)
            .await
    }

    pub async fn user_owns(user: &User, crm_uuid: Uuid, data: &web::Data<AppState>) -> Result<bool, sqlx::Error> {
        let res = sqlx::query("SELECT user_uuid FROM `crm`.`crm_users` WHERE `crm_uuid` = ?")
            .bind(crm_uuid.hyphenated().to_string())
            .fetch_optional(&data.pool)
            .await;

        match res {
            Err(err) => Err(err),
            Ok(option) => {
                match option {
                    None => Ok(false),
                    Some(row) => {
                        if Uuid::parse_str(row.get("user_uuid")).unwrap_or_default() == user.uuid {
                            Ok(true)
                        } else {
                            Ok(false)
                        }
                    }
                }
            }
        }

    }

}
