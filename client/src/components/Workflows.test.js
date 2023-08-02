/* eslint-disable */
import React from "react";
import { render, waitFor, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useNavigate } from "react-router-dom";
import { getAllWorkflows, deleteWorkflow } from "../services/api";
import Workflows from "./Workflows";

jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));

jest.mock("../services/api.js", () => ({
  getAllWorkflows: jest.fn(),
  deleteWorkflow: jest.fn(),
}));

beforeEach(() => {
  getAllWorkflows.mockResolvedValue([
    { id: "1", name: "Workflow 1", active: true },
    { id: "2", name: "Workflow 2", active: false },
  ]);
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("Workflows", () => {
  test("renders the workflows component", () => {
    render(<Workflows />);
  });

  test('displays the title "Workflows"', () => {
    render(<Workflows />);
    expect(screen.getByText("Workflows")).toBeInTheDocument();
  });

  test("Data grid displays empty state when there are no workflows", () => {
    render(<Workflows />);
    expect(screen.getByText("No rows")).toBeInTheDocument();
  });

  test("calls getAllWorkflows on initial render", async () => {
    render(<Workflows />);
    await waitFor(() => expect(getAllWorkflows).toHaveBeenCalledTimes(1));
  });

  test("renders the workflows from the API", async () => {
    render(<Workflows />);
    await waitFor(() => {
      expect(screen.getByText("Workflow 1")).toBeInTheDocument();
      expect(screen.getByText("Workflow 2")).toBeInTheDocument();
    });
  });

  test("deletes a workflow when the delete icon is clicked", async () => {
    deleteWorkflow.mockResolvedValue({});
    render(<Workflows />);
    await waitFor(() => screen.getByText("Workflow 1"));
    const deleteIcon = screen.getByLabelText("Delete workflow 1");
    await userEvent.click(deleteIcon);
    expect(deleteWorkflow).toHaveBeenCalledWith("1");
    await waitFor(() =>
      expect(screen.queryByText("Workflow 1")).not.toBeInTheDocument()
    );
  });

  test("navigates to the workflow details page when a row is clicked", async () => {
    const navigate = jest.fn();
    useNavigate.mockReturnValue(navigate);
    render(<Workflows />);
    await waitFor(() => screen.getByText("Workflow 1"));
    const workflow = screen.getByText("Workflow 1");
    await userEvent.click(workflow);
    expect(navigate).toHaveBeenCalledWith("/workflow/1");
  });
});

describe("Create Workflow Modal", () => {
  test("opens the create workflow modal when the new workflow button is clicked", async () => {
    render(<Workflows />);

    await waitFor(() => screen.getByText("Workflow 1"));
    const newWFButton = screen.getByText(/Create workflow/i);
    await userEvent.click(newWFButton);
    await waitFor(() => {
      expect(
        screen.getByText("Please provide a workflow name:")
      ).toBeInTheDocument();
    });
  });

  test("closes the create workflow modal when the cancel button is clicked", async () => {
    render(<Workflows />);

    await waitFor(() => screen.getByText("Workflow 1"));
    const newWFButton = screen.getByText(/Create workflow/i);
    await userEvent.click(newWFButton);
    await waitFor(() => {
      const modalText = screen.getByText("Please provide a workflow name:");
      expect(modalText).toBeInTheDocument();
    });

    const cancelButton = screen.getByText("Cancel");
    await userEvent.click(cancelButton);
    await waitFor(() => {
      expect(
        screen.queryByText("Please provide a workflow name:")
      ).not.toBeInTheDocument();
    });
  });
});

// screen.debug(undefined, 300000);
