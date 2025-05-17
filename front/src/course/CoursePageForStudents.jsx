import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './CoursePageForStudents.css';
import api, { get_csrf } from '../api';

const CoursePageForStudents = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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
        const transformedData = {
          id: serverData.course_id,
          title: serverData.title,
          description: serverData.description,
          modules: serverData.modules.map(module => ({
            id: module.module_id,
            title: module.title,
            description: module.description,
            steps: module.steps.map(step => ({
              id: step.step_id,
              title: step.title,
              type: step.exercise_type,
              content: step.description
            }))
          }))
        };

        setCourse(transformedData);
      } catch (err) {
        console.error('Ошибка загрузки курса:', err);
        setError('Не удалось загрузить информацию о курсе');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId]);

  const handleOpenModule = (moduleId) => {
    navigate(`/student/courses/${courseId}/modules/${moduleId}`);
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

  if (!course) {
    return <div className="error-container">Курс не найден</div>;
  }

  return (
    <div className="course-page-container">
      <div className="course-header-section">
        <h2 className="section-title">Название курса</h2>
        <h1 className="course-title">{course.title}</h1>
      </div>

      <div className="course-description-section">
        <h2 className="section-title">Описание курса</h2>
        <p className="course-description">{course.description}</p>
      </div>

      <div className="modules-section">
        <h2 className="section-title">Список модулей</h2>
        <div className="modules-list">
          {course.modules.map((module, index) => (
            <div 
              key={module.id} 
              className="module-card"
              onClick={() => handleOpenModule(module.id)}
            >
              <div className="module-header">
                <h3 className="module-number">Модуль {index + 1}</h3>
                <h4 className="module-title">{module.title}</h4>
              </div>
              <p className="module-description">{module.description}</p>
              <div className="module-meta">
                <span>Количество шагов: {module.steps.length}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CoursePageForStudents;