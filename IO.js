import React from 'react';

// IO visual containers
const IO = ({ output }) => (
  <div>
    <div>
      <b>Output</b>
    </div>
    <div
      readOnly
      style={{
        width: '100%',
        maxWidth: '100%',
        fontFamily: 'monospace',
        fontSize: '12pt',
        border: 0
      }}
    >
      {output}
    </div>
  </div>
);

export default IO;
