export enum CacheType {
    Customer,
    Crm
} 
type U = CacheType;
type T = 
U extends CacheType.Customer ? Customer :
U extends CacheType.Crm ? Crm : any;

export function cache(item: T | T[], as: U): void {
    switch (as) {
        case CacheType.Customer:
            var ls = localStorage.getItem("crm-customer-cache");
            if (!ls) {
                if (Array.isArray(item)){
                    localStorage.setItem("crm-customer-cache", JSON.stringify(item))
                } else {
                    localStorage.setItem("crm-customer-cache", JSON.stringify([item]));
                }
            } else {
                let parsed = JSON.parse(ls) as Customer[];
                if (Array.isArray(item)) {
                    item.forEach(cl => {
                        parsed = parsed.filter(customer => customer.uuid !== cl.uuid)
                    })
                    parsed = [...parsed, ...item];
                } else {
                    parsed = parsed.filter(customer => customer.uuid !== item.uuid)
                    parsed.push(item);
                }
                localStorage.setItem("crm-customer-cache", JSON.stringify(parsed));
            }
        break;

        case CacheType.Crm:
            var ls = localStorage.getItem("crm-crm-cache");
            if (!ls) {
                if (Array.isArray(item)){
                    localStorage.setItem("crm-crm-cache", JSON.stringify(item))
                } else {
                    localStorage.setItem("crm-crm-cache", JSON.stringify([item]));
                }
            } else {
                let parsed = JSON.parse(ls) as Crm[];
                if (Array.isArray(item)) {
                    item.forEach(cr => {
                        parsed = parsed.filter(crm => crm.crmUuid !== cr.crmUuid)
                    })
                    parsed = [...parsed, ...item];
                } else {
                    parsed = parsed.filter(crm => crm.crmUuid !== item.uuid)
                    parsed.push(item);
                }
                localStorage.setItem("crm-crm-cache", JSON.stringify(parsed));
            }
        break;
    }
}