use actix_web::web;
use chrono::{Days, Utc};
use jsonwebtoken::{errors::Error, Header, encode, EncodingKey, TokenData, Validation, Algorithm, DecodingKey, decode};
use serde::{Serialize, Deserialize};

use crate::models::user::User;

pub struct JWT;

impl JWT {
    pub fn create_jwt(user: &User, secret: &web::Data<String>) -> Result<String, Error> {
        let exp: u64 = Utc::now().checked_add_days(Days::new(7)).unwrap().timestamp() as u64;
        let token_claim: Claims = Claims { user: user.clone(), exp };
        encode(&Header::default(), &token_claim, &EncodingKey::from_secret(secret.as_bytes())) 
    }
    
    pub fn decode_jwt(raw_token: &String, secret: &web::Data<String>) -> Result<TokenData<Claims>, Error> {
        decode(&raw_token, &DecodingKey::from_secret(secret.as_bytes()), &Validation::new(Algorithm::HS256))
    }
}

#[derive(Serialize, Deserialize)]
pub struct Claims {
    pub user: User,
    pub exp: u64,
}