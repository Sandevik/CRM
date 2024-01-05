use actix_web::{post, HttpResponse, Responder, Scope, web};
use chrono::{Utc, Days};
use jsonwebtoken::{encode, Header, EncodingKey, errors::Error};
use serde::{Serialize, Deserialize};
use crate::{models::user::User, AppState, controllers::hashing::Hashing};
use super::Response;

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


#[derive(Serialize, Deserialize)]
struct DecodeSignIn {
    email: String,
    password: String,
}

#[post("/sign-in")]
async fn sign_in(body: web::Json<DecodeSignIn>, secret: web::Data<String>, data: web::Data<AppState>) -> impl Responder {

    let db_result: Result<Option<User>, sqlx::Error> = User::get_by_email(&body.email, &data).await;

    match db_result {
        Err(err) => HttpResponse::InternalServerError().json(Response::internal_server_error(&err.to_string())),
        Ok(user) => {
            match user {
                None => HttpResponse::BadRequest().json(Response::bad_request("Email or password is incorrect")),
                Some(user) => {
                        match Hashing::verify(body.password.to_string(), &user.p_hash) {
                        Err(_) => HttpResponse::BadRequest().json(Response::bad_request("Email or password is incorrect")),
                        Ok(_) => {
                            let u = user.update_last_sign_in(&data).await; // ignore the result as it is not essential for the program.
                            println!("{}", user.uuid);
                            println!("{:?}", u);
                            let jwt = create_jwt(&user, &secret);
                            match jwt {
                                Err(err) => HttpResponse::InternalServerError().json(Response::internal_server_error(&err.to_string())),
                                Ok(token) => HttpResponse::Ok().json(Response::ok("Success", Some(token)))
                            }
                        }
                    }
                }
            }
        }
    }

}


#[derive(Serialize, Deserialize)]
struct DecodeSignUp {
    email: String,
    password: String,
    phone_number: String,
}

#[post("/sign-up")]
async fn sign_up(body: web::Json<DecodeSignUp>, secret: web::Data<String>, data: web::Data<AppState>) -> impl Responder {

    let db_result = User::insert_user(&body.email, &body.phone_number, &body.password, &data).await;

    match db_result {
        Err(_err) => HttpResponse::InternalServerError().json(Response::internal_server_error("User already exists.")),
        Ok(_) => {
            match User::get_by_email(&body.email, &data).await {
                Err(err) => HttpResponse::InternalServerError().json(Response::internal_server_error(&err.to_string())),
                Ok(user) => {
                    match user {
                        None => HttpResponse::BadRequest().json(Response::bad_request("Could not fetch user")),
                        Some(user) => {
                            let jwt = create_jwt(&user, &secret);
                            match jwt {
                                Err(err) => HttpResponse::InternalServerError().json(&err.to_string()),
                                Ok(token) => HttpResponse::Created().json(Response::ok("Success", Some(token)))
                            }
                        }
                    }
                }
            } 
        }
    }
}



fn create_jwt(user: &User, secret: &web::Data<String>) -> Result<String, Error> {
    let exp: usize = Utc::now().checked_add_days(Days::new(7)).unwrap().timestamp() as usize;
    let token_claim: Claims = Claims { user: user.clone(), exp };
    encode(&Header::default(), &token_claim, &EncodingKey::from_secret(secret.as_bytes())) 
}
