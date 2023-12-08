import React from 'react';

// run/step/continue/stop/pause + set BP control buttons
const DebugControls = ({
  start,
  pause,
  step,
  cont,
  stop,
  paintMode,
  toggleSetBP,
  runner,
  runSpeed
}) => (
  <div>
    <div
      className="btn-toolbar"
      role="toolbar"
      style={{ display: 'flexbox', margin: '0 0 1vh' }}
    >
      <div className="btn-group btn-group-sm" style={{ margin: '0 0 5px' }}>
        <button
          type="button"
          className="btn btn-success"
          title="Run from the beginning"
          disabled={runner}
          onClick={start}
        >
          <i className="glyphicon glyphicon-play" />
        </button>
      </div>
      <div
        className="btn-group btn-group-sm"
        role="group"
        style={{ margin: '0 0 0 10px' }}
      >
        <button
          type="button"
          className="btn btn-warning"
          title="Pause"
          onClick={pause}
        >
          <i className="glyphicon glyphicon-pause" />
        </button>
        <button
          type="button"
          className="btn btn-info"
          title="Step"
          disabled={runner}
          onClick={step}
        >
          <i className="glyphicon glyphicon-step-forward" />
        </button>
        <button
          type="button"
          className="btn btn-info"
          title="Continue running from this point"
          disabled={runner}
          onClick={cont}
        >
          <i className="glyphicon glyphicon-fast-forward" />
        </button>
      </div>
      <div className="btn-group btn-group-sm" style={{ margin: '0 0 0 5px' }}>
        <button
          type="button"
          className="btn btn-danger"
          title="Stop"
          onClick={stop}
        >
          <i className="glyphicon glyphicon-stop" />
        </button>
      </div>
      <div
        className="btn-group btn-group-sm"
        role="group"
        style={{ margin: '0 0 0 10px' }}
      >
        <i
          className="glyphicon glyphicon-map-marker"
          title="Set breakpoints"
          style={{
            fontSize: '18px',
            margin: '0 0 0 0',
            padding: '3px 0 3px',
            cursor: 'pointer',
            color: paintMode == 'BP' ? 'red' : 'black'
          }}
          onClick={toggleSetBP}
        />
      </div>
    </div>
    <div>Speed: {(2400 - runSpeed) / 200}</div>
  </div>
);

export default DebugControls;
