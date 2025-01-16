import React, { useState, useEffect, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { SlideCard } from './SlideCard';
import { LoadingSkeleton } from './LoadingSkeleton';
import { OutlineContentProps, Slide } from '../types/outline';
import { callAiPresentationOutline } from '../../../../shared/apis/ai-presentation';
import { AiPresentationOutlinePayload } from '../../../../shared/apis/types/presentation';

export const OutlineContent: React.FC<OutlineContentProps> = ({
  presentationData,
  slides,
  onSlidesChange,
}) => {
  const [draggedItem, setDraggedItem] = useState<number | null>(null);
  const [dragOverItem, setDragOverItem] = useState<number | null>(null);
  const [nextId, setNextId] = useState(slides.length + 1);

  const { mutate: getOutline, isPending } = useMutation({
    mutationFn: (data: AiPresentationOutlinePayload) => callAiPresentationOutline(data),
    onSuccess: (response) => {
      try {
        const outlineData = JSON.parse(response.outline);
        const newSlides = outlineData.slides.map((slide: any, index: number) => ({
          id: nextId + index,
          name: slide.title,
          subtitle: slide.mediumDescription || '',
          position: index + 1
        }));
        
        onSlidesChange(newSlides);
        setNextId(nextId + outlineData.slides.length);
      } catch (error) {
        console.error('Error parsing outline data:', error);
      }
    }
  });

  useEffect(() => {
    if (slides.length === 0) {
      getOutline(presentationData);
    }
  }, []);

  const handleChange = useCallback((id: number, field: keyof Slide, value: string) => {
    const newSlides = slides.map(slide => 
      slide.id === id ? { ...slide, [field]: value } : slide
    );
    onSlidesChange(newSlides);
  }, [slides, onSlidesChange]);

  const handleMove = useCallback((index: number, direction: 'up' | 'down') => {
    const newSlides = [...slides];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex >= 0 && targetIndex < slides.length) {
      const temp = newSlides[index].position;
      newSlides[index].position = newSlides[targetIndex].position;
      newSlides[targetIndex].position = temp;
      newSlides.sort((a, b) => a.position - b.position);
      onSlidesChange(newSlides);
    }
  }, [slides, onSlidesChange]);

  const handleDelete = useCallback((id: number) => {
    const newSlides = slides
      .filter(slide => slide.id !== id)
      .map((slide, index) => ({
        ...slide,
        position: index + 1
      }));
    onSlidesChange(newSlides);
  }, [slides, onSlidesChange]);

  const handleDragStart = useCallback((position: number) => {
    setDraggedItem(position);
  }, []);

  const handleDrop = useCallback((dropPosition: number) => {
    if (draggedItem === null || draggedItem === dropPosition) return;

    const newSlides = [...slides];
    const draggedSlide = newSlides.find(slide => slide.position === draggedItem);
    const dropSlide = newSlides.find(slide => slide.position === dropPosition);

    if (draggedSlide && dropSlide) {
      const tempPosition = draggedSlide.position;
      draggedSlide.position = dropSlide.position;
      dropSlide.position = tempPosition;

      newSlides.sort((a, b) => a.position - b.position);
      onSlidesChange(newSlides);
    }
  }, [draggedItem, slides, onSlidesChange]);

  const addSlide = useCallback(() => {
    const newSlide: Slide = {
      id: nextId,
      name: '',
      subtitle: '',
      position: slides.length + 1,
    };
    onSlidesChange([...slides, newSlide]);
    setNextId(prev => prev + 1);
  }, [nextId, slides, onSlidesChange]);

  if (isPending) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-3">
      {slides.map((slide, index) => (
        <SlideCard
          key={slide.id}
          slide={slide}
          index={index}
          totalSlides={slides.length}
          onMove={(direction) => handleMove(index, direction)}
          onDelete={() => handleDelete(slide.id)}
          onChange={(field, value) => handleChange(slide.id, field, value)}
          onDragStart={() => handleDragStart(slide.position)}
          onDragEnd={() => setDraggedItem(null)}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOverItem(slide.position);
          }}
          onDrop={() => handleDrop(slide.position)}
          isDragOver={dragOverItem === slide.position}
        />
      ))}
      <button
        onClick={addSlide}
        className="flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors w-full"
      >
        <Plus className="w-5 h-5 mr-2" />
        Add New Slide
      </button>
    </div>
  );
};

export default OutlineContent;