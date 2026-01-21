import { useEffect, useMemo, useRef, useState } from 'react';
import MainNews from './MainNews';
import NewsList from './NewsList';
import "./Information.scss";
import { DEPARTMENT_DATA, POST_DATA } from './interfaces/infoInterface';
import { f_fetchPostList, f_getDepartmentList } from './utils/infoUtils';
import { getCompany } from '../../api/Api';

const Information = () => {
  const [deptlist, setDeptList] = useState<DEPARTMENT_DATA[]>([]);
  const [postList, setPostList] = useState<POST_DATA[]>([]);
  const [selectedNews, setSelectedNews] = useState<POST_DATA>();
  const [menustate, setMenuState] = useState(0)
  const [fullScreen, setFullScreen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const stt = useRef(0);

  const fetchPostList = async (DEPT_CODE: number) => {
    let kq: POST_DATA[] = [];
    kq = await f_fetchPostList(DEPT_CODE);
    setPostList(kq);
    if (kq.length > 0) {
      setSelectedNews(kq[0]);
    }
  };

  const filteredPostList = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    if (q.length === 0) return postList;
    return postList.filter((p) => {
      const title = (p.TITLE ?? '').toLowerCase();
      const dept = (p.SUBDEPT ?? '').toLowerCase();
      const content = (p.CONTENT ?? '').toLowerCase();
      return title.includes(q) || dept.includes(q) || content.includes(q);
    });
  }, [postList, searchText]);

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
    <div className={`information ${fullScreen ? 'isFullscreen' : ''}`}>
      <div className="information__topbar">
        <div className="information__brand">
          <div className="information__title" onClick={() => {
            fetchPostList(menustate);
          }}>
            BẢNG TIN TRUYỀN THÔNG {getCompany()}
          </div>
          <div className="information__subtitle">
            {filteredPostList.length}/{postList.length} tin
          </div>
        </div>

        <div className="information__actions">
          <div className="information__search">
            <input
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Tìm nhanh theo tiêu đề / bộ phận / nội dung"
            />
          </div>

          <button
            className="information__btn"
            onClick={() => {
              fetchPostList(menustate);
            }}
            type="button"
          >
            Làm mới
          </button>
          <button
            className="information__btn information__btn--primary"
            onClick={() => {
              setFullScreen((prev) => !prev);
            }}
            type="button"
          >
            {fullScreen ? 'Thoát toàn màn hình' : 'Toàn màn hình'}
          </button>
        </div>
      </div>

      <div className="information__menu">
        <div className="information__menuInner">
          <button
            className={`information__chip ${menustate === 0 ? 'isActive' : ''}`}
            onClick={() => {
              setMenuState(0);
              fetchPostList(0);
            }}
            type="button"
          >
            Home
          </button>
          {deptlist.map((ele) => (
            <button
              key={ele.DEPT_CODE}
              className={`information__chip ${menustate === ele.DEPT_CODE ? 'isActive' : ''}`}
              onClick={() => {
                setMenuState(ele.DEPT_CODE);
                fetchPostList(ele.DEPT_CODE);
              }}
              type="button"
            >
              {ele.SUBDEPT}
            </button>
          ))}
        </div>
      </div>

      <div className="information__content">
        <MainNews
          onClick={() => {
            setFullScreen((prev) => !prev);
          }}
          imageSrc={encodeURI(`/informationboard/${selectedNews?.FILE_NAME}`)}
          title={selectedNews?.TITLE ?? ""}
          dept={selectedNews?.SUBDEPT ?? ""}
          date={selectedNews?.INS_DATE ?? ""}
        />
        <NewsList
          newsItems={filteredPostList}
          selectedPostId={selectedNews?.POST_ID}
          onNewsClick={handleNewsClick}
        />
      </div>
    </div>
  );
}

export default Information;