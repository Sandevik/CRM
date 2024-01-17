import request from "./request";

export default async function (uuid: string): Promise<Client | null> {
    
    //fetch from localStorage
    const ls = localStorage.getItem("crm-client-cache");

    if (!ls) {
        //request
        return Promise.resolve(null)


    } else {
        const clientList = JSON.parse(ls) as Client[];
        const client = clientList.find(client => client.uuid == uuid);
        if (!client) {
            //request
            return Promise.resolve(null)

        } else return Promise.resolve(client);
    }

}
/* 
const requestClient = async (uuid: string): Promise<Client> => {
    const res = await request()
} */