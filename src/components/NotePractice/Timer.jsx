import React, { useState, useEffect } from 'react';

const Timer = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const handleReset = () => {
    setTime(0);
    setIsRunning(false);
  };

  const handleStart = () => {
    setIsRunning(true);
  };


  return (
    <div className="text-center mb-8">
      <p className="text-2xl font-bold text-gray-800">{time}</p>
      <div className="">
        <button
          onClick={handleStart}
          className="mt-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
        >
          start
        </button>
        <button
        onClick={handleReset}
        className="mt-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
        >
          reset
        </button>
      
      </div>
     
    </div>
  );
}

export default Timer;