import { ReactNode } from 'react';

type DialogProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
};

const Dialog = ({ isOpen, onClose, title, children }: DialogProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
          <div className="absolute right-0 top-0 pr-4 pt-4">
            <button
              onClick={onClose}
              className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <span className="sr-only">Close</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="text-center sm:text-left">
            <h3 className="text-xl font-semibold leading-6 text-gray-900 mb-4">
              {title}
            </h3>
          </div>

          <div className="mt-2">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dialog;