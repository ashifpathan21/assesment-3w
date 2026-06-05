import { Card, CardHeader, CardContent, CardActions, Avatar, IconButton, Typography, Box, Divider, Stack, Menu, MenuItem, TextField, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import { Favorite, FavoriteBorder, ChatBubbleOutlined, MoreVert, Delete as DeleteIcon, Send as SendIcon } from '@mui/icons-material';
import React, { useState, useEffect } from 'react';
import { useSocket } from '../context/SocketContext';
import { postAPI } from '../apis/services/post';
import { toast } from 'react-hot-toast';

interface PostProps {
  id: string;
  user: {
    name: string;
    handle: string;
    avatar: string;
  };
  createdBy: string;
  date: string;
  content: string;
  image?: string;
  likes: any[];
  comments: any[];
  onDelete?: (id: string) => void;
}

const PostCard = ({ id, user, createdBy, date, content, image, likes: initialLikes, comments: initialComments, onDelete }: PostProps) => {
  const { socket } = useSocket();
  const [likes, setLikes] = useState(initialLikes);
  const [comments, setComments] = useState(initialComments);
  const [isLiked, setIsLiked] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  
  // Comment section state
  const [showComments, setShowComments] = useState(false);
  const [newCommentText, setNewCommentText] = useState('');

  const currentUserId = (() => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.id;
    } catch {
        return null;
    }
  })();

  const isOwnPost = currentUserId === createdBy;

  useEffect(() => {
    setIsLiked(likes.some(l => l.by === currentUserId || l.by?._id === currentUserId));
  }, [likes, currentUserId]);

  useEffect(() => {
    if (!socket) return;

    const handleMessage = (message: string) => {
        try {
            const response = JSON.parse(message);
            if (response.success && response.data._id === id) {
                setLikes(response.data.likes);
                setComments(response.data.comments);
            }
        } catch (e) {
            // Error logged removed as requested
        }
    };

    socket.on('message', handleMessage);
    return () => {
        socket.off('message', handleMessage);
    };
  }, [id, socket]);

  const handleLike = () => {
    if (!socket) return;
    if (isLiked) {
        socket.emit('unlike-post', { id });
        setIsLiked(false);
    } else {
        socket.emit('like-post', { id });
        setIsLiked(true);
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = async () => {
    setAnchorEl(null);
    try {
        const res = await postAPI.delete(id);
        if (res.status === 204 || res.data.success) {
            toast.success('Post deleted');
            onDelete?.(id);
        }
    } catch (error) {
        toast.error('Failed to delete post');
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!socket || !newCommentText.trim()) return;

    socket.emit('comment-post', { id, text: newCommentText.trim() });
    setNewCommentText('');
  };

  const handleDeleteComment = (commentId: string) => {
    if (!socket) return;
    socket.emit('delete-comment', { id, commentId });
  };

  return (
    <Card sx={{ mb: 2, borderRadius: 3, position: 'relative', overflow: 'visible' }}>
      <CardHeader
        avatar={<Avatar src={user.avatar} />}
        action={
          isOwnPost && (
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <IconButton size="small" onClick={handleMenuOpen}>
                  <MoreVert />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
                  <DeleteIcon sx={{ mr: 1 }} fontSize="small" /> Delete Post
                </MenuItem>
              </Menu>
            </Stack>
          )
        }
        title={
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
            {user.name} <Typography component="span" variant="caption" color="text.secondary">@{user.handle}</Typography>
          </Typography>
        }
        subheader={date}
        sx={{ pb: 1 }}
      />
      <CardContent sx={{ pt: 0 }}>
        <Typography variant="body2" color="text.primary" sx={{ mb: 2 }}>
          {content}
        </Typography>
        {image && (
          image.includes('/video/upload/') || image.match(/\.(mp4|webm|ogg|mov)$/i) ? (
            <Box
              component="video"
              src={image}
              controls
              sx={{
                width: '100%',
                borderRadius: 2,
                maxHeight: 400,
                objectFit: 'contain',
                bgcolor: '#000'
              }}
            />
          ) : (
            <Box
              component="img"
              src={image}
              sx={{
                width: '100%',
                borderRadius: 2,
                maxHeight: 400,
                objectFit: 'cover',
              }}
            />
          )
        )}
      </CardContent>
      <Divider />
      <CardActions sx={{ justifyContent: 'space-around', py: 0.5 }}>
        <IconButton size="small" onClick={handleLike} color={isLiked ? "primary" : "default"}>
          {isLiked ? <Favorite sx={{ fontSize: 20, mr: 0.5 }} /> : <FavoriteBorder fontSize="small" sx={{ mr: 0.5 }} />}
          <Typography variant="caption">{likes.length}</Typography>
        </IconButton>
        <IconButton size="small" onClick={() => setShowComments(!showComments)} color={showComments ? "primary" : "default"}>
          <ChatBubbleOutlined fontSize="small" sx={{ mr: 0.5 }} />
          <Typography variant="caption">{comments.length}</Typography>
        </IconButton>
      </CardActions>

      {showComments && (
        <Box sx={{ p: 2, bgcolor: '#fbfbfb', borderBottomLeftRadius: 12, borderBottomRightRadius: 12 }}>
          <Divider sx={{ mb: 1.5 }} />
          
          {/* Comments List */}
          <List sx={{ maxH: 200, overflowY: 'auto', p: 0, mb: 1.5 }}>
            {comments.length > 0 ? (
              comments.map((comment: any) => {
                const commentUser = comment.by;
                const isOwnComment = commentUser?._id === currentUserId || commentUser === currentUserId;

                return (
                  <ListItem 
                    key={comment._id} 
                    alignItems="flex-start" 
                    sx={{ px: 0, py: 1 }}
                    secondaryAction={
                      isOwnComment && (
                        <IconButton edge="end" size="small" onClick={() => handleDeleteComment(comment._id)} sx={{ color: 'text.secondary' }}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      )
                    }
                  >
                    <ListItemAvatar sx={{ minWidth: 40 }}>
                      <Avatar 
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${commentUser?.username || 'user'}`}
                        sx={{ width: 30, height: 30 }}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                          {commentUser?.name || 'Anonymous'}
                          <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                            @{commentUser?.username || 'unknown'}
                          </Typography>
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body2" color="text.primary" sx={{ mt: 0.5 }}>
                          {comment.text}
                        </Typography>
                      }
                    />
                  </ListItem>
                );
              })
            ) : (
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', py: 1 }}>
                No comments yet. Be the first to comment!
              </Typography>
            )}
          </List>

          {/* Comment Form */}
          <Box component="form" onSubmit={handleAddComment} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Write a comment..."
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              sx={{ bgcolor: 'white', '& fieldset': { borderRadius: 5 } }}
            />
            <IconButton type="submit" color="primary" disabled={!newCommentText.trim()}>
              <SendIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      )}
    </Card>
  );
};

export default PostCard;
