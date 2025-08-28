import React from 'react';
import { useState } from 'react';
import './styles.scss';

interface TodoItem {
  id: number;
  title: string;
  overdue: number;
  normal: number;
  completed: number;
}

const TestHome: React.FC = () => {
  const [todos, setTodos] = useState<TodoItem[]>([
    { id: 1, title: 'Overdue PO', overdue: 3, normal: 16, completed: 0 },
    { id: 2, title: 'Contract 요청', overdue: 0, normal: 0, completed: 1 },
    { id: 3, title: '현황사 정합성', overdue: 4, normal: 1, completed: 0 },
  ]);

  const rfqData = {
    no: 5,
    schedule: '2025-08-31 01:59',
    rfqType: 'NERP RFQ',
    supplier: '인원',
    rfqNo: '1200071334',
    qty: 1,
    dx: 'DX 1200071334 NET P514 DT1E',
  };

  return (
    <div className="app-container">
      <div className="todo-container">
        <div className="todo-header">
          <h2 className="todo-title">My To-Do</h2>
          <span className="todo-id">ECOMS00010[0]</span>
        </div>
        {todos.map((todo) => (
          <div key={todo.id} className="todo-item">
            <div className="todo-content">
              <span className="todo-icon">📋</span>
              <span className="todo-title">{todo.title}</span>
            </div>
            <div className="todo-status">
              <span className="status-overdue">⏰ {todo.overdue}</span>
              <span className="status-normal">📅 {todo.normal}</span>
              <span className="status-completed">✅ {todo.completed}</span>
            </div>
          </div>
        ))}
        <div className="rfq-container">
          <h3 className="rfq-title">RFx 진행</h3>
          <div className="rfq-status">
            <div className="status-labels">
              <span className="status-tight">🔴 Schedule is tight</span>
              <span className="status-normal">🟡 Schedule is normal</span>
              <span className="status-flexible">🟢 Schedule is flexible</span>
            </div>
            <button className="rfx-button">설비기준</button>
          </div>
          <table className="rfq-table">
            <thead>
              <tr className="table-header">
                <th className="table-cell">No</th>
                <th className="table-cell">상태</th>
                <th className="table-cell">마감 일시</th>
                <th className="table-cell">RFx 유형</th>
                <th className="table-cell">문서명</th>
                <th className="table-cell">RFx No</th>
                <th className="table-cell">차수</th>
                <th className="table-cell">RFx 명</th>
                <th className="table-cell">Q Type</th>
              </tr>
            </thead>
            <tbody>
              <tr className="table-row">
                <td className="table-cell">{rfqData.no}</td>
                <td className="table-cell">완료</td>
                <td className="table-cell">{rfqData.schedule}</td>
                <td className="table-cell">{rfqData.rfqType}</td>
                <td className="table-cell">{rfqData.supplier}</td>
                <td className="table-cell">{rfqData.rfqNo}</td>
                <td className="table-cell">{rfqData.qty}</td>
                <td className="table-cell">{rfqData.dx}</td>
                <td className="table-cell"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TestHome;