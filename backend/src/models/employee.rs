use actix_web::web;
use chrono::{DateTime, NaiveDate, Utc};
use rand::Rng;
use serde::{Serialize, Deserialize};
use sqlx::{mysql::MySqlRow, MySql, Pool, Row};
use uuid::Uuid;

use crate::{controllers::database::Database, routes::Limit, AppState};

use super::{user::User, Model};

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct Employee {
    #[serde(rename(serialize = "crmUuid", deserialize = "crmUuid"))]
    pub crm_uuid: Uuid,
    pub uuid: Uuid,
    #[serde(rename(serialize = "userUuid", deserialize = "userUuid"))]
    pub user_uuid: Option<Uuid>,
    #[serde(rename(serialize = "employmentOrder", deserialize = "employmentOrder"))]
    pub employment_number: i32,
    #[serde(rename(serialize = "firstName", deserialize = "firstName"))]
    pub first_name: Option<String>,
    #[serde(rename(serialize = "lastName", deserialize = "lastName"))]
    pub last_name: Option<String>,
    #[serde(rename(serialize = "dateOfBirth", deserialize = "dateOfBirth"))]
    pub date_of_birth: Option<NaiveDate>,
    pub ssn: Option<String>,
    pub address: Option<String>,
    #[serde(rename(serialize = "zipCode", deserialize = "zipCode"))]
    pub zip_code: Option<String>,
    pub city: Option<String>,
    pub country: Option<String>,
    #[serde(rename(serialize = "phoneNumber", deserialize = "phoneNumber"))]
    pub phone_number: String,
    pub role: Option<String>,
    #[serde(rename(serialize = "drivingLicenseClass", deserialize = "drivingLicenseClass"))]
    pub driving_license_class: Option<String>,
    #[serde(rename(serialize = "driverCardNumber", deserialize = "driverCardNumber"))]
    pub driver_card_number: Option<String>,
    pub email: String,
    #[serde(rename(serialize = "contractUuid", deserialize = "contractUuid"))]
    pub contract_uuid: Option<Uuid>,
    pub note: Option<String>,
    #[serde(rename(serialize = "accessLevel", deserialize = "accessLevel"))]
    pub access_level: Option<i32>,
    #[serde(rename(serialize = "canReportTime", deserialize = "canReportTime"))]
    pub can_report_time: Option<bool>,
    #[serde(rename(serialize = "isAdmin", deserialize = "isAdmin"))]
    pub is_admin: Option<bool>,
    #[serde(rename(serialize = "canHandleCustomers", deserialize = "canHandleCustomers"))]
    pub can_handle_customers: Option<bool>,
    #[serde(rename(serialize = "canHandleEmployees", deserialize = "canHandleEmployees"))]
    pub can_handle_employees: Option<bool>,
    #[serde(rename(serialize = "canHandleVehicles", deserialize = "canHandleVehicles"))]
    pub can_handle_vehicles: Option<bool>,
    #[serde(rename(serialize = "canAccessCrm", deserialize = "canAccessCrm"))]
    pub can_access_crm: Option<bool>,
    pub added: DateTime<Utc>,
    pub updated: DateTime<Utc>
}

impl Model for Employee {
    
    

    fn sql_row_arrays() -> Vec<[&'static str; 2]> {
        vec![
            ["crm_uuid", "VARCHAR(36) NOT NULL"],
            ["uuid", "VARCHAR(36) NOT NULL PRIMARY KEY"],
            ["user_uuid", "VARCHAR(36)"],
            ["employment_number", "INT NOT NULL AUTO_INCREMENT"],
            ["first_name", "TEXT"],
            ["last_name", "TEXT"],
            ["date_of_birth", "DATE"],
            ["ssn", "VARCHAR(12)"],
            ["address", "TEXT"],
            ["zip_code", "TEXT"],
            ["city", "TEXT"],
            ["country", "TEXT"],
            ["phone_number", "VARCHAR(14) NOT NULL"],
            ["role", "TEXT"],
            ["driving_license_class", "TEXT"],
            ["driver_card_number", "TEXT"],
            ["email", "VARCHAR(40) NOT NULL"],
            ["contract_uuid", "VARCHAR(36)"],
            ["note", "TEXT"],
            ["added", "DATETIME"],
            ["updated", "DATETIME"]
        ]
    }

    
    async fn create_table(pool: &Pool<MySql>) -> Result<(), sqlx::Error> {
        Database::create_table(Self::sql_row_arrays(), "employees", None, pool).await
    }
    
