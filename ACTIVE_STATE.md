# ACTIVE_STATE

## Đợt 22.19 — 7 chỉnh sửa chat (mobile close, xoá phòng, phòng rỗng 1-1, xoá hàng loạt, tên bộ phận, lọc media + Link, dán bảng Excel) (2026-10-01)
Trạng thái: **HOÀN THÀNH** — BE `node --check` OK + `node scratch/test_chat_delete_hidden.js` **21/21 PASS**;
`test_chat_service.js` PASS; FE `npm run build` OK, `get_errors` 0. Backend PM2 đã restart.

### Migration (đã chạy): `practice1/scripts/migrate_chat_hidden_cleared.js`
- `ZTB_CHAT_PARTICIPANT.HIDDEN BIT NOT NULL DEFAULT 0` — phòng DIRECT vừa tạo chưa gõ tin thì ẩn với đối phương.
- `ZTB_CHAT_PARTICIPANT.CLEARED_BEFORE_MESSAGE_ID INT NOT NULL DEFAULT 0` — mốc "xoá phòng chat" theo từng người.

### Backend (`practice1`)
- `chatRepository`: `listConversations` lọc `HIDDEN=0` + ẩn phòng nếu `LAST_MESSAGE_ID <= CLEARED`; `listMessages`/
  `searchMessages`/`listConversationMedia` bỏ tin `<= CLEARED` của người xem; thêm `setParticipantVisibility`,
  `startConversation` (bỏ ẩn khi có tin đầu), `clearConversationForUser`; `ensureParticipant({visible})`;
  `searchMessages({hasLink})`; `listConversationMedia({keyword, senderEmplNo})`.
- `chatMessageCore.sendMessage`: sau khi lưu tin ⇒ `repo.startConversation()` mở phòng cho mọi thành viên.
- `chatRoomService`: `deptSuffix` chỉ còn `[SUBDEPTNAME]`; `buildConversationView` lấy peer DIRECT từ TẤT CẢ thành viên;
  `chatGetOrCreateDirect` đặt HIDDEN cho đối phương khi phòng rỗng; command mới `chatDeleteConversation`,
  `chatDeleteMessages` (mode `hide`|`recall`); truyền `hasLink`/`keyword`/`senderEmplNo`.
- Socket mới: `chat:conversation-cleared`, `chat:messages-deleted`, `chat:messages-hidden` (FE đã lắng nghe).

### Frontend (`cmsnewerp2/src/components/Chat`)
- `ChatConversationList`: nút ĐÓNG (mobile, cạnh nút +) + mục menu "Xoá phòng chat" kèm hộp xác nhận.
- `ChatConversationView`: nút "Xoá" trong thanh chọn nhiều + hộp xác nhận (ẩn phía tôi / thu hồi 2 phía);
  dán BẢNG (`chatClipboardTable.ts`: `clipboardHasTable`/`extractTableGrid`/`renderGridToPngFile`) ⇒ hộp thoại chọn Ảnh/Chữ.
- `chatUtils`: `memberDeptLabel`/`stripDeptSuffix` chỉ giữ `[SUBDEPTNAME]`.
- `ChatSearchPanel` + `ChatMediaDialog`: chip lọc **Link** (`hasLink`); media dialog thêm từ khoá/người gửi/ngày + preset.
- `useChatController`: `deleteConversation`, `deleteMessages` + xử lý socket mới.
- `chat.scss`: `.erp-chat__tablePreview`.

### Restyle Media & Tệp (mobile + desktop) — cùng ngày
- Thêm `ChatSenderField.tsx` — AutoComplete chọn người gửi (search theo TÊN không dấu **hoặc** MÃ, `autoHighlight`,
  avatar + tên + mã/chức danh, popper `.erp-chat__senderPopper` global, có `label` để thẳng hàng với ô ngày).
- `ChatMediaDialog`: bộ lọc thành "card" 3 hàng (từ khoá + Áp dụng/Xoá lọc → Người gửi + Từ/Đến ngày →
  Khoảng + chip Loại), Dialog flex-column tự cuộn, mobile **toàn màn hình**, lưới ảnh/nhãn gọn hơn.
- `ChatSearchPanel`: dùng chung `ChatSenderField`, `.erp-chat__searchFilters` xếp dọc.
- `chat.scss`: block cuối file `Media & Tệp ... restyle` + media query ≤640px. `npm run build` OK.

### Follow-up (cùng ngày) — lọc 1 dòng + rời hội thoại 1-1
- **Thanh lọc 1 DÒNG (desktop)**: `ChatMediaDialog` + `ChatSearchPanel` gom `tìm kiếm · Người gửi (AutoComplete) ·
  Từ ngày · Đến ngày · Áp dụng · Xoá lọc` vào `.erp-chat__filterBar` (`flex-wrap: nowrap` ≥760px); chip ở
  `.erp-chat__chipBar`. `ChatDateField` thêm `compact` (bỏ nhãn trên, dùng nhãn làm placeholder trong ô, cao 34px).
  `ChatSenderField` dùng `placeholder="Người gửi"` (không còn nhãn). Mặc định **Từ/Đến = HÔM NAY** ở cả 2 cửa sổ.
  Mobile: search 100%, người gửi 100%, 2 ô ngày chia đôi, 2 nút chia đôi.
- **Rời hội thoại 1-1**: `ChatGroupPanel` thêm nút "Rời hội thoại" cho `CONV_TYPE='DIRECT'` → `chatLeaveGroup`.
  Backend giữ nguyên hội thoại cho bên còn lại (chỉ `LEFT_AT` người rời; không đóng vì chỉ GROUP mới đóng khi rỗng).
  ⚠️ **BUG ĐÃ SỬA**: `chatLeaveGroup` tạo tin hệ thống SAU khi set `LEFT_AT` ⇒ người rời không còn là thành viên
  nên `core.sendMessage` trả FORBIDDEN ⇒ **tin báo không bao giờ hiện**. Nay tạo tin TRƯỚC khi đánh dấu rời;
  nội dung DIRECT = "… đã rời hội thoại", GROUP = "… đã rời nhóm".
  Verify: `node scratch/test_direct_leave.js` → **6/6 PASS**; `test_chat_service.js` PASS; `npm run build` OK.

### Follow-up 2 (cùng ngày) — điều kiện thu hồi + tạo nhóm theo phòng ban
- **Thu hồi tin nhắn**: trước đây `canRecall = canModerate` ⇒ OWNER/ADMIN/MODERATOR thu hồi được tin **người khác**.
  Nay **CHỈ tin của chính mình**; được phép khi **đối phương CHƯA XEM** HOẶC trong **10 phút**
  (`CHAT_RECALL_WINDOW_MINUTES`). Backend `checkRecallAllowed` (repo: `getMessageRecallInfo` DATEDIFF +
  `listMemberReadState`) chặn cả `chatDeleteMessage` lẫn `chatDeleteMessages` mode `recall` (trả `skipped`).
  FE: `chatUtils.messageAgeMinutes` + `canRecallMessage` (view) → menu chỉ hiện khi đủ điều kiện; bulk recall
  báo "Đã thu hồi X · bỏ qua Y". `ChatMessageMenu` bỏ điều kiện `mine || canRecall`.
  Verify: `scratch/test_chat_recall.js` → **6/6 PASS**; `test_chat_service.js`/`test_chat_rich.js` PASS.
- **Tạo nhóm theo phòng ban**: bỏ whitelist `NHU1903` (`SUPER_ADMIN_EMPL_NOS` đã xoá) — `chatSearchEmployees {all:true}`
  mở cho MỌI tài khoản. `ChatNewChatDialog` thêm hàng lọc **Phòng ban (MAINDEPTNAME) + Bộ phận (SUBDEPTNAME)**
  (nguồn = danh sách all nạp 1 lần khi mở) + nút "Chọn cả bộ phận (N)" (chọn hàng loạt, gợi ý tên nhóm "Bộ phận X").
  `test_chat_select_all.js` cập nhật kỳ vọng → **14/14 PASS**.

### Follow-up 3 (cùng ngày) — Tag @All + dán bảng Excel giống hệt
- **Tag @All**: `chatUtils` thêm `MENTION_ALL_ID="__ALL__"`, `MENTION_ALL_NAME="All"`, `matchesMentionAll(key)`
  (khớp "all"/"moi"/"moinguoi"/"tatca"/"everyone"). `ChatConversationView`: mục `@All` đứng ĐẦU danh sách gợi ý;
  chèn `@All ` và đánh dấu **mọi thành viên khác** vào `mentions`. `ChatMessageBubble`: thêm All vào `memberNames`
  để TÔ SÁNG `@All` nhưng **không mở chat riêng** khi bấm. (Không cần đổi backend — `mentions` đã được hỗ trợ.)
- **Bug "Dán dạng chữ" không chạy**: `ChatRichEditorHandle` khai báo `insertText` nhưng `useImperativeHandle`
  THIẾU hàm này ⇒ `richEditorRef.current.insertText is not a function`. Đã bổ sung `insertText`.
- **Ảnh dán giống bảng Excel**: `chatClipboardTable.renderTableHtmlToPngFile(html)` — render bảng ngoài màn hình
  rồi đọc `getComputedStyle` từng ô (nền/viền/font/màu/canh lề) và **vẽ lên canvas** (fillRect + stroke + fillText
  tự ngắt dòng); đổi `windowtext` (màu hệ thống Excel) → `#000000`. `applyTableAsImage` ưu tiên HTML gốc, `null`
  thì rơi về `renderGridToPngFile`. `tablePaste` giữ `{ grid, html }`. FE build OK, `get_errors` 0.
  ⚠️ **Không dùng `SVG <foreignObject>`**: Chrome taint canvas ⇒ `toBlob` lỗi ⇒ ảnh ra xám (đã từng bị).
  ⚠️ **Đường kẻ**: Excel khai viền bằng `mso-border-*-alt` (Chrome bỏ qua) ⇒ `translateExcelStyles` đổi sang
  `border-*` chuẩn + `windowtext`→`#000000`; viền `.5pt` = 1px; có lưới dự phòng nếu đọc ra 0 cạnh.
  🆕 Bỏ **dòng bị ẩn** (`mso-hide:all`/`display:none`/kích thước 0). Dialog dán bảng có **2 kiểu ảnh**:
  "Ảnh theo HTML" (render) và "Ảnh gốc Excel" (bitmap Excel đặt kèm clipboard) + "Dán dạng chữ".

## Fix 30.9 — ĐƠN NHIỆM: page dưới route layout trung gian sụp 0px (2026-09-30)
Trạng thái: **HOÀN THÀNH & ĐÃ KIỂM CHỨNG** — `npm run build` OK; verify Playwright cả 2 chế độ.

- **Triệu chứng:** `/sx/datasx` (`BAOCAOSXALL`) — thanh tab con hiện nhưng vùng nội dung trắng trơn. Đa nhiệm OK.
- **Nguyên nhân:** ở đơn nhiệm page được render qua route layout `/sx` → `QC` (`<div className="qc"><Outlet/></div>`).
  Wrapper pass-through này chen giữa `.component_element--single` và page gốc, làm đứt mạch `height:100%`:
  `.qlsxplan` → `auto` ⇒ `.tabs-container`/`.tab-content` (MyTabs, `flex:1 1 0; min-height:0`) sụp còn **0px**.
  Đa nhiệm không dính vì `Home.tsx` render `MENU_ITEM` là con TRỰC TIẾP của `.component_element`.
- **Fix:**
  - `src/pages/qc/QC.tsx`: thêm class `route-outlet-wrapper` cho div bọc `<Outlet/>`.
  - `src/pages/home/home.scss`: rule `.component_element > .route-outlet-wrapper`
    (`display:flex; flex-direction:column; height:100%; min-height:0` + `> * { flex:1 1 auto; min-height:0 }`).
- **Nợ kỹ thuật còn lại:** các route layout pass-through khác (`kinhdoanh`, `qlsx`, `sx`, `muahang`, `info`, NhanSu)
  **chưa** gắn `route-outlet-wrapper` ⇒ page con dùng mạch `height:100%` vẫn có thể sụp ở đơn nhiệm.
  Cách sửa: thêm class `route-outlet-wrapper` cho div bọc `<Outlet/>` của chúng (rule SCSS đã dùng chung).

## Đợt 22.9 — Chia sẻ tin nhắn / tệp / ảnh RA app bên ngoài (Web Share) (2026-09-30)
Trạng thái: **HOÀN THÀNH & ĐÃ KIỂM CHỨNG** — `npm run build` OK, `get_errors` 0 lỗi, verify end-to-end trên trình duyệt.

### 1. Module `src/components/Chat/chatShareOut.ts`
Một chỗ duy nhất lo toàn bộ việc chia sẻ ra ngoài, với **3 chế độ dự phòng theo thứ tự**:
| Chế độ | Khi nào | Hành vi |
|---|---|---|
| `native` | Trình duyệt có `navigator.share` (+ `canShare({files})` nếu kèm tệp) | Mở bảng chia sẻ của HĐH — chia sẻ được cả tệp thật |
| `clipboard` | Không có Web Share API, nội dung chỉ là chữ | Sao chép nội dung để dán sang app khác |
| `download` | Không chia sẻ được tệp | Sao chép nội dung + tải tệp về máy để gửi thủ công |

- Người dùng tự đóng bảng chia sẻ (`AbortError`) ⇒ coi là "đã huỷ", **không** báo lỗi.
- Giới hạn: tối đa **5 tệp** và **120MB**/lượt (vượt ngưỡng thì bỏ qua đường chia sẻ tệp để tránh treo tab).
- Nội dung chia sẻ của 1 tin nhắn: `— Người gửi · Tên phòng · giờ —` + nội dung + `📎 tên tệp` + liên kết `?chat=<id>`.
- `shareMessageOut` (cả tin), `shareAttachmentOut` (1 ảnh/tệp), `shareMediaItemOut` (mục trong cửa sổ Media), `shareTextOut`.

