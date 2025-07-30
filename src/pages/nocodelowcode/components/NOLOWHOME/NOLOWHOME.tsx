import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Grid, Typography, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, Checkbox, FormLabel } from '@mui/material';
import { Add, Edit, Delete, TableView, Refresh } from '@mui/icons-material';
import type { Form, Field, Record as NCLRecord, FormData } from '../../types/types';
import { f_deleteField, f_deleteForm, f_insertField, f_insertForm, f_loadFieldList, f_loadFormList, f_updateField, f_updateForm } from '../../utils/nocodelowcodeUtils';
import Swal from 'sweetalert2';

const SQL_DATA_TYPES = ['BIT', 'INT', 'BIGINT', 'DECIMAL', 'NUMERIC', 'FLOAT', 'CHAR', 'VARCHAR', 'VARCHAR(MAX)', 'NCHAR', 'NVARCHAR', 'NVARCHAR(MAX)', 'TEXT', 'NTEXT', 'DATE', 'TIME', 'DATETIME', 'Reference'];

const emptyForm: Form = { FormID: 0, FormName: '', Description: '', CreatedAt: new Date() };
const emptyField: Field = { FieldID: 0, FormID: 0, FieldName: '', DataType: '', IsRequired: false, CreatedAt: new Date() };
const emptyRecord: NCLRecord = { RecordID: 0, FormID: 0, CreatedAt: new Date() };
const emptyFormData: FormData = { DataID: 0, FormID: 0, RecordID: 0, FieldID: 0, Value: '', CreatedAt: new Date() };

