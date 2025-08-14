const { Medusa } = require('@medusajs/medusa-js')

async function createApiKey() {
  try {
    // Create admin client
    const medusa = new Medusa({ baseUrl: 'http://localhost:9000' })
    
    // Login as admin
    const loginResponse = await medusa.admin.auth.getToken({
      email: 'admin@medusa.com',
      password: 'supersecret'
    })
    
    console.log('Logged in successfully')
    
    // Create publishable API key
    const apiKeyResponse = await medusa.admin.publishableApiKeys.create({
      title: 'Storefront API Key'
    })
    
    console.log('Publishable API Key created:')
    console.log('ID:', apiKeyResponse.publishable_api_key.id)
    console.log('Key:', apiKeyResponse.publishable_api_key.id)
    
    return apiKeyResponse.publishable_api_key.id
  } catch (error) {
    console.error('Error creating API key:', error.message)
    return null
  }
}

// Run the function if this script is executed directly
if (require.main === module) {
  createApiKey().then(key => {
    if (key) {
      console.log('\nAdd this to your storefront .env file:')
      console.log(`NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=${key}`)
    }
    process.exit(0)
  })
}

module.exports = { createApiKey }