### 2. Bốn điểm bấm chia sẻ
1. **Menu hành động** (chuột phải / nhấn giữ): mục "Chia sẻ ra ngoài" kèm mô tả phụ.
2. **Nút hover trên bong bóng** (`erp-chat__rowActions`) — cùng hàng với Trả lời / cảm xúc / Chuyển tiếp.
3. **Nút trên ảnh** (`erp-chat__imageShare`): chỉ chia sẻ đúng ảnh đó; ẩn cho tới khi hover, luôn hiện trên thiết bị cảm ứng.
4. **Cửa sổ Media & tệp**: nút chia sẻ trên từng ô ảnh và từng dòng tệp (có snackbar riêng).

### 3. Hai lỗi thật phát hiện khi kiểm chứng
- **Thuộc tính `download` KHÔNG có tác dụng với URL khác origin.** File chat nằm ở host API (3007) còn app ở 3001,
  nên thẻ `<a download href="...3007/chatfile/41">` bị trình duyệt **điều hướng thẳng** sang ảnh thay vì tải xuống.
  ⇒ Đã đổi sang `fetch` lấy blob → `URL.createObjectURL` (cùng origin) rồi mới bấm tải; tệp > 120MB thì mở tab mới.
- **Deep-link `/?chat=<id>` không hoạt động.** `ChatDock` dùng `setTimeout(..., 350)` để chờ danh sách hội thoại,
  nhưng React **StrictMode** (dev) chạy effect 2 lần: cleanup của lần chạy đầu **huỷ mất timer** ⇒ không bao giờ
  chọn phòng. Đã thay bằng ref + effect riêng chọn phòng **khi danh sách đã nạp xong** (idempotent, không dùng timer).
  Lỗi này ảnh hưởng cả thông báo đẩy lẫn liên kết chia sẻ.

### Kiểm chứng đã chạy
- Ảnh trong bong bóng: `navigator.share` nhận **1 tệp thật** `image.png` (406.810 byte) nạp từ `/chatfile`.
- Chia sẻ cả tin nhắn: nhận `text` đầy đủ (header + "test anh copy" + `📎 image.png` + link) **và** tệp ảnh; toast "Đã chia sẻ tin nhắn kèm ...".
- Không có Web Share (Chromium headless): tin chữ ⇒ toast "Đã sao chép nội dung — dán vào app bạn muốn gửi";
  tin có tệp ⇒ toast "Đã sao chép nội dung & tải 1/1 tệp để gửi thủ công" và **URL không bị đổi** (trước khi sửa thì bị điều hướng).
- Cửa sổ Media: chia sẻ tệp PDF trong danh sách ⇒ hiện đúng toast dự phòng.
- `/?chat=25` ⇒ mở đúng phòng "okkk", mục danh sách được tô sáng, 20 bong bóng.

### Ghi chú vận hành
- Web Share API yêu cầu **secure context**: HTTPS hoặc `localhost`. Deploy qua HTTP thường sẽ rơi vào nhánh `clipboard`/`download`.
- Trên máy tính chỉ Chrome/Edge mới có bảng chia sẻ; **Firefox desktop không hỗ trợ** ⇒ tự động dùng dự phòng.

## Đợt 22.8 — Avatar phòng chat & nhận chia sẻ từ app khác (PWA Share Target) (2026-09-30)
Trạng thái: **HOÀN THÀNH & ĐÃ KIỂM CHỨNG** — `npm run build` OK, `get_errors` 0 lỗi, verify end-to-end bằng Playwright + DB.

### 1. Avatar phòng (icon mặc định + ảnh tải lên)
- `ZTB_CHAT_CONVERSATION.AVATAR` nhận 1 trong 3 dạng: `icon:<id>` | `/chatavatar/<file>` | NULL (không đổi schema).
- `routes/chatAvatar.js` mount `/chatavatar`: POST upload **chỉ cần đăng nhập** (avatar phải upload được TRƯỚC khi
  tạo nhóm nên không thể dùng `/chatfile` vốn yêu cầu là thành viên phòng), ảnh ≤ 5MB, lưu `outbinary/chatavatars/`;
  GET công khai + chặn path traversal.
- `chatRoomService`: `AVATAR_ICONS` (16 id, khớp FE) + `normalizeAvatar()`; `chatUpdateGroup` thêm tham số
  `@CLEAR_AVATAR` để phân biệt "không đổi" với "xoá avatar"; `buildConversationView` trả `DISPLAY_AVATAR` cho nhóm.
- FE: `chatAvatars.tsx` (preset + `ChatRoomAvatar` dùng chung cho danh sách/tiêu đề/dialog) và
  `ChatAvatarPicker.tsx` (16 swatch + "Tải ảnh lên" + "Bỏ avatar"), gắn ở dialog tạo nhóm và panel quản lý nhóm.

### 2. Nhận chia sẻ từ app khác (Zalo, Kakao, Gallery…) vào PWA
Luồng: app khác → Chia sẻ → chọn ERP → POST multipart `/share-target` → **service worker chặn**, lưu payload vào
**Cache API** rồi **redirect 303 về `/?shared=1`** → app đọc payload và mở hộp chọn phòng chat.
- `manifest.json`: thêm `share_target` (multipart, field `files`) và `file_handlers` (ảnh/pdf).
- `public/service-worker.js`: listener `fetch` xử lý POST, chuyển tệp sang base64, lưu vào cache
  `erp-share-target-v1` (Cache API vì SW không truy cập được localStorage của trang).
- FE: `chatShareTarget.ts` (đọc + xoá payload, chuyển base64 → `File`, đọc `launchQueue` cho `file_handlers`),
  `ChatShareDialog.tsx` (xem trước + sửa nội dung + chọn phòng), `ChatDock` tự phát hiện payload khi mount;
  `sendMessage` nhận thêm `conversationId` để gửi vào phòng được chọn.

### Lưu ý quan trọng khi vận hành
- **Không redirect về `/share-target`** vì React Router không có route đó (chỉ log "No routes matched" và không render gì)
  ⇒ chuyển hướng về trang chủ kèm `?shared=1` rồi `history.replaceState`.
- Sau khi sửa `service-worker.js`, tab đang mở vẫn do SW **cũ** điều khiển (controller có thể null) ⇒ phải gỡ đăng ký /
  đóng hết tab rồi mở lại, nếu không POST sẽ trả 404 (không ai chặn).
- Web Share Target chỉ hoạt động khi app đã **cài như PWA**, trên **Android/Chrome và Windows/Chrome-Edge**;
  **iOS Safari không hỗ trợ** (chỉ có `navigator.share` chiều gửi đi).

### Kiểm chứng đã chạy
- Tạo nhóm với icon "Dự án" ⇒ danh sách + tiêu đề hiện ô icon tím `rgb(124,58,237)`.
- Upload ảnh PNG trong panel nhóm ⇒ header đổi sang `/chatavatar/<file>` + thông báo "Đã cập nhật avatar phòng".
- POST `/share-target` (FormData có tiêu đề + text + ảnh) ⇒ SW lưu cache (1 tệp) và redirect `/?shared=1`;
  nạp `/?shared=1` ⇒ hộp "Chia sẻ vào chat nội bộ" mở với ảnh xem trước, text và danh sách phòng.
- Chọn phòng và Gửi ⇒ DB ghi tin `MSG_TYPE='IMAGE'`, nội dung chia sẻ, tệp `anh-tu-zalo.png`.

## Đợt 22.7 — Múi giờ Việt Nam, restyle bộ lọc, tag tên theo tên nhân viên (2026-09-30)
Trạng thái: **HOÀN THÀNH & ĐÃ KIỂM CHỨNG** — `npm run build` OK, `get_errors` 0 lỗi,
`scratch/test_chat_search_media.js` PASS 32/32, verify bằng Playwright.

### 1. Múi giờ — lấy giờ Việt Nam làm mặc định
Chuỗi thực tế: SQL Server dùng `GETDATE()` ⇒ cột thời gian lưu **giờ VN**; driver mssql đặt `useUTC: true`
⇒ khi đọc trả về Date có thành phần UTC đúng bằng giờ VN, khi ghi thì lấy thành phần UTC của Date.
- **Lỗi hiển thị +7 giờ:** FE dùng `moment.utc(v).local()` nên cộng thêm 7 giờ khi trình duyệt ở VN.
  Đã thay bằng `vnMoment(v) = moment.utc(v)` (đọc thẳng số giờ VN, không phụ thuộc múi giờ máy khách) +
  `vnNow()/vnToday()/vnDayOffset()` cho `shortTime`, `dayLabel`, `timeLabel`.
- **Lỗi lọc theo ngày lệch 7 giờ:** `parseDayStart/parseDayEnd` phải dựng Date bằng `Date.UTC(...)`
  (không dùng `new Date(y,m,d)` — driver sẽ chuyển thành 17:00 hôm trước). `toDate` = 00:00 ngày kế tiếp, so sánh `<`.

### 2. Restyle bộ lọc tìm kiếm + mặc định hôm nay
- Mặc định `Từ ngày = Đến ngày = hôm nay (giờ VN)`; thêm preset **Hôm nay / 7 ngày / 30 ngày / Tất cả**;
  bố cục lại thành các hàng rõ ràng (người gửi + 2 ô ngày / khoảng / loại tệp / nút).
- `ChatDateField` tự viết: hiển thị `dd/MM/yyyy` theo ý mình, mở lịch gốc của trình duyệt qua input ẩn + `showPicker()`.
  (Không dùng MUI X DatePicker vì AdapterMoment lấy tên thứ/tháng từ locale toàn cục của moment, mà Vite tách
  `moment/locale/vi` sang instance khác nên lịch MUI luôn hiện tiếng Anh.)
- ⚠️ Emotion của MUI ghi đè `min-width` ⇒ phải viết selector 2 lớp `.erp-chat__filterRow .erp-chat__filterSelect`
  (đã từng bị ô "Người gửi" co còn 46px).

### 3. Tag tên theo TÊN nhân viên + điều hướng bàn phím
- **Lỗi gốc đã sửa:** `buildConversationView` gọi `memberView` **hai lần** (caller đã map sẵn rồi truyền vào)
  ⇒ mất `MIDLAST_NAME`/`FIRST_NAME` nên `FULL_NAME` rơi về mã nhân viên. Đây là lý do dropdown tag, panel nhóm,
  tên người gửi trong bong bóng/reply/reaction đều hiện mã. Nay hàm tự map **một lần**, caller truyền dòng thô.
- Khớp **không dấu** (NFD + bỏ dấu + đ→d) nên gõ `@ng` ra "Nguyễn Đức Anh"; khớp cả mã nhân viên; ưu tiên bắt đầu bằng từ khoá.
- Dropdown hiện **Tên (MÃ_NV) + chức danh**, có dòng gợi ý; **↑↓ di chuyển, Enter/Tab chọn, Esc đóng**
  (mục đang chọn tự cuộn vào vùng nhìn thấy).
- `renderMentions` khớp tên nhiều từ lẫn mã nhân viên ⇒ tag hiển thị và bấm được để mở chat riêng.

### Kiểm chứng đã chạy
- `scratch/test_chat_search_media.js` → **PASS 32/32** (thêm test: tin nhắn 23:00 giờ VN hôm nay vẫn thuộc lọc "hôm nay").
- Playwright: tin gửi lúc 05:18 hiển thị đúng `05:18` (trước đây lệch +7 giờ); bộ lọc hiện `dd/MM/yyyy`,
  preset "Hôm nay" mặc định, ô "Người gửi" rộng 168px; gõ `@ng` ra "Nguyễn Đức Anh"; ↓ rồi Enter chèn
  `@KYUNG SOK BUYN `; gửi tin ⇒ cả 2 tag tên nhiều từ hiển thị dạng nút bấm được.
- Dọn dẹp: `scratch/cleanup_chat_testconv.js`, `scratch/reset_my_files.js`.

## Đợt 22.6 — Paste tệp, "My Files", tìm kiếm & media timeline, giới hạn 1GB (2026-09-30)
Trạng thái: **HOÀN THÀNH & ĐÃ KIỂM CHỨNG** — `npm run build` (`✓ built in 1m 23s`), `get_errors` 0 lỗi,
`scratch/test_chat_search_media.js` PASS 30/30, verify end-to-end bằng Playwright.

### 1. Giới hạn mỗi tệp lên 1GB
- `routes/chatFile.js`: mặc định `1024 * 1024 * 1024` (đổi bằng env `CHAT_UPLOAD_MAX_BYTES`); mở rộng allowlist
  MIME/đuôi cho video, audio, rar/7z/tar/gz, odt/ods/odp, rtf, svg, pps...
- **Bọc multer để bắt `LIMIT_FILE_SIZE`** ⇒ trả JSON 413 kèm giới hạn (mặc định Express trả HTML 500 khó hiểu).
- FE `MAX_FILE_BYTES = 1GB`; cột `ZTB_CHAT_ATTACHMENT.FILE_SIZE` là `BIGINT` nên không cần đổi schema.

### 2. "My Files" — cloud cá nhân cho mọi user
- Hội thoại mới `CONV_TYPE = 'SELF'`, `DIRECT_KEY = 'SELF|<EMPL_NO>'` (dùng lại unique index `UX_CHAT_CONV_DIRECT`
  để chống tạo trùng), 1 participant ROLE `OWNER`.
- `repo.ensureSelfConversation` được gọi trong **cả `chatBootstrap` và `chatSync`** ⇒ phòng luôn tồn tại.
- `buildConversationView` xử lý SELF: tên "My Files", không có peer/avatar; `pushOfflineChat` tự bỏ qua vì là chính mình.
- FE: avatar thư mục teal trong danh sách; header "Cloud cá nhân, dung lượng không giới hạn · N tệp";
  command `chatConversationStorage` cấp số liệu dung lượng.
- **Lưu ý:** phải theo dõi "chữ ký" tin cuối (MESSAGE_ID + số tệp) chứ không dùng `messages.length` — tin lạc quan
  được thêm TRƯỚC khi upload xong nên đếm theo length sẽ ra sai (đã gặp: hiện "0 tệp").

### 3. Tìm kiếm & xem media
- `repo.searchMessages` (command `chatSearchMessages`): từ khoá khớp **nội dung hoặc tên tệp**, người gửi,
  khoảng ngày, loại tệp (`image/video/audio/pdf/word/excel/csv/ppt/zip/other`), `onlyWithFiles`, phân trang;
  bỏ `conversationId` ⇒ tìm toàn cục trong mọi phòng user tham gia.
