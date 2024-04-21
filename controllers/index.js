"user strict";

// Handle user login
async function getStockList(req, res) {
    try {
        // Handle errors
        return res.status(400).json({
            message: "Success"
        });
    } catch (error) {
        // Handle errors
        return res.status(500).json({
            message: error.message
        });
    }
}

module.exports = {
    getStockList,
}