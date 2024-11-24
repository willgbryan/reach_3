import React from 'react';
import { Handle, Position } from 'reactflow';

const CustomNode = ({ data }) => {
  const { cardElement } = data;

  const handleNodeClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div
      className="custom-node bg-white border border-gray-300 rounded-md overflow-hidden"
      style={{ width: '300px' }}
      onClick={handleNodeClick}
    >
      <Handle type="target" position={Position.Top} />
      <div className="node-content overflow-y-auto" onClick={handleNodeClick}>
        {React.cloneElement(cardElement, { onClick: handleNodeClick })}
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default CustomNode;
