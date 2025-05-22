import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import StudentList from '../../../students/StudentList.jsx';
import ProfessorNavBar from "../../../components/NavBar/ProfessorNavBar.jsx";
import api, { get_csrf } from '../../../api';

const RemoveStudentsPage = () => {
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
            student.courses?.includes(parseInt(courseId)) // Фильтр на наличие курса
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

  const handleRemoveStudent = async (studentId) => {
    try {
      const csrfToken = get_csrf();
      
      
      await api.delete('/api/course_students', {
        headers: {
          'X-CSRFToken': csrfToken,
          'Content-Type': 'application/json'
        },
        params: { 
          student_id: studentId,
          course_id: courseId
        }
      });
      
      // Обновляем список студентов
      setStudents(prevStudents => 
        prevStudents.filter(student => student.id !== studentId)
      );

      alert(`Студент успешно удалён с курса`);

    } catch (error) {
      console.error('Ошибка при удалении ученика:', error);
      alert(`Ошибка: ${error.response?.data?.message || 'Не удалось удалить студента'}`);
    }
  };

  return (
    <div className="flex relative">
      <ProfessorNavBar activeTab="courses" />
      <StudentList
        title="Удаление учеников с курса"
        actionText="Удалить"
        onAction={handleRemoveStudent}
        students={students}
        isLoading={isLoading}
        error={error}
        emptyMessage="На этом курсе нет учеников для удаления."
      />
    </div>
  );
};

export default RemoveStudentsPage;