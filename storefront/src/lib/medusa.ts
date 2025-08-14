import Medusa from "@medusajs/medusa-js"

// Инициализация клиента Medusa
const medusaClient = new Medusa({
  baseUrl: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000",
  maxRetries: 3,
  publishableApiKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "pk_test_default",
})

export default medusaClient
