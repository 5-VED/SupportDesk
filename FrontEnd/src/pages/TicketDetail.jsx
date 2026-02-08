import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Send,
    Paperclip,
    MoreHorizontal,
    Clock,
    User,
    Tag,
    MessageSquare,
    Lock,
    RefreshCw
} from 'lucide-react';
import { PageContainer } from '../components/layout/PageContainer';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { StatusBadge, PriorityBadge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { Select, Textarea } from '../components/ui/Input';
import { ticketService } from '../services/ticket.service';
import { userService } from '../services/user.service';
import { getStatusOptions, getPriorityOptions } from '../utils/ticketConstants';
import { toast } from 'react-hot-toast';
import './TicketDetail.css';

export function TicketDetail() {
    const { ticketId } = useParams();
    const navigate = useNavigate();
    const [replyText, setReplyText] = useState('');
    const [isInternal, setIsInternal] = useState(false);
    const [ticket, setTicket] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [agents, setAgents] = useState([]);

    // Fetch ticket details and comments
    const fetchTicketData = async () => {
        setLoading(true);
        try {
            const [ticketResponse, commentsResponse] = await Promise.all([
                ticketService.getDetails(ticketId),
                ticketService.getComments(ticketId),
            ]);

            if (ticketResponse.success) {
                setTicket(ticketResponse.data);
            }

            if (commentsResponse.success) {
                setComments(commentsResponse.data || []);
            }
        } catch (error) {
            console.error('Failed to fetch ticket:', error);
            toast.error('Failed to load ticket details');
        } finally {
            setLoading(false);
        }
    };

    // Fetch agents for assignment dropdown
    const fetchAgents = async () => {
        try {
            const response = await userService.getAgents();
            if (response.success && response.data) {
                const agentOptions = response.data.map(agent => ({
                    value: agent._id,
                    label: `${agent.first_name} ${agent.last_name}`,
                }));
                setAgents(agentOptions);
            }
        } catch (error) {
            console.error('Failed to fetch agents:', error);
        }
    };

    useEffect(() => {
        fetchTicketData();
        fetchAgents();
    }, [ticketId]);

    const handleSubmitReply = async (e) => {
        e.preventDefault();
        if (!replyText.trim()) return;

        setSubmitting(true);
        try {
            const response = await ticketService.addComment(ticketId, {
                body: replyText,
                public: !isInternal,
            });

            if (response.success) {
                toast.success(isInternal ? 'Note added' : 'Reply sent');
                setReplyText('');
                fetchTicketData(); // Refresh comments
            }
        } catch (error) {
            console.error('Failed to add comment:', error);
            toast.error('Failed to send reply');
        } finally {
            setSubmitting(false);
        }
    };

    const handleStatusChange = async (e) => {
        const newStatus = e.target.value;
        try {
            await ticketService.updateStatus(ticketId, newStatus);
            setTicket(prev => ({ ...prev, status: newStatus }));
            toast.success('Status updated');
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const handlePriorityChange = async (e) => {
        const newPriority = e.target.value;
        try {
            await ticketService.updatePriority(ticketId, newPriority);
            setTicket(prev => ({ ...prev, priority: newPriority }));
            toast.success('Priority updated');
        } catch (error) {
            toast.error('Failed to update priority');
        }
    };

    const handleAssigneeChange = async (e) => {
        const newAssignee = e.target.value;
        try {
            await ticketService.assignTicket(ticketId, newAssignee);
            toast.success('Ticket assigned');
            fetchTicketData(); // Refresh to get updated assignee info
        } catch (error) {
            toast.error('Failed to assign ticket');
        }
    };

    const handleResolveTicket = async () => {
        try {
            await ticketService.updateStatus(ticketId, 'solved');
            setTicket(prev => ({ ...prev, status: 'solved' }));
            toast.success('Ticket resolved');
        } catch (error) {
            toast.error('Failed to resolve ticket');
        }
    };

    if (loading) {
        return (
            <PageContainer title="Loading...">
                <div className="loading-state">Loading ticket details...</div>
            </PageContainer>
        );
    }

    if (!ticket) {
        return (
            <PageContainer title="Ticket Not Found">
                <div className="error-state">
                    <p>The requested ticket could not be found.</p>
                    <Button onClick={() => navigate('/tickets')}>Back to Tickets</Button>
                </div>
            </PageContainer>
        );
    }

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getRequesterName = () => {
        if (ticket.requester_id?.first_name) {
            return `${ticket.requester_id.first_name} ${ticket.requester_id.last_name}`;
        }
        return 'Unknown';
    };

    const getAssigneeName = () => {
        if (ticket.assignee_id?.first_name) {
            return `${ticket.assignee_id.first_name} ${ticket.assignee_id.last_name}`;
        }
        return null;
    };

    return (
        <PageContainer
            title={
                <div className="ticket-header">
                    <Link to="/tickets" className="back-link">
                        <ArrowLeft size={20} />
                    </Link>
                    <div className="ticket-header-info">
                        <span className="ticket-id">#{ticketId?.slice(-6).toUpperCase()}</span>
                        <h1 className="ticket-subject">{ticket.subject}</h1>
                    </div>
                </div>
            }
            actions={
                <>
                    <Button variant="ghost" icon={RefreshCw} onClick={fetchTicketData} />
                    <Button variant="secondary" icon={MoreHorizontal} />
                    <Button onClick={handleResolveTicket} disabled={ticket.status === 'solved'}>
                        {ticket.status === 'solved' ? 'Resolved' : 'Resolve Ticket'}
                    </Button>
                </>
            }
        >
            <div className="ticket-detail">
                {/* Main Content */}
                <div className="ticket-main">
                    {/* Original Description */}
                    <Card padding="none" className="conversation-card">
                        <div className="conversation-list">
                            {/* Original ticket description as first message */}
                            <div className="conversation-message customer">
                                <div className="message-header">
                                    <Avatar name={getRequesterName()} size="sm" />
                                    <div className="message-meta">
                                        <span className="message-author">{getRequesterName()}</span>
                                        <span className="message-time">{formatDate(ticket.createdAt)}</span>
                                        <span className="message-via">via {ticket.channel || 'Web'}</span>
                                    </div>
                                </div>
                                <div className="message-content">
                                    <strong>{ticket.subject}</strong>
                                    <p style={{ marginTop: '8px', whiteSpace: 'pre-wrap' }}>{ticket.description}</p>
                                </div>
                            </div>

                            {/* Comments/Replies */}
                            {comments.map((comment) => (
                                <div
                                    key={comment._id}
                                    className={`conversation-message ${comment.public === false ? 'internal' : (comment.author_id?._id === ticket.requester_id?._id ? 'customer' : 'agent')}`}
                                >
                                    <div className="message-header">
                                        <Avatar name={comment.author_id?.first_name ? `${comment.author_id.first_name} ${comment.author_id.last_name}` : 'Unknown'} size="sm" />
                                        <div className="message-meta">
                                            <span className="message-author">
                                                {comment.author_id?.first_name ? `${comment.author_id.first_name} ${comment.author_id.last_name}` : 'Unknown'}
                                            </span>
                                            <span className="message-time">{formatDate(comment.createdAt)}</span>
                                        </div>
                                        {comment.public === false && (
                                            <span className="internal-badge">
                                                <Lock size={12} />
                                                Internal Note
                                            </span>
                                        )}
                                    </div>
                                    <div className="message-content">
                                        {comment.body}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Reply Form */}
                        <form className="reply-form" onSubmit={handleSubmitReply}>
                            <div className="reply-tabs">
                                <button
                                    type="button"
                                    className={`reply-tab ${!isInternal ? 'active' : ''}`}
                                    onClick={() => setIsInternal(false)}
                                >
                                    <MessageSquare size={16} />
                                    Reply
                                </button>
                                <button
                                    type="button"
                                    className={`reply-tab ${isInternal ? 'active' : ''}`}
                                    onClick={() => setIsInternal(true)}
                                >
                                    <Lock size={16} />
                                    Internal Note
                                </button>
                            </div>
                            <Textarea
                                placeholder={isInternal ? "Add an internal note..." : "Type your reply..."}
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                rows={4}
                            />
                            <div className="reply-actions">
                                <Button variant="ghost" icon={Paperclip} type="button">
                                    Attach
                                </Button>
                                <Button type="submit" icon={Send} disabled={!replyText.trim() || submitting}>
                                    {submitting ? 'Sending...' : (isInternal ? 'Add Note' : 'Send Reply')}
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>

                {/* Sidebar */}
                <aside className="ticket-sidebar">
                    {/* Properties */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Properties</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="property-list">
                                <div className="property-item">
                                    <label>Status</label>
                                    <Select
                                        options={getStatusOptions()}
                                        value={ticket.status}
                                        onChange={handleStatusChange}
                                    />
                                </div>
                                <div className="property-item">
                                    <label>Priority</label>
                                    <Select
                                        options={getPriorityOptions()}
                                        value={ticket.priority}
                                        onChange={handlePriorityChange}
                                    />
                                </div>
                                <div className="property-item">
                                    <label>Assigned To</label>
                                    <Select
                                        options={[{ value: '', label: 'Unassigned' }, ...agents]}
                                        value={ticket.assignee_id?._id || ''}
                                        onChange={handleAssigneeChange}
                                    />
                                </div>
                                <div className="property-item">
                                    <label>Type</label>
                                    <span className="property-value" style={{ textTransform: 'capitalize' }}>{ticket.type || 'Question'}</span>
                                </div>
                                <div className="property-item">
                                    <label>Channel</label>
                                    <span className="property-value" style={{ textTransform: 'capitalize' }}>{ticket.channel || 'Web'}</span>
                                </div>
                                <div className="property-item">
                                    <label>Created</label>
                                    <span className="property-value">{formatDate(ticket.createdAt)}</span>
                                </div>
                                <div className="property-item">
                                    <label>Updated</label>
                                    <span className="property-value">{formatDate(ticket.updatedAt)}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Tags */}
                    {ticket.tags && ticket.tags.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Tags</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="tags-list">
                                    {ticket.tags.map((tag, index) => (
                                        <span key={index} className="tag-badge">{tag}</span>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Requester Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Requester</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="customer-info">
                                <div className="customer-header">
                                    <Avatar name={getRequesterName()} size="lg" />
                                    <div>
                                        <h4>{getRequesterName()}</h4>
                                        {ticket.requester_id?.email && (
                                            <span>{ticket.requester_id.email}</span>
                                        )}
                                    </div>
                                </div>
                                {ticket.requester_id?.phone && (
                                    <div className="customer-details">
                                        <div className="detail-item">
                                            <label>Phone</label>
                                            <span>{ticket.requester_id.phone}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </aside>
            </div>
        </PageContainer>
    );
}
