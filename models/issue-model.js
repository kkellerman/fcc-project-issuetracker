const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const issueSchema = new Schema({
  project: {
    type: String,
  },
  // form data containing the required fields `issue_title`, `issue_text`, `created_by`
  issue_title: {
    type: String,
    required: true,
  },
  issue_text: {
    type: String,
    required: true,
  },
  created_by: {
    type: String,
    required: true,
  },
  // optionally `assigned_to` and `status_text`
  assigned_to: {
    type: String,
    default: "",
  },
  status_text: {
    type: String,
    default: "",
  },
  //include `created_on` (date/time), `updated_on` (date/time), `open` (boolean, true for open - default value, false for closed)
  created_on: {
    type: Date,
    default: Date.now,
  },
  updated_on: {
    type: Date,
    default: Date.now,
  },
  open: {
    type: Boolean,
    default: true,
  },
});

const Issue = mongoose.model("Issue", issueSchema);

module.exports = Issue;
