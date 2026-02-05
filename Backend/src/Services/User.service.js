const {
    UserRepository,
    RoleRepository,
    AttachmentsRepository,
    UserAgentRepository,
} = require('../Repository');
const { compare } = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../Config/config');
const messages = require('../Constants/messages');
const ServiceResponse = require('../Common/ServiceResponse');

class UserService {
    /**
     * Handle user signup/registration
     * @param {Object} userData - User registration data
     * @returns {Promise<Object>} Result object with success status and data/message
     */
    async signup(userData) {
        // Check if user already exists
        const existingUser = await UserRepository.findUserByEmailOrPhone(
            userData.email,
            userData.phone
        );

        if (existingUser) {
            return ServiceResponse.badRequest(messages.USER_ALREADY_EXISTS);
        }

        // Assign default role if not provided
        if (!userData.role) {
            const userRole = await RoleRepository.findRoleByName('User');
            if (userRole) {
                userData.role = userRole._id;
            }
        }

        // Create user
        const result = await UserRepository.createUser(userData);

        return ServiceResponse.success(messages.USER_CREATED_SUCCESS, result);
    }

    /**
     * Disable a user account
     * @param {string} userId - User ID to disable
     * @returns {Promise<Object>} Result object with success status and data/message
     */
    async disableUser(userId) {
        const result = await UserRepository.updateUserById(userId, {
            is_active: false,
        });

        if (!result) {
            return ServiceResponse.error(messages.USER_DISABLE_ERROR);
        }

        return ServiceResponse.success(messages.USER_DISABLED_SUCCESS, result);
    }

    /**
     * Add attachments/files
     * @param {Array} files - Array of file objects
     * @returns {Promise<Object>} Result object with success status and message
     */
    async addAttachments(files) {
        if (!files || !Array.isArray(files)) {
            return ServiceResponse.badRequest(messages.EXTENSION_NOT_FOUND, {});
        }

        // Process each file and create attachment records
        const attachmentPromises = files.map(async element => {
            const payload = {
                file_name: element?.originalname,
                file_type: element?.mimetype,
                file_size: Number(element?.size) / 1024 + ' Kb',
                file_url: element?.path,
                uploaded_at: element?.uploaded_at,
            };
            return await AttachmentsRepository.createAttachment(payload);
        });

        await Promise.all(attachmentPromises);

        return ServiceResponse.success(messages.ATTACHMENTS_ADDED_SUCCESS, {});
    }

    /**
     * Remove an attachment
     * @param {string} attachmentId - Attachment ID to remove
     * @returns {Promise<Object>} Result object with success status and message
     */
    async removeAttachment(attachmentId) {
        const attachment = await AttachmentsRepository.findAttachmentById(
            attachmentId
        );

        if (!attachment) {
            return ServiceResponse.notFound(messages.ATTACHMENT_NOT_FOUND);
        }

        await AttachmentsRepository.deleteAttachmentById(attachmentId);

        return ServiceResponse.success(messages.ATTACHMENT_REMOVED_SUCCESS, {});
    }

    /**
     * Handle user login/authentication
     * @param {Object} credentials - Login credentials (email, password)
     * @param {Object} userAgentInfo - User agent information from request
     * @returns {Promise<Object>} Result object with success status, user data, and token
     */
    async login(credentials, userAgentInfo = null) {
        const { email, password } = credentials;

        // Find user by email with status filters
        const user = await UserRepository.findUserByEmailWithFilters(email, {
            is_deleted: false,
            is_active: true,
        });

        if (!user) {
            return ServiceResponse.notFound(messages.USER_NOT_REGISTERED);
        }

        // Verify password
        const isPasswordCorrect = await compare(password, user.password);

        if (!isPasswordCorrect) {
            return ServiceResponse.unauthorized(messages.INCORRECT_PASSWORD);
        }

        // Generate JWT token
        const token = jwt.sign(
            { email, _id: user._id, role: user.role },
            JWT_SECRET,
            {
                expiresIn: '2d',
            }
        );

        // Log user agent information if available
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

            await UserAgentRepository.createUserAgent(payload);
        }

        return ServiceResponse.success(messages.USER_LOGIN_SUCCESS, {
            user,
            token,
        });
    }
}

module.exports = new UserService();
