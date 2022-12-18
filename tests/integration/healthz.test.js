const request = require('supertest');
const httpStatus = require('http-status');
const app = require('../../src/app');
const config = require('../../src/config/config');

describe('Health route', () => {
  const methods = ['GET', 'POST', 'PUT', 'DELETE'];
  const endpoint = '/v1/healthz';

  methods.forEach((method) => {
    describe(`${method} ${endpoint}`, () => {
      test('should return 200 when running in production', async () => {
        config.env = 'production';

        await request(app)[method.toLocaleLowerCase()](endpoint).send().expect(httpStatus.OK);
        config.env = process.env.NODE_ENV;
      });
    });
  });
});
