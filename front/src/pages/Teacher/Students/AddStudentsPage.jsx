import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import StudentList from '../../../students/StudentList.jsx';
import ProfessorNavBar from "../../../components/NavBar/ProfessorNavBar.jsx";
import api, { get_csrf } from '../../../api';

const AddStudentsPage = () => {
  const { courseId } = useParams();
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const csrfToken = get_csrf();
        const response = await api.get('/api/students/', {
          headers: {
            'X-CSRFToken': csrfToken,
            'Content-Type': 'application/json'
          }
        });

        const parsedStudents = response.data.results
          .filter(student => 
            !student.courses?.includes(parseInt(courseId))
          )
          .map(student => ({
            id: student.user,
            firstName: student.first_name,
            lastName: student.last_name,
            middleName: student.middle_name || '',
            group: student.group?.name || 'Группа не указана'
          }));

        setStudents(parsedStudents);

      } catch (err) {
        console.error('Ошибка при загрузке студентов:', err);
        setError('Не удалось загрузить список студентов');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudents();
  }, [courseId]);

  const handleAddStudent = async (studentId) => {
    try {
      const csrfToken = get_csrf();
      
      await api.post('/api/course_students', 
        {
          student_id: studentId,
          course_id: courseId
        },
        {
          headers: {
            'X-CSRFToken': csrfToken,
            'Content-Type': 'application/json'
          }
        }
      );
      
      setStudents(prevStudents => 
        prevStudents.filter(student => student.id !== studentId)
      );

      alert(`Студент успешно добавлен на курс`);

    } catch (error) {
      console.error('Ошибка при добавлении ученика:', error);
      alert(`Ошибка: ${error.response?.data?.message || 'Не удалось добавить студента'}`);
    }
  };

  return (
    <div className="flex relative">
      <ProfessorNavBar activeTab="courses" />
      <StudentList
        title="Добавление учеников на курс"
        actionText="Добавить"
        onAction={handleAddStudent}
        students={students}
        isLoading={isLoading}
        error={error}
        emptyMessage="У вас нет учеников, которых можно добавить на этот курс."
      />
    </div>
  );
};

export default AddStudentsPage;