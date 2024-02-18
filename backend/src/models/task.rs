use actix_web::web;
use chrono::{DateTime, Datelike, Days, Months, NaiveDate, NaiveDateTime, NaiveTime, Timelike, Utc};
use serde::{Deserialize, Serialize};
use sqlx::Row;
use uuid::Uuid;

use crate::AppState;

use super::{meeting::get_days_from_month, Model};

#[derive(Serialize, Deserialize)]
pub enum TaskStatus {
    Completed, 
    Ongoing,
    Unknown,
}

impl TaskStatus {
    pub fn stringify(&self) -> String {
        match self {
            TaskStatus::Completed => "completed".to_string(),
            TaskStatus::Ongoing => "ongoing".to_string(),
            TaskStatus::Unknown => "unknown".to_string()
        }
    }
    pub fn from_string(string: &str) -> Self {
        match string {
            "completed" => TaskStatus::Completed,
            "ongoing" => TaskStatus::Ongoing,
            _ => TaskStatus::Unknown
        }
    }
}

#[derive(Serialize, Deserialize)]
pub enum Reaccurance {
    Dayly,
    Weekly,
    Monthly,
    Yearly,
    EveryOtherWeek,
    EveryOtherMonth,
}

impl Reaccurance {
    pub fn stringify(&self) -> String {
        match self {
            Reaccurance::Dayly => "dayly".to_string(),
            Reaccurance::Weekly => "weekly".to_string(),
            Reaccurance::Monthly => "monthly".to_string(),
            Reaccurance::Yearly => "yearly".to_string(),
            Reaccurance::EveryOtherWeek => "everyOtherWeek".to_string(),
            Reaccurance::EveryOtherMonth => "everyOtherMonth".to_string()
        }
    }
    pub fn from_string(string: &str) -> Option<Self> {
        match string {
            "dayly" => Some(Reaccurance::Dayly),
            "weekly" => Some(Reaccurance::Weekly),
            "monthly" => Some(Reaccurance::Monthly),
            "yearly" => Some(Reaccurance::Yearly),
            "everyOtherWeek" => Some(Reaccurance::EveryOtherWeek),
            "everyOtherMonth" => Some(Reaccurance::EveryOtherMonth),
            _ => None
        }
    }
}

#[derive(Serialize, Deserialize)]
pub struct Task {
    pub uuid: Uuid,
    #[serde(rename(deserialize = "crmUuid", serialize = "crmUuid"))]
    pub crm_uuid: Uuid,
    pub start: Option<DateTime<Utc>>,
    pub deadline: Option<DateTime<Utc>>,
    pub reaccurance: Option<Reaccurance>,
    pub status: Option<TaskStatus>,
    #[serde(rename(deserialize = "clientUuid", serialize = "clientUuid"))]
    pub client_uuid: Option<Uuid>,
    pub title: Option<String>,
    pub added: DateTime<Utc>,
    pub updated: DateTime<Utc>,
    pub percentage: Option<i32>
}

impl Model for Task {
    fn from_row(row: &sqlx::mysql::MySqlRow) -> Self {
        Task {
            uuid: Uuid::parse_str(row.get("uuid")).unwrap_or_default(),
            crm_uuid: Uuid::parse_str(row.get("crm_uuid")).unwrap_or_default(),
            client_uuid: match Uuid::parse_str(row.get("client_uuid")) {Err(_) => None, Ok(uuid) => Some(uuid)},
            start: row.get("start"),
            deadline: row.get("deadline"),
            reaccurance: match row.get("reaccurance") {None => None, Some(str) => Reaccurance::from_string(str)},
            title: row.get("title"),
            status: match row.get("status") {None => None, Some(status_str) => Some(TaskStatus::from_string(status_str))},
            added: row.get("added"),
            updated: row.get("updated"),
            percentage: row.try_get("percentage").unwrap_or(None),
        }
    }
}

impl Task {

