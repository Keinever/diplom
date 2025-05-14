import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CourseList.css';

const COURSE_DATA = {
  "courses": [
    {
      "id": 1,
      "title": "Дискретная математика",
      "description": "Основы дискретной математики для программистов",
      "modules": [
        {
          "id": 1,
          "title": "Основы теории множеств",
          "steps": [
            { "id": 1, "title": "Введение в множества" },
            { "id": 2, "title": "Операции над множествами" }
          ]
        }
      ],
      "progress": 45
    },
    {
      "id": 2,
      "title": "Основы программирования",
      "description": "Введение в алгоритмы и структуры данных",
      "modules": [
        {
          "id": 1,
          "title": "Базовые конструкции",
          "steps": [
            { "id": 1, "title": "Переменные и типы данных" }
          ]
        }
      ],
      "progress": 15
    }
  ]
};

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


const CourseListForStudents = () => {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        
        // Вариант с API (раскомментировать для использования)
        // const response = await fetch('/api/student/courses');
        // if (!response.ok) throw new Error('Ошибка загрузки');
        // const data = await response.json();
        
        const data = COURSE_DATA;
        
        setCourses(data.courses);
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

  // Остальная часть компонента аналогична предыдущей версии...
  // Изменяем только отображаемые данные и убираем ненужные кнопки

  return (
    <div className="course-list-container">
      <header className="course-list-header">
        <h1>Доступные курсы</h1>
      </header>

      <div className="courses-grid">
        {courses.map(course => (
          <div key={course.id} className="course-card">
            <div className="course-info">
              <h2>{course.title}</h2>
              <p className="course-description">{course.description}</p>
              <div className="course-meta">
                <span>Модулей: {course.modules.length}</span>
                <span>Прогресс: {course.progress}%</span>
              </div>
            </div>
            <div className="course-actions">
              <button 
                className="view-btn"
                onClick={() => handleOpenCourse(course.id)}
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