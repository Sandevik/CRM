use actix_web::{post, HttpResponse, Responder, Scope, web};
use chrono::{Utc, Days};
use jsonwebtoken::{encode, Header, EncodingKey, errors::Error};
use serde::{Serialize, Deserialize};
use crate::{models::user::User, AppState, hashing::Hashing};

use super::ErrorResponse;

pub fn auth() -> Scope {
    let scope = web::scope("/auth")
        .route("", web::get().to(index))
        .route("/", web::get().to(index))
        .service(sign_in)
        .service(sign_up);
        
    scope
}




#[derive(Serialize, Deserialize)]
struct Claims {
    user: User,
    exp: usize,
}





async fn index() -> impl Responder {
    HttpResponse::Ok().body("auth route")
} 

#[post("/sign-in")]
async fn sign_in(secret: web::Data<String>, data: web::Data<AppState>) -> impl Responder {


    // get username, password from request
    let email = "simon@test.com";
    let password = "test";
    
    let db_result: Result<Option<User>, sqlx::Error> = User::get_by_email(email, &data).await;

    match db_result {
        Err(err) => HttpResponse::InternalServerError().json(ErrorResponse::internal_server_error(&err.to_string())),
        Ok(user) => {
            match user {
                None => HttpResponse::BadRequest().json(ErrorResponse::bad_request("Username or password is incorrect")),
                Some(user) => {
                        match Hashing::verify(password.to_string(), &user.p_hash) {
                        Err(_) => HttpResponse::BadRequest().json(ErrorResponse::bad_request("Username or password is incorrect")),
                        Ok(_) => {
                            let jwt = create_jwt(user, secret);
                            match jwt {
                                Err(err) => HttpResponse::InternalServerError().json(ErrorResponse::internal_server_error(&err.to_string())),
                                Ok(token) => HttpResponse::Ok().json(token)
                            }
                        }
                    }
                }
            }
        }
    }

}


#[post("/sign-up")]
async fn sign_up(secret: web::Data<String>, data: web::Data<AppState>) -> impl Responder {

    //get data from request
    let email = "simon2".to_string();
    let phone_number = "03847384738".to_string();
    let password = "test2".to_string();

    let db_result = User::insert_user(&email, phone_number, password, &data).await;

    match db_result {
        Err(err) => HttpResponse::InternalServerError().json(ErrorResponse::internal_server_error(&err.to_string())),
        Ok(_) => {
            match User::get_by_email(&email, &data).await {
                Err(err) => HttpResponse::InternalServerError().json(ErrorResponse::internal_server_error(&err.to_string())),
                Ok(user) => {
                    match user {
                        None => HttpResponse::BadRequest().json(ErrorResponse::bad_request("Could not fetch user")),
                        Some(user) => {
                            let jwt = create_jwt(user, secret);
                            match jwt {
                                Err(err) => HttpResponse::InternalServerError().json(&err.to_string()),
                                Ok(token) => HttpResponse::Created().json(token)
                            }
                        }
                    }
                }
            } 
        }
    }
}



fn create_jwt(user: User, secret: web::Data<String>) -> Result<String, Error> {
    let exp: usize = Utc::now().checked_add_days(Days::new(7)).unwrap().timestamp() as usize;
    let token_claim: Claims = Claims { user, exp };
    encode(&Header::default(), &token_claim, &EncodingKey::from_secret(secret.as_bytes())) 
}
