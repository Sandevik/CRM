use std::default;

use actix_web::{body::{EitherBody, BoxBody}, delete, dev::{ServiceFactory, ServiceRequest, ServiceResponse}, get, post, put, web, Error, HttpResponse, Responder, Scope};
use actix_web_httpauth::middleware::HttpAuthentication;
use serde::{Serialize, Deserialize};
use uuid::Uuid;
use crate::{middleware::owns_or_admin_middleware::RequiresUuid, models::{company::Company, Model}, routes::Response};
use crate::{middleware::owns_or_admin_middleware::validator, AppState};


pub fn companies() -> Scope<impl ServiceFactory<ServiceRequest, Config = (), Response = ServiceResponse<EitherBody<BoxBody>>, Error = Error, InitError = ()>> {
    let owner_or_admin_middleware = HttpAuthentication::bearer(validator);
    
    let scope = web::scope("/companies")
        .wrap(owner_or_admin_middleware)
        .service(get_company_by_crm_uuid)
        .service(create_company)
        .service(update_company)
        .service(delete_company)
        ;
        
    scope
}


#[get("")]
async fn get_company_by_crm_uuid(query: web::Query<RequiresUuid>, data: web::Data<AppState>) -> impl Responder {
    match Company::get_by_crm_uuid(&Uuid::parse_str(&query.crm_uuid).unwrap_or_default(), &data).await {
        Err(err) => HttpResponse::InternalServerError().json(Response::<String>::internal_server_error(&err.to_string())),
        Ok(company) => HttpResponse::Ok().json(Response::ok("Successfully retrieved company details", company))
    }
}

#[derive(Serialize, Deserialize)]
struct CreateReq {
    #[serde(rename(serialize = "crmUuid", deserialize = "crmUuid"))]
    crm_uuid: String,
    name: Option<String>,
    #[serde(rename(serialize = "organizationNumber", deserialize = "organizationNumber"))]
    organization_number: Option<String>,
    address: Option<String>,
    #[serde(rename(serialize = "zipCode", deserialize = "zipCode"))]
    zip_code: Option<String>,
    city: Option<String>,
    country: Option<String>,
    #[serde(rename(serialize = "phoneNumber", deserialize = "phoneNumber"))]
    phone_number: Option<String>,
    #[serde(rename(serialize = "placeOfStationing", deserialize = "placeOfStationing"))]
    place_of_stationing: Option<String>,
}

#[post("/create")]
async fn create_company(body: web::Json<CreateReq>, data: web::Data<AppState>) -> impl Responder {
    let company = Company {
        name: body.name.clone(),
        organization_number: body.organization_number.clone(),
        crm_uuid: Uuid::parse_str(&body.crm_uuid).unwrap(),
        address: body.address.clone(),
        zip_code: body.zip_code.clone(),
        city: body.city.clone(),
        country: body.country.clone(),
        phone_number: body.phone_number.clone(),
        place_of_stationing: body.place_of_stationing.clone(),
        ..Company::default()
    };

    match company.insert(&data).await {
        Err(err) => HttpResponse::InternalServerError().json(Response::<String>::internal_server_error(&err.to_string())),
        Ok(_) => HttpResponse::Ok().json(Response::<String>::ok("Successfully created company details", None))
    }

}
#[put("/update")]
async fn update_company(body: web::Json<CreateReq>, data: web::Data<AppState>) -> impl Responder {
    let existing = Company::get_by_crm_uuid(&Uuid::parse_str(&body.crm_uuid).unwrap(), &data).await;
    if let Err(err) = existing {
        return HttpResponse::InternalServerError().json(Response::<String>::internal_server_error(&err.to_string()));
    }
    let company = match existing.unwrap() {
        None => Company {
            name: body.name.clone(),
            organization_number: body.organization_number.clone(),
            crm_uuid: Uuid::parse_str(&body.crm_uuid).unwrap(),
            address: body.address.clone(),
            zip_code: body.zip_code.clone(),
            city: body.city.clone(),
            country: body.country.clone(),
            phone_number: body.phone_number.clone(),
            place_of_stationing: body.place_of_stationing.clone(),
            ..Company::default()
        },
        Some(comp) => Company {
            name: body.name.clone(),
            organization_number: body.organization_number.clone(),
            crm_uuid: Uuid::parse_str(&body.crm_uuid).unwrap(),
            address: body.address.clone(),
            zip_code: body.zip_code.clone(),
            city: body.city.clone(),
            country: body.country.clone(),
            phone_number: body.phone_number.clone(),
            place_of_stationing: body.place_of_stationing.clone(),
            ..comp
        }
    };

    match company.insert(&data).await {
        Err(err) => HttpResponse::InternalServerError().json(Response::<String>::internal_server_error(&err.to_string())),
        Ok(_) => HttpResponse::Ok().json(Response::<String>::ok("Successfully created company details", None))
    }
}

#[delete("/delete")]
async fn delete_company(body: web::Json<RequiresUuid>, data: web::Data<AppState>) -> impl Responder {
    match Company::delete_by_crm_uuid(&Uuid::parse_str(&body.crm_uuid).unwrap(), &data).await {
        Err(err) => HttpResponse::InternalServerError().json(Response::<String>::internal_server_error(&err.to_string())),
        Ok(_) => HttpResponse::Ok().json(Response::<String>::ok("Successfully removed company details", None))
    }
}