const UserRepository = require('../Repository/User.repository');
const { compare, hash } = require('bcrypt');
const { JWT_SECRET } = require('../Config/config');
const jwt = require('jsonwebtoken');
const messages = require('../Constants/messages');
const { HTTP_CODES } = require('../Constants/enums');
const { kafkaProducer } = require('../Config/Kafka/Producer');
const XLSX = require('xlsx');
const TicketRepository = require('../Repository/Ticket.repository');

const signup = async (payload) => {
    const existingUser = await UserRepository.findUserByEmailOrPhone(
        payload.email,
        payload.phone
    );

    if (existingUser) {
        throw {
            statusCode: HTTP_CODES.BAD_REQUEST,
            message: messages.USER_ALREADY_EXISTS,
        };
    }

    if (!payload.role) {
        const userRole = await UserRepository.findRoleByType('User');
        if (userRole) {
            payload.role = userRole._id;
        }
    }

    const result = await UserRepository.createUser(payload);

    await kafkaProducer('user-signup', 0, {
        user_id: result._id,
        email: result.email,
    });

    return {
        message: messages.USER_CREATED_SUCCESS,
        data: result,
    };
};

const login = async (email, password, userAgentInfo) => {
    const user = await UserRepository.findUserByEmail(email);

    if (!user) {
        throw {
            statusCode: HTTP_CODES.NOT_FOUND,
            message: messages.USER_NOT_REGISTERED,
        };
    }

    const isPasswordCorrect = await compare(password, user.password);

    if (!isPasswordCorrect) {
        throw {
            statusCode: HTTP_CODES.UNAUTHORIZED,
            message: messages.INCORRECT_PASSWORD,
        };
    }

    const token = jwt.sign(
        { email, _id: user._id, role: user.role },
        JWT_SECRET,
        {
            expiresIn: '2d',
        }
    );

    if (userAgentInfo) {
        const payload = {
            user_id: user._id,
            browser: {
                name: userAgentInfo.browser?.name,
                version: userAgentInfo.browser?.version,
                type: userAgentInfo.browser?.type,
            },
            os: {
                name: userAgentInfo.os?.name,
                platform: userAgentInfo.os?.platform,
                version: userAgentInfo.os?.version,
                type: userAgentInfo.os?.type,
            },
            device: {
                type: userAgentInfo.device?.type,
                isBot: Boolean(userAgentInfo.device?.isBot),
            },
            source: userAgentInfo.source,
            last_login: new Date(),
            is_current: true,
        };

        await UserRepository.createUserAgent(payload);
    }

    return {
        message: messages.USER_LOGIN_SUCCESS,
        data: {
            user,
            token,
        },
    };
};

const disableUser = async (userId) => {
    const result = await UserRepository.updateUserById(
        userId,
        { is_active: false }
    );

    if (!result) {
        throw {
            statusCode: HTTP_CODES.BAD_REQUEST,
            message: messages.USER_DISABLE_ERROR,
        };
    }

    return {
        message: messages.USER_DISABLED_SUCCESS,
        data: result,
    };
};

const addAttachments = async (attachments) => {
    if (!attachments || !Array.isArray(attachments)) {
        throw {
            statusCode: HTTP_CODES.BAD_REQUEST,
            message: messages.EXTENSION_NOT_FOUND,
        };
    }

    const promises = attachments.map(async (element) => {
        let payload = {};
        payload['file_name'] = element?.originalname;
        payload['file_type'] = element?.mimetype;
        payload['file_size'] = Number(element?.size) / 1024 + ' Kb';
        payload['file_url'] = element?.path;
        payload['uploaded_at'] = element?.uploaded_at || new Date(); // added date just in case
        return await UserRepository.createAttachment(payload);
    });

    await Promise.all(promises);

    return {
        message: messages.ATTACHMENTS_ADDED_SUCCESS,
        data: {},
    };
};

