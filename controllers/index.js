"user strict";
const yahooFinance = require('yahoo-finance');
const calculateRSI = require('technicalindicators').RSI;

async function getStockList(req, res) {
    try {
        // Fetch stock related details from body
        const { Stocks: stocks, FromDate: fromDate, ToDate: toDate } = req.body;
        const historicalStockDetails = await yahooFinance.historical({
            symbols: stocks,
            from: fromDate,
            to: toDate
        });

        // Calculate RSI for each entry in the data
        for (let symbol in historicalStockDetails) {
            const eleStockDetails = historicalStockDetails[symbol].reverse();
            const closingPrices = eleStockDetails.map(obj => obj.close);

            const inputValues = {
                values: closingPrices,
                period: 14
            }
            let rsiValues = calculateRSI.calculate(inputValues)
            rsiValues = Array(14).fill(null).concat(rsiValues)
            // Update each object with its corresponding RSI values
            eleStockDetails.forEach((obj, index) => {
                obj.rsi = rsiValues[index] ? rsiValues[index].toFixed(2) : null;
            });
        }

        res.send(historicalStockDetails);
    } catch (error) {
        // Handle errors
        return res.status(500).json({
            message: error.message
        });
    }
}

module.exports = {
    getStockList,
};
