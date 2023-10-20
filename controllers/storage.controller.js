// ================================================================
// SumBeam Image Store Filesystem Controller
// Author; Marcelo Mendoza
// Date: 2023-09-10
// Description: This controller is responsible for handling all
//              requests to the filesystem.
// ================================================================

import multer from "multer";
import { currentDirPath } from "../server.js";
import fs from "fs";
import dotenv from 'dotenv'
dotenv.config()

// Set the storage destination and file name for uploaded files
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, `public/uploads`);
    },
    filename: (req, file, callback) => {
        // Generate a unique file name (timestamp + only the file extension)
        const timestamp = Date.now();
        callback(null, `${timestamp}.${file.originalname.split('.').pop()}`);
    },
});

// Create a Multer instance with the storage configuration
export const upload = multer({ storage });

// Handle the upload request
export const uploadFile = (req, res) => {
    if (req.file) {
        // check if the file is less than env.MAXFILESIZE
        const maxsize = process.env.MAXFILESIZE;
        if (req.file.size > maxsize) {
            console.log(`CL: ${new Date().toLocaleString('es-CL', { timeZone: 'America/Santiago' })} █x█ File upload failed: File too large! Must be less than ${maxsize} bytes`);
            return res.status(400).json({
                message: "File upload failed!",
                filename: req.file.filename,
                maxfilesize: `${maxsize} bytes`,
                error: "File too large",
            });
        }
        console.log(`CL: ${new Date().toLocaleString('es-CL', { timeZone: 'America/Santiago' })} █+█ File uploaded: ${req.file.filename} - ${req.file.size} bytes`);
        res.status(200).json({
            message: "File uploaded successfully!",
            filename: req.file.filename,
            url: `http://sunbeam.rweb.cl/api/v${process.env.APIVERSION}/files?filename=${req.file.filename}`
        });
    } else {
        console.log(`CL: ${new Date().toLocaleString('es-CL', { timeZone: 'America/Santiago' })} █x█ File upload failed: No file uploaded`);
        res.status(500).json({
            message: "File upload failed!",
            filename: "No file uploaded",
        });
    }
};

// Handle the download request
export const downloadFile = (req, res) => {
    const filePath = `${currentDirPath}/public/uploads/${req.query.filename}`;

    // Check if the file exists
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            console.log(`CL: ${new Date().toLocaleString('es-CL', { timeZone: 'America/Santiago' })} █x█ File download failed: ${err}`);
            return res.status(404).json({
                message: "File not found!",
                error: err,
                filename: req.query.filename,
            });
        }

        // If the file exists, send it
        res.sendFile(filePath, (err) => {
            if (err) {
                console.log(`CL: ${new Date().toLocaleString('es-CL', { timeZone: 'America/Santiago' })} █x█ File download failed: ${err}`);
                return res.status(500).json({
                    message: "File download failed!",
                    filename: req.query.filename,
                    error: err,
                });
            }
            // get file size
            const filesize = fs.statSync(filePath).size;
            console.log(`CL: ${new Date().toLocaleString('es-CL', { timeZone: 'America/Santiago' })} █▄█ File downloaded: ${req.query.filename} - ${filesize} bytes`);
        });
    });
};

export const deleteFile = (req, res) => {
    const filePath = `${currentDirPath}/public/uploads/${req.query.filename}`;

    // Check if the file exists
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            console.log(`CL: ${new Date().toLocaleString('es-CL', { timeZone: 'America/Santiago' })} █x█ File delete failed: ${err}`);
            return res.status(404).json({
                message: "File not found!",
                error: err,
                filename: req.query.filename,
            });
        }

        // If the file exists, delete it
        fs.unlink(filePath, (err) => {
            if (err) {
                console.log(`CL: ${new Date().toLocaleString('es-CL', { timeZone: 'America/Santiago' })} █x█ File delete failed: ${err}`);
                return res.status(500).json({
                    message: "File delete failed!",
                    filename: req.query.filename,
                    error: err,
                });
            }
            console.log(`CL: ${new Date().toLocaleString('es-CL', { timeZone: 'America/Santiago' })} █-█ File deleted: ${req.query.filename}`);
            res.status(200).json({
                message: "File deleted successfully!",
                filename: req.query.filename,
            });
        });
    });
}