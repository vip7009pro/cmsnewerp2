import React, { useState, useEffect } from 'react';
import './FieldManager.css';
import { Field } from '../../types/types';


interface FieldManagerProps {
  formId: number;
}

const api = {
  getFields: async (formId: number): Promise<Field[]> => [
    {
      FieldID: 1,
      FormID: formId,
      FieldName: 'Name',
      DataType: 'nvarchar',
      IsRequired: true,
      CreatedAt: new Date(),
    },
  ],
  createField: async (field: Field) => console.log('Create field:', field),
  updateField: async (field: Field) => console.log('Update field:', field),
  deleteField: async (id: number) => console.log('Delete field:', id),
};

const FieldManager: React.FC<FieldManagerProps> = ({ formId }) => {
  const [fields, setFields] = useState<Field[]>([]);
  const [newField, setNewField] = useState({ FieldName: '', DataType: 'nvarchar', IsRequired: false });
  const [editingField, setEditingField] = useState<Field | null>(null);

  useEffect(() => {
    api.getFields(formId).then(setFields);
  }, [formId]);

  const handleCreateField = async () => {
    await api.createField({ ...newField, FormID: formId, FieldID: 0, CreatedAt: new Date() });
    setNewField({ FieldName: '', DataType: 'nvarchar', IsRequired: false });
    api.getFields(formId).then(setFields);
  };

  const handleUpdateField = async () => {
    if (editingField) {
      await api.updateField(editingField);
      setEditingField(null);
      api.getFields(formId).then(setFields);
    }
  };

  const handleDeleteField = async (id: number) => {
    await api.deleteField(id);
    api.getFields(formId).then(setFields);
  };

  return (
    <div className="field-manager">
      <h2 className="field-manager-title">Manage Fields for Form {formId}</h2>
      <div className="field-manager-inputs">
        <input
          type="text"
          placeholder="Field Name"
          value={newField.FieldName}
          onChange={(e) => setNewField({ ...newField, FieldName: e.target.value })}
          className="field-manager-input"
        />
        <select
          value={newField.DataType}
          onChange={(e) => setNewField({ ...newField, DataType: e.target.value })}
          className="field-manager-input"
        >
          <option value="nvarchar">Text</option>
          <option value="int">Number</option>
          <option value="bit">Boolean</option>
        </select>
        <label className="field-manager-checkbox">
          <input
            type="checkbox"
            checked={newField.IsRequired}
            onChange={(e) => setNewField({ ...newField, IsRequired: e.target.checked })}
          />
          Required
        </label>
        <button onClick={handleCreateField} className="field-manager-button field-manager-button-add">
          Add Field
        </button>
      </div>
      {editingField && (
        <div className="field-manager-inputs">
          <input
            type="text"
            value={editingField.FieldName}
            onChange={(e) => setEditingField({ ...editingField, FieldName: e.target.value })}
            className="field-manager-input"
          />
          <select
            value={editingField.DataType}
            onChange={(e) => setEditingField({ ...editingField, DataType: e.target.value })}
            className="field-manager-input"
          >
            <option value="nvarchar">Text</option>
            <option value="int">Number</option>
            <option value="bit">Boolean</option>
          </select>
          <label className="field-manager-checkbox">
            <input
              type="checkbox"
              checked={editingField.IsRequired}
              onChange={(e) => setEditingField({ ...editingField, IsRequired: e.target.checked })}
            />
            Required
          </label>
          <button onClick={handleUpdateField} className="field-manager-button field-manager-button-update">
            Update Field
          </button>
        </div>
      )}
      <ul>
        {fields.map((field) => (
          <li key={field.FieldID} className="field-manager-item">
            <span className="field-manager-item-text">
              {field.FieldName} ({field.DataType}, {field.IsRequired ? 'Required' : 'Optional'})
            </span>
            <button
              onClick={() => setEditingField(field)}
              className="field-manager-button field-manager-button-edit"
            >
              Edit
            </button>
            <button
              onClick={() => handleDeleteField(field.FieldID)}
              className="field-manager-button field-manager-button-delete"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FieldManager;