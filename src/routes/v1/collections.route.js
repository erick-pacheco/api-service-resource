// Import required modules
const express = require('express');

const router = express.Router();
const Collection = require('../../models/collections.model');
const Document = require('../../models/documents.model');

// Middleware function to get a collection by ID
async function getCollection(req, res, next) {
  let collection;

  try {
    collection = await Collection.findById(req.params.id);
    if (collection == null) {
      return res.status(404).json({ message: 'Cannot find collection' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.collection = collection;
  next();
}
/** API Endpoints Definition */

/** GET /v1/collection
 *  ABOUT: returns all collections in the database
 */
router.get('/', async (_, res) => {
  try {
    const collections = await Collection.find();
    res.json(collections);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/** POST /v1/collection
 *  ABOUT: creates a new collection
 */
router.post('/', async (req, res) => {
  const { name, fields } = req.body;
  const collection = new Collection({
    name,
    fields,
  });

  try {
    const newCollection = await collection.save();
    res.status(201).json(newCollection);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/** GET /v1/collection/:id
 *  ABOUT: Get a specific collection
 */
router.get('/:id', getCollection, (_, res) => {
  res.json(res.collection);
});

/** PATCH /v1/collection/:id
 *  ABOUT: Update a collection
 */
router.patch('/:id', getCollection, async (req, res) => {
  const { name } = req.body;
  if (name != null) {
    res.collection.name = name;
  }

  try {
    const updatedCollection = await res.collection.save();
    res.json(updatedCollection);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/** DELETE /v1/collection/:id
 *  ABOUT: Delete a collection
 */
router.delete('/:id', getCollection, async (req, res) => {
  try {
    await res.collection.remove();
    res.json({ message: 'Deleted Collection' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all documents in a collection
router.get('/:id/documents', getCollection, async (req, res) => {
  try {
    const documents = await Document.find({ collection: req.params.id });
    res.json(documents);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new document in a collection
router.post('/:id/documents', getCollection, async (req, res) => {
  const document = new Document({
    title: req.body.title,
    content: req.body.content,
    collection: res.collection._id,
  });

  try {
    const newDocument = await document.save();
    res.status(201).json(newDocument);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
