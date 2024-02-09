use actix_web::web;
use chrono::{Utc, DateTime};
use serde::{Serialize, Deserialize};
use sqlx::{mysql::{MySqlQueryResult, MySqlRow}, Row};
use uuid::Uuid;
use crate::{AppState, models::user::User, routes::{Limit, MeetingsOption}};
use super::{Model, client::Client, employee::Employee, meeting::Meeting, deal::Deal};



#[derive(Serialize, Deserialize)]
pub struct CRM {
    #[serde(rename(serialize = "userUuid", deserialize = "userUuid"))]
    user_uuid: Uuid,
    #[serde(rename(serialize = "crmUuid", deserialize = "crmUuid"))]
    crm_uuid: Uuid,
    name: String,
    added: DateTime<Utc>,
    hidden: bool,
    #[serde(skip_serializing_if = "Option::is_none")]
    clients: Option<Vec<Client>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    employees: Option<Vec<Employee>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    meetings: Option<Vec<Meeting>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    deals: Option<Vec<Deal>>,
}

impl Model for CRM {
    fn from_row(row: &MySqlRow) -> Self {
        CRM {
            user_uuid: Uuid::parse_str(row.get("user_uuid")).expect("ERROR: Could not parse uuid for this user."),
            crm_uuid: Uuid::parse_str(row.get("crm_uuid")).expect("ERROR: Could not parse uuid for this crm."),
            name: row.get("name"),
            added: row.get("added"),
            hidden: row.get("hidden"),
            clients: None,
            employees: None,
            deals: None,
            meetings: None,
        }
    }
}



impl CRM {


    pub async fn get_clients(&mut self, limit: Limit, offset: Option<u16>, data: &web::Data<AppState>) {
        match Client::get_all(&self.crm_uuid, limit, offset, data).await {
            Err(err) => println!("{err}"),
            Ok(clients) => {
                self.clients = Some(clients);
            }
        }

    }

    pub async fn get_meetings(&mut self, meeting_option: MeetingsOption, limit: Limit, data: &web::Data<AppState>) {
        match Meeting::get_all(&self.crm_uuid, meeting_option, limit, data).await {
            Err(err) => println!("{err}"),
            Ok(meetings) => {
                self.meetings = Some(meetings);
            }
        }
    }

    
    //creates a new crm system with all the associated tables
    pub async fn new(data: &web::Data<AppState>, user: &User, name: &String) -> Result<MySqlQueryResult, sqlx::Error> {
        let new_uuid: Uuid = Uuid::new_v4();
        sqlx::query("INSERT INTO `crm`.`crm_users`(`user_uuid`, `crm_uuid`, `added`, `name`) VALUES (?,?,?,?)")
            .bind(user.uuid.hyphenated().to_string())
            .bind(new_uuid.hyphenated().to_string())
            .bind(Utc::now())
            .bind(name)
            .execute(&data.pool)
            .await
    }


    pub async fn get_all_by_user(user: &User, data: &web::Data<AppState>) -> Result<Vec<Self>, sqlx::Error> {
        let mut crms: Vec<Self> = Vec::new();
        match sqlx::query("SELECT * FROM `crm`.`crm_users` WHERE `user_uuid` = ?")
            .bind(user.uuid.hyphenated().to_string())
            .fetch_all(&data.pool)
            .await {
                Err(err) => Err(err),
                Ok(mysql_rows) => {
                    mysql_rows.iter().for_each(|row| {
                        crms.push(Self::from_row(row));
                    });
                    Ok(crms)
                }
        }
    }

    pub async fn get_by_crm_uuid(crm_uuid: &Uuid, data: &web::Data<AppState>) -> Result<Option<Self>, sqlx::Error> {
        let query = "SELECT * FROM `crm`.`crm_users` WHERE `crm_uuid` = ?";
        match sqlx::query(query)
            .bind(crm_uuid.hyphenated().to_string())
            .fetch_optional(&data.pool)
            .await {
                Err(err) => Err(err),
                Ok(maybe_row) => {
                    match maybe_row {
                        None => Ok(None),
                        Some(row) => {
                            let crm: CRM = Self::from_row(&row);
                            // add more tables to crm
                            Ok(Some(crm))
                        }
                    }
                }
            }
    }


    pub async fn remove_by_uuid(data: &web::Data<AppState>, uuid: &Uuid) -> Result<(), sqlx::Error> {
        let uuid_string = uuid.hyphenated().to_string();
        if let Err(err) = sqlx::query("DELETE FROM `crm`.`crm_users` WHERE `crm_uuid` = ?").bind(&uuid_string).execute(&data.pool).await {
            return Err(err)
        }
        if let Err(err) = sqlx::query("DELETE FROM `crm`.`clients` WHERE `crm_uuid` = ?").bind(&uuid_string).execute(&data.pool).await {
            return Err(err)
        }
        if let Err(err) = sqlx::query("DELETE FROM `crm`.`entries` WHERE `crm_uuid` = ?").bind(&uuid_string).execute(&data.pool).await {
            return Err(err)
        }
        if let Err(err) = sqlx::query("DELETE FROM `crm`.`meetings` WHERE `crm_uuid` = ?").bind(&uuid_string).execute(&data.pool).await {
            return Err(err)
        }
        if let Err(err) = sqlx::query("DELETE FROM `crm`.`employees` WHERE `crm_uuid` = ?").bind(&uuid_string).execute(&data.pool).await {
            return Err(err)
        }
        if let Err(err) = sqlx::query("DELETE FROM `crm`.`deals` WHERE `crm_uuid` = ?").bind(&uuid_string).execute(&data.pool).await {
            return Err(err)
        }
        Ok(())
    }

    pub async fn user_owns(user: &User, crm_uuid: &Uuid, data: &web::Data<AppState>) -> Result<bool, sqlx::Error> {
        match sqlx::query("SELECT user_uuid FROM `crm`.`crm_users` WHERE `crm_uuid` = ?")
            .bind(crm_uuid.hyphenated().to_string())
            .fetch_optional(&data.pool)
            .await {
                Err(_err) => Ok(false),
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
