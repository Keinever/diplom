import { BookOpen, BookmarkCheck, FlaskConical } from "lucide-react"
import NavBar, {NavBarRow} from "./NavBar.jsx";

export default function ProfessorNavBar({activeTab}) {
    return (
        <NavBar>
            <NavBarRow
                icon={<BookOpen size="25" />}
                text="Курсы"
                color="grey"
                active={activeTab === 'courses'}
            />
            <NavBarRow
                icon={<BookmarkCheck size="25" />}
                text="Успеваемость"
                color="grey"
                active={activeTab === 'marks'}
            />
        </NavBar>
    )
}