import React from 'react';

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

export default ImportExportMenu;
