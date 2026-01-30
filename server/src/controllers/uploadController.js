const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename(req, file, cb) {
        cb(
            null,
            `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
        );
    },
});

function checkFileType(file, cb) {
    const filetypes = /jpg|jpeg|png|pdf|mp4|mov|doc|docx|zip|rar/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype); // mimetype check is looser for some files, but good to have.

    if (extname) { // focused on extension check for simplicity in this MVP
        return cb(null, true);
    } else {
        cb('Error: Invalid file type!');
    }
}

const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    },
});

exports.uploadFile = upload.single('file'); // Expects form-data with key 'file'

exports.handleUpload = (req, res) => {
    if (req.file) {
        res.json({
            filePath: `/uploads/${req.file.filename}`,
            fileName: req.file.filename,
        });
    } else {
        res.status(400).json({ message: 'No file uploaded' });
    }
};
