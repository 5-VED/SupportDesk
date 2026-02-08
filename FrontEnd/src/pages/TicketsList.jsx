import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Plus,
    Search,
    Filter,
    MoreHorizontal,
    ChevronDown,
    RefreshCw,
    Edit,
    Eye
} from 'lucide-react';
import { PageContainer } from '../components/layout/PageContainer';
import { Button } from '../components/ui/Button';
import { DataTable } from '../components/ui/DataTable';
import { StatusBadge, PriorityBadge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { Select } from '../components/ui/Input';
import { TicketModal } from './NewTicketModal';
import { Modal } from '../components/ui/Modal';
import { ticketService } from '../services/ticket.service';
import { getFilterStatusOptions, getFilterPriorityOptions } from '../utils/ticketConstants';
import { toast } from 'react-hot-toast';
import './TicketsList.css';

const columns = [
    {
        key: '_id',
        header: 'Ticket ID',
        render: (value) => (
            <Link to={`/tickets/${value}`} className="ticket-id-link">
                #{value?.slice(-6).toUpperCase() || 'N/A'}
            </Link>
        ),
    },
    {
        key: 'subject',
        header: 'Subject',
        render: (value, row) => (
            <div className="ticket-subject">
                <Link to={`/tickets/${row._id}`}>{value}</Link>
                <span className="ticket-channel">{row.channel || 'Web'}</span>
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
        key: 'requester_id',
        header: 'Requester',
        render: (value) => (
            <div className="ticket-customer">
                <Avatar name={value?.first_name ? `${value.first_name} ${value.last_name}` : 'Unknown'} size="xs" />
                <span>{value?.first_name ? `${value.first_name} ${value.last_name}` : 'Unknown'}</span>
            </div>
        ),
    },
    {
        key: 'assignee_id',
        header: 'Assigned To',
        render: (value) => value ? (
            <div className="ticket-agent">
                <Avatar name={`${value.first_name} ${value.last_name}`} size="xs" />
                <span>{value.first_name} {value.last_name}</span>
            </div>
        ) : (
            <span className="unassigned">Unassigned</span>
        ),
    },
    {
        key: 'createdAt',
        header: 'Created',
        render: (value) => value ? new Date(value).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }) : 'N/A',
    },
    // Actions column will be added dynamically in the component to access handlers
];

