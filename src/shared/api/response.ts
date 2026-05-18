type Response = {
    readonly code: number,
    readonly message: string,
    readonly timestamp: number,
    readonly traceId: string,
}

export type PageResponse<T> = Response & {
    readonly data: T[],
    readonly pager: PageResult,
}

export type ServerResponse<T> = Response & {
    readonly data: T,
}

export type ErrorResponse = Response & {
    readonly error: string
}

type PageResult = {
    readonly page: number,
    readonly size: number,
    readonly total: number,
    readonly hasNext: boolean
}