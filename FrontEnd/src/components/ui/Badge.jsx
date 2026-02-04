import './Badge.css';

const variantMap = {
    default: 'badge-default',
    primary: 'badge-primary',
    success: 'badge-success',
    warning: 'badge-warning',
    danger: 'badge-danger',
    info: 'badge-info',
};

export function Badge({
    children,
    variant = 'default',
    size = 'md',
    dot = false,
    className = '',
    ...props
}) {
    return (
        <span
            className={`badge badge-${size} ${variantMap[variant]} ${className}`}
            {...props}
        >
            {dot && <span className="badge-dot" />}
            {children}
        </span>
    );
}

// Status-specific badges for convenience
export function StatusBadge({ status }) {
    const statusConfig = {
        open: { label: 'Open', variant: 'primary' },
        pending: { label: 'Pending', variant: 'warning' },
        resolved: { label: 'Resolved', variant: 'success' },
        closed: { label: 'Closed', variant: 'default' },
        overdue: { label: 'Overdue', variant: 'danger' },
    };

    const config = statusConfig[status] || statusConfig.open;

    return <Badge variant={config.variant}>{config.label}</Badge>;
}

export function PriorityBadge({ priority }) {
    const priorityConfig = {
        low: { label: 'Low', variant: 'default' },
        medium: { label: 'Medium', variant: 'info' },
        high: { label: 'High', variant: 'warning' },
        urgent: { label: 'Urgent', variant: 'danger' },
    };

    const config = priorityConfig[priority] || priorityConfig.low;

    return <Badge variant={config.variant}>{config.label}</Badge>;
}
