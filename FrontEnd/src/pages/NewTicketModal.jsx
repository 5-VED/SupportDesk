import { useState } from 'react';
import { Modal } from '../components/ui/Modal';
import { Input, Textarea, Select } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import './NewTicketModal.css';

const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'normal', label: 'Normal' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' },
];

const typeOptions = [
    { value: 'question', label: 'Question' },
    { value: 'incident', label: 'Incident' },
    { value: 'problem', label: 'Problem' },
    { value: 'task', label: 'Task' },
];

// Mock assignees - in production, fetch from API
const assigneeOptions = [
    { value: 'agent1', label: 'Sarah Chen' },
    { value: 'agent2', label: 'Mike Johnson' },
    { value: 'agent3', label: 'Emily Davis' },
    { value: 'agent4', label: 'Alex Kim' },
];

// Mock groups - in production, fetch from API
const groupOptions = [
    { value: 'group1', label: 'Support Team' },
    { value: 'group2', label: 'Technical Team' },
    { value: 'group3', label: 'Billing Team' },
    { value: 'group4', label: 'Sales Team' },
];

export function NewTicketModal({ isOpen, onClose, onSubmit }) {
    const [formData, setFormData] = useState({
        subject: '',
        description: '',
        priority: 'normal',
        type: 'question',
        assignee_id: '',
        group_id: '',
        tags: '',
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.subject.trim()) {
            newErrors.subject = 'Subject is required';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Description is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            // Process tags - split by comma and trim
            const processedData = {
                ...formData,
                tags: formData.tags
                    ? formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
                    : [],
            };

            await onSubmit(processedData);

            // Reset form and close modal
            setFormData({
                subject: '',
                description: '',
                priority: 'normal',
                type: 'question',
                assignee_id: '',
                group_id: '',
                tags: '',
            });
            setErrors({});
            onClose();
        } catch (error) {
            console.error('Error creating ticket:', error);
            setErrors({ submit: 'Failed to create ticket. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        // Reset form and close
        setFormData({
            subject: '',
            description: '',
            priority: 'normal',
            type: 'question',
            assignee_id: '',
            group_id: '',
            tags: '',
        });
        setErrors({});
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleCancel}
            title="Create New Ticket"
            size="large"
            footer={
                <>
                    <Button
                        variant="ghost"
                        onClick={handleCancel}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Creating...' : 'Create Ticket'}
                    </Button>
                </>
            }
        >
            <form onSubmit={handleSubmit} className="new-ticket-form">
                {errors.submit && (
                    <div className="form-error-banner">
                        {errors.submit}
                    </div>
                )}

                <div className="form-section">
                    <h3 className="form-section-title">Basic Information</h3>

                    <Input
                        label="Subject"
                        placeholder="Brief summary of the issue"
                        value={formData.subject}
                        onChange={(e) => handleChange('subject', e.target.value)}
                        error={errors.subject}
                        required
                    />

                    <Textarea
                        label="Description"
                        placeholder="Provide detailed information about the issue..."
                        value={formData.description}
                        onChange={(e) => handleChange('description', e.target.value)}
                        error={errors.description}
                        rows={6}
                        required
                    />
                </div>

                <div className="form-section">
                    <h3 className="form-section-title">Classification</h3>

                    <div className="form-row">
                        <Select
                            label="Priority"
                            options={priorityOptions}
                            value={formData.priority}
                            onChange={(e) => handleChange('priority', e.target.value)}
                            placeholder="Select priority"
                        />

                        <Select
                            label="Type"
                            options={typeOptions}
                            value={formData.type}
                            onChange={(e) => handleChange('type', e.target.value)}
                            placeholder="Select type"
                        />
                    </div>
                </div>

                <div className="form-section">
                    <h3 className="form-section-title">Assignment (Optional)</h3>

                    <div className="form-row">
                        <Select
                            label="Assign To"
                            options={assigneeOptions}
                            value={formData.assignee_id}
                            onChange={(e) => handleChange('assignee_id', e.target.value)}
                            placeholder="Select assignee"
                        />

                        <Select
                            label="Group"
                            options={groupOptions}
                            value={formData.group_id}
                            onChange={(e) => handleChange('group_id', e.target.value)}
                            placeholder="Select group"
                        />
                    </div>
                </div>

                <div className="form-section">
                    <h3 className="form-section-title">Additional Information (Optional)</h3>

                    <Input
                        label="Tags"
                        placeholder="Enter tags separated by commas (e.g., billing, urgent, bug)"
                        value={formData.tags}
                        onChange={(e) => handleChange('tags', e.target.value)}
                        hint="Separate multiple tags with commas"
                    />
                </div>
            </form>
        </Modal>
    );
}
