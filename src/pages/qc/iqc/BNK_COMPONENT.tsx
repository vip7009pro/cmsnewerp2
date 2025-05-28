import React, { useEffect, useState } from "react";
import "./BNK_COMPONENT.scss";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { generalQuery, getCompany } from "../../../api/Api";
import { DTC_DATA, IQC_INCOMMING_DATA } from "../../../api/GlobalInterface";
import moment from "moment";
import Swal from "sweetalert2";
const BNK_COMPONENT = ({
  data,
  dtc_data,
}: {
  data: IQC_INCOMMING_DATA | null;
  dtc_data: DTC_DATA[] | null;
}) => {
  const cpnInfo: any = useSelector(
    (state: RootState) => state.totalSlice.cpnInfo
  );
  const company: string = useSelector(
    (state: RootState) => state.totalSlice.company
  );
  const aqlTable = [
    { MIN_ROLL_QTY: 1, MAX_ROLL_QTY: 1, TEST_QTY: 1 },
    { MIN_ROLL_QTY: 2, MAX_ROLL_QTY: 15, TEST_QTY: 2 },
    { MIN_ROLL_QTY: 16, MAX_ROLL_QTY: 25, TEST_QTY: 3 },
    { MIN_ROLL_QTY: 26, MAX_ROLL_QTY: 90, TEST_QTY: 5 },
    { MIN_ROLL_QTY: 91, MAX_ROLL_QTY: 150, TEST_QTY: 8 },
    { MIN_ROLL_QTY: 151, MAX_ROLL_QTY: 280, TEST_QTY: 13 },
    { MIN_ROLL_QTY: 281, MAX_ROLL_QTY: 500, TEST_QTY: 20 },
  ];
  console.log("data?.M_THICKNESS", data?.M_THICKNESS);
  const [m_thickness, setMThickness] = useState({
    thickness: data?.M_THICKNESS ?? 0,
    thickness_upper: data?.M_THICKNESS_UPPER ?? 0,
    thickness_lower: data?.M_THICKNESS_LOWER ?? 0,
  });
  let temp_thickness = (data?.M_THICKNESS ?? 0) <= 0;
  console.log("temp_thickness", temp_thickness);
  const [showSetThickness, setShowSetThickness] = useState(false);
  console.log("showSetThickness", showSetThickness);
  const getMThickness = () => {
    console.log("vao day");
    generalQuery("checkM_THICKNESS", { M_NAME: data?.M_NAME })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          if (response.data.data.length > 0) {
            setMThickness({
              thickness: response.data.data[0].M_THICKNESS,
              thickness_upper: response.data.data[0].M_THICKNESS_UPPER,
              thickness_lower: response.data.data[0].M_THICKNESS_LOWER,
            });
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const getTestQty = (total_roll: number) => {
    const testQty = aqlTable.find(
      (element) =>
        element.MIN_ROLL_QTY <= total_roll && element.MAX_ROLL_QTY >= total_roll
    );
    return testQty?.TEST_QTY;
  };
  useEffect(() => {
    getMThickness();
  }, []);
  return (
    <div className="material-check">
      <div className="header">
        <div className="logo">
          <img
            alt="logo"
            src={cpnInfo[getCompany()].logo}
            width={cpnInfo[getCompany()].logoWidth}
            height={cpnInfo[getCompany()].logoHeight}
          />
          <br />
        </div>
        <div className="title">BẢNG KIỂM TRA NGUYÊN VẬT LIỆU NHẬP KHO</div>
        <div className="approval">
          <table className="approval-table">
            <thead>
              <tr>
                <th>Lập</th>
                <th>Kiểm tra</th>
                <th>Phê duyệt</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ height: "30px" }}>
                <td>
                  <img src="/sign (2).jpg" alt="lap" width={60} height={30} />
                </td>
                <td>
                  <img
                    src="/sign (3).jpg"
                    alt="kiem tra"
                    width={60}
                    height={30}
                  />
                </td>
                <td>
                  <img
                    src="/sign (1).jpg"
                    alt="phe duyet"
                    width={60}
                    height={30}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <table className="info-table">
        <tr>
          <td>Tên liệu</td>
          <td>{data?.M_NAME}</td>
          <td>Nhà cung cấp</td>
          <td>{data?.CUST_NAME_KD}</td>
          <td>Ngày nhập</td>
          <td>{`20${data?.M_LOT_NO.substring(0, 2)}-${data?.M_LOT_NO.substring(
            2,
            4
          )}-${data?.M_LOT_NO.substring(4, 6)}`}</td>
        </tr>
        <tr>
          <td>Lot {getCompany()}</td>
          <td>{data?.M_LOT_NO}</td>
          <td>Chiều rộng</td>
          <td>{data?.WIDTH_CD} mm</td>
          <td>Ngày kiểm tra</td>
          <td>{moment(data?.INS_DATE).utc().format("YYYY-MM-DD")}</td>
        </tr>
        <tr>
          <td>Lot Vendor</td>
          <td>{data?.LOT_VENDOR_IQC}</td>
          <td>Số lượng</td>
          <td>{data?.TOTAL_ROLL} roll</td>
          <td>Người kiểm tra</td>
          <td colSpan={3}>{data?.TEST_EMPL}</td>
        </tr>
      </table>
      <table className="main-table">
        <thead>
          <tr>
            <th rowSpan={2}>Hạng mục kiểm tra</th>
            <th colSpan={5}>Ngoại quan</th>
            <th colSpan={8}>Độ tin cậy</th>
          </tr>
          <tr>
            <th>Màu sắc</th>
            <th>Chấm</th>
            <th>Xước</th>
            <th>Nhăn/Hằn</th>
            <th>Lồi lõm</th>
            <th>Chiều rộng (mm)</th>
            <th>Độ dày (µm)</th>
            <th>RoHS (XRF)</th>
            <th>Kéo keo (gf)</th>
            <th>Lực bóc tách (gf)</th>
            <th>Điện trở (Ω)</th>
            <th>Tĩnh điện (V)</th>
            <th>FT-IR</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Test Level</td>
            <td>GI AQL(0.1)</td>
            <td>GI AQL(0.1)</td>
            <td>GI AQL(0.1)</td>
            <td>GI AQL(0.1)</td>
            <td>GI AQL(0.1)</td>
            <td>1 mẫu/Lot</td>
            <td>1 mẫu/Lot</td>
            <td>1 mẫu/Lot</td>
            <td>5 mẫu/Lot</td>
            <td>3 mẫu/Lot</td>
            <td>1 mẫu/Lot</td>
            <td>1 mẫu/Lot</td>
            <td>1 mẫu/Lot</td>
          </tr>
          <tr>
            <td>Sample QTY</td>
            <td>{getTestQty(data?.TOTAL_ROLL ?? 0)}</td>
            <td>{getTestQty(data?.TOTAL_ROLL ?? 0)}</td>
            <td>{getTestQty(data?.TOTAL_ROLL ?? 0)}</td>
            <td>{getTestQty(data?.TOTAL_ROLL ?? 0)}</td>
            <td>{getTestQty(data?.TOTAL_ROLL ?? 0)}</td>
            <td>1</td>
            <td>1</td>
            <td>1</td>
            <td>5</td>
            <td>3</td>
            <td>1</td>
            <td>1</td>
            <td>1</td>
          </tr>
          <tr>
            <td>Ac/Re</td>
            <td colSpan={5}>C=0</td>
            <td colSpan={8}>C=0</td>
          </tr>
        </tbody>
      </table>
      <div className="rowoftable">
        <table className="detail-table1">
          <thead>
            <tr>
              <th rowSpan={2}>Chi tiết</th>
              <th colSpan={5}>Ngoại quan</th>
              <th colSpan={2}>Độ tin cậy</th>
            </tr>
            <tr>
              <th>Màu sắc</th>
              <th>Chấm</th>
              <th>Xước</th>
              <th>Nhăn/Hằn</th>
              <th>Lồi lõm</th>
              <th>Chiều rộng (mm)</th>
              <th>Độ dày (µm)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Dụng cụ kiểm tra</td>
              <td colSpan={5}>Mắt thường/Thước đo</td>
              <td>Thước đo</td>
              <td>Máy kiểm tra độ dày</td>
            </tr>
            <tr>
              <td>Tiêu chuẩn</td>
              <td>Khớp mẫu</td>
              <td colSpan={2}>W≤0.03mm, L≤5mm</td>
              <td>Không có</td>
              <td>DS ≤ 0.3mm</td>
              <td>{data?.WIDTH_CD}</td>
              <td
                style={{
                  textAlign: "center",
                  color: m_thickness.thickness === 0 ? "red" : "",
                }}
              >
                {showSetThickness && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    <input
                      type="number"
                      style={{ width: "50px" }}
                      value={m_thickness.thickness}
                      onChange={(e) =>
                        setMThickness({
                          thickness: Number(e.target.value),
                          thickness_upper: m_thickness.thickness_upper,
                          thickness_lower: m_thickness.thickness_lower,
                        })
                      }
                    />
                    +
                    <input
                      type="number"
                      style={{ width: "50px" }}
                      value={m_thickness.thickness_upper}
                      onChange={(e) =>
                        setMThickness({
                          thickness: m_thickness.thickness,
                          thickness_upper: Number(e.target.value),
                          thickness_lower: m_thickness.thickness_lower,
                        })
                      }
                    />
                    -
                    <input
                      type="number"
                      style={{ width: "50px" }}
                      value={m_thickness.thickness_lower}
                      onChange={(e) =>
                        setMThickness({
                          thickness: m_thickness.thickness,
                          thickness_upper: m_thickness.thickness_upper,
                          thickness_lower: Number(e.target.value),
                        })
                      }
                    />
                    <button
                      onClick={() => {
                        generalQuery("updateMThickness", {
                          M_NAME: data?.M_NAME,
                          M_THICKNESS: m_thickness.thickness,
                          M_THICKNESS_UPPER: m_thickness.thickness_upper,
                          M_THICKNESS_LOWER: m_thickness.thickness_lower,
                        })
                          .then((response) => {
                            if (response.data.tk_status !== "NG") {
                              setShowSetThickness(false);
                              /* Swal.fire({
                        icon: "success",
                        title: "Cập nhật thành công",
                        showConfirmButton: false,
                        timer: 1500,
                      }); */
                            }
                          })
                          .catch((error) => {
                            console.log(error);
                          });
                        setShowSetThickness(true);
                        getMThickness();
                      }}
                    >
                      Set
                    </button>
                  </div>
                )}{" "}
                {!showSetThickness && (
                  <div
                    onClick={() => setShowSetThickness(true)}
                    style={{ textAlign: "center" }}
                  >
                    {m_thickness.thickness === -1
                      ? "N/A"
                      : m_thickness.thickness_upper ===
                        m_thickness.thickness_lower
                      ? `${m_thickness.thickness} ± ${m_thickness.thickness_upper}`
                      : `${m_thickness.thickness} + ${m_thickness.thickness_upper} - ${m_thickness.thickness_lower}`}
                  </div>
                )}
              </td>
            </tr>
            {/* Các dòng 1 đến 15 có thể thêm tại đây nếu cần */}
            {Array.from({ length: getTestQty(data?.TOTAL_ROLL ?? 0) ?? 0 }).map(
              (_, index) => (
                <tr className="result_row" key={index}>
                  <td>{index + 1}</td>
                  <td>{data?.IQC_TEST_RESULT === "OK" ? "OK" : ""}</td>
                  <td>{data?.IQC_TEST_RESULT === "OK" ? "OK" : ""}</td>
                  <td>{data?.IQC_TEST_RESULT === "OK" ? "OK" : ""}</td>
                  <td>{data?.IQC_TEST_RESULT === "OK" ? "OK" : ""}</td>
                  <td>{data?.IQC_TEST_RESULT === "OK" ? "OK" : ""}</td>
                  <td>{data?.IQC_TEST_RESULT === "OK" ? "OK" : ""}</td>
                  <td>{data?.IQC_TEST_RESULT === "OK" ? "OK" : ""}</td>
                </tr>
              )
            )}
            {Array.from({
              length: 18 - (getTestQty(data?.TOTAL_ROLL ?? 0) ?? 0),
            }).map((_, index) => (
              <tr className="result_row" key={index}>
                <td>{index + (getTestQty(data?.TOTAL_ROLL ?? 0) ?? 0)}</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            ))}
            <tr className="result_row">
              <td>KQ</td>
              <td>{data?.IQC_TEST_RESULT === "OK" ? "OK" : ""}</td>
              <td>{data?.IQC_TEST_RESULT === "OK" ? "OK" : ""}</td>
              <td>{data?.IQC_TEST_RESULT === "OK" ? "OK" : ""}</td>
              <td>{data?.IQC_TEST_RESULT === "OK" ? "OK" : ""}</td>
              <td>{data?.IQC_TEST_RESULT === "OK" ? "OK" : ""}</td>
              <td>{data?.IQC_TEST_RESULT === "OK" ? "OK" : ""}</td>
              <td>{data?.IQC_TEST_RESULT === "OK" ? "OK" : ""}</td>
            </tr>
          </tbody>
        </table>
        <table className="detail-table2">
          <thead>
            <tr>
              <th colSpan={8}>Độ tin cậy</th>
            </tr>
            <tr>
              <th>Hạng mục</th>
              <th>NO</th>
              <th>NAME</th>
              <th>CENTER</th>
              <th>LOWER</th>
              <th>UPPER</th>
              <th>RESULT</th>
              <th>JUDGE</th>
            </tr>
          </thead>
          <tbody>
            {dtc_data?.map((item: DTC_DATA, index: number) => {
              let judge_result: string =
                item.RESULT >= item.CENTER_VALUE - item.LOWER_TOR &&
                item.RESULT <= item.CENTER_VALUE + item.UPPER_TOR
                  ? "OK"
                  : "NG";
              return (
                <tr key={index}>
                  <td>{item.TEST_NAME}</td>
                  <td>{item.SAMPLE_NO}</td>
                  <td>
                    {item.TEST_NAME === "XRF"
                      ? item.POINT_NAME.slice(0, -1)
                      : item.POINT_NAME}
                  </td>
                  <td>
                    {item.CENTER_VALUE?.toLocaleString("en-US", {
                      minimumFractionDigits: 0,
                    })}
                  </td>
                  <td>
                    {item.LOWER_TOR?.toLocaleString("en-US", {
                      minimumFractionDigits: 0,
                    })}
                  </td>
                  <td>
                    {item.UPPER_TOR?.toLocaleString("en-US", {
                      minimumFractionDigits: 0,
                    })}
                  </td>
                  <td
                    style={{
                      fontWeight: "bold",
                      color: judge_result === "OK" ? "green" : "red",
                    }}
                  >
                    {item.RESULT?.toLocaleString("en-US", {
                      minimumFractionDigits: 0,
                    })}
                  </td>
                  <td
                    style={{
                      fontWeight: "bold",
                      color: judge_result === "OK" ? "green" : "red",
                    }}
                  >
                    {judge_result}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div />
      </div>
      <div className="note">Ghi chú:</div>
    </div>
  );
};
export default BNK_COMPONENT;
