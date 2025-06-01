import StudentNavBar from "../../../components/NavBar/StudentNavBar.jsx";
import StudentAttemptsPage from "../../Teacher/Students/StudentAttemptsPage.jsx";


export default function AttemptsPage() {
    return (
        <div className="flex relative">
            <StudentNavBar activeTab="courses" />
            <StudentAttemptsPage/>
        </div>
    )
}