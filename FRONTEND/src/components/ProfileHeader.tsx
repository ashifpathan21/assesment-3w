import { Box, Avatar, Typography, Divider, Stack, Tabs, Tab } from '@mui/material';

interface ProfileHeaderProps {
  user?: {
    name: string;
    username: string;
  };
  stats: {
    posts: number;
    likes: number;
    comments: number;
  };
  activeTab: number;
  onTabChange: (tabValue: number) => void;
}

const ProfileHeader = ({ user, stats, activeTab, onTabChange }: ProfileHeaderProps) => {
  return (
    <Box>
      {/* Cover Photo */}
      <Box sx={{ height: 180, bgcolor: '#e0e0e0', borderRadius: '0 0 12px 12px' }} />

      {/* Avatar & User Details */}
      <Box sx={{ px: 2, position: 'relative', mt: -6, mb: 2 }}>
        <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <Box sx={{ position: 'relative' }}>
            <Avatar 
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}`}
              sx={{ 
                width: 100, 
                height: 100, 
                border: '4px solid white', 
                bgcolor: '#ff9800',
              }} 
            />
          </Box>
        </Stack>

        <Box sx={{ mt: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{user?.name || 'User'}</Typography>
          <Typography variant="caption" color="text.secondary">@{user?.username || 'user'}</Typography>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mt: 0.5 }}>
            <Typography variant="caption" color="text.secondary">Joined Jun 2026</Typography>
          </Stack>
        </Box>

        {/* Stats */}
        <Stack direction="row" spacing={4} sx={{ mt: 2 }}>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', textAlign: 'center', color: 'primary.main' }}>{stats.posts}</Typography>
            <Typography variant="caption" color="text.secondary">Posts</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', textAlign: 'center', color: 'primary.main' }}>{stats.likes}</Typography>
            <Typography variant="caption" color="text.secondary">Likes</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', textAlign: 'center', color: 'primary.main' }}>{stats.comments}</Typography>
            <Typography variant="caption" color="text.secondary">Comments</Typography>
          </Box>
        </Stack>
      </Box>

      <Divider />

      {/* Tabs */}
      <Tabs 
        value={activeTab} 
        onChange={(_, newValue) => onTabChange(newValue)} 
        variant="scrollable" 
        scrollButtons="auto"
        sx={{
          '& .MuiTabs-indicator': { height: 2 },
          '& .MuiTab-root': { textTransform: 'none', fontSize: '0.8rem', fontWeight: 'bold', minWidth: 'auto', px: 2 }
        }}
      >
        <Tab label={`My Posts (${stats.posts})`} />
        <Tab label={`Liked (${stats.likes})`} />
        <Tab label={`Commented (${stats.comments})`} />
      </Tabs>
      <Divider />
    </Box>
  );
};

export default ProfileHeader;
