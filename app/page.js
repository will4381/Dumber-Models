'use client'

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-4 pt-16 bg-gray-100">
      <div className="max-w-6xl w-full mt-4">
        <h1 className="text-5xl font-bold text-left text-black mb-6">
          Dumber Models?
        </h1>
        <p className="text-xl text-left max-w-3xl mb-12 text-gray-700">
          Have current LLMs gotten dumber as time has gone on? Vote and see for yourself.
        </p>
        <ModelVoting />
      </div>
    </main>
  );
}

function InteractiveChart({ models }) {
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    // Initialize chart data with random values
    const initialData = Object.fromEntries(
      models.map(model => [
        model.name,
        [
          { date: 'Jan', Dumber: Math.floor(Math.random() * 30), 'Still Smart': Math.floor(Math.random() * 30) },
          { date: 'Feb', Dumber: Math.floor(Math.random() * 30), 'Still Smart': Math.floor(Math.random() * 30) },
          { date: 'Mar', Dumber: Math.floor(Math.random() * 30), 'Still Smart': Math.floor(Math.random() * 30) },
          { date: 'Apr', Dumber: Math.floor(Math.random() * 30), 'Still Smart': Math.floor(Math.random() * 30) },
          { date: 'May', Dumber: Math.floor(Math.random() * 30), 'Still Smart': Math.floor(Math.random() * 30) },
          { date: 'Jun', Dumber: Math.floor(Math.random() * 30), 'Still Smart': Math.floor(Math.random() * 30) },
        ]
      ])
    );
    setChartData(initialData);
    console.log('Chart data initialized:', initialData);
  }, []);

  const handleVote = (modelName, vote) => {
    console.log(`Voted ${vote} for ${modelName}`);
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
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 w-full mt-8">
      {models.map((model) => (
        <div key={model.name} className="bg-white rounded-xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 hover:scale-105 border border-black">
          <h3 className="text-2xl font-bold mb-3 font-['Noto_Sans',_sans-serif] text-gray-800">{model.name}</h3>
          <p className="text-sm text-gray-600 mb-6">📅 Tracking since {model.date}</p>
          <div className="h-64 mb-6">
            {chartData[model.name] ? (
              <div>Chart placeholder</div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">Loading chart data...</p>
              </div>
            )}
          </div>
          <div className="flex justify-around mt-6">
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
          </div>
        </div>
      ))}
    </div>
  );
}






export default function Home() {
  const [chartData, setChartData] = useState(
    Object.fromEntries(models.map(model => [model.name, initialChartData]))
  );

  useEffect(() => {
    // Initialize chart data with random values
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
    console.log('Chart data initialized:', chartData);
  }, []);

  const handleVote = (modelName, vote) => {
    console.log(`Voted ${vote} for ${modelName}`);
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
  };


function InteractiveChart({ models }) {
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    // Initialize chart data with random values
    const initialData = Object.fromEntries(
      models.map(model => [
        model.name,
        [
          { date: 'Jan', Dumber: Math.floor(Math.random() * 30), 'Still Smart': Math.floor(Math.random() * 30) },
          { date: 'Feb', Dumber: Math.floor(Math.random() * 30), 'Still Smart': Math.floor(Math.random() * 30) },
          { date: 'Mar', Dumber: Math.floor(Math.random() * 30), 'Still Smart': Math.floor(Math.random() * 30) },
          { date: 'Apr', Dumber: Math.floor(Math.random() * 30), 'Still Smart': Math.floor(Math.random() * 30) },
          { date: 'May', Dumber: Math.floor(Math.random() * 30), 'Still Smart': Math.floor(Math.random() * 30) },
          { date: 'Jun', Dumber: Math.floor(Math.random() * 30), 'Still Smart': Math.floor(Math.random() * 30) },
        ]
      ])
    );
    setChartData(initialData);
    console.log('Chart data initialized:', initialData);
  }, []);

  const handleVote = (modelName, vote) => {
    console.log(`Voted ${vote} for ${modelName}`);
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
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 w-full mt-8">
      {models.map((model) => (
        <div key={model.name} className="bg-white rounded-xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 hover:scale-105 border border-black">
          <h3 className="text-2xl font-bold mb-3 font-['Noto_Sans',_sans-serif] text-gray-800">{model.name}</h3>
          <p className="text-sm text-gray-600 mb-6">📅 Tracking since {model.date}</p>
          <div className="h-64 mb-6">
            {chartData[model.name] ? (
              <div>Chart placeholder</div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">Loading chart data...</p>
              </div>
            )}
          </div>
          <div className="flex justify-around mt-6">
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
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-4 pt-16 bg-gray-100">
      <div className="max-w-6xl w-full mt-4">
        <h1 className="text-5xl font-bold text-left text-black mb-6">
          Dumber Models?
        </h1>
        <p className="text-xl text-left max-w-3xl mb-12 text-gray-700">
          Have current LLMs gotten dumber as time has gone on? Vote and see for yourself.
        </p>
        <ModelVoting />
      </div>
    </main>
  );
}

export default function Home() {
  const [chartData, setChartData] = useState(
    Object.fromEntries(models.map(model => [model.name, initialChartData]))
  );

  useEffect(() => {
    // Initialize chart data with random values
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
    console.log('Chart data initialized:', chartData);
  }, []);

  const handleVote = (modelName, vote) => {
    console.log(`Voted ${vote} for ${modelName}`);
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
  };

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
          <div key={model.name} className="bg-white rounded-xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 hover:scale-105 border border-black">
            <h3 className="text-2xl font-bold mb-3 font-['Noto_Sans',_sans-serif] text-gray-800">{model.name}</h3>
            <p className="text-sm text-gray-600 mb-6">📅 Tracking since {model.date}</p>
            <div className="h-64 mb-6">
              {chartData[model.name] ? (
                <div>Chart placeholder</div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">Loading chart data...</p>
                </div>
              )}
            </div>
            <div className="flex justify-around mt-6">
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
            </div>
          </div>
        ))}
      </div>
      </div>
    </main>
);
}