const removeAttachments = async (attachmentId) => {
    const result = await UserRepository.findAttachmentById(attachmentId);

    if (!result) {
        throw {
            statusCode: HTTP_CODES.NOT_FOUND,
            message: messages.ATTACHMENT_NOT_FOUND,
        };
    }

    await UserRepository.deleteAttachmentById(attachmentId);

    return {
        message: messages.ATTACHMENT_REMOVED_SUCCESS,
        data: {},
    };
};

const list = async (query) => {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const skip = (page - 1) * limit;

    // Default filter: active users, not deleted
    const filter = {
        is_deleted: { $ne: true }
        // We might want to include is_active: true? 
        // Admin might want to see inactive users.
    };

    if (query.search) {
        filter.$or = [
            { first_name: { $regex: query.search, $options: 'i' } },
            { last_name: { $regex: query.search, $options: 'i' } },
            { email: { $regex: query.search, $options: 'i' } },
        ];
    }

    if (query.role) {
        const roleDoc = await UserRepository.findRoleByType(query.role);
        if (roleDoc) {
            filter.role = roleDoc._id;
        } else {
            // If query.role is an ID (24 chars hex), use it directly
            if (/^[0-9a-fA-F]{24}$/.test(query.role)) {
                filter.role = query.role;
            }
        }
    }

    const users = await UserRepository.findAllUsers(filter, skip, limit);
    const total = await UserRepository.countUsers(filter);

    return {
        users,
        pagination: {
            total,
            page,
            totalPages: Math.ceil(total / limit),
            limit
        }
    };
};

const getById = async (id) => {
    const user = await UserRepository.findUserById(id);
    if (!user) {
        throw {
            statusCode: HTTP_CODES.NOT_FOUND,
            message: messages.USER_NOT_FOUND,
        };
    }
    return user;
};

const update = async (id, payload) => {
    const user = await UserRepository.findUserById(id);
    if (!user) {
        throw {
            statusCode: HTTP_CODES.NOT_FOUND,
            message: messages.USER_NOT_FOUND,
        };
    }

    // If email or phone is being updated, check for duplicates
    if (payload.email || payload.phone) {
        const existingUser = await UserRepository.findUserByEmailOrPhone(
            payload.email || user.email,
            payload.phone || user.phone,
            id
        );

        if (existingUser) {
            throw {
                statusCode: HTTP_CODES.BAD_REQUEST,
                message: messages.USER_ALREADY_EXISTS,
            };
        }
    }

    const result = await UserRepository.updateUserById(id, payload);
    return result;
};

const bulkImport = async (fileBuffer) => {
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    // Enforce header row
    const jsonData = XLSX.utils.sheet_to_json(sheet);

    if (!jsonData || !jsonData.length) {
        throw { statusCode: HTTP_CODES.BAD_REQUEST, message: "File is empty or invalid" };
    }

    const roleDoc = await UserRepository.findRoleByType('User');
    const roleId = roleDoc ? roleDoc._id : null;

    const BATCH_SIZE = 100;
    let successCount = 0;
    let failureCount = 0;
    let errors = [];

    // Prepare all valid users first
    const usersToCreate = [];

    for (let i = 0; i < jsonData.length; i++) {
        const row = jsonData[i];

        // Map fields from expected Excel headers or fallback to JSON keys
        const firstName = row['First Name'] || row.first_name;
        const lastName = row['Last Name'] || row.last_name || '';
        const email = row['Email'] || row.email;
        const countryCode = row['Country Code'] || row.country_code || '+91';
        const phone = row['Phone'] || row.phone ? String(row['Phone'] || row.phone) : '';

        // Basic validation
        if (!email || !firstName || !lastName || !phone) {
            failureCount++;
            errors.push({ row: i + 2, error: "Missing required fields (First Name, Last Name, Email, Phone)" });
            continue;
        }

        // Generate password if missing
        const password = row.password ? String(row.password) : "User@" + Math.floor(1000 + Math.random() * 9000);
        const hashedPassword = await hash(password, 10);

        usersToCreate.push({
            first_name: firstName,
            last_name: lastName,
            email: email,
            phone: phone,
            password: hashedPassword,
            role: roleId,
            role_type: 'customer',
            gender: null,
            country_code: countryCode,
            createdAt: new Date(),
            updatedAt: new Date(),
            is_active: true,
            status: 'offline'
        });
    }

    // Process in batches
    for (let i = 0; i < usersToCreate.length; i += BATCH_SIZE) {
        const batch = usersToCreate.slice(i, i + BATCH_SIZE);
        const result = await UserRepository.createManyUsers(batch);

        successCount += (result.insertedCount || 0);
        if (result.writeErrors && result.writeErrors.length > 0) {
            failureCount += result.writeErrors.length;
            // Add samples of errors
            if (errors.length < 20) {
                result.writeErrors.forEach(err => errors.push({ message: err.errmsg || "Database error" }));
            }
        }
    }

    return {
        message: `Import complete. Success: ${successCount}, Failed: ${failureCount}`,
        data: { successCount, failureCount, errors }
    };
};

