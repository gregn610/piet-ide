import React from 'react';

const Commands = ({
  commandList,
  selectBlock,
  isInterpreting,
  currCommand
}) => [
  <div
    key="command-list"
    style={{
      margin: '5px auto 10px',
      padding: '5px',
      width: '100%',
      height: '40vh',
      resize: 'vertical',
      overflow: 'auto',
      fontFamily: 'monospace',
      fontSize: '11pt',
      backgroundColor: '#fff',
      border: '1px solid #ddd',
      borderRadius: 5
    }}
  >
    {commandList.map((command, i) => (
      <div
        key={'command-' + i}
        style={{ textTransform: 'uppercase' }}
        onMouseOver={() => !isInterpreting && selectBlock(command.block)}
        onMouseOut={() => !isInterpreting && selectBlock(null)}
      >
        {command.inst}
        {command.error && [
          ' ',
          <i
            key={'error-' + i}
            className="glyphicon glyphicon-exclamation-sign"
            style={{ color: 'red' }}
            title={command.error}
          />
        ]}
      </div>
    ))}
  </div>,
  <div
    key="current-command"
    style={{
      margin: '-5px 0 10px',
      width: '100%',
      fontWeight: 'bold',
      textAlign: 'center'
    }}
  >
    Current command:
    <br />
    <div style={{ height: 40 }}>
      {currCommand && currCommand.inst && currCommand.inst.toUpperCase()}
      {currCommand && currCommand.error && (
        <div style={{ color: 'red' }}>{currCommand.error}</div>
      )}
    </div>
  </div>
];


export default Commands;
