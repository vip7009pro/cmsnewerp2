import React, { useState } from "react";
import "./NavBarNew.scss";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import NavMenu from "../NavMenu/NavMenu";
const NavBarNew = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  const toggleSubMenu = () => {
    setIsSubMenuOpen(!isSubMenuOpen);
  };
  const cpnInfo: any = useSelector(
    (state: RootState) => state.totalSlice.cpnInfo
  );
  const company: string = useSelector(
    (state: RootState) => state.totalSlice.company
  );
  return (
    <div>
      <nav className="navbarnew">
        <div className="nav-container">
          {/* Logo */}
          <Link to="/" className="menulink">
            <img
              alt="companylogo"
              src="/companylogo.png"
              width={cpnInfo[company].logoWidth}
              height={cpnInfo[company].logoHeight}
            />
          </Link>
          {/* Menu Items */}
          <ul className="nav-links">
            <li>
              <Link to="/">Trang chủ</Link>
            </li>
            <li>
              <Link to="/about">Giới thiệu</Link>
            </li>
            <li className="dropdown">
              <a href="#" onClick={toggleSubMenu} className="dropdown-toggle">
                Dịch vụ
                <svg
                  className="dropdown-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </a>
              <ul className={`submenu ${isSubMenuOpen ? "active" : ""}`}>
                <li>
                  <Link to="/services/web-design">Dịch vụ 1: Thiết kế Web</Link>
                </li>
                <li>
                  <Link to="/services/app-development">
                    Dịch vụ 2: Phát triển App
                  </Link>
                </li>
                <li>
                  <Link to="/services/seo">Dịch vụ 3: SEO</Link>
                </li>
              </ul>
            </li>
            <li className="dropdown">
              <a href="#" onClick={toggleSubMenu} className="dropdown-toggle">
                Dịch vụ
                <svg
                  className="dropdown-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </a>
              <ul className={`submenu ${isSubMenuOpen ? "active" : ""}`}>
                <li>
                  <Link to="/services/web-design">Dịch vụ 1: Thiết kế Web</Link>
                </li>
                <li>
                  <Link to="/services/app-development">
                    Dịch vụ 2: Phát triển App
                  </Link>
                </li>
                <li>
                  <Link to="/services/seo">Dịch vụ 3: SEO</Link>
                </li>
              </ul>
            </li>
            <li>
              <Link to="/contact">Liên hệ</Link>
            </li>
          </ul>
          {/* Hamburger Menu */}
          <div className="hamburger" onClick={toggleMobileMenu}>
            <svg
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              ></path>
            </svg>
          </div>
        </div>
        {/* Mobile Menu */}
        <div className={`mobile-menu ${isMobileMenuOpen ? "active" : ""}`}>
          <Link to="/" onClick={toggleMobileMenu}>
            Trang chủ
          </Link>
          <Link to="/about" onClick={toggleMobileMenu}>
            Giới thiệu
          </Link>
          <div className="dropdown">
            <a href="#" onClick={toggleSubMenu} className="dropdown-toggle">
              Dịch vụ
              <svg
                className="dropdown-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </a>
            <div className={`submenu ${isSubMenuOpen ? "active" : ""}`}>
              <Link to="/services/web-design" onClick={toggleMobileMenu}>
                Dịch vụ 1: Thiết kế Web
              </Link>
              <Link to="/services/app-development" onClick={toggleMobileMenu}>
                Dịch vụ 2: Phát triển App
              </Link>
              <Link to="/services/seo" onClick={toggleMobileMenu}>
                Dịch vụ 3: SEO
              </Link>
            </div>
          </div>
          <div className="dropdown">
            <a href="#" onClick={toggleSubMenu} className="dropdown-toggle">
              Dịch vụ
              <svg
                className="dropdown-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </a>
            <div className={`submenu ${isSubMenuOpen ? "active" : ""}`}>
              <Link to="/services/web-design" onClick={toggleMobileMenu}>
                Dịch vụ 1: Thiết kế Web
              </Link>
              <Link to="/services/app-development" onClick={toggleMobileMenu}>
                Dịch vụ 2: Phát triển App
              </Link>
              <Link to="/services/seo" onClick={toggleMobileMenu}>
                Dịch vụ 3: SEO
              </Link>
            </div>
          </div>
          <Link to="/contact" onClick={toggleMobileMenu}>
            Liên hệ
          </Link>
        </div>
      </nav>
    </div>
  );
};
export default NavBarNew;
