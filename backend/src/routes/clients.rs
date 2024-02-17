use actix_web::{body::{EitherBody, BoxBody}, delete, dev::{ServiceFactory, ServiceRequest, ServiceResponse}, get, post, put, web, Error, HttpResponse, Responder, Scope};
use actix_web_httpauth::middleware::HttpAuthentication;
use chrono::{NaiveDate, Utc};
use serde::{Serialize, Deserialize};
use uuid::Uuid;
use crate::{middleware::owns_or_admin_middleware::RequiresUuid, routes::Response};
use crate::{middleware::owns_or_admin_middleware::validator, AppState, models::client::Client};

use super::Limit;

pub fn clients() -> Scope<impl ServiceFactory<ServiceRequest, Config = (), Response = ServiceResponse<EitherBody<BoxBody>>, Error = Error, InitError = ()>> {
    let owner_or_admin_middleware = HttpAuthentication::bearer(validator);
    
    let scope = web::scope("/clients")
        .wrap(owner_or_admin_middleware)
        .service(by_uuid)
        .service(create_client)
        .service(get_all)
        .service(search)
        .service(update_client)
        .service(delete_client)
        .service(update_client_note)
        .service(get_statistics);
        
    scope
}

#[derive(Serialize, Deserialize)]
struct ClientByUuidRequest {
    #[serde(rename(deserialize = "crmUuid"))]
    crm_uuid: String, //crm uuid
    #[serde(rename(deserialize = "clientUuid"))]
    client_uuid: String,
}

#[get("")]
async fn by_uuid(query: web::Query<ClientByUuidRequest>, data: web::Data<AppState>) -> impl Responder {
    let client_uuid = Uuid::parse_str(&query.client_uuid).unwrap_or_default();
    let crm_uuid = Uuid::parse_str(&query.crm_uuid).unwrap_or_default();
    match Client::get_by_uuid(&client_uuid, &crm_uuid, &data).await {
        Err(err) => HttpResponse::InternalServerError().json(Response::<String>::internal_server_error(&err.to_string())),
        Ok(client) => HttpResponse::Ok().json(Response::ok("Successfully fetched client", client))
    }
}




#[derive(Deserialize)]
struct AllRequest {
    #[serde(rename(deserialize = "crmUuid"))]
    crm_uuid: String,
    offset: Option<u16>,
    limit: Option<u16>
}

#[get("/all")]
async fn get_all(data: web::Data<AppState>, query: web::Query<AllRequest>) -> impl Responder {
    match Client::get_all(&Uuid::parse_str(&query.crm_uuid).unwrap_or_default(), match &query.limit {None => Limit::None, Some(u) => Limit::Some(*u)}, query.offset, &data).await {
        Err(err) => HttpResponse::InternalServerError().json(Response::<String>::internal_server_error(&err.to_string())),
        Ok(client) => HttpResponse::Ok().json(Response::ok("Successfully fetched client", Some(client)))
    }
}


#[derive(Deserialize)]
struct SearchRequest {
    #[serde(rename(deserialize = "crmUuid"))]
    crm_uuid: String,
    q: String,
}

#[get("/search")]
async fn search(data: web::Data<AppState>, query: web::Query<SearchRequest>) -> impl Responder {
    match Client::search(&Uuid::parse_str(&query.crm_uuid).unwrap_or_default(), &query.q, Limit::Some(20), &data).await {
        Err(err) => HttpResponse::InternalServerError().json(Response::<String>::internal_server_error(&err.to_string())),
        Ok(client) => HttpResponse::Ok().json(Response::ok("Successfully searched clients", Some(client)))
    }
}


#[derive(Deserialize)]
struct CreateClientRequest {
    #[serde(rename(serialize = "crmUuid", deserialize = "crmUuid"))]
    crm_uuid: String,
    #[serde(rename(serialize = "firstName", deserialize = "firstName"))]
    first_name: Option<String>,
    #[serde(rename(serialize = "lastName", deserialize = "lastName"))]
    last_name: Option<String>,
    #[serde(rename(serialize = "dateOfBirth", deserialize = "dateOfBirth"))]
    date_of_birth: Option<NaiveDate>,
    email: String,
    address: Option<String>,
    #[serde(rename(serialize = "zipCode", deserialize = "zipCode"))]
    zip_code: Option<String>,
    city: Option<String>,
    country: Option<String>,
    company: Option<String>,
    #[serde(rename(serialize = "phoneNumber", deserialize = "phoneNumber"))]
    phone_number: Option<String>,
    #[serde(rename(serialize = "newsLetter", deserialize = "newsLetter"))]
    news_letter: bool,
}


