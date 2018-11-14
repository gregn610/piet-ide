import React from 'react';

import ColourPicker from './colourPicker.js';

class Controls extends React.Component {
  // manually update input values when dims are changed from appState (eg. when image file
  // is imported)
  componentWillReceiveProps(newProps) {
    if (this.props.height != newProps.height) {
      this.height.value = newProps.height;
    }

    if (this.props.width != newProps.width) {
      this.width.value = newProps.width;
    }
  }

  render() {
    return [
      <div
        key="controls-row-1"
        className="btn-toolbar"
        role="toolbar"
        style={{ gridColumn: 'controls1' }}
      >
        <ImportExportMenu {...this.props} />
      </div>,
      <div
        key="controls-row-2"
        style={{
          gridColumn: 'controls2',
          display: 'flex',
          justifyContent: 'space-between'
        }}
      >
        <label htmlFor="width" style={{ margin: 'auto 0' }}>
          Width
        </label>
        <input
          ref={input => (this.width = input)}
          type="number"
          name="width"
          className="form-control"
          style={{
            width: '5em',
            display: 'inline-block'
          }}
          defaultValue={this.props.width}
          required
        />
        <label htmlFor="height" style={{ margin: 'auto 0' }}>
          Height
        </label>
        <input
          ref={input => (this.height = input)}
          type="number"
          name="height"
          className="form-control"
          style={{
            width: '5em',
            display: 'inline-block'
          }}
          required
          defaultValue={this.props.height}
        />
        <input
          type="button"
          className="btn btn-warning"
          value="Resize"
          disabled={this.props.isInterpreting ? 'disabled' : ''}
          onClick={() =>
            this.props.resize({
              height: parseInt(this.height.value),
              width: parseInt(this.width.value),
              clear: false
            })
          }
        />
        <input
          type="button"
          className="btn btn-warning"
          value="Clear"
          disabled={this.props.isInterpreting ? 'disabled' : ''}
          onClick={() =>
            this.props.resize({
              height: parseInt(this.height.value),
              width: parseInt(this.width.value),
              clear: true
            })
          }
        />
      </div>,
      <div key="controls-row-3" style={{ gridColumn: 'controls3' }}>
        <BSDisplaySwitch {...this.props} />
        <PaintModeSwitch {...this.props} />
        <div style={{ display: 'inline-block', marginLeft: 10 }}>
          {this.props.cellInFocus &&
            this.props.blockSizes[this.props.cellInFocus[0]][
              this.props.cellInFocus[1]
            ] + ' pixels in block'}
        </div>
      </div>,
      <ColourPicker key="colour-picker" {...this.props} />
    ];
  }
}

const ImportExportMenu = ({ isInterpreting, importImg, exportPng }) => [
  <input
    key="import-btn"
    type="button"
    className="btn btn-default"
    value="Import"
    style={{ width: 160 }}
    disabled={isInterpreting ? 'disabled' : ''}
    onClick={() => document.getElementById('fileChooser').click()}
  />,
  <input
    key="hidden-file-input"
    type="file"
    accept="image/png, image/bmp, image/jpeg, image/gif"
    style={{ display: 'none' }}
    onChange={event => {
      importImg(event.target.files[0]);
      event.target.value = '';
    }}
  />,

  <div key="export-btn" className="btn-group">
    <button
      type="button"
      className="btn btn-default"
      style={{ width: 160 }}
      onClick={() => exportPng(1)}
    >
      Export to PNG
    </button>
  </div>
];

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

export default Controls;
