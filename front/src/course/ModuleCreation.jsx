import React, { useState, useEffect } from 'react';
import './ModuleCreation.css';

const ModuleCreation = ({ addModule, initialModule, isEditing = false }) => {
  const [module, setModule] = useState(initialModule || { 
    title: '', 
    description: '', 
    steps: [], 
    startDate: '' 
  });
  const [showForm, setShowForm] = useState(isEditing || false);
  const [showStepForm, setShowStepForm] = useState(false);
  const [stepType, setStepType] = useState('лекция');
  const [stepContent, setStepContent] = useState({ 
    title: '', 
    description: '', 
    file: null,
    assignmentTitle: ''
  });
  const [editingStepIndex, setEditingStepIndex] = useState(null);

  const assignmentOptions = ['Задание 1', 'Задание 2', 'Задание 3'];
  const stepTypes = ['лекция', 'обучающие задание', 'аттестационное задание'];

  useEffect(() => {
    if (initialModule) {
      setModule(initialModule);
      setShowForm(true);
    }
  }, [initialModule]);

  const handleModuleChange = (e) => {
    const { name, value } = e.target;
    setModule(prev => ({ ...prev, [name]: value }));
  };

  const handleStepChange = (e) => {
    const { name, value } = e.target;
    setStepContent(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setStepContent(prev => ({ ...prev, file: e.target.files[0] }));
  };

  const addStep = () => {
    if (!stepContent.title) return;

    const newStep = {
      title: stepContent.title,
      description: stepContent.description,
      type: stepType,
      file: stepContent.file,
      assignmentTitle: stepType.includes('задание') ? stepContent.assignmentTitle : null
    };

    if (editingStepIndex !== null) {
      setModule(prev => ({
        ...prev,
        steps: prev.steps.map((step, index) => 
          index === editingStepIndex ? newStep : step
        )
      }));
    } else {
      setModule(prev => ({
        ...prev,
        steps: [...prev.steps, newStep]
      }));
    }

    setStepContent({ 
      title: '', 
      description: '', 
      file: null,
      assignmentTitle: ''
    });
    setShowStepForm(false);
    setEditingStepIndex(null);
  };

  const editStep = (index) => {
    const step = module.steps[index];
    setStepContent({
      title: step.title,
      description: step.description,
      file: step.file,
      assignmentTitle: step.assignmentTitle || ''
    });
    setStepType(step.type);
    setEditingStepIndex(index);
    setShowStepForm(true);
  };

  const deleteStep = (index) => {
    setModule(prev => ({
      ...prev,
      steps: prev.steps.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!module.title || !module.startDate) return;
    addModule(module);
    
    if (!isEditing) {
      setModule({ 
        title: '', 
        description: '', 
        steps: [], 
        startDate: '' 
      });
      setShowForm(false);
    }
  };

  return (
    <div className="module-creation">
      {!isEditing && (
        <button 
          className={`toggle-form-btn ${showForm ? 'cancel' : 'add'}`}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Отменить' : '+ Добавить модуль'}
        </button>
      )}

      {showForm && (
        <form className="module-form" onSubmit={handleSubmit}>
          <h3>{isEditing ? 'Редактирование модуля' : 'Создание модуля'}</h3>
          
          <div className="form-group">
            <label>Название модуля*</label>
            <input
              type="text"
              name="title"
              placeholder="Введите название модуля"
              value={module.title}
              onChange={handleModuleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Описание модуля</label>
            <textarea
              name="description"
              placeholder="Введите описание модуля"
              value={module.description}
              onChange={handleModuleChange}
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>Дата начала*</label>
            <input
              type="date"
              name="startDate"
              value={module.startDate}
              onChange={handleModuleChange}
              required
            />
          </div>

          <div className="steps-section">
            <div className="section-header">
              <h4>Шаги модуля</h4>
              <button 
                type="button"
                className="add-step-btn"
                onClick={() => {
                  setEditingStepIndex(null);
                  setShowStepForm(true);
                }}
              >
                + Добавить шаг
              </button>
            </div>

            {module.steps.length > 0 ? (
              <div className="steps-list">
                {module.steps.map((step, index) => (
                  <div key={index} className="step-item">
                    <div className="step-info">
                      <span className={`step-type ${step.type.replace(/\s+/g, '-')}`}>
                        {step.type}
                      </span>
                      <h5>{step.title}</h5>
                      {step.file && (
                        <p className="step-file">
                          <span className="file-icon">📎</span>
                          {step.file.name}
                        </p>
                      )}
                    </div>
                    <div className="step-actions">
                      <button
                        type="button"
                        className="edit-step-btn"
                        onClick={() => editStep(index)}
                      >
                        Редактировать
                      </button>
                      <button
                        type="button"
                        className="delete-step-btn"
                        onClick={() => deleteStep(index)}
                      >
                        Удалить
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-steps">Нет добавленных шагов</p>
            )}
          </div>

          {showStepForm && (
            <div className="step-form-modal">
              <div className="step-form-content">
                <div className="form-header">
                  <h4>{editingStepIndex !== null ? 'Редактирование шага' : 'Добавление шага'}</h4>
                  <button
                    type="button"
                    className="close-btn"
                    onClick={() => {
                      setShowStepForm(false);
                      setEditingStepIndex(null);
                    }}
                  >
                    &times;
                  </button>
                </div>

                <div className="form-group">
                  <label>Тип шага*</label>
                  <select
                    value={stepType}
                    onChange={(e) => setStepType(e.target.value)}
                  >
                    {stepTypes.map(type => (
                      <option key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Название шага*</label>
                  <input
                    type="text"
                    name="title"
                    placeholder="Введите название шага"
                    value={stepContent.title}
                    onChange={handleStepChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Описание шага*</label>
                  <input
                    type="text"
                    name="description"
                    placeholder="Введите описание шага"
                    value={stepContent.description}
                    onChange={handleStepChange}
                    required
                  />
                </div>

                {stepType === 'лекция' && (
                  <div className="form-group">
                    <label>
                      {editingStepIndex !== null ? 'Заменить файл' : 'Прикрепить файл'}
                    </label>
                    <div className="file-upload">
                      <label className="upload-btn">
                        Выберите файл
                        <input
                          type="file"
                          onChange={handleFileChange}
                          accept=".MOV,.avi,.mp4,.webm,.mkv,.pdf"
                          hidden
                        />
                      </label>
                      {stepContent.file && (
                        <span className="file-name">
                          {stepContent.file.name}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {(stepType === 'обучающие задание' || stepType === 'аттестационное задание') && (
                  <div className="form-group">
                    <label>Выберите задание</label>
                    <select
                      name="assignmentTitle"
                      value={stepContent.assignmentTitle}
                      onChange={handleStepChange}
                    >
                      <option value="">Выберите задание</option>
                      {assignmentOptions.map((option, index) => (
                        <option key={index} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="form-actions">
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => {
                      setShowStepForm(false);
                      setEditingStepIndex(null);
                    }}
                  >
                    Отмена
                  </button>
                  <button
                    type="button"
                    className="submit-btn"
                    onClick={addStep}
                    disabled={!stepContent.title}
                  >
                    {editingStepIndex !== null ? 'Сохранить изменения' : 'Добавить шаг'}
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="form-actions">
            {!isEditing && (
              <button
                type="button"
                className="cancel-btn"
                onClick={() => setShowForm(false)}
              >
                Отмена
              </button>
            )}
            <button
              type="submit"
              className="submit-btn"
              disabled={!module.title || !module.startDate}
            >
              {isEditing ? 'Сохранить изменения' : 'Сохранить модуль'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ModuleCreation;