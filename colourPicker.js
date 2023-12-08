import React from 'react';
import { colours, WHITE, BLACK } from './colours.js';
import ColourCell from './ColourCell.js'

const ColourPicker = props => (
  <div>
    {[colours.slice(0, 6), colours.slice(6, 12), colours.slice(12, 18)].map(
      (colourRow, i) => (
        <div style={{ display: 'flex', width: '100%' }} key={'colour-row-' + i}>
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
);

export default ColourPicker;
