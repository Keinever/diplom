import ProfessorNavBar from "../../../components/NavBar/ProfessorNavBar.jsx";
import CoursePage from "../../../course/CoursePage.jsx";

export default function CoursesPage () {
    return (
        <div className="flex relative">
            <ProfessorNavBar activeTab="courses" />
            <CoursePage />
        </div>
    )
}