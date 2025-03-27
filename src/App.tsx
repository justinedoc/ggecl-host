import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router";
import { Toaster } from "@/components/ui/sonner";
import NotFound from "./components/ui/NotFound.tsx";
import AuthPageLoading from "./components/auth/_components/AuthPageLoading.tsx";

// === Landing Page Components (Eagerly Loaded) ===
import Layout from "./components/landing/Layout";
import Home from "./components/landing/pages/Home";
import Cart from "./components/landing/pages/Cart";
import Login from "./components/auth/pages/Login";
import Signup from "./components/auth/pages/Signup";
import Instructor from "./components/landing/pages/Instructor";
import Courses from "./components/landing/pages/Courses";
import CoursesPage from "./components/landing/pages/CoursePage";

// === Lazy Loaded Auth Components (Less Frequently Visited) ===
const InstructorLogin = lazy(
  () => import("./components/auth/pages/InstructorLogin.tsx")
);
const Adminlogin = lazy(
  () => import("./components/Dashboard/admin/pages/Adminlogin.tsx")
);
const StudentLogin = lazy(
  () => import("./components/Dashboard/students/pages/StudentLogin.tsx")
);

// === Lazy Loaded Dashboard Components ===
const StudentLayout = lazy(
  () => import("./components/Dashboard/students/_components/StudentLayout.tsx")
);
const InstructorLayout = lazy(
  () =>
    import("./components/Dashboard/Instructor/components/InstructorLayout.tsx")
);
const AdminLayout = lazy(
  () => import("./components/Dashboard/admin/components/AdminLayout.tsx")
);

// --- Student Dashboard Pages ---
const StudentHome = lazy(
  () => import("@/components/Dashboard/students/pages/StudentHome.tsx")
);
const Assignment = lazy(
  () => import("./components/Dashboard/students/pages/Assignment.tsx")
);
const Settings = lazy(
  () => import("./components/Dashboard/students/pages/Settings.tsx")
);
const StudentCourses = lazy(
  () => import("@/components/Dashboard/students/pages/StudentCourses.tsx")
);
const StudentCalendar = lazy(
  () => import("@/components/Dashboard/students/pages/StudentCalendar.tsx")
);
const StudentChat = lazy(
  () => import("@/components/Dashboard/students/pages/StudentChat.tsx")
);

// --- Instructor Dashboard Pages ---
const InstructorHome = lazy(
  () => import("@/components/Dashboard/Instructor/pages/InstructorHome.tsx")
);
const InstructorSettings = lazy(
  () => import("@/components/Dashboard/Instructor/pages/InstructorSettings.tsx")
);
const CoursesDetails = lazy(
  () => import("@/components/Dashboard/Instructor/pages/CoursesDetails.tsx")
);
const Earnings = lazy(
  () => import("@/components/Dashboard/Instructor/pages/Earnings.tsx")
);
const InstructorCourses = lazy(
  () => import("@/components/Dashboard/Instructor/pages/InstructorCourses.tsx")
);
const SingleCourse = lazy(
  () => import("@/components/Dashboard/Instructor/pages/SingleCourse.tsx")
);
const Chat = lazy(
  () => import("@/components/Dashboard/Instructor/pages/Chat.tsx")
);

// --- Admin Dashboard Pages ---
const AdminHome = lazy(
  () => import("@/components/Dashboard/admin/pages/AdminHome.tsx")
);
const AdminSettings = lazy(
  () => import("@/components/Dashboard/admin/pages/AdminSettings.tsx")
);
const Payments = lazy(
  () => import("@/components/Dashboard/admin/pages/Payments.tsx")
);
const CourseManagement = lazy(
  () => import("@/components/Dashboard/admin/pages/CourseManagement.tsx")
);
const Analytics = lazy(
  () => import("@/components/Dashboard/admin/pages/Analytics.tsx")
);

