import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../src/server';

describe('GET /api/news', () => {
  it('should return a 200 OK response', async () => {
    const response = await request(app).get('/api/news');
    expect(response.status).toBe(200);
  });

  it('should return a json response', async () => {
    const response = await request(app).get('/api/news');
    expect(response.headers['content-type']).toMatch(/json/);
  });

  it('should return the correct message', async () => {
    const response = await request(app).get('/api/news');
    expect(response.body.message).toBe('Hello from the news API!');
  });
});
