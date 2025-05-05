import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import RegisterOwner from "./pages/RegisterOwner";
import JoinInfluencer from "./pages/JoinInfluencer";
import OwnerList from "./pages/OwnerList";
import EditOwner from "./pages/EditOwner";
import DashboardOwner from "./pages/DashboardOwner"; // ✅ 올바른 이름
import RegisterInfluencer from "./pages/RegisterInfluencer";
import InfluencerDashboard from "./pages/InfluencerDashboard";
import EditInfluencer from "./pages/EditInfluencer";
import InfluencerSearch from "./pages/InfluencerSearch";
import BusinessSearch from "./pages/BusinessSearch";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/business" element={<RegisterOwner />} />
        <Route path="/influencer" element={<RegisterInfluencer />} />
        <Route path="/owner-list" element={<OwnerList />} />
        <Route path="/dashboard/:id" element={<DashboardOwner />} /> {/* ✅ 수정됨 */}
        <Route path="/edit-owner/:id" element={<EditOwner />} />
        <Route path="/dashboard-influencer/:id" element={<InfluencerDashboard />} />
        <Route path="/edit-influencer/:id" element={<EditInfluencer />} />
        <Route path="/influencer-search" element={<InfluencerSearch />} />
        <Route path="/business-search" element={<BusinessSearch />} />



      </Routes>
    </Router>
  );
}

export default App;
