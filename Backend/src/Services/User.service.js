const UserRepository = require('../Repository/User.repository');
const { compare } = require('bcrypt');
const { JWT_SECRET } = require('../Config/config');
const jwt = require('jsonwebtoken');
const messages = require('../Constants/messages');
const { HTTP_CODES } = require('../Constants/enums');

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

module.exports = {
    signup,
    login,
    disableUser,
    addAttachments,
    removeAttachments,
};