- `repo.listConversationMedia` (command `chatListMedia`) + `repo.getConversationStorage`.
- ⚠️ **Lỗi múi giờ đã sửa:** `new Date("2026-09-30")` là 00:00 **UTC** còn DB lưu `GETDATE()` (giờ máy) ⇒ tin tạo
  trong khoảng 00:00–07:00 giờ VN bị loại oan. Đã thêm `parseDayStart`/`parseDayEnd` theo **giờ địa phương**.
- UI: `ChatSearchPanel` (dùng chung cho cả 2 phạm vi) với ô từ khoá + lọc người gửi + Từ/Đến ngày + chip loại tệp;
  `ChatMediaDialog` hiển thị lưới ảnh + danh sách tệp **phân nhóm theo ngày dạng timeline**.
- Bấm kết quả tìm kiếm ⇒ `jumpToMessage()` mở đúng phòng, nạp thêm trang nếu tin chưa có, cuộn tới giữa và
  làm nổi bật 2.4 giây.

### 4. Dán ảnh/tệp từ clipboard
- Listener `paste` gắn ở **document** (sự kiện chỉ phát cho phần tử đang focus), chỉ `preventDefault` khi thật sự có tệp.
- `clipboardFiles()`: ưu tiên `dataTransfer.files`, nếu rỗng mới dùng `items` (Chrome có thể trả cả hai ⇒ dễ trùng);
  ảnh copy từ web không có tên ⇒ đặt `clipboard-<ts>.<ext theo MIME>`.
- Tệp dán vào đi qua đúng `addFiles()` ⇒ dùng chung giới hạn 1GB/5 tệp, hiện chip chờ gửi + toast xác nhận.

### Kiểm chứng đã chạy
- `node scratch/test_chat_search_media.js` → **PASS 30/30** (tự tạo 7 tệp pdf/xlsx/docx/pptx/zip/png/bin + tin có từ khoá,
  kiểm tra mọi bộ lọc/loại tệp/media/dung lượng rồi tự dọn).
- Playwright: paste 2 tệp (ảnh không tên → `clipboard-<ts>.png`), gửi ⇒ bong bóng có 1 ảnh + thẻ PDF;
  cửa sổ media hiện timeline + 10 chip lọc; tìm theo TÊN TỆP đúng; lọc PDF/Ảnh đúng; bấm kết quả ⇒ nhảy + highlight;
  tìm toàn cục hiện nhãn phòng.
- Dọn dẹp: `node scratch/reset_my_files.js [EMPL_NO]`.

## Đợt 22.5 — Kéo-thả tệp, biểu tượng loại tệp, cuộn đáy, sửa badge chưa đọc (2026-09-29)
Trạng thái: **HOÀN THÀNH & ĐÃ KIỂM CHỨNG** — `npm run build` (`✓ built in 1m 7s`), `get_errors` 0 lỗi,
verify bằng Playwright + truy vấn DB.

### 1. Kéo–thả tệp vào khung chat
`ChatConversationView` gắn `onDragEnter/DragOver/DragLeave/Drop` lên `.erp-chat__main`:
- Chỉ xử lý khi `dataTransfer.types` có `"Files"`; **bắt buộc `preventDefault` ở `dragover`** thì trình duyệt mới cho thả.
- Đếm độ sâu `dragDepthRef` để lớp phủ không nhấp nháy khi rê qua phần tử con.
- Lớp phủ `.erp-chat__dropOverlay` có `pointer-events: none` (nếu không sẽ tự cản sự kiện drop).
- Tệp thả vào đi qua đúng `addFiles()` cũ ⇒ giữ nguyên giới hạn 25MB và tối đa 5 tệp.

### 2. Biểu tượng theo loại tệp
`chatUtils.tsx` bổ sung `fileKindOf(name, mimeType)` (pdf | word | excel | csv | powerpoint | zip | image | audio |
video | text | file), `FILE_KIND_COLOR` và component `FileKindIcon`.
**Ưu tiên đuôi tên tệp** vì trình duyệt hay trả MIME chung chung (`application/octet-stream`).
Dùng cho thẻ tệp trong bong bóng (ô biểu tượng + huy hiệu đuôi + tên + dung lượng + nút tải) và chip tệp chờ gửi.
Ảnh vẫn render `<img>` như trước nhưng nhận diện qua `fileKindOf`.

### 3. Luôn cuộn xuống tin mới nhất khi mở hội thoại
- `scrollToBottom()` gọi lặp 4 nhịp (ngay, rAF, 90ms, 320ms) vì chiều cao danh sách còn đổi sau khi render.
- Effect cuộn cũ chạy khi đổi phòng nhưng lúc đó `messages` còn rỗng nên vô tác dụng ⇒ thêm cờ `pendingScrollRef`:
  đổi phòng thì bật cờ, chỉ cuộn khi `loading === false && messages.length > 0`.
- Vẫn giữ luật "chỉ tự cuộn khi đang ở gần đáy" cho tin nhắn mới để không phá thao tác đọc tin cũ.

### 4. Lỗi badge chưa đọc không mất sau khi xem (đã sửa)
**Nguyên nhân thật:** `markRead` đọc `messages[conversationId]` từ **closure của render hiện tại**, nhưng trong
`selectConversation` nó được gọi ngay sau `setMessages(...)` ⇒ closure còn bản cũ ⇒ `lastId = 0` ⇒ hàm `return` sớm
⇒ **không gửi `chat:read` lên server**. UI vẫn tự đặt `UNREAD_COUNT = 0` nên trông như đã đọc, còn
`LAST_READ_MESSAGE_ID` trong DB không đổi ⇒ **F5 là badge quay lại**.
- Sửa: `markRead(conversationId, explicitLastId?)` ưu tiên id truyền vào, nếu không thì đọc `messagesRef.current`
  (ref gán mỗi render); `selectConversation` truyền thẳng id mới nhất vừa tải.
- **Bài học:** đừng đọc state trong closure ngay sau khi vừa `setState` — truyền giá trị tường minh hoặc dùng ref.

### Kiểm chứng đã chạy
- Cuộn: `atBottom = true` khi mở hội thoại.
- Kéo–thả 4 tệp (pdf/csv/zip/png) ⇒ lớp phủ hiện rồi biến mất, 4 chip đúng biểu tượng/màu; gửi ⇒ bong bóng có
  3 thẻ tệp `PDF/CSV/ZIP` + tên + dung lượng và 1 ảnh; tải lại trang vẫn còn đủ.
- Badge: đóng cửa sổ chat → đối phương gửi tin ⇒ navbar hiện `1`; mở hội thoại ⇒ hết số; **F5 ⇒ không còn badge**.
- DB (`node scratch/inspect_read_state.js NHU1903`): `LAST_READ_MESSAGE_ID = 69 = NEWEST_MESSAGE_ID`, `UNREAD_COUNT = 0`.

## Đợt 22.4 — Tim bay cả 2 phía & sửa lỗi "onTyping is not defined" (2026-09-29)
Trạng thái: **HOÀN THÀNH & ĐÃ KIỂM CHỨNG** — `npm run build` (`✓ built in 1m 50s`), `get_errors` 0 lỗi,
verify end-to-end bằng Playwright (bắt trực tiếp gói tin socket).

### 1. `ReferenceError: onTyping is not defined` (gõ ô soạn tin là crash)
`ChatDock` truyền `onTyping={controller.notifyTyping}` nhưng `ChatConversationView` **không khai báo prop này
trong interface `Props` và không destructure** ⇒ biến không tồn tại ⇒ lỗi mỗi lần gõ, chỉ báo "đang nhập"
không bao giờ hoạt động.
- Đã thêm `onTyping: (typing: boolean) => void` vào `Props` + destructure.
- **Bài học:** TypeScript KHÔNG phát hiện prop thừa khi component không dùng `...rest` ⇒ thêm prop phải sửa
  đồng thời 3 chỗ: interface `Props`, danh sách destructure, nơi truyền (và type trả về của hook).

### 2. Typing bền hơn khi socket nối lại
Server chỉ phát `chat:typing` vào **room phòng**, nên nếu socket mất kết nối rồi tự nối lại thì client mất room
⇒ typing im lặng. Đã thêm listener `connect` trong `useChatController` để tự `chat:join` lại phòng đang mở
(và join ngay nếu socket đã kết nối lúc hook mount).

### 3. Hiệu ứng tim bay hiện ở CẢ HAI phía
- Payload `chat:reaction` đã có đủ `emplNo`/`reaction`/`removed`/`reactions` ⇒ không cần thêm event mới.
- Controller giữ `reactionBurst {conversationId, messageId, emplNo, reaction, seq}` (set khi `emplNo !== myEmplNo`),
  truyền xuống `ChatDock` → `ChatConversationView` (lọc theo `messageId`) → `ChatMessageBubble` bắn `spawnFlyer`.
- Phía người bấm vẫn bắn tim ngay khi click; burst của chính mình bị bỏ qua để không nhân đôi.
- **Chống nhân đôi:** server phát sự kiện 2 lần (room phòng + room user) ⇒ dùng chữ ký
  `${messageId}:${actor}:${reaction}:${count}` ⇒ mỗi lần thả đúng **1** flyer.

### Kiểm chứng đã chạy
- `node scratch/peer_socket.js LSG1103 typingloop 16 20000`: trình duyệt nhận `chat:typing` và hiện
  **"LSG1103 đang nhập..."** ở cả header lẫn danh sách hội thoại.
- `... reactloop 16 HAHA 30000`: bên nhận thấy tim bay đúng emoji, `maxFlyersAtOnce = 1` (chống nhân đôi OK).
- Gõ vào ô soạn tin: `pageerror = []` và có emit `chat:typing` (lỗi cũ đã hết).
- Phía người bấm: bấm chip ⇒ 1 flyer, số đếm vẫn tăng bình thường.

### ⚠️ Pitfall khi kiểm thử UI (rất tốn thời gian nếu quên)
Sau khi sửa component, **`page.reload()` thường KHÔNG đủ**: Vite có nội dung mới nhưng trình duyệt vẫn dùng
module đã cache ⇒ UI không đổi dù code đúng. Phải hard reload:
`const cdp = await page.context().newCDPSession(page); await cdp.send('Page.reload', { ignoreCache: true });`
Cách phát hiện: so `fetch('/src/...tsx')` với `fetch('/src/...tsx?probe=' + Date.now())`.

## Đợt 22.3 — Trạng thái online & Đếm cảm xúc + hiệu ứng tim bay (2026-09-29)
Trạng thái: **HOÀN THÀNH & ĐÃ KIỂM CHỨNG** — `node scratch/test_reaction_count.js` PASS,
`npm run build` (`✓ built in 1m 40s`), `get_errors` 0 lỗi, verify end-to-end trên trình duyệt.

### 1. "Đang hoạt động" nhưng status hiển thị "không hoạt động"
Nguyên nhân: chỉ có event `chat:presence` phát khi connect/disconnect; không có cách lấy **danh sách online lúc load**
⇒ status sai cho tới khi có sự kiện, và client dễ so lệch hoa/thường của `EMPL_NO`.
- Thêm `socket/presence.js`: `markOnline/markOffline/isUserOnline/getOnlineEmplNos` (Map in-memory, không deps).
- Connect ⇒ `emitToAll("chat:presence", {emplNo, online:true})` **và** `emitToAll("chat:presence-list", {emplNos})`;
  disconnect khi hết mọi socket ⇒ phát lại cả 2.
- `chatBootstrap` + `chatSync` trả thêm `onlineEmplNos` ⇒ seed ngay khi mở app / refresh badge.
- Client: 1 nguồn duy nhất `onlineUsers: Set<string>` trong `useChatController` (`applySync(list, unread, onlineEmplNos?)`),
  luôn upper-case; listener mới `chat:presence-list` thay thế toàn bộ set.

### 2. Reaction chỉ hiện biểu tượng đã chọn → cần số đếm + thả tim vô hạn có hiệu ứng bay
- Migration `scripts/migrate_chat_extras.js` thêm cột **`ZTB_CHAT_REACTION.RX_COUNT INT NOT NULL DEFAULT 1`**.
- `repo.setReaction` đổi sang ngữ nghĩa tăng dần: cùng loại ⇒ `RX_COUNT + 1`; khác loại ⇒ đổi loại và reset `= 1`.
  (`reaction = "NONE"` ⇒ `removeReaction`.)
- `core.buildReactions(rows)` ⇒ `REACTIONS: { TYPE: { count, users[] } }`; `toClientMessage`/`enrichMessage(s)` gắn vào payload.
  **Client thay thế toàn bộ summary, không tự cộng** (nguồn chân lý là server) — áp dụng cho cả socket ack và fallback HTTP.
- UI: `ChatMessageBubble` render chip theo `REACTION_ORDER` (chỉ `count > 0`), sắp xếp giảm dần, `<em>{count}</em>`,
  `is-mine` khi `users.includes(myEmplNo)`; `ChatMessageMenu` hiện badge số cho từng loại.
- Hiệu ứng tim bay: state `flyers` trong bubble, tối đa ~9, sống ~1100ms, biến ngẫu nhiên `--drift`
  (`.erp-chat__flyers` / `.erp-chat__flyer` + `@keyframes erpChatHeartFly`).

### Kiểm chứng đã chạy
- `node scratch/hold_socket.js LSG1103 300` giữ peer online ⇒ chat hiện **"Đang hoạt động"**; kill tiến trình ⇒ ~4s sau
  chuyển **"Không hoạt động"** (realtime, không cần F5).
- Bấm chip 👍 liên tiếp: `👍1 → 👍2 → 👍3 → 👍4` (like vô hạn OK); chip ❤️ độc lập vẫn `1`.
  `.erp-chat__flyer` = 1–2 ngay sau khi bấm và về 0 sau ~1.2s.
- `node scratch/test_reaction_count.js` PASS; dọn dữ liệu test bằng `node scratch/cleanup_chat_testdata.js`.

