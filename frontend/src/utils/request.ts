
export default async function <T extends Object, U extends Object = Object>(apiEndpoint: string, data: InputData<U>, method: HTTPMETHOD = "GET"): Promise<ResultData<T>> {
    const result = await fetch("http://"+ process.env.NEXT_PUBLIC_BACKEND_SERVER_ADDRESS + ":" + process.env.NEXT_PUBLIC_BACKEND_SERVER_PORT + apiEndpoint, {
        method,
        body: method === "GET" ? undefined : JSON.stringify(data),
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Authorization": "Bearer " + localStorage.getItem("auth_token") || "",
        }
    })
    return await result.json() as ResultData<T>;
}