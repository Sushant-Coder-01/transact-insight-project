import express, { Router } from "express"
import { listTransactions, 
         getTransactionStatistics, 
         getBarChartData, 
         getPieChartData, 
         getCombinedData 
        } from "../controllers/transaction.controller.js"

const router = Router();

router.get('/transactions', listTransactions);
router.get('/statistics', getTransactionStatistics);
router.get('/barchart', getBarChartData);
router.get('/piechart', getPieChartData);
router.get('/combined', getCombinedData);

export default router 