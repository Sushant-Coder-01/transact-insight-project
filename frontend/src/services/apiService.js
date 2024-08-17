import axios from "axios";

const API_BASE_URL = 'http://localhost:8000' ;

export const fetchTransactions = (search = '',  page = 1, perPage = 10, month) => 
    axios.get(`${API_BASE_URL}/transactions`, {params: {search, page, perPage, month}});

export const fetchStatistics = (month) => 
    axios.get(`${API_BASE_URL}/statistics`, {params: {month}});

export const fetchBarChartData = (month) => 
    axios.get(`${API_BASE_URL}/barchart`, {params: {month}});

export const fetchPieChartData = (month) => 
    axios.get(`${API_BASE_URL}/piechart`, {params: {month}});

export const fetchCombinedData = (month) => 
    axios.get(`${API_BASE_URL}/combined`, {params: {month}});