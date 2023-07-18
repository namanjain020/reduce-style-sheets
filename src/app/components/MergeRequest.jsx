"use client";
import React from 'react';

const UnifiedDiffView = ({ diff }) => {
  return (
    <pre className="bg-gray-100 p-4 overflow-auto">
      <code className="text-xs font-mono">
        {diff.map((line, index) => (
          <span key={index} className={line.type}>
            {line.content}
          </span>
        ))}
      </code>
    </pre>
  );
};

export default UnifiedDiffView;