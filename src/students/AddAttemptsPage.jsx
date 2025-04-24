import React from 'react';
import StudentList from './StudentList';

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
    <StudentList
      title="Добавление попыток ученикам"
      actionText="Добавить попытку"
      onAction={handleAddAttempt}
      showAttempts={true}
      emptyMessage="На этом курсе пока нет учеников."
    />
  );
};

export default AddAttemptsPage;