import React from "react";
import { render, waitFor, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useNavigate } from "react-router-dom";
import NewWFModal from "./NewWFModal";

test("expexts true to be true", () => {
  expect(true).toBe(true);
});
