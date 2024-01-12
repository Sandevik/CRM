use actix_web::web;
use chrono::Utc;
use sqlx::mysql::MySqlQueryResult;
use uuid::Uuid;
use crate::{AppState, models::user::User};
use super::database::Database;
pub struct CRM ();

impl CRM {

    //creates a new crm system with all the associated tables
    pub async fn new(data: &web::Data<AppState>, user: &User) -> Result<MySqlQueryResult, sqlx::Error> {
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

        sqlx::query("INSERT INTO `crm`.`crm_users`(`user_uuid`, `crm_uuid`, `added`) VALUES (?,?,?)")
            .bind(user.uuid.hyphenated().to_string())
            .bind(new_uuid.hyphenated().to_string())
            .bind(Utc::now())
            .execute(&data.pool)
            .await

        // create all of the database tables




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




}