import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Menu() {
    return (
        <div className="menu">
            <ul>
                <li><NavLink to="/timeline" className={({ isActive }) => (isActive ? "activeSection" : undefined)}>Derniers messages</NavLink></li>
                <li><NavLink to="/new" className={({ isActive }) => (isActive ? "activeSection" : undefined)}>Nouveau message</NavLink></li>
                <li><NavLink to="/settings" className={({ isActive }) => (isActive ? "activeSection" : undefined)}>Paramètres</NavLink></li>
            </ul>
        </div>
    )
}