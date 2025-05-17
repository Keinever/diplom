import React, { useState } from 'react';
import ModuleCreation from './ModuleCreation.jsx';
import api, {get_csrf} from "../api.js";
import './CourseCreation.css';

const buildFormData = (formData, data, parentKey = '') => {
  if (data instanceof File) {
    formData.append(parentKey, data, data.name);
  } else if (typeof data === 'object' && data !== null) {
    Object.keys(data).forEach(key => {
      const value = data[key];
      const formattedKey = parentKey ? `${parentKey}[${key}]` : key;
      
      if (Array.isArray(value)) {
        value.forEach((item, index) => {
          const arrayKey = `${formattedKey}[${index}]`;
          buildFormData(formData, item, arrayKey);
        });
      } else if (typeof value === 'object' && value !== null) {
        buildFormData(formData, value, formattedKey);
      } else {
        formData.append(formattedKey, value);
      }
    });
  } else {
    formData.append(parentKey, data);
  }
};

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
      setIsLoading(true);
      const csrfToken = get_csrf();
      const formData = new FormData();
      const dataTmp = {"title": course.title, "description": course.description, "modules": modules}
      const formData1 = new FormData();
      buildFormData(formData1, dataTmp);

      formData.append('title', course.title);
      formData.append('description', course.description);

      modules.forEach((module, moduleIndex) => {
        formData.append(`modules[${moduleIndex}]`, JSON.stringify({"title": module.title}));
        formData.append(`modules[${moduleIndex}][description]`, module.description);
        formData.append(`modules[${moduleIndex}][due_date]`, module.startDate);
        formData.append(`modules[${moduleIndex}][total_points]`, module.total_points || 100);
        formData.append(`modules[${moduleIndex}][attempts_limit]`, module.attempts_limit || null);
        
        module.steps.forEach((step, stepIndex) => {
          formData.append(`modules[${moduleIndex}][steps][${stepIndex}][title]`, step.title);
          formData.append(`modules[${moduleIndex}][steps][${stepIndex}][description]`, step.description);
          formData.append(`modules[${moduleIndex}][steps][${stepIndex}][exercise_type]`, step.type);
          
          if (step.file instanceof File) {
            formData.append(
              `modules[${moduleIndex}][steps][${stepIndex}][step_file]`, 
              step.file, 
              step.file.name
            );
          }
          
          if (step.assignmentTitle) {
            formData.append(
              `modules[${moduleIndex}][steps][${stepIndex}][lab_number]`, 
              step.assignmentTitle
            );
          }
        });
      });
      console.log('--- FormData Contents ---');
      for (let [key, value] of formData1.entries()) {
        if (value instanceof File) {
          console.log(`${key}:`, `File(${value.name}, ${value.type}, ${value.size} bytes)`);
        } else {
          console.log(`${key}:`, value);
        }
      }
      const response = await api.post('/api/courses/', formData1, {
        headers: {
          'X-CSRFToken': csrfToken,
        }
      });

      console.log('Курс успешно создан:', response.data);
      alert('Курс успешно создан!');
      setCourse({ title: '', description: '' });
      setModules([]);
      
    } catch (err) {
      console.error('Ошибка:', err);
      setError(err.response?.data?.message || 'Ошибка при создании курса');
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
                        {step.file.name}
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