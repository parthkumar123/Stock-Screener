```markdown
# Stock Screener API

## Overview
This is a Node.js and Express.js based API for screening stocks using Yahoo Finance API for historical stock data and TechnicalIndicators npm package for calculating RSI (Relative Strength Index). The API follows the MVC (Model-View-Controller) architecture pattern and utilizes MongoDB for data storage. Winston is integrated for logging purposes.

## Prerequisites
- Node.js
- MongoDB
- npm

## Installation
1. Clone the repository:
    ```bash
    git clone <repository_url>
    cd <project_directory>
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Open `development.env` file in the env directory and add your MongoDB URI:
    ```bash
    MONGODB_URI=<your_mongodb_uri>
    ```

## Usage
To run the code in development mode, use the following command:
```bash
npm run dev
```

## Environment Files

Different environment configurations can be managed using separate `.env` files.

## API Endpoints

- `POST /stocks`: Retrieves the Relative Strength Index (RSI) for a given stock symbol.
  - Parameters:
    - `Stocks`: List of Stock symbols for which RSI is to be calculated.
    - `FromDate`: Start Date from which RSI is to be calculated.
    - `ToDate`: End date for which RSI is to be calculated.

## Logging

Logging is implemented using Winston.
