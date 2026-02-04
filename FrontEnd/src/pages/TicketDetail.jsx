import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    ArrowLeft,
    Send,
    Paperclip,
    MoreHorizontal,
    Clock,
    User,
    Tag,
    MessageSquare,
    Lock
} from 'lucide-react';
import { PageContainer } from '../components/layout/PageContainer';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { StatusBadge, PriorityBadge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { Select, Textarea } from '../components/ui/Input';
import './TicketDetail.css';

// Mock data
const ticketData = {
    id: 'TKT-1234',
    subject: 'Cannot login to my account',
    status: 'open',
    priority: 'high',
    channel: 'Email',
    created: '2024-01-15 10:30 AM',
    updated: '2024-01-15 02:45 PM',
    sla: {
        firstResponse: { target: '1 hour', status: 'met' },
        resolution: { target: '24 hours', remaining: '18 hours' },
    },
    customer: {
        name: 'John Smith',
        email: 'john.smith@example.com',
        phone: '+1 (555) 123-4567',
        company: 'Acme Corp',
        ticketCount: 5,
    },
    agent: {
        name: 'Sarah Chen',
        email: 'sarah.chen@supportdesk.com',
    },
};

const conversation = [
    {
        id: 1,
        type: 'customer',
        author: 'John Smith',
        content: `Hi there,

I'm having trouble logging into my account. When I enter my credentials, I get an error message saying "Invalid credentials" even though I'm 100% sure my password is correct.

I've tried resetting my password twice but the issue persists. This is blocking me from accessing important data.

Please help!

Thanks,
John`,
        timestamp: '2024-01-15 10:30 AM',
        via: 'Email',
    },
    {
        id: 2,
        type: 'agent',
        author: 'Sarah Chen',
        content: `Hi John,

Thank you for reaching out! I'm sorry to hear you're having trouble logging in.

I've checked your account and I can see there were multiple failed login attempts. For security reasons, your account may have been temporarily locked.

Could you please try the following:
1. Clear your browser cache and cookies
2. Wait 15 minutes before attempting to log in again
3. Use the "Forgot Password" link to reset your password one more time

Let me know if this helps!

Best regards,
Sarah`,
        timestamp: '2024-01-15 10:45 AM',
        via: 'Email',
    },
    {
        id: 3,
        type: 'internal',
        author: 'Sarah Chen',
        content: 'Checked the logs - account was locked after 5 failed attempts. Will unlock manually if customer still has issues.',
        timestamp: '2024-01-15 10:47 AM',
    },
    {
        id: 4,
        type: 'customer',
        author: 'John Smith',
        content: `Hi Sarah,

I tried all the steps but still getting the same error. I even tried from a different browser and different device.

This is urgent as I have a presentation tomorrow and need to access the reports.

John`,
        timestamp: '2024-01-15 02:30 PM',
        via: 'Email',
    },
];

const statusOptions = [
    { value: 'open', label: 'Open' },
    { value: 'pending', label: 'Pending' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'closed', label: 'Closed' },
];

const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' },
];

export function TicketDetail() {
    const { ticketId } = useParams();
    const [replyText, setReplyText] = useState('');
    const [isInternal, setIsInternal] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle reply submission
        setReplyText('');
    };

    return (
        <PageContainer
            title={
                <div className="ticket-header">
                    <Link to="/tickets" className="back-link">
                        <ArrowLeft size={20} />
                    </Link>
                    <div className="ticket-header-info">
                        <span className="ticket-id">{ticketData.id}</span>
                        <h1 className="ticket-subject">{ticketData.subject}</h1>
                    </div>
                </div>
            }
            actions={
                <>
                    <Button variant="secondary" icon={MoreHorizontal} />
                    <Button>Resolve Ticket</Button>
                </>
            }
        >
            <div className="ticket-detail">
                {/* Main Content */}
                <div className="ticket-main">
                    {/* Conversation */}
                    <Card padding="none" className="conversation-card">
                        <div className="conversation-list">
                            {conversation.map((message) => (
                                <div
                                    key={message.id}
                                    className={`conversation-message ${message.type}`}
                                >
                                    <div className="message-header">
                                        <Avatar name={message.author} size="sm" />
                                        <div className="message-meta">
                                            <span className="message-author">{message.author}</span>
                                            <span className="message-time">{message.timestamp}</span>
                                            {message.via && <span className="message-via">via {message.via}</span>}
                                        </div>
                                        {message.type === 'internal' && (
                                            <span className="internal-badge">
                                                <Lock size={12} />
                                                Internal Note
                                            </span>
                                        )}
                                    </div>
                                    <div className="message-content">
                                        {message.content}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Reply Form */}
                        <form className="reply-form" onSubmit={handleSubmit}>
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
                                <Button type="submit" icon={Send} disabled={!replyText.trim()}>
                                    {isInternal ? 'Add Note' : 'Send Reply'}
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
                                    <Select options={statusOptions} value={ticketData.status} onChange={() => { }} />
                                </div>
                                <div className="property-item">
                                    <label>Priority</label>
                                    <Select options={priorityOptions} value={ticketData.priority} onChange={() => { }} />
                                </div>
                                <div className="property-item">
                                    <label>Assigned To</label>
                                    <div className="property-value">
                                        <Avatar name={ticketData.agent.name} size="xs" />
                                        <span>{ticketData.agent.name}</span>
                                    </div>
                                </div>
                                <div className="property-item">
                                    <label>Channel</label>
                                    <span className="property-value">{ticketData.channel}</span>
                                </div>
                                <div className="property-item">
                                    <label>Created</label>
                                    <span className="property-value">{ticketData.created}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* SLA */}
                    <Card>
                        <CardHeader>
                            <CardTitle>SLA Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="sla-info">
                                <div className="sla-item">
                                    <Clock size={16} />
                                    <div>
                                        <span className="sla-label">First Response</span>
                                        <span className="sla-status met">✓ Met ({ticketData.sla.firstResponse.target})</span>
                                    </div>
                                </div>
                                <div className="sla-item">
                                    <Clock size={16} />
                                    <div>
                                        <span className="sla-label">Resolution Time</span>
                                        <span className="sla-status pending">{ticketData.sla.resolution.remaining} remaining</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Customer */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Customer</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="customer-info">
                                <div className="customer-header">
                                    <Avatar name={ticketData.customer.name} size="lg" />
                                    <div>
                                        <h4>{ticketData.customer.name}</h4>
                                        <span>{ticketData.customer.company}</span>
                                    </div>
                                </div>
                                <div className="customer-details">
                                    <div className="detail-item">
                                        <label>Email</label>
                                        <a href={`mailto:${ticketData.customer.email}`}>{ticketData.customer.email}</a>
                                    </div>
                                    <div className="detail-item">
                                        <label>Phone</label>
                                        <span>{ticketData.customer.phone}</span>
                                    </div>
                                    <div className="detail-item">
                                        <label>Total Tickets</label>
                                        <span>{ticketData.customer.ticketCount}</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </aside>
            </div>
        </PageContainer>
    );
}
