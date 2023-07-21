import * as React from "react";
import WorkflowLayout from "./components/WorkflowLayout";
import Workflows from "./components/Workflows";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ReactFlowProvider } from "reactflow";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/workflow/:id"
          element={
            <ReactFlowProvider>
              <WorkflowLayout />
            </ReactFlowProvider>
          }
        />
        <Route path="/" element={<Workflows />} />
      </Routes>
    </Router>
  );
};

export default App;
