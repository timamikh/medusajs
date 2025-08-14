import Medusa from "@medusajs/medusa-js"

// Инициализация клиента Medusa
const medusaClient = new Medusa({
  baseUrl: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000",
  maxRetries: 3,
  publishableApiKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "pk_3f97bb73eefcfe9100578b737e13e04f878f0607d080b34d4e01e40facbbab54",
})

export default medusaClient
