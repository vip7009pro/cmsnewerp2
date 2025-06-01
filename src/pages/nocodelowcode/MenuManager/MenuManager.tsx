import React, { useEffect, useMemo, useState } from 'react';
import './MenuManager.scss';
import {
  Box,
  Button,
  Modal,
  TextField,
  MenuItem,
  IconButton,
  Typography,
  Toolbar,
  Tooltip,
} from '@mui/material';
import { Add, Edit, Delete, Refresh } from '@mui/icons-material';
import * as FaIcons from 'react-icons/fa';
import * as BiIcons from 'react-icons/bi';
import * as MdIcons from 'react-icons/md';
import * as AiIcons from 'react-icons/ai';
import * as FcIcons from 'react-icons/fc';
import * as HiIcons from 'react-icons/hi';
import * as IoIcons from 'react-icons/io';
import { generalQuery } from '../../../api/Api';
import Swal from 'sweetalert2';

// --- Interfaces ---
export interface IMainMenu {
  MenuID: number;
  MenuName: string;
  Text: string;
  MenuIcon: string;
  IconColor: string;
  Link: string;
}
export interface ISubMenu {
  SubMenuID: number;
  MenuID: number;
  SubMenuName: string;
  Text: string;
  SubMenuIcon: string;
  SubIconColor: string;
  Link: string;
  MenuCode: string;
}

// --- Icon List Logic (from NavMenuNew) ---
const getAllIcons = () => {
  const faIconList = Object.keys(FaIcons).map((name) => ({
    name,
    library: 'fa',
    IconComponent: FaIcons[name as keyof typeof FaIcons],
  }));
  const mdIconList = Object.keys(MdIcons).map((name) => ({
    name,
    library: 'md',
    IconComponent: MdIcons[name as keyof typeof MdIcons],
  }));
  const biIconList = Object.keys(BiIcons).map((name) => ({
    name,
    library: 'bi',
    IconComponent: BiIcons[name as keyof typeof BiIcons],
  }));
  const aiIconList = Object.keys(AiIcons).map((name) => ({
    name,
    library: 'ai',
    IconComponent: AiIcons[name as keyof typeof AiIcons],
  }));
  const fcIconList = Object.keys(FcIcons).map((name) => ({
    name,
    library: 'fc',
    IconComponent: FcIcons[name as keyof typeof FcIcons],
  }));
  const hiIconList = Object.keys(HiIcons).map((name) => ({
    name,
    library: 'hi',
    IconComponent: HiIcons[name as keyof typeof HiIcons],
  }));
  const ioIconList = Object.keys(IoIcons).map((name) => ({
    name,
    library: 'io',
    IconComponent: IoIcons[name as keyof typeof IoIcons],
  }));
  return [
    ...faIconList,
    ...mdIconList,
    ...biIconList,
    ...aiIconList,
    ...fcIconList,
    ...hiIconList,
    ...ioIconList,
  ];
};

