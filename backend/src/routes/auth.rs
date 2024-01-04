use actix_web::{post, HttpResponse, Responder, Scope, web};
use chrono::{Utc, Days};
use jsonwebtoken::{encode, Header, EncodingKey, errors::Error};
use serde::{Serialize, Deserialize};
use uuid::Uuid;
use crate::models::user::User;

use super::ErrorResponse;

pub fn auth() -> Scope {
    let scope = web::scope("/auth")
        .route("", web::get().to(index))
        .route("/", web::get().to(index))
        .service(login);
        
    scope
}




#[derive(Serialize, Deserialize)]
struct Claims {
    user: User,
    exp: usize,
}





async fn index() -> impl Responder {
    HttpResponse::Ok().body("login route")
} 

#[post("/login")]
async fn login(secret: web::Data<String>) -> impl Responder {

    //Handle login with hashing
    // returns a User

    let user = User {uuid: Uuid::new_v4(), username: "test".to_owned(), p_hash: "adjakfa".to_owned(), admin: true};

    //create JWT
    let jwt = create_jwt(user, secret);


    match jwt {
        Err(err) => HttpResponse::InternalServerError().json(ErrorResponse::internal_server_error(&err.to_string())),
        Ok(token) => HttpResponse::Ok().json(token)
    }

}


fn create_jwt(user: User, secret: web::Data<String>) -> Result<String, Error> {
    let exp: usize = Utc::now().checked_add_days(Days::new(7)).unwrap().timestamp() as usize;
    let token_claim: Claims = Claims { user, exp };
    encode(&Header::default(), &token_claim, &EncodingKey::from_secret(secret.as_bytes())) 
}
