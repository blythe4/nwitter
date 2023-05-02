import React from "react";
import { Link } from "react-router-dom/cjs/react-router-dom";

const Navigation = () => (
    <nav>
        <ul>
            <li>
                <Link to="/">
                    <span>Home</span>
                </Link>
            </li>

            <li>
                <Link to="/profile">
                    <span>My Profile</span>
                </Link>
            </li>
        </ul>
    </nav>
);
export default Navigation;