// --- Main Component ---
const MenuManager: React.FC = () => {
  // State
  const [mainMenus, setMainMenus] = useState<IMainMenu[]>([]);
  const [subMenus, setSubMenus] = useState<ISubMenu[]>([]);
  const [selectedMainMenu, setSelectedMainMenu] = useState<IMainMenu | null>(null);
  const [openMainMenuModal, setOpenMainMenuModal] = useState(false);
  const [openSubMenuModal, setOpenSubMenuModal] = useState(false);
  const [editMainMenu, setEditMainMenu] = useState<IMainMenu | null>(null);
  const [editSubMenu, setEditSubMenu] = useState<ISubMenu | null>(null);
  const [selectedSubMenu, setSelectedSubMenu] = useState<ISubMenu | null>(null);
  const [iconSearch, setIconSearch] = useState('');
  const [iconDropdownType, setIconDropdownType] = useState<'main' | 'sub'>('main');
  const [reloadFlag, setReloadFlag] = useState(0);
  const iconList = useMemo(() => getAllIcons(), []);

  // --- API CRUD ---
  const loadMainMenus = async () => {
    try {
      const res = await generalQuery('loadMainMenus', {});
      if (res?.data?.tk_status !== 'NG') {
        setMainMenus(res.data.data || []);
      } else {
        setMainMenus([]);
      }
    } catch (e) {
      setMainMenus([]);
    }
  };
  const loadSubMenus = async (menuID: number) => {
    try {
      const res = await generalQuery('loadSubMenus', { MenuID: menuID });
      if (res?.data?.tk_status !== 'NG') {
        setSubMenus(res.data.data || []);
      } else {
        setSubMenus([]);
      }
    } catch (e) {
      setSubMenus([]);
    }
  };
  const createMainMenu = async (menu: IMainMenu) => {
    try {
      const res = await generalQuery('createMainMenu', menu);
      if (res?.data?.tk_status !== 'NG') {
        Swal.fire('Thành công', 'Đã thêm menu!', 'success');
        setReloadFlag(f => f + 1);
      } else {
        Swal.fire('Lỗi', res.data.message || 'Không thêm được menu', 'error');
      }
    } catch (e) {
      Swal.fire('Lỗi', 'Không thể thêm menu', 'error');
    }
  };
  const updateMainMenu = async (menu: IMainMenu) => {
    try {
      const res = await generalQuery('updateMainMenu', menu);
      if (res?.data?.tk_status !== 'NG') {
        Swal.fire('Thành công', 'Đã cập nhật menu!', 'success');
        setReloadFlag(f => f + 1);
      } else {
        Swal.fire('Lỗi', res.data.message || 'Không cập nhật được menu', 'error');
      }
    } catch (e) {
      Swal.fire('Lỗi', 'Không thể cập nhật menu', 'error');
    }
  };
  const deleteMainMenu = async (menu: IMainMenu) => {
    try {
      const res = await generalQuery('deleteMainMenu', { MenuID: menu.MenuID });
      if (res?.data?.tk_status !== 'NG') {
        Swal.fire('Thành công', 'Đã xoá menu!', 'success');
        setReloadFlag(f => f + 1);
      } else {
        Swal.fire('Lỗi', res.data.message || 'Không xoá được menu', 'error');
      }
    } catch (e) {
      Swal.fire('Lỗi', 'Không thể xoá menu', 'error');
    }
  };
  const createSubMenu = async (submenu: ISubMenu) => {
    try {
      const res = await generalQuery('createSubMenu', submenu);
      if (res?.data?.tk_status !== 'NG') {
        Swal.fire('Thành công', 'Đã thêm submenu!', 'success');
        setReloadFlag(f => f + 1);
      } else {
        Swal.fire('Lỗi', res.data.message || 'Không thêm được submenu', 'error');
      }
    } catch (e) {
      Swal.fire('Lỗi', 'Không thể thêm submenu', 'error');
    }
  };
  const updateSubMenu = async (submenu: ISubMenu) => {
    try {
      const res = await generalQuery('updateSubMenu', submenu);
      if (res?.data?.tk_status !== 'NG') {
        Swal.fire('Thành công', 'Đã cập nhật submenu!', 'success');
        setReloadFlag(f => f + 1);
      } else {
        Swal.fire('Lỗi', res.data.message || 'Không cập nhật được submenu', 'error');
      }
    } catch (e) {
      Swal.fire('Lỗi', 'Không thể cập nhật submenu', 'error');
    }
  };
  const deleteSubMenu = async (submenu: ISubMenu) => {
    try {
      const res = await generalQuery('deleteSubMenu', { SubMenuID: submenu.SubMenuID });
      if (res?.data?.tk_status !== 'NG') {
        Swal.fire('Thành công', 'Đã xoá submenu!', 'success');
        setReloadFlag(f => f + 1);
      } else {
        Swal.fire('Lỗi', res.data.message || 'Không xoá được submenu', 'error');
      }
    } catch (e) {
      Swal.fire('Lỗi', 'Không thể xoá submenu', 'error');
    }
  };

  // Load data on mount & reloadFlag
  useEffect(() => {
    loadMainMenus();
  }, [reloadFlag]);
  useEffect(() => {
    if (selectedMainMenu) {
      loadSubMenus(selectedMainMenu.MenuID);
      setSelectedSubMenu(null); // reset khi đổi main menu
    } else {
      setSubMenus([]);
      setSelectedSubMenu(null);
    }
  }, [selectedMainMenu, reloadFlag]);

  // --- CRUD Handlers ---
  // Main Menu
  const handleAddMainMenu = () => {
    setEditMainMenu({
      MenuID: Date.now(),
      MenuName: '',
      Text: '',
      MenuIcon: '',
      IconColor: '#000000',
      Link: '',
    });
    setIconSearch('');
    setOpenMainMenuModal(true);
  };
  const handleEditMainMenu = (menu: IMainMenu) => {
    setEditMainMenu({ ...menu });
    setIconSearch(menu.MenuIcon || '');
    setOpenMainMenuModal(true);
  };
  const handleDeleteMainMenu = (menu: IMainMenu) => {
    deleteMainMenu(menu);
    if (selectedMainMenu?.MenuID === menu.MenuID) setSelectedMainMenu(null);
  };
  const handleSaveMainMenu = () => {
    if (!editMainMenu) return;
    if (mainMenus.some((m) => m.MenuID === editMainMenu.MenuID)) {
      updateMainMenu(editMainMenu);
    } else {
      createMainMenu(editMainMenu);
    }
    setOpenMainMenuModal(false);
    setEditMainMenu(null);
  };

  // Sub Menu
  const handleAddSubMenu = () => {
    if (!selectedMainMenu) return;
    setEditSubMenu({
      SubMenuID: Date.now(),
      MenuID: selectedMainMenu.MenuID,
      SubMenuName: '',
      Text: '',
      SubMenuIcon: '',
      SubIconColor: '#000000',
      Link: '',
      MenuCode: ''
    });
    setSelectedSubMenu(null); // reset khi thêm mới
    setIconSearch('');
    setOpenSubMenuModal(true);
  };
  const handleEditSubMenu = (submenu: ISubMenu) => {
    setEditSubMenu({ ...submenu });
    setIconSearch(submenu.SubMenuIcon || '');
    setOpenSubMenuModal(true);
  };
  const handleDeleteSubMenu = (submenu: ISubMenu) => {
    deleteSubMenu(submenu);
  };
  const handleSaveSubMenu = () => {
    if (!editSubMenu) return;
    if (subMenus.some((sm) => sm.SubMenuID === editSubMenu.SubMenuID)) {
      updateSubMenu(editSubMenu);
    } else {
      createSubMenu(editSubMenu);
    }
    setOpenSubMenuModal(false);
    setEditSubMenu(null);
  };

  // --- Icon Dropdown ---
  const renderIconDropdown = (type: 'main' | 'sub') => {
    const value = type === 'main' ? editMainMenu?.MenuIcon : editSubMenu?.SubMenuIcon;
    return (
      <div className="icon-dropdown">
        <TextField
          label="Tìm icon"
          value={iconSearch}
          onChange={(e) => setIconSearch(e.target.value)}
          fullWidth
          margin="normal"
        />
        <div className="icon-list">
          {iconList
            .filter((icon) =>
              icon.name.toLowerCase().includes(iconSearch.toLowerCase())
            )
            .slice(0, 40)
            .map((icon) => (
              <Tooltip title={icon.name} key={icon.name}>
                <IconButton
                  size="small"
                  onClick={() => {
                    if (type === 'main') setEditMainMenu((prev) => prev && { ...prev, MenuIcon: icon.name });
                    else setEditSubMenu((prev) => prev && { ...prev, SubMenuIcon: icon.name });
                  }}
                  color={value === icon.name ? 'primary' : 'default'}
                >
                  <icon.IconComponent />
                </IconButton>
              </Tooltip>
            ))}
        </div>
      </div>
    );
  };

  // --- Render ---
  return (
    <Box className="menu-manager-root">
      <Box className="menu-manager-left">
        <Toolbar className="menu-toolbar">
          <Button startIcon={<Add />} onClick={handleAddMainMenu} variant="contained" size="small">Thêm</Button>
          <Button startIcon={<Edit />} disabled={!selectedMainMenu} onClick={() => selectedMainMenu && handleEditMainMenu(selectedMainMenu)} size="small">Sửa</Button>
          <Button startIcon={<Delete />} disabled={!selectedMainMenu} onClick={() => selectedMainMenu && handleDeleteMainMenu(selectedMainMenu)} size="small" color="error">Xoá</Button>
          <Button startIcon={<Refresh />} size="small">Tải lại</Button>
        </Toolbar>
        <Box className="menu-table">
          <table>
            <thead>
              <tr>
                <th>MenuID</th>
                <th>Tên menu</th>
                <th>Text</th>
                <th>Link</th>
                <th>Icon</th>
                <th>Màu</th>
              </tr>
            </thead>
            <tbody>
              {mainMenus.map((menu) => {
                const iconObj = iconList.find((icon) => icon.name === menu.MenuIcon);
                return (
                  <tr
                    key={menu.MenuID}
                    className={selectedMainMenu?.MenuID === menu.MenuID ? 'selected' : ''}
                    onClick={() => setSelectedMainMenu(menu)}
                  >
                    <td>{menu.MenuID}</td>
                    <td>{menu.MenuName}</td>
                    <td>{menu.Text}</td>
                    <td>{menu.Link}</td>
                    <td>{iconObj ? <iconObj.IconComponent color={menu.IconColor} /> : null}</td>
                    <td>
                      <div style={{ width: 20, height: 20, background: menu.IconColor, borderRadius: '50%' }} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Box>
      </Box>
      <Box className="menu-manager-right">
        <Toolbar className="menu-toolbar">
          <Button startIcon={<Add />} onClick={handleAddSubMenu} disabled={!selectedMainMenu} variant="contained" size="small">Thêm</Button>
          <Button startIcon={<Edit />} onClick={() => {
            if (selectedSubMenu) handleEditSubMenu(selectedSubMenu);
          }} disabled={!selectedMainMenu || !selectedSubMenu} size="small">Sửa</Button>
          <Button startIcon={<Delete />} onClick={() => {
            const sub = subMenus.find((sm) => sm.MenuID === selectedMainMenu?.MenuID);
            if (sub) handleDeleteSubMenu(sub);
          }} disabled={!selectedMainMenu} size="small" color="error">Xoá</Button>
        </Toolbar>
        <Box className="menu-table">
          <table>
            <thead>
              <tr>
                <th>MenuID</th>
                <th>Tên submenu</th>
                <th>SubText</th>
                <th>Link</th>
                <th>Menu Code</th>
                <th>Icon</th>
                <th>Màu</th>
              </tr>
            </thead>
            <tbody>
              {subMenus.filter((sm) => sm.MenuID === selectedMainMenu?.MenuID).map((submenu) => {
                const iconObj = iconList.find((icon) => icon.name === submenu.SubMenuIcon);
                return (
                  <tr
                    key={submenu.SubMenuID}
                    className={selectedSubMenu && selectedSubMenu.SubMenuID === submenu.SubMenuID ? 'selected' : ''}
                    onClick={() => setSelectedSubMenu(submenu)}
                  >
                    <td>{submenu.SubMenuID}</td>
                    <td>{submenu.SubMenuName}</td>
                    <td>{submenu.Text}</td>
                    <td>{submenu.Link}</td>
                    <td>{submenu.MenuCode}</td>
                    <td>{iconObj ? <iconObj.IconComponent color={submenu.SubIconColor} /> : null}</td>
                    <td>
                      <div style={{ width: 20, height: 20, background: submenu.SubIconColor, borderRadius: '50%' }} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Box>
      </Box>
      {/* Main Menu Modal */}
      <Modal open={openMainMenuModal} onClose={() => { setOpenMainMenuModal(false); setEditMainMenu(null); }}>
        <Box className="menu-modal">
          <Typography variant="h6">{editMainMenu && mainMenus.some(m => m.MenuID === editMainMenu.MenuID) ? 'Sửa Main Menu' : 'Thêm Main Menu'}</Typography>
          <TextField label="Tên menu" value={editMainMenu?.MenuName || ''} onChange={e => setEditMainMenu(prev => prev && { ...prev, MenuName: e.target.value })} fullWidth margin="normal" />
          <TextField label="Text" value={editMainMenu?.Text || ''} onChange={e => setEditMainMenu(prev => prev && { ...prev, Text: e.target.value })} fullWidth margin="normal" />
          <TextField label="Link" value={editMainMenu?.Link || ''} onChange={e => setEditMainMenu(prev => prev && { ...prev, Link: e.target.value })} fullWidth margin="normal" />
          <Box mt={2}>
            <Typography variant="subtitle2">Chọn icon</Typography>
            {renderIconDropdown('main')}
          </Box>
          <Box mt={2} display="flex" alignItems="center">
  <Typography variant="subtitle2" mr={2}>Chọn màu icon</Typography>
  <input
    type="color"
    value={editMainMenu?.IconColor || '#000000'}
    onChange={e => setEditMainMenu(prev => prev && { ...prev, IconColor: e.target.value })}
    style={{ marginRight: 8 }}
  />
  <input
    type="text"
    value={editMainMenu?.IconColor || ''}
    onChange={e => {
      const val = e.target.value;
      // Chỉ cho phép nhập mã hex hợp lệ
      if (/^#([0-9A-Fa-f]{0,6})$/.test(val)) {
        setEditMainMenu(prev => prev && { ...prev, IconColor: val });
      }
    }}
    style={{ width: 90, marginRight: 8 }}
    maxLength={7}
    placeholder="#000000"
  />
  <span style={{ marginLeft: 8 }}>{editMainMenu?.IconColor}</span>
</Box>
          <Box mt={2}>
            <Button onClick={handleSaveMainMenu} variant="contained">Lưu</Button>
            <Button onClick={() => { setOpenMainMenuModal(false); setEditMainMenu(null); }} sx={{ ml: 2 }}>Huỷ</Button>
          </Box>
        </Box>
      </Modal>
      {/* Sub Menu Modal */}
      <Modal open={openSubMenuModal} onClose={() => { setOpenSubMenuModal(false); setEditSubMenu(null); }}>
        <Box className="menu-modal">
          <Typography variant="h6">{editSubMenu && subMenus.some(sm => sm.SubMenuID === editSubMenu.SubMenuID) ? 'Sửa Sub Menu' : 'Thêm Sub Menu'}</Typography>
          <TextField label="Tên submenu" value={editSubMenu?.SubMenuName || ''} onChange={e => setEditSubMenu(prev => prev && { ...prev, SubMenuName: e.target.value })} fullWidth margin="normal" />
          <TextField label="Text" value={editSubMenu?.Text || ''} onChange={e => setEditSubMenu(prev => prev && { ...prev, Text: e.target.value })} fullWidth margin="normal" />
          <TextField label="Link" value={editSubMenu?.Link || ''} onChange={e => setEditSubMenu(prev => prev && { ...prev, Link: e.target.value })} fullWidth margin="normal" />
          <TextField label="Menu Code" value={editSubMenu?.MenuCode || ''} onChange={e => setEditSubMenu(prev => prev && { ...prev, MenuCode: e.target.value })} fullWidth margin="normal" />
          <Box mt={2}>
            <Typography variant="subtitle2">Chọn icon</Typography>
            {renderIconDropdown('sub')}
          </Box>
          <Box mt={2} display="flex" alignItems="center">
  <Typography variant="subtitle2" mr={2}>Chọn màu icon</Typography>
  <input
    type="color"
    value={editSubMenu?.SubIconColor || '#000000'}
    onChange={e => setEditSubMenu(prev => prev && { ...prev, SubIconColor: e.target.value })}
    style={{ marginRight: 8 }}
  />
  <input
    type="text"
    value={editSubMenu?.SubIconColor || ''}
    onChange={e => {
      const val = e.target.value;
      if (/^#([0-9A-Fa-f]{0,6})$/.test(val)) {
        setEditSubMenu(prev => prev && { ...prev, SubIconColor: val });
      }
    }}
    style={{ width: 90, marginRight: 8 }}
    maxLength={7}
    placeholder="#000000"
  />
  <span style={{ marginLeft: 8 }}>{editSubMenu?.SubIconColor}</span>
</Box>
          <Box mt={2}>
            <Button onClick={handleSaveSubMenu} variant="contained">Lưu</Button>
            <Button onClick={() => { setOpenSubMenuModal(false); setEditSubMenu(null); }} sx={{ ml: 2 }}>Huỷ</Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default MenuManager;