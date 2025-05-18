import React from 'react';
import { fakeUsers } from '../data/fakeUsers';

const PresenceBar = () => {
  return (
    <div className="flex space-x-4 p-3 bg-white/80 backdrop-blur-sm shadow-md rounded-2xl overflow-x-auto">
      {fakeUsers.map((user) => {
        let statusColor = 'bg-gray-400';
        let statusAnimation = '';

        if (user.status === 'active') {
          statusColor = 'bg-green-500';
          statusAnimation = 'animate-pulse';
        } else if (user.status === 'typing') {
          statusColor = 'bg-yellow-400';
          statusAnimation = 'animate-blink'; 
        }

        return (
          <div
            key={user.id}
            className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 rounded-lg p-2 transition"
            title={`${user.name} is ${user.status}`}
          >
            <div className="relative">
              <span className="text-2xl rounded-full overflow-hidden shadow-lg inline-block">
                {user.avatar}
              </span>
              <span
                className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${statusColor} ${statusAnimation}`}
              />
            </div>
            <span className="text-sm font-semibold text-gray-700 whitespace-nowrap">
              {user.name}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default PresenceBar;
