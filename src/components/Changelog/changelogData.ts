export interface ChangelogHighlight {
  title: string;
  detail: string;
}

export interface ChangelogEntry {
  version: number;
  label: string;
  summary: string;
  highlights: ChangelogHighlight[];
  closingNote: string;
}

const FALLBACK_ENTRY: Omit<ChangelogEntry, "version"> = {
  label: "Release notes",
  summary:
    "Bản phát hành này đi kèm các thay đổi về giao diện, tìm kiếm và trải nghiệm sử dụng. Changelog cụ thể có thể được cập nhật ở file này cho mỗi version mới.",
  highlights: [
    {
      title: "Tổng quan",
      detail: "Giữ lại các cải tiến quan trọng nhất để người dùng đọc nhanh trước khi quyết định cập nhật.",
    },
    {
      title: "Tập trung vào workflow",
      detail: "Ưu tiên thao tác bằng bàn phím, mở tab nhanh và giảm số lần phải chạm chuột.",
    },
    {
      title: "Trải nghiệm gọn hơn",
      detail: "Cập nhật layout, font và popup để toàn web nhìn chuyên nghiệp hơn.",
    },
    {
      title: "Nhắc cập nhật",
      detail: "Popup này sẽ hiện lại khi có version mới; tùy chọn không hiển thị chỉ áp dụng cho version hiện tại.",
    },
  ],
  closingNote: "Nếu muốn tinh chỉnh nội dung, chỉ cần sửa file changelogData.ts.",
};

const CHANGELOGS: Record<number, Omit<ChangelogEntry, "version">> = {
  2657: {
    label: "Navigation refresh",
    summary: "Navbar, navmenu, keyboard shortcuts và search được làm lại để thao tác nhanh hơn.",
    highlights: [
      {
        title: "Tìm menu nhanh",
        detail: "Hỗ trợ search không dấu, search bằng chữ cái đầu và tìm theo mã menu.",
      },
      {
        title: "Phím tắt điều hướng",
        detail: "Ctrl+Shift+↑/↓ đổi tab, Ctrl+Shift+↓ đóng tab đang mở, Esc ẩn menu đang search.",
      },
      {
        title: "Popup update đẹp hơn",
        detail: "Hiển thị changelog theo version, có checkbox Không show lại cho bản cập nhật hiện tại.",
      },
      {
        title: "Font toàn web",
        detail: "Áp dụng lại font tổng thể để giao diện trông hiện đại và đồng nhất hơn.",
      },
    ],
    closingNote: "Các cải tiến này ưu tiên thao tác bàn phím và truy cập menu nhanh hơn.",
  },
  438: {
    label: "Sidebar update",
    summary: "Sidebar shell được tối ưu để search, focus và thao tác tab mượt hơn.",
    highlights: [
      {
        title: "Sidebar overlay rõ ràng",
        detail: "Menu mở/đóng nhất quán hơn khi search hoặc dùng phím tắt.",
      },
      {
        title: "Search ổn định",
        detail: "Giữ trạng thái search và focus đúng ngữ cảnh khi người dùng chuyển tab.",
      },
      {
        title: "Kiểm soát update",
        detail: "Thông tin version mới có thể hiển thị cùng changelog khi server báo cập nhật.",
      },
      {
        title: "Tinh chỉnh UI",
        detail: "Cải thiện độ gọn và độ rõ của toolbar, menu và tab bar.",
      },
    ],
    closingNote: "Bạn có thể thay nội dung cho version này ngay trong file changelogData.ts.",
  },
};

export const getChangelogEntry = (version: number): ChangelogEntry => {
  const entry = CHANGELOGS[version];
  if (entry) {
    return {
      version,
      ...entry,
    };
  }

  return {
    version,
    ...FALLBACK_ENTRY,
    label: `Version ${version}`,
    summary: `Phiên bản ${version} đã sẵn sàng. Xem nhanh các điểm thay đổi trước khi cập nhật.`,
  };
};