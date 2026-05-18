import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

type ErrorWithTraceId = Error & {
    traceId?: string
}

const defaultFallback = '请求失败'

function hasTraceId(error: Error): error is ErrorWithTraceId {
    return 'traceId' in error && typeof (error as ErrorWithTraceId).traceId === 'string'
}

function apiErrorMessage(error: unknown, fallback = defaultFallback) {
    const text = error instanceof Error && error.message ? error.message : fallback

    if (error instanceof Error && hasTraceId(error) && error.traceId) {
        return `${text}（traceId: ${error.traceId}）`
    }

    return text
}

export function QueryProvider({ children }: { children: ReactNode }) {
    const { error } = useMessage()
    const [queryClient] = useState(() => new QueryClient({
        queryCache: new QueryCache({
            onError: (queryError) => {
                error(apiErrorMessage(queryError))
            },
        }),
        mutationCache: new MutationCache({
            onError: (queryError) => {
                error(apiErrorMessage(queryError))
            },
        }),
        defaultOptions: {
            queries: {
                retry: 2,
                staleTime: 30_000,
                refetchOnWindowFocus: true,
                refetchOnReconnect: true,
            },
        },
    }))

    return (
        <QueryClientProvider client={queryClient}>
            {children}
            {import.meta.env.DEV ? (
                <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-right"/>
            ) : null}
        </QueryClientProvider>
    )
}
