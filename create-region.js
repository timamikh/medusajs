const { Client } = require('pg')

async function createRegion() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/medusa'
  })

  try {
    await client.connect()
    console.log('Connected to database')

    // Проверим, есть ли уже регионы
    const regionsResult = await client.query('SELECT * FROM region')
    console.log('Existing regions:', regionsResult.rows.length)

    if (regionsResult.rows.length === 0) {
      console.log('Creating default region...')

      // Генерируем ID для региона
      const regionId = 'reg_' + Math.random().toString(36).substr(2, 26)
      
      // Создаем регион
      await client.query(`
        INSERT INTO region (id, name, currency_code, created_at, updated_at)
        VALUES ($1, $2, $3, NOW(), NOW())
      `, [regionId, 'United States', 'usd'])

      // Добавляем страну США к региону
      const countryId = 'us'
      await client.query(`
        INSERT INTO country (id, iso_2, iso_3, num_code, name, display_name, region_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (id) DO UPDATE SET region_id = $7
      `, [countryId, 'US', 'USA', 840, 'United States', 'United States', regionId])

      console.log('Region created successfully:', regionId)
    } else {
      console.log('Regions already exist:', regionsResult.rows.map(r => r.name))
    }

  } catch (error) {
    console.error('Error creating region:', error)
    process.exit(1)
  } finally {
    await client.end()
    console.log('Database connection closed')
  }
}

createRegion()
