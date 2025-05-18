import React, { useEffect, useRef, } from 'react';
import { CardContent, Typography, Avatar } from '@mui/material';
import { fakeUsers } from '../data/fakeUsers';
import { fakeMessages } from '../data/fakeMessages';

const ChatWindow = ({ searchTerm = '' }) => {
  const scrollRef = useRef(null);

  const filteredMessages = React.useMemo(() => {
    if (!searchTerm.trim()) return fakeMessages;
    const lowerSearch = searchTerm.toLowerCase();

    return fakeMessages.filter((msg) => {
      const user = fakeUsers.find((u) => u.id === msg.userId);
      return (
        msg.text.toLowerCase().includes(lowerSearch) ||
        (user?.name.toLowerCase().includes(lowerSearch) ?? false)
      );
    });
  }, [searchTerm]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [filteredMessages]);

  return (
    <div
      ref={scrollRef}
      className="p-6 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 rounded-2xl shadow-md space-y-4 border border-gray-200 hover:shadow-lg transition-shadow duration-300"
    >
      {filteredMessages.map((msg) => {
        const user = fakeUsers.find((u) => u.id === msg.userId);
        const isAgent = msg.userId === 'agent';

        return (
          <div
            key={msg.id}
            className={`flex items-start gap-3 max-w-xl ${
              isAgent ? 'ml-auto flex-row-reverse' : 'mr-auto'
            } animate-fadeIn`}
          >
            <Avatar
              src={user?.avatar}
              alt={user?.name}
              className="w-10 h-10"
              sx={{ bgcolor: isAgent ? '#2563eb' : '#9ca3af' }}
            />
            <div
              className={`rounded-2xl px-4 py-3 shadow-md ${
                isAgent ? 'bg-blue-100 text-blue-900' : 'bg-gray-100 text-gray-900'
              }`}
              style={{ wordBreak: 'break-word' }}
            >
              <Typography variant="subtitle2" component="div" className="mb-1 font-semibold">
                {user?.name}
              </Typography>
              <Typography variant="body1" component="p" className="mb-1">
                {msg.text}
              </Typography>
              <Typography variant="caption" color="text.secondary" className="block text-right">
                {msg.timestamp}
              </Typography>
            </div>
          </div>
        );
      })}
      {filteredMessages.length === 0 && (
        <Typography variant="body2" color="text.secondary" align="center" mt={4}>
          No messages found.
        </Typography>
      )}
    </div>
  );
};

export default ChatWindow;
