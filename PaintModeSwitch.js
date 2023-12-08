import React from 'react';

const PaintModeSwitch = ({ paintMode, selectPaintMode }) => (
  <div className="btn-group" role="group">
    <button
      type="button"
      title="Brush mode (fill single pixel)"
      className={'btn btn-default ' + (paintMode == 'BRUSH' ? 'active' : '')}
      onClick={() => selectPaintMode('BRUSH')}
    >
      <i className="fi-pencil" style={{ fontSize: '14pt' }} />
    </button>
    <button
      type="button"
      title="Bucket mode (fill block of pixels)"
      className={'btn btn-default ' + (paintMode == 'BUCKET' ? 'active' : '')}
      onClick={() => selectPaintMode('BUCKET')}
    >
      <i className="fi-paint-bucket" style={{ fontSize: '14pt' }} />
    </button>
  </div>
);

export default PaintModeSwitch;
