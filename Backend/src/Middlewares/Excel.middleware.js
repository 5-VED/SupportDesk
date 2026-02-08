const multer = require('multer');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    // Check mimetype or extension
    if (
        file.mimetype.includes('excel') ||
        file.mimetype.includes('spreadsheet') ||
        file.mimetype.includes('csv') ||
        file.originalname.match(/\.(xlsx|xls|csv)$/)
    ) {
        cb(null, true);
    } else {
        cb(new Error('Only Excel/CSV files are allowed!'), false);
    }
};

const uploadExcel = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

module.exports = uploadExcel;
