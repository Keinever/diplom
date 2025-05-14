import React from 'react';
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom"
import StudentList from './students/StudentList.jsx';
import TeacherPersonalAccount from './teacher/TeacherPersonalAccount.jsx'
import CourseCreation from './course/CourseCreation.jsx'
import CourseEdit from './course/CourseEdit.jsx';
import CourseList from './course/CourseList.jsx';
import CoursePage from './course/CoursePage.jsx';
import AddStudentsPage from './students/AddStudentsPage.jsx';
import AddAttemptsPage from './students/AddAttemptsPage.jsx';
import RemoveStudentsPage from './students/RemoveStudentsPage.jsx';
import StudentResultsPage from './students/StudentResultsPage.jsx';
import ModuleCourse from "./components/ModuleCourse/ModuleCourse.jsx";
import LoginRegisterPage from "./pages/LoginRegister/LoginRegister.jsx";
import ModuleCoursePage from "./pages/ModuleCoursePage/ModuleCoursePage.jsx";
import CourseListForStudents from './course/CourseListForStudents.jsx';
import CoursePageForStudents from './course/CoursePageForStudents.jsx';
import './App.css';


const App = () => {
  return (
        <BrowserRouter>
            <Routes>

                <Route path="/login_register" element={<LoginRegisterPage />} />
                <Route path="/courses" element={<CourseList />} />


                <Route path="/courses" element={<CourseList />} />
                <Route path="/courses/create" element={<CourseCreation />} />
                <Route path="/courses/:courseId" element={<CoursePage />} />
                <Route path="/courses/:courseId/edit" element={<CourseEdit />} />

                <Route path="/courses/:courseId/students/add" element={<AddStudentsPage/>}/>
                <Route path="/courses/:courseId/students/attempts" element={<AddAttemptsPage/>}/>
                <Route path="/courses/:courseId/students/remove" element={<RemoveStudentsPage/>}/>
                <Route path="/courses/:courseId/students/results" element={<StudentResultsPage />}/>

                <Route path="student/courses" element={<CourseListForStudents />} />
                <Route path="student/courses/:courseId" element={<CoursePageForStudents />} />

                <Route path="/courses/:courseId/modules" element={<ModuleCourse />} />
                <Route path="/courses/:courseId/modules/:moduleId" element={<ModuleCoursePage />} />

                <Route path="/students" element={<StudentList />}/>
                <Route path="/teacher/profile" element={<TeacherPersonalAccount />}/>
                <Route path="*" element={<Navigate to="/course/students/add" replace />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App;