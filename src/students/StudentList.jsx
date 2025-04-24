import React, { useState, useEffect } from 'react';
import Student from './Student';
import './StudentStyle.css';

const StudentList = ({ 
  title, 
  actionText, 
  onAction, 
  showResult = false,
  showAttempts = false,
  emptyMessage = "Нет учеников для отображения."
}) => {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Здесь будет реальный запрос к API
        // const response = await fetch('/api/students');
        // if (!response.ok) throw new Error('Ошибка загрузки данных');
        // const data = await response.json();
        // setStudents(data);

        // Временные данные для демонстрации
        await new Promise(resolve => setTimeout(resolve, 500)); // Имитация задержки сети
        
        const demoData = [
          { id: 1, firstName: 'Иван', lastName: 'Иванов', middleName: 'Иванович', group: 'Группа A', result: '85%', attempts: 3 },
          { id: 2, firstName: 'Анна', lastName: 'Петрова', middleName: 'Сергеевна', group: 'Группа B', result: '92%', attempts: 2 },
          { id: 3, firstName: 'Сергей', lastName: 'Сидоров', middleName: 'Николаевич', group: 'Группа C', result: '78%', attempts: 1 }
        ];
        
        setStudents(demoData);
      } catch (err) {
        console.error('Ошибка при загрузке студентов:', err);
        setError('Не удалось загрузить данные студентов');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudents();
  }, []);

  if (isLoading) {
    return (
      <div className="student-list-container">
        <h1 className="student-list-title">{title}</h1>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="student-list-container">
        <h1 className="student-list-title">{title}</h1>
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
      <h1 className="student-list-title">{title}</h1>
      
      {students.length === 0 ? (
        <p className="empty-message">{emptyMessage}</p>
      ) : (
        <div className="student-list">
          {students.map(student => (
            <Student
              key={student.id}
              student={student}
              onAction={onAction}
              actionText={actionText}
              showResult={showResult}
              showAttempts={showAttempts}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentList;