import React from 'react';

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

export default Pointers;
