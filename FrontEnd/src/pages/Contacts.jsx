import { useState, useEffect, useRef } from 'react';
import {
    Plus,
    Search,
    Mail,
    Phone,
    User as UserIcon,
    RefreshCw,
    Edit,
    Upload,
    Download,
    ArrowLeft,
    Trash2
} from 'lucide-react';
import { Modal } from '../components/ui/Modal';
import { PageContainer } from '../components/layout/PageContainer';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { DataTable } from '../components/ui/DataTable';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { userService } from '../services/user.service';
import { authService } from '../services/auth.service';
import { ContactModal } from './ContactModal';
import { toast } from 'react-hot-toast';
import * as XLSX from 'xlsx';
import './Contacts.css';

export function Contacts() {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [detailContact, setDetailContact] = useState(null); // For viewing details
    const [selectedRows, setSelectedRows] = useState([]); // For multi-select checkboxes
    const [editingContact, setEditingContact] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 1,
    });

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [singleDeleteContact, setSingleDeleteContact] = useState(null); // For single row delete

    const fileInputRef = useRef(null);

    const handleImportUser = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        const toastId = toast.loading('Importing users...');
        setLoading(true);
        try {
            const response = await userService.importUser(formData);
            if (response.success || response.data?.successCount > 0) {
                toast.success(response.message || `Imported ${response.data.successCount} users`, { id: toastId });
                fetchContacts();
            } else {
                toast.error(response.message || 'Import failed', { id: toastId });
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Import failed', { id: toastId });
        } finally {
            setLoading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleDownloadTemplate = () => {
        const templateData = [
            {
                'First Name': 'John',
                'Last Name': 'Doe',
                'Email': 'john.doe@example.com',
                'Country Code': '+91',
                'Phone': '9876543210'
            }
        ];
        const ws = XLSX.utils.json_to_sheet(templateData);
        ws['!cols'] = [
            { wch: 15 }, { wch: 15 }, { wch: 25 }, { wch: 15 }, { wch: 15 }
        ];
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Users');
        XLSX.writeFile(wb, 'user_import_template.xlsx');
        toast.success('Template downloaded');
    };

    const fetchContacts = async () => {
        setLoading(true);
        try {
            const params = {
                page: pagination.page,
                limit: pagination.limit,
                search: searchQuery,
                role: 'User'
            };
            const response = await userService.list(params);
            if (response.data && response.data.users) {
                // Filter out the logged-in user from the contacts list
                const currentUser = authService.getCurrentUser();
                console.log('Current user:', currentUser);
                console.log('Current user ID:', currentUser?._id);
                console.log('Contacts:', response.data.users.map(u => ({ id: u._id, name: u.first_name })));
                const filteredContacts = response.data.users.filter(
                    contact => contact._id !== currentUser?._id
                );
                setContacts(filteredContacts);
                setPagination(prev => ({
                    ...prev,
                    total: response.data.pagination.total - (currentUser ? 1 : 0),
                    totalPages: response.data.pagination.totalPages,
                }));
            }
        } catch (error) {
            console.error('Failed to fetch contacts:', error);
            toast.error('Failed to load contacts');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContacts();
    }, [pagination.page, pagination.limit]);

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (pagination.page === 1) {
                fetchContacts();
            } else {
                setPagination(prev => ({ ...prev, page: 1 }));
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const handleCreateSuccess = () => {
        fetchContacts();
        setIsModalOpen(false);
    };

    // Pagination handlers
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

    const handlePageSizeChange = (e) => {
        const newLimit = parseInt(e.target.value);
        setPagination(prev => ({ ...prev, limit: newLimit, page: 1 }));
    };

    const handleGoToPage = (pageNum) => {
        if (pageNum >= 1 && pageNum <= pagination.totalPages) {
            setPagination(prev => ({ ...prev, page: pageNum }));
        }
    };

    // Generate page numbers to display
    const getPageNumbers = () => {
        const pages = [];
        const { page, totalPages } = pagination;

        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            if (page <= 4) {
                for (let i = 1; i <= 5; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            } else if (page >= totalPages - 3) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
            } else {
                pages.push(1);
                pages.push('...');
                for (let i = page - 1; i <= page + 1; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            }
        }
        return pages;
    };

    // Multi-select handlers
    const handleSelectRow = (id, checked) => {
        setSelectedRows(prev =>
            checked ? [...prev, id] : prev.filter(i => i !== id)
        );
    };

    const handleSelectAll = (checked) => {
        setSelectedRows(checked ? contacts.map(c => c._id) : []);
    };

    // Bulk delete
    const handleBulkDelete = () => {
        setIsDeleteModalOpen(true);
    };

    const confirmBulkDelete = async () => {
        setDeleteLoading(true);
        try {
            if (singleDeleteContact) {
                // Single delete
                await userService.delete(singleDeleteContact._id);
                toast.success('Contact deleted successfully');
                if (detailContact?._id === singleDeleteContact._id) {
                    setDetailContact(null);
                }
            } else {
                // Bulk delete
                await userService.bulkDelete(selectedRows);
                toast.success(`${selectedRows.length} contacts deleted`);
                if (detailContact && selectedRows.includes(detailContact._id)) {
                    setDetailContact(null);
                }
                setSelectedRows([]);
            }
            fetchContacts();
            setIsDeleteModalOpen(false);
            setSingleDeleteContact(null);
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to delete contacts');
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleSingleDelete = (contact) => {
        setSingleDeleteContact(contact);
        setIsDeleteModalOpen(true);
    };

    const columns = [
        {
            key: 'name',
            header: 'Name',
            render: (_, row) => (
                <div className="contact-name-cell">
                    <Avatar name={`${row.first_name} ${row.last_name}`} size="sm" />
                    <div>
                        <span className="contact-name">{row.first_name} {row.last_name}</span>
                        <span className="contact-email">{row.email}</span>
                    </div>
                </div>
            ),
        },
        {
            key: 'phone',
            header: 'Phone',
            render: (value) => value || 'N/A',
        },
        {
            key: 'role',
            header: 'Role',
            render: (value) => <Badge variant="default">{value?.role || 'User'}</Badge>,
        },
        {
            key: 'status',
            header: 'Status',
            render: (value) => (
                <Badge variant={value === 'online' ? 'success' : 'default'}>
                    {value || 'Offline'}
                </Badge>
            ),
        },
        {
            key: 'actions',
            header: '',
            render: (_, row) => (
                <div style={{ display: 'flex', gap: '4px' }}>
                    <Button variant="ghost" size="sm" onClick={(e) => {
                        e.stopPropagation();
                        setEditingContact(row);
                        setIsModalOpen(true);
                    }}>
                        <Edit size={16} />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-danger" onClick={(e) => {
                        e.stopPropagation();
                        handleSingleDelete(row);
                    }}>
                        <Trash2 size={16} />
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <PageContainer
            title="Contacts"
            actions={
                <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        accept=".xlsx, .xls, .csv"
                        onChange={handleImportUser}
                    />
                    <Button variant="outline" icon={Download} onClick={handleDownloadTemplate}>
                        Download Template
                    </Button>
                    <Button variant="outline" icon={Upload} onClick={() => fileInputRef.current?.click()}>
                        Import Users
                    </Button>
                    <Button icon={Plus} onClick={() => { setEditingContact(null); setIsModalOpen(true); }}>
                        Add Contact
                    </Button>
                </div>
            }
        >
            <div className={`contacts-page ${detailContact ? 'show-detail' : ''}`}>
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

                    {/* Bulk Actions */}
                    {selectedRows.length > 0 && (
                        <div className="contacts-bulk-actions">
                            <span>{selectedRows.length} selected</span>
                            <Button variant="ghost" size="sm" className="danger" onClick={handleBulkDelete}>
                                <Trash2 size={16} /> Delete
                            </Button>
                        </div>
                    )}

                    <DataTable
                        columns={columns}
                        data={contacts}
                        selectable
                        selectedRows={selectedRows}
                        onSelectRow={handleSelectRow}
                        onSelectAll={handleSelectAll}
                        emptyMessage={loading ? "Loading contacts..." : "No contacts found"}
                        onRowClick={(row) => setDetailContact(row)}
                        rowKey="_id"
                    />

                    {/* Pagination */}
                    <div className="contacts-pagination">
                        <div className="pagination-left">
                            <span className="pagination-info">
                                Showing {pagination.total === 0 ? 0 : ((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} entries
                            </span>
                            <div className="page-size-selector">
                                <label>Show</label>
                                <select value={pagination.limit} onChange={handlePageSizeChange}>
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>
                                    <option value={50}>50</option>
                                    <option value={100}>100</option>
                                </select>
                                <label>entries</label>
                            </div>
                        </div>
                        <div className="pagination-controls">
                            <Button
                                variant="ghost"
                                size="sm"
                                disabled={pagination.page <= 1}
                                onClick={handlePrevPage}
                            >
                                Previous
                            </Button>
                            <div className="page-numbers">
                                {getPageNumbers().map((pageNum, idx) => (
                                    pageNum === '...' ? (
                                        <span key={`ellipsis-${idx}`} className="page-ellipsis">...</span>
                                    ) : (
                                        <button
                                            key={pageNum}
                                            className={`page-number ${pagination.page === pageNum ? 'active' : ''}`}
                                            onClick={() => handleGoToPage(pageNum)}
                                        >
                                            {pageNum}
                                        </button>
                                    )
                                ))}
                            </div>
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

                {/* Contact Detail */}
                {detailContact && (
                    <aside className="contact-detail">
                        <Card>
                            <div className="contact-detail-header">
                                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'flex-start' }}>
                                    <Button variant="ghost" size="sm" className="mobile-only" onClick={() => setDetailContact(null)}>
                                        <ArrowLeft size={16} />
                                    </Button>
                                    <Avatar name={`${detailContact.first_name} ${detailContact.last_name}`} size="xl" />
                                    <div style={{ display: 'flex', gap: '4px' }}>
                                        <Button variant="ghost" size="sm" onClick={() => { setEditingContact(detailContact); setIsModalOpen(true); }}>
                                            <Edit size={16} />
                                        </Button>
                                    </div>
                                </div>
                                <h2>{detailContact.first_name} {detailContact.last_name}</h2>
                                <span className="contact-role">{detailContact.role?.role || 'User'}</span>
                            </div>

                            <div className="contact-info-section">
                                <h4>Contact Information</h4>
                                <div className="contact-info-list">
                                    <div className="contact-info-item">
                                        <Mail size={16} />
                                        <a href={`mailto:${detailContact.email}`}>{detailContact.email}</a>
                                    </div>
                                    <div className="contact-info-item">
                                        <Phone size={16} />
                                        <span>{detailContact.phone}</span>
                                    </div>
                                    <div className="contact-info-item">
                                        <UserIcon size={16} />
                                        <span>{detailContact.gender || 'N/A'}</span>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </aside>
                )}
            </div>

            <ContactModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={handleCreateSuccess}
                contact={editingContact}
            />

            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => { setIsDeleteModalOpen(false); setSingleDeleteContact(null); }}
                title="Delete Contact"
                size="small"
                footer={
                    <>
                        <Button variant="ghost" onClick={() => { setIsDeleteModalOpen(false); setSingleDeleteContact(null); }} disabled={deleteLoading}>
                            Cancel
                        </Button>
                        <Button className="danger" onClick={confirmBulkDelete} disabled={deleteLoading}>
                            {deleteLoading ? 'Deleting...' : 'Delete'}
                        </Button>
                    </>
                }
            >
                {singleDeleteContact ? (
                    <p>Are you sure you want to delete {singleDeleteContact.first_name} {singleDeleteContact.last_name}? This action cannot be undone.</p>
                ) : (
                    <p>Are you sure you want to delete {selectedRows.length} {selectedRows.length === 1 ? 'contact' : 'contacts'}? This action cannot be undone.</p>
                )}
            </Modal>
        </PageContainer>
    );
}
