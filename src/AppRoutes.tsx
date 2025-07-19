import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from './api/GlobalFunction';
import { AccountInfo, AddInfo, BANGCHAMCONG, BaoCaoNhanSu, BAOCAOSXALL, BAOCAOTHEOROLL, BCSX, Blank, BOM_AMAZON, BOM_MANAGER, BulletinBoard, CAPA_MANAGER, CAPASX2, CODE_MANAGER, CSTOTAL, CUST_MANAGER, DESIGN_AMAZON, DiemDanhNhomCMS, DieuChuyenTeam, DTC, EQ_STATUS, FCSTManager, FileTransfer, Info, Information, INSPECT_STATUS, InvoiceManager, IQC, ISO, KHOAO, KHOLIEU, KHOSUB, KHOSX, KHOTABS, KHOTOTAL, KHOTP, KHOTPNEW, KIEMTRA, KinhDoanh, KinhDoanhReport, LichSu, LICHSUINPUTLIEU, LICHSUTEMLOTSX, MUAHANG, NhanSu, NOLOWHOME, OQC, OVER_MONITOR, PheDuyetNghi, PlanManager, PLANRESULT, POandStockFull, PoManager, PostManager, PQC, PRODUCT_BARCODE_MANAGER, QC, QCReport, QLGN, QLSX, QLSXPLAN, QLVL, QuanLyCapCao, QuanLyCapCao_NS, QuanLyPhongBanNhanSu, QuotationTotal, RND_REPORT, SAMPLE_MONITOR, SettingPage, ShortageKD, TabDangKy, TINHHINHCUONLIEU, TINHLIEU, TINHLUONGP3, TRANGTHAICHITHI, WH_REPORT, YCSXManager,  YCTKManager, } from "./api/lazyPages";
import Home from './pages/home/Home';
import { getCompany } from './api/Api';
import { animated } from '@react-spring/web';
const AppRoutes = ({ globalUserData }: { globalUserData: any }) => {
  return (
    <BrowserRouter>
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute
            user={globalUserData}
            maindeptname="all"
            jobname="all"
          >
            <animated.div
              style={{
                width: "100%",
                height: "100%",
                borderRadius: 8,
              }}
            >
              <Home />
            </animated.div>
          </ProtectedRoute>
        }
      >
        <Route
          index
          element={<BulletinBoard />}
          />
        <Route path="accountinfo" element={<AccountInfo />}></Route>
        <Route
          path="kinhdoanh"
          element={
            <ProtectedRoute
              user={globalUserData}
              maindeptname="all"
              jobname="Leader"
            >
              <KinhDoanh />
            </ProtectedRoute>
          }
        >
          <Route index element={<KinhDoanhReport />} />
          <Route path="pomanager" element={<PoManager />} />
          <Route path="invoicemanager" element={<InvoiceManager />} />
          <Route path="planmanager" element={<PlanManager />} />
          <Route path="fcstmanager" element={<FCSTManager />} />
          <Route path="ycsxmanager" element={<YCSXManager />} />
          <Route path="quanlycodebom" element={<BOM_MANAGER />} />
          <Route path="poandstockfull" element={<POandStockFull />} />
          <Route
            path="kinhdoanhreport"
            element={<KinhDoanhReport />}
          />
          <Route path="codeinfo" element={<CODE_MANAGER />} />
          <Route path="customermanager" element={<CUST_MANAGER />} />
          <Route
            path="quotationmanager"
            element={<QuotationTotal />}
          />
          <Route path="eqstatus" element={<EQ_STATUS />} />
          <Route path="ins_status" element={<INSPECT_STATUS />} />
          <Route path="shortage" element={<ShortageKD />} />
          <Route path="overmonitor" element={<OVER_MONITOR />} />
          <Route path="yctk" element={<YCTKManager />} />
        </Route>
        <Route
          path="rnd"
          element={
            <ProtectedRoute
              user={globalUserData}
              maindeptname="all"
              jobname="Leader"
            >
              <KinhDoanh />
            </ProtectedRoute>
          }
        >
          <Route index element={<KinhDoanhReport />} />
          <Route path="quanlycodebom" element={<BOM_MANAGER />} />
          <Route path="ycsxmanager" element={<YCSXManager />} />
          <Route path="dtc" element={<DTC />} />
          <Route path="thembomamazon" element={<BOM_AMAZON />} />
          <Route path="designamazon" element={<DESIGN_AMAZON />} />
          <Route
            path="productbarcodemanager"
            element={<PRODUCT_BARCODE_MANAGER />}
          />
          <Route path="quanlygiaonhan" element={<QLGN />} />
          <Route path="samplemonitor" element={<SAMPLE_MONITOR />} />
          <Route
            path="baocaornd"
            element={
              getCompany() === "CMS" ? <RND_REPORT /> : <Blank />
            }
          />
        </Route>
        <Route
          path="qlsx"
          element={
            <ProtectedRoute
              user={globalUserData}
              maindeptname="all"
              jobname="Leader"
            >
              <QLSX />
            </ProtectedRoute>
          }
        >
          <Route index element={<QLSX />} />
          <Route path="ycsxmanager" element={<YCSXManager />} />
          <Route path="codeinfo" element={<CODE_MANAGER />} />
          <Route path="qlsxplan" element={<QLSXPLAN />} />
          <Route path="quanlycodebom" element={<BOM_MANAGER />} />
          <Route path="capamanager" element={<CAPASX2 />} />
          <Route path="qlsxmrp" element={<TINHLIEU />} />
          <Route
            path="tinhluongP3"
            element={
              <ProtectedRoute
                user={globalUserData}
                maindeptname="all"
                jobname="Leader"
              >
                <TINHLUONGP3 />
              </ProtectedRoute>
            }
          />
        </Route>
        <Route
          path="phongmuahang"
          element={
            <ProtectedRoute
              user={globalUserData}
              maindeptname="all"
              jobname="Leader"
            >
              <MUAHANG />
            </ProtectedRoute>
          }
        >
          <Route index element={<MUAHANG />} />
          <Route path="quanlyvatlieu" element={<QLVL />} />
          <Route path="mrp" element={<TINHLIEU />} />
        </Route>
        <Route
          path="bophankho"
          element={
            <ProtectedRoute
              user={globalUserData}
              maindeptname="all"
              jobname="Leader"
            >
              <KHOTOTAL />
            </ProtectedRoute>
          }
        >
          <Route index element={<KHOTABS />} />
          <Route path="khotabs" element={<KHOTABS />} />
          <Route
            path="nhapxuattontp"
            element={ getCompany() !== "CMS" ? <KHOTPNEW /> : <KHOTP /> }
          />
          <Route path="nhapxuattonlieu" element={<KHOLIEU />} />
          <Route path="baocaokho" element={<WH_REPORT />} />
        </Route>
        <Route
          path="setting"
          element={
            <ProtectedRoute
              user={globalUserData}
              maindeptname="all"
              jobname="Leader"
            >
              <SettingPage />
            </ProtectedRoute>
          }
        >
          <Route index element={<SettingPage />} />
        </Route>
        <Route
          path="qc"
          element={
            <ProtectedRoute
              user={globalUserData}
              maindeptname="all"
              jobname="all"
            >
              <QC />
            </ProtectedRoute>
          }
        >
          <Route index element={<AccountInfo />} />
          <Route
            path="tracuuchung"
            element={
              <ProtectedRoute
                user={globalUserData}
                maindeptname="all"
                jobname="Leader"
              >
                <IQC />
              </ProtectedRoute>
            }
          />
          <Route
            path="codeinfo"
            element={
              <ProtectedRoute
                user={globalUserData}
                maindeptname="all"
                jobname="Leader"
              >
                <CODE_MANAGER />
              </ProtectedRoute>
            }
          />
          <Route
            path="iqc"
            element={
              <ProtectedRoute
                user={globalUserData}
                maindeptname="all"
                jobname="all"
              >
                <IQC />
              </ProtectedRoute>
            }
          />
          <Route
            path="pqc"
            element={
              <ProtectedRoute
                user={globalUserData}
                maindeptname="all"
                jobname="all"
              >
                <PQC />
              </ProtectedRoute>
            }
          />
          <Route
            path="oqc"
            element={
              <ProtectedRoute
                user={globalUserData}
                maindeptname="all"
                jobname="Leader"
              >
                <OQC />
              </ProtectedRoute>
            }
          />
          <Route
            path="inspection"
            element={
              <ProtectedRoute
                user={globalUserData}
                maindeptname="all"
                jobname="Leader"
              >
                <KIEMTRA />
              </ProtectedRoute>
            }
          />
          <Route
            path="cs"
            element={
              <ProtectedRoute
                user={globalUserData}
                maindeptname="all"
                jobname="Leader"
              >
                <CSTOTAL />
              </ProtectedRoute>
            }
          />
          <Route
            path="dtc"
            element={
              <ProtectedRoute
                user={globalUserData}
                maindeptname="all"
                jobname="Leader"
              >
                <DTC />
              </ProtectedRoute>
            }
          />
          <Route
            path="iso"
            element={
              <ProtectedRoute
                user={globalUserData}
                maindeptname="all"
                jobname="Leader"
              >
                <ISO />
              </ProtectedRoute>
            }
          />
          <Route
            path="qcreport"
            element={
              <ProtectedRoute
                user={globalUserData}
                maindeptname="all"
                jobname="Leader"
              >
                {getCompany() === "CMS" ? <QCReport /> : <Blank />}
              </ProtectedRoute>
            }
          />
          <Route
            path="ycsxmanager"
            element={
              <ProtectedRoute
                user={globalUserData}
                maindeptname="all"
                jobname="Leader"
              >
                <YCSXManager />
              </ProtectedRoute>
            }
          />
        </Route>
        <Route
          path="tool"
          element={
            <ProtectedRoute
              user={globalUserData}
              maindeptname="all"
              jobname="Leader"
            >
              <FileTransfer />
            </ProtectedRoute>
          }
        >
          <Route index element={<FileTransfer />} />
          <Route path="filetransfer" element={<FileTransfer />} />
          <Route path="nocodelowcode" element={<NOLOWHOME />} />
        </Route>
        <Route
          path="information_board"
          element={
            <ProtectedRoute
              user={globalUserData}
              maindeptname="all"
              jobname="Leader"
            >
              <Info />
            </ProtectedRoute>
          }
        >
          <Route index element={<Information />} />
          <Route path="news" element={<Information />} />
          <Route path="register" element={<AddInfo />} />
          <Route path="postmanager" element={<PostManager />} />
        </Route>
        <Route
          path="sx"
          element={
            <ProtectedRoute
              user={globalUserData}
              maindeptname="all"
              jobname="Leader"
            >
              <QC />
            </ProtectedRoute>
          }
        >
          <Route index element={<AccountInfo />} />
          <Route
            path="tracuuchung"
            element={
              <ProtectedRoute
                user={globalUserData}
                maindeptname="all"
                jobname="Leader"
              >
                <IQC />
              </ProtectedRoute>
            }
          />
          <Route
            path="codeinfo"
            element={
              <ProtectedRoute
                user={globalUserData}
                maindeptname="all"
                jobname="Leader"
              >
                <CODE_MANAGER />
              </ProtectedRoute>
            }
          />
          <Route
            path="ycsxmanager"
            element={
              <ProtectedRoute
                user={globalUserData}
                maindeptname="all"
                jobname="Leader"
              >
                <YCSXManager />
              </ProtectedRoute>
            }
          />
          <Route
            path="datasx"
            element={
              <ProtectedRoute
                user={globalUserData}
                maindeptname="all"
                jobname="Leader"
              >
                <BAOCAOSXALL />
              </ProtectedRoute>
            }
          />
          <Route
            path="planstatus"
            element={
              <ProtectedRoute
                user={globalUserData}
                maindeptname="all"
                jobname="Leader"
              >
                <TRANGTHAICHITHI />
              </ProtectedRoute>
            }
          />
          <Route
            path="eqstatus"
            element={
              <ProtectedRoute
                user={globalUserData}
                maindeptname="all"
                jobname="Leader"
              >
                <EQ_STATUS />
              </ProtectedRoute>
            }
          />
          <Route
            path="lichsuxuatlieu"
            element={
              <ProtectedRoute
                user={globalUserData}
                maindeptname="all"
                jobname="Leader"
              >
                <LICHSUINPUTLIEU />
              </ProtectedRoute>
            }
          />
          <Route
            path="lichsutemlotsx"
            element={
              <ProtectedRoute
                user={globalUserData}
                maindeptname="all"
                jobname="Leader"
              >
                <LICHSUTEMLOTSX />
              </ProtectedRoute>
            }
          />
          <Route
            path="materiallotstatus"
            element={
              <ProtectedRoute
                user={globalUserData}
                maindeptname="all"
                jobname="Leader"
              >
                <TINHHINHCUONLIEU />
              </ProtectedRoute>
            }
          />
          <Route
            path="rolldata"
            element={
              <ProtectedRoute
                user={globalUserData}
                maindeptname="all"
                jobname="Leader"
              >
                <BAOCAOTHEOROLL />
              </ProtectedRoute>
            }
          />
          <Route
            path="khosx"
            element={
              <ProtectedRoute
                user={globalUserData}
                maindeptname="all"
                jobname="Leader"
              >
                <KHOSX />
              </ProtectedRoute>
            }
          />
          <Route
            path="khoao"
            element={
              <ProtectedRoute
                user={globalUserData}
                maindeptname="all"
                jobname="Leader"
              >
                <KHOAO />
              </ProtectedRoute>
            }
          />
          <Route
            path="khosub"
            element={
              <ProtectedRoute
                user={globalUserData}
                maindeptname="all"
                jobname="Leader"
              >
                <KHOSUB />
              </ProtectedRoute>
            }
          />
          <Route
            path="khothat"
            element={
              <ProtectedRoute
                user={globalUserData}
                maindeptname="all"
                jobname="Leader"
              >
                <KHOLIEU />
              </ProtectedRoute>
            }
          />
          <Route
            path="inspection"
            element={
              <ProtectedRoute
                user={globalUserData}
                maindeptname="all"
                jobname="Leader"
              >
                <KIEMTRA />
              </ProtectedRoute>
            }
          />
          <Route
            path="capamanager"
            element={
              <ProtectedRoute
                user={globalUserData}
                maindeptname="all"
                jobname="Leader"
              >
                <CAPA_MANAGER />
              </ProtectedRoute>
            }
          />
          <Route
            path="planresult"
            element={
              <ProtectedRoute
                user={globalUserData}
                maindeptname="all"
                jobname="Leader"
              >
                <PLANRESULT />
              </ProtectedRoute>
            }
          />
          <Route
            path="baocaosx"
            element={
              <ProtectedRoute
                user={globalUserData}
                maindeptname="all"
                jobname="Leader"
              >
                <BCSX />
              </ProtectedRoute>
            }
          />
          <Route
            path="tinhluongP3"
            element={
              <ProtectedRoute
                user={globalUserData}
                maindeptname="all"
                jobname="Leader"
              >
                <TINHLUONGP3 />
              </ProtectedRoute>
            }
          />
        </Route>
        <Route
          path="nhansu"
          element={
            <ProtectedRoute
              user={globalUserData}
              maindeptname="all"
              jobname="all"
            >
              <NhanSu />
            </ProtectedRoute>
          }
        >
          <Route index element={<AccountInfo />} />
          <Route
            path="quanlyphongbannhanvien"
            element={
              <ProtectedRoute
                user={globalUserData}
                maindeptname="all"
                jobname="leader"
              >
                <QuanLyPhongBanNhanSu />
              </ProtectedRoute>
            }
          />
          <Route
            path="diemdanhnhom"
            element={
              <ProtectedRoute
                user={globalUserData}
                maindeptname="all"
                jobname="leader"
              >
                <DiemDanhNhomCMS option="diemdanhnhom" />
              </ProtectedRoute>
            }
          />
          <Route
            path="dieuchuyenteam"
            element={
              <ProtectedRoute
                user={globalUserData}
                maindeptname="all"
                jobname="leader"
              >
                <DieuChuyenTeam
                  option1="diemdanhnhom"
                  option2="workpositionlist"
                />
              </ProtectedRoute>
            }
          />
          <Route path="dangky" element={<TabDangKy />} />
          <Route
            path="pheduyetnghi"
            element={
              <ProtectedRoute
                user={globalUserData}
                maindeptname="all"
                jobname="leader"
              >
                <PheDuyetNghi option="pheduyetnhom" />
              </ProtectedRoute>
            }
          />
          <Route path="lichsu" element={<LichSu />} />
          <Route
            path="baocaonhansu"
            element={
              <ProtectedRoute
                user={globalUserData}
                maindeptname="all"
                jobname="leader"
              >
                <BaoCaoNhanSu />
              </ProtectedRoute>
            }
          />
          <Route
            path="quanlycapcao"
            element={
              <ProtectedRoute
                user={globalUserData}
                maindeptname="all"
                jobname="leader"
              >
                <QuanLyCapCao />
              </ProtectedRoute>
            }
          />
          <Route
            path="quanlycapcaons"
            element={
              <ProtectedRoute
                user={globalUserData}
                maindeptname="all"
                jobname="leader"
              >
                <QuanLyCapCao_NS />
              </ProtectedRoute>
            }
          />
          <Route
            path="listchamcong"
            element={
              <ProtectedRoute
                user={globalUserData}
                maindeptname="NS"
                jobname="leader"
              >
                <BANGCHAMCONG />
              </ProtectedRoute>
            }
          />
        </Route>
      </Route>
    </Routes>
  </BrowserRouter>
  )
}

export default AppRoutes