import ProfessorNavBar from "../../../components/NavBar/ProfessorNavBar.jsx";
import CourseEdit from "../../../course/CourseEdit.jsx";

export default function CoursesEdit () {
    return (
        <div className="flex relative">
            <ProfessorNavBar activeTab="courses" />
            <CourseEdit />
        </div>
    )
}