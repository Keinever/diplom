import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './header/Header';
import StudentList from './students/StudentList';
import TeacherPersonalAccount from './teacher/TeacherPersonalAccount'
import CourseCreation from './course/CourseCreation'
import CourseEdit from './course/CourseEdit';
import CourseList from './course/CourseList';
import CoursePage from './course/CoursePage';
import AddStudentsPage from './students/AddStudentsPage';
import AddAttemptsPage from './students/AddAttemptsPage';
import RemoveStudentsPage from './students/RemoveStudentsPage';
import StudentResultsPage from './students/StudentResultsPage';
import './App.css';


const App = () => {
  return (
      <Router>
          <div>
              <Header />
              <Routes>
                  <Route path="/students" element={<StudentList />}/>
                  <Route path="/teacher/profile" element={<TeacherPersonalAccount />}/>  
                  <Route path="/course/create" element={<CourseCreation />}/>  
                  <Route path="/course/edit" element={<CourseEdit />}/>  
                  <Route path="/course/list" element={<CourseList />}/>  
                  <Route path="/course/page" element={<CoursePage />}/>  
                  <Route path="/course/students/add" element={<AddStudentsPage/>}/> 
                  <Route path="/course/students/attempts" element={<AddAttemptsPage/>}/> 
                  <Route path="/course/students/remove" element={<RemoveStudentsPage/>}/> 
                  <Route path="/course/students/results" element={<StudentResultsPage />}/> 
              </Routes>
          </div>
      </Router>
  );
};

export default App;