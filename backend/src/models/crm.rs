use actix_web::web;
use chrono::{Utc, DateTime};
use serde::{Serialize, Deserialize};
use sqlx::{mysql::{MySqlQueryResult, MySqlRow}, Row};
use uuid::Uuid;
use crate::{AppState, models::user::User, routes::{Limit, MeetingsOption}};
use super::{Model, customer::Customer, employee::Employee, meeting::Meeting, deal::Deal};



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
    customers: Option<Vec<Customer>>,
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
            user_uuid: Uuid::parse_str(row.get("user_uuid")).expect("ERROR: Could not parse uuid for this crm."),
            crm_uuid: Uuid::parse_str(row.get("crm_uuid")).expect("ERROR: Could not parse uuid for this crm."),
            name: row.get("name"),
            added: row.get("added"),
            hidden: row.get("hidden"),
            customers: None,
            employees: None,
            deals: None,
            meetings: None,
        }
    }

    async fn insert(&self, data: &web::Data<AppState>) -> Result<(), sqlx::Error> {
        todo!();
    }

    async fn update(&self, data: &web::Data<AppState>) -> Result<(), sqlx::Error> {
        todo!();
    }


}



impl CRM {


    pub async fn get_customers(&mut self, limit: Limit, offset: Option<u16>, data: &web::Data<AppState>) {
        match Customer::get_all(&self.crm_uuid, limit, offset, data).await {
            Err(err) => println!("{err}"),
            Ok(customers) => {
                self.customers = Some(customers);
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
        if let Err(err) = sqlx::query("DELETE FROM `crm`.`customers` WHERE `crm_uuid` = ?").bind(&uuid_string).execute(&data.pool).await {
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
                            if Uuid::parse_str(row.get("user_uuid")).expect("ERROR: Could not parse user uuid") == user.uuid {
                                Ok(true)
                            } else {
                                Ok(false)
                            }
                        }
                    }
                }
            }
    }

    pub async fn user_owns_or_is_admin(user: &User, crm_uuid: &Uuid, data: &web::Data<AppState>) -> Result<bool, sqlx::Error> {
        let owns = match sqlx::query("SELECT user_uuid FROM `crm`.`crm_users` WHERE `crm_uuid` = ?")
            .bind(crm_uuid.hyphenated().to_string())
            .fetch_optional(&data.pool)
            .await {
                Err(_err) => Ok(false),
                Ok(option) => {
                    return match option {
                        None => Ok(false),
                        Some(row) => {
                            if Uuid::parse_str(row.get("user_uuid")).expect("ERROR: Could not parse user uuid") == user.uuid {
                                Ok(true)
                            } else {
                                Ok(false)
                            }
                        }
                    }
                }
            };
            if let Err(err) = owns {
                return err;
            }
            if let Ok(true) = owns {
                return Ok(true);
            } else {
                match sqlx::query("SELECT is_admin FROM `crm` . `user_employee` WHERE `user_uuid` = ? AND `crm_uuid` = ?")
                .bind(&user.uuid.hyphenated().to_string())
                .bind(&crm_uuid.hyphenated().to_string())
                .fetch_optional(&data.pool)
                .await {
                    Err(err) => Err(err),
                    Ok(row_opt) => {
                        match row_opt {
                            None => Ok(false),
                            Some(row) => {
                                let is_admin: Option<bool> = row.get("is_admin");
                                if let None = is_admin {
                                    return Ok(false);
                                } else {
                                    return Ok(is_admin.unwrap());
                                }
                            }
                        }
                    }
                }
            }
    }

    pub async fn user_can_report_time(user: &User, crm_uuid: &Uuid, data: &web::Data<AppState>) -> Result<bool, sqlx::Error> {
        match sqlx::query("SELECT can_report_time FROM `crm` . `user_employee` WHERE `user_uuid` = ? AND `crm_uuid` = ?")
                .bind(&user.uuid.hyphenated().to_string())
                .bind(&crm_uuid.hyphenated().to_string())
                .fetch_optional(&data.pool)
                .await {
                    Err(err) => Err(err),
                    Ok(row_opt) => {
                        match row_opt {
                            None => Ok(false),
                            Some(row) => {
                                let can_report_time: Option<bool> = row.get("can_report_time");
                                if let None = can_report_time {
                                    return Ok(false);
                                } else {
                                    return Ok(can_report_time.unwrap());
                                }
                            }
                        }
                    }
                }
    }

    pub async fn user_can_access_crm(user: &User, crm_uuid: &Uuid, data: &web::Data<AppState>) -> Result<bool, sqlx::Error> {
        match sqlx::query("SELECT can_access_crm FROM `crm` . `user_employee` WHERE `user_uuid` = ? AND `crm_uuid` = ?")
                .bind(&user.uuid.hyphenated().to_string())
                .bind(&crm_uuid.hyphenated().to_string())
                .fetch_optional(&data.pool)
                .await {
                    Err(err) => Err(err),
                    Ok(row_opt) => {
                        match row_opt {
                            None => Ok(false),
                            Some(row) => {
                                let can_access_crm: Option<bool> = row.get("can_access_crm");
                                if let None = can_access_crm {
                                    return Ok(false);
                                } else {
                                    return Ok(can_access_crm.unwrap());
                                }
                            }
                        }
                    }
                }
    }
    pub async fn user_can_handle_employees(user: &User, crm_uuid: &Uuid, data: &web::Data<AppState>) -> Result<bool, sqlx::Error> {
        match sqlx::query("SELECT can_handle_employees FROM `crm` . `user_employee` WHERE `user_uuid` = ? AND `crm_uuid` = ?")
                .bind(&user.uuid.hyphenated().to_string())
                .bind(&crm_uuid.hyphenated().to_string())
                .fetch_optional(&data.pool)
                .await {
                    Err(err) => Err(err),
                    Ok(row_opt) => {
                        match row_opt {
                            None => Ok(false),
                            Some(row) => {
                                let can_handle_employees: Option<bool> = row.get("can_handle_employees");
                                if let None = can_handle_employees {
                                    return Ok(false);
                                } else {
                                    return Ok(can_handle_employees.unwrap());
                                }
                            }
                        }
                    }
                }
    }
    pub async fn user_can_handle_customers(user: &User, crm_uuid: &Uuid, data: &web::Data<AppState>) -> Result<bool, sqlx::Error> {
        match sqlx::query("SELECT can_handle_customers FROM `crm` . `user_employee` WHERE `user_uuid` = ? AND `crm_uuid` = ?")
                .bind(&user.uuid.hyphenated().to_string())
                .bind(&crm_uuid.hyphenated().to_string())
                .fetch_optional(&data.pool)
                .await {
                    Err(err) => Err(err),
                    Ok(row_opt) => {
                        match row_opt {
                            None => Ok(false),
                            Some(row) => {
                                let can_handle_customers: Option<bool> = row.get("can_handle_customers");
                                if let None = can_handle_customers {
                                    return Ok(false);
                                } else {
                                    return Ok(can_handle_customers.unwrap());
                                }
                            }
                        }
                    }
                }
    }
    pub async fn user_can_handle_vehicles(user: &User, crm_uuid: &Uuid, data: &web::Data<AppState>) -> Result<bool, sqlx::Error> {
        match sqlx::query("SELECT can_handle_vehicles FROM `crm` . `user_employee` WHERE `user_uuid` = ? AND `crm_uuid` = ?")
                .bind(&user.uuid.hyphenated().to_string())
                .bind(&crm_uuid.hyphenated().to_string())
                .fetch_optional(&data.pool)
                .await {
                    Err(err) => Err(err),
                    Ok(row_opt) => {
                        match row_opt {
                            None => Ok(false),
                            Some(row) => {
                                let can_handle_vehicles: Option<bool> = row.get("can_handle_vehicles");
                                if let None = can_handle_vehicles {
                                    return Ok(false);
                                } else {
                                    return Ok(can_handle_vehicles.unwrap());
                                }
                            }
                        }
                    }
                }
    }

    pub async fn get_all_by_user_uuid(user_uuid: &Uuid, data: &web::Data<AppState>) -> Result<Vec<CRM>, sqlx::Error> {
        match sqlx::query("SELECT `crm` . `crm_users` . `crm_uuid`, `crm` . `crm_users` . `user_uuid`, `crm` . `crm_users` . `name`, `crm` . `crm_users` . `hidden`, `crm` . `crm_users` . `added` FROM `crm` . `crm_users` LEFT JOIN `crm` . `user_employee` ON `crm` . `crm_users` . `crm_uuid` = `crm` . `user_employee` . `crm_uuid` LEFT JOIN `crm` . `employees` ON `crm` . `employees` . `crm_uuid` = `crm` . `user_employee` . `crm_uuid` WHERE `crm` . `employees` . `user_uuid` = ? AND `crm` . `user_employee` . `can_access_crm` = TRUE AND `crm` . `crm_users` . `user_uuid` <> `crm` . `employees` . `user_uuid`")
        .bind(&user_uuid.hyphenated().to_string())
        .fetch_all(&data.pool)
        .await {
            Err(err) => Err(err),
            Ok(rows) => {
                Ok(rows.iter().map(|row| {
                    CRM::from_row(row)   
                }).collect::<Vec<CRM>>())
            }
        }
    }

}