    pub fn default() -> Self {
        let year: i32 = Utc::now().year();
        let month: u32 = Utc::now().month();
        let day: u32 = Utc::now().day();
        let date: DateTime<Utc> = NaiveDate::from_ymd_opt(year, month, day).unwrap().and_time(NaiveTime::from_hms_opt(0, 0, 0).unwrap()).and_utc();
        Task {
            uuid: Uuid::new_v4(),
            crm_uuid: Uuid::new_v4(),
            client_uuid: None,
            start: Some(date),
            deadline: None,
            reaccurance: None,
            status: None,
            title: None,
            added: Utc::now(),
            updated: Utc::now(),
            percentage: None
        }
    }


    pub async fn insert(&self, data: &web::Data<AppState>) -> Result<(), sqlx::Error> {
        let start: Option<DateTime<Utc>> = match &self.start {None => None, Some(start) => Some(start.with_hour(0).unwrap().with_minute(0).unwrap().with_second(0).unwrap())};
        match sqlx::query("INSERT INTO `crm` . `tasks` (`uuid`, `crm_uuid`, `client_uuid`, `start`, `deadline`, `reaccurance`, `status`, `title`, `added`, `updated`) VALUES (?,?,?,?,?,?,?,?,?,?)")
            .bind(&self.uuid.hyphenated().to_string())
            .bind(&self.crm_uuid.hyphenated().to_string())
            .bind(match &self.client_uuid { None => None, Some(uuid) => Some(uuid.hyphenated().to_string())})
            .bind(start)
            .bind(&self.deadline)
            .bind(match &self.reaccurance {None => None, Some(reaccurance) => Some(reaccurance.stringify())})
            .bind(match &self.status {None => None, Some(status) => Some(status.stringify())})
            .bind(&self.title)
            .bind(&self.added)
            .bind(&self.updated)
            .execute(&data.pool)
            .await {
                Err(err) => Err(err),
                Ok(_) => Ok(())
            }
    }

    pub async fn get_by_client_uuid(client_uuid: &Uuid, crm_uuid: &Uuid, data: &web::Data<AppState>) -> Result<Vec<Self>, sqlx::Error> {
        match sqlx::query("SELECT *, FLOOR((((UNIX_TIMESTAMP(NOW()) - UNIX_TIMESTAMP(`start`)) / (UNIX_TIMESTAMP(`deadline`) - UNIX_TIMESTAMP(`added`))) * 100)) as percentage FROM `crm` . `tasks` WHERE `crm_uuid` = ? AND `client_uuid` = ? ORDER BY `status` DESC, ISNULL(`percentage`), `percentage` DESC")
            .bind(crm_uuid.hyphenated().to_string())
            .bind(client_uuid.hyphenated().to_string())
            .fetch_all(&data.pool)
            .await {
                Err(err) => Err(err),
                Ok(rows) =>  Ok(rows.iter().map(|row| Self::from_row(row)).collect())
            }
    }

    pub async fn get_task(task_uuid: &Uuid, crm_uuid: &Uuid, data: &web::Data<AppState>) -> Result<Option<Self>, sqlx::Error> {
        match sqlx::query("SELECT * FROM `tasks` WHERE `uuid` = ? AND `crm_uuid` = ?")
            .bind(task_uuid.hyphenated().to_string())
            .bind(crm_uuid.hyphenated().to_string())
            .fetch_optional(&data.pool)
            .await {
                Err(err) => Err(err),
                Ok(optn) => match optn {None => Ok(None), Some(row) => Ok(Some(Self::from_row(&row)))}
            }
    }

