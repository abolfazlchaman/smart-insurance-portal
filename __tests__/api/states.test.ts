import fetch from 'node-fetch';

describe('States API', () => {
  const API_URL = 'https://assignment.devotel.io/api/getStates';

  it('should return states for Canada', async () => {
    const response = await fetch(`${API_URL}?country=Canada`);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({
      country: 'Canada',
      states: ['Ontario', 'Quebec', 'British Columbia', 'Alberta'],
    });
  });

  it('should return consistent data structure', async () => {
    const response = await fetch(`${API_URL}?country=Canada`);
    const data = await response.json();

    expect(data).toHaveProperty('country');
    expect(data).toHaveProperty('states');
    expect(Array.isArray(data.states)).toBe(true);
  });
});