function App() {
  return (
    <>
      <Toaster />
      <Routes>
        {/* === Landing Page Routes (Eagerly Loaded) === */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="cart" element={<Cart />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="instructor" element={<Instructor />} />
          <Route path="courses/:id" element={<CoursesPage />} />
          <Route path="courses" element={<Courses />} />
          <Route path="categories" element={<Courses />} />

          {/* --- Auth Routes (Lazy Loaded) --- */}
          <Route
            path="instructor/login"
            element={
              <Suspense fallback={<AuthPageLoading />}>
                <InstructorLogin />
              </Suspense>
            }
          />
          <Route
            path="admin/login"
            element={
              <Suspense fallback={<AuthPageLoading />}>
                <Adminlogin />
              </Suspense>
            }
          />
          <Route
            path="student/login"
            element={
              <Suspense fallback={<AuthPageLoading />}>
                <StudentLogin />
              </Suspense>
            }
          />
        </Route>

        {/* === Student Dashboard Routes (Lazy Loaded) === */}
        <Route
          path="/student/dashboard"
          element={
            <Suspense fallback={<AuthPageLoading />}>
              <StudentLayout />
            </Suspense>
          }
        >
          <Route
            index
            element={
              <Suspense fallback={<AuthPageLoading />}>
                <StudentHome />
              </Suspense>
            }
          />
          <Route
            path="assignment"
            element={
              <Suspense fallback={<AuthPageLoading />}>
                <Assignment />
              </Suspense>
            }
          />
          <Route
            path="settings"
            element={
              <Suspense fallback={<AuthPageLoading />}>
                <Settings />
              </Suspense>
            }
          />
          <Route
            path="courses"
            element={
              <Suspense fallback={<AuthPageLoading />}>
                <StudentCourses />
              </Suspense>
            }
          />
          <Route
            path="calendar"
            element={
              <Suspense fallback={<AuthPageLoading />}>
                <StudentCalendar />
              </Suspense>
            }
          />
          <Route
            path="chat"
            element={
              <Suspense fallback={<AuthPageLoading />}>
                <StudentChat />
              </Suspense>
            }
          />
        </Route>

        {/* === Instructor Dashboard Routes (Lazy Loaded) === */}
        <Route
          path="/instructor/dashboard"
          element={
            <Suspense fallback={<AuthPageLoading />}>
              <InstructorLayout />
            </Suspense>
          }
        >
          <Route
            index
            element={
              <Suspense fallback={<AuthPageLoading />}>
                <InstructorHome />
              </Suspense>
            }
          />
          <Route
            path="mycourses"
            element={
              <Suspense fallback={<AuthPageLoading />}>
                <CoursesDetails />
              </Suspense>
            }
          />
          <Route
            path="settings"
            element={
              <Suspense fallback={<AuthPageLoading />}>
                <InstructorSettings />
              </Suspense>
            }
          />
          <Route
            path="earnings"
            element={
              <Suspense fallback={<AuthPageLoading />}>
                <Earnings />
              </Suspense>
            }
          />
          <Route
            path="courses"
            element={
              <Suspense fallback={<AuthPageLoading />}>
                <InstructorCourses />
              </Suspense>
            }
          />
          <Route
            path="chat"
            element={
              <Suspense fallback={<AuthPageLoading />}>
                <Chat />
              </Suspense>
            }
          />
          <Route
            path="course1"
            element={
              <Suspense fallback={<AuthPageLoading />}>
                <SingleCourse />
              </Suspense>
            }
          />
        </Route>

        {/* === Admin Dashboard Routes (Lazy Loaded) === */}
        <Route
          path="/admin/dashboard"
          element={
            <Suspense fallback={<AuthPageLoading />}>
              <AdminLayout />
            </Suspense>
          }
        >
          <Route
            index
            element={
              <Suspense fallback={<AuthPageLoading />}>
                <AdminHome />
              </Suspense>
            }
          />
          <Route
            path="settings"
            element={
              <Suspense fallback={<AuthPageLoading />}>
                <AdminSettings />
              </Suspense>
            }
          />
          <Route
            path="payments"
            element={
              <Suspense fallback={<AuthPageLoading />}>
                <Payments />
              </Suspense>
            }
          />
          <Route
            path="courses"
            element={
              <Suspense fallback={<AuthPageLoading />}>
                <CourseManagement />
              </Suspense>
            }
          />
          <Route
            path="analytics"
            element={
              <Suspense fallback={<AuthPageLoading />}>
                <Analytics />
              </Suspense>
            }
          />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
