'use client'

import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import Cookies from 'js-cookie';
import { FaGithub } from 'react-icons/fa';

const models = [
  { name: 'GPT-3', date: 'June 2020' },
  { name: 'GPT-3.5', date: 'November 2022' },
  { name: 'GPT-4', date: 'March 2023' },
  { name: 'Claude', date: 'March 2023' },
  { name: 'PaLM 2', date: 'May 2023' },
  { name: 'Claude 2', date: 'July 2023' },
];

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

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

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.log('Chart Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong with the chart.</h1>;
    }

    return this.props.children; 
  }
}

export default function Page() {
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    fetchVoteData();
  }, []);

  const fetchVoteData = async () => {
    try {
      const response = await fetch('/api/votes');
      const data = await response.json();
      const formattedData = formatChartData(data);
      setChartData(formattedData);
    } catch (error) {
      console.error('Failed to fetch vote data:', error);
    }
  };

  const formatChartData = (data) => {
    const formattedData = {};
    models.forEach(model => {
      formattedData[model.name] = months.map(month => ({
        date: month,
        Dumber: data[`${model.name}_dumber`] || 0,
        'Still Smart': data[`${model.name}_smart`] || 0
      }));
    });
    return formattedData;
  };

  const handleVote = async (modelName, vote) => {
    try {
      await fetch('/api/votes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ model: modelName, vote }),
      });
      await fetchVoteData(); // Refresh data after voting
      Cookies.set(`voted_${modelName}`, 'true', { expires: 365 });
    } catch (error) {
      console.error('Failed to submit vote:', error);
    }
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
            <ErrorBoundary>
              <ResponsiveContainer width="100%" height="100%" key={JSON.stringify(chartData[model.name])}>
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
            </ErrorBoundary>
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
      <footer className="w-full mt-16 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col items-left justify-center text-gray-600">
            <a href="https://github.com/will4381/dumber-models" target="_blank" rel="noopener noreferrer" className="flex items-center mb-4 hover:text-gray-800 transition-colors duration-300">
              <FaGithub className="mr-2 text-2xl" />
              View the code
            </a>
            <a href="https://twitter.com/hellakusch" target="_blank" rel="noopener noreferrer" className="hover:text-gray-800 transition-colors duration-300">
              Built by @hellakusch
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}