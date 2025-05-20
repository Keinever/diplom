import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './CoursePage.css';
import api, { get_csrf } from '../api'; // Предполагается наличие модуля api

const CoursePage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [courseInfo, setCourseInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setIsLoading(true);
        const csrfToken = get_csrf();
        
        const response = await api.get(`/api/courses/${courseId}/`, {
          headers: {
            'X-CSRFToken': csrfToken,
            'Content-Type': 'application/json'
          }
        });

        const serverData = response.data;
        setCourseInfo({
          id: serverData.course_id,
          title: serverData.title,
          teacher: serverData.teacher?.name || "Преподаватель не указан",
          studentsCount: serverData.students.length,
          description: serverData.description,
          startDate: new Date(serverData.modules[0]?.due_date).toLocaleDateString() || "Дата не указана",
          endDate: new Date([...serverData.modules].pop()?.due_date).toLocaleDateString() || "Дата не указана"
        });

      } catch (err) {
        console.error('Ошибка загрузки данных курса:', err);
        setError('Не удалось загрузить информацию о курсе');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId]);

  const handleViewResults = () => {
    navigate(`/courses/${courseId}/students/results`);
  };

  const handleAddStudents = () => {
    navigate(`/courses/${courseId}/students/add`);
  };

  const handleRemoveStudents = () => {
    navigate(`/courses/${courseId}/students/remove`);
  };

  const handleAddAttempts = () => {
    navigate(`/courses/${courseId}/students/attempts`);
  };

  const handleEditCourse = () => {
    navigate(`/courses/${courseId}/edit`);
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Загрузка информации о курсе...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Ошибка</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Попробовать снова</button>
      </div>
    );
  }

  if (!courseInfo) {
    return <div className="error-container">Курс не найден</div>;
  }

  return (
    <div className="course-page">
      <div className="course-header">
        <h1>{courseInfo.title}</h1>
        <div className="teacher-info">
          <button className="edit-course-btn" onClick={handleEditCourse}>
            Редактировать курс
          </button>
        </div>
      </div>

      <div className="course-meta-info">
        <div className="meta-item">
          <span className="meta-label">Преподаватель:</span>
          <span className="meta-value">{courseInfo.teacher}</span>
        </div>
        <div className="meta-item">
          <span className="meta-label">Количество студентов:</span>
          <span className="meta-value">{courseInfo.studentsCount}</span>
        </div>
        <div className="meta-item">
          <span className="meta-label">Дата начала:</span>
          <span className="meta-value">{courseInfo.startDate}</span>
        </div>
        <div className="meta-item">
          <span className="meta-label">Дата окончания:</span>
          <span className="meta-value">{courseInfo.endDate}</span>
        </div>
      </div>

      <div className="course-description">
        <h2>Описание курса</h2>
        <p>{courseInfo.description}</p>
      </div>

      <div className="course-management">
        <h2 className='h22'>Управление курсом</h2>
        <div className="management-buttons">
          <button className="action-btn view-results" onClick={handleViewResults}>
            <span className="icon">📊</span>
            <span className="text">Результаты аттестации</span>
            <span className="description">Просмотр успеваемости студентов</span>
          </button>
          
          <button className="action-btn add-students" onClick={handleAddStudents}>
            <span className="icon">👥</span>
            <span className="text">Добавить учеников</span>
            <span className="description">Добавление новых студентов на курс</span>
          </button>
          
          <button className="action-btn remove-students" onClick={handleRemoveStudents}>
            <span className="icon">❌</span>
            <span className="text">Удалить учеников</span>
            <span className="description">Исключение студентов из курса</span>
          </button>
          
          <button className="action-btn add-attempts" onClick={handleAddAttempts}>
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