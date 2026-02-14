const SlaPolicyRepository = require('../Repository/SlaPolicy.repository');
const messages = require('../Constants/messages');
const { HTTP_CODES } = require('../Constants/enums');

const createPolicy = async (payload) => {
    // Logic to ensure position is correct (add to end)
    const count = await SlaPolicyRepository.count({ is_deleted: false });
    if (!payload.position) {
        payload.position = count; // 0-indexed, so count is next position
    }

    const result = await SlaPolicyRepository.create(payload);

    return {
        message: 'SLA Policy created successfully',
        data: result,
    };
};

const getPolicy = async (id) => {
    const policy = await SlaPolicyRepository.findById(id);
    if (!policy || policy.is_deleted) {
        throw {
            statusCode: HTTP_CODES.NOT_FOUND,
            message: 'SLA Policy not found',
        };
    }
    return policy;
};

const listPolicies = async (query = {}) => {
    const filter = { is_deleted: false };
    if (query.search) {
        filter.title = { $regex: query.search, $options: 'i' };
    }

    const sort = { position: 1 }; // Default sort by position

    const policies = await SlaPolicyRepository.findAll(filter, sort);
    return {
        message: 'SLA Policies retrieved successfully',
        data: policies
    };
};

const updatePolicy = async (id, payload) => {
    const existing = await SlaPolicyRepository.findById(id);
    if (!existing || existing.is_deleted) {
        throw {
            statusCode: HTTP_CODES.NOT_FOUND,
            message: 'SLA Policy not found',
        };
    }

    const result = await SlaPolicyRepository.updateById(id, payload);
    return {
        message: 'SLA Policy updated successfully',
        data: result,
    };
};

const deletePolicy = async (id) => {
    const existing = await SlaPolicyRepository.findById(id);
    if (!existing) {
        throw {
            statusCode: HTTP_CODES.NOT_FOUND,
            message: 'SLA Policy not found',
        };
    }

    await SlaPolicyRepository.deleteById(id);
    return {
        message: 'SLA Policy deleted successfully',
        data: {}
    };
};

const reorderPolicies = async (orderedIds) => {
    // orderedIds is an array of strings ["id1", "id2", "id3"] representing new order
    if (!Array.isArray(orderedIds)) {
        throw {
            statusCode: HTTP_CODES.BAD_REQUEST,
            message: 'Invalid input for reordering',
        };
    }

    const promises = orderedIds.map((id, index) => {
        return SlaPolicyRepository.updateById(id, { position: index });
    });

    await Promise.all(promises);

    return {
        message: 'SLA Policies reordered successfully',
        data: {}
    };
};



// Helper: Check if ticket matches policy filter
const ticketMatchesPolicy = (ticket, policy) => {
    if (!policy.filter || policy.filter.size === 0) return true; // Default policy (no filter) matches everything if it's last

    // Basic matching for now
    // policy.filter is a Mongoose Map, so use .get()
    const priorityFilter = policy.filter.get('priority');
    if (priorityFilter && ticket.priority !== priorityFilter) return false;

    const groupFilter = policy.filter.get('group_id');
    if (groupFilter && String(ticket.group_id) !== String(groupFilter)) return false;

    const typeFilter = policy.filter.get('type');
    if (typeFilter && ticket.type !== typeFilter) return false;

    const sourceFilter = policy.filter.get('source'); // or channel
    if (sourceFilter && ticket.channel !== sourceFilter) return false;

    return true;
};

const calculateSlaTargets = async (ticket) => {
    const policies = await SlaPolicyRepository.findAll({ is_deleted: false }, { position: 1 });

    let appliedPolicy = null;
    for (const policy of policies) {
        if (ticketMatchesPolicy(ticket, policy)) {
            appliedPolicy = policy;
            break;
        }
    }

    if (!appliedPolicy) return null;

    // Find metric for ticket priority
    const metric = appliedPolicy.policy_metrics.find(m => m.priority === ticket.priority);
    if (!metric) return { policy_id: appliedPolicy._id }; // Policy applies but no specific metric for this priority

    const now = new Date();

    // Simple calculation: add minutes to now. 
    // TODO: Business hours calculation (complex, requires BusinessHours model)
    // For now use 24/7 logic

    let responseDue = null;
    let resolveDue = null;

    // Usually metrics list targets. We need to parse.
    // Assuming metric structure: [{ priority: 'high', first_response_minutes: 60, resolution_minutes: 240 }]
    // But the model defined:  { priority: String, target: String, target_minutes: Number } 
    // This implies one entry per target type per priority? Or strictly one target type?
    // Let's check model again. 
    // policy_metrics: [{ priority: String, target: String, target_minutes: Number }]
    // target is likely 'first_reply_time' or 'resolution_time'

    const responseMetric = appliedPolicy.policy_metrics.find(m => m.priority === ticket.priority && m.target === 'first_reply_time');
    const resolveMetric = appliedPolicy.policy_metrics.find(m => m.priority === ticket.priority && m.target === 'resolution_time'); // or 'next_reply_time'

    if (responseMetric) {
        responseDue = new Date(now.getTime() + responseMetric.target_minutes * 60000);
    }

    if (resolveMetric) {
        resolveDue = new Date(now.getTime() + resolveMetric.target_minutes * 60000);
    }

    return {
        policy_id: appliedPolicy._id,
        response_due_at: responseDue,
        resolve_due_at: resolveDue
    };
};

module.exports = {
    createPolicy,
    getPolicy,
    listPolicies,
    updatePolicy,
    deletePolicy,
    reorderPolicies,
    calculateSlaTargets
};
