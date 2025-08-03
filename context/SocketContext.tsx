'use client'
import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { useToast } from '@/components/aspect-ui';

interface SocketContextType {
  socket: Socket | null;
}

const SocketContext = createContext<SocketContextType>({ socket: null });

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { user } = useAuth();
  const {toast} = useToast()

  useEffect(() => {
    if (user) {
      const newSocket = io('https://socket-server-cjq4.onrender.com/');
      // const newSocket = io('http://localhost:5000/');

      newSocket.on('connect', () => {
        console.log('Connected to server');
        newSocket.emit('join-room', user.id);
      });

      newSocket.on('parcel-updated', (parcel) => {
        if (parcel.customer._id === user.id || parcel.agent?._id === user.id) {
          toast({
            message: `Parcel ${parcel.trackingId} status updated to ${parcel.status}`,
            type: 'success',
            duration: 3000
          })
        }
      });

      newSocket.on('new-parcel', (parcel) => {
        if (user.role === 'admin' || user.role === 'agent') {
          toast({
            message: `New parcel booking: ${parcel.trackingId}`,
            type: 'success',
            duration: 3000
          })
        }
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    }
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}