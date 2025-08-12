import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import TaskList from "./TaskList";

// Mock the service functions
import * as taskService from "../../services/taskService";

jest.mock("../../services/taskService");


taskService.getTasks = jest.fn();
taskService.updateTask = jest.fn();
taskService.deleteTask = jest.fn();

const mockTasks = [
  { _id: "1", name: "Task One" },
  { _id: "2", name: "Task Two" },
];

describe("TaskList component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders tasks fetched from API", async () => {
    taskService.getTasks.mockResolvedValueOnce(mockTasks);

    render(<TaskList userId="user123" refreshTrigger={0} />);

    for (const task of mockTasks) {
      expect(await screen.findByText(task.name)).toBeInTheDocument();
    }
  });

  test("displays error message if fetching tasks fails", async () => {
    taskService.getTasks.mockRejectedValueOnce(new Error("Fetch failed"));

    render(<TaskList userId="user123" refreshTrigger={0} />);

    expect(await screen.findByText(/Failed to load tasks/i)).toBeInTheDocument();
  });

  test("displays 'No tasks found' when tasks list is empty", async () => {
    taskService.getTasks.mockResolvedValueOnce([]);

    render(<TaskList userId="user123" refreshTrigger={0} />);

    expect(await screen.findByText(/No tasks found/i)).toBeInTheDocument();
  });

  test("can start editing a task, change name and save", async () => {
    taskService.getTasks.mockResolvedValueOnce(mockTasks);
    taskService.updateTask.mockResolvedValueOnce({}); // mock success

    render(<TaskList userId="user123" refreshTrigger={0} />);

    await screen.findByText("Task One");

    fireEvent.click(screen.getAllByText("Edit")[0]);

    const input = screen.getByDisplayValue("Task One");
    expect(input).toBeInTheDocument();

    fireEvent.change(input, { target: { value: "Updated Task One" } });

    fireEvent.click(screen.getByText("Save"));

    await waitFor(() => {
      expect(taskService.updateTask).toHaveBeenCalledWith("1", {
        name: "Updated Task One",
      });
      expect(screen.queryByDisplayValue("Updated Task One")).not.toBeInTheDocument();
      expect(screen.getByText("Updated Task One")).toBeInTheDocument();
    });
  });

  test("can cancel editing a task", async () => {
    taskService.getTasks.mockResolvedValueOnce(mockTasks);

    render(<TaskList userId="user123" refreshTrigger={0} />);

    await screen.findByText("Task One");

    fireEvent.click(screen.getAllByText("Edit")[0]);

    expect(screen.getByDisplayValue("Task One")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Cancel"));

    expect(screen.queryByDisplayValue("Task One")).not.toBeInTheDocument();
    expect(screen.getByText("Task One")).toBeInTheDocument();
  });

  test("deletes a task when delete button clicked", async () => {
    taskService.getTasks.mockResolvedValueOnce(mockTasks);
    taskService.deleteTask.mockResolvedValueOnce({}); // mock success

    render(<TaskList userId="user123" refreshTrigger={0} />);

    await screen.findByText("Task One");

    fireEvent.click(screen.getAllByText("Delete")[0]);

    await waitFor(() => {
      expect(taskService.deleteTask).toHaveBeenCalledWith("1");
      expect(screen.queryByText("Task One")).not.toBeInTheDocument();
    });
  });
});
