import * as React from "react";
import Workflow from "./components/Workflow";
import Workflows from "./components/Workflows";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
const App = () => {
  return (
    <div className="demo">
      <h3>React Flow demo</h3>

      <Router>
        <Routes>
          <Route path="/workflow/:id" element={<Workflow />} />
          <Route path="/" element={<Workflows />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
