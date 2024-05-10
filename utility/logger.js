"use strict";
const { createLogger, format, transports } = require("winston");
const { v4: uuidv4 } = require("uuid");

// Default log format
const fileLogFormat = format.printf(({ level, message, timestamp }) => {
    if (message === "\n") return "";
    return `${timestamp} ${level} : ${message}`;
});

// Default console log format
const consoleLogFormat = format.printf(({ level, message, timestamp }) => {
    if (message === "\n") return "";
    return `${timestamp} ${level} : ${message}`;
});

// Create console configuration
const consoleConfig = {
    format: format.combine(
        format.colorize(),
        format.simple(),
        consoleLogFormat
    )
};

function getCustomTimestamp() {
    const date = new Date();
    const year = date.getFullYear().toString().padStart(4, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const milliseconds = date.getMilliseconds().toString().padStart(3, '0');

    return {
        currentDate: `${year}${month}${day}`,
        currentDateTime: `${year}${month}${day}${hours}${minutes}${seconds}${milliseconds}`
    };
}

function logRequest(fName, isLogEnabled) {
    // Check whether log is enabled or not
    if (isLogEnabled === "true") {
        isLogEnabled = true;
    } else if (isLogEnabled === "false") {
        isLogEnabled = false;
    }

    // Generate unique id
    const id = uuidv4();
    const { currentDate, currentDateTime } = getCustomTimestamp();

    // Create logger instance for request details formatting
    const logger = createLogger({
        format: format.combine(
            format.timestamp({
                format: "YYYY-MM-DD HH:mm:ss.SSS"
            }),
            format.errors({ stack: true }),
            format.splat(),
            fileLogFormat,
        )
    });

    let txtFileTransport = null;
    let consoleTransport = null;
    if (isLogEnabled) {
        // If log is enabled then add transport to write file
        txtFileTransport = new transports.File({
            filename: `logs/${currentDate}/${fName}_${currentDateTime}_${id}.txt`
        });
        logger.add(txtFileTransport);

        // Log information in console in development environment
        consoleTransport = new transports.Console(consoleConfig);
        const isDevelopment = process.env.NODE_ENV === "development";
        isDevelopment && logger.add(consoleTransport);
    }

    return {
        id,
        log: (data, level = "info") => {
            // Check type of data if object then stringify object
            if (typeof data === "object") {
                data = JSON.stringify(data);
            }

            // Check if log is enabled then log the details
            isLogEnabled && logger.log({
                level,
                message: data,
                timestamp: Date.now(),
                id
            });
        },
        removeEventListener: () => {
            // If log is not enabled then return
            if (!isLogEnabled) return;
            // Find and remove added transport
            txtFileTransport && logger.remove(txtFileTransport);
            consoleTransport && logger.remove(consoleTransport);
        }
    };
}

module.exports = {
    logRequest
};