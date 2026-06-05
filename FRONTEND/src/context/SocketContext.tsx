import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { toast } from 'react-hot-toast';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({ socket: null, isConnected: false });

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  useEffect(() => {
    const interval = setInterval(() => {
      const currentToken = localStorage.getItem('token');
      if (currentToken !== token) {
        setToken(currentToken);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [token]);

  useEffect(() => {
    if (!token) {
      setSocket(null);
      setIsConnected(false);
      return;
    }

    const newSocket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000', {
      auth: { token: `Bearer ${token}` }
    });

    newSocket.on('connect', () => setIsConnected(true));
    newSocket.on('disconnect', () => setIsConnected(false));

    newSocket.on('liked-your-post', (data: string) => {
      try {
        const payload = JSON.parse(data);
        const liker = payload.data?.by?.name || 'Someone';
        toast.success(`${liker} liked your post!`, {
          icon: '❤️',
          duration: 4500
        });
      } catch (e) {
        // Ignored
      }
    });

    newSocket.on('comment-on-your-post', (data: string) => {
      try {
        const payload = JSON.parse(data);
        const commenter = payload.data?.by?.name || 'Someone';
        const text = payload.data?.text || '';
        toast.success(`${commenter} commented on your post: "${text}"`, {
          icon: '💬',
          duration: 4500
        });
      } catch (e) {
        // Ignored
      }
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [token]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
