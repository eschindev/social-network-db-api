const { Schema, model } = require("mongoose");

// Schema to create Thought model
const thoughtSchema = new Schema(
  {
    text: {
      type: String,
      required: true,
    },
    createdOn: {
      type: Date,
      default: () => new Date(),
    },
  },
  {
    toJSON: {
      versionKey: false,
    },
  }
);

const Thought = model("thought", thoughtSchema);

module.exports = Thought;
