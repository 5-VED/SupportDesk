import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Plus,
    Search,
    Filter,
    MoreHorizontal,
    ChevronDown
} from 'lucide-react';
import { PageContainer } from '../components/layout/PageContainer';
import { Button } from '../components/ui/Button';
import { DataTable } from '../components/ui/DataTable';
import { StatusBadge, PriorityBadge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { Select } from '../components/ui/Input';
import { NewTicketModal } from './NewTicketModal';
import './TicketsList.css';

// Mock data
const mockTickets = [
    { id: 'TKT-1234', subject: 'Cannot login to my account', status: 'open', priority: 'high', customer: 'John Smith', agent: 'Sarah Chen', channel: 'Email', created: '2024-01-15 10:30 AM' },
    { id: 'TKT-1233', subject: 'Payment processing failed', status: 'pending', priority: 'urgent', customer: 'Emily Davis', agent: 'Mike Johnson', channel: 'Chat', created: '2024-01-15 09:45 AM' },
    { id: 'TKT-1232', subject: 'Feature request: Dark mode', status: 'open', priority: 'low', customer: 'Alex Kim', agent: 'Sarah Chen', channel: 'Web Form', created: '2024-01-15 08:20 AM' },
    { id: 'TKT-1231', subject: 'App crashes on startup', status: 'overdue', priority: 'high', customer: 'Lisa Wang', agent: null, channel: 'Email', created: '2024-01-14 04:15 PM' },
    { id: 'TKT-1230', subject: 'Billing discrepancy', status: 'resolved', priority: 'medium', customer: 'Mike Brown', agent: 'Emily Davis', channel: 'Phone', created: '2024-01-14 02:30 PM' },
    { id: 'TKT-1229', subject: 'Password reset not working', status: 'open', priority: 'medium', customer: 'Sarah Lee', agent: 'Alex Kim', channel: 'Email', created: '2024-01-14 11:00 AM' },
    { id: 'TKT-1228', subject: 'API integration help needed', status: 'pending', priority: 'low', customer: 'Tech Corp', agent: 'Mike Johnson', channel: 'Email', created: '2024-01-14 09:30 AM' },
    { id: 'TKT-1227', subject: 'Mobile app notification issue', status: 'resolved', priority: 'medium', customer: 'David Park', agent: 'Sarah Chen', channel: 'Chat', created: '2024-01-13 03:45 PM' },
];

const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'open', label: 'Open' },
    { value: 'pending', label: 'Pending' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'overdue', label: 'Overdue' },
];

const priorityOptions = [
    { value: 'all', label: 'All Priority' },
    { value: 'urgent', label: 'Urgent' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' },
];

const columns = [
    {
        key: 'id',
        header: 'Ticket ID',
        render: (value) => (
            <Link to={`/tickets/${value}`} className="ticket-id-link">
                {value}
            </Link>
        ),
    },
    {
        key: 'subject',
        header: 'Subject',
        render: (value, row) => (
            <div className="ticket-subject">
                <Link to={`/tickets/${row.id}`}>{value}</Link>
                <span className="ticket-channel">{row.channel}</span>
            </div>
        ),
    },
    {
        key: 'status',
        header: 'Status',
        render: (value) => <StatusBadge status={value} />,
    },
    {
        key: 'priority',
        header: 'Priority',
        render: (value) => <PriorityBadge priority={value} />,
    },
    {
        key: 'customer',
        header: 'Customer',
        render: (value) => (
            <div className="ticket-customer">
                <Avatar name={value} size="xs" />
                <span>{value}</span>
            </div>
        ),
    },
    {
        key: 'agent',
        header: 'Assigned To',
        render: (value) => value ? (
            <div className="ticket-agent">
                <Avatar name={value} size="xs" />
                <span>{value}</span>
            </div>
        ) : (
            <span className="unassigned">Unassigned</span>
        ),
    },
    {
        key: 'created',
        header: 'Created',
    },
];

export function TicketsList() {
    const [selectedRows, setSelectedRows] = useState([]);
    const [statusFilter, setStatusFilter] = useState('all');
    const [priorityFilter, setPriorityFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tickets, setTickets] = useState(mockTickets);

    const handleSelectRow = (id, checked) => {
        setSelectedRows(prev =>
            checked ? [...prev, id] : prev.filter(i => i !== id)
        );
    };

    const handleSelectAll = (checked) => {
        setSelectedRows(checked ? tickets.map(t => t.id) : []);
    };

    const handleCreateTicket = async (ticketData) => {
        // Generate new ticket ID
        const ticketNumber = tickets.length + 1234 + 1;
        const newTicket = {
            id: `TKT-${ticketNumber}`,
            subject: ticketData.subject,
            status: 'open',
            priority: ticketData.priority,
            customer: 'Current User', // In production, use authenticated user
            agent: ticketData.assignee_id || null,
            channel: 'Web Form',
            created: new Date().toLocaleString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            }),
        };

        // Add to tickets list
        setTickets(prev => [newTicket, ...prev]);
    };

    const filteredTickets = tickets.filter(ticket => {
        if (statusFilter !== 'all' && ticket.status !== statusFilter) return false;
        if (priorityFilter !== 'all' && ticket.priority !== priorityFilter) return false;
        if (searchQuery && !ticket.subject.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        return true;
    });

    return (
        <PageContainer
            title="Tickets"
            actions={
                <Button icon={Plus} onClick={() => setIsModalOpen(true)}>New Ticket</Button>
            }
        >
            <NewTicketModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreateTicket}
            />
            <div className="tickets-page">
                {/* Filters Bar */}
                <div className="tickets-filters">
                    <div className="tickets-search">
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="Search tickets..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="tickets-filter-group">
                        <Select
                            options={statusOptions}
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        />
                        <Select
                            options={priorityOptions}
                            value={priorityFilter}
                            onChange={(e) => setPriorityFilter(e.target.value)}
                        />
                        <Button variant="ghost" icon={Filter}>
                            More Filters
                        </Button>
                    </div>
                </div>

                {/* Bulk Actions */}
                {selectedRows.length > 0 && (
                    <div className="tickets-bulk-actions">
                        <span>{selectedRows.length} selected</span>
                        <Button variant="ghost" size="sm">Assign</Button>
                        <Button variant="ghost" size="sm">Change Status</Button>
                        <Button variant="ghost" size="sm">Change Priority</Button>
                        <Button variant="ghost" size="sm" className="danger">Delete</Button>
                    </div>
                )}

                {/* Tickets Table */}
                <DataTable
                    columns={columns}
                    data={filteredTickets}
                    selectable
                    selectedRows={selectedRows}
                    onSelectRow={handleSelectRow}
                    onSelectAll={handleSelectAll}
                    emptyMessage="No tickets found"
                />

                {/* Pagination */}
                <div className="tickets-pagination">
                    <span className="pagination-info">
                        Showing 1-{filteredTickets.length} of {filteredTickets.length} tickets
                    </span>
                    <div className="pagination-controls">
                        <Button variant="ghost" size="sm" disabled>Previous</Button>
                        <Button variant="ghost" size="sm" disabled>Next</Button>
                    </div>
                </div>
            </div>
        </PageContainer>
    );
}
