import { useState } from 'react';
import { Box, Paper, TextField, Button, Typography, Tab, Tabs, Stack } from '@mui/material';
import { userAPI } from '../apis/services/user';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const Auth = () => {
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let response;
      if (tab === 0) {
        response = await userAPI.login({ email: formData.email, password: formData.password });
      } else {
        response = await userAPI.signin(formData);
      }

      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        toast.success(response.data.message);
        navigate('/');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 400, borderRadius: 3 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', textAlign: 'center', color: 'primary.main' }}>
          Welcome back
        </Typography>
        
        <Tabs value={tab} onChange={(_, v) => setTab(v)} centered sx={{ mb: 3 }}>
          <Tab label="Login" />
          <Tab label="Sign Up" />
        </Tabs>

        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            {tab === 1 && (
              <>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <TextField
                  fullWidth
                  label="Username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </>
            )}
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <Button
              fullWidth
              variant="contained"
              type="submit"
              size="large"
              disabled={loading}
              sx={{ mt: 2, py: 1.5, borderRadius: 2 }}
            >
              {loading ? 'Processing...' : (tab === 0 ? 'Login' : 'Sign Up')}
            </Button>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
};

export default Auth;