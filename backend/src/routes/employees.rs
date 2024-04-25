use actix_web::{body::{EitherBody, BoxBody}, delete, dev::{ServiceFactory, ServiceRequest, ServiceResponse}, get, post, put, web, Error, HttpResponse, Responder, Scope};
use actix_web_httpauth::middleware::HttpAuthentication;
use serde::{Serialize, Deserialize};
use uuid::Uuid;
use chrono::NaiveDate;
use crate::{models::{employee::Employee, Model}, routes::Response};
use crate::{middleware::owns_or_admin_or_can_handle_employees::validator, AppState};

use super::Limit;

pub fn employees() -> Scope<impl ServiceFactory<ServiceRequest, Config = (), Response = ServiceResponse<EitherBody<BoxBody>>, Error = Error, InitError = ()>> {
    let owns_or_admin_or_can_handle_employees_middleware = HttpAuthentication::bearer(validator);
    
    let scope = web::scope("/employees")
        .wrap(owns_or_admin_or_can_handle_employees_middleware)
        .service(by_uuid)
        .service(create_employee)
        .service(get_all)
        .service(search)
        .service(update_employee)
        .service(create_employee_account)
        .service(disassociate_employee_account)
        .service(update_account_permissions)
        .service(set_admin)
        ;
        
    scope
}

#[derive(Serialize, Deserialize)]
struct EmployeeByUuidRequest {
    #[serde(rename(deserialize = "crmUuid"))]
    crm_uuid: String, //crm uuid
    #[serde(rename(deserialize = "employeeUuid"))]
    employee_uuid: String,
}

