import { Search, Bell, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { ThemeToggle } from '../ui/ThemeToggle';
import { Avatar } from '../ui/Avatar';
import './TopNavbar.css';

export function TopNavbar() {
    const [searchValue, setSearchValue] = useState('');

    return (
        <header className="top-navbar">
            <div className="top-navbar-search">
                <Search size={18} className="search-icon" />
                <input
                    type="text"
                    placeholder="Search tickets, contacts, articles..."
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    className="search-input"
                />
                <kbd className="search-shortcut">⌘K</kbd>
            </div>

            <div className="top-navbar-actions">
                <ThemeToggle />

                <button className="navbar-icon-btn notification-btn">
                    <Bell size={20} />
                    <span className="notification-badge">3</span>
                </button>

                <div className="navbar-user">
                    <Avatar name="John Doe" size="sm" status="online" />
                    <div className="navbar-user-info">
                        <span className="navbar-user-name">John Doe</span>
                        <span className="navbar-user-role">Admin</span>
                    </div>
                    <ChevronDown size={16} className="navbar-user-chevron" />
                </div>
            </div>
        </header>
    );
}
