interface TimeReport {

    crmUuid: string,
    uuid: string,
    employeeUuid: string,
    scheduleDate: string,
    startDateTime: string | null,
    endDateTime: string | null,
    note: string | null,
    workTasks: string | null,
    added: string,
    updated: string,
    
    breaks: Break[] | null,
}
