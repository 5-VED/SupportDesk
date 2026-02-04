import { Sidebar } from './Sidebar';
import { TopNavbar } from './TopNavbar';
import './PageContainer.css';

export function PageContainer({ children, title, actions }) {
    return (
        <div className="page-layout">
            <Sidebar />
            <TopNavbar />
            <main className="page-main">
                {(title || actions) && (
                    <div className="page-header">
                        {title && <h1 className="page-title">{title}</h1>}
                        {actions && <div className="page-actions">{actions}</div>}
                    </div>
                )}
                <div className="page-content">
                    {children}
                </div>
            </main>
        </div>
    );
}
