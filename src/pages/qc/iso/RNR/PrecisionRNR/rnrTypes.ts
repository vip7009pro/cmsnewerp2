export interface RNRKpiMetrics {
  viewMode: "detail" | "summaryByEmpl" | "summaryByDept";
  // Detail metrics
  totalQuestions: number;
  testCount: number;
  accuracyRate1: number;
  true1Count: number;
  eval1Count: number;
  accuracyRate2: number;
  true2Count: number;
  eval2Count: number;
  uniqueEmpls: number;
  totalOkStandard: number;
  totalNgStandard: number;

  // Summary by Empl metrics
  totalExaminees: number;
  deptCount: number;
  passRate1: number;
  pass1Count: number;
  fail1Count: number;
  avgScore1: number;
  maxScore1: number;
  minScore1: number;
  passRate2: number;
  pass2Count: number;
  avgScore2: number;
  avgBNRate: number;
  avgBSRate: number;

  // Summary by Dept metrics
  totalDepts: number;
  topDeptName: string;
  topDeptRate: number;
  lowestDeptName: string;
  lowestDeptRate: number;
  overallAvgScore1: number;
}
