import React from 'react';
import { colours, WHITE, BLACK } from './colours.js';

const ColourCell = props => (
  <div
    colSpan={props.colSpan ? props.colSpan : '1'}
    style={{
      boxSizing: 'border-box',
      height: '32px',
      padding: '5px',
      backgroundColor: colours[props.cellColour],
      border:
        props.selectedColour == props.cellColour
          ? '2px solid white'
          : '2px solid black',
      color: 'white',
      textAlign: 'center',
      textShadow: '1px 1px 1px black',
      cursor: 'pointer',
      flex: 1
    }}
    onClick={() => props.selectColour(props.cellColour)}
  >
    {props.commands[props.cellColour]}
  </div>
);

export default ColourCell;
