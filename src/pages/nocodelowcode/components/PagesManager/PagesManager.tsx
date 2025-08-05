import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Box, Button, Modal, TextField, IconButton, Typography} from '@mui/material';
import { Add, Edit, Delete, Refresh } from '@mui/icons-material';
import { Page, PageComponent, ComponentAttribute } from '../../types/types';
import AGTable from '../../../../components/DataTable/AGTable';
import { RiSlideshow3Line } from "react-icons/ri";
import { use_f_loadPageList, use_f_loadComponents, use_f_loadComponentAttributes } from '../../utils/nocodelowcodeHooks';
import { AiFillFileAdd, AiFillFileExcel } from 'react-icons/ai';
import { IoMdAdd } from 'react-icons/io';
import { CiEdit } from 'react-icons/ci';
import { MdDeleteOutline, MdRefresh } from 'react-icons/md';
import PageShow from './Components/Page/Page';



export default function PagesManager() {
  // State chọn
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);
  const [selectedComponent, setSelectedComponent] = useState<PageComponent | null>(null);
  const [selectedAttribute, setSelectedAttribute] = useState<ComponentAttribute | null>(null);
  const [showPage, setShowPage] = useState(false);

  // Load pages
  const {
    data: pages,
    loading: loadingPages,
    error: errorPages,
    triggerFetch: fetchPages
  } = use_f_loadPageList({});

  // Load components theo page
  const {
    data: components,
    loading: loadingComponents,
    error: errorComponents,
    triggerFetch: fetchComponents,
    triggerFetchWithParams: triggerFetchComponentsWithParams
  } = use_f_loadComponents(selectedPage ? { PageID: selectedPage.PageID } : null);

  // Load attributes theo component
  const {
    data: attributes,
    loading: loadingAttributes,
    error: errorAttributes,
    triggerFetch: fetchAttributes,
    triggerFetchWithParams: triggerFetchAttributesWithParams
  } = use_f_loadComponentAttributes(selectedComponent ? { ComponentID: selectedComponent.ComponentID } : null);

  // Dialog state cho CRUD
  const [openPageDialog, setOpenPageDialog] = useState(false);
  const [editPage, setEditPage] = useState<Page | null>(null);
  const [pageForm, setPageForm] = useState<Partial<Page>>({});
  const [openComponentDialog, setOpenComponentDialog] = useState(false);
  const [editComponent, setEditComponent] = useState<PageComponent | null>(null);
  const [componentForm, setComponentForm] = useState<Partial<PageComponent>>({});
  const [openAttributeDialog, setOpenAttributeDialog] = useState(false);
  const [editAttribute, setEditAttribute] = useState<ComponentAttribute | null>(null);
  const [attributeForm, setAttributeForm] = useState<Partial<ComponentAttribute>>({});

  // Handler chọn page/component
  const handleSelectPage = (page: Page) => {
    setSelectedPage(page);
    setSelectedComponent(null);
    setSelectedAttribute(null);
    triggerFetchComponentsWithParams({ PageID: page.PageID });
  };

  // Thêm/sửa Page
  const handleOpenAddPage = () => {
    setEditPage(null);
    setPageForm({});
    setOpenPageDialog(true);
  };
  const handleOpenEditPage = () => {
    if (selectedPage) {
      setEditPage(selectedPage);
      setPageForm(selectedPage);
      setOpenPageDialog(true);
    }
  };
  const handleClosePageDialog = () => {
    setOpenPageDialog(false);
    setEditPage(null);
    setPageForm({});
  };
  const handleSubmitPage = async () => {
    const { PageName, Description, Layout } = pageForm;
    if (!PageName) return;
    if (editPage) {
      // Update
      await import('../../utils/nocodelowcodeUtils').then(async utils => {
        await utils.f_updatePage({ ...editPage, ...pageForm });
        fetchPages();
        handleClosePageDialog();
      });
    } else {
      // Insert
      await import('../../utils/nocodelowcodeUtils').then(async utils => {
        await utils.f_insertPage({ PageName, Description, Layout });
        fetchPages();
        handleClosePageDialog();
      });
    }
  };
  // Xóa Page
  const handleDeletePage = async () => {
    if (!selectedPage) return;
    if (!window.confirm('Bạn có chắc muốn xóa trang này?')) return;
    await import('../../utils/nocodelowcodeUtils').then(async utils => {
      await utils.f_deletePage({ PageID: selectedPage.PageID });
      fetchPages();
      setSelectedPage(null);
    });
  };
  const handleSelectComponent = (component: PageComponent) => {
    setSelectedComponent(component);
    triggerFetchAttributesWithParams({ ComponentID: component.ComponentID });
    setSelectedAttribute(null);
  };
  const handleSelectAttribute = (attribute: ComponentAttribute) => {
    setSelectedAttribute(attribute);
  };

  // Thêm/sửa Component
  const handleOpenAddComponent = () => {
    setEditComponent(null);
    setComponentForm({ PageID: selectedPage?.PageID });
    setOpenComponentDialog(true);
  };
  const handleOpenEditComponent = () => {
    if (selectedComponent) {
      setEditComponent(selectedComponent);
      setComponentForm(selectedComponent);
      setOpenComponentDialog(true);
    }
  };
  const handleCloseComponentDialog = () => {
    setOpenComponentDialog(false);
    setEditComponent(null);
    setComponentForm({ PageID: selectedPage?.PageID });
  };
  const handleSubmitComponent = async () => {
    if (!componentForm.ComponentName || !componentForm.ComponentType) return;
    if (editComponent) {
      // Update
      await import('../../utils/nocodelowcodeUtils').then(async utils => {
        await utils.f_updateComponent({ ...editComponent, ...componentForm });
        fetchComponents();
        handleCloseComponentDialog();
      });
    } else {
      // Insert
      await import('../../utils/nocodelowcodeUtils').then(async utils => {
        await utils.f_insertComponent({ ...componentForm, PageID: selectedPage?.PageID });
        fetchComponents();
        handleCloseComponentDialog();
      });
    }
  };
  // Xóa Component
  const handleDeleteComponent = async () => {
    console.log(selectedComponent)
    if (!selectedComponent) return;
    if (!window.confirm('Bạn có chắc muốn xóa component này?')) return;
    await import('../../utils/nocodelowcodeUtils').then(async utils => {
      await utils.f_deleteComponent({ ComponentID: selectedComponent.ComponentID });
      fetchComponents();
      setSelectedComponent(null);
    });
  };

  // Thêm/sửa Attribute
  const handleOpenAddAttribute = () => {
    setEditAttribute(null);
    setAttributeForm({ ComponentID: selectedComponent?.ComponentID });
    setOpenAttributeDialog(true);
  };
  const handleOpenEditAttribute = () => {
    if (selectedAttribute) {
      setEditAttribute(selectedAttribute);
      setAttributeForm(selectedAttribute);
      setOpenAttributeDialog(true);
    }
  };
  const handleCloseAttributeDialog = () => {
    setOpenAttributeDialog(false);
    setEditAttribute(null);
    setAttributeForm({ ComponentID: selectedComponent?.ComponentID });
  };
  const handleSubmitAttribute = async () => {
    if (!attributeForm.AttributeName) return;
    if (editAttribute) {
      // Update
      await import('../../utils/nocodelowcodeUtils').then(async utils => {
        await utils.f_updateComponentAttribute({ ...editAttribute, ...attributeForm });
        fetchAttributes();
        handleCloseAttributeDialog();
      });
    } else {
      // Insert
      await import('../../utils/nocodelowcodeUtils').then(async utils => {
        await utils.f_insertComponentAttribute({ ...attributeForm, ComponentID: selectedComponent?.ComponentID });
        fetchAttributes();
        handleCloseAttributeDialog();
      });
    }
  };
  // Xóa Attribute
  const handleDeleteAttribute = async () => {
    if (!selectedAttribute) return;
    if (!window.confirm('Bạn có chắc muốn xóa thuộc tính này?')) return;
    await import('../../utils/nocodelowcodeUtils').then(async utils => {
      await utils.f_deleteComponentAttribute({ AttributeID: selectedAttribute.AttributeID });
      fetchAttributes();
      setSelectedAttribute(null);
    });
  };

  // Columns cho AGTable
  const pageColumns = [
    { field: 'PageID', headerName: 'ID', width: 30 },
    { field: 'PageName', headerName: 'Tên trang', width: 60 },
    { field: 'PageGroupID', headerName: 'Nhóm', width: 40 },
    { field: 'PageGroupName', headerName: 'Tên nhóm', width: 50 },
    { field: 'Description', headerName: 'Mô tả', width: 80 },
    { field: 'CreatedAt', headerName: 'Tạo lúc', width: 80 },
    { field: 'LastModifiedAt', headerName: 'Sửa lúc', width: 80 },
  ];
  const componentColumns = [
    { field: 'ComponentID', headerName: 'ID', width: 60 },
    { field: 'ComponentType', headerName: 'Loại', width: 80 },
    { field: 'ComponentName', headerName: 'Tên', width: 80 },
    { field: 'PositionX', headerName: 'X', width: 60 },
    { field: 'PositionY', headerName: 'Y', width: 60 },
    { field: 'Width', headerName: 'Rộng', width: 60 },
    { field: 'Height', headerName: 'Cao', width: 60 },
    { field: 'ComponentOrder', headerName: 'Thứ tự', width: 60 },
  ];
  const attributeColumns = [
    { field: 'AttributeID', headerName: 'ID', width: 60 },
    { field: 'AttributeName', headerName: 'Tên thuộc tính', width: 80 },
    { field: 'AttributeValue', headerName: 'Giá trị', width: 80 },
    { field: 'CreatedAt', headerName: 'Tạo lúc', width: 80 },
    { field: 'LastModifiedAt', headerName: 'Sửa lúc', width: 80 },
  ];

  // Toolbar cho từng bảng (sẽ bổ sung CRUD sau)
  const pageToolbar = (
    <>
      <IconButton        
        className='buttonIcon'
        onClick={() => {
          handleOpenAddPage();
        }}
      >
        <IoMdAdd color='green' size={15} />
        Thêm
      </IconButton>
      <IconButton
        disabled={!selectedPage}
        className='buttonIcon'
        onClick={() => {
          handleOpenEditPage();
        }}
      >
        <CiEdit color='#1234cf' size={15} />
        Sửa
      </IconButton>
      <IconButton
        disabled={!selectedPage}
        className='buttonIcon'
        onClick={() => {
          handleDeletePage();
        }}
      >
        <MdDeleteOutline  color='#1db609' size={15} />
        Xóa
      </IconButton>
      <IconButton
        className='buttonIcon'
        onClick={() => {
          fetchPages();
        }}
      >
        <MdRefresh  color='#f02bc5' size={15} />
        Refresh
      </IconButton>   
      <IconButton
        className='buttonIcon'
        onClick={() => {
            setShowPage(prev => !prev);          
        }}
      >
        <RiSlideshow3Line   color='#13aeeb' size={15} />
        Show
      </IconButton>   
    </>
  );
  const componentToolbar = (
    <>
    <IconButton
        disabled={!selectedPage}
        className='buttonIcon'
        onClick={() => {
          handleOpenAddComponent();
        }}
      >
        <IoMdAdd color='green' size={15} />
        Thêm
      </IconButton>
      <IconButton
        disabled={!selectedPage}
        className='buttonIcon'
        onClick={() => {
          handleOpenEditComponent();
        }}
      >
        <CiEdit color='#1234cf' size={15} />
        Sửa
      </IconButton>
      <IconButton
        disabled={!selectedPage}
        className='buttonIcon'
        onClick={() => {
          handleDeleteComponent();
        }}
      >
        <MdDeleteOutline  color='#1db609' size={15} />
        Xóa
      </IconButton>
      <IconButton
        className='buttonIcon'
        onClick={() => {
          fetchComponents();
        }}
      >
        <MdRefresh  color='#f02bc5' size={15} />
        Refresh
      </IconButton>   
    </>
  );
  const attributeToolbar = (
    <>
    <IconButton
        disabled={!selectedComponent}
        className='buttonIcon'
        onClick={() => {
          handleOpenAddAttribute();
        }}
      >
        <IoMdAdd color='green' size={15} />
        Thêm
      </IconButton>
      <IconButton
        disabled={!selectedComponent}
        className='buttonIcon'
        onClick={() => {
          handleOpenEditAttribute();
        }}
      >
        <CiEdit color='#1234cf' size={15} />
        Sửa
      </IconButton>
      <IconButton
        disabled={!selectedComponent}
        className='buttonIcon'
        onClick={() => {
          handleDeleteAttribute();
        }}
      >
        <MdDeleteOutline  color='#1db609' size={15} />
        Xóa
      </IconButton>
      <IconButton
        className='buttonIcon'
        onClick={() => {
          fetchAttributes();
        }}
      >
        <MdRefresh  color='#f02bc5' size={15} />
        Refresh
      </IconButton>   
    </>
  );

  const pageAG_Table = useMemo(() => {
    return (
      <AGTable
        suppressRowClickSelection={false}
        data={pages}
        columns={pageColumns}
        toolbar={pageToolbar}
        onRowClick={(params: any) => {
          const row = params.data;
          if (row) handleSelectPage(row);
        }}
        onSelectionChange={(params: any) => {
          
        }}
      />
    );
  }, [pages, selectedPage]);

  const componentAG_Table = useMemo(() => {
    return (
      <AGTable
        suppressRowClickSelection={false}
        data={components}
        columns={componentColumns}
        toolbar={componentToolbar}
        onRowClick={(params: any) => {
          const row = params.data;
          if (row) handleSelectComponent(row);
        }}
        onSelectionChange={(params: any) => {
          
        }}
      />
    );
  }, [components, selectedPage, selectedComponent]);

  const attributeAG_Table = useMemo(() => {
    return (
      <AGTable
        suppressRowClickSelection={false}
        data={attributes}
        columns={attributeColumns}
        toolbar={attributeToolbar}
        onRowClick={(params: any) => {
          const row = params.data;
          if (row) handleSelectAttribute(row);
        }}
        onSelectionChange={(params: any) => {
          
        }}
      />
    );
  }, [attributes, selectedComponent, selectedAttribute]);

  useEffect(() => {
    fetchPages();   
  }, []);
  return (
    <>
      <Box display='flex' gap={1} sx={{ height: '90vh', overflow: 'auto' }}>
        {/* Bảng Trang */}
        <Box width='15%'>
          <Typography >Danh sách Trang</Typography>
          {pageAG_Table}
        </Box>
        {/* Bảng Component */}
        <Box width='20%' display='flex' flexDirection='column' gap={0}>
          <Typography >Danh sách Component</Typography>
          {componentAG_Table}
          <Typography >Thuộc tính Component</Typography>
          {attributeAG_Table}
        </Box>
        {/* Bảng Thuộc tính */}
        <Box width='65%' display='flex' flexDirection='column' gap={1}>
        <Typography >Hiển thị Trang</Typography>
          <PageShow pageId={selectedPage?.PageID || ''}/>
        </Box>
      </Box>
      {/* Dialog nhập liệu Page */}
      <Modal open={openPageDialog} onClose={handleClosePageDialog}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'white', p: 3, width: 400 }}>
          <Typography variant='h6' mb={2}>
            {editPage ? 'Sửa Trang' : 'Thêm Trang'}
          </Typography>
          <TextField label='Tên Trang' fullWidth value={pageForm.PageName || ''} onChange={(e) => setPageForm((f) => ({ ...f, PageName: e.target.value }))} margin='normal' />
          <TextField label='Mô tả' fullWidth value={pageForm.Description || ''} onChange={(e) => setPageForm((f) => ({ ...f, Description: e.target.value }))} margin='normal' />
          <TextField label='Layout' fullWidth value={pageForm.Layout || ''} onChange={(e) => setPageForm((f) => ({ ...f, Layout: e.target.value }))} margin='normal' />
          <TextField label='Nhóm' fullWidth value={pageForm.PageGroupID || 0} onChange={(e) => setPageForm((f) => ({ ...f, PageGroupID: Number(e.target.value) }))} margin='normal' />
          <TextField label='Tên nhóm' fullWidth value={pageForm.PageGroupName || ''} onChange={(e) => setPageForm((f) => ({ ...f, PageGroupName: e.target.value }))} margin='normal' />
          <Box mt={2} display='flex' justifyContent='flex-end' gap={2}>
            <Button onClick={handleSubmitPage} variant='contained'>
              {editPage ? 'Lưu' : 'Thêm'}
            </Button>
            <Button onClick={handleClosePageDialog}>Hủy</Button>
          </Box>
        </Box>
      </Modal>
      {/* Dialog nhập liệu Component */}
      <Modal open={openComponentDialog} onClose={handleCloseComponentDialog}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'white', p: 3, width: 550 }}>
          <Typography variant='h6' mb={2}>
            {editComponent ? 'Sửa Component' : 'Thêm Component'}
          </Typography>
          <TextField label='Tên Component' fullWidth value={componentForm.ComponentName || ''} onChange={(e) => setComponentForm((f) => ({ ...f, ComponentName: e.target.value }))} margin='normal' />
          <TextField label='Loại Component' fullWidth value={componentForm.ComponentType || ''} onChange={(e) => setComponentForm((f) => ({ ...f, ComponentType: e.target.value }))} margin='normal' />
          <TextField label='Vị trí X' fullWidth type='number' value={componentForm.PositionX ?? ''} onChange={(e) => setComponentForm((f) => ({ ...f, PositionX: parseInt(e.target.value) }))} margin='normal' />
          <TextField label='Vị trí Y' fullWidth type='number' value={componentForm.PositionY ?? ''} onChange={(e) => setComponentForm((f) => ({ ...f, PositionY: parseInt(e.target.value) }))} margin='normal' />
          <TextField label='Rộng' fullWidth type='number' value={componentForm.Width ?? ''} onChange={(e) => setComponentForm((f) => ({ ...f, Width: parseInt(e.target.value) }))} margin='normal' />
          <TextField label='Cao' fullWidth type='number' value={componentForm.Height ?? ''} onChange={(e) => setComponentForm((f) => ({ ...f, Height: parseInt(e.target.value) }))} margin='normal' />
          <TextField label='Grid Width' fullWidth type='string' value={componentForm.GridWidth ?? 'full'} onChange={(e) => setComponentForm((f) => ({ ...f, GridWidth: e.target.value }))} margin='normal' />
          <TextField label='Reference ID' fullWidth type='number' value={componentForm.ReferenceID ?? ''} onChange={(e) => setComponentForm((f) => ({ ...f, ReferenceID: parseInt(e.target.value) }))} margin='normal' />
          <TextField label='Thứ tự' fullWidth type='number' value={componentForm.ComponentOrder ?? ''} onChange={(e) => setComponentForm((f) => ({ ...f, ComponentOrder: parseInt(e.target.value) }))} margin='normal' />
          <Box mt={2} display='flex' justifyContent='flex-end' gap={2}>
            <Button onClick={handleSubmitComponent} variant='contained'>
              {editComponent ? 'Lưu' : 'Thêm'}
            </Button>
            <Button onClick={handleCloseComponentDialog}>Hủy</Button>
          </Box>
        </Box>
      </Modal>
      {/* Dialog nhập liệu Attribute */}
      <Modal open={openAttributeDialog} onClose={handleCloseAttributeDialog}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'white', p: 3, width: 400 }}>
          <Typography variant='h6' mb={2}>
            {editAttribute ? 'Sửa Thuộc tính' : 'Thêm Thuộc tính'}
          </Typography>
          <TextField label='Tên Thuộc tính' fullWidth value={attributeForm.AttributeName || ''} onChange={(e) => setAttributeForm((f) => ({ ...f, AttributeName: e.target.value }))} margin='normal' />
          <TextField label='Giá trị' fullWidth value={attributeForm.AttributeValue || ''} onChange={(e) => setAttributeForm((f) => ({ ...f, AttributeValue: e.target.value }))} margin='normal' />
          <Box mt={2} display='flex' justifyContent='flex-end' gap={2}>
            <Button onClick={handleSubmitAttribute} variant='contained'>
              {editAttribute ? 'Lưu' : 'Thêm'}
            </Button>
            <Button onClick={handleCloseAttributeDialog}>Hủy</Button>
          </Box>
        </Box>
      </Modal>
      {/* Modal show page */}
      <Modal open={showPage} onClose={() => setShowPage(false)}>
        <Box sx={{ zIndex: 99, position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'white', p: 1, width: 1800 }}>
          <PageShow pageId={selectedPage?.PageID || ''} />
        </Box>
      </Modal>
    </>
  );
}
