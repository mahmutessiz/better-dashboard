export default defineNuxtPlugin((NuxtApp) => {
  const config = useRuntimeConfig()
 const baseURL = config.public.baseURL;
  // Access baseURL universally
  return baseURL
})
