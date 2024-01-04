use dotenvy::dotenv;
use models::user::User;
use std::env;
use actix_web::{web, HttpServer, App, HttpResponse};
use sqlx::{mysql::MySqlPoolOptions, MySql, Pool};
mod routes;
mod models;
mod database;
use database::Database;
use routes::routes;






struct AppState {
    pool: Pool<MySql>
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();
    let server_address = env::var("BACKEND_SERVER_ADDRESS").unwrap_or("127.0.0.1".to_string());
    let server_port: u16 = env::var("BACKEND_SERVER_PORT").unwrap_or("8080".to_string()).parse::<u16>().unwrap();


    let db_url: String = format!("mysql://{}:{}@{}:{}/{}", env::var("BACKEND_MYSQL_USERNAME").unwrap(), env::var("BACKEND_MYSQL_PASSWORD").unwrap(), env::var("BACKEND_MYSQL_ADDRESS").unwrap(), env::var("BACKEND_MYSQL_PORT").unwrap(), env::var("BACKEND_MYSQL_PATH").unwrap());
    let pool: Pool<MySql> = MySqlPoolOptions::new()
        .max_connections(10)
        .connect(&db_url)
        .await
        .expect("ERROR: Could not connect to database");

    println!("Setting up users table...");
    Database::setup_users_table(&pool).await.expect("ERROR: Database setup failed.");
    println!("Users table set up!");


    println!("Server running on http://{}:{}", server_address, server_port);
    HttpServer::new(move|| {
        App::new()
        .app_data(web::Data::new(AppState {
            pool: pool.clone()
        }))
        .app_data(web::Data::new(env::var("BACKEND_JWT_SECRET").expect("ERROR: BACKEND_JWT_SECRET not set")))
            .route("/", web::get().to(root))
            .configure(routes)
    }).bind((server_address, server_port))?
    .run().await
}

async fn root() -> String {
    "Server running".to_string()
}