const deleteUser = async (id) => {
    const user = await UserRepository.findUserById(id);
    if (!user) {
        throw {
            statusCode: HTTP_CODES.NOT_FOUND,
            message: messages.USER_NOT_FOUND,
        };
    }

    const result = await UserRepository.deleteUserById(id);
    return {
        message: messages.USER_DELETED_SUCCESS || "User deleted successfully",
        data: result,
    };
};

const bulkDelete = async (ids) => {
    if (!Array.isArray(ids) || ids.length === 0) {
        throw { statusCode: HTTP_CODES.BAD_REQUEST, message: "No user IDs provided" };
    }
    const result = await UserRepository.deleteManyUsers(ids);
    return {
        message: `${result.modifiedCount} users deleted`, // modifiedCount from updateMany
        data: result,
    };
};

const getAgentsWithStats = async (query = {}) => {
    // Get Agent role id
    const agentRole = await UserRepository.findRoleByType('Agent');
    if (!agentRole) {
        return { agents: [], pagination: { total: 0, page: 1, totalPages: 0, limit: 50 } };
    }

    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 50;
    const skip = (page - 1) * limit;

    const filter = {
        role: agentRole._id,
        is_deleted: { $ne: true },
    };

    if (query.search) {
        filter.$or = [
            { first_name: { $regex: query.search, $options: 'i' } },
            { last_name: { $regex: query.search, $options: 'i' } },
            { email: { $regex: query.search, $options: 'i' } },
        ];
    }

    const agents = await UserRepository.findAllUsers(filter, skip, limit);
    const total = await UserRepository.countUsers(filter);

    // Get ticket stats for all agents in one aggregation
    const agentIds = agents.map(a => a._id);
    const ticketStats = await TicketRepository.getAgentTicketStats(agentIds);

    // Map stats by agent id for quick lookup
    const statsMap = {};
    ticketStats.forEach(s => {
        statsMap[s._id.toString()] = s;
    });

    const enrichedAgents = agents.map(agent => {
        const stats = statsMap[agent._id.toString()] || { open: 0, resolved: 0, total: 0 };
        return {
            _id: agent._id,
            first_name: agent.first_name,
            last_name: agent.last_name,
            email: agent.email,
            phone: agent.phone,
            role: agent.role,
            role_type: agent.role_type,
            department: agent.department || null,
            status: agent.status || 'offline',
            profile_pic: agent.profile_pic || '',
            groups: agent.groups || [],
            tickets: {
                open: stats.open || 0,
                resolved: stats.resolved || 0,
                total: stats.total || 0,
            },
            createdAt: agent.createdAt,
        };
    });

    return {
        agents: enrichedAgents,
        pagination: {
            total,
            page,
            totalPages: Math.ceil(total / limit),
            limit,
        },
    };
};

const getMe = async (userId) => {
    const user = await UserRepository.findUserById(userId);
    if (!user) {
        throw {
            statusCode: HTTP_CODES.NOT_FOUND,
            message: messages.USER_NOT_FOUND,
        };
    }
    return user;
};

module.exports = {
    signup,
    login,
    disableUser,
    addAttachments,
    removeAttachments,
    list,
    getById,
    update,
    bulkImport,
    deleteUser,
    bulkDelete,
    getAgentsWithStats,
    getMe,
};
