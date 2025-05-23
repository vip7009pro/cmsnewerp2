import React, { useState, useEffect } from 'react';
import { Record } from '../../types/types';
import './RecordManager.css';

interface RecordManagerProps {
  formId: number;
}

const api = {
  getRecords: async (formId: number): Promise<Record[]> => [
    { RecordID: 1, FormID: formId, CreatedAt: new Date() },
  ],
  createRecord: async (record: Record) => console.log('Create record:', record),
  deleteRecord: async (id: number) => console.log('Delete record:', id),
};

const RecordManager: React.FC<RecordManagerProps> = ({ formId }) => {
  const [records, setRecords] = useState<Record[]>([]);

  useEffect(() => {
    api.getRecords(formId).then(setRecords);
  }, [formId]);

  const handleCreateRecord = async () => {
    await api.createRecord({ RecordID: 0, FormID: formId, CreatedAt: new Date() });
    api.getRecords(formId).then(setRecords);
  };

  const handleDeleteRecord = async (id: number) => {
    await api.deleteRecord(id);
    api.getRecords(formId).then(setRecords);
  };

  return (
    <div className="record-manager">
      <h2 className="record-manager-title">Manage Records for Form {formId}</h2>
      <button onClick={handleCreateRecord} className="record-manager-button record-manager-button-add">
        Add Record
      </button>
      <ul>
        {records.map((record) => (
          <li key={record.RecordID} className="record-manager-item">
            <span className="record-manager-item-text">Record ID: {record.RecordID}</span>
            <button
              onClick={() => handleDeleteRecord(record.RecordID)}
              className="record-manager-button record-manager-button-delete"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecordManager;