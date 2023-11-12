import {useState,useEffect} from "react";
import HomeMake from "./routes/HomeMake"
import MeetingInfo from "./routes/MeetingInfo"
import LinkPage from "./routes/LinkPage"
import HomeParticipate from "./routes/HomeParticipate"
import UserTimeInfo from "./routes/HomeMake"
import{
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeMake/>}> </Route>
        <Route path="/homeparticipate" element={<HomeParticipate />}></Route>
        <Route path="/meetinginfo" element={<MeetingInfo />}> </Route>
        <Route path="/meetinginfo/linkpage" element={<LinkPage />}></Route>
        <Route path="/homeparticipate/usertimeinfo" element={<UserTimeInfo />}></Route>
      </Routes>
    </Router>
  );
}


export default App;