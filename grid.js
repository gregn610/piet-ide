import React from 'react';
import { colours } from './colours.js';

const Grid = ({
  paintMode,
  grid,
  cellDim,
  setCellInFocus,
  setMouseDown,
  handleCellClick,
  blocks,
  debug,
  displayBS,
  blockSizes
}) => (
  <table
    style={{
      margin: '1vh 0 0 0',
      tableLayout: 'fixed',
      alignSelf: 'start',
      justifySelf: 'start',
      cursor: {
        BRUSH: 'url(img/pencil.png) 5 30,auto',
        BUCKET: 'url(img/paint-bucket.png) 28 28,auto',
        BP: 'url(img/bp.png) 16 32,auto'
      }[paintMode]
    }}
    onMouseOut={() => setCellInFocus(null)}
  >
    <tbody>
      {grid.map((row, i) => (
        <tr key={'row-' + i}>
          {row.map((cell, j) => (
            <td
              key={'cell-' + i + '-' + j}
              title={'(' + j + ',' + i + ')'}
              style={{
                maxHeight: '30px',
                maxWidth: '30px',
                height: cellDim + 'px',
                width: cellDim + 'px',
                border: '1px solid black',
                background: debug.breakpoints.includes(blocks[i][j])
                  ? 'repeating-linear-gradient(45deg, ' +
                    colours[cell] +
                    ', ' +
                    colours[cell] +
                    ' 2px, black 2px, black 4px)'
                  : colours[cell],
                color: 'white',
                fontSize: '11px',
                textShadow: '1px 1px 1px black',
                textAlign: 'center'
              }}
              onMouseOver={() => setCellInFocus(i, j)}
              onMouseDown={setMouseDown}
              onClick={() => handleCellClick(i, j)}
            >
              {blocks[i][j] == debug.block
                ? '◉'
                : displayBS && blockSizes[i][j]}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);

export default Grid;
