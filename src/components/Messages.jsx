import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom'; // Assuming you use React Router for navigation
import harryPotterTheme from '../assets/subhanallah.mp3'; // Import the theme song
import cuty from '../assets/cuty.png'; // Import the cuty image
import ude from '../assets/ude.png'; // Import the ude image

// --- Helper Components ---

// A simple back arrow icon
const BackArrowIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-arrow-left">
        <line x1="19" y1="12" x2="5" y2="12"></line>
        <polyline points="12 19 5 12 12 5"></polyline>
    </svg>
);

// --- Main Messages Component ---

function Messages() {
    // --- State Management ---
    const [messages, setMessages] = useState([
        {
            id: 1,
            type: 'text',
            content: "The Serendipitous Start: Isn't it funny how the universe works? In a sea of random connections and fleeting faces, a conversation can feel like finding a hidden, quiet corner of the world. That first chat felt like that—easy, interesting, and unexpectedly real. It's rare to find someone you can talk to for hours right from the start, and I just wanted to say I think that's pretty special."
        },
        {
            id: 2,
            type: 'image',
            imageUrl: ude,
            caption: "hehe :)"
        },
        {
            id: 3,
            type: 'text',
            content: "As we've talked more, I've realized that the first impression was just the beginning. Getting to know you, bit by bit, has truly been one of the highlights of my year. You have a unique way of seeing the world and an adventurous spirit that's genuinely rare. It feels like our vibes just… click, you know?"
        },
        {
            id: 4,
            type: 'text',
            content: "I know we haven’t had a proper call yet, but I just wanted to say—I really appreciate your voice notes. In a world full of quick texts, hearing someone’s actual voice just adds a nice, personal touch. They always feel genuine, and it's something I really value. Thanks for sending them!"
        },
        {
          id: 5,
          type: 'text',
          content: "I  don't know what the future holds, but I'm really glad our paths crossed. I feel like I've only seen a few pages of a really amazing book, and I'd be honored to get to know the rest of the story. Thank you for being such a wonderful person to talk to."
        },
        {
            id: 6,
            type: 'image',
            imageUrl: cuty,
            caption: "And finally... Happy Birthday, Kshiti! This whole thing was just a small, magical way to celebrate the day the world got a little brighter—the day you were created. I hope your day is filled with incredible joy, laughter, and everything wonderful. Here's to you!"
        },
        
       
    ]);
    
    const [isDismissing, setIsDismissing] = useState(false);
    const audioRef = useRef(null); // Create a ref for the audio element

    // --- Audio Playback ---
    // This effect runs once when the component mounts to play the theme song.
    useEffect(() => {
        const audioElement = audioRef.current;
        if (audioElement) {
            audioElement.volume = 0.3; // Set a pleasant volume
            const playPromise = audioElement.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.error("Audio autoplay was prevented:", error);
                    // In some browsers, autoplay is blocked. The user might need to interact first.
                });
            }
        }

        // Cleanup function to pause the music when the component is unmounted
        return () => {
            if (audioElement) {
                audioElement.pause();
            }
        };
    }, []); // The empty dependency array ensures this effect runs only once.


    // --- Event Handlers ---
    const handleDismissMessage = () => {
        if (isDismissing || messages.length === 0) return;
        setIsDismissing(true);
        setTimeout(() => {
            setMessages(prevMessages => prevMessages.slice(1));
            setIsDismissing(false);
        }, 500);
    };

    // --- Render Logic ---
    return (
        <div className="messages-container">
            {/* Add the audio element here. It's hidden but will play in the background. */}
            <audio ref={audioRef} src={harryPotterTheme} loop />

            <Link to="/" className="back-link">
                <BackArrowIcon />
                <span>Back to the Chamber</span>
            </Link>

            <div className="messages-stack">
                {messages.length > 0 ? (
                    messages.map((msg, index) => {
                        const isTopCard = index === 0;
                        const rotation = (msg.id % 2 === 0 ? 1 : -1) * (messages.length - index) * 0.8;
                        const cardClassName = `message-page ${isTopCard ? 'top' : ''} ${isTopCard && isDismissing ? 'dismissing' : ''}`;

                        return (
                            <div
                                key={msg.id}
                                className={cardClassName}
                                style={{
                                    '--initial-rotation': `${rotation}deg`,
                                    transform: `rotate(${rotation}deg) translateY(${(messages.length - index) * -6}px)`,
                                    zIndex: messages.length - index,
                                }}
                                onClick={isTopCard ? handleDismissMessage : undefined}
                            >
                                {msg.type === 'text' && (
                                    <div className="message-content">
                                        <p>{msg.content}</p>
                                    </div>
                                )}
                                {msg.type === 'image' && (
                                    <div className="message-content image-content">
                                        <img src={msg.imageUrl} alt="A cherished memory" className="message-image" />
                                        <p className="caption">{msg.caption}</p>
                                    </div>
                                )}
                            </div>
                        );
                    })
                ) : (
                    <div className="end-of-messages">
                        <h2>Enjoy your Day</h2>
                        <p>You've read all the messages for now, but the magic continues.</p>
                    </div>
                )}
            </div>
            
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,400;0,700;1,400&family=Special+Elite&display=swap');

                .messages-container {
                    background: radial-gradient(circle, #2c3e50 0%, #1a222c 100%);
                    min-height: 100vh;
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 2rem;
                    overflow: hidden;
                    font-family: 'Merriweather', serif;
                }

                .back-link {
                    position: absolute;
                    top: 2rem;
                    left: 2rem;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: #dcd3c9;
                    text-decoration: none;
                    font-family: 'Special Elite', cursive;
                    font-size: 1rem;
                    opacity: 0.7;
                    transition: opacity 0.3s ease;
                    z-index: 100;
                }

                .back-link:hover {
                    opacity: 1;
                }

                .messages-stack {
                    position: relative;
                    width: clamp(300px, 90vw, 450px);
                    height: 600px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .message-page {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    padding: 2.5rem 2rem;
                    background-color: #f0e6d6;
                    background-image: url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23dcd3c9" fill-opacity="0.1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');
                    border: 1px solid #dcd3c9;
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4), 0 0 0 1px #a39b8f inset;
                    border-radius: 5px;
                    /* Smoothly transition into new positions */
                    transition: transform 0.5s cubic-bezier(0.25, 1, 0.5, 1);
                }
                
                .message-page.top {
                    cursor: pointer;
                }
                
                .message-page.top:active {
                     transform: scale(0.98) !important;
                }
                
                .message-page:not(.top) {
                    pointer-events: none;
                }

                /* This class triggers the exit animation */
                .message-page.dismissing {
                    animation: dismiss 0.5s ease-in forwards;
                }

                @keyframes dismiss {
                    from {
                        /* The animation starts from the element's current transform */
                        opacity: 1;
                    }
                    to {
                        /* It animates to a new position off-screen */
                        opacity: 0;
                        transform: translateY(200px) rotate(calc(var(--initial-rotation) + 20deg)) scale(0.8);
                    }
                }

                .message-content {
                    color: #4a3f37;
                    font-family: 'Special Elite', cursive;
                    font-size: 1.25rem;
                    line-height: 1.8;
                    white-space: pre-wrap;
                    user-select: none; /* Prevent text selection on click */
                }

                .message-content.image-content {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 1rem;
                }
                
                .message-image {
                    width: 100%;
                    max-width: 300px;
                    height: auto;
                    border-radius: 3px;
                    border: 8px solid #dcd3c9;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                }

                .caption {
                    font-style: italic;
                    font-size: 1rem;
                    text-align: center;
                    opacity: 0.8;
                }

                .end-of-messages {
                    text-align: center;
                    color: #dcd3c9;
                    padding: 2rem;
                    background: rgba(0,0,0,0.2);
                    border-radius: 10px;
                    animation: fade-in 1s ease;
                }

                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .end-of-messages h2 {
                    font-family: 'Merriweather', serif;
                    font-size: 2rem;
                    font-weight: 700;
                    margin-bottom: 0.5rem;
                }
            `}</style>
        </div>
    );
}

export default Messages;
