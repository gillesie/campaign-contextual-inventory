import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { 
  Box, Grid, Paper, Typography, TextField, MenuItem, 
  Select, FormControl, InputLabel, Chip, Stack, ToggleButton, ToggleButtonGroup, 
  Autocomplete
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import TaxonomyFilter from './TaxonomyFilter';
import ClusterFilter from './ClusterFilter';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function Explorer() {
  const { articles, clusters, taxonomy } = useData();
  
  // --- Global Filters ---
  const [search, setSearch] = useState('');
  const [countryFilter, setCountryFilter] = useState('ALL');
  const [brandFilter, setBrandFilter] = useState([]); // New Brand Filter
  
  // --- Complex Context Filters ---
  const [selectedIabIds, setSelectedIabIds] = useState([]);
  const [selectedClusterIds, setSelectedClusterIds] = useState([]);
  const [filterLogic, setFilterLogic] = useState('OR'); // 'AND' or 'OR' between context filters

  // Derive available brands based on country for the dropdown
  const availableBrands = useMemo(() => {
    const brands = new Set();
    articles.forEach(a => {
        if (countryFilter === 'ALL' || a.country === countryFilter) {
            a.brands.forEach(b => brands.add(b));
        }
    });
    return Array.from(brands).sort();
  }, [articles, countryFilter]);

  // --- Core Filter Logic ---
  const filteredArticles = useMemo(() => {
    return articles.filter(art => {
      // 1. Text Search
      const matchesSearch = search === '' || 
                            art.title.toLowerCase().includes(search.toLowerCase()) || 
                            art.topic_clusters.some(c => c.label.toLowerCase().includes(search.toLowerCase()));
      
      // 2. Country Filter
      const matchesCountry = countryFilter === 'ALL' || art.country === countryFilter;

      // 3. Brand Filter (Multi-select)
      const matchesBrand = brandFilter.length === 0 || 
                           art.brands.some(b => brandFilter.includes(b));

      // 4. Contextual Filters (IAB & Clusters)
      let matchesContext = true;
      const hasIabSelection = selectedIabIds.length > 0;
      const hasClusterSelection = selectedClusterIds.length > 0;

      if (hasIabSelection || hasClusterSelection) {
        const iabMatch = hasIabSelection && art.iab_tags.some(tag => selectedIabIds.includes(tag.id));
        const clusterMatch = hasClusterSelection && art.topic_clusters.some(c => selectedClusterIds.includes(c.id));

        if (filterLogic === 'OR') {
          // Union: Match IAB OR Match Cluster (if selected)
          // If only one type is selected, it effectively acts as a filter for that type
          const matchesIabIfActive = !hasIabSelection || iabMatch;
          const matchesClusterIfActive = !hasClusterSelection || clusterMatch;
          
          // If both active: IAB || Cluster
          // If only IAB active: IAB (Cluster is true via !hasClusterSelection logic? No, logic needs care)
          
          if (hasIabSelection && hasClusterSelection) {
             matchesContext = iabMatch || clusterMatch;
          } else {
             matchesContext = (hasIabSelection && iabMatch) || (hasClusterSelection && clusterMatch);
          }

        } else {
          // INTERSECTION: Match IAB (if active) AND Match Cluster (if active)
          matchesContext = (!hasIabSelection || iabMatch) && (!hasClusterSelection || clusterMatch);
        }
      }

      return matchesSearch && matchesCountry && matchesBrand && matchesContext;
    });
  }, [articles, search, countryFilter, brandFilter, selectedIabIds, selectedClusterIds, filterLogic]);

  // --- Stats Calculation ---
  const totalImpressions = filteredArticles.reduce((acc, curr) => acc + curr.total_impressions, 0);
  
  const iabDistribution = useMemo(() => {
    const dist = {};
    filteredArticles.forEach(a => {
        // Count primary IAB tag
        if(a.iab_tags[0]) {
            dist[a.iab_tags[0].label] = (dist[a.iab_tags[0].label] || 0) + a.total_impressions;
        }
    });
    return Object.keys(dist)
        .map(k => ({ name: k, value: dist[k] }))
        .sort((a,b) => b.value - a.value)
        .slice(0, 5);
  }, [filteredArticles]);

  const columns = [
    { field: 'title', headerName: 'Title', width: 250 },
    { field: 'country', headerName: 'Ctry', width: 70 },
    { field: 'brandList', headerName: 'Brands', width: 180, valueGetter: (params) => params.row.brands.join(', ') },
    { field: 'iabList', headerName: 'IAB Tags', width: 200, valueGetter: (params) => params.row.iab_tags.map(t=>t.label).join(', ') },
    { field: 'clusterList', headerName: 'Clusters', width: 200, valueGetter: (params) => params.row.topic_clusters.map(c=>c.label).join(', ') },
    { field: 'total_impressions', headerName: 'Impressions', width: 130, type: 'number' },
  ];

  return (
    <Box sx={{ p: 3, height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Bar: Global Filters */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={3}>
                <Typography variant="h5">Inventory Explorer</Typography>
            </Grid>
            <Grid item xs={12} md={2}>
                <FormControl size="small" fullWidth>
                    <InputLabel>Country</InputLabel>
                    <Select value={countryFilter} label="Country" onChange={(e) => setCountryFilter(e.target.value)}>
                        <MenuItem value="ALL">All Countries</MenuItem>
                        <MenuItem value="BE">Belgium</MenuItem>
                        <MenuItem value="NL">Netherlands</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
                <Autocomplete
                    multiple
                    size="small"
                    options={availableBrands}
                    value={brandFilter}
                    onChange={(e, newValue) => setBrandFilter(newValue)}
                    renderInput={(params) => <TextField {...params} label="Filter Brands" />}
                />
            </Grid>
            <Grid item xs={12} md={2}>
                <TextField 
                    label="Search Text" 
                    variant="outlined" 
                    size="small" 
                    fullWidth 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)} 
                />
            </Grid>
            <Grid item xs={12} md={2}>
                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="caption">Logic:</Typography>
                    <ToggleButtonGroup
                        value={filterLogic}
                        exclusive
                        onChange={(e, newLogic) => newLogic && setFilterLogic(newLogic)}
                        size="small"
                        color="primary"
                    >
                        <ToggleButton value="OR">OR</ToggleButton>
                        <ToggleButton value="AND">AND</ToggleButton>
                    </ToggleButtonGroup>
                 </Box>
            </Grid>
        </Grid>
      </Paper>

      {/* Main Content Area */}
      <Grid container spacing={2} sx={{ flexGrow: 1, overflow: 'hidden' }}>
        
        {/* Left Sidebar: Context Filters */}
        <Grid item xs={12} md={3} sx={{ height: '100%', overflowY: 'auto' }}>
            <Stack spacing={2}>
                <TaxonomyFilter 
                    taxonomy={taxonomy} 
                    selectedIds={selectedIabIds} 
                    onSelectionChange={setSelectedIabIds} 
                />
                <ClusterFilter 
                    clusters={clusters} 
                    selectedIds={selectedClusterIds} 
                    onSelectionChange={setSelectedClusterIds} 
                />
            </Stack>
        </Grid>

        {/* Right Content: Stats & Table */}
        <Grid item xs={12} md={9} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            
            {/* Stats Row */}
            <Grid container spacing={2} sx={{ mb: 2, height: 220 }}>
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                         <Typography variant="h6" color="text.secondary">Filtered Reach</Typography>
                         <Typography variant="h3" color="primary">{totalImpressions.toLocaleString()}</Typography>
                         <Typography variant="caption">{filteredArticles.length} Articles</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={8}>
                     <Paper sx={{ p: 2, height: '100%' }}>
                        <Typography variant="subtitle2">Top IAB Categories (by Impressions)</Typography>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie 
                                    data={iabDistribution} 
                                    dataKey="value" 
                                    cx="50%" cy="50%" 
                                    outerRadius={60} 
                                    label 
                                >
                                    {iabDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend layout="vertical" verticalAlign="middle" align="right" />
                            </PieChart>
                        </ResponsiveContainer>
                     </Paper>
                </Grid>
            </Grid>

            {/* Data Grid */}
            <Paper sx={{ flexGrow: 1 }}>
                <DataGrid
                    rows={filteredArticles}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[10, 25, 50]}
                    disableSelectionOnClick
                />
            </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}