import React, { useState } from "react";
import PrecisionHeader from "../../components/Navbar/PrecisionHeader/PrecisionHeader";
import PrecisionPoManager from "../kinhdoanh/pomanager/PrecisionPoManager/PrecisionPoManager";

export default function PrecisionPreviewPage() {
  const [searchText, setSearchText] = useState("");

  return (
    <div style={{ height: "100vh", maxHeight: "100vh", background: "#f8fafc", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {/* Precision Top Master Bar */}
      <PrecisionHeader
        searchText={searchText}
        onSearchTextChange={setSearchText}
        onSearchEnter={() => {}}
      />

      {/* Main Body Viewport */}
      <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <PrecisionPoManager />
      </div>
    </div>
  );
}

