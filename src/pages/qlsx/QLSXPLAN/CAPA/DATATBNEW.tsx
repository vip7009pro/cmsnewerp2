import React from "react";
import "devextreme/dist/css/dx.light.css";
import {
  Column,
  DataGrid,
  Editing,
  FilterRow,
  LoadPanel,
  Pager,
  Scrolling,
  SearchPanel,
  Selection,
} from "devextreme-react/data-grid";
import { employees } from "./employees";
function DATATBNEW() {
  const renderHeader = (data: any) => {
    return (
      <p style={{ fontWeight: "bold", fontSize: 12, color: "red" }}>
        {data.column.caption}
      </p>
    );
  };

  const calculatedCellFunction = (data: any) => {
    return data.EmployeeID + "_" + data.FullName;
  };
  return (
    <div
      className="App"
      style={{
        width: "90%",
        height: "50vh",
      }}
    >
      <DataGrid
        autoNavigateToFocusedRow={true}
        allowColumnReordering={true}
        allowColumnResizing={true}
        columnAutoWidth={false}
        cellHintEnabled={true}
        columnResizingMode={"widget"}
        showColumnLines={true}
        dataSource={employees}
        columnWidth="auto"
        keyExpr="EmployeeID"
        paging={{ enabled: true, pageIndex: 0, pageSize: 10 }}
        height={"70vh"}
        onSelectionChanged={(e) => {}}
        onRowClick={(e) => {
          console.log(e.data);
        }}
      >
        <LoadPanel enabled />
        <Scrolling
          useNative={false}
          scrollByContent={true}
          scrollByThumb={false}
          showScrollbar="onHover"
          mode="virtual"
          columnRenderingMode="virtual"
        />{" "}
        {/* or "onScroll" | "always" | "never" */}
        <Selection mode="multiple" selectAllMode="page" />
        <Editing
          allowUpdating={false}
          allowAdding={false}
          allowDeleting={false}
          mode="batch"
          confirmDelete={true}
          onChangesChange={(e) => {
            console.log(employees);
          }}
        />{" "}
        {/* 'batch' | 'cell' | 'form' | 'popup' */}
        <Pager
          showPageSizeSelector={true}
          allowedPageSizes={[5, 10, 15, 20, 100, 1000, 10000, 100000, 1000000]}
          showNavigationButtons={true}
        />
        <FilterRow visible={true} />
        <SearchPanel visible={true} />
        <Column
          dataField="EmployeeID"
          caption={"Mã Nhân Viên"}
          fixed={false}
          width={100}
        ></Column>
        <Column
          dataField="FullName"
          caption={"Tên đầy đủ"}
          fixed={false}
        ></Column>
        <Column dataField="Position" caption={"Vị trí"} fixed={false}></Column>
        <Column
          dataField="TitleOfCourtesy"
          caption={"Danh xưng"}
          fixed={false}
        ></Column>
        <Column
          dataField="BirthDate"
          caption={"Sinh nhật"}
          fixed={false}
        ></Column>
        <Column
          dataField="HireDate"
          caption={"Ngày vào"}
          fixed={false}
        ></Column>
        <Column dataField="Address" caption={"Địa chỉ"} fixed={false}></Column>
        <Column dataField="City" caption={"Thành phố"} fixed={false}></Column>
        <Column dataField="Region" caption={"Vùng"} fixed={false}></Column>
        <Column
          dataField="PostalCode"
          caption={"Mã bưu điện"}
          fixed={false}
        ></Column>
        <Column dataField="Country" caption={"Quốc gia"} fixed={false}></Column>
        <Column
          dataField="HomePhone"
          caption={"Điện thoại"}
          fixed={false}
        ></Column>
        <Column
          dataField="Extension"
          caption={"Số máy lẻ"}
          fixed={false}
        ></Column>
        <Column
          dataField="Photo"
          caption={"Link Ảnh"}
          fixed={false}
          width={200}
        >
          {" "}
        </Column>
        <Column
          dataField="Notes"
          caption={"Ghi chú"}
          fixed={false}
          width={100}
        ></Column>
        <Column
          dataField="ReportsTo"
          caption={"Báo cáo tới"}
          fixed={false}
          width={100}
        ></Column>
        <Column
          dataField="autofield"
          caption={"AUTO FIELD"}
          fixed={false}
          width={100}
          calculateCellValue={calculatedCellFunction}
        ></Column>
      </DataGrid>
    </div>
  );
}
export default DATATBNEW;
