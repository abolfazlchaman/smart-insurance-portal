import fetch from 'node-fetch'

describe('Insurance Forms API', () => {
  const API_URL = 'https://assignment.devotel.io/api/insurance/forms'

  it('should return array of forms', async () => {
    const response = await fetch(API_URL)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(Array.isArray(data)).toBe(true)
    expect(data.length).toBeGreaterThan(0)
  })

  it('should return forms with required structure', async () => {
    const response = await fetch(API_URL)
    const data = await response.json()

    // Check first form structure
    const firstForm = data[0]
    expect(firstForm).toHaveProperty('formId')
    expect(firstForm).toHaveProperty('title')
    expect(firstForm).toHaveProperty('fields')
    expect(Array.isArray(firstForm.fields)).toBe(true)
  })

  it('should include health insurance form', async () => {
    const response = await fetch(API_URL)
    const data = await response.json()

    const healthForm = data.find((form: any) => form.formId === 'health_insurance_application')
    expect(healthForm).toBeDefined()
    expect(healthForm.title).toBe('Health Insurance Application')
  })
}) 