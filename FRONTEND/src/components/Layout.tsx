import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Avatar, Box, BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import { Home as HomeIcon, Person as PersonIcon, Logout as LogoutIcon } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [value, setValue] = React.useState(location.pathname);

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
    navigate(newValue);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/auth');
  };

  return (
    <Box sx={{ pb: 7, bgcolor: '#f0f2f5', minHeight: '100vh' }}>
      <AppBar position="sticky" color="inherit" elevation={0} sx={{ borderBottom: '1px solid #dddfe2' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
            Social
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton onClick={() => navigate('/profile')}>
              <Avatar sx={{ width: 32, height: 32 }} />
            </IconButton>
            <IconButton onClick={handleLogout} color="inherit" aria-label="logout">
              <LogoutIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Box sx={{ maxWidth: 600, margin: '0 auto', p: 2 }}>
        {children}
      </Box>

      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
        <BottomNavigation value={value} onChange={handleChange} showLabels>
          <BottomNavigationAction label="Home" value="/" icon={<HomeIcon />} />
          <BottomNavigationAction label="Profile" value="/profile" icon={<PersonIcon />} />
        </BottomNavigation>
      </Paper>
    </Box>
  );
};

export default Layout;
