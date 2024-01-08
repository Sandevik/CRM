type InputData<T extends Object> = T;
type ResultData<T extends Object> = T;
type HTTPMETHOD = "GET" | "POST" | "PUT" | "DELETE";

interface SignInData {
    code: number,
    message: string,
    token?: string,
}
