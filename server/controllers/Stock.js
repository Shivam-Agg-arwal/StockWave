const Stock = require("../models/Stock");
const Transaction = require("../models/Transaction");
const User = require("../models/User");

exports.buyStock = async (req, res) => {
    try {
        // Extract data from request body
        const { symbol , cprice, quantity } = req.body;
        const userID = req.user.id;

        // Check if user ID is available
        if (!userID) {
            return res.status(400).json({
                success: false,
                message: "User id field could not be fetched",
            });
        }

        // Check if required fields are available
        if (!symbol || !cprice || !quantity) {
            return res.status(400).json({
                success: false,
                message: "Either symbol, current price, or quantity was not found",
            });
        }

        // Fetch user details
        const userDetails = await User.findById(userID).populate('portfolio');
        if (!userDetails) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Calculate total trade amount
        const tradeamt = cprice * quantity;

        // Create transaction
        const transactionDetails = await Transaction.create({
            user: userDetails._id,
            stockSymbol: symbol,
            quantity,
            price: cprice,
            tradeValue: tradeamt,
            orderType: "Buy",
        });

        // Add transaction to user
        userDetails.transactions.push(transactionDetails._id);
        console.log(userDetails);

        // Check if the stock already exists in the user's portfolio
        const stockInfo = userDetails.portfolio.find(stock => stock.stockSymbol === symbol);
        const symbolExists = !!stockInfo;
        console.log(stockInfo);

        if (symbolExists) {
            // Update existing stock
            const updatedStock = await Stock.findByIdAndUpdate(
                stockInfo._id,
                {
                    quantity: stockInfo.quantity + quantity,
                    total_price: stockInfo.total_price + tradeamt,
                },
                { new: true }
            );

            // Update user's array of stocks
            const stockIndex = userDetails.portfolio.findIndex(stock => stock._id === updatedStock._id);
            if (stockIndex !== -1) {
                userDetails.portfolio[stockIndex] = updatedStock._id;
            }
        } else {
            // Add new stock to user's portfolio
            const newStock = await Stock.create({
                stockSymbol: symbol,
                quantity: quantity,
                total_price: tradeamt,
            });

            userDetails.portfolio.push(newStock._id);
        }

        // Update wallet balance and portfolio balance
        userDetails.portfolioBalance += tradeamt;
        userDetails.walletBalance -= tradeamt;

        // Save user details
        await userDetails.save();

        // Return success response
        res.status(200).json({
            success: true,
            message: "Stock purchase successful",
        });
    } catch (error) {
        // Handle errors
        console.error("Stock buying failed", error);
        return res.status(500).json({
            success: false,
            message: "Stock buying failed",
            error: error.message
        });
    }
};


