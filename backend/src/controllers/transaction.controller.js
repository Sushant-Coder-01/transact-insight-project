import { Transaction } from "../models/Transaction.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import axios from "axios";

// list transactions API

const listTransactions = asyncHandler( async(req, res) => {

    const { search = '', page = 1, perPage = 10, month } = req.query;

    // validate page and perPage.
    const pageNum = parseInt(page,10);
    const perPageNum = parseInt(perPage,10);

    if(isNaN(pageNum) || isNaN(perPageNum) || pageNum < 1 || perPageNum < 1){
        throw new ApiError(400,"Invalid Pagination Paramenters");
    }

    
    // Validate month parameter
    if (!month) {
        throw new ApiError(400, "Month is required.");
    }


    const startDate = new Date(`${month}-01T00:00:00.000Z`);
    const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0, 23, 59, 59, 999);

    let query = {
        dateOfSale: {
        $gte: startDate,
        $lt: endDate
        }
    };

    // added search criteria
    if(search){
        query.$or = [
            { title: new RegExp(search, 'i') },
            { description: new RegExp(search, 'i') },
          ];
    };


    // fetching the transaction

    const transaction = await Transaction.find(query)
    .skip((pageNum - 1)*perPageNum)
    .limit(parseInt(perPageNum));

    if(!transaction.length){
        throw new ApiError(404,"No transaction found!");
    }


    res.status(200).json(
        new ApiResponse(200,transaction,"Transaction list sent successfully !")
    )
})

// transaction statistics

const getTransactionStatistics = asyncHandler( async(req, res) => {

    const{ month } = req.query;

    // Validate month parameter
    if (!month) {
        throw new ApiError(400, "Month is required.");
    }


    const startDate = new Date(`${month}-01T00:00:00.000Z`);
    const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0, 23, 59, 59, 999);

    const pipeline = [

        {
            $match: {
            dateOfSale: {
                $gte: startDate,
                $lt: endDate
                }
            }
        },
        {
            $group: {
                _id: null,
                totalAmount: { $sum: '$price'},
                averageAmount: { $avg: '$price'},
                transactionCount: { $sum: 1} 
            }
        }
        
    ];

    // Execute the aggregation pipeline
    const stats = await Transaction.aggregate(pipeline);



    // Check if statistics were found
    if (!stats.length) {
        throw new ApiError(404, "No statistics found for the given month.");
    }


     // Send response
    res.status(200).json(
        new ApiResponse(200, stats[0], "Transaction statistics fetched successfully!")
    );
})

// transaction barchart data

const getBarChartData = asyncHandler( async(req,res) =>{

    const{ month } = req.query;

    // Validate month parameter
    if (!month) {
        throw new ApiError(400, "Month is required.");
    }


    const startDate = new Date(`${month}-01T00:00:00.000Z`);
    const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0, 23, 59, 59, 999);


    const pipeline = [
        {
            $match: {
                dateOfSale: {
                    $gte: startDate,
                    $lt: endDate
                }
            }
        },
        {
            $group: {
                _id: { $dayOfMonth: '$dateOfSale' },
                totalSales: { $sum: '$price' }
            }
        },
        {
            $sort: { _id: 1}
        }
    ];

    // Execute the aggregation pipeline
    const barChartData = await Transaction.aggregate(pipeline);

    // Check if barChar data were found
    if (!barChartData.length) {
        throw new ApiError(404, "No barChart data found for the given month.");
    }

    // Send response
    res.status(200).json(
        new ApiResponse(200, barChartData, "Bar chart data fetched successfully!")
    );


})

// transaction pie char data

const getPieChartData = asyncHandler( async(req, res) => {

    const{ month } = req.query ;

    // Validate month parameter
    if (!month) {
        throw new ApiError(400, "Month is required.");
    }


    const startDate = new Date(`${month}-01T00:00:00.000Z`);
    const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0, 23, 59, 59, 999);


    const pipeline = [

        {
            $match: {
                dateOfSale: {
                    $gte: startDate,
                    $lt: endDate
                }
            }
        },
        {
            $group: {
                _id: '$category',
                totalSales: { $sum: '$price' }
            }
        }
    ];

    // Execute the aggregation pipeline.
    const pieChartData = await Transaction.aggregate(pipeline);

    // Check if pieChart data is found 
    if(!pieChartData.length){
        throw new ApiError(404, "No pie chart data is found for the given month");
    }

    // Send response
    res.status(200).json(
        new ApiResponse(200, pieChartData, "Pie chart data fetched successfully!")
    );

})

// combined data.

const getCombinedData = asyncHandler(async (req, res) => {

    const { month } = req.query ;

    // validate month parameter.

    if(!month){
        throw new ApiError(400,"Month is required!");
    }

    try {
        const [ transactionListResponse, statsResponse, barChartResponse, pieChartResponse ] = await Promise.all([
            axios.get(`http://localhost:8000/api/transactions/?month=${month}`),
            axios.get(`http://localhost:8000/api/transactions/statistics?month=${month}`),
            axios.get(`http://localhost:8000/api/transactions/barchart?month=${month}`),
            axios.get(`http://localhost:8000/api/transactions/piechart?month=${month}`)
        ]);
    
        const transactionList = transactionListResponse.data ;
        const stats = statsResponse.data ;
        const barChartData = barChartResponse.data ;
        const pieChartData = pieChartResponse.data ;
    
        console.log("transactionList:",transactionList);
    
        res.status(200).json(
            new ApiResponse(200,transactionList, stats, barChartData, pieChartData, "combined data fetched successfully !"),
        );
    } catch (error) {

        throw new ApiError(500,"data is not fetched!");
    }
    
});


export  {
    listTransactions,
    getTransactionStatistics,
    getBarChartData,
    getPieChartData,
    getCombinedData
}