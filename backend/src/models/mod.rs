use sqlx::mysql::MySqlRow;

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


trait Model {
    fn from_row(row: &MySqlRow) -> Self;
}