import React from 'react';

const MergeRequest = ({ diff }) => {
  const renderDiffLine = (line, index) => {
    if (line.startsWith('+')) {
      return <pre key={index} style={{ backgroundColor: 'lightgreen' }}>{line}</pre>;
    } else if (line.startsWith('-')) {
      return <pre key={index} style={{ backgroundColor: 'lightblue' }}>{line}</pre>;
    } else {
      return <pre key={index}>{line}</pre>;
    }
  };

  return (
    <pre>
      {diff.map((line, index) => renderDiffLine(line, index))}
    </pre>
  );
};

export default MergeRequest;