"use client"
import ky from "ky";
import Image from "next/image";
import { useState } from "react";

interface Deck {
  success: boolean,
  deck_id: string,
  remaining: number,
  shuffled: boolean,
}

async function distributeCards(deckId: string, playerCount: number) {
  const deckOfPlayers = [];
  console.log(deckId)
  const totalCards = 52;
  for(let i = 0; i < playerCount; i++) {
    const playerDeck = [];
    for(let j = 0; j < totalCards/playerCount; j++) {
      const res = ky.get(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`).json();
      playerDeck.push(res);
    }
    deckOfPlayers.push(playerDeck);
  }
  console.log(deckOfPlayers);
}

export default function Home() {
  const [deckId, setDeckId] = useState<string>('');
  const [playerCount, setPlayerCount] = useState<number>(3);
  
  async function GetSessionDeck() {
    try {
      const res = await ky.get("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
      console.log(res)
      res.json<Deck>();
      // setDeckId(res.deck_id);
      // console.log(deckId)
      // distributeCards(deckId, playerCount);
    } catch (error) {
      console.error(error);
    }
  }
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <button onClick={GetSessionDeck}>Click Me</button>
    </main>
  );
}
