import Swal from "sweetalert2";
import { generalQuery, getCompany, getUserData } from "../Api";
import { UserData } from "../GlobalInterface";
import { Component } from "react";
import { Login } from "../lazyPages";

/**
 * Permission & authorization service - extracted from GlobalFunction.tsx
 */
export async function checkBP(
  userData: UserData | undefined,
  permitted_main_dept: string[],
  permitted_position: string[],
  permitted_empl: string[],
  func: any
) {
  if (!userData || !userData.EMPL_NO || !userData.MAINDEPTNAME) return;

  const isCMS = getCompany() === "CMS";
  const isSuperUser =
    userData.EMPL_NO === "NHU1903" ||
    userData.EMPL_NO === "NVD1201" ||
    (!isCMS && (userData.EMPL_NO === "DSL1986" || userData.EMPL_NO === "NTD1983" || userData.EMPL_NO === "LTH1992"));

  if (isSuperUser) {
    return await func();
  }

  const hasDeptPerm =
    permitted_main_dept.includes("ALL") ||
    permitted_main_dept.includes(userData.MAINDEPTNAME);
  if (!hasDeptPerm) {
    return Swal.fire(
      "Thông báo",
      "Bạn không phải người bộ phận " + permitted_main_dept,
      "warning"
    );
  }

  const position = userData.JOB_NAME ?? "NA";
  const hasPositionPerm =
    permitted_position.includes("ALL") || permitted_position.includes(position);
  if (!hasPositionPerm) {
    return Swal.fire("Thông báo", "Chức vụ không đủ quyền hạn", "warning");
  }

  const hasEmplPerm =
    permitted_empl.includes("ALL") || permitted_empl.includes(userData.EMPL_NO);
  if (!hasEmplPerm) {
    return Swal.fire("Thông báo", "Không đủ quyền hạn", "warning");
  }

  return await func();
}

export const ProtectedRoute: any = ({
  user,
  maindeptname,
  jobname,
  children,
}: {
  user: UserData;
  maindeptname: string;
  jobname: string;
  children: Component;
}) => {
  if (!user || user.EMPL_NO === "none") {
    return <Login />;
  }

  const isSuperAdmin =
    user.EMPL_NO === "NHU1903" ||
    user.EMPL_NO === "NVH1011" ||
    user.JOB_NAME === "ADMIN";

  const hasDept =
    maindeptname === "all" || isSuperAdmin || user.MAINDEPTNAME === maindeptname;
  if (!hasDept) {
    Swal.fire(
      "Thông báo",
      "Nội dung: Bạn không phải người của bộ phận: " + maindeptname,
      "error"
    );
    return <></>;
  }

  const hasJob = jobname === "all" || isSuperAdmin;
  if (!hasJob) {
    const isManager =
      user.JOB_NAME === "Leader" ||
      user.JOB_NAME === "Sub Leader" ||
      user.JOB_NAME === "Dept Staff" ||
      user.JOB_NAME === "ADMIN";
    if (!isManager) {
      Swal.fire(
        "Thông báo",
        "Nội dung: Bạn không có quyền truy cập: ",
        "error"
      );
      return <></>;
    }
  }

  return children;
};
