import React from 'react';

// tab to make debugger visible
export const DebugTab = props => (
  <div
    style={{
      position: 'fixed',
      width: '200px',
      padding: '5px 2px',
      textAlign: 'center',
      color: '#333',
      fontWeight: 'bold',
      backgroundColor: '#fff',
      border: '1px solid #ddd',
      borderRadius: 5,
      cursor: 'pointer',
      pointerEvents: 'auto',
      top: 20,
      right: 20
    }}
    onClick={props.toggleDebugger}
  >
    DEBUGGER
  </div>
);
