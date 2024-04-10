use actix_web::{post, HttpResponse, Responder, Scope, web::{self}};
use actix_web_httpauth::extractors::bearer::BearerAuth;
use serde::{Serialize, Deserialize};
use crate::{models::user::User, AppState, controllers::hashing::Hashing};
use super::Response;
use crate::controllers::jwt::JWT;


pub fn auth() -> Scope {
    let scope = web::scope("/auth")
        .route("", web::get().to(index))
        .route("/", web::get().to(index))
        .service(sign_in)
        .service(sign_up)
        .service(validate_token);
        
    scope
}

async fn index() -> impl Responder {
    HttpResponse::Ok().body("auth route")
} 



#[derive(Serialize, Deserialize)]
struct DecodeSignIn {
    #[serde(rename(deserialize = "emailOrPhoneNumber"))]
    email_or_phone_number: String,
    password: String,
}


#[derive(Serialize)]
struct SignResponse {
    token: String
}

#[post("/sign-in")]
async fn sign_in(body: web::Json<DecodeSignIn>, secret: web::Data<String>, data: web::Data<AppState>) -> impl Responder {

    let db_result: Result<Option<User>, sqlx::Error> = User::get_by_email_or_phone_number(&body.email_or_phone_number, &data).await;

    match db_result {
        Err(err) => HttpResponse::InternalServerError().json(Response::<String>::internal_server_error(&err.to_string())),
        Ok(user) => {
            match user {
                None => HttpResponse::BadRequest().json(Response::<String>::bad_request("Email or password is incorrect")),
                Some(user) => {
                        match Hashing::verify(body.password.to_string(), &user.password_hash) {
                        Err(_) => HttpResponse::BadRequest().json(Response::<String>::bad_request("Email or password is incorrect")),
                        Ok(_) => {
                            let jwt = JWT::create_jwt(&user, &secret);
                            match jwt {
                                Err(err) => HttpResponse::InternalServerError().json(Response::<String>::internal_server_error(&err.to_string())),
                                Ok(token) => {
                                    let _ = user.update_last_sign_in(&data).await;
                                    let _ = user.update_current_jwt(&token, &data).await;
                                    HttpResponse::Ok().json(Response::ok("Success", Some(SignResponse {token})))
                                }
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
    #[serde(rename(deserialize = "firstName", serialize = "firstName"))]
    first_name: String,
    #[serde(rename(deserialize = "lastName", serialize = "lastName"))]
    last_name: String,
    password: String,
    #[serde(rename(deserialize = "phoneNumber", serialize = "phoneNumber"))]
    phone_number: String,
    language: String,
}

#[post("/sign-up")]
async fn sign_up(body: web::Json<DecodeSignUp>, secret: web::Data<String>, data: web::Data<AppState>) -> impl Responder {
    let db_result: Result<String, sqlx::Error> = User::insert_user(&body.email, &body.first_name, &body.last_name, &body.phone_number, &body.password, &body.language, None, &data).await;
    match db_result {
        Err(err) => HttpResponse::InternalServerError().json(Response::<String>::internal_server_error(&err.to_string())),
        Ok(_) => {
            match User::get_by_email(&body.email, &data).await {
                Err(err) => HttpResponse::InternalServerError().json(Response::<String>::internal_server_error(&err.to_string())),
                Ok(user) => {
                    match user {
                        None => HttpResponse::BadRequest().json(Response::<String>::bad_request("Could not fetch user")),
                        Some(user) => {
                            let jwt = JWT::create_jwt(&user, &secret);
                            match jwt {
                                Err(err) => HttpResponse::InternalServerError().json(&err.to_string()),
                                Ok(token) => {
                                    let _ = user.update_last_sign_in(&data).await;
                                    let _ = user.update_current_jwt(&token, &data).await;
                                    HttpResponse::Created().json(Response::ok("Success", Some(SignResponse {token})))
                                }
                            }
                        }
                    }
                }
            } 
        }
    }
}


#[derive(Serialize, Deserialize)]
struct DecodeValidateToken {
    token: String
}

#[derive(Serialize)]
struct ValidateResponse {
    user: User
}

#[post("/validate-token")]
async fn validate_token(data: web::Data<AppState>, secret: web::Data<String>, credentials: BearerAuth) -> impl Responder {
    let token_string: String = credentials.token().to_string();
    match JWT::decode_jwt(&token_string, &secret) {
        Err(err) => HttpResponse::Unauthorized().json(Response::<String>::unauthorized(&err.to_string())),
        Ok(token_claim) => {
            match User::get_by_uuid(&token_claim.claims.user.uuid.hyphenated().to_string(), &data).await {
                Ok(db_user) => {
                    if db_user.is_some() && db_user.clone().unwrap().current_jwt.is_some() && db_user.unwrap().current_jwt.unwrap() == token_string {
                        HttpResponse::Ok().json(Response::ok("Authorized", Some(ValidateResponse {user: token_claim.claims.user})))
                    } else {
                        HttpResponse::Unauthorized().json(Response::<String>::unauthorized("Unauthorized, Your token has been updated"))
                    }
                }
                Err(err) => HttpResponse::Unauthorized().json(Response::<String>::unauthorized(&err.to_string())),
            }
        }
    }
}



