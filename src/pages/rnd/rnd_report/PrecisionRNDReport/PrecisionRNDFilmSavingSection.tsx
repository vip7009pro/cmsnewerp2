import React from "react";
import { FiCalendar, FiDownload, FiLayers } from "react-icons/fi";
import { SaveExcel } from "../../../../api/services/excelService";
import { RND_FILM_SAVING_TREND_DATA } from "../../interfaces/rndInterface";
import { YCTK_TREND_DATA } from "../../../kinhdoanh/interfaces/kdInterface";
import RNDDailyFilmSaving from "../../../../components/Chart/RND/RNDDailyFilmSaving";
import RNDWeeklyFilmSaving from "../../../../components/Chart/RND/RNDWeeklyFilmSaving";
import RNDMonthlyFilmSaving from "../../../../components/Chart/RND/RNDMonthlyFilmSaving";
import RNDYearlyFilmSaving from "../../../../components/Chart/RND/RNDYearlyFilmSaving";
import RNDDailyDesignRequest from "../../../../components/Chart/RND/RNDDailyDesignRequest";
import RNDWeeklyDesignRequest from "../../../../components/Chart/RND/RNDWeeklyDesignRequest";
import RNDMonthlyDesignRequest from "../../../../components/Chart/RND/RNDMonthlyDesignRequest";
import RNDYearlyDesignRequest from "../../../../components/Chart/RND/RNDYearlyDesignRequest";

interface FilmSavingSectionProps {
  company: string;
  filmSavingDaily: RND_FILM_SAVING_TREND_DATA[];
  filmSavingWeekly: RND_FILM_SAVING_TREND_DATA[];
  filmSavingMonthly: RND_FILM_SAVING_TREND_DATA[];
  filmSavingYearly: RND_FILM_SAVING_TREND_DATA[];
  tilefilmbanBackData: RND_FILM_SAVING_TREND_DATA[];
  yctkdailynewcode: YCTK_TREND_DATA[];
  yctkweeklynewcode: YCTK_TREND_DATA[];
  yctkmonthlynewcode: YCTK_TREND_DATA[];
  yctkyearlynewcode: YCTK_TREND_DATA[];
}

