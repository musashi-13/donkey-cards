"use client"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboard, faCopy } from "@fortawesome/free-regular-svg-icons";
import { useParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import socket from "@/app/socket";
import { CSSProperties } from "react";
import DndProviderWrapper from "@/app/_components/DndProviderWrapper";

import DraggableCard from '@/app/_components/DraggableCard';
import DropArea from "@/app/_components/DropArea";
interface Players {
    id: string;
    username: string;
    hand: string[];    
}

interface Cards {
    code: string,
    image: string,
    images: {
        svg: string,
        png: string
    },
    suit: string,
    value: string,
}

interface CustomCSSProperties extends CSSProperties {
    '--index'?: number;
    '--totalCards'?: number;
}

const getCardValue = (value: string): number => {
    const faceCardValues: { [key: string]: number } = {
        "ACE": 1,
        "KING": 13,
        "QUEEN": 12,
        "JACK": 11
    };
    return faceCardValues[value] || parseInt(value);
};

const getSuitOrder = (suit: string): number => {
    const suitOrder: { [key: string]: number } = {
        "SPADES": 1,
        "CLUBS": 2,
        "HEARTS": 3,
        "DIAMONDS": 4
    };
    return suitOrder[suit];
};

const sortCards = (cards: { code: string, image: string, images: { svg: string, png: string }, value: string, suit: string }[]): { code: string, image: string, images: { svg: string, png: string }, value: string, suit: string }[] => {
    return cards.sort((a, b) => {
        const suitOrderA = getSuitOrder(a.suit);
        const suitOrderB = getSuitOrder(b.suit);
        if (suitOrderA === suitOrderB) {
            const valueA = getCardValue(a.value);
            const valueB = getCardValue(b.value);
            return valueA - valueB;
        }
        return suitOrderA - suitOrderB;
    });
};

const tempCards = sortCards([
    {
        "code": "KC",
        "image": "https://deckofcardsapi.com/static/img/KC.png",
        "images": {
            "svg": "https://deckofcardsapi.com/static/img/KC.svg",
            "png": "https://deckofcardsapi.com/static/img/KC.png"
        },
        "value": "KING",
        "suit": "CLUBS"
    },
    {
        "code": "6H",
        "image": "https://deckofcardsapi.com/static/img/6H.png",
        "images": {
            "svg": "https://deckofcardsapi.com/static/img/6H.svg",
            "png": "https://deckofcardsapi.com/static/img/6H.png"
        },
        "value": "6",
        "suit": "HEARTS"
    },
    {
        "code": "5D",
        "image": "https://deckofcardsapi.com/static/img/5D.png",
        "images": {
            "svg": "https://deckofcardsapi.com/static/img/5D.svg",
            "png": "https://deckofcardsapi.com/static/img/5D.png"
        },
        "value": "5",
        "suit": "DIAMONDS"
    },
    {
        "code": "0H",
        "image": "https://deckofcardsapi.com/static/img/0H.png",
        "images": {
            "svg": "https://deckofcardsapi.com/static/img/0H.svg",
            "png": "https://deckofcardsapi.com/static/img/0H.png"
        },
        "value": "10",
        "suit": "HEARTS"
    },
    {
        "code": "8C",
        "image": "https://deckofcardsapi.com/static/img/8C.png",
        "images": {
            "svg": "https://deckofcardsapi.com/static/img/8C.svg",
            "png": "https://deckofcardsapi.com/static/img/8C.png"
        },
        "value": "8",
        "suit": "CLUBS"
    },
    {
        "code": "6D",
        "image": "https://deckofcardsapi.com/static/img/6D.png",
        "images": {
            "svg": "https://deckofcardsapi.com/static/img/6D.svg",
            "png": "https://deckofcardsapi.com/static/img/6D.png"
        },
        "value": "6",
        "suit": "DIAMONDS"
    },
    {
        "code": "JS",
        "image": "https://deckofcardsapi.com/static/img/JS.png",
        "images": {
            "svg": "https://deckofcardsapi.com/static/img/JS.svg",
            "png": "https://deckofcardsapi.com/static/img/JS.png"
        },
        "value": "JACK",
        "suit": "SPADES"
    },
    {
        "code": "8D",
        "image": "https://deckofcardsapi.com/static/img/8D.png",
        "images": {
            "svg": "https://deckofcardsapi.com/static/img/8D.svg",
            "png": "https://deckofcardsapi.com/static/img/8D.png"
        },
        "value": "8",
        "suit": "DIAMONDS"
    },
    {
        "code": "4S",
        "image": "https://deckofcardsapi.com/static/img/4S.png",
        "images": {
            "svg": "https://deckofcardsapi.com/static/img/4S.svg",
            "png": "https://deckofcardsapi.com/static/img/4S.png"
        },
        "value": "4",
        "suit": "SPADES"
    },
    {
        "code": "KS",
        "image": "https://deckofcardsapi.com/static/img/KS.png",
        "images": {
            "svg": "https://deckofcardsapi.com/static/img/KS.svg",
            "png": "https://deckofcardsapi.com/static/img/KS.png"
        },
        "value": "KING",
        "suit": "SPADES"
    },
    {
        "code": "QC",
        "image": "https://deckofcardsapi.com/static/img/QC.png",
        "images": {
            "svg": "https://deckofcardsapi.com/static/img/QC.svg",
            "png": "https://deckofcardsapi.com/static/img/QC.png"
        },
        "value": "QUEEN",
        "suit": "CLUBS"
    },
    {
        "code": "6C",
        "image": "https://deckofcardsapi.com/static/img/6C.png",
        "images": {
            "svg": "https://deckofcardsapi.com/static/img/6C.svg",
            "png": "https://deckofcardsapi.com/static/img/6C.png"
        },
        "value": "6",
        "suit": "CLUBS"
    },
    {
        "code": "0C",
        "image": "https://deckofcardsapi.com/static/img/0C.png",
        "images": {
            "svg": "https://deckofcardsapi.com/static/img/0C.svg",
            "png": "https://deckofcardsapi.com/static/img/0C.png"
        },
        "value": "10",
        "suit": "CLUBS"
    }
])

export default function RoomPage() {
    const [userName, setUserName] = useState<string>('');
    const [errMsg, setErrMsg] = useState<string>('');
    const [isOpen, setIsOpen] = useState<Boolean>(true);
    const [isCopied, setIsCopied] = useState<Boolean>(false);
    const [players, setPlayers] = useState<Players[]>([]);
    const [cards, setCards] = useState<Cards[]>([]);

    const params = useParams();
    const roomId = params.roomId.toString();
    let cursor = {
        x: null as number | null,
        y: null as number | null
    }
    let note = {
        dom: null as HTMLElement | null,
        x: null as number | null,
        y: null as number | null
    }
    const handleMouseDown = (e: React.MouseEvent) => {  
        const target = e.target as HTMLElement;
        if(target.classList.contains('custom-cards')){
            cursor = {
                x: e.clientX,
                y: e.clientY
            }
            note = {
                dom: target,
                x: target.getBoundingClientRect().left,
                y: target.getBoundingClientRect().top
            }
        }
    }

    const handleMouseMove = (e: React.MouseEvent) => {
        if(note.dom == null) return;
        let currentCursor = {
            x: e.clientX,
            y: e.clientY
        }
        let distance = {
            x: cursor.x !== null ? currentCursor.x - cursor.x : 0,
            y: cursor.y !== null ? currentCursor.y - cursor.y : 0
        }
        note.dom.style.left = (note.x !== null ? note.x + distance.x : 0) - 216 + 'px';
        note.dom.style.top = (note.y !== null ? note.y + distance.y : 0) - 216 + 'px';
        note.dom.style.cursor = 'grab';
    }

    const handleMouseUp = (e: React.MouseEvent) => {
        if( note.dom == null) return;
        note.dom.style.cursor = 'auto';
        note.dom = null;  
    }

    useEffect(() => {
        const handleLoad = () => {
            socket.on('connect', () => {
                console.log(`Connected to the server with ID: ${socket.id}`);
            });

            socket.on('connect_error', (err) => {
                console.error('Connection error:', err);
            });
        };
        window.addEventListener('load', handleLoad);
        return () => {
            window.removeEventListener('load', handleLoad);
        };
    }, []);

    const handlePlay = () => {
        if (userName.trim() === '') {
            setErrMsg('Enter a username');
            console.error('No username provided');
            return;
        }
        setIsOpen(false);
        console.log(`Attempting to join room ${roomId} as ${userName.trim()}`);
        socket.emit('joinRoom', roomId, userName.trim());
    };

    useEffect(() => {
        socket.on('updatePlayers', (updatedPlayers) => {
            console.log('Player list updated:', updatedPlayers);
            setPlayers(updatedPlayers);
        });

        return () => {
            console.log('Cleaning up updatePlayers listener');
            socket.off('updatePlayers');
        };
    }, []);

    useEffect(() => {
        const handleDealCards = (cards: any) => {
            console.log('Received cards:', cards);
            setCards(cards);
        };

        console.log('Setting up dealCards listener');
        socket.on('dealCards', handleDealCards);

        return () => {
            console.log('Cleaning up dealCards listener');
            socket.off('dealCards', handleDealCards);
        };
    }, []);

    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            console.log(`Ending game for room ${roomId}`);
            socket.emit('endGame', roomId);
        };

        console.log('Setting up beforeunload listener');
        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            console.log('Cleaning up beforeunload listener');
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [roomId]);

    const getCopyLink = () => {
        if (roomId) {
            navigator.clipboard.writeText(roomId)
            .then(() => {
                console.log('Room ID copied to clipboard');
                setIsCopied(true);
            })
            .catch(err => {
                console.error('Failed to copy room ID:', err);
            });
        }
    };

    const handleStartGame = () => {
        console.log(`Starting game in room ${roomId}`);
        socket.emit("startGame", roomId);
    };

    useEffect(() => {
        console.log(`Current socket ID: ${socket.id}`);
        console.log(`Players in room: ${players.join(', ')}`);
    }, [players]);

    return (
        <div className="font-handwriting flex" onMouseDown={(e)=>handleMouseDown(e)} onMouseMove={(e)=>handleMouseMove(e)} onMouseUp={(e)=>handleMouseUp(e)}>
            <div className="flex flex-col gap-2 w-64 h-screen bg-yellow-50 border-4 p-2 items-center border-black ring-4 ring-white">
                <h1 className="text-2xl">Your Room</h1>
                <p className="text-3xl tracking-widest">{roomId}</p>
                <button className="text-md" onClick={getCopyLink}><u>Share the link</u> {!isCopied ? <FontAwesomeIcon icon={faCopy} size="sm"/> : <FontAwesomeIcon icon={faClipboard} size="sm"/>}</button>
                <button onClick={handleStartGame} type="submit" className="border-2 bg-white border-black w-28 pt-1.5 pb-1 rounded-lg">
                    Start Game
                </button>
                <p className="mt-4 font-bold mb-2">Players: </p>
                <ul className="text-center">
                    {players.map((player, index) => (
                        <li key={index}>{player.username}</li>
                    ))}
                </ul>
            </div>
            {!isOpen &&
                <form onSubmit={handlePlay} className="font-bold absolute top-0 left-0 bg-zinc-900/20 backdrop-blur-sm w-screen h-screen flex items-center justify-center">
                    <div className="flex flex-col gap-6 bg-yellow-50 rounded-lg border-4 p-4 items-center border-black ring-4 ring-white">
                        <h1 className="text-3xl ">Enter Username</h1>
                        <input value={userName} onChange={(e) => setUserName(e.target.value)} className="h-6 px-1 w-40 text-xl tracking-wider outline-none border-b-2 bg-yellow-50 border-black"/>
                        <button type="submit" className="border-2 text-lg tracking-wider bg-white border-black w-28 pt-1.5 pb-1 rounded-lg">Play!</button>
                    </div>
                </form>
            }
            <div className="relative w-full h-full flex flex-col">
                <div className="relative bg-red-50 h-[420px]">
                    {tempCards.map((card, index) => (
                        <img
                            className={`w-36 absolute top-16 left-1/2 -translate-y-4 hover:scale-110 duration-200 custom-cards shadow-xl shadow-gray-800/50`}
                            style={{
                                '--index': index,
                                '--totalCards': tempCards.length,
                            } as CustomCSSProperties}
                            key={index}
                            src={card.images.png}
                            alt={card.code}
                        />
                    ))}
                </div>
                <div className="relative bg-yellow-50 w-full h-[356px] flex justify-center items-center">
                    <div className="w-48 h-64 bg-blue-300"></div>
                </div>
            </div>
        </div>
    )
}
