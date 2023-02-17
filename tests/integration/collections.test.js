const request = require('supertest');
const app = require('../../src/app');

describe('API Integration Tests', () => {
  let createdCollectionId;

  describe('POST /collection', () => {
    it('should create a new collection with the given fields', async () => {
      const newCollection = {
        name: 'testcollection',
        fields: [
          { name: 'field1', type: 'String', required: true, default: 'default1' },
          { name: 'field2', type: 'Number', required: false, default: 0 },
        ],
      };
      const response = await request(app).post('/collection').send(newCollection).expect(201);
      createdCollectionId = response.body._id;
      expect(response.body.name).toBe(newCollection.name);
      expect(response.body.fields).toEqual(newCollection.fields);
    });
  });

  describe('GET /collection/:id', () => {
    it('should return a collection with the given ID', async () => {
      const response = await request(app).get(`/collection/${createdCollectionId}`).expect(200);
      expect(response.body._id).toBe(createdCollectionId);
    });

    it('should return 404 if the collection is not found', async () => {
      const response = await request(app).get('/collection/nonexistentid').expect(404);
      expect(response.body.message).toBe('Collection not found');
    });
  });

  describe('POST /collection/:id/document', () => {
    it('should create a new document in the collection with the given fields', async () => {
      const newDocument = {
        field1: 'testvalue',
        field2: 42,
      };
      const response = await request(app).post(`/collection/${createdCollectionId}/document`).send(newDocument).expect(201);
      expect(response.body.field1).toBe(newDocument.field1);
      expect(response.body.field2).toBe(newDocument.field2);
    });

    it('should return 400 if a required field is missing', async () => {
      const newDocument = {
        field2: 42,
      };
      const response = await request(app).post(`/collection/${createdCollectionId}/document`).send(newDocument).expect(400);
      expect(response.body.message).toBe('Validation failed: field1: Path `field1` is required.');
    });
  });

  describe('GET /collection/:id/document/:documentId', () => {
    let createdDocumentId;

    beforeAll(async () => {
      const newDocument = {
        field1: 'testvalue',
        field2: 42,
      };
      const response = await request(app).post(`/collection/${createdCollectionId}/document`).send(newDocument).expect(201);
      createdDocumentId = response.body._id;
    });

    it('should return a document with the given ID', async () => {
      const response = await request(app)
        .get(`/collection/${createdCollectionId}/document/${createdDocumentId}`)
        .expect(200);
      expect(response.body._id).toBe(createdDocumentId);
    });

    it('should return 404 if the document is not found', async () => {
      const response = await request(app).get(`/collection/${createdCollectionId}/document/nonexistentid`).expect(404);
      expect(response.body.message).toBe('Document not found');
    });
  });

  describe('PATCH /collection/:id/document/:documentId', () => {
    let createdDocumentId;

    beforeAll(async () => {
      const newDocument = {
        field1: 'testvalue',
        field2: 42,
      };
      const response = await request(app).post(`/collection/${createdCollectionId}/document`).send(newDocument).expect(201);
      createdDocumentId = response.body._id;
    });

    it('should update a document with the given fields', async () => {
      const updatedDocument = {
        field1: 'updatedvalue',
        field2: 43,
      };
      const response = await request(app)
        .patch(`/collection/${createdCollectionId}/document/${createdDocumentId}`)
        .send(updatedDocument)
        .expect(200);
      expect(response.body.field1).toBe(updatedDocument.field1);
      expect(response.body.field2).toBe(updatedDocument.field2);
    });

    it('should return 404 if the document is not found', async () => {
      const response = await request(app)
        .patch(`/collection/${createdCollectionId}/document/nonexistentid`)
        .send({})
        .expect(404);
      expect(response.body.message).toBe('Document not found');
    });
  });

  describe('DELETE /collection/:id/document/:documentId', () => {
    let createdDocumentId;

    beforeAll(async () => {
      const newDocument = {
        field1: 'testvalue',
        field2: 42,
      };
      const response = await request(app).post(`/collection/${createdCollectionId}/document`).send(newDocument).expect(201);
      createdDocumentId = response.body._id;
    });

    it('should delete a document with the given ID', async () => {
      await request(app).delete(`/collection/${createdCollectionId}/document/${createdDocumentId}`).expect(204);
      const response = await request(app)
        .get(`/collection/${createdCollectionId}/document/${createdDocumentId}`)
        .expect(404);
      expect(response.body.message).toBe('Document not found');
    });

    it('should return 404 if the document is not found', async () => {
      const response = await request(app).delete(`/collection/${createdCollectionId}/document/nonexistentid`).expect(404);
      expect(response.body.message).toBe('Document not found');
    });
  });

  describe('DELETE /collection/:id', () => {
    it('should delete a collection with the given ID', async () => {
      await request(app).delete(`/collection/${createdCollectionId}`).expect(204);
      const response = await request(app).get(`/collection/${createdCollectionId}`).expect(404);
      expect(response.body.message).toBe('Collection not found');
    });

    it('should return 404 if the collection is not found', async () => {
      const response = await request(app).delete('/collection/nonexistentid').expect(404);
      expect(response.body.message).toBe('Collection not found');
    });
  });
});
