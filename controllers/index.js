"user strict";
const yahooFinance = require('yahoo-finance');
const calculateRSI = require('technicalindicators').RSI;
const { logRequest } = require("../utility/logger");

async function getStockList(req, res) {
    const { log, removeEventListener } = logRequest("GetStockList", process.env.DEBUG_MODE);
    try {
        log("API Request Started.");
        log(`Request Body : ${JSON.stringify(req.body)}`);

        log("Yahoo Finance API Call Started.");
        // Fetch stock related details from body
        const { Stocks: stocks, FromDate: fromDate, ToDate: toDate } = req.body;
        const historicalStockDetails = await yahooFinance.historical({
            symbols: stocks,
            from: fromDate,
            to: toDate
        });
        log("Yahoo Finance API Call Ended.");

        // Calculate RSI for each entry in the data
        for (let symbol in historicalStockDetails) {
            const eleStockDetails = historicalStockDetails[symbol].reverse();
            const closingPrices = eleStockDetails.map(obj => obj.close);
            log(`${symbol} Closing Prices : ${closingPrices}`);

            const inputValues = {
                values: closingPrices,
                period: 14
            };
            let rsiValues = calculateRSI.calculate(inputValues);
            rsiValues = Array(14).fill(null).concat(rsiValues);

            log(`${symbol} RSI Values : ${rsiValues}`);
            // Update each object with its corresponding RSI values
            eleStockDetails.forEach((obj, index) => {
                obj.rsi = rsiValues[index] ? rsiValues[index].toFixed(2) : null;
            });
        }

        // Return success message
        return res.send(historicalStockDetails);
    } catch (error) {
        log(`${error.message} : ${error.stack}`, "error");
        // Handle errors
        return res.status(500).json({
            message: error.message
        });
    } finally {
        log("API Request Ended.");
        // Remove winston transport
        removeEventListener();
    }
}

module.exports = {
    getStockList,
};
