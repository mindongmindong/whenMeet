import HomeMake from "./routes/HomeMake";
import MeetingInfo from "./routes/MeetingInfo";
import LinkPage from "./routes/LinkPage";
import HomeParticipate from "./routes/HomeParticipate";
import UserTimeInfo from "./routes/UserTimeInfo";
import ResultMake from "./routes/ResultMake";
import ResultEnd from "./routes/ResultEnd";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/meetinginfo/linkpage" element={<LinkPage />}></Route>
        <Route
          path="/homeparticipate/:id/usertimeinfo"
          element={<UserTimeInfo />}
        ></Route>
        <Route
          path="/homeparticipate/:id"
          element={<HomeParticipate />}
        ></Route>
        <Route path="/meetinginfo" element={<MeetingInfo />}></Route>
        <Route path="/result/:meeting_id" element={<ResultMake />}></Route>
        //결과확인페이지
        <Route path="/resultend" element={<ResultEnd />}></Route>// 투표 종료
        <Route path="/" element={<HomeMake />}>
          {" "}
        </Route>
        페이지
      </Routes>
    </Router>
  );
}

export default App;
