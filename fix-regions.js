const { Client } = require('pg')

async function fixRegions() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/medusa'
  })

  try {
    await client.connect()
    console.log('Connected to database')

    const regionId = 'reg_01K2JSQZG6D53TQEC2F7V3Y41P' // Europe region ID

    // Список европейских стран для привязки к региону Europe
    const europeanCountries = [
      'de', 'fr', 'it', 'es', 'nl', 'be', 'at', 'ch', 'se', 'no', 
      'dk', 'fi', 'pl', 'cz', 'hu', 'pt', 'gr', 'ie', 'gb'
    ]

    console.log(`Assigning ${europeanCountries.length} countries to Europe region...`)

    for (const countryCode of europeanCountries) {
      await client.query(
        'UPDATE region_country SET region_id = $1 WHERE iso_2 = $2',
        [regionId, countryCode]
      )
    }

    console.log('Countries assigned successfully!')

    // Проверим результат
    const result = await client.query(
      'SELECT iso_2, name, region_id FROM region_country WHERE region_id = $1',
      [regionId]
    )

    console.log(`\n${result.rows.length} countries now assigned to Europe region:`)
    result.rows.forEach(country => {
      console.log(`- ${country.name} (${country.iso_2})`)
    })

  } catch (error) {
    console.error('Error fixing regions:', error)
    process.exit(1)
  } finally {
    await client.end()
    console.log('\nDatabase connection closed')
  }
}

fixRegions()
