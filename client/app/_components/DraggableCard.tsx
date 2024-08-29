'use client'
import React, { useEffect, useRef } from 'react';   
import { useDrag } from 'react-dnd';
import { CSSProperties } from 'react';
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


interface DraggableCardProps {
  card: Cards;
  index: number;
  moveCard: (code: string) => void;
  originalPosition: { x: number, y: number };
  totalCards: number;
}

const DraggableCard: React.FC<DraggableCardProps> = ({ card, index, moveCard, originalPosition, totalCards }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'CARD',
    item: { code: card.code, originalPosition },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const cardStyle: CSSProperties = {
    position: 'absolute',
    left: originalPosition?.x ?? 400, // Fallback to default value
    top: originalPosition?.y ?? 0,    // Fallback to default value
    zIndex: isDragging ? 1000 : 'auto',
    opacity: isDragging ? 0.5 : 1,
    transition: 'transform 0.2s ease',
    transform: isDragging ? 'scale(1.1)' : 'none',
  };

  const imgRef = useRef<HTMLImageElement>(null);
  
  useEffect(() => {
    if (imgRef.current) {
      drag(imgRef.current);
    }
  }, [drag]);
  
  return (
    <img
      ref={imgRef}
      src={card.images.png}
      alt={card.code}
      className={`w-36 custom-cards shadow-xl shadow-gray-800/50`}
      style={{ ...cardStyle, ...{
        '--index': index,
        '--totalCards': totalCards, // Replace with the appropriate variable or value
    } as CustomCSSProperties }}
    />
  );
};

export default DraggableCard;
