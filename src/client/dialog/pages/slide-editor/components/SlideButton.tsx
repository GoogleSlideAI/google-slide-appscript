type slideDetailProps = {
  index: number;
  isActive: boolean;
}

type slideButtonProps = {
  slideDetails: slideDetailProps;
  deleteSlide: (index: number) => void;
  setActiveSlide: (index: number) => void
  onClick: () => void;
}

const SlideButton = ( props: slideButtonProps) => {
  const {slideDetails, deleteSlide, setActiveSlide} = props;
  const { index, isActive } = slideDetails;

  return (
    <div
      className={`mt-5 py-3 w-1/2 justify-center border-b-2 title-font font-medium inline-flex leading-none ${
        isActive
          ? `bg-gray-100 border-blue-500 text-blue-500 tracking-wider rounded-t`
          : `border-gray-200 hover:text-gray-900 tracking-wider`
      } flex flex-wrap space-x-2 p-2 items-end`}
    >
      <button
        className="bg-transparent hover focus:outline-none grow"
        onClick={() => setActiveSlide(index)}
      >
        {`Slide ${index + 1}`}
      </button>
      <button
        className="bg-transparent hover:text-red-500 sm"
        onClick={() => deleteSlide(index)}
      >
        <svg
          aria-hidden="true"
          focusable="false"
          data-prefix="fas"
          data-icon="times"
          className="w-3 ml-3"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 352 512"
        >
          <path
            fill="currentColor"
            d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24
            c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93
            89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21
            111.45c-12.28 12.28-12.28 32.19 0
            44.48L109.28 256 9.21
            356.07c-12.28 12.28-12.28 32.19 0
            44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48
            0L176 322.72l100.07
            100.07c12.28 12.28 32.2 12.28 44.48
            0l22.24-22.24c12.28-12.28 12.28-32.19
            0-44.48L242.72 256z"
          ></path>
        </svg>
      </button>
    </div>
  );
};

export default SlideButton;
