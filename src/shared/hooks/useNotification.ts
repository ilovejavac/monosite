import { App } from 'antd'

export function useNotification() {
    return App.useApp().notification
}
