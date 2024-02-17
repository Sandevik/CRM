interface Task {
    crmUuid: string,
    deadline: string | null,
    status: string | null,
    clientUuid: string | null,
    title: string | null,
    added: string,
    updated: string,
    percentage?: number;
}