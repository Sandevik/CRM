use actix_cors::Cors;
use actix_web::{web, App, HttpServer};
use dotenvy::dotenv;
use sqlx::{mysql::MySqlPoolOptions, MySql, Pool};
use std::env;
mod controllers;
mod middleware;
mod models;
mod routes;

use models::Model;
use controllers::database::Database;
use routes::routes;

struct AppState {
    pool: Pool<MySql>,
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();
    let server_address = env::var("BACKEND_SERVER_ADDRESS").unwrap_or("0.0.0.0".to_string());
    let server_port: u16 = env::var("BACKEND_SERVER_PORT")
        .unwrap_or("8081".to_string())
        .parse::<u16>()
        .unwrap();

    let db_url: String = env::var("DATABASE_URL").expect("ERROR: env DATABASE_URL was not set");
    let pool_res: Result<Pool<MySql>, sqlx::Error> = MySqlPoolOptions::new()
        .max_connections(10)
        .connect(&db_url)
        .await;
    if let Err(err) = pool_res {
        panic!("ERROR Connecting to DB, {err}, DATABASE_URL: {:?}", env::var("DATABASE_URL"))
    } else {
        let pool = pool_res.unwrap();

        Database::setup_tables(&pool)
            .await
            .expect("Could not setup tables");

        println!(
            "Server running on http://{}:{}",
            server_address, server_port
        );
        HttpServer::new(move || {
            App::new()
                .wrap(Cors::permissive())
                .app_data(web::Data::new(AppState { pool: pool.clone() }))
                .app_data(web::Data::new(
                    env::var("BACKEND_JWT_SECRET").expect("ERROR: BACKEND_JWT_SECRET not set"),
                ))
                .route("/", web::get().to(root))
                .configure(routes)
        })
        .bind((server_address, server_port))?
        .run()
        .await
    }
}

async fn root() -> String {
    "Server running".to_string()
}
