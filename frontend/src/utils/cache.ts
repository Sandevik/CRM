export enum CacheType {
    Client,
} 
type U = CacheType;
type T = U extends CacheType.Client ? Client : never;

export function cache(item: T | T[], as: U): void {
    switch (as) {
        case CacheType.Client:
            const ls = localStorage.getItem("crm-client-cache");
            if (!ls) {
                if (Array.isArray(item)){
                    localStorage.setItem("crm-client-cache", JSON.stringify(item))
                } else {
                    localStorage.setItem("crm-client-cache", JSON.stringify([item]));
                }
            } else {
                let parsed = JSON.parse(ls) as Client[];
                if (Array.isArray(item)) {
                    item.forEach(cl => {
                        parsed = parsed.filter(client => client.uuid !== cl.uuid)
                    })
                    parsed = [...parsed, ...item];
                } else {
                    parsed = parsed.filter(client => client.uuid !== item.uuid)
                    parsed.push(item);
                }
                localStorage.setItem("crm-client-cache", JSON.stringify(parsed));
            }
        break;
    }
}