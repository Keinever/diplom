import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import api, { get_csrf } from '../../../api';
import './StudentPage.css'

const StudentAttemptsPage = () => {
  const { studentId, courseId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [attempts, setAttempts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddingAttempt, setIsAddingAttempt] = useState(false);

  const { state } = location;
  const receivedStudentId = state?.studentId || studentId;
  const receivedCourseId = state?.courseId || courseId;
  const studentName = state?.studentName || 'Студент';

  useEffect(() => {
    const fetchAttempts = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const csrfToken = get_csrf();
        const response = await api.get('/api/attempts', {
          headers: {
            'X-CSRFToken': csrfToken,
            'Content-Type': 'application/json'
          },
          params: {
            student_id: receivedStudentId,
            course_id: receivedCourseId
          }
        });
        console.log(response)
        const attemptsData = Array.isArray(response.data?.data) 
          ? response.data.data 
          : Array.isArray(response.data)
          ? response.data
          : [];
          
        setAttempts(attemptsData);
        
      } catch (err) {
        console.error('Ошибка при загрузке попыток:', err);
        setError('Не удалось загрузить данные о попытках');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAttempts();
  }, [receivedStudentId, receivedCourseId]);

  const handleBackClick = () => {
    navigate(`/courses/${courseId}`);
  };

const handleAddAttempt = async (stepId) => {
  console.log('Пытаемся добавить попытку для stepId:', stepId); // Добавьте логирование
  
  if (!stepId || isAddingAttempt) {
    console.log('Отмена: stepId отсутствует или идет процесс добавления ');
    return;
  }
  
  setIsAddingAttempt(true);
  try {
    const csrfToken = get_csrf();
    console.log('Отправляем запрос на добавление попытки...');
    
    const response = await api.post('/api/attempts', {
      student: receivedStudentId,
      step: stepId,
    }, {
      headers: {
        'X-CSRFToken': csrfToken,
        'Content-Type': 'application/json'
      }
    });

    console.log('Ответ сервера:', response.data);
    
    const updatedAttempts = attempts.map(attempt => {
      if (attempt.step?.step_id === stepId) {
        return {
          ...attempt,
          attempts: (attempt.attempts || 0) + 1
        };
      }
      return attempt;
    });
    
    setAttempts(updatedAttempts);
    alert('Попытка успешно добавлена!');
    
  } catch (err) {
    console.error('Полная ошибка:', err);
    console.error('Детали ошибки:', {
      message: err.message,
      response: err.response,
      stack: err.stack
    });
    alert(`Ошибка: ${err.response?.data?.message || 'Не удалось добавить попытку'}`);
  } finally {
    setIsAddingAttempt(false);
  }
};

  if (isLoading) {
    return (
      <div className="student-list-container">
        <div className="back-button-wrapper">
          <button className="student-action-btn back" onClick={handleBackClick}>
            Вернуться на страницу курса
          </button>
        </div>
        <h1 className="student-list-title">Студенты: {studentName}</h1>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="student-list-container">
        <div className="back-button-wrapper">
          <button className="student-action-btn back" onClick={handleBackClick}>
            Вернуться на страницу курса
          </button>
        </div>
        <h1 className="student-list-title">Студенты: {studentName}</h1>
        <p className="error-message">{error}</p>
        <button 
          className="retry-button"
          onClick={() => window.location.reload()}
        >
          Попробовать снова
        </button>
      </div>
    );
  }

  return (
    <div className="student-list-container">
      <div className="back-button-wrapper">
        <button className="student-action-btn back" onClick={handleBackClick}>
          Вернуться на страницу курса
        </button>
      </div>
      <h1 className="student-list-title">Студенты: {studentName}</h1>
      
      {!attempts || attempts.length === 0 ? (
        <p className="empty-message">Нет данных о заданиях</p>
      ) : (
        <div className="attempts-list">
          {attempts.map((attempt, index) => (
            <div key={index} className="attempt-item">
              <div className="attempt-info">
                <h3>Шаг: {attempt.step?.title || 'Без названия'}</h3>
                <p>Описание: {attempt.step?.description || 'Нет описания'}</p>
                <p>Количество попыток: {attempt.attempts || 0}</p>
              </div>
              <button 
                className={`student-action-btn ${isAddingAttempt ? 'disabled' : ''}`}
                onClick={() => handleAddAttempt(attempt.step?.step_id)}
                disabled={isAddingAttempt}
              >
                {isAddingAttempt ? 'Добавление...' : 'Добавить попытку'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentAttemptsPage;