const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const userSchema = mongoose.Schema({
  _id: { type: String },
  userName: { type: String },
  userPassword: {type: String},
  userEmail: {type: String},
});

userSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('user', userSchema);
