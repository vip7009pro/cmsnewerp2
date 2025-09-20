import React from "react";
import "./PhieuLuongBang.scss";

type ChiTietLuong = {
  noi_dung: string;
  don_vi_tinh?: string;
  so_tien: number | string;
  ghi_chu?: string;
};

export type PhieuLuong = {
  ten_nhan_vien: string;
  bo_phan: string;
  ngan_hang: string;
  thang: string;
  chi_tiet: ChiTietLuong[];
  cac_khoan_giam_tru: ChiTietLuong[];
  tong_luong_thang: number;
};

/* const data: PhieuLuong = {
  ten_nhan_vien: "Nguyễn Văn Hùng3",
  bo_phan: "QC(품질)_NM1.B",
  ngan_hang: "Vietin bank",
  thang: "7.2025",
  chi_tiet: [
    { noi_dung: "Lương cơ bản", don_vi_tinh: "VND", so_tien: 30705000 },
    { noi_dung: "PC Trách nhiệm", don_vi_tinh: "VND", so_tien: 0 },
    { noi_dung: "Phụ cấp ngoại ngữ chuyên môn", don_vi_tinh: "VND", so_tien: 650000 },
    { noi_dung: "Phụ cấp chức vụ", don_vi_tinh: "VND", so_tien: 0 },
    { noi_dung: "Trợ cấp đánh giá", don_vi_tinh: "VND", so_tien: 1174500 },
    { noi_dung: "Phụ cấp nguy hiểm độc hại", don_vi_tinh: "VND", so_tien: 0 },
    { noi_dung: "Trợ cấp xe nâng xe tải", don_vi_tinh: "VND", so_tien: 0 },
    { noi_dung: "Phụ cấp XRay, PCCC, VSV", don_vi_tinh: "VND", so_tien: 0 },

    { noi_dung: "Ngày công/Tháng", don_vi_tinh: "Ngày", so_tien: 27 },
    { noi_dung: "Lương thực tế theo ngày công", don_vi_tinh: "VND", so_tien: 33780635 },
    { noi_dung: "Tiền cơm (35k)", don_vi_tinh: "VND", so_tien: 910000 },
    { noi_dung: "Trợ cấp điện thoại", don_vi_tinh: "VND", so_tien: 350000 },
    { noi_dung: "Chuyên cần", don_vi_tinh: "VND", so_tien: 200000 },
    { noi_dung: "Phụ cấp đi lại", don_vi_tinh: "VND", so_tien: 350000 },

    { noi_dung: "Thời gian 50% - luân phiên", don_vi_tinh: "Phút", so_tien: 0 },
    { noi_dung: "Làm 100%", don_vi_tinh: "Phút", so_tien: 0 },
    { noi_dung: "Làm ban đêm 130%", don_vi_tinh: "Phút", so_tien: 120 },
    { noi_dung: "Làm thêm giờ 150%", don_vi_tinh: "Phút", so_tien: 0 },
    { noi_dung: "Làm thêm giờ 210%", don_vi_tinh: "Phút", so_tien: 0 },
    { noi_dung: "Làm thêm giờ 200%", don_vi_tinh: "Phút", so_tien: 0 },
    { noi_dung: "Làm thêm giờ 300%", don_vi_tinh: "Phút", so_tien: 0 },
    { noi_dung: "Làm thêm giờ 270%", don_vi_tinh: "Phút", so_tien: 0 },
    { noi_dung: "Làm thêm giờ 390%", don_vi_tinh: "Phút", so_tien: 0 },

    { noi_dung: "Bù Lương", don_vi_tinh: "VND", so_tien: 0 },
    { noi_dung: "Thanh toán phép", don_vi_tinh: "VND", so_tien: 0 },
    { noi_dung: "Lương thưởng 150%", don_vi_tinh: "VND", so_tien: 0 },
    { noi_dung: "Lương 100%", don_vi_tinh: "VND", so_tien: 0 },
    { noi_dung: "Lương làm thêm giờ", don_vi_tinh: "VND", so_tien: 452236 },
    { noi_dung: "Lương nghỉ luân phiên hoặc hưởng 50%", don_vi_tinh: "VND", so_tien: 0 },
    { noi_dung: "Hưởng chế độ (kết hôn, ma chay, sinh nhật con nhỏ, thâm niên)", don_vi_tinh: "VND", so_tien: 30000 },
    { noi_dung: "Trợ cấp thôi việc (TNLĐ)", don_vi_tinh: "VND", so_tien: 0 }
  ],
  cac_khoan_giam_tru: [
    { noi_dung: "Đi muộn - về sớm", don_vi_tinh: "Tiền", so_tien: 0 },
    { noi_dung: "Đóng BHXH", don_vi_tinh: "VND", so_tien: 3292275 },
    { noi_dung: "Đóng phí Công đoàn", don_vi_tinh: "VND", so_tien: 50000 },
    { noi_dung: "Thuế TNCN (cộng cả tiền thưởng)", don_vi_tinh: "VND", so_tien: 1007978 }
  ],
  tong_luong_thang: 31722618
}; */

const PhieuLuongBang = ({ data }: { data: PhieuLuong | null }) => {
  if(data?.chi_tiet[0]?.so_tien === 0) {
    return <p>Hãy nhập các thông số lương, cơ bản, lương đóng bảo hiểm .... của bạn vào các ô bên cạnh để tính</p>;
  }
  return (
    <div className="phieu-luong">
      <h2>BẢNG CHI TIẾT LƯƠNG CÔNG NHÂN VIÊN</h2>       
      <div className="thong-tin">
        <p>
          <strong>Tên nhân viên:</strong> {data?.ten_nhan_vien} <strong> _ Bộ phận:</strong> {data?.bo_phan} _ Tháng {data?.thang}
        </p>
      </div>

      <table>
        <thead>
          <tr>
            <th>Nội dung</th>
            <th>ĐVT</th>
            <th>Số tiền</th>
            <th>Ghi chú</th>
          </tr>
        </thead>
        <tbody>
          {data?.chi_tiet.map((item, idx) => (
            <tr key={idx}>
              <td>{item.noi_dung}</td>
              <td className="center">{item.don_vi_tinh || ""}</td>
              <td className="right">
                {typeof item.so_tien === "number"
                  ? item.so_tien.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })
                  : item.so_tien}
              </td>
              <td>{item.ghi_chu || ""}</td>
            </tr>
          ))}

          <tr className="section-header">
            <td colSpan={4}>Các khoản giảm trừ</td>
          </tr>

          {data?.cac_khoan_giam_tru.map((item, idx) => (
            <tr key={`giamtru-${idx}`}>
              <td>{item.noi_dung}</td>
              <td className="center">{item.don_vi_tinh || ""}</td>
              <td className="right">
                {typeof item.so_tien === "number"
                  ? item.so_tien.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })
                  : item.so_tien}
              </td>
              <td>{item.ghi_chu || ""}</td>
            </tr>
          ))}

          <tr className="tong-luong">
            <td colSpan={2} className="right">Tổng lương tháng</td>
            <td className="right">
              {data?.tong_luong_thang.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default PhieuLuongBang;
