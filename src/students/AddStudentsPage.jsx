import React from 'react';
import StudentList from './StudentList';

const AddStudentsPage = () => {
  // Здесь будет запрос к API для получения всех учеников преподавателя
  // Пример:
  // const fetchStudents = async () => {
  //   const response = await fetch('/api/teacher/students');
  //   return await response.json();
  // };

  const handleAddStudent = async (studentId) => {
    try {
      // Здесь будет запрос на добавление ученика на курс
      // await fetch(`/api/course/add-student/${studentId}`, { method: 'POST' });
      alert(`Студент с ID ${studentId} добавлен на курс`);
    } catch (error) {
      console.error('Ошибка при добавлении ученика:', error);
    }
  };

  return (
    <StudentList
      title="Добавление учеников на курс"
      actionText="Добавить"
      onAction={handleAddStudent}
      emptyMessage="У вас нет учеников, которых можно добавить на этот курс."
    />
  );
};

export default AddStudentsPage;