import { useState, ChangeEvent, FormEvent } from "react";
import PropTypes from "prop-types";

const FormInput = ({
  submitNewSlide,
}: {
  submitNewSlide: (arg: string) => void;
}) => {
  const [inputValue, setInputValue] = useState("");

  const handleChange = (event: ChangeEvent<HTMLInputElement>) =>
    setInputValue(event.target.value);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (inputValue.length === 0) return;

    submitNewSlide(inputValue);
    setInputValue("");
  };

  return (
    <form className="flex w-full mx-auto items-center" onSubmit={handleSubmit}>
      <div className="grow pr-2 py-1">
        <input
          className="p-2 w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-blue-500 focus:bg-transparent focus:ring-2 focus:ring-blue-200 text-base outline-none text-gray-700 py-1 transition-colors duration-200 ease-in-out"
          onChange={handleChange}
          value={inputValue}
          placeholder="New slide title"
        />
      </div>
      <button
        className="text-white bg-blue-500 border-0 py-2 px-8 focus:outline-none hover:bg-blue-600 rounded"
        type="submit"
      >
        Add Slide
      </button>
    </form>
  );
};

export default FormInput;

FormInput.propTypes = {
  submitNewSlide: PropTypes.func,
};
