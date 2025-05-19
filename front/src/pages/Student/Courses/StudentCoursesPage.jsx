import StudentNavBar from "../../../components/NavBar/StudentNavBar.jsx";
import CoursePageForStudents from "../../../course/CoursePageForStudents.jsx";

export default function StudentCoursesPage () {
    return (
        <div className="flex relative">
            <StudentNavBar activeTab="courses" />
            <CoursePageForStudents />
        </div>
    )
}