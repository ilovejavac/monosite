export type QueryRequest<T> = {
    query: T,
    page: number,
    size: number,
    orderBy: Order[]
}

type Order = {
    property: string,
    direction: 'ASC' | 'DESC'
}
