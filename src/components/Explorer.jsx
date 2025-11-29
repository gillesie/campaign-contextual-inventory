import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { 
  Box, Grid, Paper, Typography, TextField, MenuItem, 
  Select, FormControl, InputLabel, Chip, Stack 
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function Explorer() {
  const { articles, clusters } = useData();
  const [search, setSearch] = useState('');
  const [countryFilter, setCountryFilter] = useState('ALL');
  
  // --- Filter Logic ---
  const filteredArticles = useMemo(() => {
    return articles.filter(art => {
      // Text Search
      const matchesSearch = art.title.toLowerCase().includes(search.toLowerCase()) || 
                            art.topic_clusters.some(c => c.label.toLowerCase().includes(search.toLowerCase()));
      
      // Country Filter
      const matchesCountry = countryFilter === 'ALL' || art.country === countryFilter;

      return matchesSearch && matchesCountry;
    });
  }, [articles, search, countryFilter]);

  // --- Stats Calculation ---
  const totalImpressions = filteredArticles.reduce((acc, curr) => acc + curr.total_impressions, 0);
  
  const brandDistribution = useMemo(() => {
    const dist = {};
    filteredArticles.forEach(a => {
      a.brands.forEach(b => {
        dist[b] = (dist[b] || 0) + a.total_impressions;
      });
    });
    return Object.keys(dist).map(k => ({ name: k, value: dist[k] })).slice(0, 5); // Top 5
  }, [filteredArticles]);

  const columns = [
    { field: 'title', headerName: 'Title', width: 250 },
    { field: 'country', headerName: 'Country', width: 80 },
    { field: 'brandList', headerName: 'Brands', width: 200, valueGetter: (params) => params.row.brands.join(', ') },
    { field: 'primaryCluster', headerName: 'Top Cluster', width: 200, valueGetter: (params) => params.row.topic_clusters[0]?.label },
    { field: 'total_impressions', headerName: 'Impressions', width: 150, type: 'number' },
  ];

  return (
    <Box sx={{ p: 3, height: '100%' }}>
      <Typography variant="h4" gutterBottom>Inventory Explorer</Typography>
      
      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Stack direction="row" spacing={2}>
          <TextField 
            label="Search Inventory" 
            variant="outlined" 
            size="small" 
            fullWidth 
            onChange={(e) => setSearch(e.target.value)} 
          />
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Country</InputLabel>
            <Select value={countryFilter} label="Country" onChange={(e) => setCountryFilter(e.target.value)}>
              <MenuItem value="ALL">Both</MenuItem>
              <MenuItem value="BE">Belgium</MenuItem>
              <MenuItem value="NL">Netherlands</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Paper>

      <Grid container spacing={3}>
        {/* Stats */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: 300, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h6">Total Reach</Typography>
            <Typography variant="h3" color="primary">{totalImpressions.toLocaleString()}</Typography>
            <Typography variant="caption">Impressions (Last 30 days)</Typography>
            
            <Box sx={{ width: '100%', height: 200 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={brandDistribution} cx="50%" cy="50%" innerRadius={40} outerRadius={80} fill="#8884d8" dataKey="value" label>
                    {brandDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Data Grid */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ height: 500, width: '100%' }}>
            <DataGrid
              rows={filteredArticles}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[10, 20]}
              disableSelectionOnClick
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}