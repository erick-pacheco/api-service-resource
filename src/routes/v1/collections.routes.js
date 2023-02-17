// Import required modules
const app = require('../../app');
const Collection = require('../../models/collections.model');
const Document = require('../../models/documents.model');
const logger = require('../../config/logger');

// Define API endpoints
// Define routes for creating a new document in a collection and retrieving all documents in a collection

app.post('/collections/:collectionName/documents', async (req, res) => {
  const { collectionName } = req.params;

  try {
    // Check if the collection exists
    const collection = await Collection.findOne({ name: collectionName });
    if (!collection) {
      return res.status(404).json({ error: `Collection '${collectionName}' not found` });
    }

    // Create a new document based on the request body
    const newDocument = new Document(req.body);

    // Set the collection property to the ID of the collection
    newDocument.collection = collection._id;

    // Save the document to the database
    await newDocument.save();

    // Return the new document
    return res.json(newDocument);
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/collections/:collectionName/documents', async (req, res) => {
  const { collectionName } = req.params;

  try {
    // Check if the collection exists
    const collection = await Collection.findOne({ name: collectionName });
    if (!collection) {
      return res.status(404).json({ error: `Collection '${collectionName}' not found` });
    }

    // Find all documents in the collection
    const documents = await Document.find({ collection: collection._id });

    // Return the documents
    return res.json(documents);
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all collections
app.get('/collections', async (req, res) => {
  try {
    const collections = await Collection.find();
    res.json(collections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a collection by ID
app.get('/collections/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const collection = await Collection.findById(id);
    if (collection) {
      res.json(collection);
    } else {
      res.status(404).json({ message: 'Collection not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a collection by ID
app.patch('/collections/:id', async (req, res) => {
  const { id } = req.params;
  const { name, fields } = req.body;
  try {
    const collection = await Collection.findByIdAndUpdate(id, { name, fields }, { new: true });
    if (collection) {
      res.json(collection);
    } else {
      res.status(404).json({ message: 'Collection not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a collection by ID
app.delete('/collections/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const collection = await Collection.findByIdAndDelete(id);
    if (collection) {
      res.json({ message: 'Collection deleted' });
    } else {
      res.status(404).json({ message: 'Collection not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new document in a collection
app.post('/collections/:collectionId/documents', async (req, res) => {
  const { collectionId } = req.params;
  const { data } = req.body;
  try {
    const collection = await Collection.findById(collectionId);
    if (collection) {
      const document = await Document.create({ collection: collectionId, data });
      res.json(document);
    } else {
      res.status(404).json({ message: 'Collection not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
