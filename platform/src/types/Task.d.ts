interface Task {
    uuid: string,
    crmUuid: string,
    start: string | null,
    deadline: string | null,
    recurrence: TaskReaccurance,
    recurrenceCount: number,
    status: TaskStatus,
    customerUuid: string | null,
    employeeUuid: string | null,
    title: string | null,
    added: string,
    updated: string,
    percentage?: number;
}

type TaskRecurrence = "Dayly" | "Weekly" | "Monthly" | "Yearly" | "EveryOtherWeek" | "EveryOtherMonth" | null;
type TaskStatus = "Ongoing" | "Completed" | "ongoing" | "completed" | null