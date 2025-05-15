import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CourseList.css';

const COURSE_DATA = {
  "courses": [
    {
      "id": 1,
      "title": "Дискретная математика",
      "description": "Основы дискретной математики для программистов",
      "studentCount": 25,
      "lastUpdated": "2025-03-15"
    },
    {
      "id": 2,
      "title": "Основы программирования",
      "description": "Введение в алгоритмы и структуры данных",
      "studentCount": 30,
      "lastUpdated": "2025-02-20"
    }
  ]
};

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        // const response = await fetch('/api/teacher/courses');
        // const data = await response.json();
        
        setCourses(COURSE_DATA.courses);
      } catch (err) {
        console.error('Ошибка загрузки курсов:', err);
        setError('Не удалось загрузить список курсов');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleEditCourse = (courseId) => {
    navigate(`/courses/${courseId}/edit`); //${courseId}
  };

  const handleOpenCoursePage = (courseId) => {
    navigate(`/courses/${courseId}`); 
  };

  const handleCreateCourse = () => {
    navigate('/course/create');
  };
  const handleDelete = async (id) => {
    try {
        await fetch(`/api/course/delete/${id}`, { method: 'DELETE' });
        setCourses(courses.filter(course => course.id !== id));
    } catch (error) {
        console.error('Ошибка при удалении ученика:', error);
    }
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
        <h1>Мои курсы</h1>
        <button 
          className="create-course-btn"
          onClick={handleCreateCourse}
        >
          + Создать новый курс
        </button>
      </header>

      <div className="courses-grid">
        {courses.map(course => (
          <div key={course.id} className="course-card">
            <div className="course-info">
              <h2>{course.title}</h2>
              <p className="course-description">{course.description}</p>
              <div className="course-meta">
                <span>Студентов: {course.studentCount}</span>
                <span>Обновлен: {course.lastUpdated}</span>
              </div>
            </div>
            <div className="course-actions">
              <button 
                className="edit-btn"
                onClick={() => handleEditCourse(course.id)}
              >
                Редактировать
              </button>
              <button 
                className="view-btn"
                onClick={() => handleOpenCoursePage(course.id)}
              >
                Страница курса
              </button>
              <button 
                className="delete-btn"  
                onClick={() => handleDelete(course.id)}
              >
                Удалить
                </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseList;