### Ghi chú kỹ thuật
- `CMS_ID` **KHÔNG unique** trong `ZTBEMPLINFO` ⇒ script tra nhân sự phải ưu tiên khớp `EMPL_NO` trước `CMS_ID`.
- Dialog `NotificationPermissionGate` chặn pointer ⇒ khi test UI phải đóng (nút "Để sau") trước.
- Vẫn còn 2 việc chặn production: (a) backend chat phải được deploy lên server mà ERP trỏ tới (cổng 5013 hiện trả
  `Command 'chatSync' not supported`) hoặc xử lý bẫy MTU ở cổng 3007; (b) `chatFileUrl` còn nhúng `token_string` trong query.

## Đợt 22 — Chat nội bộ ERP (Socket.IO + Web Push) (2026-09-29)
Task hiện tại: triển khai chat nội bộ cho ERP — chat in-app realtime khi đang dùng web, thông báo đẩy khi không có socket active; kết bạn, tag tên, nhóm chat, đính kèm file/ảnh/tài liệu, avatar dùng chung ảnh nhân sự, quản lý nhóm (owner/admin/mod), lưu tin nhắn vĩnh viễn trong DB.
Trạng thái: **HOÀN THÀNH phase 1 (backend + frontend web)** — migration 6 bảng OK; `node scratch/test_chat_service.js` 20/20 PASS; `npm run build` OK (`✓ built in 1m 45s`), `get_errors` 0 lỗi.

### Phạm vi đã chốt với user
- Chỉ **web ERP** trước (Flutter sau); giữ **Web Push VAPID** hiện có, không đổi sang FCM.
- File lưu disk server, **tối đa 25MB/file**; download phải qua endpoint kiểm tra quyền thành viên.
- Chạy **1 process** (presence in-memory); chưa dùng Redis adapter.
- **Chat 1-1 không cần kết bạn**; module friend chỉ là danh bạ/lời mời.
- Nhóm: OWNER toàn quyền, ADMIN cấp/thu quyền MODERATOR, MODERATOR xoá tin người khác + loại MEMBER.
  **OWNER rời nhóm khi còn thành viên khác ⇒ bắt buộc chuyển quyền** (backend trả `code:"NEED_TRANSFER"`).
- **Không xoá vật lý** — mọi xoá/sửa là soft-delete + ghi `ZTB_CHAT_AUDIT`.
- Push **chỉ** gửi khi người nhận không còn socket active; deep-link `/?chat=<conversationId>`.

### Kiến trúc
- Backend: `services/chat/chatRepository.js` (SQL) → `chatMessageCore.js` (lõi dùng chung HTTP+Socket, persist-before-emit) → `chatRoomService.js` / `chatFriendService.js` (command qua POST /api); `routes/chatFile.js` mount `/chatfile`.
- Socket: `io.use(authenticate)` xác thực JWT handshake (không tin EMPL_NO client khai); room `user:{EMPL_NO}` + `conversation:{id}`; event `chat:join/leave/send(ack)/typing/read`; export `emitToConversation`, `emitToUsers`, `isUserOnline`.
- Frontend: `api/services/chatService.ts`, `hooks/useChatController.ts`, `components/Chat/*` (`ChatDock` = trigger + Popover desktop / overlay mobile, ConversationList, ConversationView, GroupPanel, NewChatDialog, `chat.scss` namespace `.erp-chat__*`).
- Tích hợp: `PrecisionHeader` — desktop trong `precision-header__actions`, mobile trong `precision-header__mobileActions` (chỉ 1 instance mount nhờ conditional rendering theo `isMobile`).

### Pitfall đã gặp thật (đừng chẩn đoán lại)
- **`ZTBEMPLINFO.EMPL_NO` là kiểu char ⇒ bị đệm khoảng trắng**, phải `trim().toUpperCase()`. Chưa trim ⇒ role OWNER lưu sai (thành MEMBER) và membership bị từ chối oan.
- **`ZTBEMPLINFO` KHÔNG có `JOB_NAME`/`MAINDEPTCODE`/`SUBDEPTCODE`** ⇒ join `ZTBJOB (JOB_CODE)` và `ZTBWORKPOSITION → ZTBSUBDEPARTMENT → ZTBMAINDEPARMENT` (tên bảng một chữ R).
- `queryDB_New` trả NG khi `rowsAffected = 0` ⇒ DDL/multi-statement phải dùng `openConnection()`/`openDedicatedConnection()`.

### Việc cần làm tiếp theo (đợt 22)
- Verify trực quan trên dev 3001 khi có phiên đăng nhập (chưa chạy được vì cần tài khoản ERP): badge, panel 2 khung, mobile overlay, tag tên, upload file, đổi quyền nhóm.
- Mở rộng `public/service-worker.js` nếu cần badge/notification tag riêng cho tin nhắn chat.
- Chưa làm: sửa tin nhắn (edit), ghim tin, thông báo khi được tag, block người dùng, Redis adapter, object storage, client Flutter.
- `ACTIVE_STATE.md` đang vượt 200 dòng (còn lịch sử đợt ≤ 21) — nên nén/archives các đợt cũ.

## Đợt 22.2 — Đính kèm, reaction, reply, chuyển tiếp, xoá 2 chế độ, restyle panel nhóm (2026-09-29)
Trạng thái: **HOÀN THÀNH** — build OK (`✓ built in 1m`), `get_errors` 0 lỗi, verify trên trình duyệt thật.

### Yêu cầu & kết quả
1. **Gửi ảnh/file không hiển thị** → đã sửa. File lưu tại `practice1/outbinary/chatfiles/`
   (env `CHAT_UPLOAD_FOLDER`), DB ghi `ZTB_CHAT_ATTACHMENT.STORAGE_PATH`, tải qua `GET /chatfile/:id` (kiểm quyền).
   Nguyên nhân: payload realtime/ack thiếu `ATTACHMENTS`, và client không gửi `msgType` nên tin chỉ có file bị lưu `TEXT`.
   Đã thêm `core.enrichMessage/enrichMessages` và cho server tự suy ra IMAGE/FILE từ đính kèm.
2. **Restyle panel quản lý nhóm** → role chip, menu ⋮ cho từng thành viên (cấp/thu Moderator, chuyển chủ nhóm, xoá),
   peer card cho hội thoại 1-1, thêm thành viên có tìm kiếm, nút Rời nhóm dạng outline đỏ.
3. **Tag tên bấm được** → mở chat riêng với người được tag và soạn sẵn nội dung trích dẫn tin nhắn.
4. **Reply/quote** → menu "Trả lời", thanh trả lời trong composer, khối trích dẫn trong bong bóng (`REPLY_TO`).
5. **Cảm xúc** 👍❤️😆😮😢😡 → bảng `ZTB_CHAT_REACTION` (1 cảm xúc/người/tin), chip trên bong bóng, bấm để bật/tắt.
6. **Chuyển tiếp** → `chatForward`, nhân bản đính kèm (không copy file), có badge "Đã chuyển tiếp".
7. **Sao chép** → copy nội dung + tên tệp vào clipboard, có snackbar xác nhận.
8. **Xoá 2 chế độ** → "Xoá ở phía tôi" (`ZTB_CHAT_MESSAGE_HIDDEN`, chỉ ẩn với mình) và "Thu hồi cả hai phía" (soft-delete).
9. **Mở menu** → chuột phải (desktop) hoặc nhấn giữ 450ms (mobile).
10. **Push icon** → avatar nhân viên gửi (`/Picture_NS/NS_<EMPL>.jpg`), fallback logo CMS ở service worker.

### Pitfall nghiêm trọng đã gặp
`useCallback` dùng trong **dependency array của `useEffect` khai báo trước nó** ⇒
`ReferenceError: Cannot access 'X' before initialization` ⇒ **cả app rơi vào ErrorBoundary** ("Đã xảy ra lỗi (Runtime Error)").
Luôn khai báo callback TRƯỚC effect dùng nó. (Phát hiện nhờ gắn listener `error`/`unhandledrejection` trong trình duyệt.)

### Việc cần làm tiếp theo (đợt 22.2)
- Cân nhắc bỏ `token_string` khỏi URL tải file (`chatFileUrl`) khi API cùng origin, để không lộ JWT trong query.
- Chưa làm: sửa tin nhắn, ghim tin, thông báo khi được tag, block người dùng, Redis adapter, client Flutter.
- Vẫn cần **deploy backend chat lên server ERP trỏ tới (5013)** hoặc sửa MTU cổng 3007 mới chạy được thật.

## Đợt 22.1 — Sửa realtime, push offline & cửa sổ chat desktop (2026-09-29)
Trạng thái: **HOÀN THÀNH** — `npm run build` OK (`✓ built in 2m 2s`), `get_errors` 0 lỗi, verify trên trình duyệt thật.

### Yêu cầu
1. Cửa sổ chat neo góc phải-dưới, có nút đóng riêng, **không tự đóng khi click ra ngoài** (desktop).
2. Push khi user offline (tắt tab) không tới, trong khi push đăng ký/phê duyệt nghỉ vẫn chạy.

### Phát hiện & fix
- **Realtime "phải F5"**: do đường mạng cổng 3007 bị PMTU black-hole (mất payload > ~1.4KB) khiến handshake
  chứa JWT ~1.9KB treo; cộng thêm server chỉ phát `chat:message` vào room phòng chat.
  Đã cho socket dùng **cùng base với API** (`server_ip`) và phát thêm tới **room riêng từng thành viên**.
- **Push offline**: push TRƯỚC ĐÂY chỉ gọi ở nhánh socket `chat:send`; luồng HTTP `chatSendMessage`
  (luồng client dùng khi socket chưa nối) **không gọi push** ⇒ tách `services/chat/chatPush.js` +
  `socket/presence.js` và gọi ở cả 2 nhánh. Thêm `tag` để gộp thông báo cùng phòng.
- **Đo trên DB**: `ZTB_SUBSCRIPTION_TB` có 359 row legacy `SUB_STATUS='Y'` không owner (bị lọc bỏ, đúng thiết kế),
  chỉ 37 row `SUB_STATUS='1'` có owner nhận targeted push; push trực tiếp trả 201 OK (3/5), 2/5 trả 410 hết hạn.
  **Quyền Notification của trình duyệt phải là `granted`**, nếu `denied` thì không có thông báo nào hiện.
- **UI**: bỏ MUI `Popover` ⇒ thay `.erp-chat__window` (`fixed right:20px bottom:0`, `z-index:1200`, header + nút X,
  không backdrop). **Không dùng CSS animation transform** cho cửa sổ này (tab ẩn làm animation treo ⇒ lệch 14px).

### Verify
- Click ra ngoài ⇒ cửa sổ vẫn mở; bấm X ⇒ đóng; `gapRight=20, gapBottom=0, transform=none`.
- Badge chat nhảy ngay khi user khác gửi tin (không F5).
- `[chat] push offline conv=10 -> NNH1609 (online: 1)` xuất hiện trong log khi gửi qua HTTP.
- `test_chat_realtime.js` REALTIME OK; `test_push_delivery.js` 3/5 endpoint trả 201.

### Việc cần làm tiếp theo (đợt 22.1)
- **Phải deploy backend chat lên server mà ERP trỏ tới** (cổng 5013 hiện là backend khác, không có chat)
  hoặc sửa MTU/PMTUD cho cổng 3007 — nếu không, chat vẫn không chạy thật.
- Cân nhắc dọn subscription hết hạn (410) và nâng cấp 359 row legacy `SUB_STATUS='Y'` sang có owner.
- Chưa làm: sửa tin nhắn, ghim tin, thông báo khi được tag, block người dùng, Redis adapter, Flutter.

## Đợt 21 — Cổng bắt buộc cấp quyền Notification (Web Push) (2026-09-28)
Task hiện tại: kiểm tra user đã cho phép notification (FCM/Web Push) chưa; nếu chưa thì popup **bắt buộc** đồng ý mới cho dùng tiếp.
Trạng thái: **HOÀN THÀNH** — `npm run build` OK (`✓ built in 2m 8s`), `get_errors` 0 lỗi, verify dev 3001 (@1440 / @393×700).

### Quyết định thiết kế
- **Phạm vi: chỉ CMS** (đúng luồng push hiện có: `notification_panel` socket cũng early-return nếu không phải CMS).
- **KHÔNG gọi `Notification.requestPermission()` lúc boot nữa** (đã bỏ khỏi `App.tsx`): prompt trình duyệt hiện ra trước khi user hiểu lý do ⇒ dễ bị bấm "Chặn" **vĩnh viễn** (Chrome không hỏi lại). Thay bằng popup giải thích → user bấm "Cho phép" mới kích hoạt prompt.
- **Chỉ chặn khi quyền CHƯA cấp.** Đã `granted` ⇒ mở cổng ngay, subscription chỉ là best-effort (ghi `console.warn` nếu lỗi). Trước khi sửa, trường hợp granted-nhưng-subscribe-lỗi khiến user **kẹt trong dialog vĩnh viễn** (đã bắt được khi verify).
- **Không chặn nếu trình duyệt không hỗ trợ** — tránh khoá user oan (quan trọng vì ERP nội bộ có thể chạy HTTP LAN ⇒ Service Worker/Push API không tồn tại). Có 2 lớp guard: `App.tsx` truyền `enabled={... && isPushNotificationSupported()}` + component tự early-return.
- **Escape hatch khi bị `denied`**: hướng dẫn bật lại theo từng trình duyệt (Chrome/Edge/Firefox/Opera/Safari) + nút "Tôi đã bật lại" (nghe `visibilitychange` để tự mở khi user đổi quyền ở tab cài đặt) + nút **Đăng xuất**.
- Mọi cách đóng đều bị vô hiệu: `disableEscapeKeyDown` + `onClose={() => undefined}` (đã test: Escape & backdrop click không đóng được).

### Pitfall đã gặp khi verify
- **`overflow: hidden` + nội dung cao hơn viewport ⇒ cắt cụt tiêu đề**. `.notiPermGate__paper` ban đầu có `overflow:hidden` (để bo góc gradient hero); khi nội dung dài (trạng thái denied có hướng dẫn) thì paper "nổi" lên trên viewport, MUI flex-center đẩy tràn 2 đầu ⇒ **mất dòng "BẤT BUỘC" + tiêu đề** và không cuộn được. Fix: paper → `display:flex; flex-direction:column; max-height: calc(100vh - 48px)`, hero `flex: 0 0 auto`, body `flex:1 1 auto; min-height:0; overflow-y:auto`.
- Verify nhanh trạng thái `default`: `page.addInitScript` override `Notification.permission` + `Notification.requestPermission` (không dùng được `Browser.setPermission`/`Browser.grantPermissions` — Playwright trong VS Code báo *Method not found*).
- **Đã vô tình `Browser.resetPermissions` + reload ⇒ reset quyền notification của trình duyệt dev (localhost:3001) từ `granted` về `default`.** Không khôi phục lại được bằng API (method not found) ⇒ cần user bấm "Cho phép" 1 lần trên Chrome dev, hoặc chặn popup bằng cách thêm `localhost:3001` vào danh sách cho phép của Chrome.

