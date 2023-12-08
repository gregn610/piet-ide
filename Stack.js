import React from 'react';

// visual representation of stack
const Stack = ({ stack }) => (
  <table style={{ margin: 'auto auto 1vh', width: '100%' }}>
    <thead>
      <tr>
        <td>
          <b>Stack</b>
        </td>
      </tr>
    </thead>
    <tbody>
      {stack
        .concat('⮟')
        .reverse()
        .map((val, i) => (
          <tr
            key={'val-' + i}
            style={{
              border: '1px solid black',
              width: '100%',
              height: '2ex',
              textAlign: 'center',
              verticalAlign: 'center',
              fontFamily: 'monospace',
              fontSize: '12pt',
              wordBreak: 'break-all'
            }}
          >
            <td>{val}</td>
          </tr>
        ))}
    </tbody>
  </table>
);

export default Stack;
