const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const projectSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  issues: [
    {
      type: Schema.Types.ObjectId,
      ref: "Issue",
    },
  ],
});

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
