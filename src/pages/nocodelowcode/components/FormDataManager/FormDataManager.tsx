import React, { useState, useEffect } from 'react';
import './FormDataManager.css';
import { FormData } from '../../types/types';

interface FormDataManagerProps {
  recordId: number;
  formId: number;
}

const api = {
  getFormData: async (recordId: number): Promise<FormData[]> => [
    {
      DataID: 1,
      FormID: 1,
      RecordID: recordId,
      FieldID: 1,
      Value: 'John Doe',
      CreatedAt: new Date(),
    },
  ],
  createFormData: async (data: FormData) => console.log('Create form data:', data),
  updateFormData: async (data: FormData) => console.log('Update form data:', data),
  deleteFormData: async (id: number) => console.log('Delete form data:', id),
};

const FormDataManager: React.FC<FormDataManagerProps> = ({ recordId, formId }) => {
  const [formData, setFormData] = useState<FormData[]>([]);
  const [newData, setNewData] = useState({ FieldID: '', Value: '' });
  const [editingData, setEditingData] = useState<FormData | null>(null);

  useEffect(() => {
    api.getFormData(recordId).then(setFormData);
  }, [recordId]);

  const handleCreateFormData = async () => {
    await api.createFormData({
      DataID: 0,
      FormID: formId,
      RecordID: recordId,
      FieldID: parseInt(newData.FieldID),
      Value: newData.Value,
      CreatedAt: new Date(),
    });
    setNewData({ FieldID: '', Value: '' });
    api.getFormData(recordId).then(setFormData);
  };

  const handleUpdateFormData = async () => {
    if (editingData) {
      await api.updateFormData(editingData);
      setEditingData(null);
      api.getFormData(recordId).then(setFormData);
    }
  };

  const handleDeleteFormData = async (id: number) => {
    await api.deleteFormData(id);
    api.getFormData(recordId).then(setFormData);
  };

  return (
    <div className="form-data-manager">
      <h2 className="form-data-manager-title">Manage Form Data for Record {recordId}</h2>
      <div className="form-data-manager-inputs">
        <input
          type="text"
          placeholder="Field ID"
          value={newData.FieldID}
          onChange={(e) => setNewData({ ...newData, FieldID: e.target.value })}
          className="form-data-manager-input"
        />
        <input
          type="text"
          placeholder="Value"
          value={newData.Value}
          onChange={(e) => setNewData({ ...newData, Value: e.target.value })}
          className="form-data-manager-input"
        />
        <button onClick={handleCreateFormData} className="form-data-manager-button form-data-manager-button-add">
          Add Data
        </button>
      </div>
      {editingData && (
        <div className="form-data-manager-inputs">
          <input
            type="text"
            value={editingData.FieldID}
            onChange={(e) => setEditingData({ ...editingData, FieldID: parseInt(e.target.value) })}
            className="form-data-manager-input"
          />
          <input
            type="text"
            value={editingData.Value}
            onChange={(e) => setEditingData({ ...editingData, Value: e.target.value })}
            className="form-data-manager-input"
          />
          <button
            onClick={handleUpdateFormData}
            className="form-data-manager-button form-data-manager-button-update"
          >
            Update Data
          </button>
        </div>
      )}
      <ul>
        {formData.map((data) => (
          <li key={data.DataID} className="form-data-manager-item">
            <span className="form-data-manager-item-text">Field ID: {data.FieldID}, Value: {data.Value}</span>
            <button
              onClick={() => setEditingData(data)}
              className="form-data-manager-button form-data-manager-button-edit"
            >
              Edit
            </button>
            <button
              onClick={() => handleDeleteFormData(data.DataID)}
              className="form-data-manager-button form-data-manager-button-delete"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FormDataManager;