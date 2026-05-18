import { App as AntdApp } from 'antd'

const MESSAGE_STACK_THRESHOLD = 2
const MESSAGE_DURATION_SECONDS = 3
const NOTIFICATION_DURATION_SECONDS = 4.5

export function AntdProvider({ children }: { children: ReactNode }) {
    return (
        <AntdApp
            message={{
                duration: MESSAGE_DURATION_SECONDS,
                pauseOnHover: true,
                stack: {
                    threshold: MESSAGE_STACK_THRESHOLD,
                },
            }}
            notification={{
                duration: NOTIFICATION_DURATION_SECONDS,
                pauseOnHover: true,
                placement: 'topRight',
                stack: {
                    threshold: MESSAGE_STACK_THRESHOLD,
                },
            }}
        >
            {children}
        </AntdApp>
    )
}
