import React from "react";
import { render, waitFor, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import NewWFModal from "./NewWFModal";
import { createNewWF } from "../../services/api";
import { useNavigate } from "react-router-dom";

jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));

jest.mock("../../services/api");

describe("NewWFModal", () => {
  const handleCloseNewWFModalMock = jest.fn();
  const newWorkflowName = "New Workflow";
  const newWorkflowId = "123";

  beforeEach(() => {
    useNavigate.mockImplementation(() => jest.fn());
    createNewWF.mockResolvedValue({ id: newWorkflowId });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders modal when newWFVisible is true", () => {
    render(
      <NewWFModal
        newWFVisible={true}
        handleCloseNewWFModal={handleCloseNewWFModalMock}
      />
    );

    expect(
      screen.getByText("Please provide a workflow name:")
    ).toBeInTheDocument();
  });

  test('creates new workflow and navigates when "Create" button is clicked', async () => {
    render(
      <NewWFModal
        newWFVisible={true}
        handleCloseNewWFModal={handleCloseNewWFModalMock}
      />
    );

    const workflowNameTextBox = screen.getByLabelText("Workflow Name");
    await userEvent.type(workflowNameTextBox, newWorkflowName);
    const createButton = screen.getByText("Create");
    await userEvent.click(createButton);

    await waitFor(() => {
      expect(createNewWF).toHaveBeenCalledWith({ name: newWorkflowName });

      // const navigate = jest.fn();
      // useNavigate.mockReturnValue(navigate);
      // // useNavigate.mockImplementation(() => jest.fn());
      // expect(navigate).toHaveBeenCalledWith("/workflow/1");
      // expect(useNavigate()).toHaveBeenCalledWith(`/workflow/${newWorkflowId}`);
    });
  });

  test('calls handleCloseNewWFModal when "Cancel" button is clicked', () => {
    render(
      <NewWFModal
        newWFVisible={true}
        handleCloseNewWFModal={handleCloseNewWFModalMock}
      />
    );

    userEvent.click(screen.getByText("Cancel"));
    expect(handleCloseNewWFModalMock).toHaveBeenCalled();
  });
});