export const PrecisionRNDFilmSavingSection: React.FC<FilmSavingSectionProps> = React.memo(
  ({
    company,
    filmSavingDaily,
    filmSavingWeekly,
    filmSavingMonthly,
    filmSavingYearly,
    tilefilmbanBackData,
    yctkdailynewcode,
    yctkweeklynewcode,
    yctkmonthlynewcode,
    yctkyearlynewcode,
  }) => {
    // 1. GIAO DIỆN DÀNH CHO PVN (FILM SAVING)
    if (company === "PVN") {
      return (
        <div className="precision-rnd-report__section">
          <div className="precision-rnd-report__sectionHeader">
            <div className="section-badge-title">
              <span className="icon-circle">
                <FiLayers />
              </span>
              <span>Xu Hướng Tiết Kiệm Film (Film Saving Trending)</span>
            </div>

            {tilefilmbanBackData.length > 0 && (
              <button
                type="button"
                className="executive-card__btn-excel"
                onClick={() =>
                  SaveExcel(tilefilmbanBackData, "Tile Film Ban Back Data")
                }
                title="Xuất Excel dữ liệu tỉ lệ film bản back"
              >
                <FiDownload size={11} />
                <span>Tỉ Lệ Film Bản Back</span>
              </button>
            )}
          </div>

          <div className="two-col-grid">
            {/* DAILY FILM SAVING */}
            <div className="executive-card">
              <div className="executive-card__header">
                <div className="executive-card__title-wrap">
                  <FiCalendar size={13} color="#2563eb" />
                  <span>Daily Film Saving (Tiết Kiệm Film Ngày)</span>
                </div>
                <button
                  type="button"
                  className="executive-card__btn-excel"
                  onClick={() =>
                    SaveExcel(filmSavingDaily, "Daily Film Saving Data")
                  }
                  title="Xuất Excel"
                >
                  <FiDownload size={11} />
                  <span>Excel</span>
                </button>
              </div>
              <div className="executive-card__body">
                <RNDDailyFilmSaving
                  dldata={[...filmSavingDaily].reverse()}
                  processColor="#64b8fd"
                  materialColor="#53eb34"
                />
              </div>
            </div>

            {/* WEEKLY FILM SAVING */}
            <div className="executive-card">
              <div className="executive-card__header">
                <div className="executive-card__title-wrap">
                  <FiCalendar size={13} color="#059669" />
                  <span>Weekly Film Saving (Tiết Kiệm Film Tuần)</span>
                </div>
                <button
                  type="button"
                  className="executive-card__btn-excel"
                  onClick={() =>
                    SaveExcel(filmSavingWeekly, "Weekly Film Saving Data")
                  }
                  title="Xuất Excel"
                >
                  <FiDownload size={11} />
                  <span>Excel</span>
                </button>
              </div>
              <div className="executive-card__body">
                <RNDWeeklyFilmSaving
                  dldata={[...filmSavingWeekly].reverse()}
                  processColor="#64b8fd"
                  materialColor="#53eb34"
                />
              </div>
            </div>
          </div>

          <div className="two-col-grid">
            {/* MONTHLY FILM SAVING */}
            <div className="executive-card">
              <div className="executive-card__header">
                <div className="executive-card__title-wrap">
                  <FiCalendar size={13} color="#d97706" />
                  <span>Monthly Film Saving (Tiết Kiệm Film Tháng)</span>
                </div>
                <button
                  type="button"
                  className="executive-card__btn-excel"
                  onClick={() =>
                    SaveExcel(filmSavingMonthly, "Monthly Film Saving Data")
                  }
                  title="Xuất Excel"
                >
                  <FiDownload size={11} />
                  <span>Excel</span>
                </button>
              </div>
              <div className="executive-card__body">
                <RNDMonthlyFilmSaving
                  dldata={[...filmSavingMonthly].reverse()}
                  processColor="#64b8fd"
                  materialColor="#53eb34"
                />
              </div>
            </div>

            {/* YEARLY FILM SAVING */}
            <div className="executive-card">
              <div className="executive-card__header">
                <div className="executive-card__title-wrap">
                  <FiCalendar size={13} color="#7c3aed" />
                  <span>Yearly Film Saving (Tiết Kiệm Film Năm)</span>
                </div>
                <button
                  type="button"
                  className="executive-card__btn-excel"
                  onClick={() =>
                    SaveExcel(filmSavingYearly, "Yearly Film Saving Data")
                  }
                  title="Xuất Excel"
                >
                  <FiDownload size={11} />
                  <span>Excel</span>
                </button>
              </div>
              <div className="executive-card__body">
                <RNDYearlyFilmSaving
                  dldata={[...filmSavingYearly].reverse()}
                  processColor="#64b8fd"
                  materialColor="#53eb34"
                />
              </div>
            </div>
          </div>
        </div>
      );
    }

    // 2. GIAO DIỆN DÀNH CHO XXX (DESIGN REQUEST)
    if (company === "XXX") {
      return (
        <div className="precision-rnd-report__section">
          <div className="precision-rnd-report__sectionHeader">
            <div className="section-badge-title">
              <span className="icon-circle">
                <FiLayers />
              </span>
              <span>Xu Hướng Yêu Cầu Thiết Kế (Design Request Trending)</span>
            </div>
          </div>

          <div className="two-col-grid">
            {/* DAILY DESIGN REQUEST */}
            <div className="executive-card">
              <div className="executive-card__header">
                <div className="executive-card__title-wrap">
                  <FiCalendar size={13} color="#2563eb" />
                  <span>Daily Design Request (Yêu Cầu Thiết Kế Ngày)</span>
                </div>
                <button
                  type="button"
                  className="executive-card__btn-excel"
                  onClick={() =>
                    SaveExcel(yctkdailynewcode, "Daily Design Request Data")
                  }
                  title="Xuất Excel"
                >
                  <FiDownload size={11} />
                  <span>Excel</span>
                </button>
              </div>
              <div className="executive-card__body">
                <RNDDailyDesignRequest
                  dldata={[...yctkdailynewcode].reverse()}
                  processColor="#10b981"
                  materialColor="#f43f5e"
                />
              </div>
            </div>

            {/* WEEKLY DESIGN REQUEST */}
            <div className="executive-card">
              <div className="executive-card__header">
                <div className="executive-card__title-wrap">
                  <FiCalendar size={13} color="#059669" />
                  <span>Weekly Design Request (Yêu Cầu Thiết Kế Tuần)</span>
                </div>
                <button
                  type="button"
                  className="executive-card__btn-excel"
                  onClick={() =>
                    SaveExcel(yctkweeklynewcode, "Weekly Design Request Data")
                  }
                  title="Xuất Excel"
                >
                  <FiDownload size={11} />
                  <span>Excel</span>
                </button>
              </div>
              <div className="executive-card__body">
                <RNDWeeklyDesignRequest
                  dldata={[...yctkweeklynewcode].reverse()}
                  processColor="#10b981"
                  materialColor="#f43f5e"
                />
              </div>
            </div>
          </div>

          <div className="two-col-grid">
            {/* MONTHLY DESIGN REQUEST */}
            <div className="executive-card">
              <div className="executive-card__header">
                <div className="executive-card__title-wrap">
                  <FiCalendar size={13} color="#d97706" />
                  <span>Monthly Design Request (Yêu Cầu Thiết Kế Tháng)</span>
                </div>
                <button
                  type="button"
                  className="executive-card__btn-excel"
                  onClick={() =>
                    SaveExcel(yctkmonthlynewcode, "Monthly Design Request Data")
                  }
                  title="Xuất Excel"
                >
                  <FiDownload size={11} />
                  <span>Excel</span>
                </button>
              </div>
              <div className="executive-card__body">
                <RNDMonthlyDesignRequest
                  dldata={[...yctkmonthlynewcode].reverse()}
                  processColor="#10b981"
                  materialColor="#f43f5e"
                />
              </div>
            </div>

            {/* YEARLY DESIGN REQUEST */}
            <div className="executive-card">
              <div className="executive-card__header">
                <div className="executive-card__title-wrap">
                  <FiCalendar size={13} color="#7c3aed" />
                  <span>Yearly Design Request (Yêu Cầu Thiết Kế Năm)</span>
                </div>
                <button
                  type="button"
                  className="executive-card__btn-excel"
                  onClick={() =>
                    SaveExcel(yctkyearlynewcode, "Yearly Design Request Data")
                  }
                  title="Xuất Excel"
                >
                  <FiDownload size={11} />
                  <span>Excel</span>
                </button>
              </div>
              <div className="executive-card__body">
                <RNDYearlyDesignRequest
                  dldata={[...yctkyearlynewcode].reverse()}
                  processColor="#10b981"
                  materialColor="#f43f5e"
                />
              </div>
            </div>
          </div>
        </div>
      );
    }

    return null;
  }
);

PrecisionRNDFilmSavingSection.displayName = "PrecisionRNDFilmSavingSection";