#[post("/create")]
async fn create_client(data: web::Data<AppState>, body: web::Json<CreateClientRequest>) -> impl Responder {
    let client: Client = Client::new(&Uuid::parse_str(&body.crm_uuid).unwrap_or_default(), body.first_name.clone(), body.last_name.clone(), body.date_of_birth.clone(), body.email.clone(), body.address.clone(), body.zip_code.clone(), body.city.clone(), body.country.clone(), body.company.clone(), body.phone_number.clone(), body.news_letter.clone());
    match client.insert(&Uuid::parse_str(&body.crm_uuid).unwrap_or_default(), &data).await {
        Err(err) => HttpResponse::InternalServerError().json(Response::<String>::internal_server_error(&err.to_string())),
        Ok(_) => HttpResponse::Created().json(Response::<String>::created("Successfully created client"))
    }
}

#[derive(Deserialize)]

struct UpdateRequest {
    uuid: String,
    #[serde(rename(serialize = "firstName", deserialize = "firstName"))]
    first_name: Option<String>,
    #[serde(rename(serialize = "lastName", deserialize = "lastName"))]
    last_name: Option<String>,
    #[serde(rename(serialize = "dateOfBirth", deserialize = "dateOfBirth"))]
    date_of_birth: Option<NaiveDate>,
    email: String,
    address: Option<String>,
    #[serde(rename(serialize = "zipCode", deserialize = "zipCode"))]
    zip_code: Option<String>,
    city: Option<String>,
    country: Option<String>,
    company: Option<String>,
    #[serde(rename(serialize = "phoneNumber", deserialize = "phoneNumber"))]
    phone_number: Option<String>,
    #[serde(rename(serialize = "newsLetter", deserialize = "newsLetter"))]
    news_letter: bool,
}

#[put("")]
async fn update_client(data: web::Data<AppState>, body: web::Json<UpdateRequest>, query: web::Query<RequiresUuid>) -> impl Responder {
    let client: Client = Client {
        crm_uuid: Uuid::parse_str(&query.crm_uuid).unwrap_or_default(),
        uuid: Uuid::parse_str(&body.uuid).unwrap_or_default(),
        first_name: body.first_name.clone(),
        last_name: body.last_name.clone(),
        date_of_birth: body.date_of_birth.clone(),
        email: body.email.clone(),
        address: body.address.clone(),
        zip_code: body.zip_code.clone(),
        city: body.city.clone(),
        country: body.country.clone(),
        company: body.company.clone(),
        phone_number: body.phone_number.clone(),
        news_letter: body.news_letter,
        ..Client::default()
    };
    
    match client.update(&data).await {
            Err(err) => HttpResponse::InternalServerError().json(Response::<String>::internal_server_error(&err.to_string())),
            Ok(_) => HttpResponse::Ok().json(Response::<String>::ok("Successfully updated client", None))
        }
}


#[derive(Serialize, Deserialize)]
struct UpdateNoteBodyRequest {
    note: String,
    uuid: String,
}

#[put("/note")]
async fn update_client_note(data: web::Data<AppState>, body: web::Json<UpdateNoteBodyRequest>, query: web::Query<RequiresUuid>) -> impl Responder {
    let client: Client = Client {
        crm_uuid: Uuid::parse_str(&query.crm_uuid).unwrap_or_default(),
        uuid: Uuid::parse_str(&body.uuid).unwrap_or_default(),
        note: Some(body.note.clone()),
        ..Client::default()
    };
    match client.update_note(&data).await {
        Err(err) => HttpResponse::InternalServerError().json(Response::<String>::internal_server_error(&err.to_string())),
        Ok(_) => HttpResponse::Ok().json(Response::<String>::ok("Successfully updated client note", None))
    }
}



#[derive(Deserialize)]
struct DeleteRequest {
    uuid: String,
    #[serde(rename(deserialize = "crmUuid"))]
    crm_uuid: String,
}

#[delete("")]
async fn delete_client(data: web::Data<AppState>, query: web::Query<DeleteRequest>) -> impl Responder {
    match Client::delete_client(&Uuid::parse_str(&query.uuid).unwrap_or_default(), &Uuid::parse_str(&query.crm_uuid).unwrap_or_default(), &data).await {
        Err(err) => HttpResponse::InternalServerError().json(Response::<String>::internal_server_error(&err.to_string())),
        Ok(_) => HttpResponse::Ok().json(Response::<String>::ok("Successfully deleted client", None))
    }
}


#[get("/statistics")]
async fn get_statistics(data: web::Data<AppState>, query: web::Query<ClientByUuidRequest>) -> impl Responder {
    let client: Client = Client {crm_uuid: Uuid::parse_str(&query.crm_uuid).unwrap_or_default(), uuid: Uuid::parse_str(&query.client_uuid).unwrap_or_default(), ..Client::default()};
    match client.get_statistics(&data).await {
        Err(err) => HttpResponse::InternalServerError().json(Response::<String>::internal_server_error(&err.to_string())),
        Ok(stats) => {
            if let None = stats {
                return HttpResponse::Ok().json(Response::<String>::ok("No statistics was found", None));
            } 
            HttpResponse::Ok().json(Response::ok("Successfully fetched client statistics", stats))
        }
    }
}