import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CourseList.css';
import api, { get_csrf } from "../api.js";

const CourseListForStudents = () => {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        const csrfToken = get_csrf();

        const response = await api.get('/api/courses/', {
          headers: {
            'X-CSRFToken': csrfToken,
            'Content-Type': 'application/json'
          }
        });

        console.log('Ответ от сервера:', response.data);
        setCourses(response.data.results);

      } catch (err) {
        console.error('Ошибка загрузки курсов:', err);
        setError('Не удалось загрузить список курсов');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleOpenCourse = (courseId) => {
    navigate(`/student/courses/${courseId}`);
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Загрузка курсов...</p>
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

  return (
    <div className="course-list-container">
      <header className="course-list-header">
        <h1>Доступные курсы</h1>
      </header>

      <div className="courses-grid">
        {courses.map(course => (
          <div key={course.course_id} className="course-card">
            <div className="course-info">
              <h2>{course.title}</h2>
              <p className="course-description">{course.description}</p>
              <div className="course-meta">
                <span>Модулей: {course.modules.length}</span>
              </div>
            </div>
            <div className="course-actions">
              <button 
                className="view-btn"
                onClick={() => handleOpenCourse(course.course_id)}
              >
                Открыть курс
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseListForStudents;