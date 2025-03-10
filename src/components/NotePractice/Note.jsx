import React, { useState, useEffect, useRef } from "react";
import { YIN } from 'pitchfinder';

const NotePractice = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [targetNote, setTargetNote] = useState('');
  const [detectedNote, setDetectedNote] = useState('');
  const [correctCount, setCorrectCount] = useState(0);
  const notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  
  const audioContextRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const detectPitch = useRef(null);
  const analyzerRef = useRef(null);
  const isRunningRef = useRef(false);
  const lastMatchTimeRef = useRef(0);
  

  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    analyzerRef.current = audioContextRef.current.createAnalyser();
    analyzerRef.current.fftSize = 2048;
    detectPitch.current = YIN({ sampleRate: audioContextRef.current.sampleRate });
  }, []);
  
  useEffect(() => {
    let interval;
    isRunningRef.current = isRunning;
    
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isRunning]);
  

  useEffect(() => {
    if (isRunning && detectedNote && targetNote && detectedNote === targetNote) {
      const now = Date.now();
      if (now - lastMatchTimeRef.current > 1000) { 
        setCorrectCount(prev => prev + 1);
        generateNewTargetNote();
        lastMatchTimeRef.current = now;
      }
    }
  }, [detectedNote, targetNote, isRunning]);
  
  const generateNewTargetNote = () => {
    const randomNote = notes[Math.floor(Math.random() * notes.length)];
    setTargetNote(randomNote);
  }
  
  const startPractice = async () => {
    try {
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }
      
      const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = audioStream;
      
      const source = audioContextRef.current.createMediaStreamSource(audioStream);
      source.connect(analyzerRef.current);
      
      setIsRunning(true);
      isRunningRef.current = true;
      lastMatchTimeRef.current = 0;
      generateNewTargetNote();
      detectPitchLoop();
    } catch (error) {
      alert("Please allow microphone access!");
    }
  }
  
  const detectPitchLoop = () => {
    const buffer = new Float32Array(analyzerRef.current.fftSize);
    
    const detect = () => {
      if (!isRunningRef.current) return;
      
      analyzerRef.current.getFloatTimeDomainData(buffer);
      const pitch = detectPitch.current(buffer);
      
      if (pitch) {
        const note = frequencyToNote(pitch);
        setDetectedNote(note);
      }
      
      if (isRunningRef.current) {
        requestAnimationFrame(detect);
      }
    };
    
    detect();
  };
  
  const frequencyToNote = (frequency) => {
    const A4 = 440;
    const noteNum = 12 * (Math.log2(frequency / A4)) + 69;
    return notes[Math.round(noteNum) % 12];
  };
  
  const resetPractice = () => {
    setIsRunning(false);
    isRunningRef.current = false;
    setTime(0);
    setTargetNote('');
    setDetectedNote('');
    setCorrectCount(0);
    
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
    }
  };
  
  return (
    <div className="text-center p-8">
      <h1 className="text-3xl font-bold mb-4">Note Practice!</h1>
      <div className="space-y-4">
        <p className="text-2xl">target: {targetNote || "--"}</p>
        <p className="text-2xl">played: {detectedNote || "--"}</p>
        <p className="text-2xl">correct: {correctCount}</p>
        <p className="text-2xl">time: {time}s</p>
      </div>
      <div className="mt-8 space-x-4">
        <button
          onClick={startPractice}
          className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          disabled={isRunning}
        >
          start
        </button>
        <button
          onClick={resetPractice}
          className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          reset
        </button>
      </div>
    </div>
  );
};

export default NotePractice;