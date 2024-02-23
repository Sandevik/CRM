use actix_cors::Cors;
use dotenvy::dotenv;
use std::env;
use actix_web::{web, HttpServer, App};
use sqlx::{mysql::MySqlPoolOptions, MySql, Pool};
mod routes;
mod models;
mod controllers;
mod middleware;

use controllers::database::Database;
use routes::routes;

struct AppState {
    pool: Pool<MySql>
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();
    let server_address = env::var("BACKEND_SERVER_ADDRESS").unwrap_or("127.0.0.1".to_string());
    let server_port: u16 = env::var("BACKEND_SERVER_PORT").unwrap_or("8080".to_string()).parse::<u16>().unwrap();

    let db_url: String = env::var("DATABASE_URL").expect("ERROR: env DATABASE_URL was not set");
    let pool: Pool<MySql> = MySqlPoolOptions::new()
        .max_connections(10)
        .connect(&db_url)
        .await
        .expect("ERROR: Could not connect to database");

    Database::setup_tables(&pool).await.expect("Could not setup tables");

    println!("Server running on http://{}:{}", server_address, server_port);
    HttpServer::new(move|| {
        
        App::new()
        .wrap(Cors::permissive())
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




