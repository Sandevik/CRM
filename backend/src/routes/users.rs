use actix_web::{web::{self}, get,  Responder, HttpResponse, Scope};

use crate::{AppState, models::user::User};

use super::Response;

pub fn users() -> Scope {
    let scope = web::scope("/users")
        .route("", web::get().to(index))
        .route("/", web::get().to(index))
        .service(user_by_uuid)
        .service(user_by_username);

    scope
}

async fn index() -> impl Responder {
    HttpResponse::Ok().body("users")
}

#[get("/uuid/{uuid}")]
async fn user_by_uuid(path: web::Path<String>, data: web::Data<AppState>) -> impl Responder {
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
async fn user_by_username(path: web::Path<String>, data: web::Data<AppState>) -> impl Responder {
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

/* #[post("/new")]
async fn new_user(_path: web::Path<String>, data: web::Data<AppState>) -> impl Responder {

    let email = "simon.sandevik@outlook.com".to_string();

    let res = User::insert_user(&email, "070707070707".to_string(), "test123".to_string(), &data).await;

    match res {
        Ok(_query_result) => HttpResponse::Created().body("User created."),
        Err(err) => HttpResponse::InternalServerError().body(format!("internal server error: {err}"))
    }


} */