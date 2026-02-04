import { useState } from 'react';
import {
    Plus,
    Search,
    Mail,
    Phone,
    Building,
    MoreHorizontal,
    Ticket
} from 'lucide-react';
import { PageContainer } from '../components/layout/PageContainer';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { DataTable } from '../components/ui/DataTable';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import './Contacts.css';

// Mock data
const mockContacts = [
    { id: 1, name: 'John Smith', email: 'john.smith@acme.com', phone: '+1 (555) 123-4567', company: 'Acme Corp', tickets: 5, lastContact: '2 days ago' },
    { id: 2, name: 'Emily Davis', email: 'emily.davis@techstart.io', phone: '+1 (555) 234-5678', company: 'TechStart', tickets: 3, lastContact: '1 week ago' },
    { id: 3, name: 'Alex Kim', email: 'alex.kim@globalinc.com', phone: '+1 (555) 345-6789', company: 'Global Inc', tickets: 8, lastContact: '3 days ago' },
    { id: 4, name: 'Sarah Lee', email: 'sarah.lee@innovate.co', phone: '+1 (555) 456-7890', company: 'Innovate Co', tickets: 2, lastContact: '1 day ago' },
    { id: 5, name: 'Mike Brown', email: 'mike.brown@enterprise.net', phone: '+1 (555) 567-8901', company: 'Enterprise Net', tickets: 12, lastContact: '5 hours ago' },
    { id: 6, name: 'Lisa Wang', email: 'lisa.wang@startup.xyz', phone: '+1 (555) 678-9012', company: 'Startup XYZ', tickets: 1, lastContact: '2 weeks ago' },
];

const selectedContact = {
    id: 1,
    name: 'John Smith',
    email: 'john.smith@acme.com',
    phone: '+1 (555) 123-4567',
    company: 'Acme Corp',
    role: 'Product Manager',
    tickets: 5,
    created: 'Jan 15, 2024',
    recentTickets: [
        { id: 'TKT-1234', subject: 'Cannot login to my account', status: 'open' },
        { id: 'TKT-1220', subject: 'Feature request: Export data', status: 'resolved' },
        { id: 'TKT-1195', subject: 'Billing question', status: 'closed' },
    ],
    activity: [
        { action: 'Opened ticket #1234', time: '2 days ago' },
        { action: 'Replied to ticket #1220', time: '1 week ago' },
        { action: 'Ticket #1220 resolved', time: '1 week ago' },
    ]
};

const columns = [
    {
        key: 'name',
        header: 'Name',
        render: (value, row) => (
            <div className="contact-name-cell">
                <Avatar name={value} size="sm" />
                <div>
                    <span className="contact-name">{value}</span>
                    <span className="contact-email">{row.email}</span>
                </div>
            </div>
        ),
    },
    {
        key: 'company',
        header: 'Company',
        render: (value) => (
            <div className="contact-company">
                <Building size={14} />
                <span>{value}</span>
            </div>
        ),
    },
    {
        key: 'phone',
        header: 'Phone',
    },
    {
        key: 'tickets',
        header: 'Tickets',
        render: (value) => <Badge variant="default">{value}</Badge>,
    },
    {
        key: 'lastContact',
        header: 'Last Contact',
    },
];

export function Contacts() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selected, setSelected] = useState(selectedContact);

    return (
        <PageContainer
            title="Contacts"
            actions={<Button icon={Plus}>Add Contact</Button>}
        >
            <div className="contacts-page">
                {/* Contacts List */}
                <div className="contacts-list-section">
                    <div className="contacts-search">
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="Search contacts..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <DataTable
                        columns={columns}
                        data={mockContacts}
                        emptyMessage="No contacts found"
                    />
                </div>

                {/* Contact Detail */}
                {selected && (
                    <aside className="contact-detail">
                        <Card>
                            <div className="contact-detail-header">
                                <Avatar name={selected.name} size="xl" />
                                <h2>{selected.name}</h2>
                                <span className="contact-role">{selected.role} at {selected.company}</span>
                            </div>

                            <div className="contact-info-section">
                                <h4>Contact Information</h4>
                                <div className="contact-info-list">
                                    <div className="contact-info-item">
                                        <Mail size={16} />
                                        <a href={`mailto:${selected.email}`}>{selected.email}</a>
                                    </div>
                                    <div className="contact-info-item">
                                        <Phone size={16} />
                                        <span>{selected.phone}</span>
                                    </div>
                                    <div className="contact-info-item">
                                        <Building size={16} />
                                        <span>{selected.company}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="contact-tickets-section">
                                <h4>Recent Tickets</h4>
                                <div className="recent-tickets-list">
                                    {selected.recentTickets.map((ticket) => (
                                        <div key={ticket.id} className="recent-ticket-item">
                                            <Ticket size={14} />
                                            <div>
                                                <span className="ticket-id">{ticket.id}</span>
                                                <span className="ticket-subject">{ticket.subject}</span>
                                            </div>
                                            <Badge variant={ticket.status === 'open' ? 'primary' : 'default'} size="sm">
                                                {ticket.status}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="contact-activity-section">
                                <h4>Activity Timeline</h4>
                                <div className="activity-timeline">
                                    {selected.activity.map((item, idx) => (
                                        <div key={idx} className="activity-item">
                                            <div className="activity-dot" />
                                            <div className="activity-content">
                                                <span>{item.action}</span>
                                                <span className="activity-time">{item.time}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Card>
                    </aside>
                )}
            </div>
        </PageContainer>
    );
}
