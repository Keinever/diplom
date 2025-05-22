
import React from 'react';
import Student from './Student.jsx';
import './StudentStyle.css';

const StudentList = ({ 
  title, 
  actionText, 
  onAction, 
  students = [], 
  isLoading,
  error,
  emptyMessage = "Нет учеников для отображения."
}) => {
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
              showResult={false}
              showAttempts={false}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentList;