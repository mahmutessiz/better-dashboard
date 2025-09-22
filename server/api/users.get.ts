// get users from the database
export default defineEventHandler(async (event) => {
    try {
        // Forward the request to your backend
        const response = await $fetch('http://localhost:6969/api/dashboard/users', {
            headers: {
                Cookie: event.node.req.headers.cookie
            }
        })
        
        return response
    } catch (error) {
        console.error('Users fetch error:', error)
        throw createError({
            statusCode: 500,
            message: 'Failed to fetch users'
        })
    }
})