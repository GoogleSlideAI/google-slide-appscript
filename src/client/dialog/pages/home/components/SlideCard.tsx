import React from 'react';
import { ChevronUp, ChevronDown, GripVertical, Trash2 } from 'lucide-react';
import { Slide } from '../types/outline';

type SlideCardProps = {
  slide: Slide;
  index: number;
  totalSlides: number;
  onMove: (direction: 'up' | 'down') => void;
  onDelete: () => void;
  onChange: (field: keyof Slide, value: string) => void;
  onDragStart: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragEnd: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  isDragOver: boolean;
};

export const SlideCard: React.FC<SlideCardProps> = ({
  slide,
  index,
  totalSlides,
  onMove,
  onDelete,
  onChange,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
  isDragOver,
}) => {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDrop={onDrop}
      className={`bg-white rounded-lg border ${isDragOver ? 'border-blue-400 border-2' : 'border-gray-200'} overflow-hidden`}
    >
      <div className="flex items-center p-4 space-x-4">
        <div className="cursor-move">
          <GripVertical className="w-4 h-4 text-gray-400" />
        </div>
        <div className="text-sm text-blue-500 font-medium">
          Slide {slide.position}
        </div>
        <div className="flex-grow">
          <input
            type="text"
            value={slide.name}
            onChange={(e) => onChange('name', e.target.value)}
            className="w-full font-medium px-2 py-1 border rounded text-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter slide title"
          />
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onMove('up')}
            disabled={index === 0}
            className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Move Up"
          >
            <ChevronUp className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={() => onMove('down')}
            disabled={index === totalSlides - 1}
            className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Move Down"
          >
            <ChevronDown className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={onDelete}
            className="p-1 rounded hover:bg-red-100 text-red-600"
            title="Delete Slide"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div className="px-5 pb-4">
        <textarea
          value={slide.subtitle}
          onChange={(e) => onChange('subtitle', e.target.value)}
          className="w-full px-2 py-1 border rounded text-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter slide description"
          rows={2}
        />
      </div>
    </div>
  );
}; 