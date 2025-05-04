import { BookOpen } from "lucide-react"
import NavBar, {NavBarRow} from "./NavBar.jsx";
import ProfessorNavBar from "./ProfessorNavBar.jsx";

export default function StudentNavBar() {
    return (
        <NavBar>
            <NavBarRow icon={<BookOpen size="20" />} text="Courses"/>
            <NavBarRow icon={<BookOpen size="20" />} text="Coses"/>
        </NavBar>
    )
}