import React, { useState } from 'react';
import ModuleCreation from './ModuleCreation.jsx';
import api, {get_csrf} from "../api.js";
import './CourseCreation.css';

const CourseCreation = () => {
  const [course, setCourse] = useState({ title: '', description: '' });
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCourseChange = (e) => {
    const { name, value } = e.target;
    setCourse(prev => ({ ...prev, [name]: value }));
  };

  const addModule = (module) => {
    setModules(prev => [...prev, { ...module, id: Date.now() }]);
  };

  const deleteModule = (id) => {
    setModules(prev => prev.filter(m => m.id !== id));
  };

 const handleSubmit = async () => {
  try {
    const csrfToken = get_csrf();
    const courseData = {
      title: course.title,
      description: course.description,
      teacher: 3, 
      modules: modules.map(module => ({
        title: module.title,
        description: module.description,
        due_date: module.startDate, 
        total_points: module.total_points || 100, 
        attempts_limit: module.attempts_limit || null,
        steps: module.steps.map(step => ({
          title: step.title,
          description: step.description,
          exercise_type: step.type, 
          step_file: step.file || null,
          lab_number: step.assignmentTitle || null,
          score: step.score || null
        }))
      }))
    };
    console.log('Course JSON:', JSON.stringify(courseData, null, 2));

    const response = await api.post('/api/courses/', courseData, {
      headers: {
        'X-CSRFToken': csrfToken,
        'Content-Type': 'application/json'
      }
    });

    console.log('Курс успешно создан:', response.data);
    alert('Курс успешно создан!');
    
    setCourse({ title: '', description: '', teacher_id: '' });
    setModules([]);
    
    return response.data;

  } catch (err) {
    console.error('Ошибка:', err);
    setError(err.response?.data?.message || 'Ошибка при создании курса');
    throw err;
  } finally {
    setIsLoading(false);
  }
};

  const handleModuleClick = (module) => {
    setSelectedModule(module);
  };

  const closeModal = () => {
    setSelectedModule(null);
  };

  return (
    <div className="course-creation-container">
      <header className="course-header">
        <h1>Создание нового курса</h1>
        {error && <div className="error-message">{error}</div>}
      </header>

      <div className="course-form">
        <div className="form-group">
          <label>Название курса*</label>
          <input
            type="text"
            name="title"
            placeholder="Введите название курса"
            value={course.title}
            onChange={handleCourseChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Описание курса</label>
          <textarea
            name="description"
            placeholder="Введите описание курса"
            value={course.description}
            onChange={handleCourseChange}
            rows="4"
          />
        </div>
      </div>

      <div className="modules-section">
        <h2>Модули курса</h2>
        <ModuleCreation addModule={addModule} />
        
        {modules.length > 0 && (
          <div className="modules-grid">
            {modules.map((module, index) => (
              <div key={module.id} className="module-card">
                <div 
                  className="module-content"
                  onClick={() => handleModuleClick(module)}
                >
                  <h3>{module.title}</h3>
                  <p className="module-date">
                    {module.startDate && `Начало: ${module.startDate}`}
                  </p>
                  <p className="module-steps-count">
                    {module.steps.length} шагов
                  </p>
                </div>
                <button 
                  className="delete-module-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteModule(module.id);
                  }}
                >
                  Удалить
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="actions">
        <button 
          className="submit-btn"
          onClick={handleSubmit}
          disabled={isLoading || !course.title || modules.length === 0}
        >
          {isLoading ? (
            <>
              <span className="spinner"></span>
              Создание...
            </>
          ) : 'Создать курс'}
        </button>
      </div>

      {selectedModule && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>{selectedModule.title}</h3>
              <button className="close-btn" onClick={closeModal}>&times;</button>
            </div>
            <div className="modal-body">
              <p className="module-description">{selectedModule.description}</p>
              {selectedModule.startDate && (
                <p className="module-meta">Дата начала: {selectedModule.startDate}</p>
              )}
              
              <h4>Шаги модуля:</h4>
              <div className="steps-list">
                {selectedModule.steps.map((step, i) => (
                  <div key={i} className="step-item">
                    <div className="step-header">
                      <span className={`step-type ${step.type.replace(/\s+/g, '-')}`}>
                        {step.type}
                      </span>
                      <h5>{step.title}</h5>
                    </div>
                    {step.description && (
                      <p className="step-description">{step.description}</p>
                    )}
                    {step.file && (
                      <p className="step-file">
                        <span className="file-icon">📎</span>
                        {step.fileName}
                      </p>
                    )}
                    {step.assignmentTitle && (
                      <p className="step-descripton">
                      <span className="step-description">📎</span>
                      {step.assignmentTitle}
                    </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseCreation;