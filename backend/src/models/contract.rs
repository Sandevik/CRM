use chrono::{DateTime, NaiveDate, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Serialize, Deserialize)]
struct Contract {
    #[serde(rename(serialize = "crmUuid", deserialize = "crmUuid"))]
    crm_uuid: Uuid,
    uuid: Uuid,
    #[serde(rename(serialize = "employeeUuid", deserialize = "employeeUuid"))]
    employee_uuid: Uuid,
    #[serde(rename(serialize = "isTemplate", deserialize = "isTemplate"))]
    is_template: Option<bool>,
    #[serde(rename(serialize = "employmentDate", deserialize = "employmentDate"))]
    employment_date: Option<NaiveDate>,
    title: Option<String>,
    #[serde(rename(serialize = "newEmployment", deserialize = "newEmployment"))]
    new_employment: Option<bool>,
    change: Option<bool>,
    #[serde(rename(serialize = "changeFromDate", deserialize = "changeFromDate"))]
    change_from_date: Option<NaiveDate>,
    #[serde(rename(serialize = "probationaryEmployment", deserialize = "probationaryEmployment"))]
    probationary_employment: Option<bool>,
    #[serde(rename(serialize = "probationaryEmploymentFrom", deserialize = "probationaryEmploymentFrom"))]
    probationary_employment_from: Option<NaiveDate>,
    #[serde(rename(serialize = "probationaryEmploymentUntil", deserialize = "probationaryEmploymentUntil"))]
    probationary_employment_until: Option<NaiveDate>,
    #[serde(rename(serialize = "permanentEmployment", deserialize = "permanentEmployment"))]
    permanent_emloyment: Option<bool>,
    #[serde(rename(serialize = "tempEmployment", deserialize = "tempEmployment"))]
    temp_employment: Option<bool>,
    #[serde(rename(serialize = "tempEmploymentForName", deserialize = "tempEmploymentForName"))]
    temp_employment_for_name: Option<String>,
    #[serde(rename(serialize = "tempEmploymentReason", deserialize = "tempEmploymentReason"))]
    temp_employment_reason: Option<String>,
    #[serde(rename(serialize = "tempEmploymentFrom", deserialize = "tempEmploymentFrom"))]
    temp_employment_from: Option<NaiveDate>,
    #[serde(rename(serialize = "tempEmploymentUntil", deserialize = "tempEmploymentUntil"))]
    temp_employment_until: Option<NaiveDate>,
    #[serde(rename(serialize = "extraEmployment", deserialize = "extraEmployment"))]
    extra_employment: Option<bool>,
    #[serde(rename(serialize = "extraEmploymentFrom", deserialize = "extraEmploymentFrom"))]
    extra_employment_from: Option<NaiveDate>,
    #[serde(rename(serialize = "extraEmploymentUntil", deserialize = "extraEmploymentUntil"))]
    extra_employment_until: Option<NaiveDate>,
    #[serde(rename(serialize = "extraEmploymentSetDays", deserialize = "extraEmploymentSetDays"))]
    extra_employment_set_days: Option<String>,
    #[serde(rename(serialize = "otherFixedTermEmployment", deserialize = "otherFixedTermEmployment"))]
    other_fixed_term_employment: Option<bool>,
    #[serde(rename(serialize = "otherFixedTermEmploymentStandard", deserialize = "otherFixedTermEmploymentStandard"))]
    other_fixed_term_employment_standard: Option<bool>,
    #[serde(rename(serialize = "otherFixedTermEmploymentSeasonWork", deserialize = "otherFixedTermEmploymentSeasonWork"))]
    other_fixed_term_employment_season_work: Option<bool>,
    #[serde(rename(serialize = "otherFixedTermEmploymentSpecial", deserialize = "otherFixedTermEmploymentSpecial"))]
    other_fixed_term_employment_special: Option<bool>,
    #[serde(rename(serialize = "otherFixedTermEmploymentFrom", deserialize = "otherFixedTermEmploymentFrom"))]
    other_fixed_term_employment_from: Option<NaiveDate>,
    #[serde(rename(serialize = "otherFixedTermEmploymentUntil", deserialize = "otherFixedTermEmploymentUntil"))]
    other_fixed_term_employment_until: Option<NaiveDate>,
    #[serde(rename(serialize = "workingHoursFullTime", deserialize = "workingHoursFullTime"))]
    working_hours_full_time: Option<bool>,
    #[serde(rename(serialize = "workingHoursPartTime", deserialize = "workingHoursPartTime"))]
    working_hours_part_time: Option<bool>,
    #[serde(rename(serialize = "workingHoursPartTimeWeeklyHours", deserialize = "workingHoursPartTimeWeeklyHours"))]
    working_hours_part_time_weekly_hours: Option<u8>,
    #[serde(rename(serialize = "salaryGroup", deserialize = "salaryGroup"))]
    salary_group: Option<String>,
    #[serde(rename(serialize = "entrySalary", deserialize = "entrySalary"))]
    entry_salary: Option<f32>,
    #[serde(rename(serialize = "salaryForm", deserialize = "salaryForm"))]
    salary_form: Option<String>,
    #[serde(rename(serialize = "paymentForm", deserialize = "paymentForm"))]
    payment_form: Option<String>,
    vacation: Option<String>,
    #[serde(rename(serialize = "activeCollectiveAgreement", deserialize = "activeCollectiveAgreement"))]
    active_collective_agreement: Option<String>, 
    note: Option<String>,
    #[serde(rename(serialize = "bankNumber", deserialize = "bankNumber"))]
    bank_number: Option<String>,
    #[serde(rename(serialize = "clearingNumber", deserialize = "clearingNumber"))]
    clearing_number: Option<String>,
    #[serde(rename(serialize = "bankName", deserialize = "bankName"))]
    bank_name: Option<String>,
    added: Option<DateTime<Utc>>,
    updated: Option<DateTime<Utc>>
}