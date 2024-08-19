"use client"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboard, faCopy } from "@fortawesome/free-regular-svg-icons";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import socket from "@/app/socket";

export default function RoomPage() {
    const [userName, setUserName] = useState<string>('');
    const [errMsg, setErrMsg] = useState<string>('');
    const [isOpen, setIsOpen] = useState<Boolean>(true);
    const [isCopied, setIsCopied] = useState<Boolean>(false);
    const [players, setPlayers] = useState<string[]>([]);
    
    
    const params = useParams()
    const roomId = params.roomId.toString()

    useEffect(() => {
        const handleLoad = () => {
            socket.on('connect', () => {
                console.log('Connected to the server in roomid');
            });
        };
        window.addEventListener('load', handleLoad);
        return () => {
            window.removeEventListener('load', handleLoad);
        };
    }, []);

    const handlePlay = () => {
        if (userName === '') {
            setErrMsg('Enter a username');
            return;
        }
        setIsOpen(false);
        console.log('Is Open:', isOpen);
        socket.emit('joinRoom', roomId, userName);
        console.log("Joined room")
    }
    useEffect(() => {
        // Listen for the 'updatePlayers' event from the server
        socket.on('updatePlayers', (updatedPlayers) => {
            setPlayers(updatedPlayers); // Update the state with the new list of players
        });

        return () => {
            socket.off('updatePlayers'); // Cleanup the event listener on component unmount
        };
    }, []);

    useEffect(() => {
        socket.on('dealCards', (cards) => {
            console.log('Received cards:', cards);
            // Update the state to display the cards in the UI
        });
    }, []);

    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            socket.emit('endGame', roomId);
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [roomId]);

    const getCopyLink= () => {
        if (roomId) {
            navigator.clipboard.writeText(roomId)
            .then(() => {
                console.log('Room ID copied to clipboard');
                setIsCopied(true)
            })
            .catch(err => {
                console.error('Failed to copy room ID: ', err);
            });
        }
    }

    const handleStartGame= () => {
        socket.emit("startGame", roomId);
    }
    return (
        <div className="font-handwriting">
            <div className="flex flex-col justify-around w-64 bg-yellow-50 rounded-lg border-4 p-2 items-center border-black ring-4 ring-white">
                <h1 className="text-2xl">Your Room</h1>
                <p className="text-3xl tracking-widest">{roomId}</p>
                <button className="text-md" onClick={getCopyLink}><u>Share the link</u> {!isCopied ? <FontAwesomeIcon icon={faCopy} size="sm"/> : <FontAwesomeIcon icon={faClipboard} size="sm"/>}</button>
                <button onClick={handleStartGame} type="submit" className="border-2 bg-white border-black w-28 pt-1.5 pb-1 rounded-lg">
                    Start Game
                </button>
                <p className="mt-4 font-bold mb-2">Players: </p>
                <ul className="text-center">
                    {players.map((player, index) => (
                        <li key={index}>{player}</li> // Display each player's name in a list
                    ))}
                </ul>
            </div>
            {isOpen &&
                <form onSubmit={handlePlay} className="font-bold absolute top-0 left-0 bg-zinc-900/20 backdrop-blur-sm w-screen h-screen flex items-center justify-center">
                    <div className="flex flex-col gap-6 bg-yellow-50 rounded-lg border-4 p-4 items-center border-black ring-4 ring-white">
                        <h1 className="text-3xl ">Enter Username</h1>
                        <input value={userName} onChange={(e) => setUserName(e.target.value)} className="h-6 px-1 w-40 text-xl tracking-wider outline-none border-b-2 bg-yellow-50 border-black"/>
                        <button type="submit" className="border-2 text-lg tracking-wider bg-white border-black w-28 pt-1.5 pb-1 rounded-lg">Play!</button>
                    </div>
                </form>
            }
        </div>      
    )
}