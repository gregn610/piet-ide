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
    return (
      <div style={{ display: 'flex', margin: '0 240px 0 0' }}>
        <div>
          <div className="btn-toolbar">
            <ImportExportMenu {...this.props} />
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: 10
            }}
          >
            <label htmlFor="width" style={{ margin: 'auto 5px' }}>
              Width
            </label>
            <input
              ref={input => (this.width = input)}
              type="number"
              name="width"
              className="form-control"
              style={{
                width: '5em',
                display: 'block'
              }}
              required
              defaultValue={this.props.width}
            />
            <label htmlFor="height" style={{ margin: 'auto 5px' }}>
              Height
            </label>
            <input
              ref={input => (this.height = input)}
              type="number"
              name="height"
              className="form-control"
              style={{
                width: '5em',
                display: 'block',
                marginRight: 5
              }}
              required
              defaultValue={this.props.height}
            />
            <input
              type="button"
              className="btn btn-warning"
              value="Resize"
              style={{
                marginRight: 5
              }}
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
          </div>
          <div>
            <BSDisplaySwitch {...this.props} />
            <PaintModeSwitch {...this.props} />
            <div style={{ display: 'inline-block', marginLeft: 10 }}>
              {this.props.cellInFocus &&
                this.props.blockSizes[this.props.cellInFocus[0]][
                  this.props.cellInFocus[1]
                ] + ' pixels in block'}
            </div>
          </div>
        </div>
        <div
          style={{
            flex: 1,
            maxWidth: 550,
            minWidth: 450,
            margin: '0 0 0 40px'
          }}
        >
          <ColourPicker key="colour-picker" {...this.props} />
        </div>
      </div>
    );
  }
}

const ImportExportMenu = ({ isInterpreting, importImg, exportPng }) => (
  <div style={{ display: 'flex', marginBottom: 10 }}>
    <div
      className="btn btn-default"
      style={{ flex: 1, margin: '0 10px 0 5px' }}
      value="Import"
      disabled={isInterpreting ? 'disabled' : ''}
      onClick={() => document.getElementById('fileChooser').click()}
    >
      Import
      <input
        key="hidden-file-input"
        type="file"
        id="fileChooser"
        accept="image/png, image/bmp, image/jpeg, image/gif"
        style={{ display: 'none' }}
        onChange={event => {
          importImg(event.target.files[0]);
          event.target.value = '';
        }}
      />
    </div>
    <button
      style={{ flex: 1 }}
      type="button"
      className="btn btn-default"
      onClick={exportPng}
    >
      Export to PNG
    </button>
  </div>
);

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
