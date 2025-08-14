import Medusa from "@medusajs/medusa-js"

// Инициализация клиента Medusa
const medusaClient = new Medusa({
  baseUrl: "http://localhost:9000",
  maxRetries: 3,
})

export default medusaClient
