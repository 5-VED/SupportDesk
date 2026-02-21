const UserController = require('../Controllers/User.controller');
const auth = require('../Middlewares/Auth.middleware');
const { MAXATTACHMENTS, ROLE } = require('../Constants/enums');
const upload = require('../Middlewares/File.middleware');
const uploadExcel = require('../Middlewares/Excel.middleware');
const {
  loginSchema,
  signupSchema,
  addAttachmentsSchema,
  removeAttachmentsSchema,
  disableUserSchema,
  updateUserSchema,
  createUserSchema,
} = require('../Validators/User.validator');

const { validateRequest } = require('../Middlewares/Validlidator.middleware');

const router = require('express').Router();

router.post('/signup', upload.single('profile_pic'), validateRequest(signupSchema), UserController.signup);

router.post('/login', validateRequest(loginSchema), UserController.login);

// Authenticated User Routes (Admin/Agent Management)

// Get current logged-in user (session validation) — must be before /:id
router.get(
  '/me',
  auth({ isTokenRequired: true, usersAllowed: ['*'] }),
  UserController.getMe
);

// Logout (clear cookie)
router.post(
  '/logout',
  auth({ isTokenRequired: true, usersAllowed: ['*'] }),
  UserController.logoutUser
);

// Get agents with ticket stats
router.get(
  '/agents',
  auth({
    isTokenRequired: true,
    usersAllowed: [ROLE.ADMIN, ROLE.AGENT],
  }),
  UserController.getAgentsWithStats
);

// List Users (Admin/Agent)
router.get(
  '/',
  auth({
    isTokenRequired: true,
    usersAllowed: [ROLE.ADMIN, ROLE.USER, ROLE.AGENT],
  }),
  UserController.list
);

// Create User (Admin/Agent)
router.post(
  '/',
  auth({
    isTokenRequired: true,
    usersAllowed: [ROLE.ADMIN, ROLE.AGENT, ROLE.USER], // Allow Agents/Users to create customers
  }),
  upload.single('profile_pic'),
  validateRequest(createUserSchema),
  UserController.create
);

// Bulk Import Users (Admin/Agent)
router.post(
  '/bulk-import',
  auth({
    isTokenRequired: true,
    usersAllowed: [ROLE.ADMIN, ROLE.AGENT],
  }),
  uploadExcel.single('file'),
  UserController.bulkImport
);

// Get User by ID (Admin/Agent)
router.get(
  '/:id',
  auth({
    isTokenRequired: true,
    usersAllowed: [ROLE.ADMIN, ROLE.AGENT, ROLE.USER],
  }),
  UserController.getById
);

// Delete User (Admin only)
router.delete(
  '/:id',
  auth({
    isTokenRequired: true,
    usersAllowed: [ROLE.ADMIN, ROLE.AGENT, ROLE.USER],
  }),
  UserController.deleteUser
);

// Bulk Delete Users
router.post(
  '/bulk-delete',
  auth({
    isTokenRequired: true,
    usersAllowed: [ROLE.ADMIN, ROLE.AGENT, ROLE.USER],
  }),
  UserController.bulkDelete
);

// Update User (Admin/Agent)
// Agents might need to update customer details (phone, etc)
router.patch(
  '/:id',
  auth({
    isTokenRequired: true,
    usersAllowed: [ROLE.ADMIN, ROLE.AGENT, ROLE.USER],
  }),
  upload.single('profile_pic'),
  validateRequest(updateUserSchema),
  UserController.update
);

router.post(
  '/add-attachments',
  auth({
    isTokenRequired: true,
    usersAllowed: [ROLE.USER], // Admin bypasses this check in middleware
  }),
  upload.array('file', MAXATTACHMENTS),
  validateRequest(addAttachmentsSchema),
  UserController.addAttachments
);

router.delete(
  '/remove-attachments/:id',
  auth({
    isTokenRequired: true,
    usersAllowed: [ROLE.USER],
  }),
  validateRequest(removeAttachmentsSchema),
  UserController.removeAttachments
);

router.patch(
  '/disable-user',
  auth({ isTokenRequired: true, usersAllowed: [ROLE.ADMIN] }), // Only Admin can disable
  validateRequest(disableUserSchema),
  UserController.disableUser
);

module.exports = router;