    async fn alter_table(pool: &Pool<MySql>) -> Result<(), sqlx::Error> {
        Database::alter_table(Self::sql_row_arrays(), "employees", pool).await
    }
   
    async fn migrate_table(pool: &Pool<MySql>) -> Result<(), sqlx::Error> {
        Database::migrate_table(Self::sql_row_arrays(), "employees", None, pool).await
    }

    fn from_row(row: &MySqlRow) -> Self {
        Employee {
            crm_uuid: Uuid::parse_str(row.get("crm_uuid")).unwrap_or_default(), 
            uuid: Uuid::parse_str(row.get("uuid")).unwrap_or_default(),
            user_uuid: match row.get("user_uuid") { None => None, Some(str) => match Uuid::parse_str(str) {Err(_) => None, Ok(u) => Some(u)}},
            employment_number: row.get("employment_number"),
            first_name: row.get("first_name"),
            last_name: row.get("last_name"),
            date_of_birth: row.get("date_of_birth"),
            address: row.get("address"),
            zip_code: row.get("zip_code"),
            city: row.get("city"),
            country: row.get("country"),
            ssn: row.get("ssn"),
            email: row.get("email"),
            contract_uuid: match row.get("contract_uuid") {None => None, Some(str) => match Uuid::parse_str(str) {Err(_) => None, Ok(u) => Some(u)}},
            phone_number: row.get("phone_number"),
            role: row.get("role"),
            driving_license_class: row.get("driving_license_class"),
            driver_card_number: row.get("driver_card_number"),
            note: row.get("note"),
            added: row.get("added"),
            updated: row.get("updated"),
            access_level: None,
            can_report_time: None,
            is_admin: None,
            can_handle_customers: None,
            can_handle_employees: None,
            can_handle_vehicles: None,
            can_access_crm: None,
        }
    }

    async fn insert(&self, data: &web::Data<AppState>) -> Result<(), sqlx::Error> {
        let query = "INSERT INTO `crm`.`employees` (crm_uuid, uuid, first_name, last_name, date_of_birth, email, address, zip_code, city, country, ssn, contract_uuid, phone_number, role, driving_license_class, driver_card_number, added, updated) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
        match sqlx::query(&query)
            .bind(&self.crm_uuid.hyphenated().to_string())
            .bind(&self.uuid.hyphenated().to_string())
            .bind(&self.first_name)
            .bind(&self.last_name)
            .bind(&self.date_of_birth)
            .bind(&self.email)
            .bind(&self.address)
            .bind(&self.zip_code)
            .bind(&self.city)
            .bind(&self.country)
            .bind(&self.ssn)
            .bind(match &self.contract_uuid {None => None, Some(uuid) => Some(uuid.hyphenated().to_string())})
            .bind(&self.phone_number)
            .bind(&self.role)
            .bind(&self.driving_license_class)
            .bind(&self.driver_card_number)
            .bind(&self.added)
            .bind(&self.updated)
            .execute(&data.pool)
            .await {
                Err(err) => Err(err),
                Ok(_) => Ok(())
            }
    }

    async fn update(&self, data: &web::Data<AppState>) -> Result<(), sqlx::Error> {
        let query = "UPDATE `crm`.`employees` SET first_name = ?, last_name = ?, date_of_birth = ?, email = ?, address = ?, zip_code = ?, city = ?, country = ?, ssn = ?, contract_uuid = ?, phone_number = ?, role = ?, driving_license_class = ?, driver_card_number = ?, note = ?, updated = ? WHERE uuid = ? AND crm_uuid = ?";
        match sqlx::query(&query)
            .bind(&self.first_name)
            .bind(&self.last_name)
            .bind(&self.date_of_birth)
            .bind(&self.email)
            .bind(&self.address)
            .bind(&self.zip_code)
            .bind(&self.city)
            .bind(&self.country)
            .bind(&self.ssn)
            .bind(match &self.contract_uuid {None => None, Some(uuid) => Some(uuid.hyphenated().to_string())})
            .bind(&self.phone_number)
            .bind(&self.role)
            .bind(&self.driving_license_class)
            .bind(&self.driver_card_number)
            .bind(&self.note)
            .bind(Utc::now())
            .bind(&self.uuid.hyphenated().to_string())
            .bind(&self.crm_uuid.hyphenated().to_string())
            .execute(&data.pool)
            .await {
                Err(err) => Err(err),
                Ok(_) => Ok(())
            }
    }

}

