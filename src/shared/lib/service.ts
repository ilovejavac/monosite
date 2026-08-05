import axios, {
    type AxiosResponse,
    type AxiosInstance,
    type AxiosRequestConfig,
    type InternalAxiosRequestConfig
} from 'axios'

import type {ErrorResponse, PageResponse, Response, ServerResponse} from '../api/response'

const server = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 2_000,
    headers: {
        'Content-Type': 'application/json'
    }
})

type ApiError = Error & {
    code?: number
    traceId?: string
    timestamp?: number
}

type ApiResponse<T> = PageResponse<T> | ServerResponse<T> | ErrorResponse

type ApiClient = Omit<
    AxiosInstance,
    'request' | 'get' | 'delete' | 'head' | 'options' | 'post' | 'put' | 'patch' | 'postForm' | 'putForm' | 'patchForm'
> & {
    request<T = unknown, D = unknown>(config: AxiosRequestConfig<D>): Promise<T>
    get<T = unknown, D = unknown>(url: string, config?: AxiosRequestConfig<D>): Promise<T>
    delete<T = unknown, D = unknown>(url: string, config?: AxiosRequestConfig<D>): Promise<T>
    head<T = unknown, D = unknown>(url: string, config?: AxiosRequestConfig<D>): Promise<T>
    options<T = unknown, D = unknown>(url: string, config?: AxiosRequestConfig<D>): Promise<T>
    post<T = unknown, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<T>
    put<T = unknown, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<T>
    patch<T = unknown, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<T>
    postForm<T = unknown, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<T>
    putForm<T = unknown, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<T>
    patchForm<T = unknown, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<T>
}

const pendingRequests = new Map<string, AbortController>();

const isErrorResponse = <T>(response: ApiResponse<T>): response is ErrorResponse => {
    return response.code !== 200
}

const toApiError = (response: Response & { error?: string }) => {
    const error = new Error(response.error || response.message) as ApiError;
    error.code = response.code;
    error.traceId = response.traceId;
    error.timestamp = response.timestamp;
    return error;
};

const generateRequestKey = (config: InternalAxiosRequestConfig) => {
    return `${config.method}_${config.url}_${JSON.stringify(config.params)}_${JSON.stringify(config.data)}`;
};

server.interceptors.request.use(
    (config) => {
        // 1. 取消重复请求
        const key = generateRequestKey(config);
        const pendingRequest = pendingRequests.get(key)
        if (pendingRequest) {
            // 取消之前的请求
            pendingRequest.abort();
            pendingRequests.delete(key);
        }

        // 2. 创建并绑定新的 AbortController
        const controller = new AbortController();
        config.signal = controller.signal;
        pendingRequests.set(key, controller);

        // 3. 动态添加 Token
        const token = localStorage.getItem('ACCESS_TOKEN');
        if (token) {
            config.headers.set('Authorization', `Bearer ${token}`);
        }

        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

server.interceptors.response.use(
    (response: AxiosResponse<ApiResponse<unknown>>) => {
        // 从响应中移除已完成的请求
        const key = generateRequestKey(response.config)
        pendingRequests.delete(key)

        const res = response.data
        if (isErrorResponse(res)) {
            throw toApiError(res)
        }

        return res as unknown as AxiosResponse<ApiResponse<unknown>>
    },
    (error) => {
        const config = error.config as InternalAxiosRequestConfig | undefined
        if (config) {
            pendingRequests.delete(generateRequestKey(config))
        }

        if (axios.isCancel(error)) {
            return new Promise(() => {
            })
        }

        if (axios.isAxiosError<ErrorResponse>(error)) {
            const response = error.response?.data
            if (response?.error) {
                throw toApiError(response)
            }
        }

        throw error
    }
)

export default server as ApiClient
