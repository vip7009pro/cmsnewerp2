import React, { useCallback, useMemo } from "react";
import { Autocomplete, createFilterOptions, TextField } from "@mui/material";
import { CustomerListData } from "../../../kinhdoanh/interfaces/kdInterface";

interface VendorAutocompleteProps {
  customerList: CustomerListData[];
  cust_cd: string;
  setCust_Cd: (val: string) => void;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
  isMobile?: boolean;
}

/** Nhãn hiển thị của 1 NCC: "TÊN NCC [MÃ NCC]" */
const getVendorLabel = (opt: CustomerListData | null): string => {
  if (!opt) return "";
  return `${opt.CUST_NAME_KD ?? ""} [${opt.CUST_CD ?? ""}]`;
};

// Lọc theo CẢ mã NCC và tên NCC (matchFrom: "any")
const vendorFilterOptions = createFilterOptions<CustomerListData>({
  matchFrom: "any",
  limit: 150,
  trim: true,
  stringify: (opt) => `${opt.CUST_CD} ${opt.CUST_NAME_KD} ${opt.CUST_NAME ?? ""}`,
});

export const VendorAutocomplete: React.FC<VendorAutocompleteProps> = React.memo(
  ({
    customerList,
    cust_cd,
    setCust_Cd,
    disabled = false,
    className = "",
    placeholder = "Gõ mã hoặc tên NCC...",
    isMobile = false,
  }) => {
    // Giá trị hiện tại được chọn dựa trên cust_cd
    const selectedVendor = useMemo(() => {
      return customerList.find((c) => c.CUST_CD === cust_cd) || null;
    }, [customerList, cust_cd]);

    const handleChange = useCallback(
      (_event: React.SyntheticEvent, newValue: CustomerListData | null) => {
        setCust_Cd(newValue ? newValue.CUST_CD : "");
      },
      [setCust_Cd]
    );

    return (
      <Autocomplete
        className={`vendorAutocomplete ${isMobile ? "is-mobile" : ""} ${className}`}
        size="small"
        disabled={disabled}
        options={customerList}
        value={selectedVendor}
        filterOptions={vendorFilterOptions}
        getOptionLabel={getVendorLabel}
        isOptionEqualToValue={(opt, val) => opt.CUST_CD === val?.CUST_CD}
        autoHighlight
        openOnFocus
        selectOnFocus
        handleHomeEndKeys
        noOptionsText="Không tìm thấy nhà cung cấp"
        onChange={handleChange}
        slotProps={{
          popper: { className: "vendor-autocomplete-popper" },
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            size="small"
            placeholder={disabled ? "CMSV Mặc Định (6969)" : placeholder}
          />
        )}
        renderOption={(props, option: CustomerListData) => {
          const { key, ...optionProps } = props;
          return (
            <li key={key} {...optionProps} className="vendor-autocomplete-option">
              <span className="vendor-code">{option.CUST_CD}</span>
              <span className="vendor-sep">:</span>
              <span className="vendor-name">{option.CUST_NAME_KD}</span>
            </li>
          );
        }}
      />
    );
  }
);

VendorAutocomplete.displayName = "VendorAutocomplete";
export default VendorAutocomplete;
