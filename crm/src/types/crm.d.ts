interface Crm {
    userUuid: string,
    crmUuid: string,
    added: string,
    hidden: boolean,
    name: string,
    customers?: Customer[],
    meetings?: Meeting[],
    deals?: Deal[],
    employees?: Employee[],
}