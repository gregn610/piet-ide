import React from 'react';
import { normalize } from 'path';

// main debugger component container

let dragStartX = 0;
let dragStartY = 0;
let dragTimeout = null;

class Debugger extends React.Component {
  constructor() {
    super();
    // this.startPos = 0; // save the starting position of the debugger, for when it is dragged
    this.state = {
      positionRight: 20,
      positionTop: 20
    };
  }

  updatePos() {
    //
    updatePos;
  }

  render() {
    return (
      <div
        id="debugger"
        style={{
          position: 'fixed',
          alignSelf: 'start',
          marginTop: '0',
          width: '225px',
          height: 'auto',
          border: '1px solid #ddd',
          borderRadius: '5px',
          background: 'white',
          pointerEvents: 'auto',
          zIndex: 100,
          right: this.state.positionRight,
          top: this.state.positionTop,
          bottom: 20
        }}
      >
        <div
          draggable="true"
          style={{
            height: '25px',
            padding: '0 5px 5px',
            borderBottom: '1px solid #ddd',
            borderRadius: '5px 5px 0 0',
            cursor: 'move',
            background: '#f0f0f0'
          }}
          onDragStart={event => {
            dragStartX = event.clientX;
            dragStartY = event.clientY;
          }}
          onDrag={event => {
            clearTimeout(dragTimeout);
            const currentX = event.clientX;
            const currentY = event.clientY;
            dragTimeout = setTimeout(() => {
              const diffX = currentX - dragStartX;
              const diffY = currentY - dragStartY;
              dragStartX = currentX;
              dragStartY = currentY;
              if ((currentX === 0) & (currentY === 0)) return;
              const newPositionRight = Math.max(
                0,
                this.state.positionRight - diffX
              );
              const newPositionTop = Math.max(
                0,
                this.state.positionTop + diffY
              );
              this.setState({
                positionRight: newPositionRight,
                positionTop: newPositionTop
              });
            }, 4);
          }}
        >
          <button
            type="button"
            className="close"
            aria-label="Close"
            onClick={() => this.props.toggleDebugger()}
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div style={{ padding: '5px' }}>
          <Commands {...this.props} {...this.props.debug} />
          <DebugControls {...this.props} {...this.props.debug} />
          <Pointers {...this.props.debug} />
          <Stack {...this.props.debug} />
          <IO {...this.props} {...this.props.debug} />
        </div>
      </div>
    );
  }
}

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

// run/step/continue/stop/pause + set BP control buttons
const DebugControls = ({
  start,
  pause,
  step,
  cont,
  stop,
  runSpeed,
  isInterpreting,
  setRunSpeed,
  paintMode,
  toggleSetBP
}) => (
  <div className="btn-toolbar" role="toolbar" style={{ margin: '0 0 1vh' }}>
    <div
      className="btn-group btn-group-sm"
      style={{ width: '52px', margin: '0' }}
    >
      <button
        type="button"
        className="btn btn-success"
        title="Run from the beginning"
        onClick={start}
      >
        <i className="glyphicon glyphicon-play" />
      </button>
      {/* <ul className="dropdown-menu">
        <li style={{ padding: '0 5px' }}>
          <small style={{ float: 'left' }}>Slower</small>
          <small style={{ float: 'right' }}>Faster</small>
          <input
            type="range"
            min="0"
            max="1000"
            step="100"
            value={1000 - runSpeed}
            onChange={event =>
              !isInterpreting && setRunSpeed(1000 - event.target.value)
            }
          />
        </li>
      </ul> */}
    </div>
    <div
      className="btn-group btn-group-sm"
      role="group"
      style={{ width: '136px', margin: '0 0 0 4px' }}
    >
      <button
        type="button"
        className="btn btn-warning"
        title="Pause"
        onClick={() => pause()}
      >
        <i className="glyphicon glyphicon-pause" />
      </button>
      <button
        type="button"
        className="btn btn-info"
        title="Step"
        onClick={() => step()}
      >
        <i className="glyphicon glyphicon-step-forward" />
      </button>
      <button
        type="button"
        className="btn btn-primary"
        title="Continue running from this point"
        onClick={() => cont()}
      >
        <i className="glyphicon glyphicon-fast-forward" />
      </button>
      <button
        type="button"
        className="btn btn-danger"
        title="Stop"
        onClick={() => stop()}
      >
        <i className="glyphicon glyphicon-stop" />
      </button>
    </div>

    <i
      className="glyphicon glyphicon-map-marker"
      title="Set breakpoints"
      style={{
        fontSize: '18px',
        margin: '0 0 0 3px',
        padding: '5px 0',
        cursor: 'pointer',
        color: paintMode == 'BP' ? 'red' : 'black'
      }}
      onClick={() => toggleSetBP()}
    />
  </div>
);

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

// visual representation of program pointers
const Pointers = ({ DP, CC }) => (
  <div style={{ width: '100%', textAlign: 'center', fontWeight: 'bold' }}>
    DP:&nbsp;
    <i
      className={
        'glyphicon glyphicon-arrow-' + ['right', 'down', 'left', 'up'][DP]
      }
    />
    &emsp; CC:&nbsp;
    <i className={'glyphicon glyphicon-arrow-' + ['left', 'right'][CC]} />
  </div>
);

export default Debugger;
