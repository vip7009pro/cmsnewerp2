import React, { useState } from 'react';
import FormManager from '../FormManager/FormManager';
import FieldManager from '../FieldManager/FieldManager';
import RecordManager from '../RecordManager/RecordManager';
import FormDataManager from '../FormDataManager/FormDataManager';


const NOLOWHOME: React.FC = () => {
  const [selectedFormId, setSelectedFormId] = useState<number | null>(null);
  const [selectedRecordId, setSelectedRecordId] = useState<number | null>(null);

  return (
    <div className="app">
      <h1 className="app-title">Lowcode-Nocode Form Management</h1>
      <FormManager />
      {selectedFormId && (
        <>
          <FieldManager formId={selectedFormId} />
          <RecordManager formId={selectedFormId} />
        </>
      )}
      {selectedRecordId && <FormDataManager recordId={selectedRecordId} formId={selectedFormId!} />}
      <div className="app-selectors">
        <label className="app-selector-label">Select Form ID:</label>
        <input
          type="number"
          value={selectedFormId || ''}
          onChange={(e) => setSelectedFormId(e.target.value ? parseInt(e.target.value) : null)}
          className="app-selector-input"
        />
        <label className="app-selector-label">Select Record ID:</label>
        <input
          type="number"
          value={selectedRecordId || ''}
          onChange={(e) => setSelectedRecordId(e.target.value ? parseInt(e.target.value) : null)}
          className="app-selector-input"
        />
      </div>
    </div>
  );
};

export default NOLOWHOME;