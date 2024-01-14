use sqlx::mysql::MySqlRow;

pub mod user;
pub mod crm;
pub mod customer;
pub mod entry;
pub mod employee;
pub mod deal;
pub mod meeting;

trait Model {
    fn from_row(row: &MySqlRow) -> Self;
}