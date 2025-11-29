import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Box, TextField, Button, Paper, Typography, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

export default function CampaignWizard() {
  const { clusters, articles } = useData();
  const [prompt, setPrompt] = useState('');
  const [proposals, setProposals] = useState([]);

  const handleSearch = () => {
    // --- Mock Semantic Search ---
    // In a real app, this sends the prompt to an embedding endpoint.
    // Here, we split the prompt into words and find clusters containing those words.
    const keywords = prompt.toLowerCase().split(' ');
    
    const matchedClusters = clusters.filter(c => 
      keywords.some(k => k.length > 3 && c.label.toLowerCase().includes(k))
    ).slice(0, 10); // Limit to 10 suggestions

    // Calculate reach for these clusters
    const suggestions = matchedClusters.map(cluster => {
      const relatedArticles = articles.filter(a => a.topic_clusters.some(tc => tc.id === cluster.id));
      const reach = relatedArticles.reduce((sum, a) => sum + a.total_impressions, 0);
      return { ...cluster, reach, articleCount: relatedArticles.length };
    });

    setProposals(suggestions);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Campaign Wizard</Typography>
      <Paper sx={{ p: 3, mb: 3 }}>
        <TextField
          fullWidth
          multiline
          rows={4}
          label="Describe your campaign (e.g., 'Sustainable living and electric cars for families')"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="contained" onClick={handleSearch} disabled={!prompt}>
            Generate Proposals
          </Button>
        </Box>
      </Paper>

      {proposals.length > 0 && (
        <Paper>
          <Box sx={{ p: 2 }}>
            <Typography variant="h6">Suggested Segments</Typography>
          </Box>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Cluster Name</TableCell>
                <TableCell align="right">Article Count</TableCell>
                <TableCell align="right">Estimated Reach (Imp)</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {proposals.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.label}</TableCell>
                  <TableCell align="right">{row.articleCount}</TableCell>
                  <TableCell align="right">{row.reach.toLocaleString()}</TableCell>
                  <TableCell align="right"><Button size="small">Add to Plan</Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Box>
  );
}