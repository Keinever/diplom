import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CourseList.css';
import api, {get_csrf} from "../api.js";

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
        try {
    const csrfToken = get_csrf();

    const response = await api.get('/api/courses/', {
      headers: {
        'X-CSRFToken': csrfToken,
        'Content-Type': 'application/json'
      }
    });

     console.log('Ответ от сервера:', response.data);
    setCourses(response.data.results);
    
    return response.data;

  } catch (err) {
    console.error('Ошибка загрузки курсов:', err);
    setError('Не удалось загрузить список курсов');
    throw err;
  } finally {
    setIsLoading(false);
  }
};
    fetchCourses();
  }, []);

  const handleEditCourse = (courseId) => {
    navigate(`/courses/${courseId}/edit`);
  };

  const handleOpenCoursePage = (courseId) => {
    navigate(`/courses/${courseId}`); 
  };

  const handleCreateCourse = () => {
    navigate('/courses/create');
  };
  const handleDelete = async (id) => {
    try {
        const csrfToken = get_csrf();
        await api.delete(`/api/courses/${id}/`, {
          headers: {
            'X-CSRFToken': csrfToken,
            'Content-Type': 'application/json'
          }
        });
        setCourses(courses.filter(course => course.course_id !== id));
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
          <div key={course.course_id} className="course-card">
            <div className="course-info">
              <h2>{'название: ' + course.title}</h2>
              <p className="course-description">{'описание: ' + course.description}</p>
              <div className="course-meta">
                <span>Студентов: {course.students.lenght}</span>
              </div>
            </div>
            <div className="course-actions">
              <button 
                className="edit-btn"
                onClick={() => handleEditCourse(course.course_id)}
              >
                изменить
              </button>
              <button 
                className="view-btn"
                onClick={() => handleOpenCoursePage(course.course_id)}
              >
                Страница курса
              </button>
              <button 
                className="delete-btn"  
                onClick={() => handleDelete(course.course_id)}
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