impl Employee {

    pub fn default() -> Self {
        Employee { 
            crm_uuid: Uuid::new_v4(), 
            uuid: Uuid::new_v4(),
            user_uuid: None,
            employment_number: -1,
            first_name: None,
            last_name: None,
            date_of_birth: None,
            address: None,
            zip_code: None,
            city: None,
            country: None,
            ssn: None,
            email: "".to_string(),
            access_level: None,
            contract_uuid: None,
            phone_number: "".to_string(),
            role: None,
            driving_license_class: None,
            driver_card_number: None,
            note: None,
            added: Utc::now(),
            updated: Utc::now(),
            can_report_time: Some(true),
            is_admin: Some(false),
            can_handle_customers: Some(false),
            can_handle_employees: Some(false),
            can_handle_vehicles: Some(false),
            can_access_crm: Some(false),
        }
    }

    pub async fn get_by_uuid(employee_uuid: &Uuid, crm_uuid: &Uuid, data: &web::Data<AppState>) -> Result<Option<Self>, sqlx::Error> {
        let query = "SELECT * FROM `crm`.`employees` WHERE uuid = ? AND `crm_uuid` = ?";
        match sqlx::query(&query)
            .bind(employee_uuid.hyphenated().to_string())
            .bind(crm_uuid.hyphenated().to_string())
            .fetch_optional(&data.pool)
            .await {
                Err(err) => Err(err),
                Ok(maybe_row) => {
                match maybe_row {
                    None => Ok(None),
                    Some(row) => {
                        let mut emp = Self::from_row(&row);
                        let res = emp.get_permissions(data).await;
                        if let Err(err) = res {
                            println!("{err}");
                        }
                        Ok(Some(emp))
                    }
                }
            }
        }
    }

    pub async fn search(crm_uuid: &Uuid, q: &str, limit: Limit, data: &web::Data<AppState>) -> Result<Vec<Self>, sqlx::Error> {
        let mut employees: Vec<Employee> = Vec::new();
        let mut query = String::from("SELECT * FROM `crm`.`employees` WHERE `crm_uuid` = ? AND `first_name` LIKE ? OR `last_name` LIKE ? OR `email` LIKE ? OR `phone_number` LIKE ? OR `city` LIKE ?");
        match limit {
            Limit::None => (),
            Limit::Some(limit) => query.push_str(format!(" LIMIT {}", limit).as_str()),
        }
        let parsed_q: String = format!("%{}%", q);
        match sqlx::query(&query)
            .bind(crm_uuid.hyphenated().to_string())
            .bind(&parsed_q)
            .bind(&parsed_q)
            .bind(&parsed_q)
            .bind(&parsed_q)
            .bind(&parsed_q)
            .fetch_all(&data.pool)
            .await{
                Err(err) => println!("{err}"),
                Ok(rows) => {
                for row in rows {
                    let mut emp = Employee::from_row(&row);
                    let res = emp.get_permissions(data).await;
                    if let Err(err) = res {
                        println!("{err}");
                    }
                    employees.push(emp);
                }
            }
        }
        Ok(employees)
    }

