import React, { useEffect, useRef, useState } from 'react'
import MainNews from './MainNews';
import NewsList from './NewsList';
import "./Information.scss";
import { DEPARTMENT_DATA, POST_DATA } from '../../api/GlobalInterface';
import { generalQuery } from '../../api/Api';
import moment from 'moment';
import { f_fetchPostList, f_getDepartmentList } from '../../api/GlobalFunction';
const Information = () => {
  const [deptlist, setDeptList] = useState<DEPARTMENT_DATA[]>([]);
  const [postList, setPostList] = useState<POST_DATA[]>([]);
  const [selectedNews, setSelectedNews] = useState<POST_DATA>();
  const [menustate, setMenuState] = useState(0)
  const [fullScreen, setFullScreen] = useState(false);
  const stt = useRef(0);
  const fetchPostList = async (DEPT_CODE: number) => {
    let kq: POST_DATA[] = [];
    kq = await f_fetchPostList(DEPT_CODE);
    setPostList(kq);
    if (kq.length > 0) {
      setSelectedNews(kq[0]);
    }
  };
  const handleShowSTTPost = () => {
    setSelectedNews(postList[stt.current]);
  }
  const getDepartmentList = async () => {
    setDeptList(await f_getDepartmentList());
  }
  useEffect(() => {
    getDepartmentList();
    fetchPostList(menustate);
    let intervalID = window.setInterval(async () => {
      console.log('stt', stt.current);
      console.log('postlist length', postList.length);
      await fetchPostList(menustate);
      if (stt.current >= postList.length - 1) {
        stt.current = 0;
      }
      else {
        stt.current++;
      }
      handleShowSTTPost();
    }, 5000);
    return () => {
      window.clearInterval(intervalID);
    }
  }, [postList.length]);
  const handleNewsClick = (newsItem: POST_DATA) => {
    setSelectedNews(newsItem);
  };
  return (
    <div className="information" style={{
      position: fullScreen ? `fixed` : `relative`,
      top: fullScreen ? `0` : `0`,
      left: fullScreen ? `0` : `0`
    }}>
      <div className="header">
        <div className="menu">
          <ul className="menu-list">
            <li className="menu-item" onClick={() => { setMenuState(0); fetchPostList(0) }} style={{ padding: '5px', borderRadius: '2px', backgroundColor: `${menustate === 0 ? '#ffffff6a' : ''}` }}><a href="#" className="menu-link">Home</a></li> <span style={{ color: 'white' }}>|</span>
            {
              deptlist.map((ele, index) => (
                <>
                  <li className="menu-item" onClick={() => { setMenuState(ele.DEPT_CODE); fetchPostList(ele.DEPT_CODE) }} style={{ padding: '5px', borderRadius: '2px', backgroundColor: `${menustate === ele.DEPT_CODE ? '#ffffff6a' : ''}` }}><a href="#" className="menu-link">{ele.SUBDEPT}</a></li> <span style={{ color: 'white' }}>|</span>
                </>
              ))
            }
          </ul>
        </div>
      </div>
      <div className="title" onClick={() => {
        fetchPostList(menustate);
      }}>
        BẢNG TIN TRUYỀN THÔNG CMS VINA
      </div>
      <div className="content">
        <MainNews onClick={() => { setFullScreen(prev => !prev) }} imageSrc={encodeURI(`/informationboard/${selectedNews?.FILE_NAME}`)} title={selectedNews?.TITLE ?? ""} dept={selectedNews?.SUBDEPT ?? ""} date={selectedNews?.INS_DATE ?? ""} />
        <NewsList newsItems={postList} onNewsClick={handleNewsClick} />
      </div>
    </div>
  );
}
export default Information;