import React, { useState, useEffect } from 'react';
import AGTable from '../../../../components/DataTable/AGTable';
import { use_f_loadRelationshipList, use_f_insertRelationship, use_f_loadTwoTableRelationship } from '../../utils/nocodelowcodeHooks';
import { use_f_loadFormList, use_f_loadFieldList } from '../../utils/nocodelowcodeHooks';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Select, MenuItem, FormControl, InputLabel, Box, Typography, Grid } from '@mui/material';
import { f_loadTwoTableRelationship } from '../../utils/nocodelowcodeUtils';

const RELATIONSHIP_TYPES = [
  { value: 'OneToOne', label: 'One To One' },
  { value: 'OneToMany', label: 'One To Many' },
  { value: 'ManyToOne', label: 'Many To One' },
  { value: 'ManyToMany', label: 'Many To Many' },
];

const RelationshipsManager: React.FC = () => {
  // State
  const [open, setOpen] = useState(false);
  const [parentTableId, setParentTableId] = useState<number | null>(null);
  const [childTableId, setChildTableId] = useState<number | null>(null);

  // Hook lấy quan hệ giữa 2 bảng
  const {
    data: twoTableRelationships,
    loading: loadingTwoTableRel,
    error: errorTwoTableRel,
    triggerFetch: triggerFetchTwoTableRel,
    triggerFetchWithParams: triggerFetchTwoTableRelWithParams
  } = use_f_loadTwoTableRelationship(parentTableId || 0, childTableId || 0);
  console.log('twoTableRelationships',twoTableRelationships);   

  // State cho chọn field mapping mới dạng từng cặp
  const [selectedParentField, setSelectedParentField] = useState<string>(''); // Field bảng chính
  const [selectedChildField, setSelectedChildField] = useState<string>(''); // Field bảng ngoại
  const [relationshipType, setRelationshipType] = useState('OneToMany');
  const [saving, setSaving] = useState(false);
  const [pendingMappings, setPendingMappings] = useState<{ parentFieldId: string; childFieldId: string; parentFieldName: string; childFieldName: string }[]>([]);

  // Reset mapping khi đổi bảng
  useEffect(() => {
    setPendingMappings([]);
    setSelectedParentField('');
    setSelectedChildField('');
    if(parentTableId && childTableId) {
      triggerFetchTwoTableRel();
    }
  }, [parentTableId, childTableId]);

  // Thêm một cặp mapping vào danh sách tạm
  const handleAddMapping = () => {
    if (!selectedParentField || !selectedChildField) return;
    // Lấy tên field
    const parentField = parentFields.find((f: any) => f.FieldID === selectedParentField);
    const childField = childFields.find((f: any) => f.FieldID === selectedChildField);
    // Kiểm tra trùng
    if (pendingMappings.some((m) => m.parentFieldId === selectedParentField && m.childFieldId === selectedChildField)) return;
    setPendingMappings([
      ...pendingMappings,
      {
        parentFieldId: selectedParentField,
        childFieldId: selectedChildField,
        parentFieldName: parentField ? parentField.FieldName : selectedParentField,
        childFieldName: childField ? childField.FieldName : selectedChildField,
      },
    ]);
    setSelectedParentField('');
    setSelectedChildField('');
  };

  // Xóa một cặp mapping khỏi danh sách tạm
  const handleRemoveMapping = (parentFieldId: string, childFieldId: string) => {
    setPendingMappings(pendingMappings.filter((m) => !(m.parentFieldId === parentFieldId && m.childFieldId === childFieldId)));
  };

  // Hooks
  const { data: relationships, triggerFetch: triggerFetchRelationships } = use_f_loadRelationshipList();
  const { data: forms, triggerFetch: triggerFetchForms } = use_f_loadFormList();
  const { data: parentFields, triggerFetch: triggerFetchParentFields } = use_f_loadFieldList({ FormID: parentTableId });
  const { data: childFields, triggerFetch: triggerFetchChildFields } = use_f_loadFieldList({ FormID: childTableId });
  console.log('relationships',relationships)

  const { insert } = use_f_insertRelationship();

  const loadTwoTableRelationship = async (parentTableId:number, childTableId:number) => {
    let twoTableRelationships = await f_loadTwoTableRelationship({ParentTableID: parentTableId, ChildTableID: childTableId});
    console.log('twoTableRelationships',twoTableRelationships)
    let tempPendingMappings = twoTableRelationships.map((item: any) => {
      return {
        parentFieldId: item.ParentFieldID,
        childFieldId: item.ChildFieldID,
        parentFieldName: item.ParentFieldName,
        childFieldName: item.ChildFieldName,
      }
    });
    setPendingMappings(prev => [...prev, ...tempPendingMappings]);
    triggerFetchTwoTableRelWithParams(parentTableId, childTableId);    
  }

  // Load fields khi chọn bảng
  useEffect(() => {
    if (parentTableId) {
      triggerFetchParentFields();
    }
    // setMappingFields đã bị loại bỏ[]); // Reset mapping khi đổi bảng
    // setFieldMapping đã bị loại bỏ{});
  }, [parentTableId]);

  useEffect(() => {
    if (childTableId) {
      triggerFetchChildFields();
    }
    // setMappingFields đã bị loại bỏ[]); // Reset mapping khi đổi bảng
    // setFieldMapping đã bị loại bỏ{});
  }, [childTableId]);

  // Xử lý lưu relationship
  const handleSaveRelationship = async () => {
    setSaving(true);
    for (let i = 0; i < pendingMappings.length; i++) {
      const mapping = pendingMappings[i];
      await insert({
        ParentTableID: parentTableId,
        ChildTableID: childTableId,
        ParentFieldID: mapping.parentFieldId,
        ChildFieldID: mapping.childFieldId,
        RelationshipType: relationshipType,
      });
    }
    setSaving(false);
    setOpen(false);
    setParentTableId(null);
    setChildTableId(null);
    setPendingMappings([]);
    triggerFetchRelationships();
  };

  // Cột cho AGTable
  const columns = [
    { headerName: 'RelationshipID', field: 'RelationshipID', minWidth: 80 },
    { headerName: 'ParentTableID', field: 'ParentTableID', minWidth: 120 },
    { headerName: 'ChildTableID', field: 'ChildTableID', minWidth: 120 },
    { headerName: 'ParentFieldID', field: 'ParentFieldID', minWidth: 120 },
    { headerName: 'ChildFieldID', field: 'ChildFieldID', minWidth: 120 },
    { headerName: 'RelationshipType', field: 'RelationshipType', minWidth: 120 },
    { headerName: 'CreatedAt', field: 'CreatedAt', minWidth: 120 },
    { headerName: 'UpdatedAt', field: 'UpdatedAt', minWidth: 120 },
  ];

  useEffect(() => {
    triggerFetchForms();
    triggerFetchRelationships();
  }, []);

  return (
    <Box p={2}>
      <Typography variant='h5' gutterBottom>
        Quản lý Relationship giữa các Form
      </Typography>
      <Box mb={2}>
        <Button variant='contained' color='primary' onClick={() => setOpen(true)}>
          Thêm Relationship
        </Button>
      </Box>
      <Box mb={2} height={'79vh'}>
        <AGTable toolbar={<></>} data={relationships} columns={columns} onSelectionChange={(params) => console.log(params)} />
      </Box>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth='md' fullWidth>
        <DialogTitle>Tạo Relationship mới</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <FormControl fullWidth margin='normal'>
                <InputLabel>Bảng chính</InputLabel>
                <Select value={parentTableId || ''} onChange={(e) => {
                  setParentTableId(Number(e.target.value))
                  loadTwoTableRelationship(Number(e.target.value), childTableId || 0);
                }} label='Bảng chính'>
                  {forms.map((form: any) => (
                    <MenuItem value={form.FormID} key={form.FormID}>
                      {form.FormName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Box mt={2}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant='subtitle1'>Chọn trường bảng chính</Typography>
                    <FormControl fullWidth margin='normal'>
                      <InputLabel>Field bảng chính</InputLabel>
                      <Select value={selectedParentField} onChange={(e) => {
                        setSelectedParentField(e.target.value as string)                       
                      }} label='Field bảng chính'>
                        {parentFields.map((field: any) => (
                          <MenuItem value={field.FieldID} key={field.FieldID}>
                            {field.FieldID}.{field.FieldName}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant='subtitle1'>Chọn trường bảng ngoại</Typography>
                    <FormControl fullWidth margin='normal'>
                      <InputLabel>Field bảng ngoại</InputLabel>
                      <Select value={selectedChildField} onChange={(e) =>{ 
                        setSelectedChildField(e.target.value as string)                       
                    }
                        } label='Field bảng ngoại'>
                        {childFields.map((field: any) => (
                          <MenuItem value={field.FieldID} key={field.FieldID}>
                            {field.FieldID}.{field.FieldName}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Bảng ngoại</InputLabel>
                <Select
                  value={childTableId || ''}
                  onChange={(e) => {
                    setChildTableId(Number(e.target.value))
                    loadTwoTableRelationship(parentTableId || 0, Number(e.target.value));
                  }}
                  label="Bảng ngoại"
                >
                  {forms.map((form: any) => (
                    <MenuItem value={form.FormID} key={form.FormID}>{form.FormName}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            {/* Hiển thị bảng các quan hệ đã tạo giữa 2 bảng */}
           
            <Grid item xs={12}>
              <FormControl fullWidth margin='normal'>
                <InputLabel>Loại Relationship</InputLabel>
                <Select value={relationshipType} onChange={(e) => setRelationshipType(e.target.value as string)} label='Loại Relationship'>
                  {RELATIONSHIP_TYPES.map((type) => (
                    <MenuItem value={type.value} key={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Box mt={2} textAlign='right'>
                <Button variant='contained' color='primary' onClick={handleAddMapping} disabled={!selectedParentField || !selectedChildField}>
                  Add Mapping
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12}>
              {pendingMappings.length > 0 && (
                <Box mt={2}>
                  <Typography variant='subtitle2'>Các trường đã mapping:</Typography>
                  <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 8 }}>
                    <thead>
                      <tr>
                        <th style={{ borderBottom: '1px solid #ccc', padding: 4 }}>Field bảng chính</th>
                        <th style={{ borderBottom: '1px solid #ccc', padding: 4 }}>Field bảng ngoại</th>
                        <th style={{ borderBottom: '1px solid #ccc', padding: 4 }}>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingMappings.map((m, idx) => (
                        <tr key={m.parentFieldId + '-' + m.childFieldId}>
                          <td style={{ borderBottom: '1px solid #eee', padding: 4 }}>{m.parentFieldName}</td>
                          <td style={{ borderBottom: '1px solid #eee', padding: 4 }}>{m.childFieldName}</td>
                          <td style={{ borderBottom: '1px solid #eee', padding: 4 }}>
                            <Button size='small' color='secondary' onClick={() => handleRemoveMapping(m.parentFieldId, m.childFieldId)}>
                              Xóa
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Box>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            loadTwoTableRelationship(parentTableId ?? 0, childTableId ?? 0);
          }} color='secondary'>
            Load Relationship
          </Button>
          <Button onClick={() => setOpen(false)} color='secondary'>
            Đóng
          </Button>
          <Button onClick={handleSaveRelationship} color='primary' variant='contained' disabled={saving}>
            Lưu Relationship
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RelationshipsManager;
