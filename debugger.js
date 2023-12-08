import React from 'react';
import { normalize } from 'path';

// main debugger component container
import Commands from './Commands.js'
import DebugControls from './DebugControls.js'
import Pointers from './Pointers.js'
import Stack from './Stack.js'
import IO from './IO.js'

let dragStartX = 0;
let dragStartY = 0;
let dragTimeout = null;
let lastPositionRight = 20;
let lastPositionTop = 20;

class Debugger extends React.Component {
  constructor() {
    super();
    // this.startPos = 0; // save the starting position of the debugger, for when it is dragged
    this.state = {
      positionRight: lastPositionRight,
      positionTop: lastPositionTop
    };
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
              // persistenct when toggle
              lastPositionRight = newPositionRight;
              lastPositionTop = newPositionTop;
            }, 4);
          }}
        >
          <button
            type="button"
            className="close"
            aria-label="Close"
            onClick={this.props.toggleDebugger}
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

export default Debugger;
