import React, { useState, useMemo } from 'react';
import { fakeMessages } from '../data/fakeMessages';
import { fakeUsers } from '../data/fakeUsers';
import { Avatar, Tooltip, TextField, Button } from '@mui/material';

let messageIdCounter = 1000; 

const ThreadTree = () => {
  const [collapsed, setCollapsed] = useState({});
  const [messages, setMessages] = useState(fakeMessages);
  const [replyText, setReplyText] = useState({});
  const [branchLabel, setBranchLabel] = useState({});

  const userMap = useMemo(() => {
    return fakeUsers.reduce((acc, user) => {
      acc[user.id] = user;
      return acc;
    }, {});
  }, []);

  const messageChildrenMap = useMemo(() => {
    const map = {};
    messages.forEach((msg) => {
      const parentId = msg.parentId || null;
      if (!map[parentId]) map[parentId] = [];
      map[parentId].push(msg);
    });
    return map;
  }, [messages]);

  const toggleCollapse = (id) => {
    setCollapsed((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleReplyChange = (msgId, value) => {
    setReplyText((prev) => ({ ...prev, [msgId]: value }));
  };

  const handleBranchLabelChange = (msgId, value) => {
    setBranchLabel((prev) => ({ ...prev, [msgId]: value }));
  };

  const addReply = (parentId) => {
    if (!replyText[parentId]?.trim()) return;

    const newMsg = {
      id: (messageIdCounter++).toString(),
      text: replyText[parentId],
      userId: 'agent', // Assume the agent is replying
      parentId: parentId,
      timestamp: new Date().toLocaleTimeString(),
      branchLabel: branchLabel[parentId] || '',
    };

    setMessages((prev) => [...prev, newMsg]);
    setReplyText((prev) => ({ ...prev, [parentId]: '' }));
    setBranchLabel((prev) => ({ ...prev, [parentId]: '' }));
    setCollapsed((prev) => ({ ...prev, [parentId]: false }));
  };

  const renderThreads = (parentId = null, level = 0) => {
    const threadMessages = messageChildrenMap[parentId] || [];

    return threadMessages.map((msg) => {
      const children = messageChildrenMap[msg.id] || [];
      const isCollapsed = collapsed[msg.id];
      const user = userMap[msg.userId];
      const isRootThread = parentId === null;

      return (
        <div key={msg.id} className="relative pl-6 mb-6">
          {level > 0 && (
            <span
              className="absolute top-0 left-3 h-full border-l-2 border-gray-300"
              aria-hidden="true"
            />
          )}

          <div
            className="flex items-center gap-2 cursor-pointer select-none"
            onClick={() => toggleCollapse(msg.id)}
            title={isCollapsed ? 'Expand thread' : 'Collapse thread'}
          >
            {children.length > 0 && (
              <svg
                className={`w-4 h-4 transition-transform duration-200 ${
                  isCollapsed ? 'rotate-0' : 'rotate-90'
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            )}

            <div
              className={`rounded-md p-3 w-full ${
                level % 2 === 0 ? 'bg-gray-50' : 'bg-gray-100'
              } hover:bg-blue-50 transition-colors flex flex-col`}
            >
              <div className="flex items-center gap-2 mb-1">
                {isRootThread && (
                  <>
                    <Tooltip title={`Started by ${user?.name}`}>
                      <Avatar
                        src={user?.avatar}
                        alt={user?.name}
                        sx={{ width: 24, height: 24 }}
                      />
                    </Tooltip>
                    <span className="font-semibold text-sm text-blue-700">
                      Thread started by {user?.name}
                    </span>
                  </>
                )}
              </div>

              {msg.branchLabel && (
                <div className="text-xs font-medium text-green-600 mb-1">
                  Branch: {msg.branchLabel}
                </div>
              )}

              <div className="text-sm text-gray-800 mb-1">{msg.text}</div>
              <div className="text-xs text-right text-gray-500">{msg.timestamp}</div>

              {/* Reply input */}
              <div className="mt-3 space-y-2">
                <TextField
                  size="small"
                  label="Reply to this message"
                  value={replyText[msg.id] || ''}
                  onChange={(e) => handleReplyChange(msg.id, e.target.value)}
                  fullWidth
                />
                <TextField sx={{marginTop: 1}}
                  size="small"
                  label="Branch label (optional, e.g., Approach A)"
                  value={branchLabel[msg.id] || ''}
                  onChange={(e) => handleBranchLabelChange(msg.id, e.target.value)}
                  fullWidth
                />
                <Button sx={{marginTop: 1}}
                  variant="contained"
                  size="small"
                  onClick={() => addReply(msg.id)}
                >
                  Add Reply
                </Button>
              </div>
            </div>
          </div>

          {!isCollapsed && children.length > 0 && (
            <div className="ml-4 mt-2">{renderThreads(msg.id, level + 1)}</div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow max-h-[75vh] overflow-y-auto">
      {renderThreads()}
    </div>
  );
};

export default ThreadTree;
