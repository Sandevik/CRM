use actix_web::web;
use sqlx::{mysql::MySqlRow, MySql, Pool};

use crate::AppState;

pub mod user;
pub mod crm;
pub mod customer;
pub mod entry;
pub mod employee;
pub mod meeting;
pub mod task;
pub mod time_report;
pub mod _break;
pub mod contract;
pub mod company;


pub trait Model {
    fn from_row(row: &MySqlRow) -> Self;
    async fn insert(&self, data: &web::Data<AppState>) -> Result<(), sqlx::Error>;
    async fn update(&self, data: &web::Data<AppState>) -> Result<(), sqlx::Error>;
    
    // Handles semi automatic creation and altering of tables (migrations) 
    fn sql_row_arrays() -> Vec<[&'static str; 2]>;
    async fn create_table(pool: &Pool<MySql>) -> Result<(), sqlx::Error>;
    async fn alter_table(pool: &Pool<MySql>) -> Result<(), sqlx::Error>;
    async fn migrate_table(pool: &Pool<MySql>) -> Result<(), sqlx::Error>;
    
}
