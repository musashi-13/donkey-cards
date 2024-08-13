"use client"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboard, faCopy } from "@fortawesome/free-regular-svg-icons";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function Page() {
    const [isCopied, setIsCopied] = useState<Boolean>(false);
    const params = useParams()
    console.log(params)
    const roomId = params.roomId.toString()
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
    return (
        <div className="font-handwriting">
            <div className="relative flex flex-col justify-around w-64 h-36 bg-yellow-50 rounded-lg border-4 p-2 items-center border-black ring-4 ring-white">
                <h1 className="text-2xl">Your Room</h1>
                <p className="text-3xl tracking-widest">{roomId}</p>
                <button className="text-md" onClick={getCopyLink}><u>Share the link</u> {!isCopied ? <FontAwesomeIcon icon={faCopy} size="sm"/> : <FontAwesomeIcon icon={faClipboard} size="sm"/>}</button>
            </div>  
        </div>
    )
}