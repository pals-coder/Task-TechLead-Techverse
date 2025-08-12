const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
const Task = require("../models/Task");

// Mock logActivity to avoid side effects
jest.mock("../logActivity", () => ({
  logActivity: jest.fn(() => Promise.resolve()),
}));

describe("Task API", () => {
  let testTaskId;
  let testUserId = "test-user-123";

  // Before all tests connect to DB (use test DB)
  beforeAll(async () => {
    const mongoUrl = "mongodb://localhost:27017/taskapp_test"; // Change to your test DB
    await mongoose.connect(mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    // Clean tasks collection before tests
    await Task.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test("POST /api/tasks/ - create a new task", async () => {
    const taskData = {
      title: "Test Task",
      description: "Test description",
      Status: "Pending",
      userid: testUserId,
    };

    const res = await request(app).post("/api/tasks/").send(taskData);

    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe(taskData.title);
    expect(res.body.userid).toBe(testUserId);
    testTaskId = res.body._id;
  });

  test("GET /api/tasks/:userid/ - get tasks by user ID", async () => {
    const res = await request(app).get(`/api/tasks/${testUserId}/`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
    expect(res.body[0]).toHaveProperty("title");
  });

  test("GET /api/tasks/detail/:id - get task by ID", async () => {
    const res = await request(app).get(`/api/tasks/detail/${testTaskId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe(testTaskId);
  });

  test("GET /api/tasks/detail/:id - 404 if task not found", async () => {
    const res = await request(app).get(`/api/tasks/detail/612345678901234567890123`);
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Task not found");
  });

  test("PUT /api/tasks/update/:id - update a task", async () => {
    const updateData = {
      title: "Updated Task Title",
      description: "Updated description",
      Status: "Completed",
      userid: testUserId,
    };

    const res = await request(app)
      .put(`/api/tasks/update/${testTaskId}`)
      .send(updateData);

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe(updateData.title);
  });

  test("PUT /api/tasks/update/:id - 404 if task not found", async () => {
    const res = await request(app)
      .put("/api/tasks/update/612345678901234567890123")
      .send({
        title: "Non-existent",
        userid: testUserId,
      });

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Task not found");
  });

  test("DELETE /api/tasks/:id - delete a task", async () => {
    const res = await request(app).delete(`/api/tasks/${testTaskId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Task deleted successfully");
  });

  test("DELETE /api/tasks/:id - 404 if task not found", async () => {
    const res = await request(app).delete(`/api/tasks/${testTaskId}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Task not found");
  });

  test("GET /api/tasks/activity - returns activity message", async () => {
    const res = await request(app).get("/api/tasks/activity");
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("hello");
  });
});
