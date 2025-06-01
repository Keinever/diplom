import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StudentList from '../../../students/StudentList.jsx';
import ProfessorNavBar from "../../../components/NavBar/ProfessorNavBar.jsx";
import api, { get_csrf } from '../../../api';

const StudentResultsPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
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
          .filter(student => student.courses?.includes(parseInt(courseId)))
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

  const handleViewStudentResults = (studentId) => {
    navigate(`/courses/${courseId}/students/results/${studentId}`, {
      state: {
        studentId,
        courseId
      }
    });
  };

  return (
    <div className="flex relative">
      <ProfessorNavBar activeTab="courses" />
      <StudentList
        title="Результаты студентов"
        actionText="Просмотр результатов"
        onAction={handleViewStudentResults}
        students={students}
        isLoading={isLoading}
        error={error}
        emptyMessage="На этом курсе нет учеников"
      />
    </div>
  );
};

export default StudentResultsPage;