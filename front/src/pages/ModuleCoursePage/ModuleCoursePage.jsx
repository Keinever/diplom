import ModuleCourse from "../../components/ModuleCourse/ModuleCourse.jsx";
import ProfessorNavBar from "../../components/NavBar/ProfessorNavBar.jsx";

export default function ModuleCoursePage () {
    return (
        <div className="flex relative">
            <ProfessorNavBar activeTab="courses" />
            <ModuleCourse />
        </div>
    )
}