export function TicketsList() {
    const [selectedRows, setSelectedRows] = useState([]);
    const [statusFilter, setStatusFilter] = useState('all');
    const [priorityFilter, setPriorityFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [editingTicket, setEditingTicket] = useState(null);
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 1,
    });

    // Fetch tickets from API
    const fetchTickets = async () => {
        setLoading(true);
        try {
            const params = {
                page: pagination.page,
                limit: pagination.limit,
            };

            if (statusFilter !== 'all') params.status = statusFilter;
            if (priorityFilter !== 'all') params.priority = priorityFilter;
            if (searchQuery) params.search = searchQuery;

            const response = await ticketService.list(params);

            if (response.success) {
                setTickets(response.data?.tickets || response.data || []);
                if (response.data?.pagination) {
                    setPagination(prev => ({
                        ...prev,
                        total: response.data.pagination.total,
                        totalPages: response.data.pagination.totalPages,
                    }));
                }
            }
        } catch (error) {
            console.error('Failed to fetch tickets:', error);
            toast.error('Failed to load tickets');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, [statusFilter, priorityFilter, pagination.page]);

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (pagination.page === 1) {
                fetchTickets();
            } else {
                setPagination(prev => ({ ...prev, page: 1 }));
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const handleSelectRow = (id, checked) => {
        setSelectedRows(prev =>
            checked ? [...prev, id] : prev.filter(i => i !== id)
        );
    };

    const handleSelectAll = (checked) => {
        setSelectedRows(checked ? tickets.map(t => t._id) : []);
    };

    const handleCreateOrUpdateTicket = async (ticketData) => {
        try {
            if (editingTicket) {
                const response = await ticketService.update(editingTicket._id, ticketData);
                if (response.success) {
                    toast.success('Ticket updated successfully');
                    fetchTickets();
                }
            } else {
                const response = await ticketService.create(ticketData);
                if (response.success) {
                    toast.success('Ticket created successfully');
                    fetchTickets();
                }
            }
        } catch (error) {
            console.error('Failed to save ticket:', error);
            toast.error(error.response?.data?.message || 'Failed to save ticket');
            throw error;
        }
    };

    const handleEditTicket = (ticket) => {
        setEditingTicket(ticket);
        setIsModalOpen(true);
    };

    const handleNewTicket = () => {
        setEditingTicket(null);
        setIsModalOpen(true);
    };

    const handleBulkStatusUpdate = async (status) => {
        try {
            await ticketService.bulkUpdate(selectedRows, { status });
            toast.success(`${selectedRows.length} tickets updated`);
            setSelectedRows([]);
            fetchTickets();
        } catch (error) {
            toast.error('Failed to update tickets');
        }
    };

    const handleBulkDelete = () => {
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        setDeleteLoading(true);
        try {
            await ticketService.bulkDelete(selectedRows);
            toast.success(`${selectedRows.length} tickets deleted`);
            setSelectedRows([]);
            fetchTickets();
            setIsDeleteModalOpen(false);
        } catch (error) {
            toast.error('Failed to delete tickets');
        } finally {
            setDeleteLoading(false);
        }
    };

    const handlePrevPage = () => {
        if (pagination.page > 1) {
            setPagination(prev => ({ ...prev, page: prev.page - 1 }));
        }
    };

    const handleNextPage = () => {
        if (pagination.page < pagination.totalPages) {
            setPagination(prev => ({ ...prev, page: prev.page + 1 }));
        }
    };

    return (
        <PageContainer
            title="Tickets"
            actions={
                <>
                    <Button variant="ghost" icon={RefreshCw} onClick={fetchTickets} disabled={loading}>
                        Refresh
                    </Button>
                    <Button icon={Plus} onClick={handleNewTicket}>New Ticket</Button>
                </>
            }
        >
            <TicketModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreateOrUpdateTicket}
                ticket={editingTicket}
            />

            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Confirm Deletion"
                size="small"
                footer={
                    <>
                        <Button variant="ghost" onClick={() => setIsDeleteModalOpen(false)} disabled={deleteLoading}>
                            Cancel
                        </Button>
                        <Button className="danger" onClick={confirmDelete} disabled={deleteLoading}>
                            {deleteLoading ? 'Deleting...' : 'Delete'}
                        </Button>
                    </>
                }
            >
                <p>
                    Are you sure you want to delete {selectedRows.length} {selectedRows.length === 1 ? 'ticket' : 'tickets'}?
                    This action cannot be undone.
                </p>
            </Modal>
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
                            options={getFilterStatusOptions()}
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        />
                        <Select
                            options={getFilterPriorityOptions()}
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
                        <Button variant="ghost" size="sm" onClick={() => handleBulkStatusUpdate('open')}>Mark Open</Button>
                        <Button variant="ghost" size="sm" onClick={() => handleBulkStatusUpdate('pending')}>Mark Pending</Button>
                        <Button variant="ghost" size="sm" onClick={() => handleBulkStatusUpdate('solved')}>Mark Solved</Button>
                        <Button variant="ghost" size="sm" className="danger" onClick={handleBulkDelete}>Delete</Button>
                    </div>
                )}

                {/* Tickets Table */}
                <DataTable
                    columns={[
                        ...columns,
                        {
                            key: 'actions',
                            header: '',
                            render: (_, row) => (
                                <div style={{ display: 'flex', gap: '4px' }}>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        title="View Ticket"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            window.location.href = `/tickets/${row._id}`;
                                        }}
                                    >
                                        <Eye size={16} />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        title="Edit Ticket"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            handleEditTicket(row);
                                        }}
                                    >
                                        <Edit size={16} />
                                    </Button>
                                </div>
                            ),
                        }
                    ]}
                    data={tickets}
                    selectable
                    selectedRows={selectedRows}
                    onSelectRow={handleSelectRow}
                    onSelectAll={handleSelectAll}
                    emptyMessage={loading ? "Loading tickets..." : "No tickets found"}
                    rowKey="_id"
                />

                {/* Pagination */}
                <div className="tickets-pagination">
                    <span className="pagination-info">
                        Page {pagination.page} of {pagination.totalPages} ({pagination.total} total tickets)
                    </span>
                    <div className="pagination-controls">
                        <Button
                            variant="ghost"
                            size="sm"
                            disabled={pagination.page <= 1}
                            onClick={handlePrevPage}
                        >
                            Previous
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            disabled={pagination.page >= pagination.totalPages}
                            onClick={handleNextPage}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </div>
        </PageContainer>
    );
}
