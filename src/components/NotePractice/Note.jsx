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
    analyzerRef.current.fftSize = 4096;
    detectPitch.current = YIN({ sampleRate: audioContextRef.current.sampleRate,
      threshold: 0.1,
    });
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
      if (now - lastMatchTimeRef.current > 500) { 
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
      
      const audioStream = await navigator.mediaDevices.getUserMedia({ 
        sampleRate: 44100,
        channelCount: 1,
        noiseSuppression: false,
        autoGainControl: false,
        audio: true,
      });
      mediaStreamRef.current = audioStream;
      
      const source = audioContextRef.current.createMediaStreamSource(audioStream);
      source.connect(analyzerRef.current);
      
      setIsRunning(true);
      isRunningRef.current = true;
      lastMatchTimeRef.current = 0;
      generateNewTargetNote();
      detectPitchLoop();
    } catch (error) {
      alert("allow mic");
    }
  }
  
  const detectPitchLoop = () => {
    const buffer = new Float32Array(analyzerRef.current.fftSize);
    //each number represents the amplitude of the sound wave at the sample point
    const detect = () => {
      if (!isRunningRef.current) return;
      
      analyzerRef.current.getFloatTimeDomainData(buffer);

      let sum = 0;
      for (let i = 0; i < buffer.length; i++) {
        sum += buffer[i] * buffer[i];
      } // positive
      const rms = Math.sqrt(sum / buffer.length);
      //rms = percieved loudness of an audio dignal. the higher the louder it is. 
      if(rms > 0.000001){ //if the rms is higher than 0.01 it is sufficiently loud to be detected
        const pitch = detectPitch.current(buffer);
        if (pitch && pitch > -100 && pitch < 9000) { //supposedly the normal guitar freq range?
          const note = frequencyToNote(pitch);
          
          setDetectedNote(note);
        }
      }else{
        setDetectedNote('');
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
    return notes[Math.floor(noteNum + 0.5) % 12];
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
      <h1 className="text-3xl font-bold mb-4">note practice</h1>
      <div className="space-y-4">
        <p className="text-2xl">target: {targetNote || "--"}</p>
        <p className="text-2xl">played: {detectedNote || "--"}</p>
        <p className="text-2xl">correct: {correctCount}</p>
        <p className="text-2xl">time: {time}s</p>
      </div>
      <div className="mt-8 space-x-4">
        <button
          onClick={startPractice}
          className="px-6 py-2 bg-green-300 text-white rounded-lg hover:bg-green-600"
          disabled={isRunning}
        >
          start
        </button>
        <button
          onClick={resetPractice}
          className="px-6 py-2 bg-red-300 text-white rounded-lg hover:bg-red-600"
        >
          reset
        </button>
      </div>
        <div className="">
          <h2 className="text-2xl py-10 underline"> level 1 </h2>
          <p className="max-w-2xl mx-45 text-center text-lg under">focus on the low E string only. we reccomend moving to level 2 when you can hit 50 with high accuracy</p>
        </div>
        <div className="">
          <h2 className="text-2xl py-10 underline"> level 2 </h2>
          <p className="max-w-2xl mx-45 text-center text-lg under">focus on sets of 3 frets until the entire fretboard is covered. again, focus on maximizing accuracy</p>
        </div>
        <div className="">
          <h2 className="text-2xl py-10 underline"> level 3 </h2>
          <p className="max-w-2xl mx-45 text-center text-lg under">cover the entire fretboard and complete 5 minutes of this daily. start a streak</p>
        </div>
      </div>
  );
};

export default NotePractice;