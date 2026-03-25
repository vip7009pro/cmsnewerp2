const fs = require('fs');
const path = require('path');

const fixes = [
  {
    file: 'src/pages/information_board/PostManager.tsx',
    patterns: [
      [/onCellEditingStopped=\{?\(e\)\s*=>/g, 'onCellEditingStopped={(e: any) =>'],
      [/onRowClick=\{?\(e\)\s*=>/g, 'onRowClick={(e: any) =>'],
      [/onSelectionChange=\{?\(e\)\s*=>/g, 'onSelectionChange={(e: any) =>']
    ]
  }
];

const files = [
  'src/pages/information_board/PostManager.tsx',
  'src/pages/nhansu/BangChamCong/BangChamCong.tsx',
  'src/pages/nhansu/DiemDanhNhom/DiemDanhNhomCMS.tsx',
  'src/pages/nhansu/DieuChuyenTeam/DieuChuyenTeamCMS.tsx',
  'src/pages/nhansu/PheDuyetNghi/PheDuyetNghiCMS.tsx',
  'src/pages/nocodelowcode/components/RelationshipsManager/RelationshipsManager.tsx',
  'src/pages/nocodelowcode/DBManager/DBManager.tsx',
  'src/pages/qc/dtc/ADDSPECDTC.tsx',
  'src/pages/qc/dtc/DKDTC.tsx',
  'src/pages/qc/dtc/DTCRESULT.tsx',
  'src/pages/qc/dtc/KQDTC.tsx',
  'src/pages/qc/dtc/SPECDTC.tsx',
  'src/pages/qc/iqc/BLOCK.tsx',
  'src/pages/qc/iqc/FAILING.tsx',
  'src/pages/qc/iqc/HOLDING.tsx',
  'src/pages/qc/iqc/INCOMMING.tsx',
  'src/pages/qc/iqc/NCR_MANAGER.tsx',
  'src/pages/qc/inspection/INSPECTION.tsx',
  'src/pages/qc/inspection/INSPECTION_KPI_NV_NEW/INSPECTION_KPI_NV_NEW.tsx',
  'src/pages/qc/inspection/LOSS_TIME_DATA/LOSS_TIME_DATA.tsx',
  'src/pages/qc/iso/DOCUMENT/ALLDOC.tsx',
  'src/pages/qc/oqc/QTR_DATA.tsx',
  'src/pages/qc/pqc/TRAPQC.tsx',
  'src/pages/qlsx/QLSXPLAN/DATASX/DATASX.tsx',
  'src/pages/qlsx/QLSXPLAN/EQ_STATUS/EQ_STATUS2.tsx',
  'src/pages/qlsx/QLSXPLAN/LICHSUCHITHITABLE/LONGTERM_PLAN.tsx',
  'src/pages/qlsx/QLSXPLAN/LICHSUINPUTLIEU/LICHSUINPUTLIEU.tsx',
  'src/pages/sx/BTP_AUTO/BTP_AUTO.tsx',
  'src/pages/sx/INNHANH_KPI/INNHANH_KPI.tsx',
  'src/pages/sx/KPI_NV_NEW2/KPI_NV_NEW2.tsx',
  'src/pages/sx/LICHSUDAOFILM/DAOFILMDATA.tsx',
  'src/pages/sx/LOSS_TIME_DATA/LOSS_TIME_DATA.tsx',
  'src/pages/sx/MAINDEFECTS/MAINDEFECTS.tsx'
];

let fixed = 0;

files.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    const original = content;
    
    // Pattern: onXxx={(e) => to onXxx={(e: any) =>
    content = content.replace(/\(\(e\)\s*=>/g, '((e: any) =>');
    content = content.replace(/\{\(e\)\s*=>/g, '{(e: any) =>');
    content = content.replace(/=\{\(e\)\s*=>/g, '={(e: any) =>');
    content = content.replace(/=\{async\s*\(e\)\s*=>/g, '={async (e: any) =>');
    
    // Pattern: onXxx={(params) => to onXxx={(params: any) =>
    content = content.replace(/\(\(params\)\s*=>/g, '((params: any) =>');
    content = content.replace(/=\{\(params\)\s*=>/g, '={(params: any) =>');
    
    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      fixed++;
      console.log(`✓ Fixed: ${file}`);
    }
  }
});

console.log(`\nTotal files fixed: ${fixed}`);
