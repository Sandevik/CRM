use actix_web::{body::{BoxBody, EitherBody}, dev::{ServiceFactory, ServiceRequest, ServiceResponse}, get, post, web, Error, HttpResponse, Responder, Scope};
use actix_web_httpauth::middleware::HttpAuthentication;
use uuid::Uuid;

use crate::{middleware::user_middleware::validator, models::user::User, AppState};
use serde::{Serialize, Deserialize};
use super::Response;
use crate::middleware::admin_middleware::validator as admin_validator;

//user
pub fn users_user() -> Scope<impl ServiceFactory<ServiceRequest, Config = (), Response = ServiceResponse<EitherBody<BoxBody>>, Error = Error, InitError = ()>> {
    let user_middleware = HttpAuthentication::bearer(validator);

    let scope = web::scope("/users")
        .wrap(user_middleware)
        .service(update_language);

    scope
}


// admin
pub fn users_admin() -> Scope<impl ServiceFactory<ServiceRequest, Config = (), Response = ServiceResponse<EitherBody<BoxBody>>, Error = Error, InitError = ()>> {
    let admin_auth_middleware = HttpAuthentication::bearer(admin_validator);

    let scope = web::scope("/users")
        .wrap(admin_auth_middleware)
        .route("", web::post().to(index))
        .route("/", web::post().to(index))
        .service(user_by_uuid)
        .service(user_by_username)
        .service(count);

    scope
}

#[derive(Serialize, Deserialize)]
struct DecodeAllUsersOptions {
    offset: u16,
    amount: u16,
}

async fn index(body: web::Json<DecodeAllUsersOptions>, data: web::Data<AppState>) -> impl Responder {
    let result: Result<Vec<User>, sqlx::Error> = User::get_all_users(body.amount, body.offset, &data).await;
    match result {
        Err(err) => HttpResponse::InternalServerError().json(Response::<String>::internal_server_error(&err.to_string())),
        Ok(users) => HttpResponse::Ok().json(users)
    }
}


#[derive(Serialize, Deserialize)]
struct CountResponse {
    count: i32
}

#[get("/count")]
async fn count(data: web::Data<AppState>) -> impl Responder {
    let count = User::get_users_count(&data).await;
    match count {
        Err(err) => HttpResponse::InternalServerError().json(Response::<String>::internal_server_error(&err.to_string())),
        Ok(count) => HttpResponse::Ok().json(CountResponse {count})
    }
}


#[get("/uuid/{uuid}")]
async fn user_by_uuid(path: web::Path<String>, data: web::Data<AppState>) -> impl Responder {
    let user: Result<Option<User>, sqlx::Error> = User::get_by_uuid(&path.into_inner(), &data).await;
    match user {
        Ok(optn) => {
            match optn {
                Some(user) => HttpResponse::Found().json(user),
                None => HttpResponse::NotFound().json(Response::<String>::not_found("User was not found"))
            }
        }
        Err(err) => HttpResponse::InternalServerError().json(Response::<String>::internal_server_error(&err.to_string()))
    }
}

#[get("/email/{email}")]
async fn user_by_username(path: web::Path<String>, data: web::Data<AppState>) -> impl Responder {
    let user: Result<Option<User>, sqlx::Error> = User::get_by_email(&path.into_inner(), &data).await;
    match user {
        Ok(optn) => {
            match optn {
                Some(user) => HttpResponse::Found().json(user),
                None => HttpResponse::NotFound().json(Response::<String>::not_found("User was not found"))
            }
        }
        Err(err) => HttpResponse::InternalServerError().json(Response::<String>::internal_server_error(&err.to_string()))
    }
}

#[derive(Deserialize)]
struct UpdateLanguageRequest {
    #[serde(rename(deserialize = "userUuid"))]
    user_uuid: String,
    language: String,
}

#[post("/update-language")]
async fn update_language(data: web::Data<AppState>, body: web::Json<UpdateLanguageRequest>) -> impl Responder {
    match User::update_language(&Uuid::parse_str(&body.user_uuid).unwrap_or_default(), &body.language.to_string(), &data).await {
        Err(err) => HttpResponse::InternalServerError().json(Response::<String>::internal_server_error(&err.to_string())),
        Ok(_) => HttpResponse::Ok().json(Response::<String>::ok("Language updated", None))
    }
}
