import React from "react";
import PrecisionHeader from "./PrecisionHeader/PrecisionHeader";

interface NavBarNewProps {
  searchText: string;
  onSearchTextChange: (value: string) => void;
  onSearchFocus: () => void;
  onSearchBlur?: () => void;
  onSearchEnter: () => void;
  onSidebarToggle?: (nextOpen: boolean) => void;
  onMenuSearchFocus?: () => void;
  menuAutoFocusSearch?: boolean;
  menuAlignedToSearch?: boolean;
}

export default function NavBarNew(props: NavBarNewProps) {
  return (
    <PrecisionHeader
      searchText={props.searchText}
      onSearchTextChange={props.onSearchTextChange}
      onSearchFocus={props.onSearchFocus}
      onSearchBlur={props.onSearchBlur}
      onSearchEnter={props.onSearchEnter}
      onSidebarToggle={props.onSidebarToggle}
    />
  );
}
