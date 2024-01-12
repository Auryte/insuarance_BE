import request from 'supertest';
import app from 'app';

import * as fs from 'node:fs';

const adminToken = process.env.ADMIN_TOKEN;
const testImage = `${__dirname}/test_image.jpg`;

describe('Upload image', () => {
  it('server works', async () => {
    const response = await request(app).get('/').set('Authorization', adminToken);
    expect(response.statusCode).toBe(200);
  });

  it('POST /upload without body should returns error', async () => {
    const response = await request(app).post('/image/upload').set('Authorization', adminToken);
    expect(response.statusCode).toBe(400);
  });

  it('POST /upload with invalid body should returns error', async () => {
    const response = await request(app)
      .post('/image/upload')
      .send('dddd')
      .set('Authorization', adminToken);
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toContain(
      'Logo must be an image of jpeg, jpg, png, svg or webp format.'
    );
  });

  it('POST /upload with valid body should returns valid response', () => {
    request(app)
      .post('/image/upload')
      .set('Authorization', adminToken)
      .set('Content-Type', 'image/jpeg')
      .send(fs.readFileSync(testImage, 'utf-8'))
      .expect(200)
      .expect('Logo successfully uploaded.');
  });
});
