'use client'

import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import Cookies from 'js-cookie';

const models = [
  { name: 'GPT-3', date: 'June 2020' },
  { name: 'GPT-3.5', date: 'November 2022' },
  { name: 'GPT-4', date: 'March 2023' },
  { name: 'Claude', date: 'March 2023' },
  { name: 'PaLM 2', date: 'May 2023' },
  { name: 'Claude 2', date: 'July 2023' },
];

const initialChartData = [
  { date: 'Jan', Dumber: 0, 'Still Smart': 0 },
  { date: 'Feb', Dumber: 0, 'Still Smart': 0 },
  { date: 'Mar', Dumber: 0, 'Still Smart': 0 },
  { date: 'Apr', Dumber: 0, 'Still Smart': 0 },
  { date: 'May', Dumber: 0, 'Still Smart': 0 },
  { date: 'Jun', Dumber: 0, 'Still Smart': 0 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border border-gray-300 rounded shadow-md">
        <p className="text-sm font-semibold text-gray-800">{`Date: ${label}`}</p>
        <p className="text-sm text-gray-800">👍 Still Smart: {payload[1].value}</p>
        <p className="text-sm text-gray-800">👎 Dumber: {payload[0].value}</p>
      </div>
    );
  }
  return null;
};

export default function Page() {
  const [chartData, setChartData] = useState(
    Object.fromEntries(models.map(model => [model.name, initialChartData]))
  );

  useEffect(() => {
    setChartData(prevData =>
      Object.fromEntries(
        Object.entries(prevData).map(([modelName, data]) => [
          modelName,
          data.map(item => ({
            ...item,
            Dumber: Math.floor(Math.random() * 30),
            'Still Smart': Math.floor(Math.random() * 30)
          }))
        ])
      )
    );
  }, []);

  const handleVote = (modelName, vote) => {
    setChartData(prevData => ({
      ...prevData,
      [modelName]: prevData[modelName].map((item, index) => 
        index === prevData[modelName].length - 1
          ? {
              ...item,
              Dumber: vote === 'dumber' 
                ? item.Dumber + Math.floor(Math.random() * 5) + 1
                : Math.max(0, item.Dumber - Math.floor(Math.random() * 5) - 1),
              'Still Smart': vote === 'smart'
                ? item['Still Smart'] + Math.floor(Math.random() * 5) + 1
                : Math.max(0, item['Still Smart'] - Math.floor(Math.random() * 5) - 1)
            }
          : item
      )
    }));
    // Set a cookie to indicate that the user has voted for this model
    Cookies.set(`voted_${modelName}`, 'true', { expires: 365 });
  };

  function InteractiveChart({ model }) {
    const [hasVoted, setHasVoted] = useState(false);

    useEffect(() => {
      const voted = Cookies.get(`voted_${model.name}`);
      setHasVoted(voted === 'true');
    }, [model.name]);

    return (
      <div key={model.name} className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
        <h3 className="text-2xl font-bold mb-3 font-['Noto_Sans',_sans-serif] text-gray-800">{model.name}</h3>
        <p className="text-sm text-gray-600 mb-6">📅 Tracking since {model.date}</p>
        <div className="h-64 mb-6">
          {chartData[model.name] ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData[model.name]} margin={{ top: 5, right: 5, left: -30, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorDumber" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FFA07A" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#FFA07A" stopOpacity={0.2}/>
                  </linearGradient>
                  <linearGradient id="colorStillSmart" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#87CEFA" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#87CEFA" stopOpacity={0.2}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#888888', fontSize: 12}}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#888888', fontSize: 12}} 
                  width={30}
                  dx={-10}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="Dumber" stackId="1" stroke="#FF6347" fill="url(#colorDumber)" />
                <Area type="monotone" dataKey="Still Smart" stackId="1" stroke="#4682B4" fill="url(#colorStillSmart)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">Loading chart data...</p>
            </div>
          )}
        </div>
        <div className="flex justify-around mt-6">
          {hasVoted ? (
            <button
              className="bg-red-500 bg-opacity-70 text-white font-semibold py-2 px-4 rounded-xl border border-red-600 flex items-center w-full justify-center"
              disabled
            >
              <span className="mr-2">🔒</span> Already Voted
            </button>
          ) : (
            <>
              <button
                onClick={() => handleVote(model.name, 'dumber')}
                className="bg-white hover:bg-gray-100 text-black font-semibold py-2 px-4 rounded-xl border border-gray-300 transition-colors duration-300 flex items-center"
              >
                <span className="mr-2">👎</span> Dumber
              </button>
              <button
                onClick={() => handleVote(model.name, 'smart')}
                className="bg-white hover:bg-gray-100 text-black font-semibold py-2 px-4 rounded-xl border border-gray-300 transition-colors duration-300 flex items-center"
              >
                <span className="mr-2">👍</span> Still Smart
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-4 pt-16 bg-gray-100">
      <div className="max-w-6xl w-full mt-4">
        <h1 className="text-5xl font-bold text-left text-black mb-6">
          Dumber Models?
        </h1>
        <p className="text-xl text-left max-w-3xl mb-12 text-gray-700">
          Have current LLMs gotten dumber as time has gone on? Vote and see for yourself.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 w-full mt-8">
          {models.map((model) => (
            <InteractiveChart key={model.name} model={model} />
          ))}
        </div>
      </div>
    </main>
  );
}