    pub async fn complete_task(&self, data: &web::Data<AppState>) -> Result<(), sqlx::Error> {
        let mut query = String::from("UPDATE `tasks` SET ");
        let task_res = Self::get_task(&self.uuid, &self.crm_uuid, data).await;
        match task_res {
            Err(err) => Err(err),
            Ok(task_optn) => {
                if let None = task_optn {return Err(sqlx::Error::RowNotFound)} else {
                    let task = task_optn.unwrap();

                    match task.reaccurance {
                        None => {
                            query.push_str("`status` = 'completed' WHERE `uuid` = ? AND `crm_uuid` = ?");
                            return match sqlx::query(&query)
                                .bind(&self.uuid.hyphenated().to_string())
                                .bind(&self.crm_uuid.hyphenated().to_string())
                                .execute(&data.pool)
                                .await {
                                Err(err) => Err(err),
                                Ok(_) => Ok(())
                            };
                        },
                        Some(reaccurance) => {
                            query.push_str("`status` = 'ongoing', `start` = ?, `deadline` = ? WHERE `uuid` = ? AND `crm_uuid` = ?");
                            match reaccurance {
                                Reaccurance::Dayly => {
                                    return match sqlx::query(&query)
                                        .bind(&task.start.unwrap().checked_add_days(Days::new(1)).unwrap())
                                        .bind(&task.deadline.unwrap().checked_add_days(Days::new(1)).unwrap())
                                        .bind(&self.uuid.hyphenated().to_string())
                                        .bind(&self.crm_uuid.hyphenated().to_string())
                                        .execute(&data.pool)
                                        .await {
                                            Err(err) => Err(err),
                                            Ok(_) => Ok(())
                                        };
                                },
                                Reaccurance::Weekly => {
                                    return match sqlx::query(&query)
                                        .bind(&task.start.unwrap().checked_add_days(Days::new(7)).unwrap())
                                        .bind(&task.deadline.unwrap().checked_add_days(Days::new(7)).unwrap())
                                        .bind(&self.uuid.hyphenated().to_string())
                                        .bind(&self.crm_uuid.hyphenated().to_string())
                                        .execute(&data.pool)
                                        .await {
                                            Err(err) => Err(err),
                                            Ok(_) => Ok(())
                                        };
                                },
                                Reaccurance::Monthly => {
                                    return match sqlx::query(&query)
                                        .bind(&task.start.unwrap().checked_add_months(Months::new(1)).unwrap())
                                        .bind(&task.deadline.unwrap().checked_add_months(Months::new(1)).unwrap())
                                        .bind(&self.uuid.hyphenated().to_string())
                                        .bind(&self.crm_uuid.hyphenated().to_string())
                                        .execute(&data.pool)
                                        .await {
                                            Err(err) => Err(err),
                                            Ok(_) => Ok(())
                                        };
                                },
                                Reaccurance::Yearly => {
                                    return match sqlx::query(&query)
                                    .bind(&task.start.unwrap().checked_add_months(Months::new(12)).unwrap())
                                    .bind(&task.deadline.unwrap().checked_add_months(Months::new(12)).unwrap())
                                    .bind(&self.uuid.hyphenated().to_string())
                                    .bind(&self.crm_uuid.hyphenated().to_string())
                                    .execute(&data.pool)
                                    .await {
                                        Err(err) => Err(err),
                                        Ok(_) => Ok(())
                                    };
                                },
                                Reaccurance::EveryOtherWeek => {
                                    return match sqlx::query(&query)
                                    .bind(&task.start.unwrap().checked_add_days(Days::new(14)).unwrap())
                                    .bind(&task.deadline.unwrap().checked_add_days(Days::new(14)).unwrap())
                                    .bind(&self.uuid.hyphenated().to_string())
                                    .bind(&self.crm_uuid.hyphenated().to_string())
                                    .execute(&data.pool)
                                    .await {
                                        Err(err) => Err(err),
                                        Ok(_) => Ok(())
                                    };
                                },
                                Reaccurance::EveryOtherMonth => {
                                    return match sqlx::query(&query)
                                    .bind(&task.start.unwrap().checked_add_months(Months::new(2)).unwrap())
                                    .bind(&task.deadline.unwrap().checked_add_months(Months::new(2)).unwrap())
                                    .bind(&self.uuid.hyphenated().to_string())
                                    .bind(&self.crm_uuid.hyphenated().to_string())
                                    .execute(&data.pool)
                                    .await {
                                        Err(err) => Err(err),
                                        Ok(_) => Ok(())
                                    };
                                }
                            }
                        }
                    }
                }
            }
        }
    }

}