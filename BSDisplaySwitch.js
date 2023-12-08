import React from 'react';

const BSDisplaySwitch = ({ displayBS, toggleDisplayBS }) =>
  displayBS ? (
    <button
      type="button"
      className={'btn btn-default'}
      style={{ marginRight: 5 }}
      onClick={toggleDisplayBS}
    >
      <i
        className="glyphicon glyphicon-eye-open"
        title="Show block sizes"
        style={{ fontSize: '16px' }}
      />
    </button>
  ) : (
    <button
      type="button"
      className={'btn btn-default'}
      style={{ marginRight: 5 }}
      onClick={toggleDisplayBS}
    >
      <i
        className="glyphicon glyphicon-eye-close"
        title="Show block sizes"
        style={{ fontSize: '16px' }}
      />
    </button>
  );

export default BSDisplaySwitch;
