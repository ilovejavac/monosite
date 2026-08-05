export default function UserPage() {
    const params = useParams()

    return (
        <>
            user page {params['*']}
        </>
    )
}