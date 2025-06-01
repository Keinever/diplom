import StudentNavBar from "../../../components/NavBar/StudentNavBar.jsx";
import StudentResultPage from "../../Teacher/Students/StudentRelultPage.jsx";


export default function AttemptsPage() {
    return (
        <div className="flex relative">
            <StudentNavBar activeTab="courses" />
            <StudentResultPage/>
        </div>
    )
}