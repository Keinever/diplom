import ProfessorNavBar from "../../../components/NavBar/ProfessorNavBar.jsx";
import CourseCreation from "../../../course/CourseCreation.jsx";

export default function CoursesCreation () {
    return (
        <div className="flex relative">
            <ProfessorNavBar activeTab="courses" />
            <CourseCreation />
        </div>
    )
}