#[get("")]
async fn by_uuid(query: web::Query<EmployeeByUuidRequest>, data: web::Data<AppState>) -> impl Responder {
    let employee_uuid = Uuid::parse_str(&query.employee_uuid).unwrap_or_default();
    let crm_uuid = Uuid::parse_str(&query.crm_uuid).unwrap_or_default();
    match Employee::get_by_uuid(&employee_uuid, &crm_uuid, &data).await {
        Err(err) => HttpResponse::InternalServerError().json(Response::<String>::internal_server_error(&err.to_string())),
        Ok(employee) => HttpResponse::Ok().json(Response::ok("Successfully fetched employee", employee))
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
    match Employee::get_all(&Uuid::parse_str(&query.crm_uuid).unwrap_or_default(), match &query.limit {None => Limit::None, Some(u) => Limit::Some(*u)}, query.offset, &data).await {
        Err(err) => HttpResponse::InternalServerError().json(Response::<String>::internal_server_error(&err.to_string())),
        Ok(employee) => HttpResponse::Ok().json(Response::ok("Successfully fetched employee", Some(employee)))
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
    match Employee::search(&Uuid::parse_str(&query.crm_uuid).unwrap_or_default(), &query.q, Limit::Some(20), &data).await {
        Err(err) => HttpResponse::InternalServerError().json(Response::<String>::internal_server_error(&err.to_string())),
        Ok(employee) => HttpResponse::Ok().json(Response::ok("Successfully searched employees", Some(employee)))
    }
}


#[derive(Deserialize, Debug)]
struct CreateEmployeeRequest {
    #[serde(rename(serialize = "crmUuid", deserialize = "crmUuid"))]
    pub crm_uuid: String,
    #[serde(rename(serialize = "userUuid", deserialize = "userUuid"))]
    user_uuid: Option<String>,
    #[serde(rename(serialize = "firstName", deserialize = "firstName"))]
    first_name: Option<String>,
    #[serde(rename(serialize = "lastName", deserialize = "lastName"))]
    last_name: Option<String>,
    #[serde(rename(serialize = "dateOfBirth", deserialize = "dateOfBirth"))]
    date_of_birth: Option<NaiveDate>,
    ssn: Option<String>,
    address: Option<String>,
    #[serde(rename(serialize = "zipCode", deserialize = "zipCode"))]
    zip_code: Option<String>,
    city: Option<String>,
    country: Option<String>,
    #[serde(rename(serialize = "phoneNumber", deserialize = "phoneNumber"))]
    phone_number: String,
    role: Option<String>,
    #[serde(rename(serialize = "drivingLicenseClass", deserialize = "drivingLicenseClass"))]
    driving_license_class: Option<String>,
    #[serde(rename(serialize = "driverCardNumber", deserialize = "driverCardNumber"))]
    driver_card_number: Option<String>,
    email: String,
    #[serde(rename(serialize = "contract_uuid", deserialize = "contract_uuid"))]
    contract_uuid: Option<String>,
    access_level: Option<i32>,
}


#[post("/create")]
async fn create_employee(data: web::Data<AppState>, body: web::Json<CreateEmployeeRequest>) -> impl Responder {
    let employee: Employee = Employee {
        crm_uuid: Uuid::parse_str(&body.crm_uuid).unwrap(),
        user_uuid: match body.user_uuid.clone() {None => None, Some(str) => Some(match Uuid::parse_str(&str) {Err(_) => Uuid::new_v4(), Ok(u) => u})} ,
        first_name: body.first_name.clone(),
        last_name: body.last_name.clone(),
        date_of_birth: body.date_of_birth.clone(),
        ssn: body.ssn.clone(),
        address: body.address.clone(),
        zip_code: body.zip_code.clone(),
        city: body.city.clone(),
        country: body.country.clone(),
        phone_number: body.phone_number.clone(),
        role: body.role.clone(),
        driving_license_class: body.driving_license_class.clone(),
        driver_card_number: body.driver_card_number.clone(),
        email: body.email.clone(),
        contract_uuid: match body.contract_uuid.clone() {None => None, Some(str) => Some(match Uuid::parse_str(&str) {Err(_) => Uuid::new_v4(), Ok(u) => u})},
        access_level: body.access_level,
        ..Employee::default()
    };
    match employee.insert(&data).await {
        Err(err) => HttpResponse::InternalServerError().json(Response::<String>::internal_server_error(&err.to_string())),
        Ok(_) => HttpResponse::Created().json(Response::<String>::created("Successfully created employee"))
    }
}

#[derive(Serialize, Deserialize, Debug)]
struct UpdateEmployeeRequest {
    #[serde(rename(serialize = "crmUuid", deserialize = "crmUuid"))]
    crm_uuid: String,
    uuid: String,
    #[serde(rename(serialize = "userUuid", deserialize = "userUuid"))]
    user_uuid: Option<String>,
    #[serde(rename(serialize = "firstName", deserialize = "firstName"))]
    first_name: Option<String>,
    #[serde(rename(serialize = "lastName", deserialize = "lastName"))]
    last_name: Option<String>,
    #[serde(rename(serialize = "dateOfBirth", deserialize = "dateOfBirth"))]
    date_of_birth: Option<NaiveDate>,
    ssn: Option<String>,
    address: Option<String>,
    #[serde(rename(serialize = "zipCode", deserialize = "zipCode"))]
    zip_code: Option<String>,
    city: Option<String>,
    country: Option<String>,
    #[serde(rename(serialize = "phoneNumber", deserialize = "phoneNumber"))]
    phone_number: String,
    role: Option<String>,
    note: Option<String>,
    #[serde(rename(serialize = "drivingLicenseClass", deserialize = "drivingLicenseClass"))]
    driving_license_class: Option<String>,
    #[serde(rename(serialize = "driverCardNumber", deserialize = "driverCardNumber"))]
    driver_card_number: Option<String>,
    email: String,
    #[serde(rename(serialize = "contract_uuid", deserialize = "contract_uuid"))]
    contract_uuid: Option<String>,
    access_level: Option<i32>,
}

#[post("/update")]
async fn update_employee(data: web::Data<AppState>, body: web::Json<UpdateEmployeeRequest>) -> impl Responder {
    let employee: Employee = Employee {
        crm_uuid: Uuid::parse_str(&body.crm_uuid).unwrap_or_default(),
        uuid: Uuid::parse_str(&body.uuid.clone()).expect("Could not parse uuid string"),
        user_uuid: match body.user_uuid.clone() {None => None, Some(str) => Some(match Uuid::parse_str(&str) {Err(_) => Uuid::new_v4(), Ok(u) => u})} ,
        first_name: body.first_name.clone(),
        last_name: body.last_name.clone(),
        date_of_birth: body.date_of_birth.clone(),
        ssn: body.ssn.clone(),
        address: body.address.clone(),
        zip_code: body.zip_code.clone(),
        city: body.city.clone(),
        country: body.country.clone(),
        phone_number: body.phone_number.clone(),
        role: body.role.clone(),
        note: body.note.clone(),
        driving_license_class: body.driving_license_class.clone(),
        driver_card_number: body.driver_card_number.clone(),
        email: body.email.clone(),
        contract_uuid: match body.contract_uuid.clone() {None => None, Some(str) => Some(match Uuid::parse_str(&str) {Err(_) => Uuid::new_v4(), Ok(u) => u})},
        access_level: body.access_level,
        ..Employee::default()
    };
    match employee.update(&data).await {
        Err(err) => HttpResponse::InternalServerError().json(Response::<String>::internal_server_error(&err.to_string())),
        Ok(_) => HttpResponse::Ok().json(Response::<String>::ok("Successfully updated employee", None))
    }
}

#[derive(Serialize, Deserialize)]
struct CreateEmployeeUserAccount {
    #[serde(rename(deserialize = "crmUuid"))]
    crm_uuid: String,
    #[serde(rename(deserialize = "employeeUuid"))]
    employee_uuid: String,
}


#[post("/create-user-account")]
async fn create_employee_account(data: web::Data<AppState>, body: web::Json<CreateEmployeeUserAccount>) -> impl Responder {
    match Employee::associate_account(&Uuid::parse_str(&body.employee_uuid).unwrap(), &Uuid::parse_str(&body.crm_uuid).unwrap(), &data).await {
        Err(err) => HttpResponse::InternalServerError().json(Response::<String>::internal_server_error(&err.to_string())),
        Ok(new_pass_opt) => HttpResponse::Created().json(Response::<String>::ok(&format!("Successfully created employee user account"), new_pass_opt))
    }
}

#[delete("/disassociate-user-account")]
async fn disassociate_employee_account(data: web::Data<AppState>, body: web::Json<CreateEmployeeUserAccount>) -> impl Responder {
    let emp = Employee::get_by_uuid(&Uuid::parse_str(&body.employee_uuid).unwrap(), &Uuid::parse_str(&body.crm_uuid).unwrap(), &data).await;
    if let Err(err) = emp {
        return HttpResponse::InternalServerError().json(Response::<String>::internal_server_error(&err.to_string()));
    } else {
        match emp.unwrap() {
            None => return HttpResponse::Ok().json(Response::<String>::ok("Unchanged", None)),
            Some(employee) => {
                return match employee.disassociate_account(&data).await {
                    Err(err) => HttpResponse::InternalServerError().json(Response::<String>::internal_server_error(&err.to_string())),
                    Ok(_) => HttpResponse::Ok().json(Response::<String>::ok("Successfully disassociated user account", None))
                };
            }
        }
    }
}


#[derive(Serialize, Deserialize)]
struct UpdateAccountPermissions {
    #[serde(rename(serialize = "crmUuid", deserialize = "crmUuid"))]
    crm_uuid: String,
    #[serde(rename(serialize = "userUuid", deserialize = "userUuid"))]
    user_uuid: String,
    #[serde(rename(serialize = "canReportTime", deserialize = "canReportTime"))]
    can_report_time: Option<bool>,
    #[serde(rename(serialize = "canHandleCustomers", deserialize = "canHandleCustomers"))]
    can_handle_customers: Option<bool>,
    #[serde(rename(serialize = "canHandleEmployees", deserialize = "canHandleEmployees"))]
    can_handle_employees: Option<bool>,
    #[serde(rename(serialize = "canHandleVehicles", deserialize = "canHandleVehicles"))]
    can_handle_vehicles: Option<bool>,
    #[serde(rename(serialize = "canAccessCrm", deserialize = "canAccessCrm"))]
    can_access_crm: bool
}

#[put("/update-permissions")]
async fn update_account_permissions(data: web::Data<AppState>, body: web::Json<UpdateAccountPermissions>) -> impl Responder {
    let emp = Employee {
        crm_uuid: Uuid::parse_str(&body.crm_uuid).expect("Could not parse crm_uuid"), 
        user_uuid: match Uuid::parse_str(&body.user_uuid){Err(_) => None, Ok(u) => Some(u)},
        can_report_time: body.can_report_time,
        can_handle_customers: body.can_handle_customers,
        can_handle_employees: body.can_handle_employees,
        can_handle_vehicles: body.can_handle_vehicles,
        can_access_crm: Some(body.can_access_crm),
        ..Employee::default()
    };
    match emp.update_permissions(&data).await {
        Err(err) => HttpResponse::InternalServerError().json(Response::<String>::internal_server_error(&err.to_string())),
        Ok(_) => HttpResponse::Ok().json(Response::<String>::ok("Successfully updated employee user permissions", None))
    }
}

#[derive(Serialize, Deserialize)]
struct SetAdmin {
    #[serde(rename(serialize = "crmUuid", deserialize = "crmUuid"))]
    crm_uuid: String,
    #[serde(rename(serialize = "employeeUuid", deserialize = "employeeUuid"))]
    employee_uuid: String,
    #[serde(rename(serialize = "isAdmin", deserialize = "isAdmin"))]
    is_admin: bool
}

#[put("/set-admin")]
async fn set_admin(data: web::Data<AppState>, body: web::Json<SetAdmin>) -> impl Responder {
    let current_emp = Employee::get_by_uuid(&Uuid::parse_str(&body.employee_uuid).expect("Could not parse employee_uuid"), &Uuid::parse_str(&body.crm_uuid).expect("Could not parse crm_uuid"), &data).await.expect("Could not find employee");
    if let None = current_emp {
        return HttpResponse::NotFound().json(Response::<String>::not_found("Could not find employee"));
    }
    let emp: Employee = Employee {
        is_admin: Some(body.is_admin),
        ..current_emp.unwrap()
    };
    match emp.update_admin(&data).await {
        Err(err) => HttpResponse::InternalServerError().json(Response::<String>::internal_server_error(&err.to_string())),
        Ok(_) => HttpResponse::Ok().json(Response::<String>::ok("Successfully updated employee admin state", None))
    }
}
