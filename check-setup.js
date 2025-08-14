const { Client } = require('pg')

async function checkSetup() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/medusa'
  })

  try {
    await client.connect()
    console.log('Connected to database')

    // Проверим, какие таблицы есть
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name LIKE '%region%' OR table_name LIKE '%country%' OR table_name LIKE '%sales%'
      ORDER BY table_name
    `)
    console.log('\n=== RELEVANT TABLES ===')
    tablesResult.rows.forEach(table => {
      console.log(`- ${table.table_name}`)
    })

    // Проверим регионы
    const regionsResult = await client.query('SELECT * FROM region')
    console.log('\n=== REGIONS ===')
    regionsResult.rows.forEach(region => {
      console.log(`- ${region.name} (${region.id}) - Currency: ${region.currency_code}`)
    })

    // Проверим sales channels
    const salesChannelsResult = await client.query('SELECT * FROM sales_channel')
    console.log('\n=== SALES CHANNELS ===')
    salesChannelsResult.rows.forEach(sc => {
      console.log(`- ${sc.name} (${sc.id}) - Description: ${sc.description}`)
    })

    // Проверим структуру таблицы region_country
    const columnsResult = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'region_country'
      ORDER BY ordinal_position
    `)
    console.log('\n=== REGION_COUNTRY TABLE STRUCTURE ===')
    columnsResult.rows.forEach(col => {
      console.log(`- ${col.column_name}: ${col.data_type}`)
    })

    // Проверим страны в регионах (с правильными колонками)
    const regionCountriesResult = await client.query('SELECT * FROM region_country LIMIT 5')
    console.log('\n=== REGION COUNTRIES (SAMPLE) ===')
    if (regionCountriesResult.rows.length === 0) {
      console.log('No countries assigned to regions!')
    } else {
      console.log('Columns:', Object.keys(regionCountriesResult.rows[0]))
      regionCountriesResult.rows.forEach(rc => {
        console.log(`- Row:`, rc)
      })
    }

    // Проверим API keys (используем правильную таблицу)
    const apiKeysResult = await client.query('SELECT table_name FROM information_schema.tables WHERE table_name LIKE \'%api%key%\'')
    console.log('\n=== API KEY TABLES ===')
    apiKeysResult.rows.forEach(table => {
      console.log(`- ${table.table_name}`)
    })

  } catch (error) {
    console.error('Error checking setup:', error)
  } finally {
    await client.end()
    console.log('\nDatabase connection closed')
  }
}

checkSetup()
