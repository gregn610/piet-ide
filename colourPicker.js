import React from 'react';
import { colours, WHITE, BLACK } from './colours.js';

const ColourPicker = props => (
  <div
    style={{
      gridColumn: 'cpicker',
      gridRow: '1 / 4',
      position: 'relative',
      top: -5
    }}
  >
    <div>
      {[colours.slice(0, 6), colours.slice(6, 12), colours.slice(12, 18)].map(
        (colourRow, i) => (
          <div
            style={{ display: 'flex', width: '100%' }}
            key={'colour-row-' + i}
          >
            {colourRow.map((colour, j) => (
              <ColourCell
                key={'colour-cell-' + i + '-' + j}
                cellColour={i * 6 + j}
                {...props}
              />
            ))}
          </div>
        )
      )}
      <div style={{ display: 'flex', width: '100%' }}>
        <ColourCell cellColour={WHITE} {...props} />
        <ColourCell cellColour={BLACK} {...props} />
      </div>
    </div>
  </div>
);

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

export default ColourPicker;