const NOLOWHOME: React.FC = () => {
  // State for each entity
  const [forms, setForms] = useState<Form[]>([]);
  const [fields, setFields] = useState<Field[]>([]);
  const [fields2, setFields2] = useState<Field[]>([]);
  const [records, setRecords] = useState<NCLRecord[]>([]);
  const [formDatas, setFormDatas] = useState<FormData[]>([]);
  const [selectedForm, setSelectedForm] = useState<Form | null>(null);
  const [formEdit, setFormEdit] = useState<Form>(emptyForm);
  const [selectedField, setSelectedField] = useState<Field>(emptyField);
  const [selectedField2, setSelectedField2] = useState<Field>(emptyField);
  const [selectedFormData, setSelectedFormData] = useState<FormData>(emptyFormData);
  const [showDataDialog, setShowDataDialog] = useState<boolean>(false);
  const [dataEntryRows, setDataEntryRows] = useState<Record<string, any>[]>([]); // Each row: { [fieldId]: value, id: number }

  // FORM CRUD
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormEdit({ ...formEdit, [e.target.name]: e.target.value });
  };
  const handleAddForm = async () => {
    const kq = await f_insertForm(formEdit);
    if (kq === '') {
      setForms([...forms, formEdit]);
      setFormEdit(emptyForm);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: kq,
      });
    }
  };
  const handleUpdateForm = async () => {
    const kq = await f_updateForm(formEdit);
    if (kq === '') {
      setForms(forms.map((f) => (f.FormID === formEdit.FormID ? formEdit : f)));
      setFormEdit(emptyForm);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: kq,
      });
    }
  };
  const handleDeleteForm = async (id: number) => {
    const kq = await f_deleteForm({
      FormID: id,
    });
    if (kq === '') {
      setForms(forms.filter((f) => f.FormID !== id));
      if (selectedForm && selectedForm.FormID === id) setSelectedForm(null);
      setFormEdit(emptyForm);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: kq,
      });
    }
  };
  const handleLoadForm = async () => {
    const kq = await f_loadFormList();
    setForms(kq);
    if (selectedForm === null) {
      setSelectedForm(kq[0]);
    }
  };

  // FIELD CRUD (for selected Form)
  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSelectedField((prev) => ({
      ...prev,
      [name]: value,
      FormID: selectedForm?.FormID || 0,
    }));
  };

  const handleFieldDataTypeChange = (e: SelectChangeEvent<string>) => {
    const value = e.target.value;
    setSelectedField((prev) => ({
      ...prev,
      DataType: value,
      FormID: selectedForm?.FormID || 0,
    }));
  };
  const handleAddField = async () => {
    const kq = await f_insertField(selectedField);
    if (kq === '') {
      handleLoadFieldListByFormId(selectedForm?.FormID || 0);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: kq,
      });
    }
  };
  const handleUpdateField = async () => {
    const kq = await f_updateField(selectedField);
    if (kq === '') {
      handleLoadFieldListByFormId(selectedForm?.FormID || 0);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: kq,
      });
    }
  };
  const handleDeleteField = async (id: number) => {
    const kq = await f_deleteField({
      FieldID: id,
    });
    if (kq === '') {
      handleLoadFieldListByFormId(selectedForm?.FormID || 0);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: kq,
      });
    }
  };

  const handleLoadFieldListByFormId = async (formId: number) => {
    const kq = await f_loadFieldList({
      FormID: formId,
    });  
    setFields(kq);
  };
  const handleLoadFieldListByFormId2 = async (formId: number) => { 
    const kq = await f_loadFieldList({
      FormID: formId,
    });
    setFields2(kq);
  };

  // Data Entry Dialog
  const handleOpenDataDialog = (form: Form) => {
    setSelectedForm(form);
    setDataEntryRows([{ id: Date.now() }]);
    handleLoadFieldListByFormId(form.FormID);
    setShowDataDialog(true);
  };
  const handleCloseDataDialog = () => {
    setShowDataDialog(false);
    setDataEntryRows([]);
  };
  const handleDataCellChange = (rowIdx: number, fieldId: number, value: string) => {
    setDataEntryRows((rows) => rows.map((row, i) => (i === rowIdx ? { ...row, [fieldId]: value } : row)));
  };
  const handleAddDataRow = () => {
    setDataEntryRows((rows) => [...rows, { id: Date.now() }]);
  };
  const handleSaveData = () => {
    if (!selectedForm) return;
    // For each row, create a Record and FormData for each field
    const newRecords: NCLRecord[] = [];
    const newFormDatas: FormData[] = [];
    dataEntryRows.forEach((row: Record<string, any>) => {
      const recordId = Date.now() + Math.floor(Math.random() * 10000);
      newRecords.push({ RecordID: recordId, FormID: selectedForm.FormID, CreatedAt: new Date() });
      const formFields = fields.filter((f) => f.FormID === selectedForm.FormID);
      formFields.forEach((field) => {
        newFormDatas.push({
          DataID: Date.now() + Math.floor(Math.random() * 10000),
          FormID: selectedForm.FormID,
          RecordID: recordId,
          FieldID: field.FieldID,
          Value: row[field.FieldID] || '',
          CreatedAt: new Date(),
        });
      });
    });
    setRecords([...records, ...newRecords]);
    setFormDatas([...formDatas, ...newFormDatas]);
    setShowDataDialog(false);
    setDataEntryRows([]);
  };

  useEffect(() => {
    handleLoadForm();
  }, []);

  return (
    <Box className='nocodelowcode' p={2}>
      <Grid container spacing={1}>
        {/* Left: Form List */}
        <Grid item xs={12} md={5}>
          <Typography variant='h6'>Form Manager</Typography>
          <Box display='flex' gap={1} mb={2}>
            <TextField label='Form Name' name='FormName' value={formEdit.FormName} onChange={handleFormChange} size='small' />
            <TextField label='Description' name='Description' value={formEdit.Description} onChange={handleFormChange} size='small' />
            <Button variant='contained' color='primary' onClick={handleAddForm} startIcon={<Add />}>
              Add
            </Button>
            <Button variant='contained' color='warning' onClick={handleUpdateForm} startIcon={<Edit />}>
              Update
            </Button>
            <Button variant='contained' color='error' onClick={handleLoadForm} startIcon={<Refresh />}>
              Refresh
            </Button>
          </Box>
          <TableContainer component={Paper}>
            <Table size='small'>
              <TableHead>
                <TableRow>
                  <TableCell>FormID</TableCell>
                  <TableCell>FormName</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {forms.map((form) => (
                  <TableRow key={form.FormID} selected={selectedForm?.FormID === form.FormID}>
                    <TableCell>{form.FormID}</TableCell>
                    <TableCell>{form.FormName}</TableCell>
                    <TableCell>{form.Description}</TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => {
                          setSelectedForm(form);
                          setFormEdit(form);
                        }}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteForm(form.FormID)}>
                        <Delete />
                      </IconButton>
                      <IconButton onClick={() => handleOpenDataDialog(form)} title='Nhập dữ liệu'>
                        <TableView />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        {/* Right: Fields for selected Form */}
        <Grid item xs={12} md={7}>
          <Typography variant='h6'>Field Manager ({selectedForm?.FormName})</Typography>
          {selectedForm ? (
            <>
              <Box display='flex' gap={2} mb={2}>
                <TextField label='Field Name' name='FieldName' value={selectedField.FieldName} onChange={handleFieldChange} size='small' />
                <FormControl size='small' style={{ minWidth: 130 }}>
                  <InputLabel>Data Type</InputLabel>
                  <Select label='Data Type' name='DataType' value={selectedField.DataType || ''} onChange={handleFieldDataTypeChange}>
                    {SQL_DATA_TYPES.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField label='Length' name='Length' type='number' value={selectedField.Length ?? ''} onChange={handleFieldChange} size='small' />
                <FormControl size='small'>
                  <InputLabel>Is Required</InputLabel>
                  <Select label='Is Required' name='IsRequired' value={selectedField.IsRequired ? 'Yes' : 'No'} onChange={(e) => setSelectedField({ ...selectedField, IsRequired: e.target.value === 'Yes' })}>
                    <MenuItem value='Yes'>Yes</MenuItem>
                    <MenuItem value='No'>No</MenuItem>
                  </Select>
                </FormControl>
                <FormControl size='small' style={{ minWidth: 140 }}>
                  <InputLabel>Reference Form</InputLabel>
                  <Select
                    label='Reference Form'
                    name='ReferenceFormID'
                    value={selectedField.ReferenceFormID ?? ''}
                    onChange={(e) => {
                      const value = e.target.value as number;
                      console.log(value);
                      setSelectedField((prev) => ({ ...prev, ReferenceFormID: value, ReferenceFieldIDs: '' }));
                      setFields(
                        fields.map((f) =>
                          f.FieldID === selectedField.FieldID ? { ...f, ReferenceFormID: value } : f
                        )
                      );
                      setSelectedField2(emptyField);

                      handleLoadFieldListByFormId2(value);
                    }}
                  >
                    <MenuItem value=''>
                      <em>None</em>
                    </MenuItem>
                    {forms
                      .filter((f) => f.FormID !== selectedForm?.FormID)
                      .map((form) => (
                        <MenuItem key={form.FormID} value={form.FormID}>
                          {form.FormName}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
                <FormControl size='small' style={{ minWidth: 180 }}>
                  <InputLabel>Reference Field(s)</InputLabel>
                  <Select
                    label='Reference Field(s)'
                    name='ReferenceFieldIDsSelect'
                    multiple
                    value={
                      selectedField2.ReferenceFieldIDs
                        ? selectedField2.ReferenceFieldIDs.split(',')
                            .map((id) => id.trim())
                            .filter(Boolean)
                        : []
                    }
                    onChange={(e) => {
                      const value = e.target.value as string[];
                      setSelectedField2((prev) => ({ ...prev, ReferenceFieldIDs: value.join(',') }));
                      setSelectedField((prev) => ({ ...prev, ReferenceFieldIDs: value.join(',') }));
                     /*  setFields(
                        fields.map((f) =>
                          f.FieldID === selectedField.FieldID ? { ...f, ReferenceFieldIDs: value.join(',') } : f
                        )
                      ); */
                    }}
                    
                  >
                    {fields2                    
                      .map((field) => (
                        <MenuItem key={field.FieldID} value={field.FieldID.toString()}>
                          <Checkbox
                            checked={
                              selectedField2.ReferenceFieldIDs?.split(',')
                                .map((x) => x.trim())
                                .includes(field.FieldID.toString()) || false
                            }
                          />
                          {field.FieldID}.{field.FieldName}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
                <TextField label='ReferenceFieldIDs (comma separated)' name='ReferenceFieldIDs' value={selectedField.ReferenceFieldIDs ?? ''} InputProps={{ readOnly: true }} size='small' />
                <Button variant='contained' color='primary' onClick={handleAddField} startIcon={<Add />}>
                  Add
                </Button>
                <Button variant='contained' color='warning' onClick={handleUpdateField} startIcon={<Edit />}>
                  Update
                </Button>
              </Box>
              <TableContainer component={Paper}>
                <Table size='small'>
                  <TableHead>
                    <TableRow>
                      <TableCell>FieldID</TableCell>
                      <TableCell>FieldName</TableCell>
                      <TableCell>DataType</TableCell>
                      <TableCell>Length</TableCell>
                      <TableCell>IsRequired</TableCell>
                      <TableCell>ReferenceFormID</TableCell>
                      <TableCell>ReferenceFieldIDs</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {fields
                      .filter((f) => f.FormID === selectedForm.FormID)
                      .map((field) => (
                        <TableRow key={field.FieldID} selected={selectedField.FieldID === field.FieldID}>
                          <TableCell>{field.FieldID}</TableCell>
                          <TableCell>{field.FieldName}</TableCell>
                          <TableCell>{field.DataType}</TableCell>
                          <TableCell>{field.Length}</TableCell>
                          <TableCell>{field.IsRequired ? 'true' : 'false'}</TableCell>
                          <TableCell>{field.ReferenceFormID}</TableCell>
                          <TableCell>{field.ReferenceFieldIDs}</TableCell>
                          <TableCell>
                            <IconButton onClick={() => {
                              setSelectedField(field)
                              handleLoadFieldListByFormId2(field.ReferenceFormID ?? 0);                           
                              
                            


                              }}>
                              <Edit />
                            </IconButton>
                            <IconButton onClick={() => handleDeleteField(field.FieldID)}>
                              <Delete />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          ) : (
            <Typography variant='body1' color='text.secondary'>
              Chọn một Form để quản lý Field.
            </Typography>
          )}
        </Grid>
      </Grid>
      {/* Data Entry Dialog */}
      <Dialog open={showDataDialog} onClose={handleCloseDataDialog} maxWidth='lg' fullWidth>
        <DialogTitle>Nhập dữ liệu cho Form: {selectedForm?.FormName}</DialogTitle>
        <DialogContent>
          <Button onClick={handleAddDataRow} variant='outlined' sx={{ mb: 2 }}>
            Thêm dòng
          </Button>
          <TableContainer component={Paper}>
            <Table size='small'>
              <TableHead>
                <TableRow>
                  {fields
                    .filter((f) => f.FormID === selectedForm?.FormID)
                    .map((field) => (
                      <TableCell key={field.FieldID}>{field.FieldName}</TableCell>
                    ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {dataEntryRows.map((row, rowIdx) => (
                  <TableRow key={row.id}>
                    {fields
                      .filter((f) => f.FormID === selectedForm?.FormID)
                      .map((field) => (
                        <TableCell key={field.FieldID}>
                          <TextField value={row[field.FieldID] || ''} onChange={(e) => handleDataCellChange(rowIdx, field.FieldID, e.target.value)} size='small' />
                        </TableCell>
                      ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDataDialog}>Hủy</Button>
          <Button onClick={handleSaveData} variant='contained'>
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default NOLOWHOME;
