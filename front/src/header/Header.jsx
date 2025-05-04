
import React from 'react';
import { Link } from 'react-router-dom';
import './HeaderStyle.css';

const Header = () => {
    return (
        <header>
            <nav>
                <ul>
                    <li>
                        <Link to="/students">Список учеников</Link>
                    </li>
                    <li>
                        <Link to="/teacher/profile">личный кабинет преподователя</Link>
                    </li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;