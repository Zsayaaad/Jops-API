const mongoose = require('mongoose');

const JobsSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, 'Must provide company name'],
      maxlength: 50,
    },
    position: {
      type: String,
      required: [true, 'Must provide position'],
      maxlength: 100,
    },
    status: {
      type: String,
      enum: ['interview', 'pending', 'declined'],
      default: 'pending',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      /** The `ref` property is used to establish a reference to the User model,
       * indicating that the createdBy field will contain the ID of a user document from the User collection. */
      required: [true, 'Must provide user'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Job', JobsSchema);
