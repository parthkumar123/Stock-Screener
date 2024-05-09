"user strict";
const yahooFinance = require('yahoo-finance');
const tempData = require("../data.json")

async function getStockList(req, res) {
    try {
        // Fetch stock related details from body
        // const { Stocks: stocks, FromDate: fromDate, ToDate: toDate } = req.body;
        // const historicalStockDetails = await yahooFinance.historical({
        //     symbols: stocks,
        //     from: fromDate,
        //     to: toDate
        // });
        const historicalStockDetails = tempData;

        // Calculate RSI for each entry in the data
        for (let symbol in historicalStockDetails) {
            const closingPrices = historicalStockDetails[symbol].map(obj => parseFloat(obj.close.toFixed(2)));
            console.log(closingPrices.reverse())
            const rsiValues = calculateRSI(closingPrices.reverse());
            // rsiList[symbol] = rsiValues;

            // Update each object with its corresponding RSI values
            historicalStockDetails[symbol].reverse().forEach((obj, index) => {
                obj.rsi = rsiValues[index];
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

function calculateRSI(close, lookback = 14) {
    let ret = close.map((val, index) => index > 0 ? val - close[index - 1] : 0);
    let up = ret.map(val => val > 0 ? val : 0);
    let down = ret.map(val => val < 0 ? -val : 0);

    let upEwm = [];
    let downEwm = [];
    let rs = [];
    let rsi = [];

    for (let i = 0; i < close.length; i++) {
        if (i < lookback - 1) {
            upEwm.push(null);
            downEwm.push(null);
            rs.push(null);
            rsi.push(null);
        } else {
            let sumUp = 0;
            let sumDown = 0;
            for (let j = i - lookback + 1; j <= i; j++) {
                sumUp += up[j];
                sumDown += down[j];
            }
            let avgUp = sumUp / lookback;
            let avgDown = sumDown / lookback;
            upEwm.push(avgUp);
            downEwm.push(avgDown);
            rs.push(avgDown !== 0 ? avgUp / avgDown : null);
            rsi.push((100 - (100 / (1 + rs[i]))).toFixed(2));
        }
    }

    return rsi;
}


module.exports = {
    getStockList,
};
