import { useState, useEffect } from "react";
import HomeMake from "./routes/HomeMake";
import MeetingInfo from "./routes/MeetingInfo";
import LinkPage from "./routes/LinkPage";
import HomeParticipate from "./routes/HomeParticipate";
import UserTimeInfo from "./routes/HomeMake";
import ResultMake from "./routes/ResultMake";
import ResultEnd from "./routes/ResultEnd";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeMake />}>
          {" "}
        </Route>
        <Route path="/homeparticipate" element={<HomeParticipate />}></Route>
        <Route path="/meetinginfo" element={<MeetingInfo />}>
          {" "}
        </Route>
        <Route path="/meetinginfo/linkpage" element={<LinkPage />}></Route>
        <Route
          path="/homeparticipate/usertimeinfo"
          element={<UserTimeInfo />}
        ></Route>
        <Route path="/result" element={<ResultMake />}></Route>//결과확인페이지
        <Route path="/resultend" element={<ResultEnd />}></Route>// 투표 종료
        페이지
      </Routes>
    </Router>
  );
}

export default App;
