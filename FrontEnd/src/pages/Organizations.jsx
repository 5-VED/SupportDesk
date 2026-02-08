import { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    Building2,
    Globe,
    CheckCircle,
    XCircle,
    Edit,
    Trash2,
    ArrowLeft,
    Calendar,
    Settings,
    Share2
} from 'lucide-react';
import { Modal } from '../components/ui/Modal';
import { PageContainer } from '../components/layout/PageContainer';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { DataTable } from '../components/ui/DataTable';
import { Badge } from '../components/ui/Badge';
import { organizationService } from '../services/organization.service';
import { OrganizationModal } from './OrganizationModal';
import { toast } from 'react-hot-toast';
import './Organizations.css';

export function Organizations() {
    const [organizations, setOrganizations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [detailOrg, setDetailOrg] = useState(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [editingOrg, setEditingOrg] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [singleDeleteOrg, setSingleDeleteOrg] = useState(null);

    const fetchOrganizations = async () => {
        setLoading(true);
        try {
            const response = await organizationService.list();
            if (response.data) {
                setOrganizations(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch organizations:', error);
            toast.error('Failed to load organizations');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrganizations();
    }, []);

    // Filter organizations based on search
    const filteredOrgs = organizations.filter(org =>
        org.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        org.domains?.some(d => d.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const handleCreateSuccess = () => {
        fetchOrganizations();
        setIsModalOpen(false);
    };

    // Multi-select handlers
    const handleSelectRow = (id, checked) => {
        setSelectedRows(prev =>
            checked ? [...prev, id] : prev.filter(i => i !== id)
        );
    };

    const handleSelectAll = (checked) => {
        setSelectedRows(checked ? filteredOrgs.map(o => o._id) : []);
    };

    // Bulk delete
    const handleBulkDelete = () => {
        setIsDeleteModalOpen(true);
    };

    const confirmBulkDelete = async () => {
        setDeleteLoading(true);
        try {
            if (singleDeleteOrg) {
                await organizationService.delete(singleDeleteOrg._id);
                toast.success('Organization deleted successfully');
                if (detailOrg?._id === singleDeleteOrg._id) {
                    setDetailOrg(null);
                }
            } else {
                // Delete organizations one by one
                for (const id of selectedRows) {
                    await organizationService.delete(id);
                }
                toast.success(`${selectedRows.length} organizations deleted`);
                if (detailOrg && selectedRows.includes(detailOrg._id)) {
                    setDetailOrg(null);
                }
                setSelectedRows([]);
            }
            fetchOrganizations();
            setIsDeleteModalOpen(false);
            setSingleDeleteOrg(null);
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to delete organizations');
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleSingleDelete = (org) => {
        setSingleDeleteOrg(org);
        setIsDeleteModalOpen(true);
    };

    const getOrgInitials = (name) => {
        return name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'O';
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const columns = [
        {
            key: 'name',
            header: 'Organization',
            render: (_, row) => (
                <div className="org-name-cell">
                    <div className="org-icon">
                        {getOrgInitials(row.name)}
                    </div>
                    <div>
                        <span className="org-name">{row.name}</span>
                        <span className="org-domains">
                            {row.domains?.length > 0 ? row.domains.join(', ') : 'No domains'}
                        </span>
                    </div>
                </div>
            ),
        },
        {
            key: 'domains',
            header: 'Domains',
            render: (value) => (
                <span>{value?.length || 0} domain{value?.length !== 1 ? 's' : ''}</span>
            ),
        },
        {
            key: 'is_active',
            header: 'Status',
            render: (value) => (
                <Badge variant={value !== false ? 'success' : 'default'}>
                    {value !== false ? <><CheckCircle size={12} /> Active</> : <><XCircle size={12} /> Inactive</>}
                </Badge>
            ),
        },
        {
            key: 'createdAt',
            header: 'Created',
            render: (value) => formatDate(value),
        },
        {
            key: 'actions',
            header: '',
            render: (_, row) => (
                <div style={{ display: 'flex', gap: '4px' }}>
                    <Button variant="ghost" size="sm" onClick={(e) => {
                        e.stopPropagation();
                        setEditingOrg(row);
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
            title="Organizations"
            actions={
                <Button icon={Plus} onClick={() => { setEditingOrg(null); setIsModalOpen(true); }}>
                    Add Organization
                </Button>
            }
        >
            <div className={`organizations-page ${detailOrg ? 'show-detail' : ''}`}>
                {/* Organizations List */}
                <div className="organizations-list-section">
                    <div className="organizations-toolbar">
                        <div className="organizations-search">
                            <Search size={18} />
                            <input
                                type="text"
                                placeholder="Search organizations..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Bulk Actions */}
                    {selectedRows.length > 0 && (
                        <div className="organizations-bulk-actions">
                            <span>{selectedRows.length} selected</span>
                            <Button variant="ghost" size="sm" className="danger" onClick={handleBulkDelete}>
                                <Trash2 size={16} /> Delete
                            </Button>
                        </div>
                    )}

                    <DataTable
                        columns={columns}
                        data={filteredOrgs}
                        selectable
                        selectedRows={selectedRows}
                        onSelectRow={handleSelectRow}
                        onSelectAll={handleSelectAll}
                        emptyMessage={loading ? "Loading organizations..." : "No organizations found"}
                        onRowClick={(row) => setDetailOrg(row)}
                        rowKey="_id"
                    />

                    {/* Stats */}
                    <div className="organizations-pagination">
                        <span className="pagination-info">
                            {filteredOrgs.length} {filteredOrgs.length === 1 ? 'organization' : 'organizations'}
                        </span>
                    </div>
                </div>

                {/* Organization Detail */}
                {detailOrg && (
                    <aside className="org-detail">
                        <Card>
                            <div className="org-detail-header">
                                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'flex-start' }}>
                                    <Button variant="ghost" size="sm" className="mobile-only" onClick={() => setDetailOrg(null)}>
                                        <ArrowLeft size={16} />
                                    </Button>
                                    <div className="org-icon" style={{ width: '64px', height: '64px', fontSize: 'var(--font-size-xl)' }}>
                                        {getOrgInitials(detailOrg.name)}
                                    </div>
                                    <div style={{ display: 'flex', gap: '4px' }}>
                                        <Button variant="ghost" size="sm" onClick={() => { setEditingOrg(detailOrg); setIsModalOpen(true); }}>
                                            <Edit size={16} />
                                        </Button>
                                    </div>
                                </div>
                                <h2>{detailOrg.name}</h2>
                                <span className="org-status">
                                    {detailOrg.is_active !== false ? 'Active Organization' : 'Inactive Organization'}
                                </span>
                            </div>

                            <div className="org-info-section">
                                <h4>Domains</h4>
                                <div className="org-info-list">
                                    {detailOrg.domains?.length > 0 ? (
                                        <div className="domains-list">
                                            {detailOrg.domains.map(domain => (
                                                <span key={domain} className="domain-tag">
                                                    <Globe size={12} /> {domain}
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <span className="org-info-item">
                                            <Globe size={16} />
                                            <span>No domains configured</span>
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="org-info-section">
                                <h4>Settings</h4>
                                <div className="settings-list">
                                    <div className={`setting-item ${detailOrg.settings?.allow_external_sharing ? '' : 'disabled'}`}>
                                        <Share2 size={14} />
                                        <span>External Sharing {detailOrg.settings?.allow_external_sharing ? 'Enabled' : 'Disabled'}</span>
                                    </div>
                                    <div className="setting-item">
                                        <Settings size={14} />
                                        <span>Locale: {detailOrg.settings?.default_locale || 'en-US'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="org-info-section">
                                <h4>Info</h4>
                                <div className="org-info-list">
                                    <div className="org-info-item">
                                        <Calendar size={16} />
                                        <span>Created {formatDate(detailOrg.createdAt)}</span>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </aside>
                )}
            </div>

            <OrganizationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={handleCreateSuccess}
                organization={editingOrg}
            />

            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => { setIsDeleteModalOpen(false); setSingleDeleteOrg(null); }}
                title="Delete Organization"
                size="small"
                footer={
                    <>
                        <Button variant="ghost" onClick={() => { setIsDeleteModalOpen(false); setSingleDeleteOrg(null); }} disabled={deleteLoading}>
                            Cancel
                        </Button>
                        <Button className="danger" onClick={confirmBulkDelete} disabled={deleteLoading}>
                            {deleteLoading ? 'Deleting...' : 'Delete'}
                        </Button>
                    </>
                }
            >
                {singleDeleteOrg ? (
                    <p>Are you sure you want to delete "{singleDeleteOrg.name}"? This action cannot be undone.</p>
                ) : (
                    <p>Are you sure you want to delete {selectedRows.length} {selectedRows.length === 1 ? 'organization' : 'organizations'}? This action cannot be undone.</p>
                )}
            </Modal>
        </PageContainer>
    );
}
