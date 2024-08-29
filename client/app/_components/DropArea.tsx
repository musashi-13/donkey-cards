'use client'
import { useDrop, DropTargetMonitor } from 'react-dnd';
import { CSSProperties, FC } from 'react';
import { useEffect, useRef } from 'react';
interface DropAreaProps {
  onDrop: (item: any) => void;
}

const DropArea: FC<DropAreaProps> = ({ onDrop }) => {
  const [{ isOver }, drop] = useDrop({
    accept: 'CARD',
    drop: (item: any, monitor: DropTargetMonitor) => {
      onDrop(item);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const dropAreaStyle: CSSProperties = {
    backgroundColor: isOver ? 'rgba(0, 255, 0, 0.2)' : 'transparent',
    border: '4px solid green',
    width: '320px',
    height: '200px',
    position: 'absolute',
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 1,
  };
  const divRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (divRef.current) {
      drop(divRef.current);
    }
  }, [drop]);
  return (
      <div ref={divRef} style={dropAreaStyle}>
          <p className="text-center">Drop here</p>
      </div>
  );
};

export default DropArea;