### File đã chỉnh sửa (đợt 21)
- `src/api/services/notificationPermissionService.ts` — **(mới)** `isPushNotificationSupported` (gồm `isSecureContext` + `PushManager` + iOS-Safari phải Add-to-Home-Screen), `getNotificationPermission`, `requestNotificationPermission`, `ensurePushSubscription` (tái dùng subscription cũ nếu có, `serviceWorker.ready` có timeout 10s), `getBrowserSettingsHint`.
- `src/components/NotificationPermissionGate/NotificationPermissionGate.tsx` — **(mới)** dialog bắt buộc + state `prompt | denied | loading`.
- `src/components/NotificationPermissionGate/NotificationPermissionGate.scss` — **(mới)** hero gradient, hint box, actions; `@media (max-width:480px)` xếp dọc nút.
- `src/App.tsx` — bỏ `handleEnableNotifications` + `urlBase64ToUint8Array` (chuyển vào service), thêm `<NotificationPermissionGate enabled={...} onLogout={logoutSession} />`, import `logout as logoutSession`.

### Kết quả đo (@1440×850, dev 3001)
- `permission = default` ⇒ gate hiện: title "Cho phép thông báo để tiếp tục", 2 nút `["Cho phép", "Đã bật, kiểm tra lại"]`, Escape/backdrop **không** đóng.
- Bấm "Cho phép" khi bị từ chối ⇒ chuyển state denied: title "Thông báo đang bị chặn", 3 bước hướng dẫn Chrome, `chrome://settings/content/notifications`, nút `["Tôi đã bật lại", "Đăng xuất"]`.
- Bấm "Tôi đã bật lại" sau khi quyền granted ⇒ dialog **đóng**, vào app bình thường (`dialogCount: 0`).
- @393×700: paper `top 32 / bottom 668` (fits viewport), hero hiển thị đủ, body cuộn nội bộ (`scrollH 672 > clientH 641`), `bodyOverflowX = false`.

## Đợt 20 — Mobile NCR: MASTER→DETAIL (Ảnh lỗi + Holding Failing Detail) (2026-09-28)
Task hiện tại: hoàn thiện nốt yêu cầu còn dở của `src/pages/qc/iqc/NCR_MANAGER.tsx` (refactor mobile 99%).
Trạng thái: **HOÀN THÀNH** — `npm run build` OK (`✓ built in 1m 32s`), `get_errors` 0 lỗi, verify dev 3001 (@360 / @393 / @768 / @1440).

### Yêu cầu
Trên mobile không thấy ô **Ảnh Lỗi (Defect Image)** và bảng **Holding – Failing Detail**. User muốn: tap chọn 1 dòng ⇒ chi tiết hiển thị **ngay bên dưới**, cuộn xuống để xem.

### Root cause (quan trọng — đừng chẩn đoán lại từ đầu)
- `div.precision-ncr-mobile-scrollable` **đã có trong JSX nhưng KHÔNG có rule CSS nào** trong `PrecisionNCR.scss`.
- Hệ quả: nó là **block formatting context** (`display:block`, cao đúng bằng toolbar 87px) ⇒ `flex:1 1 auto; min-height:0` của `.precision-ncr-mobile-grid` **bị bỏ qua**; mặt khác `.agtable` do trang set `position:absolute; inset:0` (out-of-flow) nên `.precision-ncr-grid-container`/`-wrapper` cao **0px**.
- Kết quả: bảng không hiển thị, khối chi tiết dù render trong DOM cũng không thấy (đo được `gridWrapper height = 0`).
- **Cách chẩn đoán nhanh**: đo `getBoundingClientRect().height` của `.mobile-scrollable` → nếu ≈ chiều cao toolbar (87px) và `.mobile-grid` = 0 là trúng.

### Fix (2 file)
- `PrecisionNCR.scss` — **§10.0** thêm rule cho `.precision-ncr-mobile-scrollable` (`flex:1 1 auto; min-height:0; display:flex; flex-direction:column; overflow-y:auto; overscroll-behavior:contain; scrollbar ẩn`). **§10.4** `.precision-ncr-mobile-grid` từ `flex:1 1 auto` → **chiều cao xác định** `height:56vh; min-height:300px`, thêm modifier `&.has-detail { height:38vh; min-height:220px }` + `transition: height .2s`. **§10.4b** thêm `.precision-ncr-mobile-detail` + override `.precision-ncr-right-panel { width:100%; overflow:visible }`, `.defect-image-card__preview { height:200px }`, `.holding-detail-card { flex:0 0 auto; height:380px }`. **§10.1** root `.is-mobile` giữ `height:100%; overflow:hidden` + `.component_element &` `height:100%!important; max-height:none!important`.
- `NCR_MANAGER.tsx` — thêm `useRef mobileDetailRef`, `handleMobileRowClick` (setSelectedNCR → `handletraHoldingData` → `scrollIntoView({behavior:"smooth", block:"start"})` sau `setTimeout` 120ms), grid nhận `has-detail`, `.precision-ncr-mobile-detail` gắn `ref`.

### Quyết định kiến trúc
- **KHÔNG mở page-level scroll** cho root: `.tabs-container` / `.tab-pane` của IQC đều `overflow:hidden` ⇒ nếu mở `overflow:visible` sẽ bị tổ tiên cắt cụt (đúng pitfall DTC.scss trong memory). Thay vào đó scroll **nội bộ** trong `.precision-ncr-mobile-scrollable`.

### Kết quả đo (@393×850, dev 3001)
- Header 42px + Toolbar 87px cố định; `.mobile-scrollable` 694px (`overflow-y:auto`).
- Chưa chọn dòng: grid **476px**, 3 row AG hiển thị đủ.
- Tap dòng: grid `has-detail` → **220px**, detail **685px**, right panel 669px, ảnh lỗi 281px (preview 200px), holding card 380px; **auto-scroll** đưa `detailTop 164` ≈ `viewTop 156` ⇒ ảnh lỗi nằm ngay đỉnh vùng nhìn.
- Cuộn xuống đáy: `.holding-detail-card__summary` bottom 763 < 780 ⇒ tới được footer bảng Holding.
- `bodyOverflowX = 0` @360/393/414/768; desktop @1440: sidebar 260 / center 820 / rightPanel 320, `.is-mobile` không xuất hiện trong DOM ⇒ desktop **không đổi**.

### File đã chỉnh sửa (đợt 20)
- `src/pages/qc/iqc/NCR_MANAGER.tsx` — ref + auto-scroll + class `has-detail`.
- `PrecisionNCR/PrecisionNCR.scss` — §10.0 / §10.1 / §10.4 / §10.4b.
- Backup: `NCR_MANAGER.backup3.tsx`, `PrecisionNCR/PrecisionNCR.backup3.scss`.

## Đợt 19 — Mobile IQC REPORT (Báo Cáo Chỉ Số Chất Lượng & Xu Hướng Lỗi PPM) (2026-09-27)
Task hiện tại: refactor giao diện mobile cho `src/pages/qc/iqc/IQC_REPORT.tsx` + `.agents/skills/mobile_interface_refactoring`.
Trạng thái: **HOÀN THÀNH** — `npm run build` OK (`✓ built in 1m 27s`, 17138 modules), `get_errors` 0 lỗi, verify trên dev 3001 (@320 / @360 / @393 / @414 / @768 / @1440).

### Đặc thù màn hình
Đây là màn **báo cáo biểu đồ** (không có AGTable): Desktop gồm Header 38px + Toolbar 2 hàng **219px @393** (8 trường lọc) + 4 card KPI (290px @393 do grid 1 cột) + 8 biểu đồ Recharts 400px trong 3 section. Không có nút hành động dữ liệu (chỉ Excel per-card + Tra cứu).

### Quyết định thiết kế
- Conditional rendering `useIsMobile` (hook chung `components/Navbar/AccountInfo/useIsMobile.ts`) ⇒ desktop chỉ render `PrecisionIQCReportHeader` / `...Toolbar` / `...Kpi` như cũ.
- Mobile: `MobileHeader` (brand + pulse + **icon nút lọc có badge số điều kiện** + reload + fullscreen) → `MobileToolbar` 2 hàng (nút **Bộ Lọc** badge + **Tra Cứu Dữ Liệu** flex-1; hàng 2 = 4 segmented tabs cuộn ngang) → body.
- KPI: `PrecisionIQCReportMobileKpi` = **1 `<table>` 4 dòng** màu theo tone desktop, có nút chevron collapse trong `<th colSpan={2}>` ⇒ 220px → **37px** khi gập (state local, an toàn với `React.memo`).
- Bộ lọc 6 trường (ngày ×2, Worst By, NG Type, Autocomplete Code + chip mã, Khách hàng, checkbox Mặc định) gom vào **Bottom Sheet Zero-Blur** `PrecisionIQCReportMobileFilterDrawer` với local state + sync khi mở, nút Đặt lại/Áp dụng 44px.
- Biểu đồ: giữ nguyên toàn bộ `IQC*NGRate` / `IQC_FAILING_PENDING` (đã `CustomResponsiveContainer` = width/height 100%) ⇒ chỉ cần tăng `.executive-card__body--chart-lg` lên 300px trên mobile.

### Pitfall đã gặp & fix
- **Import sai độ sâu**: `useIsMobile` nằm ở `src/components/...` ⇒ từ `src/pages/qc/iqc/` phải là `../../../components/...` (3 cấp), không phải 4. Sai ⇒ Vite báo `[plugin:vite:import-analysis] Failed to resolve import` + ErrorBoundary chặn cả trang. **Cách lấy lỗi thật**: đọc overlay text qua `read_page`, hoặc `Invoke-WebRequest` (trả 500 nhưng overlay DOM có message).
- **Inline style `width:"100px"` của ô Khách hàng desktop** phải bỏ khi render trong sheet (dùng `.drawer-input { width:100% }`).
- **Autocomplete dropdown bị sheet che**: `disablePortal` + drawer `z-index:10000` ⇒ dùng `slotProps={{ popper: { sx: { zIndex: 13000 } } }}` (MUI v7). Đã đo `getComputedStyle(.MuiAutocomplete-popper).zIndex === "13000"` và `elementFromPoint` trong vùng list trả về option, không phải drawer.
- **Nút Excel 22px quá nhỏ** ⇒ mobile `min-height:42px` cho `__header` + `__btn-excel` 36px (touch target).
- **Tiêu đề header bị cắt** khi nút Lọc còn nhãn "Lọc" ⇒ chuyển nút lọc sang icon-only 36px + badge neo `position:absolute` ⇒ title `scrollWidth == clientWidth == 82px` (không cụt).

### Kết quả đo (@393×850, dev 3001)
- root 736px; mobileHeader **49px** / desktop 38px; mobileToolbar **93px** vs desktop **219px** (−126px); mobileKpi **220px** (gập 37px) vs desktop 4 card ~290px.
- `precision-iqc-body` **479px → 595px** (+116px) khi dùng header/toolbar/KPI mobile; `bodyOverflowX = 0` ở @320/360/393/414/768.
- Drawer: top 245 → bottom **850 = innerHeight** (footer không bị thanh URL che), body tự cuộn (493px), 6 field, 100 option Code list.
- Áp dụng filter: badge 3 → **4** (đổi NG Type = MATERIAL) và drawer tự đóng; Đặt lại: badge về **3**, drawer đóng.
- KPI collapse: 220 → **37** → 220 (toggle 2 chiều OK).
- Desktop @1440: `is-mobile` **không** xuất hiện, không có `.precision-iqc-mobile-*` và `.precision-iqc-drawer-overlay` trong DOM; header 38px, toolbar 73px (8 filter + 4 tab nguyên vẹn), KPI grid 80px ⇒ **không đổi**.

### File đã chỉnh sửa (đợt 19)
- `src/pages/qc/iqc/IQC_REPORT.tsx` — thêm `useIsMobile`, `showMobileFilter`, `activeFilterCount` (`useMemo`, chỉ đếm điều kiện khác default); 3 nhánh conditional rendering + render drawer.
- `PrecisionIQCReport/PrecisionIQCReportMobileHeader.tsx` — **(mới)** brand + pulse + icon lọc (badge) + reload + fullscreen.
- `PrecisionIQCReport/PrecisionIQCReportMobileToolbar.tsx` — **(mới)** nút Bộ Lọc (badge) + Tra Cứu + 4 segmented tabs cuộn ngang.
- `PrecisionIQCReport/PrecisionIQCReportMobileKpi.tsx` — **(mới)** bảng KPI 4 dòng collapse được.
- `PrecisionIQCReport/PrecisionIQCReportMobileFilterDrawer.tsx` — **(mới)** Bottom Sheet 6 trường + chip mã + Đặt lại/Áp dụng.
- `PrecisionIQCReport/PrecisionIQCReport.scss` — thêm **§6** (~600 dòng, mobile layer): header, toolbar, KPI table, `.is-mobile` tinh gọn section/card, drawer overlay/sheet/footer + `@keyframes iqcSlideUp/iqcFadeIn`.
- Backup: `IQC_REPORT.backup2.tsx`.

### Ghi chú kỹ thuật
- `.precision-iqc-report` có `.component_element & { height:100%!important; flex:1 1 auto!important }` và `IQC.scss` ép cùng giá trị ⇒ **không** cần `height:auto` như DTC/DKDTC vì đây là màn scroll nội bộ (`.precision-iqc-body { overflow-y:auto }`) — body tự cuộn (scrollH 3811 > clientH 595).
- Không cần `!important` cho mobile vì SCSS được viết **sau** base với `.is-mobile` (0,2,0) hoặc class mobile riêng (0,1,0 mới, không xung đột).
- Badge đếm điều kiện: ngày luôn có giá trị nên mặc định đã là 3 (2 ngày + Mặc định); đổi Worst By/NG Type/Khách hàng/Code làm badge tăng thêm.

