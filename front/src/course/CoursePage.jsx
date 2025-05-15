import React from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import './CoursePage.css';

const CoursePage = () => {
  const { courseId } = useParams();
  const courseInfo = {
    id: 1,
    title: courseId,
    teacher: "Иванов Иван Иванович",
    studentsCount: 25,
    startDate: "01.09.2023",
    endDate: "31.12.2023",
    description: "Курс по основам дискретной математики для программистов"
  };
  const navigate = useNavigate();

  const handleViewResults = (courseId) => {
    navigate(`/courses/${courseId}/students/results`);
  };

  const handleAddStudents = (courseId) => {
    navigate(`/courses/${courseId}/students/add`);
  };

  const handleRemoveStudents = (courseId) => {
    navigate(`/courses/${courseId}/students/remove`);
  };

  const handleAddAttempts = (courseId) => {
    navigate(`/courses/${courseId}/students/attempts`);
  };
  const handleEditCourse = () => {
    navigate('/course/edit');
  };


  return (
    <div className="course-page">
      <div className="course-header">
        <h1>{courseInfo.title}</h1>
        <div className="teacher-info">
          <button className="edit-course-btn" onClick={handleEditCourse}>Редактировать курс</button>
        </div>
      </div>

      <div className="course-description">
        <h2>Описание курса</h2>
        <p>{courseInfo.description}</p>
      </div>

      <div className="course-management">
        <h2>Управление курсом</h2>
        <div className="management-buttons">
          <button className="action-btn view-results" onClick={() => handleViewResults(courseInfo.id)}>
            <span className="icon">📊</span>
            <span className="text">Результаты аттестации</span>
            <span className="description">Просмотр успеваемости студентов</span>
          </button>
          
          <button className="action-btn add-students" onClick={() => handleAddStudents(courseInfo.id)}>
            <span className="icon">👥</span>
            <span className="text">Добавить учеников</span>
            <span className="description">Добавление новых студентов на курс</span>
          </button>
          
          <button className="action-btn remove-students" onClick={() => handleRemoveStudents(courseInfo.id)}>
            <span className="icon">❌</span>
            <span className="text">Удалить учеников</span>
            <span className="description">Исключение студентов из курса</span>
          </button>
          
          <button className="action-btn add-attempts" onClick={() => handleAddAttempts(courseInfo.id)}>
            <span className="icon">➕</span>
            <span className="text">Добавить попытки</span>
            <span className="description">Дополнительные попытки для студентов</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoursePage;