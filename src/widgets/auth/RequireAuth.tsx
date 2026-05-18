export function RequireAuth({children}: { children: ReactNode }) {
    const location = useLocation()
    const loggedIn = !!localStorage.getItem('token')

    if (!loggedIn) {
        return <Navigate to="/login" replace state={{from: location}}/>
    }

    return <>{children}</>
}