---

## Đợt 18 — Mobile INCOMMING (IQC Kiểm tra NVL đầu vào) (2026-09-27)
Task hiện tại: refactor giao diện mobile cho `src/pages/qc/iqc/INCOMMING.tsx` + `.agents/skills/mobile_interface_refactoring`.
Trạng thái: **HOÀN THÀNH** — `npm run build` OK (`✓ built in 1m 34s`), `get_errors` 0 lỗi, verify trên dev 3001 (@320 / @393 / @1440).

### Quyết định thiết kế
- Desktop là layout **3 panel** (Sidebar 270px + Grid + DTC panel 320px) ⇒ trên mobile dùng **2 Bottom Sheet** thay vì xếp dọc:
  1. `PrecisionIncomingMobileSidebarSheet` — bọc **nguyên** `PrecisionIncomingSidebar` (form lọc 7 trường + form đăng ký 6 trường) ⇒ giữ 100% logic/validation/quét mã.
  2. `PrecisionIncomingMobileDtcSheet` — bọc **nguyên** `PrecisionIncomingDtcPanel` + ô cập nhật NCR_ID (thay ô NCR trên toolbar desktop).
- Tab "Tra Data"/"New Input" chuyển sang nút mở sheet tương ứng: nút **Lọc** (badge số điều kiện) mở tab Tra Data, nút **Nhập** (header + chip) mở tab New Input.
- Ô search mobile lọc **client-side theo 11 cột** (`incomingMobileFilter.ts`) + chip **"Chờ KQ"** (TOTAL_RESULT rỗng/PD) ⇒ không gọi lại API.
- **Nút TRA DATA trong sidebar desktop nằm ở đáy form (~785px trên sheet 750px)** ⇒ thêm `.drawer-footer` dính đáy (44px, `flex-shrink:0`) với 2 nút "Đóng" + "TRA DATA INCOMING" (nhánh New Input là "+ ADD" + "LƯU SAVE"), và **ẩn `.precision-incoming__sidebar-actions` trong sheet** để không lặp nút.

### Kết quả đo
- @393×850: mobileHeader **71px**, mobileToolbar **89px**, gridContainer **576px** (`ag-root-wrapper 550px`). `bodyOverflowX = 0`.
- KPI strip (toggle, mặc định TẮT): 53px, 4 chip cuộn ngang (`434 vs 347`), mở → grid co còn 523px. Bấm đóng → về 576px.
- @320×700: `searchRowOverflow = 0`, input 173px, chips cuộn ngang (431), header không tràn; **fix tiêu đề bị cắt**: block `@media (max-width:350px)` phải lặp đủ 4 cấp `.precision-incoming-mobile-header .mobile-header-top .header-actions .btn-*` (base = 0,4,0 mới thắng).
- Bottom Sheet: drawer 695px / footer nút bottom **840 < 850** (không bị thanh URL che); sidebar bị ép `width:100%; border-right:none`; input/textarea 40/68px font **14px** (chống auto-zoom iOS); checkbox 18×18; nút footer 44px.
- Sheet ĐTC: drawer 544px, panel full width (`border-left: 0`), bảng 267px, 5 dòng, NCR input/btn 38px.
- BNK modal mobile: header 48→**52px**, title 1 dòng ellipsis, nút IN A4 38×71 + nút X 38×38, lot-pill ẩn, viewport `overflow: auto` (tờ A4 794px cuộn ngang, không tràn trang).
- Desktop @1440: `.precision-incoming` **không** `is-mobile`, header 40px, KPI banner 65px, sidebar 270px, toolbar 63px, DTC panel 320px, statusBar còn ⇒ **không đổi**.

### File đã chỉnh sửa (đợt 18)
- `src/pages/qc/iqc/INCOMMING.tsx` — thêm `useIsMobile`; 2 nhánh conditional rendering; state `showMobileKpi` / `showSidebarSheet` / `showDtcSheet` / `quickSearch` / `onlyPending` / `selectedCount` (ref không trigger re-render); `handleSearchFromSheet`.
- `PrecisionINCOMMING/PrecisionIncomingMobileHeader.tsx` — **(mới)** brand + pulse + count/Pass/ĐTC/Hold chips + 3 nút (toggle KPI, Nhập, Refresh).
- `PrecisionINCOMMING/PrecisionIncomingMobileKpi.tsx` — **(mới)** 4 chip KPI 2 dòng cuộn ngang + nút đóng.
- `PrecisionINCOMMING/PrecisionIncomingMobileToolbar.tsx` — **(mới)** hàng 1 search + Tra + Lọc(badge); hàng 2 pills Chờ KQ/Nhập/SET PASS/SET FAIL/Update/ĐTC(n)/BNK/EX1/EX2 + counter.
- `PrecisionINCOMMING/PrecisionIncomingMobileSidebarSheet.tsx` — **(mới)** Bottom Sheet Zero-Blur + `.drawer-footer`.
- `PrecisionINCOMMING/PrecisionIncomingMobileDtcSheet.tsx` — **(mới)** Bottom Sheet chứa DTC panel + NCR updater.
- `PrecisionINCOMMING/incomingMobileFilter.ts` — **(mới)** `isPendingLot` / `matchesIncomingSearch` / `filterIncomingRows`.
- `PrecisionINCOMMING/PrecisionIncomingTable.tsx` — thêm prop `isMobile` / `quickFilterText` / `onlyPending`; nhánh mobile lọc client-side + ẩn statusBar.
- `PrecisionINCOMMING/PrecisionBNKModal.tsx` — thêm prop `isMobile` (rút gọn tiêu đề + nhãn "IN A4" + ẩn lot-pill).
- `PrecisionINCOMMING/PrecisionINCOMMING.scss` — thêm **§10.5** (~500 dòng): `.is-mobile` root (giữ `height:100%!important; flex:1 1 auto!important; min-height:0!important` do `IQC.scss` ép `flex:1 1 auto` cho `.precision-incoming`), AG grid row/header 34px, `+ §10.5.2b @media (max-width:350px)`, `+ §10.5.5` bottom sheet + footer + `@keyframes incomingSlideUp/incomingFadeIn`, BNK `&.is-mobile`.
- Backup: `INCOMMING.backup2.tsx`, `PrecisionINCOMMING.backup2.scss`, `PrecisionIncomingSidebar.backup2.tsx`, `PrecisionIncomingTable.backup2.tsx`, `PrecisionIncomingDtcPanel.backup2.tsx`.

### Ghi chú kỹ thuật
- `checkLotNVL` (hook) điền `m_name` dùng chung cho **cả** ô filter "Tên Liệu" (desktop) và hint trong phiếu đăng ký ⇒ khi mở sheet tab New Input có thể thấy hint của lần quét trước; đây là hành vi sẵn có, không sửa.
- Tab ĐTC trong sheet render ĐTC của `clickedRow` hiện tại (kế thừa hành vi desktop: bấm dòng ⇒ nạp ĐTC).

## Đợt 17 — Mobile DKDTC (Đăng Ký Test ĐTC) (2026-09-27)
Task hiện tại: refactor giao diện mobile cho `src/pages/qc/dtc/DKDTC.tsx` + `.agents/skills/mobile_interface_refactoring`.
Trạng thái: **HOÀN THÀNH** — `npm run build` OK (`✓ built in 1m 37s`), `get_errors` 0 lỗi, verify trên dev 3001 (@320 / @393 / @1440).

### Quyết định thiết kế
- **Không dùng filter drawer** (như SPECDTC/KQDTC): màn này không có bộ lọc nhiều trường — chỉ 1 ô tìm kiếm. Thay vào đó dùng **Bottom Sheet "Phiếu Đăng Ký"** để chứa form 8 trường của sidebar desktop.
- **Tái sử dụng 100% `PrecisionDKDTCSidebar`** trong Bottom Sheet (`PrecisionDKDTCRegisterSheet`) thay vì dựng lại form → giữ nguyên logic/state/validation/scan, chỉ ép CSS full-width trong sheet.
- Ô search **chỉ render 1 lần** (ở MobileToolbar), nhánh mobile của `PrecisionDKDTCTable` bỏ hẳn `__gridToolbar` ⇒ tiết kiệm 51px chiều cao.

### Kết quả đo
- @393×850: mobileHeader 51px, mobileToolbar 96px, gridContainer 511px (`gridBody` 510px → `ag-root-wrapper` **484px**). `bodyOverflowX = 0`.
- @320: search row vừa khít (`scrollW 295 = clientW 295`), pills cuộn ngang (`500 vs 295`), 0 tràn trang.
- Bottom Sheet: `sheet 765px`, submit ĐĂNG KÝ bottom **842** < 850 ⇒ không bị thanh URL che; `sidebarBody` tự cuộn (607px), footer `flex-shrink:0` neo đáy; checkbox 18×18, input 16px (chống auto-zoom iOS).
- Desktop @1440: `.precision-dkdtc` (không `is-mobile`), sidebar 320px, 4 KPI card, toolbar 4 nút (EX1/EX2/PIVOT/Làm mới), statusBar, AG grid 560px — **không đổi**.

### File đã chỉnh sửa (đợt 17)
- `src/pages/qc/dtc/DKDTC.tsx` — thêm `useIsMobile`; 2 nhánh conditional rendering; state `showMobileKpi` / `showRegisterSheet` / `showTableFilter`; `sidebarProps` dùng chung cho Sidebar & RegisterSheet.- `PrecisionDKDTC/PrecisionDKDTCMobileHeader.tsx` — **(mới)** brand + badge mode IQC/PQC + count dòng + 2 nút (toggle KPI, nạp lại).
- `PrecisionDKDTC/PrecisionDKDTCMobileToolbar.tsx` — **(mới)** hàng 1 search + nút "Phiếu ĐK" (badge số hạng mục đã chọn); hàng 2 pills EX1/EX2/PIVOT/Lọc cột/Nạp lại/Đặt lại cuộn ngang.
- `PrecisionDKDTC/PrecisionDKDTCRegisterSheet.tsx` — **(mới)** Bottom Sheet Zero-Blur chứa `PrecisionDKDTCSidebar`; đóng sheet trước khi gọi `onRegister()` để thấy Swal.
- `PrecisionDKDTC/PrecisionDKDTCTable.tsx` — thêm prop `isMobile` / `showFilter`; tách `searchBoxNode` dùng chung; nhánh mobile chỉ render `__gridBody`.
- `PrecisionDKDTC/PrecisionDKDTCKpi.tsx` — thêm prop `compact` → 4 ô `__kpiChip` (2 dòng/ô) thay cho 4 card lớn.
- `PrecisionDKDTC/PrecisionDKDTC.scss` — thống khối **§7 mobile** (`&.is-mobile`, specificity 0,2,0 nên thắng base 0,1,0) + **§8 bottom-sheet** (overlay `100dvh`, drawer `90dvh`, `flex-shrink:0` footer) + `@keyframes dkdtcSlideUp`.
- Backup: `DKDTC.backup2.tsx`, `PrecisionDKDTC.backup2.scss`.

### Fix sau verify (đợt 17) — Modal Quét Mã bị Bottom-Sheet che
- Triệu chứng: bấm nút quét mã (LOT NVL / LOT NCC) trong Phiếu Đăng Ký thì modal quét nằm **dưới** sheet.
- Nguyên nhân: `UniversalScannerModal` là MUI `Dialog` (portal) z-index mặc định **1300**; `.precision-dkdtc-drawer-overlay` đặt **10000** ⇒ sheet che. (Không phải lỗi DOM order.)
- Fix: thêm prop tuỳ chọn `zIndex?: number` cho `UniversalScannerModal` → `slotProps={{ root: { sx: { zIndex } } }}` (MUI v7); bỏ trống giữ nguyên 1300. `PrecisionDKDTCScannerModal` truyền `zIndex={13000}`.
- Verify @393: `elementFromPoint` tâm màn hình = `.universal-scanner__reader-box`, `modalRootZ 13000`; đóng scanner → sheet vẫn mở. Build OK (`✓ built in 2m 25s`).
- Chỉ `DKDTC` mở scanner từ trong drawer; `PrecisionLineQc` / `PrecisionDataSampleSx` render ở cấp trang nên không bị.

## Đợt 16 — Fix màn hình trắng khi Logout + chắc hoá login/logout (2026-09-22)
`src/App.tsx` + `src/components/ErrorBoundary/ErrorBoundary.tsx` + `src/api/Api.ts` + `src/pages/home/Home.tsx`.
- **Root cause**: `Login` là `React.lazy` nhưng `App.tsx` render trần `{!globalLoginState && <Login />}` — không Suspense/ErrorBoundary. User vào thẳng app bằng token còn hạn ⇒ chunk Login chưa tải ⇒ bấm Logout thì lazy suspend không boundary ⇒ React 18 unmount root ⇒ trắng màn hình, phải F5 (nên lỗi chỉ "đôi khi": phụ thuộc chunk đã cache trong phiên hay chưa).
- Fix: bọc `<Login />` trong `<Suspense fallback={<AppBootScreen />}>` + `<ErrorBoundary>`; warm-up `import("./pages/login/Login")` sau boot 1.5s.
- `ErrorBoundary`: auto `location.reload()` 1 lần/15s khi gặp lỗi tải chunk (deploy mới ⇒ chunk cũ 404), guard `sessionStorage.erp_chunk_autoreload_at`.
- `logout()`: thêm cờ `loggingOut` (chống gọi trùng), bỏ `setTimeout(1000)` → xoá `userData` + hạ `loginState` cùng nhịp render; thêm `isLoggingOut()`. `Home.getchamcong()` thêm guard `!isLoggingOut()` để không ghi lại token sau khi đã logout.
Trạng thái: **HOÀN THÀNH** — `npm run build` OK (`✓ built in 1m 41s`), `get_errors` 0 lỗi, dev 3001 không có vite error overlay.

