import { useState, useEffect } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import FormInput from './components/FormInput';
import SlideButton from './components/SlideButton';
import Dialog from './components/Dialog';
import { serverFunctions } from '../../../utils/serverFunctions';
import LoadingSpinner from '../../../shared/components/loading-spinner';
import { useServerFunction } from '../../../shared/hooks/useServerFunction';

type ResponseProp = {
  id: string;
  index: number;
  isActive: boolean;
};



const SlideEditor = () => {
  const [slides, setSlides] = useState<ResponseProp[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSlide, setSelectedSlide] = useState<ResponseProp | null>(null);
  const { isLoading, error, execute } = useServerFunction<ResponseProp[]>();

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        await execute(
          () => serverFunctions.getSlidesData(),
          (data) => setSlides(data)
        );
      } catch (err) {
      }
    };
    fetchSlides();
  }, []);

  const deleteSlide = async (slideIndex: number) => {
    await execute(
      () => serverFunctions.deleteSlide(slideIndex),
      (data) => setSlides(data)
    );
  };

  const setActiveSlide = async (slideIndex: number) => {
    await execute(
      () => {
        serverFunctions.setActiveSlide(slideIndex);
        return serverFunctions.getSlidesData();
      },
      (data) => setSlides(data)
    );
  };

  const submitNewSlide = async () => {
    await execute(
      () => serverFunctions.addSlide(),
      (data) => setSlides(data)
    );
  };

  const handleSlideClick = (slide: ResponseProp) => {
    setSelectedSlide(slide);
    setIsDialogOpen(true);
  };
  
  const ErrorAlert = ({ message }: { message: string }) => (
    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-4">
      <strong className="font-bold">Error: </strong>
      <span className="block sm:inline">{message}</span>
    </div>
  );

  return (
    <div className='p-5 h-full relative'>
      {isLoading && <LoadingSpinner />}
      {error && <ErrorAlert message={error} />}
      
      <p className="font-bold mb-2">Create or Delete Slides</p>
      <p className="mb-4">
        This is a sample page that demonstrates a simple React app. Enter a title
        for a new slide, hit enter, and the new slide will be created. Click the
        red &times; next to the slide to delete it.
      </p>

      <FormInput 
        submitNewSlide={submitNewSlide} 
      />

      <TransitionGroup className="slide-list">
        {slides.length > 0 &&
          slides.map((slide) => (
            <CSSTransition
              classNames="slideNames"
              timeout={500}
              key={slide.id}
            >
              <SlideButton
                slideDetails={slide}
                deleteSlide={deleteSlide}
                setActiveSlide={setActiveSlide}
                onClick={() => handleSlideClick(slide)}
              />
            </CSSTransition>
          ))}
      </TransitionGroup>
      
      <Dialog
        isOpen={isDialogOpen}
        onClose={() => !isLoading && setIsDialogOpen(false)}
        title={selectedSlide ? `Edit Slide ${selectedSlide.index + 1}` : 'New Slide'}
      >
        <div className="mt-4 space-y-4">
          <FormInput 
            submitNewSlide={submitNewSlide} 
          />
          <div className="mt-4 flex justify-end space-x-2">
            <button
              onClick={() => setIsDialogOpen(false)}
              disabled={isLoading}
              className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                // Handle save
                setIsDialogOpen(false);
              }}
              disabled={isLoading}
              className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 disabled:opacity-50"
            >
              Save
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default SlideEditor;