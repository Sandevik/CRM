use actix_web::{web::{self}, get,  Responder, HttpResponse, Scope, post};

use crate::{AppState, models::user::User, extractors::admin_authentication::AdminAuthenticationToken, controllers::database::Database};
use serde::{Serialize, Deserialize};
use super::Response;
use crate::extractors::authentication::AuthenticationToken;

pub fn users() -> Scope {
    let scope = web::scope("/users")
        .route("", web::post().to(index))
        .route("/", web::post().to(index))
        .service(user_by_uuid)
        .service(user_by_username)
        .service(setup_customers_table)
        .service(count);

    scope
}

#[derive(Serialize, Deserialize)]
struct DecodeAllUsersOptions {
    offset: u16,
    amount: u16,
}

async fn index(body: web::Json<DecodeAllUsersOptions>, data: web::Data<AppState>, _admin_auth_token: AdminAuthenticationToken) -> impl Responder {
    let result: Result<Vec<User>, sqlx::Error> = User::get_all_users(body.amount, body.offset, &data).await;
    match result {
        Err(err) => HttpResponse::InternalServerError().json(Response::internal_server_error(&err.to_string())),
        Ok(users) => HttpResponse::Ok().json(users)
    }
}


#[derive(Serialize, Deserialize)]
struct CountResponse {
    count: i32
}

#[get("/count")]
async fn count(data: web::Data<AppState>, _auth_token: AdminAuthenticationToken) -> impl Responder {
    let count = User::get_users_count(&data).await;
    match count {
        Err(err) => HttpResponse::InternalServerError().json(Response::internal_server_error(&err.to_string())),
        Ok(count) => HttpResponse::Ok().json(CountResponse {count})
    }
}


#[get("/uuid/{uuid}")]
async fn user_by_uuid(path: web::Path<String>, data: web::Data<AppState>, _auth_token: AdminAuthenticationToken) -> impl Responder {
    let user: Result<Option<User>, sqlx::Error> = User::get_by_uuid(&path.into_inner(), &data).await;
    match user {
        Ok(optn) => {
            match optn {
                Some(user) => HttpResponse::Found().json(user),
                None => HttpResponse::NotFound().json(Response::not_found("User"))
            }
        }
        Err(err) => HttpResponse::InternalServerError().json(Response::internal_server_error(&err.to_string()))
    }
}

#[get("/email/{email}")]
async fn user_by_username(path: web::Path<String>, data: web::Data<AppState>, _auth_token: AdminAuthenticationToken) -> impl Responder {
    let user: Result<Option<User>, sqlx::Error> = User::get_by_email(&path.into_inner(), &data).await;
    match user {
        Ok(optn) => {
            match optn {
                Some(user) => HttpResponse::Found().json(user),
                None => HttpResponse::NotFound().json(Response::not_found("User"))
            }
        }
        Err(err) => HttpResponse::InternalServerError().json(Response::internal_server_error(&err.to_string()))
    }
}

#[post("/setup-customer-table")]
async fn setup_customers_table(data: web::Data<AppState>, auth_token: AuthenticationToken) -> impl Responder {
    let result = Database::setup_customers_table(&auth_token.user, data).await;
    match result {
        Err(err) => HttpResponse::InternalServerError().json(Response::internal_server_error(&err.to_string())),
        Ok(_) => HttpResponse::Created().json(Response::ok(format!("{}-customers", auth_token.user.uuid).as_str(), None, None))
    }
}
