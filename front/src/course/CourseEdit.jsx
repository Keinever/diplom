import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ModuleCreation from './ModuleCreation.jsx';
import './CourseEdit.css';
import api, {get_csrf} from "../api.js";

const CourseEdit = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
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

  const handleBackClick = () => {
    navigate(`/courses/${courseId}`);
  };

  const handleSubmit = async () => {
    setIsSaving(true);
    setError(null);
    
    try {
      const csrfToken = get_csrf();
      const formData = new FormData();
      formData.append('title', course.title);
      formData.append('description', course.description);

      course.modules.forEach((module, moduleIndex) => {
        formData.append(`modules[${moduleIndex}][title]`, module.title || '');
        formData.append(`modules[${moduleIndex}][module_id]`, module.id || '');
        formData.append(`modules[${moduleIndex}][description]`, module.description || '');
        formData.append(`modules[${moduleIndex}][due_date]`, module.due_date || '2024-12-31');
        formData.append(`modules[${moduleIndex}][total_points]`, module.total_points || 100);

        module.steps.forEach((step, stepIndex) => {
          formData.append(`modules[${moduleIndex}][steps][${stepIndex}][step_id]`, step.id);
          formData.append(`modules[${moduleIndex}][steps][${stepIndex}][title]`, step.title);
          formData.append(`modules[${moduleIndex}][steps][${stepIndex}][description]`, step.description);
          formData.append(`modules[${moduleIndex}][steps][${stepIndex}][exercise_type]`, step.type);
        });
      });

      await api.put(`/api/courses/${courseId}/`, formData, {
        headers: {
          'X-CSRFToken': csrfToken,
        }
      });

      navigate('/teacher/courses');
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
        <button className="student-action-btn back" onClick={handleBackClick}>
           Вернуться на страницу курса
        </button>
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