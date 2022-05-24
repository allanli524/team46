import React, {useState} from "react";
import {Button} from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import './UserMenu.css'

const UserMenu = () => {

    const [name, changeName] = useState("");

    const change_name = (new_name) => {
        console.log(`Changing name to: ${new_name}`)
        changeName(new_name);
    }
    return (
        <div>
            <h1>Welcome, {name}</h1>
            <div className="menu_container">
                <ul className="button_group">
                    <li className="menu_button"><Button >Change Name</Button></li>
                    <li className="menu_button"><Button >Change Password</Button></li>
                    <li className="menu_button"><Button >Dark Mode</Button></li>
                </ul>
            </div>
        </div>
    )
}

export default UserMenu;