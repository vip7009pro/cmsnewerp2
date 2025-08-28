import { Outlet } from 'react-router-dom';
import '../home/home.scss';
import { animated } from '@react-spring/web';
import React, { useEffect, useState, Suspense, useMemo, useCallback } from 'react';
import { generalQuery, getCompany, getUserData, logout } from '../../api/Api';
import Swal from 'sweetalert2';
import { IconButton, Tab, TabProps, Tabs, Typography } from '@mui/material';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { RootState } from '../../redux/store';
import { useSelector, useDispatch } from 'react-redux';
import { closeTab, settabIndex } from '../../redux/slices/globalSlice';
import styled from '@emotion/styled';
import Cookies from 'universal-cookie';
import { MENU_LIST_DATA } from '../../api/GlobalInterface';
import { AccountInfo, Navbar } from '../../api/lazyPages';
import { getMenuList } from './menuConfig';
import PageTabs from '../nocodelowcode/components/PagesManager/Components/PageTabs/PageTabs';
export const current_ver: number = getCompany() === 'CMS' ? 2643 : 428;
interface ELE_ARRAY {
  REACT_ELE: any;
  ELE_NAME: string;
  ELE_CODE: string;
  PAGE_ID?: number;
}
const TabContainer = styled('div')<{ isSelected: boolean }>(({ isSelected }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  position: 'relative',
  borderRadius: '5px',
  margin: '0 2px',
  backgroundColor: isSelected ? '#1976d23e' : 'transparent',
  '&:hover': {
    backgroundColor: 'rgba(77, 210, 25, 0.103)',
  },
  '&:first-of-type': {
    marginLeft: 0,
  },
  '&:last-of-type': {
    marginRight: 0,
  },
}));

