import moment from "moment";
import React, { useContext, useEffect, useMemo, useRef, useState, useTransition } from "react";
import Swal from "sweetalert2";
import "./PostManager.scss";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { POST_DATA } from "../../api/GlobalInterface";
import { f_deletePostData, f_fetchPostList, f_fetchPostListAll, f_updatePostData, } from "../../api/GlobalFunction";
import AGTable from "../../components/DataTable/AGTable";
import AddInfo from "./AddInfo";
import { getUserData } from "../../api/Api";
const PostManager = () => {
  const theme: any = useSelector((state: RootState) => state.totalSlice.theme);
  const [fromdate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
  const [todate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [codeKD, setCodeKD] = useState("");
  const [codeCMS, setCodeCMS] = useState("");
  const [prodrequestno, setProdRequestNo] = useState("");
  const [plan_id, setPlanID] = useState("");
  const [alltime, setAllTime] = useState(false);
  const [m_name, setM_Name] = useState("");
  const [m_code, setM_Code] = useState("");
  const [showhideAddInfo, setShowHideAddInfo] = useState(false)
  const column_posts = [
    { field: "POST_ID", headerName: "POST_ID", width: 80, headerCheckboxSelection: true, checkboxSelection: true, editable: false },
    { field: "DEPT_CODE", headerName: "DEPT_CODE", width: 60, editable: false },
    { field: "MAINDEPT", headerName: "MAINDEPT", width: 80, editable: false },
    { field: "SUBDEPT", headerName: "SUBDEPT", width: 80, editable: false },
    { field: "FILE_NAME", headerName: "FILE_NAME", width: 100, editable: false },
    { field: "TITLE", headerName: "TITLE", flex: 2, editable: true },
    { field: "CONTENT", headerName: "CONTENT", flex: 3, editable: true },
    { field: "IS_PINNED", headerName: "IS_PINNED", width: 60, editable: true },
    { field: "INS_DATE", headerName: "INS_DATE", width: 60, editable: false },
    { field: "INS_EMPL", headerName: "INS_EMPL", width: 60, editable: false },
    { field: "UPD_DATE", headerName: "UPD_DATE", width: 60, editable: false },
    { field: "UPD_EMPL", headerName: "UPD_EMPL", width: 60, editable: false },
  ]
  const [postList, setPostList] = useState<POST_DATA[]>([]);
  const selectedPostList = useRef<POST_DATA[]>([]);
  const fetchPostList = async () => {
    console.log('vao day')
    let kq: POST_DATA[] = [];
    kq = await f_fetchPostListAll();
    if (kq.length > 0) {
      Swal.fire('Thông báo', 'Đã load ' + kq.length + ' dòng', 'success');
    }
    else {
      Swal.fire('Thông báo', 'Không có dữ liệu', 'error');
    }
    setPostList(kq);
  };
  const updatePost = async () => {
    if (selectedPostList.current.length === 0) {
      Swal.fire('Thông báo', 'Chọn ít nhất một dòng', 'warning');
      return;
    }
    for (let i = 0; i < selectedPostList.current.length; i++) {
      if (getUserData()?.EMPL_NO === selectedPostList.current[i].INS_EMPL)
        await f_updatePostData(selectedPostList.current[i])
    }
    fetchPostList();
    Swal.fire('Thông báo', "Đã update hoàn thành", 'success')
  }
  const deletePost = async () => {
    if (selectedPostList.current.length === 0) {
      Swal.fire('Thông báo', 'Chọn ít nhất một dòng', 'warning');
      return;
    }
    for (let i = 0; i < selectedPostList.current.length; i++) {
      if (getUserData()?.EMPL_NO === selectedPostList.current[i].INS_EMPL)
        await f_deletePostData(selectedPostList.current[i])
    }
    Swal.fire('Thông báo', "Đã xóa post hoàn thành", 'success')
    fetchPostList();
  }
  const postDataTableAG = useMemo(() => {
    return (
      <AGTable
        toolbar={
          <div
            style={{
              fontWeight: "bold",
              fontSize: "1rem",
              paddingLeft: 20,
              color: "black",
            }}
          >
            Post List
          </div>}
        columns={column_posts}
        suppressRowClickSelection={false}
        data={postList}
        onCellEditingStopped={(e) => {
          //console.log(e.data)
        }} onRowClick={(e) => {
          //console.log(e.data)
        }} onSelectionChange={(e) => {
          //console.log(e!.api.getSelectedRows())
          selectedPostList.current = e!.api.getSelectedRows();
        }}
      />
    )
  }, [postList, column_posts])
  useEffect(() => {
    fetchPostList();
  }, []);
  return (
    <div className='postmanager'>
      <div className='tracuuDataInspection'>
        <div className='tracuuDataInspectionform' style={{ backgroundImage: theme.CMS.backgroundImage }}>
          <div className='forminput'>
            <div className='forminputcolumn'>
              <label>
                <b>Từ ngày:</b>
                <input
                  type='date'
                  value={fromdate.slice(0, 10)}
                  onChange={(e) => setFromDate(e.target.value)}
                ></input>
              </label>
              <label>
                <b>Tới ngày:</b>{" "}
                <input
                  type='date'
                  value={todate.slice(0, 10)}
                  onChange={(e) => setToDate(e.target.value)}
                ></input>
              </label>
            </div>
            <div className='forminputcolumn'>
              <label>
                <b>Code KD:</b>{" "}
                <input
                  type='text'
                  placeholder='GH63-xxxxxx'
                  value={codeKD}
                  onChange={(e) => setCodeKD(e.target.value)}
                ></input>
              </label>
              <label>
                <b>Code ERP:</b>{" "}
                <input
                  type='text'
                  placeholder='7C123xxx'
                  value={codeCMS}
                  onChange={(e) => setCodeCMS(e.target.value)}
                ></input>
              </label>
            </div>
            <div className='forminputcolumn'>
              <label>
                <b>Tên Liệu:</b>{" "}
                <input
                  type='text'
                  placeholder='SJ-203020HC'
                  value={m_name}
                  onChange={(e) => setM_Name(e.target.value)}
                ></input>
              </label>
              <label>
                <b>Mã Liệu CMS:</b>{" "}
                <input
                  type='text'
                  placeholder='A123456'
                  value={m_code}
                  onChange={(e) => setM_Code(e.target.value)}
                ></input>
              </label>
            </div>
            <div className='forminputcolumn'>
              <label>
                <b>Số YCSX:</b>{" "}
                <input
                  type='text'
                  placeholder='1F80008'
                  value={prodrequestno}
                  onChange={(e) => setProdRequestNo(e.target.value)}
                ></input>
              </label>
              <label>
                <b>Số chỉ thị:</b>{" "}
                <input
                  type='text'
                  placeholder='A123456'
                  value={plan_id}
                  onChange={(e) => setPlanID(e.target.value)}
                ></input>
              </label>
              <label>
                <b>All Time:</b>
                <input
                  type='checkbox'
                  name='alltimecheckbox'
                  defaultChecked={alltime}
                  onChange={() => setAllTime(!alltime)}
                ></input>
              </label>
            </div>
          </div>
          <div className='formbutton'>
            <button
              className='tranhatky'
              onClick={() => {
                fetchPostList();
              }}
            >
              Load
            </button>
            <button
              className='tranhapxuatkiembutton'
              onClick={() => {
                setShowHideAddInfo(prev => !prev)
                if(showhideAddInfo)
                {
                  fetchPostList();
                }
              }}
            >
              Add
            </button>
            <button
              className='tranhapkiembutton'
              onClick={() => {
                updatePost();
              }}
            >
              Update
            </button>
            <button
              className='traxuatkiembutton'
              onClick={() => {
                deletePost();
              }}
            >
              Delete
            </button>
          </div>
        </div>
        <div className='tracuuYCSXTable'>
          {postDataTableAG}
        </div>
        {showhideAddInfo && <div className="addinfodiv">
          <AddInfo />
        </div>
        }
      </div>
    </div>
  );
};
export default PostManager;