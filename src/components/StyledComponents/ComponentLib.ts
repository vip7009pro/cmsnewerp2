import styled from "styled-components";
const size = {
  mobileS: "320px",
  mobileM: "375px",
  mobileL: "480px",
  tablet: "768px",
  laptop: "1024px",
  laptopL: "1440px",
  desktop: "2560px",
};
export const device = {
  mobileS: `(max-width: ${size.mobileS})`,
  mobileM: `(max-width: ${size.mobileM})`,
  mobileL: `(max-width: ${size.mobileL})`,
  tablet: `(max-width: ${size.tablet})`,
  laptop: `(max-width: ${size.laptop})`,
  laptopL: `(max-width: ${size.laptopL})`,
  desktop: `(max-width: ${size.desktop})`,
  desktopL: `(max-width: ${size.desktop})`,
};
export const TotalPOManagerDiv = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 500px;
  .mininavbar {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    margin-bottom: 5px;
    margin-top: 5px;
    width: 100%;
    .mininavitem {
      padding: 5px;
      background-color: aquamarine;
      margin-left: 5px;
      border-radius: 5px;
      font-size: 0.7rem;
      padding: 5px;
      -webkit-box-shadow: 5px 5px 15px 5px rgba(0, 0, 0, 0.27);
      box-shadow: 5px 5px 10px 5px rgba(0, 0, 0, 0.27);
      &:hover {
        background-color: rgb(127, 219, 255);
        cursor: pointer;
      }
    }
  }
  .newpo {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    .batchnewpo {
      display: flex;
      flex-direction: column;
      gap: 10px;
      width: 100%;
      box-sizing: border-box;
      align-items: center;
      justify-items: center;
      .formupload {
        display: flex;
        gap: 20px;
        width: 100%;
        align-items: center;
        justify-content: center;
        background-image: linear-gradient(0deg, #afd3d1, #86cfff);
        padding-top: 10px;
        padding-bottom: 10px;
        margin-left: 20px;
        margin-right: 20px;
        border-radius: 5px;
        .checkpobutton {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 80px;
          height: 15px;
          background-color: #99f86d;
          outline: none;
          border: none;
          padding: 5px;
          border-radius: 5px;
          -webkit-box-shadow: 5px 5px 15px 5px rgba(0, 0, 0, 0.27);
          box-shadow: 5px 5px 15px 5px rgba(0, 0, 0, 0.27);
          &:hover {
            background-color: rgb(127, 219, 255);
            cursor: pointer;
          }
        }
        .uppobutton {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 80px;
          height: 15px;
          background-color: #ee1010;
          color: white;
          outline: none;
          border: none;
          padding: 5px;
          border-radius: 5px;
          -webkit-box-shadow: 5px 5px 15px 5px rgba(0, 0, 0, 0.27);
          box-shadow: 5px 5px 15px 5px rgba(0, 0, 0, 0.27);
          &:hover {
            background-color: rgb(127, 219, 255);
            cursor: pointer;
          }
        }
      }
      .insertPOTable {
        display: flex;
        box-sizing: border-box;
        height: 80vh;
        width: 100%;
        margin-top: 10px;
        background-image: linear-gradient(0deg, #afd3d1, #a0d898);
        border-radius: 5px;
        .datatb {
          justify-items: center;
          width: 99%;
          height: 100%;
          padding: 5px;
          .dx-datagrid-rowsview
            .dx-selection.dx-row:not(.dx-row-focused):not(.dx-row-removed)
            > td {
            background-color: orange;
            color: unset;
          }
          .dx-datagrid-rowsview
            .dx-selection.dx-row:not(.dx-row-focused):not(.dx-row-removed)
            > td {
            background-color: orange;
            color: unset;
          }
          .dx-datagrid-borders > .dx-datagrid-header-panel {
            border-bottom: 0;
            background-color: #b5f398;
          }
          .dx-toolbar .dx-toolbar-items-container {
            height: 25px;
            overflow: visible;
            background-color: #b5f398;
          }
          //toan bo bang
          .dx-gridbase-container > .dx-datagrid-rowsview.dx-scrollable {
            display: -ms-flexbox;
            display: flex;
            background-image: linear-gradient(0deg, #e9e1eb, #f1f5cf);
            font-size: 0.7rem;
          }
          .dx-datagrid-borders > .dx-datagrid-filter-panel,
          .dx-datagrid-borders > .dx-datagrid-headers {
            border-top: 1px solid #ddd;
            background-image: linear-gradient(0deg, #e9e1eb, #a0f87e);
            color: black;
            font-weight: bold;
            font-size: 0.7rem;
          }
          //filter row input
          .dx-datagrid-filter-row
            .dx-editor-cell
            .dx-editor-with-menu
            .dx-placeholder::before,
          .dx-datagrid-filter-row
            .dx-editor-cell
            .dx-editor-with-menu
            .dx-texteditor-input {
            padding-left: 32px;
            background-image: linear-gradient(0deg, #e9e1eb, #a0f87e);
            color: black;
            height: 10px;
          }
          .dx-editor-cell .dx-texteditor,
          .dx-editor-cell .dx-texteditor .dx-texteditor-input {
            background-image: linear-gradient(0deg, #e9e1eb, #a0f87e);
          }
          .dx-searchbox .dx-placeholder::before,
          .dx-searchbox .dx-texteditor-input {
            padding-left: 34px;
            background-image: linear-gradient(0deg, #e9e1eb, #d7f0cd);
          }
          .dx-button-mode-contained {
            background-color: #a0f87e;
            border-color: #cacafa;
            color: #430fff;
          }
          .dx-datagrid-total-footer > .dx-datagrid-content {
            padding-top: 0px;
            padding-bottom: 0px;
          }
        }
      }
    }
  }
  .tracuuPO {
    width: 100%;
    display: flex;
    gap: 10px;
    .tracuuPOform {
      display: flex;
      width: 260px;
      height: 85vh;
      flex-direction: column;
      align-items: flex-end;
      font-size: 0.8rem;
      background-image: linear-gradient(0deg, #afd3d1, #54ca45);
      -webkit-box-shadow: 5px 5px 15px 5px rgba(0, 0, 0, 0.27);
      box-shadow: 5px 5px 15px 5px rgba(0, 0, 0, 0.27);
      border-radius: 8px;
      padding: 5px;
      span {
        padding: 10px;
        font-size: 20px;
        margin: auto;
      }
      box-sizing: border-box;
      .forminput {
        display: flex;
        flex-direction: column;
        width: 100%;
        gap: 5px;
        flex-wrap: wrap;
        align-items: flex-end;
        justify-content: space-around;
        padding: 2px;
        font-size: 0.6rem;
        .forminputcolumn {
          display: flex;
          flex-direction: column;
          gap: 10px;
          align-items: flex-end;
          justify-content: flex-end;
          flex-wrap: wrap;
          input {
            width: 125px;
            height: 15px;
            font-size: 0.6rem;
            outline: none;
            border-radius: 5px;
            border: none;
            padding: 5px;
            margin-left: 5px;
            background-image: linear-gradient(0deg, #ececec, #9dee95);
          }
        }
      }
      .formbutton {
        display: flex;
        flex-direction: column;
        font-size: 0.6rem;
        .checkboxdiv {
          display: flex;
          flex-direction: row;
          align-items: center;
          align-self: center;
          align-content: center;
          justify-content: center;
          justify-items: center;
          justify-self: center;
          font-size: 0.6rem;
        }
        .searchbuttondiv {
        }
      }
      .formsummary {
        display: flex;
        flex-direction: row;
        background-image: linear-gradient(0deg, #ececec, #99f86d);
        -webkit-box-shadow: 5px 5px 15px 5px rgba(0, 0, 0, 0.27);
        box-shadow: 5px 5px 15px 5px rgba(0, 0, 0, 0.27);
        gap: 20px;
        border-radius: 5px;
        margin-top: 5px;
        table {
          border: 3px solid gray;
          width: 100%;
        }
        table thead tr td {
          font-weight: bold;
          border: 1px solid gray;
          padding-left: 10px;
          padding-right: 10px;
        }
        table tbody tr td {
          border: 1px solid gray;
        }
      }
    }
    .tracuuPOTable {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
      height: 85vh;
      background-image: linear-gradient(0deg, #afd3d1, #6dd1f8);
      border-radius: 5px;
      .formsummary {
        display: flex;
        flex: 1;
        flex-direction: row;
        background-image: linear-gradient(0deg, #ececec, #99f86d);
        -webkit-box-shadow: 5px 5px 15px 5px rgba(0, 0, 0, 0.27);
        box-shadow: 5px 5px 15px 5px rgba(0, 0, 0, 0.27);
        gap: 20px;
        border-radius: 5px;
        margin-top: 5px;
        table {
          border: 3px solid gray;
          width: fit-content;
          align-items: center;
        }
        table thead tr td {
          font-weight: bold;
          border: 1px solid gray;
          padding-left: 10px;
          padding-right: 10px;
          font-size: 0.8rem;
          text-align: center;
        }
        table tbody tr td {
          border: 1px solid gray;
          font-size: 0.8rem;
          text-align: center;
        }
      }
      .tablegrid {
        display: flex;
        flex: 20;
        height: 100%;
        width: 100%;
        background-image: linear-gradient(0deg, #afd3d1, #6dd1f8);
        -webkit-box-shadow: 5px 5px 15px 5px rgba(0, 0, 0, 0.27);
        box-shadow: 5px 5px 15px 5px rgba(0, 0, 0, 0.27);
        border-radius: 5px;
        .datatb {
          justify-items: center;
          width: 99%;
          height: 100%;
          padding: 5px;
          .dx-datagrid-rowsview
            .dx-selection.dx-row:not(.dx-row-focused):not(.dx-row-removed)
            > td {
            background-color: orange;
            color: unset;
          }
          .dx-datagrid-borders > .dx-datagrid-header-panel {
            border-bottom: 0;
            background-color: #b5f398;
          }
          .dx-toolbar .dx-toolbar-items-container {
            height: 25px;
            overflow: visible;
            background-color: #b5f398;
          }
          //toan bo bang
          .dx-gridbase-container > .dx-datagrid-rowsview.dx-scrollable {
            display: -ms-flexbox;
            display: flex;
            background-image: linear-gradient(0deg, #e9e1eb, #f1f5cf);
            font-size: 0.7rem;
          }
          .dx-datagrid-borders > .dx-datagrid-filter-panel,
          .dx-datagrid-borders > .dx-datagrid-headers {
            border-top: 1px solid #ddd;
            background-image: linear-gradient(0deg, #e9e1eb, #a0f87e);
            color: black;
            font-weight: bold;
            font-size: 0.7rem;
          }
          //filter row input
          .dx-datagrid-filter-row
            .dx-editor-cell
            .dx-editor-with-menu
            .dx-placeholder::before,
          .dx-datagrid-filter-row
            .dx-editor-cell
            .dx-editor-with-menu
            .dx-texteditor-input {
            padding-left: 32px;
            background-image: linear-gradient(0deg, #e9e1eb, #a0f87e);
            color: black;
            height: 10px;
          }
          .dx-editor-cell .dx-texteditor,
          .dx-editor-cell .dx-texteditor .dx-texteditor-input {
            background-image: linear-gradient(0deg, #e9e1eb, #a0f87e);
          }
          .dx-searchbox .dx-placeholder::before,
          .dx-searchbox .dx-texteditor-input {
            padding-left: 34px;
            background-image: linear-gradient(0deg, #e9e1eb, #d7f0cd);
          }
          .dx-button-mode-contained {
            background-color: #a0f87e;
            border-color: #cacafa;
            color: #430fff;
          }
          .dx-datagrid-total-footer > .dx-datagrid-content {
            padding-top: 0px;
            padding-bottom: 0px;
          }
        }
      }
    }
  }
  .them1po {
    display: flex;
    position: fixed;
    top: 35vh;
    left: 60vh;
    z-index: 99;
    .formnho {
      display: flex;
      flex-direction: column;
      flex: 1;
      height: fit-content;
      flex-wrap: wrap;
      background-image: linear-gradient(0deg, #9fc2eb, #42e9ff);
      border-radius: 5px;
      box-shadow: 19px 15px 27px 0px rgba(0, 0, 0, 0.18);
      -webkit-box-shadow: 19px 15px 27px 0px rgba(0, 0, 0, 0.18);
      -moz-box-shadow: 19px 15px 27px 0px rgba(0, 0, 0, 0.18);
      padding-right: 30px;
      h3 {
        align-self: center;
        padding: 10px;
      }
      .maindept_table {
        align-items: center;
        justify-content: center;
        justify-self: center;
        padding: 20px;
        width: 97%;
        border-radius: 5px;
        height: 40vh;
        margin-left: 10px;
        align-self: center;
        background-image: linear-gradient(0deg, #afd3d1, #7fca98);
      }
      .dangkyform {
        display: flex;
        flex-direction: column;
        margin-bottom: 10px;
        gap: 10px;
        align-items: center;
        justify-content: space-around;
        padding: 20px;
        height: fit-content;
        .dangkyinput {
          display: flex;
          flex-direction: row;
          gap: 20px;
          align-items: center;
          justify-content: space-around;
          justify-self: center;
          width: 100%;
          .maindeptinputlabel {
            display: flex;
          }
          .dangkyinputbox {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            gap: 10px;
            .autocomplete {
              width: 320px;
              margin-left: 20px;
            }
            select {
              width: 200px;
              height: 24px;
            }
            .inputdata {
              padding-left: 5px;
              margin-left: 2px;
              width: 310px;
              height: 35px;
              background-color: transparent;
              outline: none;
              border: solid 0.5px;
              border-color: rgba(0, 0, 0, 0.3);
              border-radius: 5px;
              font-size: 16px;
              margin-left: 20px;
              color: black;
            }
            label {
              display: flex;
              flex-direction: row;
              align-items: flex-end;
            }
          }
        }
        .dangkybutton {
          display: flex;
          gap: 10px;
          align-items: center;
          justify-content: space-between;
          .thembutton {
            background-color: #21a73e;
            /* Green */
            border: none;
            color: white;
            padding: 15px 32px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 16px;
            border-radius: 5px;
            outline: none;
            box-shadow: 19px 15px 27px 0px rgba(0, 0, 0, 0.18);
            -webkit-box-shadow: 19px 15px 27px 0px rgba(0, 0, 0, 0.18);
            -moz-box-shadow: 19px 15px 27px 0px rgba(0, 0, 0, 0.18);
            &:hover {
              background-color: #22fd7e;
            }
          }
          .suabutton {
            background-color: #ddff19;
            /* Green */
            border: none;
            color: rgb(7, 32, 255);
            padding: 15px 32px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 16px;
            border-radius: 5px;
            outline: none;
            box-shadow: 19px 15px 27px 0px rgba(0, 0, 0, 0.18);
            -webkit-box-shadow: 19px 15px 27px 0px rgba(0, 0, 0, 0.18);
            -moz-box-shadow: 19px 15px 27px 0px rgba(0, 0, 0, 0.18);
            &:hover {
              background-color: #22fd7e;
            }
          }
          .closebutton {
            background-color: #be19ff;
            /* Green */
            border: none;
            color: rgb(255, 255, 255);
            padding: 15px 32px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 16px;
            border-radius: 5px;
            outline: none;
            box-shadow: 19px 15px 27px 0px rgba(0, 0, 0, 0.18);
            -webkit-box-shadow: 19px 15px 27px 0px rgba(0, 0, 0, 0.18);
            -moz-box-shadow: 19px 15px 27px 0px rgba(0, 0, 0, 0.18);
            &:hover {
              background-color: #22fd7e;
            }
          }
          .xoabutton {
            background-color: #3633f7;
            /* Green */
            border: none;
            color: rgb(194, 255, 28);
            padding: 15px 32px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 16px;
            border-radius: 5px;
            outline: none;
            box-shadow: 19px 15px 27px 0px rgba(0, 0, 0, 0.18);
            -webkit-box-shadow: 19px 15px 27px 0px rgba(0, 0, 0, 0.18);
            -moz-box-shadow: 19px 15px 27px 0px rgba(0, 0, 0, 0.18);
            &:hover {
              background-color: #dde020;
              color: #35a9f7;
            }
          }
        }
      }
    }
  }
  .them1invoice {
    display: flex;
    position: fixed;
    top: 35vh;
    left: 60vh;
    .formnho {
      display: flex;
      flex-direction: column;
      flex: 1;
      height: fit-content;
      flex-wrap: wrap;
      background-image: linear-gradient(0deg, #bbc7d4, #8880f5);
      border-radius: 5px;
      box-shadow: 19px 15px 27px 0px rgba(0, 0, 0, 0.18);
      -webkit-box-shadow: 19px 15px 27px 0px rgba(0, 0, 0, 0.18);
      -moz-box-shadow: 19px 15px 27px 0px rgba(0, 0, 0, 0.18);
      padding-right: 30px;
      h3 {
        align-self: center;
        padding: 10px;
      }
      .maindept_table {
        align-items: center;
        justify-content: center;
        justify-self: center;
        padding: 20px;
        width: 97%;
        border-radius: 5px;
        height: 40vh;
        margin-left: 10px;
        align-self: center;
        background-image: linear-gradient(0deg, #afd3d1, #7fca98);
      }
      .dangkyform {
        display: flex;
        flex-direction: column;
        margin-bottom: 10px;
        gap: 10px;
        align-items: center;
        justify-content: space-around;
        padding: 20px;
        height: fit-content;
        .dangkyinput {
          display: flex;
          flex-direction: row;
          gap: 20px;
          align-items: center;
          justify-content: space-around;
          justify-self: center;
          width: 100%;
          .maindeptinputlabel {
            display: flex;
          }
          .dangkyinputbox {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            gap: 10px;
            .autocomplete {
              width: 320px;
              margin-left: 20px;
            }
            select {
              width: 200px;
              height: 24px;
            }
            .inputdata {
              padding-left: 5px;
              margin-left: 2px;
              width: 310px;
              height: 35px;
              background-color: transparent;
              outline: none;
              border: solid 0.5px;
              border-color: rgba(0, 0, 0, 0.3);
              border-radius: 5px;
              font-size: 16px;
              margin-left: 20px;
              color: black;
            }
            label {
              display: flex;
              flex-direction: row;
              align-items: flex-end;
            }
          }
        }
        .dangkybutton {
          display: flex;
          gap: 10px;
          align-items: center;
          justify-content: space-between;
          .thembutton {
            background-color: #21a73e;
            /* Green */
            border: none;
            color: white;
            padding: 15px 32px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 16px;
            border-radius: 5px;
            outline: none;
            box-shadow: 19px 15px 27px 0px rgba(0, 0, 0, 0.18);
            -webkit-box-shadow: 19px 15px 27px 0px rgba(0, 0, 0, 0.18);
            -moz-box-shadow: 19px 15px 27px 0px rgba(0, 0, 0, 0.18);
            &:hover {
              background-color: #22fd7e;
            }
          }
          .suabutton {
            background-color: #ddff19;
            /* Green */
            border: none;
            color: rgb(7, 32, 255);
            padding: 15px 32px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 16px;
            border-radius: 5px;
            outline: none;
            box-shadow: 19px 15px 27px 0px rgba(0, 0, 0, 0.18);
            -webkit-box-shadow: 19px 15px 27px 0px rgba(0, 0, 0, 0.18);
            -moz-box-shadow: 19px 15px 27px 0px rgba(0, 0, 0, 0.18);
            &:hover {
              background-color: #22fd7e;
            }
          }
          .closebutton {
            background-color: #be19ff;
            /* Green */
            border: none;
            color: rgb(255, 255, 255);
            padding: 15px 32px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 16px;
            border-radius: 5px;
            outline: none;
            box-shadow: 19px 15px 27px 0px rgba(0, 0, 0, 0.18);
            -webkit-box-shadow: 19px 15px 27px 0px rgba(0, 0, 0, 0.18);
            -moz-box-shadow: 19px 15px 27px 0px rgba(0, 0, 0, 0.18);
            &:hover {
              background-color: #22fd7e;
            }
          }
          .xoabutton {
            background-color: #3633f7;
            /* Green */
            border: none;
            color: rgb(194, 255, 28);
            padding: 15px 32px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 16px;
            border-radius: 5px;
            outline: none;
            box-shadow: 19px 15px 27px 0px rgba(0, 0, 0, 0.18);
            -webkit-box-shadow: 19px 15px 27px 0px rgba(0, 0, 0, 0.18);
            -moz-box-shadow: 19px 15px 27px 0px rgba(0, 0, 0, 0.18);
            &:hover {
              background-color: #dde020;
              color: #35a9f7;
            }
          }
        }
      }
    }
  }
  .pivottable1 {
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    position: absolute;
    top: 1vh;
    left: 1%;
    width: 95%;
    height: 85vh;
    overflow: scroll;
    padding: 10px;
    border-radius: 5px;
    background-image: linear-gradient(0deg, #afd3d1, #86cfff);
    -webkit-box-shadow: 5px 5px 15px 5px rgba(0, 0, 0, 0.27);
    box-shadow: 5px 5px 10px 5px rgba(0, 0, 0, 0.27);
    z-index: 100;
    * {
      font-size: 0.7rem;
    }
  }
`;
export const POManagerDiv = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 500px;
`;
export const MiniNavBarDiv = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-bottom: 5px;
  margin-top: 5px;
  width: 100%;
`;
export const NewPoDiv = styled.div`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
`;
export const TraCuuPODiv = styled.div`
  width: 100%;
  display: flex;
  gap: 10px;
`;
export const BatchNewPODiv = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  box-sizing: border-box;
  align-items: center;
  justify-items: center;
`;
export const FormUploadDiv = styled.div`
  display: flex;
  gap: 20px;
  width: 100%;
  align-items: center;
  justify-content: center;
  background-image: linear-gradient(0deg, #afd3d1, #86cfff);
  padding-top: 10px;
  padding-bottom: 10px;
  margin-left: 20px;
  margin-right: 20px;
  border-radius: 5px;
`;
export const CheckPoButtonDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 15px;
  background-color: #99f86d;
  outline: none;
  border: none;
  padding: 5px;
  border-radius: 5px;
  -webkit-box-shadow: 5px 5px 15px 5px rgba(0, 0, 0, 0.27);
  box-shadow: 5px 5px 15px 5px rgba(0, 0, 0, 0.27);
  &:hover {
    background-color: rgb(127, 219, 255);
    cursor: pointer;
  }
`;
export const InserPOTableDiv = styled.div`
  display: flex;
  box-sizing: border-box;
  height: 80vh;
  width: 100%;
  margin-top: 10px;
  background-image: linear-gradient(0deg, #afd3d1, #a0d898);
  border-radius: 5px;
`;
export const DataTBDiv = styled.div`
  justify-items: center;
  width: 100%;
  height: 100%;
  margin-bottom: 0;
  -webkit-box-shadow: 5px 5px 15px 5px rgba(0, 0, 0, 0.27);
  box-shadow: 5px 5px 15px 5px rgba(0, 0, 0, 0.27); 
  .dx-datagrid-rowsview
    .dx-selection.dx-row:not(.dx-row-focused):not(.dx-row-removed)
    > td {
    background-color: orange;
    color: unset;
  }
  .dx-datagrid-rowsview
    .dx-selection.dx-row:not(.dx-row-focused):not(.dx-row-removed)
    > td {
    background-color: orange;
    color: unset;
  }
  .dx-datagrid-borders > .dx-datagrid-header-panel {
    border-bottom: 0;
    background-color: #b5f398;
  }
  .dx-toolbar .dx-toolbar-items-container {
    height: 25px;
    overflow: visible;
    background-color: #b5f398;
  }
  //toan bo bang
  .dx-gridbase-container > .dx-datagrid-rowsview.dx-scrollable {
    display: -ms-flexbox;
    display: flex;
    background-image: linear-gradient(0deg, #e9e1eb, #f1f5cf);
    font-size: 0.7rem;
  }
  .dx-datagrid-borders > .dx-datagrid-filter-panel,
  .dx-datagrid-borders > .dx-datagrid-headers {
    border-top: 1px solid #ddd;
    background-image: linear-gradient(0deg, #e9e1eb, #a0f87e);
    color: black;
    font-weight: bold;
    font-size: 0.7rem;
  }
  //filter row input
  .dx-datagrid-filter-row
    .dx-editor-cell
    .dx-editor-with-menu
    .dx-placeholder::before,
  .dx-datagrid-filter-row
    .dx-editor-cell
    .dx-editor-with-menu
    .dx-texteditor-input {
    padding-left: 32px;
    background-image: linear-gradient(0deg, #e9e1eb, #a0f87e);
    color: black;
    height: 10px;
  }
  .dx-editor-cell .dx-texteditor,
  .dx-editor-cell .dx-texteditor .dx-texteditor-input {
    background-image: linear-gradient(0deg, #e9e1eb, #a0f87e);
  }
  .dx-searchbox .dx-placeholder::before,
  .dx-searchbox .dx-texteditor-input {
    padding-left: 34px;
    background-image: linear-gradient(0deg, #e9e1eb, #d7f0cd);
  }
  .dx-button-mode-contained {
    background-color: #a0f87e;
    border-color: #cacafa;
    color: #430fff;
  }
  .dx-datagrid-total-footer > .dx-datagrid-content {
    padding-top: 0px;
    padding-bottom: 0px;
  }
`;
export const PivotTableDiv = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  position: absolute;
  top: 1vh;
  left: 1%;
  width: 95%;
  height: 85vh;
  overflow: scroll;
  padding: 10px;
  border-radius: 5px;
  background-image: linear-gradient(0deg, #afd3d1, #86cfff);
  -webkit-box-shadow: 5px 5px 15px 5px rgba(0, 0, 0, 0.27);
  box-shadow: 5px 5px 10px 5px rgba(0, 0, 0, 0.27);
  z-index: 100;
  * {
    font-size: 0.7rem;
  }
`;
export const DataDiv = styled.div`  
  @media ${device.desktop} {
    width: 100%;
    height: 92vh;
    display: flex;
    gap: 5px;
  }
  @media ${device.mobileL} {
    width: 100%;
    height: 88vh;
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
  @media ${device.desktop} {
  }
  @media ${device.mobileL} {
  }
`;
export const NNDSDiv = styled.div`  
  @media ${device.desktop} {
    display: flex;
      position: absolute;
      z-index:99;
      padding: 10px;
      align-items: center;
      flex-direction: column;
      border-radius: 5px;
      top: 15%;
      left: 40%;
      width: 500px;
      height: fit-content;      
      background-image: linear-gradient(0deg, #d3d2af, #86ffa4);
        -webkit-box-shadow: 5px 5px 15px 5px rgba(0, 0, 0, 0.27);
        box-shadow: 5px 5px 15px 5px rgba(0, 0, 0, 0.27);
        .inputbox {
          display: flex;
          width: 100%;
          padding: 10px;
          flex-direction: column;
          align-items: flex-start;
          justify-content: flex-start;
        }
  }
  @media ${device.mobileL} {
    display: flex;
      position: absolute;
      padding: 10px;
      z-index:99;
      align-items: center;
      flex-direction: column;
      border-radius: 5px;
      top: -5%;
      left: 40%;
      width: 500px;
      height: fit-content;      
      background-image: linear-gradient(0deg, #d3d2af, #86ffa4);
        -webkit-box-shadow: 5px 5px 15px 5px rgba(0, 0, 0, 0.27);
        box-shadow: 5px 5px 15px 5px rgba(0, 0, 0, 0.27);
        .inputbox {
          display: flex;
          width: 100%;
          padding: 10px;
          flex-direction: column;
          align-items: flex-start;
          justify-content: flex-start;
        }
  }
  @media ${device.desktop} {
  }
  @media ${device.mobileL} {
  }
`;
export const QueryFormDiv = styled.div`
  @media ${device.desktop} {
    display: flex;
    flex-direction: column;
    width: 280px;
    align-items: center;
    background-image: linear-gradient(0deg, #afd3d1, #86cfff);
    -webkit-box-shadow: 5px 5px 15px 5px rgba(0, 0, 0, 0.27);
    box-shadow: 5px 5px 15px 5px rgba(0, 0, 0, 0.27);
    border-radius: 3px;
    padding: 5px;
    font-size: 0.8rem;
    span {
      padding: 10px;
      font-size: 20px;
      margin: auto;
    }
  }
  @media ${device.mobileL} {
    display: flex;
    flex-direction: column;
    width: 100%;
    align-items: center;
    background-image: linear-gradient(0deg, #afd3d1, #86cfff);
    -webkit-box-shadow: 5px 5px 15px 5px rgba(0, 0, 0, 0.27);
    box-shadow: 5px 5px 15px 5px rgba(0, 0, 0, 0.27);
    border-radius: 3px;
    padding: 5px;
    font-size: 0.8rem;
    span {
      padding: 10px;
      font-size: 20px;
      margin: auto;
    }
  }
`;
export const FromInputDiv = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 5px;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-around;
  padding: 2px;
  font-size: 0.6rem;
`;
export const FormInputDiv = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 5px;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-around;
  padding: 2px;
  font-size: 0.8rem;
  input {
    width: 150px;
    height: 15px;
    font-size: 0.6rem;
    outline: none;
    border-radius: 5px;
    border: none;
    padding: 5px;
    margin-left: 5px;
    background-image: linear-gradient(0deg, #ececec, #9dee95);  
  }
`;
export const FromInputColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  align-items: flex-end;
  justify-content: center;
  flex-wrap: wrap;
  input {
    width: 150px;
    height: 15px;
    font-size: 0.6rem;
    outline: none;
    border-radius: 5px;
    border: none;
    padding: 5px;
    margin-left: 5px;
    background-image: linear-gradient(0deg, #ececec, #9dee95);
  }
  select {
    width: 160px;
    height: 25px;
    font-size: 0.6rem;
    outline: none;
    border-radius: 5px;
    border: none;
    padding: 5px;
    margin-left: 5px;
    background-image: linear-gradient(0deg, #ececec, #9dee95);
  }
  .autocomplete {
    background-color: rgba(255, 255, 255, 0);
    position: relative;
    * {
      font-size: 0.8rem;
      background-color: rgba(255, 255, 255, 0);
      margin: 0;
      padding: 1.5px;
    }
    input {
      background-color: white;
      z-index: 1;
      height: 23px;
      width: 150px;
    }
  }
`;
export const FormButtonColumn = styled.div`
  display: flex;  
  flex-direction: column;
  align-items: center;
  font-size: 0.6rem;
  gap: 20px;
`;
export const FormInputDiv2 = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;  
  gap: 10px;
`;