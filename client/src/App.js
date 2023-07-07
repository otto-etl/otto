import * as React from "react";
import WorkflowLayout from "./components/WorkflowLayout";
import Workflows from "./components/Workflows";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/workflow/:id" element={<WorkflowLayout />} />
        <Route path="/" element={<Workflows />} />
      </Routes>
    </Router>
  );
};

export default App;
