"use strict";

const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const IssueModel = require("../models/issue-model");
const ProjectModel = require("../models/project-model");

module.exports = function (app) {
  app
    .route("/api/issues/:project")

    //get issues
    .get(function (req, res) {
      let project = req.params.project;
    })

    //Submit issue
    .post(async (req, res) => {
      try {
        const {
          issue_text,
          issue_title,
          created_by,
          assigned_to,
          status_text,
        } = req.body;
        const project = req.params.project;

        if (!issue_text || !issue_title || !created_by) {
          return res.status(200).json({ error: "required field(s) missing" });
        }

        const newIssue = new IssueModel({
          issue_title,
          issue_text,
          created_on: new Date(),
          updated_on: new Date(),
          created_by,
          assigned_to: assigned_to || "",
          open: true,
          status_text: status_text || "",
        });

        let projectData = await ProjectModel.findOne({ name: project });

        if (!projectData) {
          projectData = new ProjectModel({ name: project });
        }

        projectData.issues.push(newIssue);
        await projectData.save();

        return res.json(newIssue);
      } catch (err) {
        return res
          .status(500)
          .send("Error while saving in Post: " + err.message);
      }
    })

    //update issue by id
    .put(function (req, res) {
      let project = req.params.project;
    })

    //delete issue by id
    .delete(function (req, res) {
      let project = req.params.project;
    });
};
