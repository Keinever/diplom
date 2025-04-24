import React from 'react';
import './StudentStyle.css';

const Student = ({ 
  student, 
  onAction, 
  actionText, 
  showResult = false,
  showAttempts = false
}) => {
  return (
    <div className="student-card">
      <div className="student-info">
        <h3>{student.lastName} {student.firstName} {student.middleName}</h3>
        <p>Группа: {student.group}</p>
        {showResult && <p>Результат: {student.result || 'Нет данных'}</p>}
        {showAttempts && <p>Попытки: {student.attempts || 0}</p>}
      </div>
      {onAction && actionText && (
        <button 
          className="student-action-btn"
          onClick={() => onAction(student.id)}
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default Student;