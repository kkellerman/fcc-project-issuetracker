"use strict";

const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const IssueModel = require("../models/issue-model");

module.exports = function (app) {
  app
    .route("/api/issues/:project")

    //get issues
    .get(async function (req, res) {
      try {
        let project = req.params.project;
        const query = { project };

        const queryParams = [
          "_id",
          "issue_text",
          "issue_title",
          "created_by",
          "created_on",
          "updated_on",
          "assigned_to",
          "open",
          "status_text",
        ];

        queryParams.forEach((param) => {
          if (req.query[param]) {
            if (param === "open") {
              query[param] = req.query[param] === "true";
            } else {
              query[param] = req.query[param];
            }
          }
        });

        const issues = await IssueModel.find(query);

        res.json(issues);
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
      }
    })

    //Submit issue
    .post(async (req, res) => {
      let project = req.params.project;

      let newIssue = new IssueModel({
        project: project,
        issue_text: req.body.issue_text,
        issue_title: req.body.issue_title,
        created_by: req.body.created_by,
        created_on: new Date(),
        updated_on: new Date(),
        assigned_to: req.body.assigned_to || "",
        open: true,
        status_text: req.body.status_text || "",
      });

      if (
        !req.body.issue_title ||
        !req.body.issue_text ||
        !req.body.created_by
      ) {
        return res.status(200).json({ error: "required field(s) missing" });
      }

      newIssue
        .save()
        .then((savedIssue) => {
          res.json({
            _id: savedIssue._id,
            issue_title: savedIssue.issue_title,
            issue_text: savedIssue.issue_text,
            created_by: savedIssue.created_by,
            created_on: savedIssue.created_on,
            updated_on: savedIssue.updated_on,
            assigned_to: savedIssue.assigned_to,
            open: savedIssue.open,
            status_text: savedIssue.status_text,
          });
        })
        .catch((err) => {
          res.status(500).send("Error while saving in Post: " + err.message);
        });
    })

    //update issue by id
    .put(async function (req, res) {
      const {
        _id,
        issue_title,
        issue_text,
        created_by,
        assigned_to,
        open,
        status_text,
      } = req.body;

      // Update an issue with missing _id
      if (!_id) {
        return res.json({ error: "missing _id" });
      }

      const updatingIssue = {};

      // Update one/multiple field on an issue
      if (issue_title) {
        updatingIssue.issue_title = issue_title;
      } else if (issue_text) {
        updatingIssue.issue_text = issue_text;
      } else if (created_by) {
        updatingIssue.created_by = created_by;
      } else if (assigned_to) {
        updatingIssue.assigned_to = assigned_to;
      } else if (open) {
        updatingIssue.open = open;
      } else if (status_text) {
        updatingIssue.status_text = status_text;
      }

      // Update an issue with no fields to update
      if (Object.keys(updatingIssue).length === 0) {
        return res.json({ error: "no update field(s) sent", _id: _id });
      }

      // Update an issue with an invalid _id
      if (!ObjectId.isValid(_id)) {
        return res.json({ error: "invalid _id" });
      }

      // update the updated_on date
      updatingIssue.updated_on = new Date().toISOString();

      // update an issue
      const result = await IssueModel.findByIdAndUpdate(_id, updatingIssue, {
        new: true,
      });

      if (!result) {
        return res.json({ error: "could not update", _id: _id });
      } else {
        return res.json({ result: "successfully updated", _id: _id });
      }
    })

    //delete issue by id
    .delete(async function (req, res) {
      try {
        const { _id } = req.body;

        //Delete an issue with missing _id
        if (!_id) {
          return res.json({ error: "missing _id" });
        }

        const result = await IssueModel.findByIdAndDelete(_id);

        //Delete an issue with an invalid _id
        if (!result) {
          return res.json({ error: "could not delete", _id: _id });
        }

        // Delete an issue
        return res.json({ result: "successfully deleted", _id: _id });
      } catch (error) {
        res.status(500).json({ error: "Internal server error" });
      }
    });
};
