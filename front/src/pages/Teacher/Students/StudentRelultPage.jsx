import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import api, { get_csrf } from '../../../api';
import './StudentPage.css'

const StudentResultPage = () => {
  const { studentId } = useParams();
  const { courseId } = useParams();
  const location = useLocation();
  const [steps, setSteps] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const { state } = location;
  const receivedStudentId = state?.studentId || studentId;
  const receivedCourseId = state?.courseId || courseId;

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

        setSteps(response.data.steps || []);
      } catch (err) {
        console.error('Ошибка при загрузке результатов:', err);
        setError('Не удалось загрузить результаты студента');
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [receivedStudentId, receivedCourseId]);

  if (isLoading) {
    return (
      <div className="results-container">
        <h1 className="results-title">Результаты студента</h1>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="results-container">
        <h1 className="results-title">Результаты студента</h1>
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
    <div className="results-container">
      <h1 className="results-title">
        Результаты студента ID: {receivedStudentId} (Курс ID: {receivedCourseId})
      </h1>
      
      {steps.length === 0 ? (
        <p className="empty-message">Нет данных о шагах курса</p>
      ) : (
        <div className="steps-list">
          {steps.map(step => (
            <div key={step.id} className="step-item">
              <div className="step-info">
                <h3 className="step-title">{step.title}</h3>
                <p className="step-description">{step.description}</p>
                
                {step.attempts?.length > 0 ? (
                  <div className="attempts-list">
                    {step.attempts.map((attempt, index) => (
                      <div key={attempt.id} className="attempt-item">
                        <div className="attempt-header">
                          <span className="attempt-number">Попытка {index + 1}</span>
                          <span className="attempt-date">
                            {new Date(attempt.created_at).toLocaleString()}
                          </span>
                        </div>
                        <div className="attempt-details">
                          <span>Статус: {attempt.status}</span>
                          <span>Оценка: {attempt.score || 'не оценено'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="no-attempts">Нет выполненных попыток</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentResultPage;