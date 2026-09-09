import { SUBNAVMENUDATA } from "./getNavMenu";

export interface DepartmentTheme {
  primaryColor: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  iconBg: string;
  iconColor: string;
  subtitle: string;
  defaultCodeRange: string;
}

/**
 * Ánh xạ màu sắc & đặc tả chuyên biệt cho từng phân hệ phòng ban ERP
 */
export const getDepartmentTheme = (title: string, index: number): DepartmentTheme => {
  const lower = (title || "").toLowerCase();

  if (lower.includes("nhân sự") || lower.includes("hr")) {
    return {
      primaryColor: "#2563eb",
      badgeBg: "#eff6ff",
      badgeText: "#1d4ed8",
      badgeBorder: "#bfdbfe",
      iconBg: "#2563eb",
      iconColor: "#ffffff",
      subtitle: "Quản trị phân ca & nhân sự phòng ban",
      defaultCodeRange: "NS1-8",
    };
  }

  if (lower.includes("hành chính") || lower.includes("hc")) {
    return {
      primaryColor: "#9333ea",
      badgeBg: "#faf5ff",
      badgeText: "#7e22ce",
      badgeBorder: "#e9d5ff",
      iconBg: "#f3e8ff",
      iconColor: "#9333ea",
      subtitle: "Hành chính nhân sự & văn phòng tổng hợp",
      defaultCodeRange: "HC1-6",
    };
  }

  if (lower.includes("kinh doanh") || lower.includes("sales")) {
    return {
      primaryColor: "#059669",
      badgeBg: "#f0fdf4",
      badgeText: "#047857",
      badgeBorder: "#bbf7d0",
      iconBg: "#dcfce7",
      iconColor: "#059669",
      subtitle: "Quản lý đơn hàng, khách hàng & PO",
      defaultCodeRange: "KD1-15",
    };
  }

  if (lower.includes("mua hàng") || lower.includes("purchasing") || lower.includes("procurement")) {
    return {
      primaryColor: "#db2777",
      badgeBg: "#fdf2f8",
      badgeText: "#be185d",
      badgeBorder: "#fbcfe8",
      iconBg: "#fce7f3",
      iconColor: "#db2777",
      subtitle: "Phòng mua hàng & quản lý nhà cung ứng",
      defaultCodeRange: "PU1-2",
    };
  }

  if (lower.includes("qc") || lower.includes("chất lượng") || lower.includes("qa") || lower.includes("quality")) {
    return {
      primaryColor: "#7c3aed",
      badgeBg: "#f5f3ff",
      badgeText: "#6d28d9",
      badgeBorder: "#ddd6fe",
      iconBg: "#ede9fe",
      iconColor: "#7c3aed",
      subtitle: "Quality Ctrl • Quản lý chất lượng (OQC, IQC)",
      defaultCodeRange: "QC1-10",
    };
  }

  if (lower.includes("nghiên cứu") || lower.includes("rnd") || lower.includes("r&d")) {
    return {
      primaryColor: "#2563eb",
      badgeBg: "#eff6ff",
      badgeText: "#1d4ed8",
      badgeBorder: "#bfdbfe",
      iconBg: "#dbeafe",
      iconColor: "#2563eb",
      subtitle: "Nghiên cứu & phát triển (RnD / BOM)",
      defaultCodeRange: "RD1-8",
    };
  }

  if (lower.includes("sản xuất") || lower.includes("production") || lower.includes("manufacturing")) {
    return {
      primaryColor: "#dc2626",
      badgeBg: "#fef2f2",
      badgeText: "#b91c1c",
      badgeBorder: "#fecaca",
      iconBg: "#fee2e2",
      iconColor: "#dc2626",
      subtitle: "Phân xưởng & kế hoạch điều độ sản xuất",
      defaultCodeRange: "SX1-18",
    };
  }

  if (lower.includes("kho") || lower.includes("warehouse")) {
    return {
      primaryColor: "#4f46e5",
      badgeBg: "#eef2ff",
      badgeText: "#4338ca",
      badgeBorder: "#c7d2fe",
      iconBg: "#e0e7ff",
      iconColor: "#4f46e5",
      subtitle: "Bộ phận kho & quản lý nhập xuất tồn",
      defaultCodeRange: "KO1-3",
    };
  }

  if (lower.includes("truyền thông") || lower.includes("tin tức") || lower.includes("media") || lower.includes("information")) {
    return {
      primaryColor: "#0891b2",
      badgeBg: "#ecfeff",
      badgeText: "#0e7490",
      badgeBorder: "#a5f3fc",
      iconBg: "#cffafe",
      iconColor: "#0891b2",
      subtitle: "Bảng truyền thông & tin tức nội bộ",
      defaultCodeRange: "IF1-2",
    };
  }

  if (lower.includes("công cụ") || lower.includes("hệ thống") || lower.includes("tools")) {
    return {
      primaryColor: "#0d9488",
      badgeBg: "#f0fdfa",
      badgeText: "#0f766e",
      badgeBorder: "#99f6e4",
      iconBg: "#ccfbf1",
      iconColor: "#0d9488",
      subtitle: "Công cụ trợ giúp & tiện ích mở rộng",
      defaultCodeRange: "TL1-2",
    };
  }

  // Fallback palette
  const fallbacks: DepartmentTheme[] = [
    {
      primaryColor: "#2563eb",
      badgeBg: "#eff6ff",
      badgeText: "#1d4ed8",
      badgeBorder: "#bfdbfe",
      iconBg: "#dbeafe",
      iconColor: "#2563eb",
      subtitle: "Phân hệ quy trình nghiệp vụ",
      defaultCodeRange: "M" + (index + 1),
    },
    {
      primaryColor: "#9333ea",
      badgeBg: "#faf5ff",
      badgeText: "#7e22ce",
      badgeBorder: "#e9d5ff",
      iconBg: "#f3e8ff",
      iconColor: "#9333ea",
      subtitle: "Phân hệ quản trị chức năng",
      defaultCodeRange: "M" + (index + 1),
    },
    {
      primaryColor: "#059669",
      badgeBg: "#f0fdf4",
      badgeText: "#047857",
      badgeBorder: "#bbf7d0",
      iconBg: "#dcfce7",
      iconColor: "#059669",
      subtitle: "Báo cáo & điều hành tác nghiệp",
      defaultCodeRange: "M" + (index + 1),
    },
  ];

  return fallbacks[index % fallbacks.length];
};

/**
 * Trả về style màu mềm mại cho từng SubMenu item (icon box, code badge)
 */
export const getSubMenuColorTheme = (code: string, index: number) => {
  const upper = (code || "").toUpperCase();

  if (upper.startsWith("NS2") || upper.includes("DIEMDANH")) {
    return { bg: "#d1fae5", text: "#047857", hoverBg: "#059669" }; // Emerald
  }
  if (upper.startsWith("NS3") || upper.includes("DIEUCHUYEN")) {
    return { bg: "#e0f2fe", text: "#0369a1", hoverBg: "#0284c7" }; // Sky
  }
  if (upper.startsWith("NS4") || upper.includes("DANGKY")) {
    return { bg: "#e0e7ff", text: "#4338ca", hoverBg: "#4f46e5" }; // Indigo
  }
  if (upper.startsWith("NS5") || upper.includes("PHEDUYET")) {
    return { bg: "#fef3c7", text: "#b45309", hoverBg: "#d97706" }; // Amber
  }
  if (upper.startsWith("NS6") || upper.includes("LICHSU")) {
    return { bg: "#ede9fe", text: "#6d28d9", hoverBg: "#7c3aed" }; // Violet
  }
  if (upper.startsWith("NS7") || upper.includes("CAPCAO")) {
    return { bg: "#ffe4e6", text: "#be123c", hoverBg: "#e11d48" }; // Rose
  }
  if (upper.startsWith("NS8") || upper.includes("BAOCAO")) {
    return { bg: "#ccfbf1", text: "#0f766e", hoverBg: "#0d9488" }; // Teal
  }
  if (upper.startsWith("NS1") || upper.includes("PHONGBAN")) {
    return { bg: "#dbeafe", text: "#1d4ed8", hoverBg: "#2563eb" }; // Blue
  }

  const palette = [
    { bg: "#dbeafe", text: "#1d4ed8", hoverBg: "#2563eb" },
    { bg: "#d1fae5", text: "#047857", hoverBg: "#059669" },
    { bg: "#ede9fe", text: "#6d28d9", hoverBg: "#7c3aed" },
    { bg: "#fce7f3", text: "#be185d", hoverBg: "#db2777" },
    { bg: "#e0f2fe", text: "#0369a1", hoverBg: "#0284c7" },
    { bg: "#fef3c7", text: "#b45309", hoverBg: "#d97706" },
  ];

  return palette[index % palette.length];
};
