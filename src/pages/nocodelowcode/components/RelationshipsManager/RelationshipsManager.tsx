import React, { useState, useEffect, useMemo } from 'react';
import AGTable from '../../../../components/DataTable/AGTable';
import { use_f_loadRelationshipList, use_f_insertRelationship, use_f_loadTwoTableRelationship, use_f_deleteRelationship } from '../../utils/nocodelowcodeHooks';
import { use_f_loadFormList, use_f_loadFieldList } from '../../utils/nocodelowcodeHooks';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Select, MenuItem, FormControl, InputLabel, Box, Typography, Grid, IconButton } from '@mui/material';
import { f_loadTwoTableRelationship } from '../../utils/nocodelowcodeUtils';
import { IoMdAdd } from 'react-icons/io';
import { MdDeleteOutline, MdRefresh } from 'react-icons/md';
import { Relationship } from '../../types/types';

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
  const { data: twoTableRelationships, loading: loadingTwoTableRel, error: errorTwoTableRel, triggerFetch: triggerFetchTwoTableRel, triggerFetchWithParams: triggerFetchTwoTableRelWithParams } = use_f_loadTwoTableRelationship(parentTableId || 0, childTableId || 0);
  console.log('twoTableRelationships', twoTableRelationships);

  // State cho chọn field mapping mới dạng từng cặp
  const [selectedParentField, setSelectedParentField] = useState<string>(''); // Field bảng chính
  const [selectedChildField, setSelectedChildField] = useState<string>(''); // Field bảng ngoại
  const [relationshipType, setRelationshipType] = useState('OneToMany');
  const [saving, setSaving] = useState(false);
  const [pendingMappings, setPendingMappings] = useState<{ parentFieldId: string; childFieldId: string; parentFieldName: string; childFieldName: string }[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const { deleteRel } = use_f_deleteRelationship();

  // Reset mapping khi đổi bảng
  useEffect(() => {
    setPendingMappings([]);
    setSelectedParentField('');
    setSelectedChildField('');
    if (parentTableId && childTableId) {
      triggerFetchTwoTableRel();
    }
  }, [parentTableId, childTableId]);

  // Thêm một cặp mapping vào danh sách tạm
  const handleAddMapping = () => {
    if (!selectedParentField || !selectedChildField) return;
    // Kiểm tra nếu parentFieldId đã có trong pendingMappings
    if (pendingMappings.some((m) => m.parentFieldId === selectedParentField)) {
      setErrorMessage('Trường bảng chính đã tồn tại trong danh sách mapping!');
      return;
    }
    // Lấy tên field
    const parentField = parentFields.find((f: any) => f.FieldID === selectedParentField);
    const childField = childFields.find((f: any) => f.FieldID === selectedChildField);
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
    setErrorMessage(''); // clear lỗi nếu thành công
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
  const { insert } = use_f_insertRelationship();
  const [selectedRelationship, setSelectedRelationship] = useState<Relationship | null>(null);

  const loadTwoTableRelationship = async (parentTableId: number, childTableId: number) => {
    let twoTableRelationships = await f_loadTwoTableRelationship({ ParentTableID: parentTableId, ChildTableID: childTableId });
    let tempPendingMappings = twoTableRelationships.map((item: any) => {
      return {
        parentFieldId: item.ParentFieldID,
        childFieldId: item.ChildFieldID,
        parentFieldName: item.ParentFieldName,
        childFieldName: item.ChildFieldName,
      };
    });
    setPendingMappings(tempPendingMappings);
    triggerFetchTwoTableRelWithParams(parentTableId, childTableId);
  };

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
    { headerName: 'ParentTableName', field: 'ParentTableName', minWidth: 120 },
    { headerName: 'ChildTableName', field: 'ChildTableName', minWidth: 120 },
    { headerName: 'ParentFieldName', field: 'ParentFieldName', minWidth: 120 },
    { headerName: 'ChildFieldName', field: 'ChildFieldName', minWidth: 120 },
    { headerName: 'RelationshipType', field: 'RelationshipType', minWidth: 120 },
    { headerName: 'CreatedAt', field: 'CreatedAt', minWidth: 120 },
    { headerName: 'UpdatedAt', field: 'UpdatedAt', minWidth: 120 },
  ];

  const relationShipAGTable = useMemo(() => {
    return (
      <AGTable
      suppressRowClickSelection={false}
        toolbar={
          <>
            <IconButton
              className='buttonIcon'
              onClick={() => {
                setOpen(true);
                setParentTableId(null);
                setChildTableId(null);
                setPendingMappings([]);
              }}
            >
              <IoMdAdd color='green' size={15} />
              Thêm
            </IconButton>
            <IconButton
              className='buttonIcon'
              disabled={!selectedRelationship}
              onClick={() => {  
                if (!selectedRelationship) return;
                deleteRel(selectedRelationship);
                triggerFetchRelationships();
              }}
            >
              <MdDeleteOutline color='red' size={15} />
              Xóa
            </IconButton>
            <IconButton
              className='buttonIcon'
              onClick={() => {
                triggerFetchRelationships();
              }}
            >
              <MdRefresh color='#f02bc5' size={15} />
              Refresh
            </IconButton>
          </>
        }
        data={relationships}
        columns={columns}
        onRowClick={(params) => {
          setSelectedRelationship(params.data);
        }}
        onRowDoubleClick={(params) => {
          setSelectedRelationship(params.data);
          setParentTableId(Number(params.data.ParentTableID));
          setChildTableId(Number(params.data.ChildTableID));
          loadTwoTableRelationship(Number(params.data.ParentTableID), Number(params.data.ChildTableID));
          setOpen(true);
        }}
        onSelectionChange={(params) => {
          //setSelectedRelationship(params.data);
        }}  
      />
    );
  }, [relationships, selectedRelationship]);
  useEffect(() => {
    triggerFetchForms();
    triggerFetchRelationships();
  }, []);

  return (
    <Box sx={{ background: 'transparent' }} p={0}>
      <Box sx={{ background: 'transparent' }} mb={2} height={'91vh'}>
        {relationShipAGTable}
      </Box>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth='md' fullWidth>
        <DialogTitle>Tạo Relationship mới</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <FormControl fullWidth margin='normal'>
                <InputLabel>Bảng chính</InputLabel>
                <Select
                  value={parentTableId || ''}
                  onChange={(e) => {
                    setParentTableId(Number(e.target.value));
                    loadTwoTableRelationship(Number(e.target.value), childTableId || 0);
                  }}
                  label='Bảng chính'
                >
                  {forms.map((form: any) => (
                    <MenuItem value={form.FormID} key={form.FormID}>
                      {form.FormName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Box sx={{ background: 'transparent' }} mt={2}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant='subtitle1'>Chọn trường bảng chính</Typography>
                    <FormControl fullWidth margin='normal'>
                      <InputLabel>Field bảng chính</InputLabel>
                      <Select
                        disabled={!parentTableId}
                        value={selectedParentField}
                        onChange={(e) => {
                          setSelectedParentField(e.target.value as string);
                        }}
                        label='Field bảng chính'
                      >
                        {parentFields.map((field: any) => (
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
              <FormControl fullWidth margin='normal'>
                <InputLabel>Bảng ngoại</InputLabel>
                <Select
                  value={childTableId || ''}
                  onChange={(e) => {
                    setChildTableId(Number(e.target.value));
                    loadTwoTableRelationship(parentTableId || 0, Number(e.target.value));
                  }}
                  label='Bảng ngoại'
                >
                  {forms.map((form: any) => (
                    <MenuItem value={form.FormID} key={form.FormID}>
                      {form.FormName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Box sx={{ background: 'transparent' }} mt={2}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant='subtitle1'>Chọn trường bảng ngoại</Typography>
                    <FormControl fullWidth margin='normal'>
                      <InputLabel>Field bảng ngoại</InputLabel>
                      <Select
                        value={selectedChildField}
                        onChange={(e) => {
                          setSelectedChildField(e.target.value as string);
                        }}
                        label='Field bảng ngoại'
                      >
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
              {errorMessage && (
                <Typography color='error' variant='body2' sx={{ mb: 1 }}>
                  {errorMessage}
                </Typography>
              )}
              <Box sx={{ background: 'transparent' }} mt={2} textAlign='right'>
                <Button variant='contained' color='primary' onClick={handleAddMapping} disabled={!selectedParentField || !selectedChildField}>
                  Add Mapping
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12}>
              {pendingMappings.length > 0 && (
                <Box sx={{ background: 'transparent' }} mt={2}>
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
          <Button
            onClick={() => {
              loadTwoTableRelationship(parentTableId ?? 0, childTableId ?? 0);
            }}
            color='secondary'
          >
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