    pub async fn get_all(crm_uuid: &Uuid, limit: Limit, offset: Option<u16>, data: &web::Data<AppState>) -> Result<Vec<Self>, sqlx::Error> {
        let mut employees: Vec<Employee> = Vec::new();
        let mut query = String::from("SELECT * FROM `crm`.`employees` WHERE `crm_uuid` = ?");
        //todo: create limits on how many employees a person can get
        match limit {
            Limit::None => (),
            Limit::Some(limit) => query.push_str(format!(" LIMIT {}", limit).as_str()),
        }
        match offset {
            None => (),
            Some(num) => query.push_str(format!(" OFFSET {}", num).as_str()),
        }
        match sqlx::query(&query)
            .bind(crm_uuid.hyphenated().to_string())
            .fetch_all(&data.pool)
            .await {
                Err(err) => println!("{err}"),
                Ok(rows) => {
                    for row in rows {
                        let mut emp = Employee::from_row(&row);
                        let res = emp.get_permissions(data).await;
                        if let Err(err) = res {
                            println!("{err}");
                        }
                        employees.push(emp);
                    }
                }
            }
        Ok(employees)
    }

   
    // Returns the password to a newly created account if it did not exist before, else, returns None
    pub async fn associate_account(employee_uuid: &Uuid, crm_uuid: &Uuid, data: &web::Data<AppState>) -> Result<Option<String>,sqlx::Error> {
        match Employee::get_by_uuid(employee_uuid, crm_uuid, data).await {
            Err(err) => Err(err),
            Ok(emp_opt) => {
                match emp_opt {
                    None => Err(sqlx::Error::ColumnNotFound("Employee could not be found".to_string())),
                    Some(employee) => {
                        if (employee.email == "".to_string()) || (employee.phone_number == "".to_string()) {
                            return Err(sqlx::Error::ColumnNotFound("You need to have an email AND a phone number to create a user account".to_string()));
                        } else {
                            match User::get_by_email_or_phone_number_sep(&employee.email.clone(), &employee.phone_number.clone(), data).await {
                                Err(err) => Err(err),
                                Ok(user_opt) => {
                                    match user_opt {
                                        None => {
                                            if employee.email == "".to_string() || employee.phone_number == "".to_string() {return Err(sqlx::Error::ColumnNotFound("Could not find email or phone number".to_string()))};
                                            let create_res = Self::create_user_account(&employee, data).await;
                                            if let Err(err) = create_res {
                                                return Err(err);
                                            } else {
                                                let res = create_res.as_ref().unwrap().1.add_employee_user(crm_uuid, &employee.uuid, data).await;
                                                if let Err(err) = res {
                                                    return Err(err);
                                                } else {
                                                    return Ok(Some(create_res.unwrap().0));
                                                }
                                            }
                                        },
                                        Some(user) => { 
                                            let res = user.add_employee_user(crm_uuid, &employee.uuid, data).await;
                                            if let Err(err) = res {
                                                return Err(err);
                                            } else {
                                                return Ok(None);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }


    // Returns the password for the new user
    async fn create_user_account(&self, data: &web::Data<AppState>) -> Result<(String, User), sqlx::Error> {
        let mut pass = String::new();
        let chars = vec!["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","!",".","(",")","&","$","*"];
        let mut rng = rand::thread_rng();
        for _ in 1 ..= 20 {
            let n: u8 = rng.gen_range(0..=58);
            pass.push_str(chars[n as usize]);
        }
        let res = User::insert_user(&self.email.clone(), &self.first_name.clone().unwrap(), &self.last_name.clone().unwrap(), &self.phone_number.clone(), &pass, &"eng".to_string(), Some(self.crm_uuid.hyphenated().to_string()), data).await;
        if let Err(err) = res {
            return Err(err);
        } else {
            let new_user_uuid = res.unwrap();
            let temp_user = User {uuid: Uuid::parse_str(&new_user_uuid).unwrap(), email: self.email.clone(), phone_number: Some(self.phone_number.clone()), ..User::default()};
            return Ok((pass, temp_user));
        }
    }

    pub async fn disassociate_account(&self, data: &web::Data<AppState>) -> Result<(), sqlx::Error> {
        match &self.user_uuid {
            None => Ok(()),
            Some(uuid) => {
                if let Err(err) = sqlx::query("DELETE FROM `crm` . `user_employee` WHERE user_uuid = ?")
                .bind(&uuid.hyphenated().to_string())
                .execute(&data.pool).await {
                    return Err(err);
                }
                if let Err(err) = sqlx::query("UPDATE `crm` . `employees` SET user_uuid = NULL WHERE uuid = ?")
                .bind(&self.uuid.hyphenated().to_string())
                .execute(&data.pool).await {
                    return Err(err);
                }
                Ok(())
            } 
        } 
    }

    async fn get_permissions(&mut self, data: &web::Data<AppState>) -> Result<(), sqlx::Error> {
        match User::get_by_email_or_phone_number_sep(&self.email.clone(), &self.phone_number.clone(), data).await {
            Err(err) => Err(err),
            Ok(user_opt) => {
                match user_opt {
                    None => {
                        self.access_level = None;
                        self.is_admin = None;
                        self.can_report_time = None;
                        self.can_handle_customers = None;
                        self.can_handle_employees = None;
                        self.can_handle_vehicles = None;
                        Ok(())
                    },
                    Some(u) => {
                        match sqlx::query("SELECT * FROM `crm` . `user_employee` WHERE `crm_uuid` = ? AND `user_uuid` = ?")
                        .bind(&self.crm_uuid.hyphenated().to_string())
                        .bind(u.uuid.hyphenated().to_string())
                        .fetch_optional(&data.pool)
                        .await {
                            Err(err) => Err(err),
                            Ok(row_opt) => {
                                if let None = row_opt {
                                    self.access_level = None;
                                    self.is_admin = None;
                                    self.can_report_time = None;
                                    self.can_handle_customers = None;
                                    self.can_handle_employees = None;
                                    self.can_handle_vehicles = None;
                                }else{
                                    let row = row_opt.unwrap();
                                    self.access_level = row.get("access_level");
                                    self.is_admin = row.get("is_admin");
                                    self.can_report_time = row.get("can_report_time");
                                    self.can_handle_customers = row.get("can_handle_customers");
                                    self.can_handle_employees = row.get("can_handle_employees");
                                    self.can_handle_vehicles = row.get("can_handle_vehicles");
                                    self.can_access_crm = row.get("can_access_crm");
                                }
                                Ok(())
                            } 
                        }
                    }
                }
            }
        }
    }


    pub async fn update_permissions(&self, data: &web::Data<AppState>) -> Result<(), sqlx::Error> {
        match sqlx::query("UPDATE `crm` . `user_employee` SET `can_report_time` = ?, `can_handle_customers` = ?, `can_handle_employees` = ?, `can_handle_vehicles` = ?, `can_access_crm` = ? WHERE `crm_uuid` = ? AND `user_uuid` = ?")
        .bind(&self.can_report_time)
        .bind(match self.can_access_crm {
            Some(value) => {
                if value == true {
                    self.can_handle_customers
                } else {
                    Some(false)
                }
            }, None => Some(false)})
        .bind(match self.can_access_crm {
                Some(value) => {
                    if value == true {
                        self.can_handle_employees
                    } else {
                        Some(false)
                    }
                }, None => Some(false)})
        .bind(match self.can_access_crm {
                    Some(value) => {
                        if value == true {
                            self.can_handle_vehicles
                        } else {
                            Some(false)
                        }
                    }, None => Some(false)})
        .bind(match self.can_access_crm {Some(v) => Some(v), None => Some(false)})
        .bind(&self.crm_uuid.hyphenated().to_string())
        .bind(&self.user_uuid.expect("ERROR: Could not update values as row does not have a user_uuid").hyphenated().to_string())
        .execute(&data.pool)
        .await {
            Err(err) => Err(err),
            Ok(_) => Ok(())
        }
    }

    pub async fn update_admin(&self, data: &web::Data<AppState>) -> Result<(), sqlx::Error> {
        match sqlx::query("UPDATE `crm` . `user_employee` SET `is_admin` = ?, `can_report_time` = ?, `can_handle_customers` = ?, `can_handle_employees` = ?, `can_handle_vehicles` = ?, `can_access_crm` = ? WHERE `crm_uuid` = ? AND `user_uuid` = ?")
        .bind(&self.is_admin)
        .bind(match self.is_admin {None => self.can_report_time, Some(val) => {if val {Some(true)} else {self.can_report_time}}})
        .bind(match self.is_admin {None => self.can_handle_customers, Some(val) => {if val {Some(true)} else {self.can_handle_customers}}})
        .bind(match self.is_admin {None => self.can_handle_employees, Some(val) => {if val {Some(true)} else {self.can_handle_employees}}})
        .bind(match self.is_admin {None => self.can_handle_vehicles, Some(val) => {if val {Some(true)} else {self.can_handle_vehicles}}})
        .bind(match self.is_admin {None => self.can_access_crm, Some(val) => {if val {Some(true)} else {self.can_access_crm}}})
        .bind(&self.crm_uuid.hyphenated().to_string())
        .bind(&self.user_uuid.expect("ERROR: Could not update values as row does not have a user_uuid").hyphenated().to_string())
        .execute(&data.pool)
        .await {
            Err(err) => Err(err),
            Ok(_) => Ok(())
        }
    }
}