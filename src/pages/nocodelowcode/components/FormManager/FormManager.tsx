import React, { useState, useEffect } from 'react';
import { Form } from '../../types/types';
import './FormManager.css';

const api = {
  getForms: async (): Promise<Form[]> => [
    { FormID: 1, FormName: 'Customer Info', Description: 'Form for customer details', CreatedAt: new Date() },
    { FormID: 2, FormName: 'Order Form', Description: 'Form for orders', CreatedAt: new Date() },
  ],
  createForm: async (form: Form) => console.log('Create form:', form),
  updateForm: async (form: Form) => console.log('Update form:', form),
  deleteForm: async (id: number) => console.log('Delete form:', id),
};

const FormManager: React.FC = () => {
  const [forms, setForms] = useState<Form[]>([]);
  const [newForm, setNewForm] = useState({ FormName: '', Description: '' });
  const [editingForm, setEditingForm] = useState<Form | null>(null);

  useEffect(() => {
    api.getForms().then(setForms);
  }, []);

  const handleCreateForm = async () => {
    await api.createForm({ ...newForm, FormID: 0, CreatedAt: new Date() });
    setNewForm({ FormName: '', Description: '' });
    api.getForms().then(setForms);
  };

  const handleUpdateForm = async () => {
    if (editingForm) {
      await api.updateForm(editingForm);
      setEditingForm(null);
      api.getForms().then(setForms);
    }
  };

  const handleDeleteForm = async (id: number) => {
    await api.deleteForm(id);
    api.getForms().then(setForms);
  };

  return (
    <div className="form-manager">
      <h2 className="form-manager-title">Manage Forms</h2>
      <div className="form-manager-inputs">
        <input
          type="text"
          placeholder="Form Name"
          value={newForm.FormName}
          onChange={(e) => setNewForm({ ...newForm, FormName: e.target.value })}
          className="form-manager-input"
        />
        <input
          type="text"
          placeholder="Description"
          value={newForm.Description}
          onChange={(e) => setNewForm({ ...newForm, Description: e.target.value })}
          className="form-manager-input"
        />
        <button onClick={handleCreateForm} className="form-manager-button form-manager-button-add">
          Add Form
        </button>
      </div>
      {editingForm && (
        <div className="form-manager-inputs">
          <input
            type="text"
            value={editingForm.FormName}
            onChange={(e) => setEditingForm({ ...editingForm, FormName: e.target.value })}
            className="form-manager-input"
          />
          <input
            type="text"
            value={editingForm.Description}
            onChange={(e) => setEditingForm({ ...editingForm, Description: e.target.value })}
            className="form-manager-input"
          />
          <button onClick={handleUpdateForm} className="form-manager-button form-manager-button-update">
            Update Form
          </button>
        </div>
      )}
      <ul>
        {forms.map((form) => (
          <li key={form.FormID} className="form-manager-item">
            <span className="form-manager-item-text">{form.FormName} - {form.Description}</span>
            <button
              onClick={() => setEditingForm(form)}
              className="form-manager-button form-manager-button-edit"
            >
              Edit
            </button>
            <button
              onClick={() => handleDeleteForm(form.FormID)}
              className="form-manager-button form-manager-button-delete"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FormManager;