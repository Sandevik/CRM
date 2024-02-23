import { CacheType, cache } from "./cache";
import request from "./request";

export default async function (crmUuid: string, customerUuid: string): Promise<Customer | null> {
    
    //fetch from localStorage
    const ls = localStorage.getItem("crm-customer-cache");

    if (!ls) {
        return requestCustomer(crmUuid, customerUuid);
    } else {
        const clientList = JSON.parse(ls) as Customer[];
        const customer = clientList.find(customer => customer.uuid == customerUuid);
        if (!customer) {
            return requestCustomer(crmUuid, customerUuid);
        } else return Promise.resolve(customer);
    }

}

const requestCustomer = async (crmUuid: string, customerUuid: string): Promise<Customer | null> => {
    const res = await request<Customer>(`/customers?crmUuid=${crmUuid}&customerUuid=${customerUuid}`, {}, "GET");
    if (res.data){
        cache(res.data, CacheType.Customer);
        return Promise.resolve(res.data);
    }
    return Promise.resolve(null);
}

//