import React, { useEffect, useState } from 'react'
import MainNews from './MainNews';
import NewsList from './NewsList';
import "./Information.scss";
import { DEPARTMENT_DATA, POST_DATA } from '../../api/GlobalInterface';
import { generalQuery } from '../../api/Api';
import moment from 'moment';
import { f_getDepartmentList } from '../../api/GlobalFunction';
interface NewsItem {
    thumbnail: string;
    imageSrc: string;
    title: string;
  }
const Information = () => {
  const [deptlist, setDeptList] = useState<DEPARTMENT_DATA[]>([]);
  const [postList, setPostList] = useState<POST_DATA[]>([]);
  const [selectedNews, setSelectedNews] = useState<POST_DATA>();
  const fetchPostList = async () => {
    try {
        let res = await generalQuery('loadPost', {});
        console.log(res);
        if (res.data.tk_status !== 'NG') {
          console.log(res.data.data);
          let loaded_data: POST_DATA[] = res.data.data.map((ele: POST_DATA, index: number)=> {
            return {
              ...ele,
              INS_DATE: moment.utc(ele.INS_DATE).format('YYYY-MM-DD'),
              id: index
            }
          })

          setPostList(loaded_data);      
          setSelectedNews(loaded_data[0]);    
          
        } else {
          console.log('fetch error'); 
        }
      } catch (error) {
        console.log(error);
      } 
  };

  const getDepartmentList = async () => {
    setDeptList(await f_getDepartmentList());
  }
  useEffect(() => {   
    getDepartmentList();
    fetchPostList();
  }, []);
    



      const handleNewsClick = (newsItem: POST_DATA) => {
        setSelectedNews(newsItem);
      };
    
      return (
        <div className="information">
            <div className="header">
            <div className="menu">
                <ul className="menu-list">
                    <li className="menu-item"><a href="#" className="menu-link">Home</a></li>
                    {
                      deptlist.map((ele, index) => (
                        <li className="menu-item"><a href="#" className="menu-link">{ele.SUBDEPT}</a></li>
                      ))
                    }                   
                </ul>
            </div>
            </div>
            <div className="title" onClick={()=> {
              fetchPostList();
            }}>
            BẢNG TIN TRUYỀN THÔNG CMS VINA
            </div>
            <div className="content">
            <MainNews imageSrc={encodeURI(`/informationboard/${selectedNews?.FILE_NAME}`)} title={selectedNews?.TITLE??""} dept={selectedNews?.SUBDEPT ?? ""} date={selectedNews?.INS_DATE??""}/>
            <NewsList newsItems={postList} onNewsClick={handleNewsClick} />
            </div>       
            </div>  
       
      );
}

export default Information;