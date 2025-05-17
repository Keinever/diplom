import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ModuleCreation from './ModuleCreation.jsx';
import './CourseEdit.css';
import api, { get_csrf } from '../api';

const CourseEdit = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState({
    title: '',
    description: '',
    modules: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setIsLoading(true);
        const csrfToken = get_csrf();
        
        const response = await api.get(`/api/courses/${courseId}/`, {
          headers: {
            'X-CSRFToken': csrfToken,
            'Content-Type': 'application/json'
          }
        });

        const serverData = response.data;
        const transformedModules = serverData.modules.map(module => ({
          id: module.module_id,
          title: module.title,
          description: module.description,
          startDate: module.due_date ? new Date(module.due_date).toISOString().split('T')[0] : '',
          steps: module.steps.map(step => ({
            id: step.step_id,
            title: step.title,
            description: step.description,
            type: step.exercise_type,
            assignmentTitle: step.lab_number,
            file: null
          }))
        }));

        setCourse({
          title: serverData.title,
          description: serverData.description,
          modules: transformedModules
        });

      } catch (err) {
        console.error('Ошибка загрузки курса:', err);
        setError('Не удалось загрузить данные курса');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  const handleCourseChange = (e) => {
    const { name, value } = e.target;
    setCourse(prev => ({ ...prev, [name]: value }));
  };

  const addModule = (newModule) => {
    setCourse(prev => ({
      ...prev,
      modules: [...prev.modules, { ...newModule, id: Date.now() }]
    }));
  };

  const updateModule = (updatedModule) => {
    setCourse(prev => ({
      ...prev,
      modules: prev.modules.map(module => 
        module.id === updatedModule.id ? updatedModule : module
      )
    }));
    setSelectedModule(null);
  };

  const deleteModule = (id) => {
    setCourse(prev => ({
      ...prev,
      modules: prev.modules.filter(module => module.id !== id)
    }));
  };

  const handleSubmit = async () => {
    setIsSaving(true);
    setError(null);
    
    try {
      const csrfToken = get_csrf();
      const serverFormatData = {
        title: course.title,
        description: course.description,
        modules: course.modules.map(module => ({
          module_id: module.id,
          title: module.title,
          description: module.description,
          due_date: module.startDate ? `${module.startDate}T00:00:00Z` : null,
          steps: module.steps.map(step => ({
            step_id: step.id,
            title: step.title,
            description: step.description,
            exercise_type: step.type,
            lab_number: step.assignmentTitle
          }))
        }))
      };

      const response = await api.put(`/api/courses/${courseId}/`, serverFormatData, {
        headers: {
          'X-CSRFToken': csrfToken,
          'Content-Type': 'application/json'
        }
      });

      console.log('Курс успешно обновлен:', response.data);
      alert('Изменения успешно сохранены!');
    } catch (err) {
      console.error('Ошибка:', err);
      setError(err.response?.data?.message || 'Ошибка при сохранении курса');
    } finally {
      setIsSaving(false);
    }
  };

  const handleModuleClick = (module) => {
    setSelectedModule(module);
  };

  const closeModal = () => {
    setSelectedModule(null);
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Загрузка курса...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Ошибка</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Попробовать снова</button>
      </div>
    );
  }

  return (
    <div className="course-edit-container">
      <header className="course-header">
        <h1>Редактирование курса: {course.title}</h1>
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
        
        {course.modules.length > 0 && (
          <div className="modules-grid">
            {course.modules.map((module) => (
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
          disabled={isSaving || !course.title || course.modules.length === 0}
        >
          {isSaving ? (
            <>
              <span className="spinner"></span>
              Сохранение...
            </>
          ) : 'Сохранить изменения'}
        </button>
      </div>

      {selectedModule && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Редактирование модуля: {selectedModule.title}</h3>
              <button className="close-btn" onClick={closeModal}>&times;</button>
            </div>
            <div className="modal-body">
              <ModuleCreation 
                key={selectedModule.id}
                addModule={updateModule} 
                initialModule={selectedModule}
                isEditing={true}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseEdit;