import React, { useState, useEffect } from 'react';
import ModuleCreation from './ModuleCreation.jsx';
import './CourseEdit.css';

const COURSE_DATA = {
    "title": "adads",
    "description": "adasd",
    "modules": [
      {
        "title": "adad",
        "description": "adasd",
        "startDate": "2025-04-03",
        "steps": [
          {
            "title": "OOO",
            "description": "asd",
            "type": "обучающие задание",
            "file": null,
            "assignmentTitle": "Задание 1"
          },
          {
            "title": "OOO",
            "description": "asdsad",
            "type": "лекция",
            "assignmentTitle": null
          }
        ]
      }
    ]
  };

const CourseEdit = ({ courseId }) => {
  const [course, setCourse] = useState({ 
    title: '', 
    description: '', 
    modules: [] 
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  /* Получение данных курса
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`https://your-api-endpoint.com/courses/${courseId}`);
        if (!response.ok) throw new Error('Ошибка при загрузке курса');
        
        const data = await response.json();
        setCourse(data);
      } catch (err) {
        console.error('Ошибка:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);
 */
useEffect(() => {
    try {
      setIsLoading(true);
      setCourse(COURSE_DATA);
    } catch (err) {
      console.error('Ошибка:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
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
      // Здесь должна быть реальная отправка на сервер
      const response = await fetch(`https://your-api-endpoint.com/courses/${courseId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(course),
      });
      
      if (!response.ok) throw new Error('Ошибка при сохранении курса');
      
      const result = await response.json();
      console.log('Курс успешно обновлен:', result);
      alert('Изменения успешно сохранены!');
    } catch (err) {
      console.error('Ошибка:', err);
      setError(err.message);
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
        <h1>Редактирование курса</h1>
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