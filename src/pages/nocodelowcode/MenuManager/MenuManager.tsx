import React, { useEffect, useRef, useState } from 'react';
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
// Danh mục icon (7 bộ react-icons) đã tách sang ./menuIconCatalog và chỉ nạp ĐỘNG khi mở modal
// chọn icon. Xem giải thích + số đo (4,9 MB / 90% entry chunk) trong menuIconCatalog.ts
import type { MenuIconItem } from './menuIconCatalog';
// FALLBACK: danh mục icon nay là danh sách tinh tuyển, nên tên icon cũ trong DB có thể không còn
// trong danh mục -> tra tiếp sang bộ icon nội tuyến của sidebar để menu cũ không mất icon.
import { getLocalIcon } from '../../../components/icons/localIconSet';
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
  PAGE_ID: number;
}

// NOTE: danh mục icon (`getAllIcons`) đã chuyển sang ./menuIconCatalog — nạp động,
// KHÔNG import tĩnh ở đây (xem comment đầu file menuIconCatalog.ts để biết lý do).

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

  // Danh mục icon: nạp ĐỘNG, chỉ khi admin mở modal Thêm/Sửa menu (nơi có dropdown chọn icon).
  // Trước đây `useMemo(() => getAllIcons(), [])` chạy ngay khi mount + import tĩnh namespace
  // ⇒ kéo cả 7 bộ icon (~4,9 MB) vào bundle khởi động của MỌI user. Xem menuIconCatalog.ts
  const [iconList, setIconList] = useState<MenuIconItem[]>([]);
  const [iconCatalogLoading, setIconCatalogLoading] = useState(false);
  const iconCatalogRequestedRef = useRef(false);

  useEffect(() => {
    if (!openMainMenuModal && !openSubMenuModal) return;
    if (iconCatalogRequestedRef.current) return;
    iconCatalogRequestedRef.current = true;

    let cancelled = false;
    setIconCatalogLoading(true);
    void import('./menuIconCatalog').then(({ getAllIcons }) => {
      if (cancelled) return;
      setIconList(getAllIcons());
      setIconCatalogLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [openMainMenuModal, openSubMenuModal]);

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
      MenuCode: '',
      PAGE_ID: -1
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
      console.log(editSubMenu);
      updateSubMenu(editSubMenu);
    } else {
      console.log(editSubMenu);
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
          {iconCatalogLoading && (
            <Typography variant="caption" sx={{ p: 1 }}>
              Đang tải danh mục icon…
            </Typography>
          )}
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
                const FallbackIcon = iconObj ? undefined : getLocalIcon(menu.MenuIcon);
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
                    <td>{iconObj ? <iconObj.IconComponent color={menu.IconColor} /> : FallbackIcon ? <FallbackIcon color={menu.IconColor} /> : null}</td>
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
                <th>Page ID</th>
                <th>Icon</th>
                <th>Màu</th>
              </tr>
            </thead>
            <tbody>
              {subMenus.filter((sm) => sm.MenuID === selectedMainMenu?.MenuID).map((submenu) => {
                const iconObj = iconList.find((icon) => icon.name === submenu.SubMenuIcon);
                const FallbackIcon = iconObj ? undefined : getLocalIcon(submenu.SubMenuIcon);
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
                    <td>{submenu.PAGE_ID}</td>
                    <td>{iconObj ? <iconObj.IconComponent color={submenu.SubIconColor} /> : FallbackIcon ? <FallbackIcon color={submenu.SubIconColor} /> : null}</td>
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
          <TextField label="Page ID" value={editSubMenu?.PAGE_ID || -1} onChange={e => setEditSubMenu(prev => prev && { ...prev, PAGE_ID: Number(e.target.value) })} fullWidth margin="normal" />
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