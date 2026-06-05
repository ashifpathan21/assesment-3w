import React, { useState, useEffect } from 'react';
import { Card, CardContent, TextField, Box, IconButton, Button, Avatar, Divider, Stack, Popover } from '@mui/material';
import { PhotoCamera, EmojiEmotions, Close as CloseIcon } from '@mui/icons-material';
import { postAPI } from '../apis/services/post';
import { toast } from 'react-hot-toast';

const EMOJIS = [
  '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', 
  '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😋', '😛', '😜', 
  '😎', '😏', '😒', '😞', '😔', '😢', '😭', '😤', '😠', '😡', 
  '👍', '👎', '👌', '✌️', '🤞', '🤙', '👊', '👋', '👏', '🙌', 
  '🙏', '💪', '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', 
  '🎉', '✨', '🔥', '🌟', '🚀', '💯', '🤝', '🎈', '🎁'
];

interface CreatePostProps {
  onPostCreated: () => void;
}

const CreatePost = ({ onPostCreated }: CreatePostProps) => {
  const [caption, setCaption] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [emojiAnchorEl, setEmojiAnchorEl] = useState<HTMLButtonElement | null>(null);

  // Clean up object URL when component unmounts or file changes
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    if (selectedFile) {
      setPreviewUrl(URL.createObjectURL(selectedFile));
    } else {
      setPreviewUrl(null);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const handlePost = async () => {
    if (!caption && !file) return;
    
    setLoading(true);
    try {
      const formData = new FormData();
      if (caption) formData.append('caption', caption);
      if (file) formData.append('file', file);

      const response = await postAPI.create(formData);
      if (response.data.success) {
        toast.success(response.data.message);
        setCaption('');
        handleRemoveFile();
        onPostCreated();
      }
    } catch (error) {
      toast.error('Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  const handleEmojiClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setEmojiAnchorEl(event.currentTarget);
  };

  const handleEmojiClose = () => {
    setEmojiAnchorEl(null);
  };

  const handleEmojiSelect = (emoji: string) => {
    setCaption((prev) => prev + emoji);
    setEmojiAnchorEl(null);
  };

  return (
    <Card sx={{ mb: 2, borderRadius: 3 }}>
      <CardContent sx={{ pb: '12px !important' }}>
        <Box sx={{ display: 'flex', mb: 2 }}>
          <Stack direction="row" spacing={1} sx={{ width: '100%', alignItems: 'center' }}>
            <Avatar sx={{ width: 40, height: 40 }} />
            <TextField
              fullWidth
              placeholder="What's on your mind?"
              variant="standard"
              slotProps={{ input: { disableUnderline: true } }}
              sx={{ ml: 1 }}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
          </Stack>
        </Box>
        {previewUrl && file && (
          <Box sx={{ position: 'relative', mb: 2, borderRadius: 2, overflow: 'hidden', maxWidth: '100%', maxHeight: 300, display: 'flex', justifyContent: 'center', bgcolor: '#f0f2f5' }}>
            {file.type.startsWith('video/') ? (
              <Box component="video" src={previewUrl} controls sx={{ maxWidth: '100%', maxHeight: 300, objectFit: 'contain' }} />
            ) : (
              <Box component="img" src={previewUrl} sx={{ maxWidth: '100%', maxHeight: 300, objectFit: 'contain' }} />
            )}
            <IconButton
              size="small"
              onClick={handleRemoveFile}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                bgcolor: 'rgba(0, 0, 0, 0.6)',
                color: 'white',
                '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.8)' }
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        )}
        <Divider sx={{ mb: 1.5 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Stack direction="row" spacing={0.5}>
            <input
              type="file"
              accept="image/*,video/*"
              style={{ display: 'none' }}
              id="icon-button-file"
              onChange={handleFileChange}
            />
            <label htmlFor="icon-button-file">
              <IconButton size="small" color="primary" component="span">
                <PhotoCamera fontSize="small" />
              </IconButton>
            </label>
            <IconButton size="small" sx={{ color: '#ffc107' }} onClick={handleEmojiClick}>
              <EmojiEmotions fontSize="small" />
            </IconButton>
          </Stack>
          <Button 
            variant="contained" 
            size="small" 
            sx={{ borderRadius: 5, px: 3 }}
            onClick={handlePost}
            disabled={loading || (!caption && !file)}
          >
            {loading ? 'Posting...' : 'Post'}
          </Button>
        </Box>

        <Popover
          open={Boolean(emojiAnchorEl)}
          anchorEl={emojiAnchorEl}
          onClose={handleEmojiClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          slotProps={{
            paper: {
              sx: {
                p: 1.5,
                maxWidth: 280,
                maxHeight: 200,
                overflowY: 'auto',
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
              }
            }
          }}
        >
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0.5 }}>
            {EMOJIS.map((emoji) => (
              <IconButton
                key={emoji}
                size="small"
                onClick={() => handleEmojiSelect(emoji)}
                sx={{ fontSize: '1.2rem', p: 0.5, borderRadius: 2, '&:hover': { bgcolor: '#f0f2f5' } }}
              >
                {emoji}
              </IconButton>
            ))}
          </Box>
        </Popover>
      </CardContent>
    </Card>
  );
};

export default CreatePost;
