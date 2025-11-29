import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Box, Typography, Paper } from '@mui/material';

const COLORS = ['#0ea5e9', '#22c55e', '#eab308', '#f97316', '#ef4444'];

export default function DashboardStats({ data, title, subTitle }) {
  // Ensure data is sorted
  const chartData = data || [];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <Box sx={{ bgcolor: 'white', p: 1, border: '1px solid #ccc', borderRadius: 1 }}>
          <Typography variant="body2">{`${payload[0].name}: ${payload[0].value.toLocaleString()} Imps`}</Typography>
        </Box>
      );
    }
    return null;
  };

  return (
    <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <Typography variant="h6" color="text.secondary" gutterBottom>
        {title}
      </Typography>
      
      {subTitle && (
        <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold' }}>
          {subTitle}
        </Typography>
      )}

      <Box sx={{ width: '100%', height: 250, mt: 2 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}