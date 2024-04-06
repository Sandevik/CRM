
export default async function <T extends Object, U extends Object = Object>(apiEndpoint: string, data: InputData<U>, method: HTTPMETHOD = "GET"): Promise<ResultData<T>> {
    try {
        let link = (process.env.NEXT_PUBLIC_DEV === "1" ? "http://localhost" : "https://"+ process.env.NEXT_PUBLIC_BACKEND_SERVER_ADDRESS || "localhost") + apiEndpoint
        const result = await fetch(link, {
            method,
            body: method === "GET" || method === "DELETE" ? undefined : JSON.stringify(data),
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Authorization": "Bearer " + localStorage.getItem("auth_token") || "",
            }
        })
        return await result.json() as ResultData<T>;
    } catch {
        return Promise.resolve({code: 500, message: "Server error fetching data"} as ResultData<T>)
    }
}