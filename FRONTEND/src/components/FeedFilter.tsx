import { Tabs, Tab, Box, Paper } from '@mui/material';
import React from 'react';

const FeedFilter = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ mb: 2, mt: 1 }}>
      <Paper elevation={0} sx={{ bgcolor: 'transparent' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTabs-indicator': { display: 'none' },
            '& .MuiTab-root': {
              minWidth: 'auto',
              textTransform: 'none',
              fontWeight: 'medium',
              fontSize: '0.8rem',
              color: 'text.secondary',
              padding: '6px 16px',
              marginRight: 1,
              borderRadius: 5,
              border: '1px solid #dddfe2',
              bgcolor: 'background.paper',
              '&.Mui-selected': {
                color: 'white',
                bgcolor: '#1976d2',
                borderColor: '#1976d2',
              },
            },
          }}
        >
          <Tab label="All Post" />
          <Tab label="Latest" />
        </Tabs>
      </Paper>
    </Box>
  );
};

export default FeedFilter;
