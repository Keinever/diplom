import React from 'react';
import StudentList from '../../../students/StudentList.jsx';
import ProfessorNavBar from "../../../components/NavBar/ProfessorNavBar.jsx";
import CoursePage from "../../../course/CoursePage.jsx";

const AddAttemptsPage = () => {
  // const fetchStudents = async () => {
  //   const response = await fetch('/api/course/students');
  //   return await response.json();
  // };

  const handleAddAttempt = async (studentId) => {
    try {
      // Здесь будет запрос на добавление попытки
      // await fetch(`/api/students/${studentId}/add-attempt`, { method: 'POST' });
      alert(`Добавлена попытка для студента с ID ${studentId}`);
    } catch (error) {
      console.error('Ошибка при добавлении попытки:', error);
    }
  };

  return (
      <div className="flex relative">
        <ProfessorNavBar activeTab="courses" />
        <StudentList
            title="Добавление попыток ученикам"
            actionText="Добавить попытку"
            onAction={handleAddAttempt}
            showAttempts={true}
            emptyMessage="На этом курсе пока нет учеников."
        />
      </div>
  );
};

export default AddAttemptsPage;