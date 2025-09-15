import React, { useState, useEffect } from 'react';
import './YCTK.scss';
import { CodeListData, CustomerListData, YCTKData } from '../interfaces/kdInterface';
import { f_getcodelist, f_getcustomerlist, f_insert_YCTK, f_update_YCTK } from '../utils/kdUtils';
import DropdownSearch from '../../../components/MyDropDownSearch/DropdownSearch';
import Swal from 'sweetalert2';
import moment from 'moment';
interface YCTKProps {
  data?: YCTKData;
}
const sampleYCTKData: YCTKData[] = [
    {
      CTR_CD: "SHQT",
      REQ_ID: 1001,
      CUST_CD: "B40471",
      G_CODE: "KH233-0910",
      DESIGN_REQUEST_DATE: moment().format("YYYY-MM-DD"),
      ESTIMATED_PO: 5000,
      MATERIAL: "PTMWG-D0850S, cán bóng, có code",
      Coating_KhongPhu: false,
      Coating_LamiBong: true,
      Coating_OpamMo: false,
      Coating_UVBong: false,
      Coating_UVMo: false,
      LabelWidth: 50,
      LabelHeight: 30,
      Tolerance: 0.5,
      FaceOut: 1, // Ví dụ chọn 1
      FaceIn: 5,  // Ví dụ chọn 5
      TopBottomSpacing: 2,
      BetweenLabelSpacing: 3,
      LinerSpacing: 2,
      CornerRadius: 1,
      AdhesiveRemoval: true,
      HasToothCut: false,
      DieCutType: "Cut sâu",
      LabelForm: "Dạng cuộn",
      LabelFormQty: 1000,
      RollCore: "F76",
      PrintYN: "Hàng có in",
      DecalType: "Decal trong",
      ApproveType: "Có mẫu",
      SpecialRequirement: "Chống thấm nước",
      SpecialRequirementLevel: 1,
      SAMPLE_STATUS: "P",
      RND_EMPL: "Nguyễn Văn A",
      QC_EMPL: "Trần Thị B",
      KD_EMPL: "Hương",
      INS_DATE:  moment().format("YYYY-MM-DD"),
      INS_EMPL: "Lê Văn C",
      UPD_DATE:  moment().format("YYYY-MM-DD"),
      UPD_EMPL: "Lê Văn C",
      G_NAME: "KH233-0910",
      G_NAME_KD: "KH233-0910",
      CUST_NAME_KD: "KH233-0910",
      ManualCloseStatus: false,
      Co_Sx_Mau: false,
      FINAL_STATUS: "P",
    },  
];
export default function YCTK({ data}: YCTKProps) {
    const [customerList, setCustomerList] = useState<CustomerListData[]>([]);
    const [codeList, setCodeList] = useState<CodeListData[]>([]);
    const handleInsertYCTK = async () => {
      let kq: string = "NG";
      kq = await f_insert_YCTK(formData);
      if (kq === "OK") {
        Swal.fire("Thông báo", "Đã thêm mới", "success");          
      } else {
        Swal.fire("Thông báo", "Nội dung: " + kq, "error");
      }
    };
    const handleUpdateYCTK = async () => {
      let kq: string = "NG";
      kq = await f_update_YCTK(formData);
      if (kq === "OK") {
        Swal.fire("Thông báo", "Đã cập nhật", "success");
      } else {
        Swal.fire("Thông báo", "Nội dung: " + kq, "error");
      }
    };
    const getcustomerlist = async () => {
      setCustomerList(await f_getcustomerlist());
    };
    const getcodeList = async () => {
      setCodeList(await f_getcodelist(''));
    };
    useEffect(() => {
      getcustomerlist();
      getcodeList();
    }, []);
    console.log(moment(data?.DESIGN_REQUEST_DATE).format("YYYY-MM-DD"));
  const [formData, setFormData] = useState<YCTKData>(data ?? sampleYCTKData[0]);
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement> | { name: string; value: any }
  ) => {
    if ('target' in e) {
      // Trường hợp input bình thường
      const { name, value, type, checked } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    } else {
      // Trường hợp DropdownSearch
      const { name, value } = e;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  const handleCheckboxChange = (field: string, value: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  return (
    <div className='design-request-form'>
      <h2 className='form-title'>
        YÊU CẦU THIẾT KẾ <span className='form-version'>Ver.03</span>
      </h2>
      {/* Bảng thông tin */}
      <table className='info-table'>
        <tbody>
          <tr>
            <td>Khách hàng</td>
            <td>
              <DropdownSearch
                options={customerList.map((x) => ({ label: x.CUST_CD + ':' + x.CUST_NAME_KD, value: x.CUST_CD }))}
                value={formData.CUST_CD}
                onChange={(e) => {
                  handleInputChange({ name: 'CUST_CD', value: e });
                }}
                style={{ width: '180px', height: '25px', borderRadius: '5px', borderWidth: '1px', backgroundColor: 'transparent', fontSize: '0.8rem', outline: 'none', padding: '1px' }}
                itemHeight={25}
              />
            </td>
            <td>Mã PVN</td>
            <td>{formData.G_NAME_KD}</td>
            <td>Mã Khách hàng</td>
            <td>{formData.CUST_CD}</td>
          </tr>
          <tr>
            <td>Tên sản phẩm</td>
            <td colSpan={5}>
              <DropdownSearch
                options={codeList.map((x) => ({ label: x.G_CODE + ':' + x.G_NAME_KD + ':' + x.G_NAME, value: x.G_CODE }))}
                value={formData.G_CODE ?? ''}
                onChange={async (e) => {
                  console.log(e)
                  handleInputChange({ name: 'G_CODE', value: e });
                  handleInputChange({ name: 'G_NAME', value: codeList.find((x) => x.G_CODE === e)?.G_NAME ?? '' });
                  handleInputChange({ name: 'G_NAME_KD', value: codeList.find((x) => x.G_CODE === e)?.G_NAME_KD ?? '' });
                }}
                style={{ width: '580px', height: '25px', borderRadius: '5px', borderWidth: '1px', backgroundColor: 'transparent', fontSize: '0.8rem', outline: 'none', padding: '1px' }}
                itemHeight={25}
              />
            </td>
          </tr>
          <tr>
            <td>Ngày yêu cầu</td>
            <td>
              <input
                type='date'
                name='DESIGN_REQUEST_DATE'
                value={moment(formData?.DESIGN_REQUEST_DATE).format("YYYY-MM-DD")}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    DESIGN_REQUEST_DATE: moment(e.target.value).format("YYYY-MM-DD"),
                  }))
                }
                className='input-inline'
                style={{ width: '100px', height: '25px', borderRadius: '5px', borderWidth: '1px', backgroundColor: 'transparent', fontSize: '0.6rem', outline: 'none', padding: '1px' }}
              />
            </td>
            <td colSpan={2}>
              Số lượng PO dự kiến:
              <input type='number' name='ESTIMATED_PO' value={formData.ESTIMATED_PO} onChange={handleInputChange} className='input-inline' placeholder='Số lượng' />
            </td>
            <td colSpan={2}>
              <label>
                <input type='checkbox' name='POType' checked={formData.ESTIMATED_PO > 0} onChange={() => {}} />
                Theo đơn
              </label>
              <label>
                <input type='checkbox' />
                Theo tháng
              </label>
              <label>
                <input type='checkbox' />
                Theo năm
              </label>
            </td>
          </tr>
        </tbody>
      </table>
      {/* Bảng tiêu chuẩn */}
      <table className='standard-table'>
        <thead>
          <tr>
            <th>STT</th>
            <td style={{ minWidth: 180, width: 220, maxWidth: 320 }}>Hạng mục</td>
            <th colSpan={6}>Tiêu chuẩn</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>Nguyên vật liệu</td>
            <td colSpan={6}>
              <input type='text' name='MATERIAL' value={formData.MATERIAL} onChange={handleInputChange} className='input-inline' style={{ width: '100%' }} />
            </td>
          </tr>
          <tr>
            <td>2</td>
            <td>Phủ (bóng, mờ)</td>
            <td colSpan={6} className='form-group'>
              <label>
                <input type='checkbox' name='Coating_KhongPhu' checked={formData.Coating_KhongPhu} onChange={handleInputChange} />
                Không phủ
              </label>
              <label>
                <input type='checkbox' name='Coating_LamiBong' checked={formData.Coating_LamiBong} onChange={handleInputChange} />
                Lami (bóng)
              </label>
              <label>
                <input type='checkbox' name='Coating_OpamMo' checked={formData.Coating_OpamMo} onChange={handleInputChange} />
                Opam (mờ)
              </label>
              <label>
                <input type='checkbox' name='Coating_UVBong' checked={formData.Coating_UVBong} onChange={handleInputChange} />
                UV (bóng)
              </label>
              <label>
                <input type='checkbox' name='Coating_UVMo' checked={formData.Coating_UVMo} onChange={handleInputChange} />
                UV (mờ)
              </label>
            </td>
          </tr>
          <tr>
            <td>3</td>
            <td>Kích thước Tem</td>
            <td colSpan={6}>
              <input type='number' name='LabelWidth' value={formData.LabelWidth} onChange={handleInputChange} className='input-inline' placeholder='Rộng' /> ×
              <input type='number' name='LabelHeight' value={formData.LabelHeight} onChange={handleInputChange} className='input-inline' placeholder='Cao' /> (mm)
            </td>
          </tr>
          <tr>
            <td>4</td>
            <td>Dung sai cho phép</td>
            <td colSpan={6}>
              <input type='number' name='Tolerance' value={formData.Tolerance} onChange={handleInputChange} className='input-inline' placeholder='mm' />mm
            </td>
          </tr>
          <tr>
            <td>5</td>
            <td>Khoảng cách trên dưới tem</td>
            <td colSpan={6}>
              <input type='number' name='TopBottomSpacing' value={formData.TopBottomSpacing} onChange={handleInputChange} className='input-inline' placeholder='mm' />mm
              <label>
                <input
                  type='checkbox'
                  name='TopBottomSpacingOptional'
                  checked={formData.TopBottomSpacing === 0}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      TopBottomSpacing: e.target.checked ? 0 : prev.TopBottomSpacing,
                    }))
                  }
                />
                Không bắt buộc
              </label>
            </td>
          </tr>
          <tr>
            <td>6</td>
            <td>Khoảng cách giữa tem</td>
            <td colSpan={6}>
              <input type='number' name='BetweenLabelSpacing' value={formData.BetweenLabelSpacing} onChange={handleInputChange} className='input-inline' placeholder='mm' />mm
              <label>
                <input
                  type='checkbox'
                  name='BetweenLabelSpacingOptional'
                  checked={formData.BetweenLabelSpacing === 0}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      BetweenLabelSpacing: e.target.checked ? 0 : prev.BetweenLabelSpacing,
                    }))
                  }
                />
                Không bắt buộc
              </label>
            </td>
          </tr>
          <tr>
            <td>7</td>
            <td>Khoảng cách liner</td>
            <td colSpan={6}>
              <input type='number' name='LinerSpacing' value={formData.LinerSpacing} onChange={handleInputChange} className='input-inline' placeholder='mm' />mm
              <label>
                <input
                  type='checkbox'
                  name='LinerSpacingOptional'
                  checked={formData.LinerSpacing === 0}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      LinerSpacing: e.target.checked ? 0 : prev.LinerSpacing,
                    }))
                  }
                />
                Không bắt buộc
              </label>
            </td>
          </tr>
          <tr>
            <td>8</td>
            <td>Độ bo góc (R…)</td>
            <td colSpan={6}>
              <input type='number' name='CornerRadius' value={formData.CornerRadius} onChange={handleInputChange} className='input-inline' placeholder='mm' />
              <label>
                <input
                  type='checkbox'
                  name='CornerRadiusOptional'
                  checked={formData.CornerRadius === 0}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      CornerRadius: e.target.checked ? 0 : prev.CornerRadius,
                    }))
                  }
                />
                Không bắt buộc
              </label>
            </td>
          </tr>
          <tr>
            <td>9</td>
            <td>Khử keo</td>
            <td colSpan={6}>
              <label>
                <input type='checkbox' name='AdhesiveRemoval' checked={formData.AdhesiveRemoval} onChange={handleInputChange} />
                Có khử
              </label>
              <label>
                <input type='checkbox' name='AdhesiveRemoval' checked={!formData.AdhesiveRemoval} onChange={(e) => setFormData((prev) => ({ ...prev, AdhesiveRemoval: !e.target.checked }))} />
                Không khử
              </label>
            </td>
          </tr>
          <tr>
            <td>10</td>
            <td>Răng cưa</td>
            <td colSpan={6}>
              <label>
                <input type='checkbox' name='HasToothCut' checked={formData.HasToothCut} onChange={handleInputChange} />
                Có răng cưa
              </label>
              <label>
                <input type='checkbox' name='HasToothCut' checked={!formData.HasToothCut} onChange={(e) => setFormData((prev) => ({ ...prev, HasToothCut: !e.target.checked }))} />
                Không răng cưa
              </label>
            </td>
          </tr>
          <tr>
            <td>11</td>
            <td>Die cut</td>
            <td colSpan={6}>
              <label>
                <input type='checkbox' name='DieCutType' checked={formData.DieCutType === 'Cut sâu'} onChange={() => setFormData((prev) => ({ ...prev, DieCutType: 'Cut sâu' }))} />
                Cut sâu
              </label>
              <label>
                <input type='checkbox' name='DieCutType' checked={formData.DieCutType === 'Cut không sâu'} onChange={() => setFormData((prev) => ({ ...prev, DieCutType: 'Cut không sâu' }))} />
                Cut không sâu
              </label>
            </td>
          </tr>
          <tr>
            <td>12</td>
            <td>Quy cách tem</td>
            <td colSpan={6}>
              <label>
                <input type='checkbox' name='LabelForm' checked={formData.LabelForm === 'Dạng tờ'} onChange={() => setFormData((prev) => ({ ...prev, LabelForm: 'Dạng tờ' }))} />
                Dạng tờ SL:
                <input type='number' name='LabelFormQty' value={formData.LabelForm === 'Dạng tờ' ? formData.LabelFormQty : ''} onChange={handleInputChange} className='input-inline' placeholder='EA/tờ' />
              </label>
              <br />
              <label>
                <input type='checkbox' name='LabelForm' checked={formData.LabelForm === 'Dạng cuộn'} onChange={() => setFormData((prev) => ({ ...prev, LabelForm: 'Dạng cuộn' }))} />
                Dạng cuộn SL:
                <input type='number' name='LabelFormQty' value={formData.LabelForm === 'Dạng cuộn' ? formData.LabelFormQty : ''} onChange={handleInputChange} className='input-inline' placeholder='EA/cuộn' />
                , lõi giấy
                <input type='text' name='RollCore' value={formData.RollCore} onChange={handleInputChange} className='input-inline' placeholder='Fxx' />
              </label>
            </td>
          </tr>
          <tr>
            <td>13</td>
            <td>In</td>
            <td colSpan={6} className='form-group'>
              <label>
                <input type='checkbox' name='ApproveType' checked={formData.ApproveType === 'Có mẫu'} onChange={() => setFormData((prev) => ({ ...prev, ApproveType: 'Có mẫu' }))} />
                Có mẫu
              </label>
              <label>
                <input type='checkbox' name='ApproveType' checked={formData.ApproveType === 'Không mẫu'} onChange={() => setFormData((prev) => ({ ...prev, ApproveType: 'Không mẫu' }))} />
                Không mẫu
              </label>
              <label>
                <input type='checkbox' name='ApproveType' checked={formData.ApproveType === 'Khách duyệt qua ZALO'} onChange={() => setFormData((prev) => ({ ...prev, ApproveType: 'Khách duyệt qua ZALO' }))} />
                Khách duyệt qua ZALO
              </label>
              <br />
              <label>
                <input type='checkbox' name='PrintYN' checked={formData.PrintYN === 'Hàng không in'} onChange={() => setFormData((prev) => ({ ...prev, PrintYN: 'Hàng không in' }))} />
                Hàng không in
              </label>
              <label>
                <input type='checkbox' name='PrintYN' checked={formData.PrintYN === 'Hàng có in'} onChange={() => setFormData((prev) => ({ ...prev, PrintYN: 'Hàng có in' }))} />
                Hàng có in
              </label>
              <label>
                <input type='checkbox' name='DecalType' checked={formData.DecalType === 'Decal trong'} onChange={() => setFormData((prev) => ({ ...prev, DecalType: 'Decal trong' }))} />
                Decal trong
              </label>
              <label>
                <input type='checkbox' name='DecalType' checked={formData.DecalType === 'Decal Thiếc bạc'} onChange={() => setFormData((prev) => ({ ...prev, DecalType: 'Decal Thiếc bạc' }))} />
                Decal Thiếc bạc
              </label>
              <label>
                <input type='checkbox' name='DecalType' checked={formData.DecalType === 'Decal 7 màu'} onChange={() => setFormData((prev) => ({ ...prev, DecalType: 'Decal 7 màu' }))} />
                Decal 7 màu
              </label>
            </td>
          </tr>
          <tr>
            <td>14</td>
            <td>Face Out</td>
            <td colSpan={6} className='form-group face-orientation'>
              <label>
                <input type='checkbox' checked={formData.FaceOut === 1} onChange={() => handleCheckboxChange('FaceOut', 1)} />
                <span className='roll-icon'>1 <div className="rotated-text" style={{ transform: 'rotate(0deg)' }}>A</div></span>
              </label>
              <label>
                <input type='checkbox' checked={formData.FaceOut === 2} onChange={() => handleCheckboxChange('FaceOut', 2)} />
                <span className='roll-icon'>2 <div className="rotated-text" style={{ transform: 'rotate(180deg)' }}>A</div></span>
              </label>
              <label>
                <input type='checkbox' checked={formData.FaceOut === 3} onChange={() => handleCheckboxChange('FaceOut', 3)} />
                <span className='roll-icon'>3 <div className="rotated-text" style={{ transform: 'rotate(270deg)' }}>A</div></span>
              </label>
              <label>
                <input type='checkbox' checked={formData.FaceOut === 4} onChange={() => handleCheckboxChange('FaceOut', 4)} />
                <span className='roll-icon'>4 <div className="rotated-text" style={{ transform: 'rotate(90deg)' }}>A</div></span>
              </label>
            </td>
          </tr>
          <tr>
            <td>15</td>
            <td>Face In</td>
            <td colSpan={6} className='form-group face-orientation'>
              <label>
                <input type='checkbox' checked={formData.FaceIn === 5} onChange={() => handleCheckboxChange('FaceIn', 5)} />
                <span className='roll-icon'>5 <div className="rotated-text" style={{ transform: 'rotate(0deg)' }}>A</div></span>
              </label>
              <label> 
                <input type='checkbox' checked={formData.FaceIn === 6} onChange={() => handleCheckboxChange('FaceIn', 6)} />
                <span className='roll-icon'>6 <div className="rotated-text" style={{ transform: 'rotate(180deg)' }}>A</div></span>
              </label>
              <label>
                <input type='checkbox' checked={formData.FaceIn === 7} onChange={() => handleCheckboxChange('FaceIn', 7)} />
                <span className='roll-icon'>7 <div className="rotated-text" style={{ transform: 'rotate(270deg)' }}>A</div></span>
              </label>
              <label>
                <input type='checkbox' checked={formData.FaceIn === 8} onChange={() => handleCheckboxChange('FaceIn', 8)} />
                <span className='roll-icon'>8 <div className="rotated-text" style={{ transform: 'rotate(90deg)' }}>A</div></span>
              </label>
            </td>
          </tr>
          <tr>
            <td>16</td>
            <td>Yêu cầu đặc biệt</td>
            <td colSpan={6} className='text-highlight'>
              Cấp độ:<input type='number' name='SpecialRequirementLevel' value={formData.SpecialRequirementLevel} onChange={handleInputChange} className='input-inline' placeholder='Cấp độ' />
              Nội dung yêu cầu:<input type='text' name='SpecialRequirement' value={formData.SpecialRequirement} onChange={handleInputChange} className='input-inline' placeholder='Yêu cầu đặc biệt' />
            </td>
          </tr>
          <tr>
            <td>17</td>
            <td>Làm mẫu / Close Manual</td>
            <td colSpan={6}>
              Làm mẫu: <input type='checkbox' name='Co_Sx_Mau' checked={formData.Co_Sx_Mau} onChange={handleInputChange} />
              Close Manual: <input type='checkbox' name='ManualCloseStatus' checked={formData.ManualCloseStatus} onChange={handleInputChange} />
            </td>
          </tr>
        </tbody>
      </table>
      <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: 20 }}>
        <button
          onClick={() => {
            handleInsertYCTK();
          }}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Add New
        </button>
        <button
          onClick={() => {
            handleUpdateYCTK();           
          }}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Update
        </button>
      </div>
    </div>
  );
}