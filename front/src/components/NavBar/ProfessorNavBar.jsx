import { BookOpen, BookmarkCheck, FlaskConical } from "lucide-react"
import NavBar, {NavBarRow} from "./NavBar.jsx";

export default function ProfessorNavBar({activeTab}) {
    return (
        <NavBar>
            <NavBarRow
                icon={<BookOpen size="25" />}
                text="Курсы"
                active={activeTab === 'courses'}
                path="/teacher/courses"
            />
            <NavBarRow
                icon={<BookmarkCheck size="25" />}
                text="Успеваемость"
                active={activeTab === 'marks'}
                path="/courses/1/edit"
            />
        </NavBar>
    )
}