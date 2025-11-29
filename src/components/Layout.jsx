import React from 'react';
import { Box, AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import PublicIcon from '@mui/icons-material/Public';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';

const NAV_ITEMS = [
  { label: 'Inventory Explorer', path: '/', icon: <AnalyticsIcon sx={{ mr: 1 }} /> },
  { label: 'Campaign Wizard', path: '/wizard', icon: <AutoFixHighIcon sx={{ mr: 1 }} /> },
  { label: '3D Cluster Map', path: '/3d', icon: <PublicIcon sx={{ mr: 1 }} /> },
];

export default function Layout({ children }) {
  const location = useLocation();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <AppBar position="static" sx={{ backgroundColor: '#0f172a' }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            {/* Logo Area */}
            <Typography
              variant="h6"
              noWrap
              sx={{
                mr: 4,
                display: { xs: 'none', md: 'flex' },
                fontWeight: 700,
                letterSpacing: '.1rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              DPG MEDIA | CONTEXT
            </Typography>

            {/* Navigation Menu */}
            <Box sx={{ flexGrow: 1, display: 'flex', gap: 2 }}>
              {NAV_ITEMS.map((item) => (
                <Button
                  key={item.label}
                  component={Link}
                  to={item.path}
                  sx={{
                    my: 2,
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: location.pathname === item.path ? 'rgba(255,255,255,0.1)' : 'transparent',
                    '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' }
                  }}
                >
                  {item.icon}
                  {item.label}
                </Button>
              ))}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Main Content Area */}
      <Box component="main" sx={{ flexGrow: 1, bgcolor: '#f1f5f9', overflow: 'hidden' }}>
        {children}
      </Box>
    </Box>
  );
}