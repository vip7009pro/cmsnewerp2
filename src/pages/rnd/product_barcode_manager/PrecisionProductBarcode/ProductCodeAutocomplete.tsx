import React, { useCallback } from "react";
import { Autocomplete, createFilterOptions, TextField } from "@mui/material";
import { CodeListData } from "../../../kinhdoanh/interfaces/kdInterface";

/** Nhãn hiển thị của 1 mã sản phẩm: "G_CODE : G_NAME" */
const getCodeLabel = (opt: CodeListData | null): string =>
  opt ? `${opt.G_CODE ?? ""} : ${opt.G_NAME ?? ""}` : "";

// Lọc theo CẢ mã và tên (matchFrom: "any") + trim khoảng trắng.
// limit: giới hạn số option render để list ~5.000 mã vẫn không bị lag.
const codeFilterOptions = createFilterOptions<CodeListData>({
  matchFrom: "any",
  limit: 200,
  trim: true,
});

interface ProductCodeAutocompleteProps {
  codeList: CodeListData[];
  selectedCode: CodeListData | null;
  /** Callback khi người dùng chọn / bỏ chọn một mã sản phẩm */
  onSelect: (val: CodeListData | null) => void;
}

/**
 * Ô chọn MÃ SẢN PHẨM dạng AutoComplete:
 * - Gõ mã HOẶC tên sản phẩm để search trực tiếp trong list.
 * - Nhấn Enter sẽ chọn ngay option đầu tiên của list (list sau khi lọc)
 *   nhờ prop `autoHighlight` của MUI: option đầu tiên luôn được highlight sẵn,
 *   Enter = chọn option đang highlight đó.
 * - Click (X) hoặc xoá trắng => trả về `null` để form reset G_CODE.
 */
export const ProductCodeAutocomplete: React.FC<ProductCodeAutocompleteProps> = React.memo(
  ({ codeList, selectedCode, onSelect }) => {
    const handleChange = useCallback(
      (_event: React.SyntheticEvent, newValue: CodeListData | null) => {
        onSelect(newValue);
      },
      [onSelect]
    );

    return (
      <Autocomplete
        className="productCodeAutocomplete"
        size="small"
        options={codeList}
        value={selectedCode}
        filterOptions={codeFilterOptions}
        getOptionLabel={getCodeLabel}
        isOptionEqualToValue={(opt, val) => opt.G_CODE === val?.G_CODE}
        // KEY BEHAVIOR: tự highlight option đầu tiên => Enter chọn luôn option đó
        autoHighlight
        openOnFocus
        selectOnFocus
        handleHomeEndKeys
        noOptionsText="Không tìm thấy mã sản phẩm phù hợp"
        onChange={handleChange}
        slotProps={{
          popper: { className: "productCodeAutocomplete-popper" },
        }}
        renderInput={(params) => (
          <TextField {...params} size="small" placeholder="Gõ mã / tên sản phẩm rồi Enter..." />
        )}
        renderOption={(props, option: CodeListData) => {
          // Tách `key` ra khỏi props để tránh warning spread key vào JSX (React 18.3+ / 19)
          const { key, ...optionProps } = props;
          return (
            <li key={key} {...optionProps}>
              <span className="optCode">{option.G_CODE}</span>
              <span className="optName">: {option.G_NAME}</span>
            </li>
          );
        }}
      />
    );
  }
);

ProductCodeAutocomplete.displayName = "ProductCodeAutocomplete";
