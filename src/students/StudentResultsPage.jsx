import React from 'react';
import StudentList from './StudentList';

const StudentResultsPage = () => {
  // Здесь будет запрос к API для получения списка учащихся на курсе с их результатами
  // Пример:
  // const fetchStudents = async () => {
  //   const response = await fetch('/api/course/students-with-results');
  //   return await response.json();
  // };

  const handleAction = (studentId) => {
    console.log('Действие для студента:', studentId);
    // Здесь можно реализовать дополнительное действие при клике
  };

  return (
    <StudentList
      title="Результаты учеников"
      showResult={true}
      emptyMessage="На этом курсе пока нет учеников с результатами."
    />
  );
};

export default StudentResultsPage;