const { Schema, model } = require('mongoose');

// variable for date formatting for createdAt
const dateFormat = require('../utils/dateFormat');

const projectSchema = new Schema({
    title: {
      type: String,
      required: true,
      maxlength:30,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 300,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      get: (timestamp) => dateFormat(timestamp),
    },
    gitRepo: {
      type: String,
      required: true,
      trim: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    fundingGoal: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    currentFunds: {
      type: String,
      unique: true,
      trim: true
    }
  }, 
  {
    toJSON: {
      getters: true,
      virtual: true,
    },
    id: false
  }
);

const Project = model('Project', projectSchema);

module.exports = Project;
