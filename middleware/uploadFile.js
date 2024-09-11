import path from 'path';
import multer from "multer";
import fs from 'fs/promises';

const jacket = (pathName) => {
    const storage = multer.diskStorage({
        destination: async (req, file, cb) => {
            const folderPath = pathName || path.resolve(`public/${file.fieldname}`);
            if (!await fs.access(folderPath).then(() => true).catch(() => false)) {
                await fs.mkdir(folderPath);
            }
            cb(null, folderPath);
        },

        filename: (req, file, cb) => {
            cb(null, Date.now() + '-' + file.originalname);
        },
    })

    const fileFilter = (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(new Error("Only image types allowed"), false);
        }
    }

    return multer({
        storage,
        fileFilter,
        limits: {
            fileSize: 1024 * 1024 * 5,
        }
    });

}

export default jacket;