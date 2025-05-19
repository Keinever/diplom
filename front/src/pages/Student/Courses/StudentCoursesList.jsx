import StudentNavBar from "../../../components/NavBar/StudentNavBar.jsx";
import CourseList from "../../../course/CourseList.jsx";

export default function StudentCoursesList () {
    return (
        <div className="flex relative">
            <StudentNavBar activeTab="courses" />
            <CourseList />
        </div>
    )
}