import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import api, { get_csrf } from '../../../api';
import './StudentPage.css';

const StudentResultPage = () => {
  const { studentId, courseId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [steps, setSteps] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const { state } = location;
  const receivedStudentId = state?.studentId || studentId;
  const receivedCourseId = state?.courseId || courseId;
  const firstName = state?.firstName || '';
  const lastName = state?.lastName || '';

  useEffect(() => {
    const fetchResults = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const csrfToken = get_csrf();
        const response = await api.get('/api/results', {
          headers: {
            'X-CSRFToken': csrfToken,
            'Content-Type': 'application/json'
          },
          params: {
            student_id: receivedStudentId,
            course_id: receivedCourseId
          }
        });
        const stepsData = response.data?.data || [];
        setSteps(stepsData.map(item => ({
          id: item.step?.title || Math.random().toString(36).substring(2, 9),
          title: item.step?.title || 'Без названия',
          description: item.step?.description || 'Нет описания',
          progress: item.result || 0, 
        })));
        
      } catch (err) {
        console.error('Ошибка при загрузке результатов:', err);
        setError('Не удалось загрузить результаты студента');
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [receivedStudentId, receivedCourseId]);

  const handleBackClick = () => {
    navigate(`/courses/${courseId}/students/results`);
  };

  if (isLoading) {
    return (
      <div className="student-results-container">
        <div className="back-button-wrapper">
          <button className="student-action-btn back" onClick={handleBackClick}>
            ← Назад к списку студентов
          </button>
        </div>
        <h1 className="student-results-title">Студент: {firstName} {lastName}</h1>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="student-results-container">
        <div className="back-button-wrapper">
          <button className="student-action-btn back" onClick={handleBackClick}>
            ← Назад к списку студентов
          </button>
        </div>
        <h1 className="student-results-title">Студент: {firstName} {lastName}</h1>
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
    <div className="student-results-container">
      <div className="back-button-wrapper">
        <button className="student-action-btn back" onClick={handleBackClick}>
          Назад к списку студентов
        </button>
      </div>
      <h1 className="student-results-title">Студент: {firstName} {lastName}</h1>
      
      {steps.length === 0 ? (
        <p className="empty-message">Нет данных о шагах курса</p>
      ) : (
        <div className="steps-list">
          {steps.map(step => (
            <div key={step.id} className="step-card">
              <div className="step-header">
                <h3 className="step-title">{step.title}</h3>
                <p className="step-description">{step.description}</p>
              </div>
              
              <div className="progress-container">
                <div className="progress-labels">
                  <span>Результат:</span>
                  <span className="progress-value">{step.progress}%</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ width: `${step.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentResultPage;