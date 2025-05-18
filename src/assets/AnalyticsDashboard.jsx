import React from 'react';
import { fakeMessages } from '../data/fakeMessages';
import { fakeUsers } from '../data/fakeUsers';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const data = fakeUsers.map((user) => ({
  name: user.name,
  messages: fakeMessages.filter((m) => m.userId === user.id).length,
}));

const AnalyticsDashboard = () => {
  return (
    <div className="p-6 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 rounded-2xl shadow-md space-y-4 border border-gray-200 hover:shadow-lg transition-shadow duration-300">
      <h2 className="text-lg font-semibold mb-2">Message Activity</h2>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="messages" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AnalyticsDashboard;