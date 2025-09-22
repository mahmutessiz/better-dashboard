// server/api/session.get.ts
export default defineEventHandler(async (event) => {
  try {
    // Get cookies from the incoming request
    const cookies = parseCookies(event)
    
    // Forward the request to your backend
    const response = await $fetch('http://localhost:6969/api/auth/get-session', {
      headers: {
        Cookie: Object.entries(cookies)
          .map(([key, value]) => `${key}=${value}`)
          .join('; ')
      }
    })
    
    return response
  } catch (error) {
    console.error('Session fetch error:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch session'
    })
  }
})