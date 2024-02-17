interface Task {
    crmUuid: string,
    deadline: string | null,
    status: "Ongoing" | "Completed" | null,
    clientUuid: string | null,
    title: string | null,
    added: string,
    updated: string,
    percentage?: number;
}