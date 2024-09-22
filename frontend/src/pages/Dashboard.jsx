import React from 'react';
import { Grid, Paper, Box, CssBaseline } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line } from 'recharts';
import TopNavbar from '../components/TopNavbar';
import LeftSidebar from '../components/LeftSidebar';
import './Dashboard.scss';

const data = [
  { name: 'January', sales: 4000, orders: 2400 },
  { name: 'February', sales: 3000, orders: 2210 },
  { name: 'March', sales: 2000, orders: 2290 },
  { name: 'April', sales: 2780, orders: 2000 },
  { name: 'May', sales: 1890, orders: 2181 },
];

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem('user')) || { name: 'Admin' };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <TopNavbar user={user} />
      <LeftSidebar />

      <Box component="main" className="dashboard">
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Paper className="chart-container">
              <h3>Sales and Orders Bar Chart</h3>
              <BarChart width={500} height={300} data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="sales" fill="#8884d8" />
                <Bar dataKey="orders" fill="#82ca9d" />
              </BarChart>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper className="chart-container">
              <h3>Orders Line Chart</h3>
              <LineChart width={500} height={300} data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="orders" stroke="#8884d8" />
                <Line type="monotone" dataKey="sales" stroke="#82ca9d" />
              </LineChart>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard;
