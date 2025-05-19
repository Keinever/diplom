import { BookOpen, BookmarkCheck, FlaskConical } from "lucide-react"
import NavBar, {NavBarRow} from "./NavBar.jsx";

export default function StudentNavBar({activeTab}) {
    return (
        <NavBar>
            <NavBarRow
                icon={<BookOpen size="25" />}
                text="Курсы"
                active={activeTab === 'courses'}
                path="/student/courses"
            />
            <NavBarRow
                icon={<BookmarkCheck size="25" />}
                text="Успеваемость"
                active={activeTab === 'marks'}
                path="/student/courses/1"
            />
        </NavBar>
    )
}