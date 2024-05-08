"use strict";

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
    .put(function (req, res) {
      const { _id, issue_title, issue_text, created_by, assigned_to, open, status_text } = req.body;
      
    })

    //delete issue by id
    .delete(function (req, res) {
      let project = req.params.project;
    });
};