## Việc cần làm tiếp theo (đợt 16)
- Cân nhắc reset URL về `/` khi logout và/hoặc chuyển `logout()` sang `navigate` để `ProtectedRoute` không giữ route sâu.
- (Backend) JWT secret hard-code `"nguyenvanhung"` + token stateless ⇒ logout chỉ có tác dụng client-side; xem có cần blacklist/refresh-rotation không.
- `update_socket` đang gọi `socket.emit` trong reducer (side-effect, StrictMode double-invoke ở dev).
- `ACTIVE_STATE.md` đang vượt xa giới hạn 80 dòng — nên nén các đợt ≤ 12 thành 1 mục lưu trữ.

## Đợt 15 — Style lại toolbar AGTable theo Stitch (2026-09-22)
`src/components/DataTable/AGTable.tsx` + `AGTable.scss` + `src/components/PivotChart/PivotChart.scss`.
- Bỏ inline `backgroundImage: theme.CMS.backgroundImage` (nguồn dải gradient neon) + xoá `useSelector`/`RootState` không còn dùng.
- Toolbar: `#f8fafc` + `border-bottom 1px #e2e8f0`, `min-height 32px`, `gap 4px 6px`; chip `agtable__toolBtn--excel/--pivot` + nhãn `agtable__toolLabel` bọc trong `<span>`.
- FIX "2 scrollbar luôn hiện sẵn": `.agtable .toolbar`, `.pivottable1`, `.pivotdatatable` đổi `overflow: scroll` → `overflow-x:auto / overflow-y:hidden` + scrollbar mảnh. Đo trước: 10px dọc + 10px ngang; sau: 0.
Trạng thái: **HOÀN THÀNH** — `npm run build` OK, `get_errors` 0 lỗi, đã verify bằng browser tool trên dev 3001.

## Mục tiêu task hiện tại (đợt 14)
R&D → **Quản lý barcode sản phẩm** (`/rnd/productbarcodemanager`):
1. List chọn **MÃ SẢN PHẨM** đổi từ `<select>` sang **AutoComplete** — gõ mã/tên để search, nhấn **Enter chọn luôn option đầu tiên** của list sau lọc.
2. **Fix ô "XEM TRƯỚC MÃ QUÉT TRỰC TIẾP"**: mã vạch/QR không hiện trong khung mà "dạt" ra góc trên-trái component.
Trạng thái: **HOÀN THÀNH** — `npm run build` OK (`✓ built in 1m 27s`), `get_errors` 0 lỗi, đã kiểm chứng trên UI thật (Enter → chọn option đầu; nút X → clear G_CODE; preview 1D/QR/MATRIX đều nằm trong khung).

## File đã chỉnh sửa (đợt 14)
- `product_barcode_manager/PrecisionProductBarcode/ProductCodeAutocomplete.tsx` — **(mới)** component AutoComplete mã SP: `createFilterOptions({ matchFrom: "any", limit: 200 })` (search cả mã lẫn tên), `autoHighlight` (option đầu luôn highlight ⇒ Enter chọn luôn), `openOnFocus`/`selectOnFocus`/`handleHomeEndKeys`, `slotProps.popper.className = productCodeAutocomplete-popper`.
- `PrecisionProductBarcodeForm.tsx` — thay `<select>` bằng `<ProductCodeAutocomplete>`; `handleSelectCode` set `selectedCode` + `G_CODE`/`G_NAME` (clear ⇒ `""`).
- `PrecisionProductBarcode.scss` — style compact `.productCodeAutocomplete` (cao 28px khớp input trong form) + block **GLOBAL** `.productCodeAutocomplete-popper` (popper render qua Portal nên nằm ngoài `.precision-barcode`); selector `input[type="text"], select` đổi thành `> input[type="text"], > select` để không đè style lên input do MUI render.
- `PrecisionProductBarcodeForm.tsx` — **(preview)** gom 3 literal DATA trùng lặp thành `PREVIEW_BASE` + `useMemo previewData` (SIZE_W 60x10mm cho 1D, 10x10mm cho QR/MATRIX); bọc mã vạch trong `<div className="visStage">` có `aspectRatio` theo mm.
- `PrecisionProductBarcode.scss` — **(preview)** `.visBox` thêm `position: relative` + `min-height: 108px`; thêm `.visStage` (`position:relative`, `--stretch` width 100% cho 1D, `--square` 96px cho QR/Matrix) và ép `.amz_barcode/.amz_qrcode/.amz_datamatrix` về `position: relative` + `width/height: 100%` (`svg`, `img` cũng 100%).

## Đợt 13 (đã xong)
Sửa 3 lỗi QLSX/YCSX do user báo:
1. In **Chỉ Thị / Chỉ Thị Combo**: tài khoản khác `NHU1903` báo lỗi "Command 'updateLossKT_ZTB_DM_HISTORY' not supported".
2. **QUICKPLAN2_backup**: cột `IS_SETTING` trong bảng Plan tạm không tick/bỏ tick được.
3. **YCSXManager → In Bản Vẽ**: logo QC PASS góc dưới-trái bị đẩy sang trang 2 khi in A4.

Trạng thái: **HOÀN THÀNH** — `npm run build` (vite) `✓ built in 1m 58s`, `get_errors` 0 lỗi.

## File đã chỉnh sửa (đợt 13)
- `QLSXPLAN/utils/khsxUtils.tsx` — `f_updateLossKT_ZTB_DM_HISTORY`: đổi command sang tên ĐÚNG của backend `updateDMLOSSKT_ZTB_DM_HISTORY` (nguồn lỗi popup đỏ); bước sync phụ trợ chỉ `console.warn` + trả `boolean`, không chặn luồng in.
- `PrecisionPlanDataTb/usePlanDataTbData.ts`, `usePlanDataTbOldData.ts`, `PLAN_DATATB.backup.tsx`, `Machine/MACHINE.tsx` — bỏ nhánh hard-code `if (userData?.EMPL_NO !== "NHU1903")` trong handler in Chỉ Thị/Combo (nguyên nhân "chỉ NHU1903 in được"), snapshot `[...qlsxplandatafilter.current]` trước `handle_UpdatePlan()` để bản in không bị rỗng sau khi grid reload.
- `QUICKPLAN/PrecisionQuickPlan/useQuickPlanData.ts` — thêm `handleToggleIsSetting` (đảo Y/N + ghi `localStorage["temp_plan_table"]` + clear selection) và export ra ngoài.
- `QUICKPLAN/PrecisionQuickPlan/PrecisionQuickPlanTableSection.tsx` — nhận prop `onToggleIsSetting` và truyền vào `getColumnQuickPlanDataTable({ onToggleIsSetting })` (trước đây gọi không tham số nên checkbox `checked` không có handler).
- `QUICKPLAN/QUICKPLAN2_backup.tsx` — destructure + truyền `onToggleIsSetting`.
- `ycsxmanager/PrecisionYCSX/PrecisionYCSXPrintModals.tsx` — `pageStyle` riêng cho bản vẽ: `@page { size: A4 landscape; margin: 0 }` + reset margin `html, body`.
- `ycsxmanager/DrawComponent/DrawComponent.scss` — `.drawcomponent` khai báo `297x208mm` + `overflow:hidden` + `break-inside:avoid`; `.draw { display:block }`; logo trái neo `bottom:4mm`.

## File đã chỉnh sửa (đợt 12 — mobile Amazon)
- `PrecisionYCSX/PrecisionAmzTab.tsx` — thêm `isMobile`; `isFilterHidden` khởi tạo theo `innerWidth <= 768` + effect; **ẩn khối `__kpiGrid` (4 card) trên mobile**; render `precision-ycsx__filterBackdrop`; nút đóng `__filterClose` trong `__filterHeader`; toolbar gắn modifier `__gridToolbar--compact` + nút toggle có class `__toolBtn--filterToggle`; **ẩn nhóm input `Offset X/Y` trên mobile** để toolbar scroll gọn hơn.
- `PrecisionYCSX/PrecisionAmzAddModal.tsx` — thêm `isMobile`; rút gọn tiêu đề (`NHẬP DỮ LIỆU AMZ`) + ẩn `p` subtitle; **chuyển inline style sang dạng mobile** (container `maxWidth/width/height`, `modal-body padding: 10`, grid `1.2fr 1.2fr 2fr` → `repeat(2,…)`, box thông tin `gridColumn: span 2`, banner upload xếp dọc, nhóm nút wrap, `modal-agtable-wrapper minHeight 380 → 220`) + rút gọn text (`Đã nạp`, `Kiểm tra trùng`, `Upload`, `XEM TRƯỚC AMZ`) + ẩn hint footer trên mobile.
- `PrecisionYCSX/PrecisionAmzTab.tsx` — (vòng 2) nút **EX1/EX2** trước đây là `<FiDownload /> EX1` (**text node trần**, không bọc `<span>`) nên rule `.compact .toolBtn > span { display:none }` không match ⇒ bị nhồi icon + chữ vào ô 30px, nhìn như nút "đen trắng, ríu rít". Đã bọc nhãn trong `<span>`, thêm accent `--emerald` và class `--keepLabel` để mobile **giữ nhãn ngắn** (EX1 53×30, EX2 55×30) thay vì icon-only.
- `PrecisionYCSX/PrecisionYCSX.scss` — thêm ngoại lệ `.precision-ycsx__toolBtn--keepLabel` trong block compact (4 class > 3 class của rule ẩn nhãn) + tăng `gap` của `__gridToolbarLeft/Right` từ 4px → 6px trên mobile.
- `PrecisionYCSX/PrecisionYCSX.scss` — **không cần thêm gì cho filter/modal**: block mobile đợt 11 cho `.precision-ycsx__filterPanel` (float) / `__filterClose` / `__gridToolbar--compact` / `.precision-ycsx-modal-container` được tái sử dụng vì `PrecisionAmzTab` dùng chung root `.precision-ycsx`.

## Việc cần làm tiếp theo
- Kiểm thử thiết bị thật: bộ lọc float có bị bàn phím che khi nhập `input[type=date]` không; thao tác Pivot/Print dialog trên màn 320px.
- **Dọn dead code**: `ycsxmanager/TraAMZ/TraAMZ.tsx` + `TraAMZ.scss` và `YCSXManager.backup.tsx`, `PlanManager*.backup.tsx` — chỉ còn được import bởi nhau, không route nào dùng ⇒ nên xoá.
- Mobile: `PrecisionYCSXEditModal`, `PrecisionYCSXPrintModals`, dialog in tem AMZ (MUI Dialog) chưa được tối ưu.
- Mobile: `PrecisionPOandStockFull`, `PrecisionQuotation` cũng để filter panel chiếm cột trái → áp lại pattern float này.

## Ghi chú kỹ thuật (đợt 10 — PlanManager mobile)
- **Nguyên nhân nút "Thêm Plan" biến mất**: `&__tabs` là flex item có `min-width: auto` mặc định; tab `white-space: nowrap` dài ⇒ min-content của tabs > bề rộng màn hình ⇒ `.precision-plan__header` (dù `flex-wrap: wrap`) bị tràn ngang và `.precision-plan` (`overflow: hidden`) cắt mất `&__headerRight`. **Fix 2 lớp**: (a) rút gọn nhãn tab bằng conditional rendering, (b) `&__tabs { flex:1 1 auto; min-width:0; overflow-x:auto }` + `&__headerRight { flex:0 0 auto; margin-left:auto }` ⇒ dù nhãn có dài thì tabs tự scroll, nút không bao giờ bị đẩy ra ngoài.
- **Panel float nên co theo nội dung** (`top:0; left:0; right:0; bottom:auto; max-height:100%`) thay vì `inset:0`: nếu phủ kín thì backdrop bị che (không bấm được) và phần dưới trống trơn. Đo được: panel 468px, backdrop 725px ⇒ còn **257px backdrop bấm được**. Vẫn phải có nút đóng X trong header cho chắc.
- Bộ lọc mobile dùng `flex-direction: column; align-items: stretch` + `.precision-plan__filterGroup { width:100% }`, nhãn `min-width:74px`, input `flex:1 1 auto` (phải override `width` của `--date`/`--text`); ẩn `__filterSep`; nút Tra Cứu full width 34px.
- Grid toolbar mobile: `&__gridToolbar`/`&__gridToolbarLeft` `flex-wrap: nowrap` + `overflow-x:auto` + nút `flex:0 0 auto`; **ẩn `&__gridMeta`** (số dòng đã có ở footer AG Grid) ⇒ 5 nút vừa trọn 1 hàng, không cần scroll.
- Lưu ý: `PrecisionPlan.scss` **không có token `$pp-radius-md`** (chỉ có `$pp-radius: 4px`) ⇒ dùng literal khi cần bo góc lớn hơn.
- **Modal `.pp-modal` không có media query nào** ⇒ mobile bị flex bóp nát: `.pp-modal__headerLeft` (flex item cạnh `__headerRight` 315px) co còn **88px** ⇒ title **8 dòng** + subtitle **9 dòng** (header cao **316px**), và nút X bị đẩy ra ngoài modal (`x=423` > modal right 377). `.pp-manual__info` cũng bị `__infoRight { white-space: nowrap }` bóp `__infoLeft` thành **18 dòng** (info cao **329px**). Sau fix: header **52px**, info **50px**, body **không cần scroll**, nút X nằm trong modal.
- Fix header modal mobile: `&__header { position: relative; flex-wrap: nowrap; padding: 10px 46px 10px 12px }` + `&__headerLeft { flex:1 1 auto; min-width:0 }` + `&__title { nowrap + ellipsis }` + `&__closeBtn { position:absolute; top:8px; right:8px }` (đưa X ra khỏi luồng để không chiếm dòng) + ẩn `__subtitle`.
- Fix info banner mobile: `flex-direction: column; align-items: stretch` + `__infoLeft { min-width:0; nowrap; ellipsis }`.
- **Pitfall**: `min-width: 0` là bắt buộc cho mọi flex item chứa text dài trong khối `display:flex` — nếu không, item sẽ co tới min-content (từng chữ) và text vỡ thành hàng chục dòng.

