import React from 'react';

import ColourPicker from './colourPicker.js';
import ImportExportMenu from './ImportExportMenu.js'
import PaintModeSwitch from './PaintModeSwitch.js'
import BSDisplaySwitch from './BSDisplaySwitch.js'

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

export default Controls;
