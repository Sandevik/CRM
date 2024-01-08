type InputData<T extends Object> = T;
type ResultData<T> = {
    code: number,
    message: string,
} & {
    [Property in keyof T]: T[Property]
}
type HTTPMETHOD = "GET" | "POST" | "PUT" | "DELETE";


