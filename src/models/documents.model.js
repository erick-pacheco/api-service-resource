// models/document.js
const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  foreignKey: { type: mongoose.Schema.Types.ObjectId, ref: 'Collection' },
  data: {
    type: mongoose.Schema.Types.Mixed,
    validate(value) {
      const collectionFields = this.collection.fields;
      if (!Array.isArray(collectionFields)) {
        return true;
      }

      // eslint-disable-next-line no-restricted-syntax
      for (const field of collectionFields) {
        const fieldName = field.name;
        if (field.required && value[fieldName] === undefined) {
          return false;
        }
      }

      return true;
    },
  },
});

const Document = mongoose.model('Document', documentSchema);

module.exports = Document;
