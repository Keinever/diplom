import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './CoursePageForStudents.css';

// Хардкодные данные для примера
const SINGLE_COURSE_DATA = {
  "id": 1,
  "title": "Дискретная математика",
  "description": "Основы дискретной математики для программистов",
  "modules": [
    {
      "id": 1,
      "title": "Основы теории множеств",
      "description": "Изучение базовых понятий теории множеств",
      "steps": [
        {
          "id": 1,
          "title": "Введение в множества",
          "type": "теория",
          "content": "Основные определения и примеры..."
        }
      ]
    }
  ]
};

const CoursePageForStudents = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        // Вариант с API (раскомментировать для использования):
        // const response = await fetch(`/api/courses/${courseId}`);
        // const data = await response.json();
        
        // Хардкодный вариант:
        const data = SINGLE_COURSE_DATA;
        
        setCourse(data);
      } catch (error) {
        console.error('Ошибка загрузки курса:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  const handleOpenModule = (moduleId) => {
    navigate(`/courses/${courseId}/modules/${moduleId}`);
  };

  if (loading) return <div className="loading-text">Загрузка курса...</div>;
  if (!course) return <div className="error-text">Курс не найден</div>;

  return (
    <div className="course-page-container">
      <h1 className="course-title">{course.title}</h1>
      <p className="course-description">{course.description}</p>
      
      <div className="modules-list">
        {course.modules.map(module => (
          <div 
            key={module.id} 
            className="module-card"
            onClick={() => handleOpenModule(module.id)}
          >
            <h3 className="module-title">{module.title}</h3>
            <p className="module-description">{module.description}</p>
            <div className="module-meta">
              <span>Шагов: {module.steps.length}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoursePageForStudents;