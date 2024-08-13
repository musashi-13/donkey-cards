export default function Lobby() {
    return (
        <div>
            <div className="flex font-handwriting font-bold flex-col gap-2 ring-4 ring-white bg-yellow-50 w-96 h-64 p-4 items-center rounded-lg border-4 border-black">
                <h1 className="text-3xl m-2">Play Donkey Cards</h1>
                <div className="mt-2 text-xl flex gap-4">
                    <label className="w-20 h-6">Username:</label>
                    <input className="h-6 px-1 w-40 outline-none border-b-2 bg-yellow-50 border-black"/>
                </div>
                <div className="mt-2 text-xl flex gap-4">
                    <label className="w-20 h-6">Room ID:</label>
                    <input className="h-6 px-1 w-40 outline-none border-b-2 bg-yellow-50 border-black"/>
                </div>
                <div className="w-full px-8 mt-6 flex justify-around">
                    <button className="border-2 border-black w-28 pt-1.5 pb-1 rounded-lg">
                        Join Room
                    </button>
                    <button className="border-2 border-black w-28 pt-1.5 pb-1 rounded-lg">
                        Create Room
                    </button>
                </div>
            </div>
        </div>
    )
}