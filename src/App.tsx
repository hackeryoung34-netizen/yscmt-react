import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";

// import AdminDashboard from "./admin/pages/Dashboard";
// Auth
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";

// Dashboard
import Home from "./pages/Dashboard/Home";

// LMS Pages
import Courses from "./pages/LMS/Courses";
import Lessons from "./pages/LMS/Lessons";
import Students from "./pages/LMS/Students";
import QuizAttempts from "./pages/LMS/QuizAttempts";
import Certificates from "./pages/LMS/Certificates";
import Payments from "./pages/LMS/Payments";
import Notifications from "./pages/LMS/Notifications";
import Settings from "./pages/LMS/Settings";

// Profile
import UserProfiles from "./pages/UserProfiles";

// Admin
import AdminDashboard from "./admin/pages/Dashboard";

// Other
import NotFound from "./pages/OtherPage/NotFound";

export default function App() {
  return (
    <Router>
      <ScrollToTop />

      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />

          <Route path="/courses" element={<Courses />} />
          <Route path="/lessons" element={<Lessons />} />
          <Route path="/students" element={<Students />} />
          <Route path="/quiz-attempts" element={<QuizAttempts />} />
          <Route path="/certificates" element={<Certificates />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<UserProfiles />} />

        {/*
<Route path="/admin" element={<AdminDashboard />} />
*/}

          {/* Admin */}
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>

        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
