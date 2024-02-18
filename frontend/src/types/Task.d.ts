interface Task {
    uuid: string,
    crmUuid: string,
    start: string | null,
    deadline: string | null,
    reaccurance: TaskReaccurance,
    status: TaskStatus,
    clientUuid: string | null,
    title: string | null,
    added: string,
    updated: string,
    percentage?: number;
}

type TaskReaccurance = "dayly" | "weekly" | "monthly" | "yearly" | "everyOtherWeek" | "everyOtherMonth" | null;
type TaskStatus = "Ongoing" | "Completed" | null