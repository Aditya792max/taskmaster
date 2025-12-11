import React from "react";
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import Header from "./Components/Header.jsx";
import DevTasks from "./Pages/DevTasks.jsx";
import StudyTasks from "./Pages/StudyTasks.jsx";
import Home from "./Pages/Home.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Header />}>
          <Route index element={<Home />} />
          <Route path="/dev-tasks" element={<DevTasks />} />
          <Route path="/study-tasks" element={<StudyTasks />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;