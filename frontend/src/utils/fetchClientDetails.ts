import { CacheType, cache } from "./cache";
import request from "./request";

export default async function (crmUuid: string, clientUuid: string): Promise<Client | null> {
    
    //fetch from localStorage
    const ls = localStorage.getItem("crm-client-cache");

    if (!ls) {
        return requestClient(crmUuid, clientUuid);
    } else {
        const clientList = JSON.parse(ls) as Client[];
        const client = clientList.find(client => client.uuid == clientUuid);
        if (!client) {
            return requestClient(crmUuid, clientUuid);
        } else return Promise.resolve(client);
    }

}

const requestClient = async (crmUuid: string, clientUuid: string): Promise<Client | null> => {
    const res = await request<Client>(`/clients?uuid=${crmUuid}&clientUuid=${clientUuid}`, {}, "GET");
    if (res.data){
        cache(res.data, CacheType.Client);
        return Promise.resolve(res.data);
    }
    return Promise.resolve(null);
}

//