- **PITFALL quan trọng — nhãn nút là TEXT NODE trần thì CSS không ẩn được**: `<FiDownload /> EX1` (không bọc `<span>`) ⇒ rule `.compact .toolBtn > span { display:none }` không match ⇒ ô 30px bị nhồi cả icon lẫn chữ. **Luôn bọc nhãn trong `<span>`.**
- **Đổi chiến lược toolbar mobile (đợt 12 vòng 3)**: thay vì ép icon-only 30px, dùng `--keepLabel` + **nhãn NGẮN theo `isMobile`** (`label(short,full)` helper). Đo @393: 16 nút 1 hàng, tổng `scrollWidth 1188` (scroll ngang ~3 màn), mọi nút đủ chỗ chữ không tràn. Desktop giữ nguyên nhãn dài + 4 nút lock icon-only (`iconOnlyCount: 4`).
- **Pitfall**: `--keepLabel` phải có specificity CAO HƠN rule ẩn nhãn (4 class > 3 class) — chỉ thêm `!important` sẽ làm desktop cũng hiện nhãn sai.

## Ghi chú kỹ thuật (đợt 11 — YCSXManager mobile)
- Đo trước khi sửa @393×850: KPI chiếm **287px** (4 hàng × 1 cột); `__filterPanel` 220px tĩnh ⇒ `__content` chỉ còn **173px**; toolbar cao **352px** với nút xếp **10 hàng**; header `scrollWidth` 483 > 393 ⇒ nút `+ THÊM DỮ LIỆU AMZ` bị cắt.
- **`!important` ở base ⇒ override mobile cũng phải `!important`**: `__filterPanel`, `__content`, `__gridContainer`, `__mainBody`, `__tableContainer` khai báo gần như mọi thuộc tính kèm `!important` ⇒ block mobile phải dùng `!important` mới thắng.
- **Ẩn nhãn nút bằng CSS chỉ an toàn khi MỌI nút đều có icon**: nút `SET PENDING` trước đây chỉ có `<span>` ⇒ phải thêm `FiClock`, nếu không nút thành trống. Cách làm ít xâm lấn: gắn 1 modifier `__gridToolbar--compact` lên toolbar rồi CSS `.compact .toolBtn { width:30px; padding:0; > span { display:none } }`.
- **Inline style không thể bị CSS class đè** ⇒ với modal YCSX phải sửa ngay trong TSX: `style={{ maxWidth: isMobile ? "100%" : 1100, … }}`, `padding: isMobile ? 10 : 16`, `gridTemplateColumns: isMobile ? "repeat(2, minmax(0,1fr))" : …`.
- Panel float: dùng `top/left/right: 0; bottom: auto; max-height: 100%` (co theo nội dung) ⇒ backdrop còn **84px bấm được**; kèm nút X trong header.
- **Công cụ**: `page.setViewportSize()` có lúc **không còn tác dụng** giữa phiên (viewport bị kẹp theo pane thật của VS Code, tụt về 245px) ⇒ luôn đọc lại `innerWidth` trước khi kết luận layout bị bóp.

## Ghi chú kỹ thuật (đợt 9 — InvoiceManager mobile)
- **Bộ lọc float phủ trọn workspace** (`&__sidebar { position:absolute; inset:0 }`) ⇒ KHÔNG còn chỗ bấm backdrop để đóng (backdrop bị panel che hoàn toàn) ⇒ **bắt buộc có nút đóng riêng trong header panel**. Khác với `PrecisionPoManager` (panel có sẵn `MdClose`).
- **Phải khai báo lại `&__sidebar--collapsed` trong block mobile**: rule mobile `&__sidebar` cùng specificity (0,2,0) nhưng nằm SAU `&__sidebar--collapsed` của desktop ⇒ nếu không khai báo lại, trạng thái collapse sẽ bị đè và panel luôn mở.
- **Toolbar 1 hàng scroll ngang**: `&__toolbar-left { flex-wrap: nowrap; overflow-x: auto; min-width: 0; flex: 1 1 auto }` + `.stitch-inv__btn { flex: 0 0 auto; white-space: nowrap }`; ẩn `.stitch-inv__toolbar-right` (chỉ báo "Sẵn sàng") và ẩn scrollbar (`scrollbar-width:none`) cho gọn. Đo được: 8 nút `scrollWidth 825` vs `clientWidth 377` ở 393px, tất cả nằm 1 hàng.
- **KPI bar tách khỏi bộ lọc**: trên mobile panel bộ lọc là overlay nên widget bên trong sẽ bị ẩn theo ⇒ phải tách ra KPI bar cấp trang (ngoài `__workspace`) để luôn nhìn thấy.
- Đo ở 393px: KPI bar 393×51, 2 chip 185.5px/hàng, giá trị thực tế lớn (`445,810 EA`, `$11,331,644 USD`) **không bị clip**.

## Ghi chú kỹ thuật (đợt 8 — PrecisionPoManager mobile)
- **Vì sao `.po-kpi-grid--compact` đặt NGOÀI media query**: base viết `.precision-po-manager .po-kpi-grid .kpi-card` (0,3,0); block compact viết `.precision-po-manager .po-kpi-grid--compact .kpi-card` cũng (0,3,0) nhưng **sau** trong file ⇒ thắng, không cần `!important` và không phụ thuộc media query.
- **Phải override `max-height` của `.po-main-workspace`**: base đặt `max-height: calc(100% - 95px)` (giả định KPI grid 1 hàng ~95px). Mobile có KPI compact + gap ≈ 104px > 95px ⇒ giữ nguyên sẽ cắt ~9px đáy (mất footer). Mobile đặt `height:auto; max-height:none`.
- **Bộ lọc float**: `.po-main-workspace` giữ `display:flex` + thêm `position:relative`; panel `position:absolute; inset:0; z-index:40`, backdrop `z-index:35`. Bảng vẫn là flex item duy nhất trong luồng ⇒ full width, `height:100%` vẫn phân giải được (main size của flex column là definite).
- **Đo layout không cần backend**: trên dev server 3001, `await import("/src/pages/.../X.scss")` rồi `document.body.innerHTML = markup thật` → đo `getBoundingClientRect`/`getComputedStyle`. Phải `await document.fonts.ready` trước khi đo.
- **PITFALL nút icon-only mobile**: chỉ thêm class `.is-icon-only { width:30px; padding:0 }` là **không đủ** — nhãn `<span>` vẫn render nên chữ tràn khỏi nút (`scrollWidth > clientWidth`), icon bị co còn 0 ⇒ nút nhìn như "đen trắng". Phải **ẩn nhãn bằng conditional rendering ở TSX** (`{!isMobile && <span>…</span>}`) + rule bảo hiểm `.is-icon-only span { display:none }`, và tô accent theo hành động (`btn-action-edit` / `-invoice` / `-danger` / `-success` / `-pivot` / `-excel`).
- **Route thật của trang PO**: menu `Quản lý PO KD1` → `/kinhdoanh/pomanager` vẫn render `.precision-po-manager` (tab "Quản lý PO") ⇒ kiểm chứng được trên UI thật; `pomanager-v2` chỉ là alias route phụ.

## Ghi chú kỹ thuật tích luỹ
- **Đợt 6 — AccountInfo mobile**: `AccountInfo.tsx` chỉ là proxy → `PrecisionAccountInfo`; class SCSS là `precision-hub__*` (không phải `accountinfo`). Override mobile dùng modifier `.precision-hub--mobile` (specificity 0,2,0) nên thắng base (0,1,0) mà **không cần** `!important`; `__profileToolbar` có margin âm nên khi đổi padding card phải đổi margin tương ứng (`-20px → -14px`).
- **Pattern mobile chuẩn của repo**: `isMobile` lấy từ `window.matchMedia("(max-width: 768px)")` + listener `change`, rồi **conditional rendering** (không chỉ ẩn bằng CSS) — xem `PrecisionHeader.tsx`, `UserManager.tsx`, nay có hook chung `AccountInfo/useIsMobile.ts`.
- **Pitfall mobile (Stitch)**: `.component_element & { ... }` có specificity (0,2,0) nên **luôn thắng** block `@media` ở cấp `.precision-xxx` (0,1,0). Muốn mobile có tác dụng phải lặp lại `@media (max-width:768px)` **bên trong** `.component_element &` kèm `!important` cho `height`/`max-height`/`flex`/`overflow`; nếu không container bị `overflow:hidden` + `max-height:100%` + `flex-basis:0` ⇒ cắt cụt nội dung và mất thanh cuộn.
- **Pitfall schema danh mục nhân sự**: `MAINDEPTCODE`, `SUBDEPTCODE`, `WORK_POSITION_CODE` là mã **người dùng nhập**, không phải identity (xác nhận trong `practice1/services/nhansuService.js`) ⇒ không `readOnly` khi thêm mới.
- **Pitfall `insertemployee`**: ghi `ZTBEMPLINFO.CTR_CD = DATA.CTR_CD` (không lấy payload chung) ⇒ form thêm mới phải luôn có `CTR_CD`, nếu rỗng thì nhân viên mới không JOIN được với phòng ban/vị trí.
- **Pitfall face-api**: phải nạp `ssdMobilenetv1` + `faceLandmark68Net` + `faceRecognitionNet` từ `/models` trước `detectSingleFace()`. `f_addEmployee`/`f_updateEmployee` trả **chuỗi lỗi** (rỗng = OK), không throw.
- Đợt 4 — **`APPROVAL_STATUS = 0` là "Từ chối"** (`1` duyệt, `2` chờ, `3` xoá ⇒ backend đổi thành `DELETE`); ảnh thẻ ở `public/Picture_NS/NS_<EMPL_NO>.jpg`, không có `public/avatarpic/`.
- Đợt 4 — backend cũ có thể trả **chuỗi thuần** (`res.send("NO_LEADER")`); `generalQuery` **throw** khi lỗi mạng ⇒ phải bắt cả `tk_status === "NG"` và `catch`. Dùng `isTkOk`/`getTkMessage`/`getErrMessage` từ `src/api/services/responseService.ts`.
- Đợt 4 — **hành động hàng loạt phải giữ đúng gate của cell đơn lẻ** và không set state mù trước khi API trả về. **UI có field mà backend không nhận** (`dangkytangcacanhan` luôn dùng `moment()`; `FINAL_OVERTIMES` mới là số phút OT thật) ⇒ luôn đối chiếu service trước khi tin tham số trên form.
- **Đợt 14 — MUI `renderOption` không được spread props trực tiếp**: React 18.3 đã cảnh báo `A props object containing a "key" prop is being spread into JSX`; phải `const { key, ...optionProps } = props; return <li key={key} {...optionProps}>`.
- **Đợt 14 — popper của `Autocomplete` render qua Portal (append vào body)** ⇒ CSS scoped theo `.precision-xxx` **không** với tới; phải khai báo class riêng ở cấp global (kèm `slotProps.popper.className`).
- **Đợt 14 — SCSS dạng `.formItem input[type="text"]` sẽ bắt cả `<input>` bên trong `TextField` của MUI** (gây double border / sai chiều cao) ⇒ luôn scope bằng con trực tiếp `> input[type="text"]`.
- **Đợt 14 — `BARCODE/QRCODE/DATAMATRIX` (design_amazon) render `position:absolute; top/left: POS_X/POS_Y mm` + size mm** (thiết kế cho canvas tem in). Đặt thẳng vào khung xem trước ⇒ `offsetParent` là `.component_element` nên mã "dạt" ra góc trên-trái component, khung preview trống. Fix: khung cha `position:relative` + ép con về `position:relative; width/height:100%` và set tỉ lệ khung theo đúng mm của tem. `DATAMATRIX` render `<img>` (svg data-url) chứ không phải `<svg>` ⇒ phải override cả `img`.
- **Pitfall AG Grid**: `rowStyle`/`getRowStyle`/`getRowId` phải là reference ổn định, nếu không AG Grid redraw toàn bộ row (nháy cell SVG/QR/barcode).
- **Pitfall header mobile**: `PrecisionHeader.tsx` cũ render brand + omnibar + action trên một hàng flex `space-between` với `flex-shrink:0` ⇒ tràn ngang, nút ngôn ngữ/thông báo/user pill bị đẩy khỏi viewport. Đã sửa bằng conditional rendering theo `isMobile` (`matchMedia max-width:768px`): mobile chỉ còn brand + 2 nút (toggle search, overflow) và gom toàn bộ hành động vào `PrecisionHeaderMobileMenu.tsx`; ô search dùng chung biến `searchBoxNode`, mobile render trong `__mobileSearch` (`position:absolute; top:100%`) nên không tăng chiều cao 48px. Backup: `PrecisionHeader.backup.tsx`.
- Repo có sẵn nhiều lỗi `tsc --noEmit` ở module khác ⇒ **không dùng tsc làm gate**, dùng `npm run build` (vite) trong `g:\NODEJS\WEBCMS ERP2\cmsnewerp2`.
- Quy ước tài liệu: findings → `FINDINGS_PARITY_<AREA>_MODULES.md`; tiến độ → `ROADMAP.md`; task hiện tại → `ACTIVE_STATE.md` (≤ 80 dòng).
- Build kiểm chứng: đợt 3 `EXIT=0`; đợt 4 vòng 1 `✓ 17013 modules`, vòng 2 `✓ 17015 modules` (`✓ built in 1m 14s`), `node --check services/nhansuService.js` SYNTAX OK; đợt 5 `npm run build` `EXIT=0`; đợt 13 `✓ built in 1m 58s`.
- **Đợt 13 — route thật của QLSXPLAN**: `QLSXPLAN.tsx` chỉ render bản refactor khi `EMPL_NO === "NHU1903z"` (có chữ `z`, không ai khớp) ⇒ QUICK PLAN chạy `QUICKPLAN2_backup.tsx`, PLAN TABLE chạy `PLAN_DATATB_backup.tsx` + `usePlanDataTbOldData.ts`. Sửa bug phải sửa ở các file này.
- **Đợt 13 — tên command phải khớp `dbCommandHandlers`**: `practice1/services/dbService.js` tra `commandHandlers[command]`; tên command = tên hàm export trong `services/*.js`. Frontend gọi sai tên ⇒ `Command '...' not supported`. `generalQuery` tự inject `CTR_CD`/`COMPANY` nên không cần truyền tay.
- **Đợt 13 — in ấn**: `react-to-print` default pageStyle = `@page { margin: 0 }`. Nếu nội dung in là khối full-bleed cố định (ví dụ `297x208mm`) thì KHÔNG được set `@page { margin: 6mm }` (vùng in còn 198mm < 208mm ⇒ phần tử absolute bị đẩy trọn sang trang sau).

