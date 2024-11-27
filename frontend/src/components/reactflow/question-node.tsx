// question-node.tsx
import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';

interface QuestionNodeProps {
  data: {
    label: string;
    isNew?: boolean;
    onSubmit?: (question: string) => void;
  };
}

const QuestionNode: React.FC<QuestionNodeProps> = ({ data }) => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = () => {
    if (data.onSubmit) {
      data.onSubmit(inputValue);
    }
  };

  return (
    <div className="question-node bg-white border border-gray-300 rounded-md p-2">
      {data.isNew ? (
        <div>
          <input
            type="text"
            placeholder="Enter your question"
            value={inputValue}
            onChange={handleInputChange}
            className="border rounded w-full px-2 py-1"
          />
          <button
            onClick={handleSubmit}
            className="mt-2 px-2 py-1 bg-blue-500 text-white rounded"
          >
            Submit
          </button>
        </div>
      ) : (
        <div>
          <strong>{data.label}</strong>
        </div>
      )}
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default QuestionNode;
