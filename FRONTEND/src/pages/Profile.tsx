import { Box, Typography, CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import ProfileHeader from '../components/ProfileHeader';
import PostCard from '../components/PostCard';
import { userAPI } from '../apis/services/user';
import { toast } from 'react-hot-toast';

const Profile = () => {
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await userAPI.getProfile();
      if (response.data.success) {
        setProfileData(response.data.data);
        toast.success(response.data.message);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Determine which posts to show based on the active tab
  const getDisplayPosts = () => {
    if (activeTab === 0) {
      return profileData?.posts || [];
    } else if (activeTab === 1) {
      return (profileData?.likes || []).map((l: any) => l.post).filter(Boolean);
    } else if (activeTab === 2) {
      return (profileData?.comments || []).map((c: any) => c.post).filter(Boolean);
    }
    return [];
  };

  const displayPosts = getDisplayPosts();

  return (
    <Box sx={{ bgcolor: 'white', minHeight: '100vh', mt: -2, mx: -2 }}>
      <ProfileHeader 
        user={profileData?.user} 
        stats={{
          posts: profileData?.posts?.length || 0,
          likes: profileData?.likes?.length || 0,
          comments: profileData?.comments?.length || 0
        }}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      <Box sx={{ p: 2 }}>
        {displayPosts.length > 0 ? (
          displayPosts.map((post: any) => {
            const postCreator = post.createdBy && typeof post.createdBy === 'object' 
              ? post.createdBy 
              : profileData?.user;

            return (
              <PostCard 
                key={post._id} 
                id={post._id}
                user={{
                  name: postCreator?.name || 'Anonymous',
                  handle: postCreator?.username || 'unknown',
                  avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${postCreator?.username}`
                }}
                createdBy={postCreator?._id || postCreator}
                date={new Date(post.createdAt).toLocaleDateString()}
                content={post.caption}
                image={post.contentUrl}
                likes={post.likes || []}
                comments={post.comments || []}
                onDelete={fetchProfile}
              />
            );
          })
        ) : (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              No posts found.
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Profile;