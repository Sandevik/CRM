interface Crm {
    userUuid: string,
    crmUuid: string,
    added: string,
    hidden: boolean,
    name: string,
    clients?: Client[],
    meetings?: Meeting[],
    deals?: Deal[],
    employees?: Employee[],
}