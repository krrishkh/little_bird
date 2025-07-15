import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as Tone from 'tone';
// import { Link } from 'react-router-dom'; // No longer needed

// Import assets correctly so your build tool can handle them
import soundFile from '../assets/sound.mp3'; 
import mainImage from '../assets/Main.png';

// --- Configuration for Attributes ---
const ATTRIBUTES_CONFIG = [
    { name: 'Excitement', color: 'yellow', hex: '#facc15', emoji: '', fillType: 'standard', percentage: 30 },
    { name: 'Intelligence', color: 'blue', hex: '#3b82f6', emoji: '', fillType: 'standard', percentage: 5 },
    { name: 'Adventure', color: 'green', hex: '#22c55e', emoji: '', fillType: 'standard', percentage: 20 },
    { name: 'Funny', color: 'purple', hex: '#a855f7', emoji: '', fillType: 'standard', percentage: 5 },
    { name: 'Beauty', color: 'pink', hex: '#ec4899', emoji: '', fillType: 'exploding', percentage: 40 },
];

// --- Timer Components (Styling is controlled by parent CSS) ---
const CountdownTimer = ({ targetDate }) => {
    const [timeLeft, setTimeLeft] = useState({});

    useEffect(() => {
        const timer = setInterval(() => {
            const difference = targetDate - new Date();
            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60),
                });
            } else {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                clearInterval(timer);
            }
        }, 1000);
        return () => clearInterval(timer);
    }, [targetDate]);

    
};

const AgeTimer = ({ birthDate }) => {
    const [age, setAge] = useState({});

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            let years = now.getFullYear() - birthDate.getFullYear();
            let months = now.getMonth() - birthDate.getMonth();
            let days = now.getDate() - birthDate.getDate();
            let hours = now.getHours() - birthDate.getHours();
            let minutes = now.getMinutes() - birthDate.getMinutes();
            let seconds = now.getSeconds() - birthDate.getSeconds();

            if (seconds < 0) { minutes--; seconds += 60; }
            if (minutes < 0) { hours--; minutes += 60; }
            if (hours < 0) { days--; hours += 24; }
            if (days < 0) {
                months--;
                const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
                days += prevMonth.getDate();
            }
            if (months < 0) { years--; months += 12; }
            
            setAge({ years, months, days, hours, minutes, seconds });
        }, 1000);

        return () => clearInterval(timer);
    }, [birthDate]);

    return (
        <div className="timer-widget">
            <p className="timer-title">The world has been a happier place for...</p>
            <p className="age-string">
                {age.years} years, {age.months} months, {age.days} days, {age.hours} hours, {age.minutes} minutes, and {age.seconds} seconds.....
            </p>
        </div>
    );
};

// --- Particle Component (Unchanged) ---
const Particle = ({ attribute, isPouring, isExploding }) => {
    const animationDuration = 1.5 + Math.random();
    const explosionDuration = 1.2 + Math.random() * 0.5;

    if (isPouring) {
        return <div className="particle-pour" style={{ background: attribute.hex, left: `${40 + Math.random() * 20}%`, animation: `pour-down ${animationDuration}s ease-in forwards`, animationDelay: `${Math.random() * 1.5}s` }} />;
    }
    if (isExploding) {
        const angle = Math.random() * 360;
        const distance = 90 + Math.random() * 120;
        return <div className="particle-explode" style={{ background: attribute.hex, '--angle': `${angle}deg`, '--distance': `${distance}px`, animation: `fly-out ${explosionDuration}s ease-out forwards` }} />;
    }
    return null;
};


