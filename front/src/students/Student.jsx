import React from 'react';
import './StudentStyle.css';

const Student = ({ student, actionText, onAction }) => {
  console.log(student.id)
  return (
    <div className="student-card">
      <div className="student-info">
        <h3>{`${student.lastName} ${student.firstName} ${student.middleName}`}</h3>
        <p className="student-group">{student.group}</p>
      </div>
      
      {actionText && (
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