interface Task {
    uuid: string,
    crmUuid: string,
    start: string | null,
    deadline: string | null,
    recurrence: TaskReaccurance,
    recurrenceCount: number,
    status: TaskStatus,
    clientUuid: string | null,
    title: string | null,
    added: string,
    updated: string,
    percentage?: number;
}

type TaskRecurrence = "dayly" | "weekly" | "monthly" | "yearly" | "everyOtherWeek" | "everyOtherMonth" | null;
type TaskStatus = "Ongoing" | "Completed" | null