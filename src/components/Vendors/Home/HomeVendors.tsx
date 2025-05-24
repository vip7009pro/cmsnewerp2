import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';
import './HomeVendors.scss';

// Giả lập dữ liệu nhà cung cấp
interface SupplierData {
  totalTransactions: number;
  defectRate: number;
  pendingOrders: number;
  recentOrders: { id: string; product: string; quantity: number; status: string; dueDate: string }[];
}

const HomePageVendors: React.FC = () => {
  const [supplierData, setSupplierData] = useState<SupplierData | null>(null);

  // Giả lập gọi API để lấy dữ liệu
  useEffect(() => {
    const fetchData = async () => {
      const mockData: SupplierData = {
        totalTransactions: 150,
        defectRate: 2.5,
        pendingOrders: 8,
        recentOrders: [
          { id: 'ORD001', product: 'Ống thép 50mm', quantity: 200, status: 'Chưa giao', dueDate: '2025-06-01' },
          { id: 'ORD002', product: 'Tấm nhôm 2mm', quantity: 150, status: 'Chưa giao', dueDate: '2025-06-03' },
          { id: 'ORD003', product: 'Thép cuộn 5mm', quantity: 300, status: 'Đang xử lý', dueDate: '2025-06-05' },
        ],
      };
      setSupplierData(mockData);
    };
    fetchData();
  }, []);

  // Dữ liệu cho biểu đồ Pie (Recharts)
  const chartData = [
    { name: 'Đã giao', value: (supplierData?.totalTransactions ?? 0) - (supplierData?.pendingOrders ?? 0) },
    { name: 'Chưa giao', value: supplierData?.pendingOrders ?? 0 },
    { name: 'Hàng lỗi', value: supplierData?.defectRate ?? 0 },
  ];

  const COLORS = ['#4CAF50', '#FF9800', '#F44336'];

  return (
    <div className="home-container">
      <div className="content-wrapper">
        {/* Tiêu đề */}
        <h1 className="page-title">Tổng quan nhà cung cấp</h1>

        {/* Các card tổng quan */}
        <div className="overview-grid">
          <div className="card">
            <h2 className="card-title">Tổng giao dịch</h2>
            <p className="card-value blue">{supplierData?.totalTransactions ?? 0}</p>
            <p className="card-description">Tất cả giao dịch đã thực hiện</p>
          </div>
          <div className="card">
            <h2 className="card-title">Tỷ lệ hàng lỗi</h2>
            <p className="card-value red">{supplierData?.defectRate ?? 0}%</p>
            <p className="card-description">Tỷ lệ hàng lỗi trung bình</p>
          </div>
          <div className="card">
            <h2 className="card-title">Đơn hàng chưa giao</h2>
            <p className="card-value orange">{supplierData?.pendingOrders ?? 0}</p>
            <p className="card-description">Đơn hàng đang chờ xử lý</p>
          </div>
        </div>

        {/* Biểu đồ */}
        <div className="chart-container">
          <h2 className="section-title">Tổng quan giao dịch</h2>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bảng đơn hàng chưa giao */}
        <div className="table-container">
          <h2 className="section-title">Danh sách đơn hàng chưa giao</h2>
          <div className="table-wrapper">
            <table className="order-table">
              <thead>
                <tr>
                  <th>Mã đơn</th>
                  <th>Sản phẩm</th>
                  <th>Số lượng</th>
                  <th>Trạng thái</th>
                  <th>Hạn giao</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {supplierData?.recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.product}</td>
                    <td>{order.quantity}</td>
                    <td>{order.status}</td>
                    <td>{order.dueDate}</td>
                    <td>
                      <Link to={`/supplier/order/${order.id}`} className="action-link">
                        Xem chi tiết
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePageVendors;