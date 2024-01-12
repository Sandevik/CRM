type InputData<T extends Object> = T;

type ResultOptions = {
    code: number,
    message: string
}

type ResultData<T> = (ResultOptions & {
    data?: {[Property in keyof T]: T[Property]}
})
type HTTPMETHOD = "GET" | "POST" | "PUT" | "DELETE";



