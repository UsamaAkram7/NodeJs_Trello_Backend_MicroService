const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const cardSchema = mongoose.Schema({
  _id: { type: String },
  cardId: { type: String },
  cardContent: {type: String},
  priority: {type: Number},
  status: {type: String},
});

cardSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('card', cardSchema);