export const CustomTab = styled((props: TabProps) => <Tab {...props} disableRipple />)({
  color: '#7D7D7D',
  fontWeight: 500,
  fontSize: '0.75rem',
  textTransform: 'none',
  minWidth: 0,
  padding: '6px 12px',
  '&.Mui-selected': {
    color: '#1976d2',
    '& span': {
      color: '#1976d2',
    },
  },
  '&:hover': {
    backgroundColor: 'transparent',
  },
});
function Home() {
  const cookies = new Cookies();
  const theme = useSelector((state: RootState) => state.totalSlice.theme);
  const lang = useSelector((state: RootState) => state.totalSlice.lang);
  const company = useSelector((state: RootState) => state.totalSlice.company);
  const tabIndex = useSelector((state: RootState) => state.totalSlice.tabIndex);
  const tabModeSwap = useSelector((state: RootState) => state.totalSlice.tabModeSwap);
  const sidebarStatus = useSelector((state: RootState) => state.totalSlice.sidebarmenu);
  const tabs = useSelector((state: RootState) => state.totalSlice.tabs);
  console.log('company', company);
  const menulist: MENU_LIST_DATA[] = useMemo(() => getMenuList(company, lang), [company, lang]);
  const dispatch = useDispatch();
  const [checkVerWeb, setCheckVerWeb] = useState(1);
  const updatechamcongdiemdanh = useCallback(() => {
    generalQuery('updatechamcongdiemdanhauto', {})
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== 'NG') {
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  const CustomTabLabel = styled(Typography)({
    fontWeight: 200, // Ví dụ: đặt độ đậm cho chữ
    // Thêm các kiểu tùy chỉnh khác tại đây...
  });
  const getchamcong = useCallback(() => {
    generalQuery('checkMYCHAMCONG', {})
      .then((response) => {
        //console.log(response.data);
        if (response.data.tk_status !== 'NG') {
          //console.log('data',response.data.REFRESH_TOKEN);
          let rfr_token: string = response.data.REFRESH_TOKEN;
          cookies.set('token', rfr_token, { path: '/' });
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  const checkERPLicense = useCallback(() => {
    if (true) {
      generalQuery('checkLicense', {
        COMPANY: company,
      })
        .then((response) => {
          if (response.data.tk_status !== 'NG') {
            console.log(response.data.message);
          } else {
            console.log(response.data.message);
            if (getUserData()?.EMPL_NO !== 'NHU1903') {
              Swal.fire('Thông báo', 'Please check your network', 'error');
              logout();
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, []);
  const checkWebVer = useCallback((intervalID?: number) => {
    generalQuery('checkWebVer', {})
      .then((response) => {
        if (response?.data?.tk_status !== 'NG') {
          //console.log('webver',response.data.data[0].VERWEB);
          if (current_ver >= response.data.data[0].VERWEB) {
          } else {
            if (intervalID) {
              window.clearInterval(intervalID);
            }
            Swal.fire({
              title: 'ERP has updates?',
              text: 'Update Web',
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Update',
              cancelButtonText: 'Update later',
            }).then((result) => {
              if (result.isConfirmed) {
                Swal.fire('Notification', 'Update Web', 'success');
                window.location.reload();
              } else {
                Swal.fire('Notification', 'Press Ctrl + F5 to update the Web', 'info');
              }
            });
          }
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  useEffect(() => {
    console.log('local ver', current_ver);
    checkWebVer();
    let intervalID = window.setInterval(() => {
      checkWebVer(intervalID);
      getchamcong();
    }, 30000);
    checkERPLicense();
    return () => {
      window.clearInterval(intervalID);
    };
  }, []);
  return (
    <div className='home'>
      <div className='navdiv'>
        <Navbar />
      </div>
      <div className='homeContainer'>
        <div className='outletdiv'>
          <animated.div
            className='animated_div'
            style={{
              width: '100%',
              height: '100vh',
              borderRadius: 8,
            }}
          >
            {tabModeSwap && tabs.filter((ele: ELE_ARRAY, index: number) => ele.ELE_CODE !== '-1' && ele.ELE_CODE !== 'NS0').length > 0 && (
              <div className='tabsdiv'>
                <Tabs
                  value={tabIndex}
                  onChange={(event: React.SyntheticEvent, newValue: number) => {
                    dispatch(settabIndex(newValue));
                  }}
                  
                  variant='scrollable'
                  aria-label='ERP TABS'
                  scrollButtons
                  allowScrollButtonsMobile
                  className='tabs'
                  sx={{
                    width: '100%',
                    maxWidth: '100%',
                    position: 'relative',
                    indicator: {
                      display: 'none',
                    },
                    backgroundImage: theme.CMS.backgroundImage,
                    minHeight: '36px',
                    boxSizing: 'border-box',
                    borderBottom: '1px solid #e0e0e0',
                    overflowX: 'auto',
                    overflowY: 'hidden',
                    WebkitOverflowScrolling: 'touch',
                    '& .MuiTabs-scroller': {
                      overflow: 'visible !important',
                      display: 'flex',
                      flexWrap: 'nowrap',
                    },
                    '& .MuiTabs-indicator': {
                      backgroundColor: '#1976d2',
                      height: '2px',
                      bottom: '1px',
                    },
                    '& .MuiTabs-flexContainer': {
                      height: '100%',
                      alignItems: 'center',
                      flexWrap: 'nowrap',
                      padding: '0 12px',
                      width: 'max-content',
                      minWidth: '100%',
                    },
                    '& .MuiTabs-scrollButtons': {
                      width: '28px',
                      minWidth: '28px',
                      height: '28px',
                      alignSelf: 'center',
                      '&.Mui-disabled': {
                        opacity: 0.3,
                      },
                      '@media (max-width: 600px)': {
                        width: '24px',
                        minWidth: '24px',
                      }
                    },
                  }}
                >
                  {tabs.map((ele: ELE_ARRAY, index: number) => {
                    if (ele?.ELE_CODE !== '-1')
                      return (
                        <TabContainer isSelected={tabIndex === index} key={index}>
                          <CustomTab
                            key={index}
                            label={
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  padding: '0 8px',
                                  cursor: 'pointer',
                                  height: '100%',
                                }}
                                onClick={(e) => {
                                  dispatch(settabIndex(index));
                                }}
                              >
                                <span
                                  style={{
                                    fontSize: '0.8125rem',
                                    lineHeight: 1.5,
                                    paddingRight: '4px',
                                    marginTop: '-1px',
                                    color: tabIndex === index ? '#1976d2' : 'inherit',
                                  }}
                                >
                                  {ele.ELE_NAME}
                                </span>
                              </div>
                            }
                            value={index}
                            style={{
                              padding: '0 12px',
                              minHeight: '32px',
                              minWidth: 'fit-content',
                              boxSizing: 'border-box',
                              borderRadius: '4px',
                              whiteSpace: 'nowrap',
                              flexShrink: 0,
                              position: 'relative',
                              zIndex: 1,
                              /* '@media (max-width: 600px)': {
                                fontSize: '0.75rem',
                                padding: '0 8px',
                              } */
                            }}
                          ></CustomTab>
                          <IconButton
                            key={index + 'A'}
                            onClick={(e) => {
                              e.stopPropagation();
                              dispatch(closeTab(index));
                            }}
                            size='small'
                            sx={{
                              padding: '4px',
                              margin: 0,
                              position: 'relative',
                              zIndex: 2,
                              '&:hover': {
                                backgroundColor: 'rgba(0, 0, 0, 0.04)',
                              },
                              '@media (max-width: 600px)': {
                                padding: '2px',
                                margin: '0 0 0 2px',
                                '& svg': {
                                  width: '14px',
                                  height: '14px',
                                }
                              }
                            }}
                          >
                            <AiOutlineCloseCircle color={tabIndex === index ? `#1976d2` : `#757575`} size={16} />
                          </IconButton>
                        </TabContainer>
                      );
                  })}
                </Tabs>
              </div>
            )}
            {tabModeSwap &&
              tabs.map((ele: ELE_ARRAY, index: number) => {
                if (ele.ELE_CODE !== '-1')
                  return (
                    <div
                      key={index}
                      className='component_element'
                      style={{
                        visibility: index === tabIndex ? 'visible' : 'hidden',
                        width: sidebarStatus ? '100%' : '100%',
                      }}
                    >
                      <Suspense fallback={<div>Loading...</div>}>
                        {/* <PageShow pageId={ele.PAGE_ID ?? 0} /> */}
                        {ele.PAGE_ID !== -1 ? <PageTabs PageGroupID={ele.PAGE_ID ?? 0} /> : menulist.find((menu) => menu.MENU_CODE === ele.ELE_CODE)?.MENU_ITEM}
                      </Suspense>
                    </div>
                  );
              })}
            {current_ver >= checkVerWeb ? (
              !tabModeSwap && <Outlet />
            ) : (
              <p
                style={{
                  fontSize: 35,
                  backgroundColor: 'red',
                  width: '100%',
                  height: '100%',
                  zIndex: 1000,
                }}
              >
                ERP has updates, Press Ctrl +F5 to update web
              </p>
            )}
            {tabModeSwap && tabs.length === 0 && <AccountInfo />}
          </animated.div>
        </div>
        {/* {userData?.EMPL_NO === 'NHU1903' && <div className="chatroom">
          <CHAT />
        </div>} */}
      </div>
    </div>
  );
}
export default Home;
