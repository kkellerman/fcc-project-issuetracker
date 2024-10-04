const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

issueId = "66ff57bb22f3ed7c65045ca9"; // dummy_id

suite("Functional Tests", function () {
  suite("Test (GET) requests", function () {
    //Create an issue with every field
    test("Create an issue with every field", function (done) {
      chai
        .request(server)
        .post("/api/issues/apitest")
        .send({
          issue_text: "Sample issue text",
          issue_title: "Sample issue title",
          created_by: "John Doe",
          created_on: new Date(),
          updated_on: new Date(),
          assigned_to: "Jane Smith",
          open: true,
          status_text: "In progress",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.property(res.body, "_id");
          assert.equal(res.body.issue_text, "Sample issue text");
          assert.equal(res.body.issue_title, "Sample issue title");
          assert.equal(res.body.created_by, "John Doe");
          assert.isString(res.body.created_on);
          assert.isString(res.body.updated_on);
          assert.equal(res.body.assigned_to, "Jane Smith");
          assert.isTrue(res.body.open);
          assert.equal(res.body.status_text, "In progress");
          done();
        });
    });

    // Create an issue with only required fields
    test("Create an issue with only required fields", function (done) {
      chai
        .request(server)
        .post("/api/issues/apitest")
        .send({
          issue_text: "Sample issue text",
          issue_title: "Sample issue title",
          created_by: "John Doe",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.property(res.body, "_id");
          assert.equal(res.body.issue_text, "Sample issue text");
          assert.equal(res.body.issue_title, "Sample issue title");
          assert.equal(res.body.created_by, "John Doe");
          assert.isString(res.body.created_on);
          assert.isString(res.body.updated_on);
          assert.equal(res.body.assigned_to, "");
          assert.isTrue(res.body.open); // `open` (boolean, true for open - default value
          assert.equal(res.body.status_text, "");
          done();
        });
    });

    // Create an issue with missing required fields
    test("Create an issue with missing required fields", function (done) {
      chai
        .request(server)
        .post("/api/issues/apitest")
        .send({})
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "required field(s) missing");
          done();
        });
    });

    //View issues on a project
    test("View issues on a project", function (done) {
      chai
        .request(server)
        .get("/api/issues/apitest")
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          done();
        });
    });

    //View issues on a project with one filter
    test("View issues on a project with one filter", function (done) {
      chai
        .request(server)
        .get("/api/issues/apitest?open=true")
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          done();
        });
    });

    //View issues on a project with multiple filters
    test("View issues on a project with multiple filters", function (done) {
      chai
        .request(server)
        .get("/api/issues/apitest?open=true&issue_title=Sample issue title")
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          done();
        });
    });
  });

  suite("Test (PUT) requests", function () {
    // Update one field on an issue
    test("Update one field on an issue", function (done) {
      chai
        .request(server)
        .put("/api/issues/apitest")
        .send({
          _id: issueId,
          issue_title: "test",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.result, "successfully updated");
          assert.equal(res.body._id, issueId);
          done();
        });
    });

    //Update multiple fields on an issue
    test("Update multiple fields on an issue", function (done) {
      const updateFields = {
        _id: "",
        issue_title: "updated",
        issue_text: "updated",
        created_by: "updated",
        assigned_to: "updated",
        status_text: "updated",
      };
      chai
        .request(server)
        .put("/api/issues/apitest")
        .send(updateFields)
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "missing _id");
          done();
        });
    });

    // Update an issue with missing _id
    test("Update an issue with missing _id", function (done) {
      const updatedFields = {
        issue_title: "updated",
        issue_text: "updated",
        created_by: "updated",
        assigned_to: "updated",
        status_text: "updated",
      };
      chai
        .request(server)
        .put("/api/issues/apitest")
        .send(updatedFields)
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "missing _id");
          done();
        });
    });

    // Update an issue with no fields to update
    test("Update an issue with no fields to update", function (done) {
      chai
        .request(server)
        .put("/api/issues/apitest")
        .send({
          _id: issueId,
        })
        .end((err, res) => {
          assert.equal(res.body.error, "no update field(s) sent");
          assert.equal(res.body._id, issueId);
          done();
        });
    });

    // Update an issue with an invalid _id
    test("Update an issue with an invalid _id", function (done) {
      chai
        .request(server)
        .put("/api/issues/test")
        .send({
          _id: "INVALID_ID",
          open: false,
        })
        .end((err, res) => {
          assert.equal(res.body.error, "no update field(s) sent");
          assert.equal(res.body._id, "INVALID_ID");
          done();
        });
    });
  });

  suite("Test (DELETE) requests", function () {
    // Delete an issue
    test("Delete an issue", function (done) {
      chai
        .request(server)
        .delete("/api/issues/apitest")
        .send({
          _id: issueId,
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.result, "successfully deleted");
          assert.equal(res.body._id, issueId);
          done();
        });
    });

    // Delete an issue with an invalid _id
    test("Delete an issue with an invalid _id", function (done) {
      chai
        .request(server)
        .delete("/api/issues/apitest")
        .send({
          _id: "INVALID_ID",
        })
        .end(function (err, res) {
          assert.equal(res.status, 500);
          assert.equal(res.body.error, "Internal server error");
          assert.isUndefined(res.body._id);
          done();
        });
    });

    // delete an issue with missing _id
    test("Delete an issue with missing _id", function (done) {
      chai
        .request(server)
        .delete("/api/issues/apitest")
        .send({})
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "missing _id");
          assert.isUndefined(res.body._id);
          done();
        });
    });
  });
});
