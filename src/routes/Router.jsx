import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";

import Landing from "../pages/public/Landing";
import Login from "../pages/auth/Login";

import StudentLayout from "../layouts/StudentLayout";
import TeacherLayout from "../layouts/TeacherLayout";

import StudentDashboard from "../pages/student/Dashboard";
import ChapterMap from "../pages/student/ChapterMap";
import Chapter from "../pages/student/Chapter";
import LearningFlow from "../pages/student/LearningFlow";

import TeacherDashboard from "../pages/teacher/Dashboard";
import StudentManagement from "../pages/teacher/StudentManagement";
import ChapterManagement from "../pages/teacher/ChapterManagement";
import ChapterDetail from "../pages/teacher/ChapterDetail";
import TeacherAnalytics from "../pages/teacher/TeacherAnalytics";
import Review from "../pages/teacher/Review";

import ProtectedRoute from "./ProtectedRoute";


export default function Router() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />


        {/* STUDENT */}
        <Route element={<ProtectedRoute role="student" />}>
          <Route path="/student" element={<StudentLayout />}>

            <Route
              index
              element={<Navigate to="dashboard" replace />}
            />

            <Route
              path="dashboard"
              element={<StudentDashboard />}
            />

            <Route
              path="chapters"
              element={<ChapterMap />}
            />

            <Route
              path="chapter/:id"
              element={<Chapter />}
            />

            <Route
              path="chapter/:id/session"
              element={<LearningFlow />}
            />

          </Route>
        </Route>



        {/* TEACHER */}
        <Route element={<ProtectedRoute role="teacher" />}>
          <Route path="/teacher" element={<TeacherLayout />}>

            <Route
              path="dashboard"
              element={<TeacherDashboard />}
            />

            <Route
              path="students"
              element={<StudentManagement />}
            />

            <Route
              path="analytics"
              element={<TeacherAnalytics />}
            />

            <Route
              path="review"
              element={<Review />}
            />

            <Route
              path="chapters"
              element={<ChapterManagement />}
            />

            {/* Teacher Chapter Detail */}
            <Route
              path="chapters/:id"
              element={<ChapterDetail />}
            />

          </Route>
        </Route>


      </Routes>
    </BrowserRouter>
  );
}