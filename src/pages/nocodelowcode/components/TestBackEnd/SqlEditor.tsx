import React, { useState, useEffect } from "react";
import MonacoEditor from "@monaco-editor/react";
import { generalQuery } from "../../../../api/Api";
import AGTable from "../../../../components/DataTable/AGTable";

const defaultSQL = `SELECT TOP 10 * FROM YourTable`;

interface SqlTab {
  key: string;
  label: string;
  sql: string;
  result: any[];
  loading: boolean;
  error: string | null;
  color?: string;
}

const initialTabs: SqlTab[] = [
  {
    key: "tab-1",
    label: "SQL 1",
    sql: defaultSQL,
    result: [],
    loading: false,
    error: null,
  },
  {
    key: "tab-2",
    label: "SQL 2",
    sql: defaultSQL,
    result: [],
    loading: false,
    error: null,
  },
];

const COLORS = [
  "#1976d2",
  "#388e3c",
  "#fbc02d",
  "#d32f2f",
  "#7b1fa2",
  "#ff9800",
  "#0097a7",
  "#c2185b",
  "#455a64",
  "#5d4037",
];

const LOCAL_KEY = "sql_editor_tabs_v1";

const SqlEditor: React.FC = () => {
  const [fontSize, setFontSize] = useState<number>(12);
  const monacoEditorRef = React.useRef<any>(null);
  const handleFoldAll = () => {
    if (monacoEditorRef.current) {
      monacoEditorRef.current.getAction("editor.foldAll").run();
    }
  };
  const handleUnfoldAll = () => {
    if (monacoEditorRef.current) {
      monacoEditorRef.current.getAction("editor.unfoldAll").run();
    }
  };

  const [tabs, setTabs] = useState<SqlTab[]>(() => {
    try {
      const data = localStorage.getItem(LOCAL_KEY);
      if (data) return JSON.parse(data);
      return initialTabs;
    } catch {
      return initialTabs;
    }
  });
  const [activeTab, setActiveTab] = useState<string>(() => {
    try {
      const data = localStorage.getItem(LOCAL_KEY + "_active");
      if (data) return data;
      return initialTabs[0].key;
    } catch {
      return initialTabs[0].key;
    }
  });

  const currentTab = tabs.find((tab) => tab.key === activeTab)!;

  // Lưu tab vào localStorage khi tabs hoặc activeTab thay đổi
  useEffect(() => {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(tabs));
    localStorage.setItem(LOCAL_KEY + "_active", activeTab);
  }, [tabs, activeTab]);

  const handleRun = async () => {
    setTabs((prevTabs) =>
      prevTabs.map((tab) =>
        tab.key === activeTab
          ? { ...tab, loading: true, error: null, result: [] }
          : tab
      )
    );
    try {
      const response = await generalQuery("testSQL", { QUERY: currentTab.sql });
      if (response?.data?.tk_status === "NG") {
        setTabs((prevTabs) =>
          prevTabs.map((tab) =>
            tab.key === activeTab
              ? {
                  ...tab,
                  error: response.data.message || "Lỗi khi thực thi SQL",
                  result: [],
                  loading: false,
                }
              : tab
          )
        );
      } else {
        setTabs((prevTabs) =>
          prevTabs.map((tab) =>
            tab.key === activeTab
              ? {
                  ...tab,
                  result: response.data.data || [],
                  error: null,
                  loading: false,
                }
              : tab
          )
        );
      }
    } catch (err: any) {
      setTabs((prevTabs) =>
        prevTabs.map((tab) =>
          tab.key === activeTab
            ? {
                ...tab,
                error: err?.message || "Lỗi không xác định",
                result: [],
                loading: false,
              }
            : tab
        )
      );
    }
  };

  // Editor value change for current tab
  const handleSqlChange = (value: string | undefined) => {
    setTabs((prevTabs) =>
      prevTabs.map((tab) =>
        tab.key === activeTab ? { ...tab, sql: value || "" } : tab
      )
    );
  };

  // Lấy columns tự động từ dữ liệu trả về cho tab hiện tại
  const columns = React.useMemo(() => {
    if (currentTab.result.length > 0) {
      return Object.keys(currentTab.result[0]).map((key) => ({
        field: key,
        headerName: key,
        width: 60,
      }));
    }
    return [];
  }, [currentTab.result]);

  return (
    <div
      style={{
        padding: 16,
        width: "100%",
        border: "1px solid #ccc",
        borderRadius: 8,
      }}
    >
      <div
        style={{
          borderBottom: "1px solid #ddd",
          display: "flex",
          alignItems: "center",
        }}
      ></div>
      <div style={{ fontWeight: "bold", marginTop: 16, marginBottom: 8 }}>
        SQL Server Editor
      </div>
      <div
        style={{ marginTop: 8, display: "flex", gap: 8, alignItems: "center" }}
      >
        <button
          onClick={() => setFontSize((f) => Math.max(8, f - 1))}
          style={{
            padding: "2px 10px",
            border: "1px solid #1976d2",
            borderRadius: 4,
            background: "#fff",
            color: "#1976d2",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: 16,
          }}
          title="Giảm cỡ chữ"
        >
          -
        </button>
        <span
          style={{
            minWidth: 32,
            textAlign: "center",
            fontWeight: "bold",
            fontSize: 15,
          }}
        >
          {fontSize}
        </span>
        <button
          onClick={() => setFontSize((f) => Math.min(40, f + 1))}
          style={{
            padding: "2px 10px",
            border: "1px solid #1976d2",
            borderRadius: 4,
            background: "#fff",
            color: "#1976d2",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: 16,
          }}
          title="Tăng cỡ chữ"
        >
          +
        </button>
        <span style={{ marginLeft: 16, fontWeight: 500 }}>|</span>
        <button
          onClick={handleRun}
          disabled={currentTab.loading}
          style={{
            padding: "6px 16px",
            border: "1px solid #1976d2",
            borderRadius: 4,
            background: "#1976d2",
            color: "#fff",
            cursor: "pointer",
            marginLeft: 8,
          }}
        >
          Run
        </button>
        {currentTab.loading && <span style={{ marginLeft: 8 }}>⏳</span>}
      </div>
      <div style={{ width: "100%" }}>
        <MonacoEditor
          height="400px"
          defaultLanguage="sql"
          value={currentTab.sql}
          onChange={handleSqlChange}
          options={{
            fontSize: fontSize,
            minimap: { enabled: false },
            formatOnPaste: true,
            formatOnType: true,
            wordWrap: "on",
            suggestOnTriggerCharacters: true,
            quickSuggestions: true,
          }}
          onMount={(editor: any) => {
            monacoEditorRef.current = editor;
          }}
        />
      </div>
      <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
        {currentTab.loading && <span style={{ marginLeft: 8 }}>⏳</span>}
      </div>
      {currentTab.error && (
        <div style={{ color: "red", marginTop: 16 }}>
          Lỗi: {currentTab.error}
        </div>
      )}
      <div style={{ marginTop: 16, height: "calc(100vh - 400px)" }}>
        <AGTable
          toolbar={<></>}
          data={currentTab.result}
          columns={columns}
          onSelectionChange={() => {}}
          columnWidth={60}
        />
      </div>
    </div>
  );
};

export default SqlEditor;
