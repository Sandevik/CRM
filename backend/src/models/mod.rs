use actix_web::web;
use sqlx::mysql::MySqlRow;

use crate::AppState;

pub mod user;
pub mod crm;
pub mod customer;
pub mod entry;
pub mod employee;
pub mod deal;
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
}