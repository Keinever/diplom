import React from 'react';
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom"
import StudentList from './students/StudentList.jsx';
import TeacherPersonalAccount from './teacher/TeacherPersonalAccount.jsx'
import CourseCreation from './course/CourseCreation.jsx'
import CourseEdit from './course/CourseEdit.jsx';
import CourseList from './course/CourseList.jsx';
import CoursePage from './course/CoursePage.jsx';
import AddStudentsPage from './pages/Teacher/Students/AddStudentsPage.jsx';
import AddAttemptsPage from './pages/Teacher/Students/AddAttemptsPage.jsx';
import RemoveStudentsPage from './pages/Teacher/Students/RemoveStudentsPage.jsx';
import StudentResultsPage from './pages/Teacher/Students/StudentResultsPage.jsx';
import ModuleCourse from "./components/ModuleCourse/ModuleCourse.jsx";
import LoginRegisterPage from "./pages/LoginRegister/LoginRegister.jsx";
import ModuleCoursePage from "./pages/ModuleCoursePage/ModuleCoursePage.jsx";
import CourseListForStudents from './course/CourseListForStudents.jsx';
import CoursePageForStudents from './course/CoursePageForStudents.jsx';
import './App.css';
import CoursesList from "./pages/Student/Courses/StudentCoursesList.jsx";
import CoursesCreation from "./pages/Teacher/Courses/CoursesCreation.jsx";
import CoursesPage from "./pages/Teacher/Courses/CoursesEdit.jsx";
import CoursesEdit from "./pages/Teacher/Courses/CoursesEdit.jsx";
import StudentCoursesList from "./pages/Student/Courses/StudentCoursesList.jsx";
import StudentCoursesPage from "./pages/Student/Courses/StudentCoursesPage.jsx";


const App = () => {
  return (
        <BrowserRouter>
            <Routes>

                <Route path="/login_register" element={<LoginRegisterPage />} />

                <Route path="/courses/create" element={<CoursesCreation />} />
                <Route path="/courses/:courseId" element={<CoursesPage />} />
                <Route path="/courses/:courseId/edit" element={<CoursesEdit />} />

                <Route path="/courses/:courseId/students/add" element={<AddStudentsPage/>}/>
                <Route path="/courses/:courseId/students/attempts" element={<AddAttemptsPage/>}/>
                <Route path="/courses/:courseId/students/remove" element={<RemoveStudentsPage/>}/>
                <Route path="/courses/:courseId/students/results" element={<StudentResultsPage />}/>

                <Route path="/student/courses" element={<StudentCoursesList />} />
                <Route path="/student/courses/:courseId" element={<StudentCoursesPage />} />

                <Route path="/courses/:courseId/modules" element={<ModuleCourse />} />
                <Route path="/courses/:courseId/modules/:moduleId" element={<ModuleCoursePage />} />

                <Route path="/students" element={<StudentList />}/>
                <Route path="/teacher/profile" element={<TeacherPersonalAccount />}/>
                <Route path="/teacher/courses" element={<CoursesList />}/>
                <Route path="*" element={<Navigate to="/courses" replace />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App;