import React, { useEffect, useState } from 'react'; 
import { useNavigate } from 'react-router-dom'; 
import './TeacherPersonalAccount.css';

const TeacherPersonalAccount = () => {
    const [fullName, setFullName] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setFullName('Болдырева Елена Александровна');
            } catch (error) {
                console.error('Ошибка при получении данных:', error);
            }
        };
        fetchData();
    }, []);

    const handleRedirect = () => {
        navigate('/profile');
    };

    return (
        <div className="teacher-personal-account">
            <div className='personalInfo'>
                <div>{fullName}</div>
                <button onClick={handleRedirect}>Перейти в профиль</button>
            </div>
            <div className='mainInfo'>
                <div>
                    <button 
                      className="buttonForCourse button-create-course"
                      onClick={() => navigate('/course/create')}
                    >
                      <span className="icon">🔨</span>
                      <span className='text'>Создать курс</span>
                      <span className="description">Создание курса и добавление информации</span>
                    </button>
                </div>
                <div>
                    <button 
                      className="buttonForCourse button-my-courses"
                      onClick={() => navigate('/course/list')}
                    >
                      <span className="icon">📜</span>
                      <span className='text'>Мои курсы</span>
                      <span className="description">Полный список всех курсов преподавателя</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TeacherPersonalAccount;