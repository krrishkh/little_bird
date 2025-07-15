import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// The balloon image is no longer needed.

// --- Main App Component (Intro Sequence) ---
export default function App() {
    // State to manage the current step of the animation sequence
    const [animationStage, setAnimationStage] = useState('initial');
    const navigate = useNavigate();

    // --- Animation Timing Constants (in milliseconds) ---
    const TEXT_FADE_IN_DURATION = 1500;
    const TEXT_STAY_DURATION = 2500;
    const MIDDLE_TEXT_FADE_IN_DELAY = 500;
    const MIDDLE_TEXT_STAY_DURATION = 3000;
    const SECOND_TEXT_FADE_IN_DELAY = 500;
    const SECOND_TEXT_STAY_DURATION = 3000;
    const BUTTON_FADE_IN_DELAY = 500;

    useEffect(() => {
        const timers = [];

        // Sequence orchestration using timeouts
        timers.push(setTimeout(() => setAnimationStage('textVisible'), 100));
        const hideTextTime = TEXT_FADE_IN_DURATION + TEXT_STAY_DURATION;
        timers.push(setTimeout(() => setAnimationStage('textHidden'), hideTextTime));
        
        const showMiddleTextTime = hideTextTime + MIDDLE_TEXT_FADE_IN_DELAY;
        timers.push(setTimeout(() => setAnimationStage('middleTextVisible'), showMiddleTextTime));
        
        const hideMiddleTextTime = showMiddleTextTime + MIDDLE_TEXT_STAY_DURATION;
        timers.push(setTimeout(() => setAnimationStage('middleTextHidden'), hideMiddleTextTime));

        const showSecondTextTime = hideMiddleTextTime + SECOND_TEXT_FADE_IN_DELAY;
        timers.push(setTimeout(() => setAnimationStage('secondTextVisible'), showSecondTextTime));
        
        const hideSecondTextTime = showSecondTextTime + SECOND_TEXT_STAY_DURATION;
        timers.push(setTimeout(() => setAnimationStage('secondTextHidden'), hideSecondTextTime));
        
        const showButtonTime = hideSecondTextTime + BUTTON_FADE_IN_DELAY;
        timers.push(setTimeout(() => setAnimationStage('buttonVisible'), showButtonTime));

        // Cleanup function to clear all timers if the component unmounts
        return () => {
            timers.forEach(clearTimeout);
        };
    }, []);

    const handleButtonClick = () => {
        navigate('/create');
    };

    // Helper to determine the CSS class for the current stage
    const getClassForStage = (stage) => {
        return animationStage === stage ? 'opacity-100' : 'opacity-0';
    };

    return (
        <div className="intro-container">
            {/* Background elements for atmosphere */}
            <div className="vignette" />
            <div className="particles">
                {Array.from({ length: 50 }).map((_, i) => <div key={i} className="particle" />)}
            </div>

            {/* Animated Text 1: "Hey, Kshiti :)" */}
            <h1 className={`intro-text-main ${getClassForStage('textVisible')}`}>
                Hey Kshiti,
            </h1>

            {/* Animated Text (replaces image) */}
            <h2 className={`intro-text-middle ${getClassForStage('middleTextVisible')}`}>
                Ever since we first talked on March 12th...
            </h2>
            
            {/* Animated Text 2 */}
            <h2 className={`intro-text-secondary ${getClassForStage('secondTextVisible')}`}>
                ...I've been wondering something.
            </h2>

            {/* Animated Button */}
            <button
                onClick={handleButtonClick}
                className={`intro-button ${getClassForStage('buttonVisible')}`}
                disabled={animationStage !== 'buttonVisible'}
            >
                What is it?
            </button>

            <style>{`
                /* Import thematic fonts */
                @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Special+Elite&display=swap');

                .intro-container {
                    position: relative;
                    height: 100vh;
                    width: 100%;
                    background: radial-gradient(circle, #2c3e50 0%, #1a222c 100%);
                    overflow: hidden;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .vignette {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    box-shadow: inset 0 0 20vw rgba(0,0,0,0.5);
                    z-index: 1;
                }

                /* --- Floating Particle Effect --- */
                .particles { position: absolute; top: 0; left: 0; width: 100%; height: 100%; overflow: hidden; }
                .particle { position: absolute; background: rgba(255, 215, 0, 0.5); border-radius: 50%; animation: float 20s infinite ease-in-out; opacity: 0; }
                @keyframes float {
                    0% { transform: translateY(100vh) translateX(var(--x-start)) scale(0); opacity: 0; }
                    50% { opacity: 1; }
                    100% { transform: translateY(-10vh) translateX(var(--x-end)) scale(var(--scale)); opacity: 0; }
                }
                .particle:nth-child(5n+1) { --x-start: 10vw; --x-end: 15vw; --scale: 0.3; animation-duration: 15s; animation-delay: -2s; width: 3px; height: 3px; }
                .particle:nth-child(5n+2) { --x-start: 20vw; --x-end: 10vw; --scale: 0.5; animation-duration: 25s; animation-delay: -5s; width: 4px; height: 4px; }
                .particle:nth-child(5n+3) { --x-start: 80vw; --x-end: 90vw; --scale: 0.2; animation-duration: 18s; animation-delay: -8s; width: 2px; height: 2px; }
                .particle:nth-child(5n+4) { --x-start: 50vw; --x-end: 45vw; --scale: 0.6; animation-duration: 22s; animation-delay: -1s; width: 5px; height: 5px; }
                .particle:nth-child(5n+5) { --x-start: 95vw; --x-end: 85vw; --scale: 0.4; animation-duration: 30s; animation-delay: -15s; width: 3px; height: 3px; }

                /* --- Animated Elements Styling --- */
                .intro-text-main, .intro-text-middle, .intro-text-secondary, .intro-button {
                    position: absolute;
                    z-index: 10;
                    transition: opacity 1.5s ease-in-out, transform 1.5s ease-in-out;
                    will-change: opacity, transform;
                    text-align: center;
                    padding: 0 1rem;
                }

                .intro-text-main {
                    font-family: 'Great Vibes', cursive;
                    font-weight: 400;
                    font-size: clamp(4rem, 10vw, 7rem);
                    color: #f0e6d6;
                    text-shadow: 0 0 15px rgba(255, 215, 0, 0.5);
                }

                .intro-text-middle, .intro-text-secondary {
                    font-family: 'Special Elite', cursive;
                    font-size: clamp(1.5rem, 5vw, 2.5rem);
                    color: #dcd3c9;
                }
                
                .intro-button {
                    font-family: 'Merriweather', serif;
                    font-size: 1.1rem;
                    padding: 0.75rem 2rem;
                    color: #1a222c;
                    background: #f0e6d6;
                    border: none;
                    border-radius: 50px;
                    cursor: pointer;
                    box-shadow: 0 0 15px 5px rgba(240, 230, 214, 0.3), inset 0 0 5px rgba(0,0,0,0.2);
                    transition: all 0.3s ease;
                }

                .intro-button:hover:not(:disabled) {
                    transform: scale(1.05);
                    box-shadow: 0 0 25px 10px rgba(240, 230, 214, 0.4), inset 0 0 5px rgba(0,0,0,0.2);
                }
                
                .intro-button:disabled {
                    cursor: default;
                }
            `}</style>
        </div>
    );
}
