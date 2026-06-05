import { Box, CircularProgress, Typography, Button } from '@mui/material';
import { useEffect, useState } from 'react';
import CreatePost from '../components/CreatePost';
import PostCard from '../components/PostCard';
import { postAPI } from '../apis/services/post';
import { toast } from 'react-hot-toast';

const Feed = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchPosts(true);
  }, []);

  const fetchPosts = async (reset: boolean = false) => {
    const targetPage = reset ? 0 : page;
    if (reset) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const response = await postAPI.getFeed(targetPage);
      if (response.data.success) {
        const newPosts = response.data.data;
        if (reset) {
          setPosts(newPosts);
          setPage(1);
        } else {
          setPosts((prev) => [...prev, ...newPosts]);
          setPage((prev) => prev + 1);
        }
        setHasMore(newPosts.length === 30);
        if (newPosts.length > 0) {
          toast.success('Feed updated');
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to fetch posts');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  return (
    <Box>
      <CreatePost onPostCreated={() => fetchPosts(true)} />
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : posts.length > 0 ? (
        <>
          {posts.map((post) => (
            <PostCard 
              key={post._id} 
              id={post._id}
              user={{
                name: post.createdBy?.name || 'Anonymous',
                handle: post.createdBy?.username || 'unknown',
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.createdBy?.username}`
              }}
              createdBy={post.createdBy?._id || post.createdBy}
              date={new Date(post.createdAt).toLocaleDateString()}
              content={post.caption}
              image={post.contentUrl}
              likes={post.likes || []}
              comments={post.comments || []}
              onDelete={() => fetchPosts(true)}
            />
          ))}

          {hasMore && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, mb: 4 }}>
              <Button 
                variant="outlined" 
                onClick={() => fetchPosts(false)} 
                disabled={loadingMore}
                sx={{ borderRadius: 5, px: 4, textTransform: 'none' }}
              >
                {loadingMore ? 'Loading...' : 'Load More'}
              </Button>
            </Box>
          )}
        </>
      ) : (
        <Box sx={{ textAlign: 'center', p: 4 }}>
          <Typography color="text.secondary">No posts found.</Typography>
        </Box>
      )}
    </Box>
  );
};

export default Feed;