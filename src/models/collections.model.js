// models/collection.js
const mongoose = require('mongoose');

const collectionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  fields: [
    {
      name: { type: String, required: true },
      type: { type: String, required: true },
      required: { type: Boolean, default: false },
      defaultValue: { type: mongoose.Schema.Types.Mixed },
    },
  ],
});

const Collection = mongoose.model('Collection', collectionSchema);

module.exports = Collection;
