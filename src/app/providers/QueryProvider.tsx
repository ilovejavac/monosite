import {MutationCache, QueryCache, QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {ReactQueryDevtools} from '@tanstack/react-query-devtools'

const defaultFallback = '请求失败'

function apiErrorMessage(error: unknown, fallback = defaultFallback) {
    return error instanceof Error && error.message ? error.message : fallback
}

export function QueryProvider({children}: Readonly<{ children: ReactNode }>) {
    const {error} = useMessage()
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
                retry: (failureCount, error) => {
                    if (error instanceof Error && 'code' in error) {
                        return false
                    }
                    return failureCount < 3
                },
                retryDelay: (attemptIndex) => 500 * 2 ** attemptIndex,
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
