import React from "react";

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return (
    <div className="flex items-center justify-center min-h-[90vh]">
      <div>
        <h1 className="text-6xl font-bold text-black mb-4 text-center pb-[30px]">
          Oops!
        </h1>
        <p className="text-red-600 text-sm md:text-base bg-red-50 border border-red-200 px-4 py-3 rounded">
          {message}
        </p>
      </div>
    </div>
  );
};

export default ErrorMessage;
