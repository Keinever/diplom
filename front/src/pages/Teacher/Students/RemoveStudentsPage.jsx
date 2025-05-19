import React from 'react';
import StudentList from '../../../students/StudentList.jsx';
import ProfessorNavBar from "../../../components/NavBar/ProfessorNavBar.jsx";
import CoursePage from "../../../course/CoursePage.jsx";

const RemoveStudentsPage = () => {
  // Здесь будет запрос к API для получения списка учеников на курсе
  // Пример:
  // const fetchStudents = async () => {
  //   const response = await fetch('/api/course/students');
  //   return await response.json();
  // };

  const handleRemoveStudent = async (studentId) => {
    try {
      // Здесь будет запрос на удаление ученика с курса
      // await fetch(`/api/course/remove-student/${studentId}`, { method: 'DELETE' });
      alert(`Студент с ID ${studentId} удален с курса`);
    } catch (error) {
      console.error('Ошибка при удалении ученика:', error);
    }
  };

  return (
      <div className="flex relative">
        <ProfessorNavBar activeTab="courses" />
        <StudentList
            title="Удаление учеников с курса"
            actionText="Удалить"
            onAction={handleRemoveStudent}
            emptyMessage="На этом курсе пока нет учеников."
        />
      </div>
  );
};

export default RemoveStudentsPage;