// --- Create Component (Themed) ---
function Create() {
    const [hasStarted, setHasStarted] = useState(false);
    const [activeAttributeIndex, setActiveAttributeIndex] = useState(0);
    const [liquidFill, setLiquidFill] = useState(0);
    const [isComplete, setIsComplete] = useState(false);
    const [isExploding, setIsExploding] = useState(false);
    const [showFinalImage, setShowFinalImage] = useState(false);
    const [destiny, setDestiny] = useState('');
    const [isGeneratingDestiny, setIsGeneratingDestiny] = useState(false);
    const [error, setError] = useState('');
    
    const fillIntervalRef = useRef(null);
    const synths = useRef(null);
    const audioRef = useRef(null);

    const setupSounds = useCallback(() => {
        if (!synths.current) {
            const distortion = new Tone.Distortion(0.4).toDestination();
            synths.current = {
                explosionBoom: new Tone.MembraneSynth({ pitchDecay: 0.05, octaves: 10, envelope: { attack: 0.001, decay: 0.4, sustain: 0.01, release: 1.4 } }).connect(distortion),
                explosionNoise: new Tone.NoiseSynth({ noise: { type: 'pink' }, envelope: { attack: 0.005, decay: 0.3, sustain: 0, release: 0.2 } }).toDestination(),
                explosionCrackle: new Tone.MetalSynth({ frequency: 400, envelope: { attack: 0.001, decay: 0.1, release: 0.1 }, harmonicity: 3.1, modulationIndex: 40, resonance: 3000, octaves: 1.5 }).connect(distortion),
            };
        }
    }, []);

    const startCreation = useCallback(async () => {
        await Tone.start();
        setupSounds();
        setHasStarted(true);
        if (audioRef.current) {
            audioRef.current.volume = 0.5;
            audioRef.current.play().catch(e => console.error("Audio play failed on start:", e));
        }
    }, [setupSounds]);

    const handleAttributeFill = useCallback(() => {
        const currentAttribute = ATTRIBUTES_CONFIG[activeAttributeIndex];
        if (!currentAttribute) return;

        if (currentAttribute.fillType === 'exploding') {
            setIsExploding(true);
            const now = Tone.now();
            if (synths.current) {
                synths.current.explosionBoom.triggerAttackRelease("C1", "1n", now);
                synths.current.explosionNoise.triggerAttackRelease("0.5n", now + 0.05);
                synths.current.explosionCrackle.triggerAttackRelease("C4", "0.2n", now + 0.02);
            }
        }
        
        const delay = currentAttribute.fillType === 'exploding' ? 1500 : 500;
        
        setTimeout(() => {
            setIsExploding(false);
            const nextIndex = activeAttributeIndex + 1;
            if (nextIndex < ATTRIBUTES_CONFIG.length) {
                setActiveAttributeIndex(nextIndex);
            } else {
                setIsComplete(true);
                setTimeout(() => {
                    setShowFinalImage(true);
                    if(audioRef.current) audioRef.current.volume = 1;
                }, 2000);
            }
        }, delay);
    }, [activeAttributeIndex]);

    useEffect(() => {
        if (hasStarted && !isComplete) {
            const pourDuration = 3000;
            const currentAttribute = ATTRIBUTES_CONFIG[activeAttributeIndex];
            if (!currentAttribute) return;

            const startFillLevel = ATTRIBUTES_CONFIG.slice(0, activeAttributeIndex).reduce((sum, attr) => sum + attr.percentage, 0);
            const targetFill = startFillLevel + currentAttribute.percentage;

            if (isNaN(targetFill)) return;

            if (fillIntervalRef.current) clearInterval(fillIntervalRef.current);
            
            const animationStartTime = Date.now();

            fillIntervalRef.current = setInterval(() => {
                const elapsedTime = Date.now() - animationStartTime;
                const progress = Math.min(elapsedTime / pourDuration, 1);

                const newFill = startFillLevel + (currentAttribute.percentage * progress);
                
                setLiquidFill(newFill);

                if (progress >= 1) {
                    setLiquidFill(targetFill);
                    clearInterval(fillIntervalRef.current);
                }
            }, 16);

            const nextStateTimeout = setTimeout(handleAttributeFill, pourDuration + 200);
            
            return () => {
                clearInterval(fillIntervalRef.current);
                clearTimeout(nextStateTimeout);
            };
        }
    }, [activeAttributeIndex, hasStarted, isComplete, handleAttributeFill]);

    const getDestiny = async () => {
        setIsGeneratingDestiny(true);
        setError('');
        setDestiny('');

        const attributesString = ATTRIBUTES_CONFIG.map(attr => `${attr.percentage}% ${attr.name}`).join(', ');
        const prompt = `You are a cosmic oracle. A new being has been created with the following core attributes: ${attributesString}. Write a short, poetic, and uplifting prophecy or destiny for her. Keep it under 50 words and speak directly to her.`;

        try {
            const apiKey = "AIzaSyBLqrodGEhaxlGgp1yZZ5pGXtjeXeq3obw"; 
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
            
            const payload = { contents: [{ role: "user", parts: [{ text: prompt }] }] };

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorBody = await response.json();
                console.error("API Error:", errorBody);
                throw new Error(`API request failed with status ${response.status}`);
            }

            const result = await response.json();
            
            if (result.candidates?.[0]?.content?.parts?.[0]?.text) {
                const text = result.candidates[0].content.parts[0].text;
                setDestiny(text);
            } else {
                console.error("Invalid API response structure:", result);
                throw new Error("Invalid response structure from API.");
            }

        } catch (err) {
            console.error(err);
            setError("The stars are cloudy right now. Please try again later.");
        } finally {
            setIsGeneratingDestiny(false);
        }
    };
    
    const currentAttribute = ATTRIBUTES_CONFIG[activeAttributeIndex];
    const liquidColor = currentAttribute ? currentAttribute.hex : '#475569';

    return (
        <div className={`creation-container ${showFinalImage ? 'is-final-view' : ''}`}>
            <div className="vignette" />
            <div className="particles">
                {Array.from({ length: 50 }).map((_, i) => <div key={i} className="particle" />)}
            </div>
            
            <audio ref={audioRef} src={soundFile} loop />

            {!hasStarted && !showFinalImage && (
                <div className="creation-start-screen">
                    <h1 className="creation-title">First Let's Create Something</h1>
                    <p className="creation-subtitle">Are you ready to create a new being?</p>
                    <button onClick={startCreation} className="themed-button">Begin Creation</button>
                </div>
            )}

            {hasStarted && !showFinalImage && (
                <div className={`creation-vessel-container ${showFinalImage ? 'fade-out' : ''}`}>
                    <div className="creation-header">
                        {!isComplete && currentAttribute && (<div className="fade-in"><h2 style={{color: currentAttribute.hex}}>{currentAttribute.name} {currentAttribute.emoji}</h2></div>)}
                        {isComplete && !showFinalImage && (<div className="fade-in"><h2>Creation Complete!</h2><p>Behold... 😇</p></div>)}
                    </div>
                    <div className={`creation-vessel ${isExploding ? 'animate-shake' : ''}`}>
                        {currentAttribute && !isComplete && Array.from({ length: 50 }).map((_, i) => (<Particle key={i} attribute={currentAttribute} isPouring={true} />))}
                        {isExploding && Array.from({ length: 80 }).map((_, i) => (<Particle key={i} attribute={ATTRIBUTES_CONFIG[activeAttributeIndex]} isExploding={true} />))}
                        <svg viewBox="0 0 100 100" className="vessel-svg">
                            <defs><clipPath id="glass-clip"><path d="M 22 20 L 18 90 C 18 95, 82 95, 82 90 L 78 20 Z" /></clipPath></defs>
                            <rect clipPath="url(#glass-clip)" x="18" y={90 - (70 * liquidFill / 100)} width="64" height="70" style={{ fill: liquidColor, transition: 'fill 0.5s ease-in-out, y 0.05s linear' }}/>
                            <path d="M 22 20 C 22 10, 78 10, 78 20" fill="none" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="2.5" /><path d="M 22 20 L 18 90 C 18 95, 82 95, 82 90 L 78 20" fill="rgba(255, 255, 255, 0.1)" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="1" /><path d="M 18 90 C 18 95, 82 95, 82 90 C 82 85, 18 85, 18 90" fill="rgba(255, 255, 255, 0.2)" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1" /><path d="M 22 20 C 22 30, 78 30, 78 20" fill="none" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="2.5" /><path d="M 22 20 L 18 90" fill="none" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1.5" /><path d="M 78 20 L 82 90" fill="none" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="0.5" />
                        </svg>
                        {isExploding && <div className="shockwave" />}
                        {isExploding && <div className="absolute inset-0 bg-white/90 rounded-full animate-flash z-20" />}
                    </div>
                </div>
            )}
            
            {showFinalImage && (
                <div className="final-reveal-container pt-16">
                    <img src={mainImage} alt="The Created Being" className="final-image"/>
                    <div className="final-info-panel">
                        <CountdownTimer targetDate={new Date('2025-07-16T00:00:00')} />
                        <AgeTimer birthDate={new Date('2004-07-16T00:00:00')} />
                    </div>
                    <div className="destiny-container">
                        {isGeneratingDestiny && <div className="destiny-loading">The stars are aligning...</div>}
                        {error && <div className="destiny-error">{error}</div>}
                        {destiny && (
                            <>
                                <blockquote className="destiny-quote">"{destiny}"</blockquote>
                                <a href="/messages" className="themed-button messages-link">Messages for this lil ➡️</a>
                            </>
                        )}
                        {!destiny && !isGeneratingDestiny && (
                            <button onClick={getDestiny} disabled={isGeneratingDestiny} className="themed-button destiny-button">✨ Tap Reveal Her Destiny</button>
                        )}
                    </div>
                </div>
            )}
            <style>{`
                /* --- Global Theming --- */
                @import url('https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,400;0,700&family=Special+Elite&display=swap');
                
                .creation-container {
                    position: relative;
                    height: 100vh;
                    width: 100%;
                    background: radial-gradient(circle, #2c3e50 0%, #1a222c 100%);
                    background-attachment: fixed; /* FIX: Keep background fixed */
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-family: 'Merriweather', serif;
                    color: #f0e6d6;
                    overflow: hidden;
                    transition: align-items 0.5s ease;
                }
                .creation-container.is-final-view {
                    overflow-y: auto;
                    align-items: flex-start;
                    /* justify-content: flex-start; <-- REMOVED to keep it centered */
                }

                .vignette, .particles {
                    position: fixed; /* FIX: Keep atmospheric effects fixed */
                    top: 0; left: 0; width: 100%; height: 100%;
                    pointer-events: none;
                }
                .vignette { box-shadow: inset 0 0 20vw rgba(0,0,0,0.5); z-index: 1; }
                .particles { z-index: 0; }
                .particle { position: absolute; background: rgba(255, 215, 0, 0.5); border-radius: 50%; animation: float 20s infinite ease-in-out; opacity: 0; }
                @keyframes float { 0% { transform: translateY(100vh) translateX(var(--x-start)) scale(0); opacity: 0; } 50% { opacity: 1; } 100% { transform: translateY(-10vh) translateX(var(--x-end)) scale(var(--scale)); opacity: 0; } }
                .particle:nth-child(5n+1) { --x-start: 10vw; --x-end: 15vw; --scale: 0.3; animation-duration: 15s; animation-delay: -2s; width: 3px; height: 3px; }
                .particle:nth-child(5n+2) { --x-start: 20vw; --x-end: 10vw; --scale: 0.5; animation-duration: 25s; animation-delay: -5s; width: 4px; height: 4px; }
                .particle:nth-child(5n+3) { --x-start: 80vw; --x-end: 90vw; --scale: 0.2; animation-duration: 18s; animation-delay: -8s; width: 2px; height: 2px; }
                .particle:nth-child(5n+4) { --x-start: 50vw; --x-end: 45vw; --scale: 0.6; animation-duration: 22s; animation-delay: -1s; width: 5px; height: 5px; }
                .particle:nth-child(5n+5) { --x-start: 95vw; --x-end: 85vw; --scale: 0.4; animation-duration: 30s; animation-delay: -15s; width: 3px; height: 3px; }

                /* --- Start Screen --- */
                .creation-start-screen { text-align: center; animation: fade-in 1s ease-out; z-index: 10; }
                .creation-title { font-size: clamp(2.5rem, 6vw, 3.5rem); font-weight: 700; margin-bottom: 0.5rem; text-shadow: 0 0 15px rgba(255, 215, 0, 0.5); }
                .creation-subtitle { font-family: 'Special Elite', cursive; font-size: 1.2rem; color: #dcd3c9; margin-bottom: 2rem; }
                .themed-button { font-family: 'Merriweather', serif; font-size: 1.1rem; padding: 0.75rem 2rem; color: #1a222c; background: #f0e6d6; border: none; border-radius: 50px; cursor: pointer; box-shadow: 0 0 15px 5px rgba(240, 230, 214, 0.3), inset 0 0 5px rgba(0,0,0,0.2); transition: all 0.3s ease; text-decoration: none; display: inline-block; }
                .themed-button:hover:not(:disabled) { transform: scale(1.05); box-shadow: 0 0 25px 10px rgba(240, 230, 214, 0.4), inset 0 0 5px rgba(0,0,0,0.2); }
                .themed-button:disabled { cursor: default; opacity: 0.6; }

                /* --- Creation Vessel --- */
                .creation-vessel-container { position: relative; width: 320px; height: 384px; transition: all 1s ease-in-out; animation: fade-in 1s ease-out; z-index: 5; }
                .creation-vessel-container.fade-out { opacity: 0; transform: scale(0.5); }
                .creation-header { position: absolute; top: 0; left: 0; right: 0; text-align: center; z-index: 20; height: 80px; }
                .creation-header h2 { font-family: 'Merriweather', serif; font-size: 2rem; font-weight: 700; text-shadow: 0 2px 5px rgba(0,0,0,0.5); }
                .creation-header p { font-family: 'Special Elite', cursive; margin-top: 0.5rem; }
                .creation-vessel { position: absolute; bottom: 0; width: 320px; height: 320px; display: flex; align-items: center; justify-content: center; }
                .vessel-svg { filter: drop-shadow(0 5px 20px rgba(0,0,0,0.3)); }

                /* --- Final Reveal --- */
                .final-reveal-container {
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    z-index: 20;
                    animation: image-reveal 1.5s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
                    width: 90%;
                    max-width: 600px;
                    margin-top: 0; /* FIX: Changed from absolute to relative, so margin is needed */
                }
                .final-image {
                    width: clamp(280px, 60vw, 350px);
                    height: clamp(280px, 60vw, 350px);
                    border-radius: 50%;
                    object-cover;
                    border: 6px solid #f0e6d6;
                    box-shadow: 0 0 30px rgba(240, 230, 214, 0.5);
                }
                .final-info-panel { text-align: center; margin-top: 1.5rem; display: flex; flex-direction: column; gap: 1.5rem; width: 100%; }
                
                /* --- Themed Timers --- */
                .timer-widget { background: rgba(0,0,0,0.2); border: 1px solid rgba(240, 230, 214, 0.2); border-radius: 8px; padding: 1rem; }
                .timer-title { font-family: 'Special Elite', cursive; font-size: 1rem; color: #dcd3c9; margin-bottom: 0.75rem; }
                .timer-grid { display: flex; justify-content: center; gap: 1rem; }
                .timer-box { text-align: center; }
                .timer-value { font-family: 'Merriweather', serif; font-size: 2rem; font-weight: 700; color: #f0e6d6; }
                .timer-label { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1px; color: #dcd3c9; }
                .age-string { font-family: 'Special Elite', cursive; font-size: 1.1rem; line-height: 1.6; color: #f0e6d6; }

                /* --- Destiny Section --- */
                .destiny-container { text-align: center; margin-top: 1.5rem; width: 100%; padding-bottom: 2rem; /* Add padding at the bottom */ }
                .destiny-loading, .destiny-error { font-family: 'Special Elite', cursive; font-size: 1.1rem; }
                .destiny-error { color: #ff8a80; }
                .destiny-quote {
                    font-family: 'Special Elite', cursive;
                    font-size: 1.25rem;
                    font-style: italic;
                    color: #f0e6d6;
                    padding: 1rem;
                    border-left: 4px solid #f0e6d6;
                    margin: 0 auto 1.5rem;
                    max-width: 600px;
                    background: rgba(0,0,0,0.1);
                }
                .messages-link { background: #f0e6d6; color: #1a222c; }
                .destiny-button { background: #f0e6d6; color: #1a222c; }

                /* --- Reused Animation Keyframes --- */
                .fade-in { animation: fade-in 0.5s ease-out forwards; }
                @keyframes fade-in { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
                .particle-pour { position: absolute; top: -20px; width: 5px; height: 5px; border-radius: 50%; opacity: 0; z-index: 5; }
                @keyframes pour-down { 0% { transform: translateY(0) scale(1); opacity: 1; } 100% { transform: translateY(200px) scale(0); opacity: 0; } }
                .particle-explode { position: absolute; top: 75%; left: 50%; width: 10px; height: 10px; border-radius: 50%; opacity: 0; z-index: 20; }
                @keyframes fly-out { 0% { transform: translate(-50%, -50%) scale(1.5); opacity: 1; } 100% { transform: translate(calc(cos(var(--angle)) * var(--distance)), calc(sin(var(--angle)) * var(--distance))) scale(0); opacity: 0; } }
                .animate-shake { animation: shake 0.82s cubic-bezier(.36,.07,.19,.97) both; }
                @keyframes shake { 10%, 90% { transform: translate3d(-2px, 0, 0) rotate(-1deg); } 20%, 80% { transform: translate3d(4px, 0, 0) rotate(1deg); } 30%, 50%, 70% { transform: translate3d(-6px, 0, 0) rotate(-2deg); } 40%, 60% { transform: translate3d(6px, 0, 0) rotate(2deg); } }
                .animate-flash { animation: flash 0.3s ease-out; }
                @keyframes flash { 0%, 100% { opacity: 0; } 50% { opacity: 1; } }
                .shockwave { position: absolute; top: 50%; left: 50%; width: 100%; height: 100%; border-radius: 50%; border: 3px solid rgba(255, 255, 255, 0.8); transform: translate(-50%, -50%) scale(0); opacity: 1; animation: shockwave-effect 0.75s ease-out forwards; z-index: 5; }
                @keyframes shockwave-effect { to { transform: translate(-50%, -50%) scale(2); opacity: 0; } }
                .animate-image-reveal, .final-reveal-container { animation: image-reveal 1.5s cubic-bezier(0.165, 0.84, 0.44, 1) forwards; }
                @keyframes image-reveal { from { opacity: 0; transform: scale(0.8) translateY(20px); } to { opacity: 1; transform: scale(1) translateY(0); } }
            `}</style>
        </div>
    );
}

export default Create;
