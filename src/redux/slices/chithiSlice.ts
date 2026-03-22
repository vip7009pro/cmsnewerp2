import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { QLSXPLANDATA } from "../../pages/qlsx/QLSXPLAN/interfaces/khsxInterface";
import {
  initialTotalState,
  showAddPlanSuccess,
  showOnlyOneStep0Allowed,
  showOnlySameYcsxAllowed,
  showPlanIdAlreadyAdded,
  showResetPlanSuccess,
} from "./totalParts/initialTotalState";

export type ChithiState = {
  multiple_chithi_array: QLSXPLANDATA[];
};

const initialState: ChithiState = {
  multiple_chithi_array: initialTotalState.multiple_chithi_array,
};

const chithiSlice = createSlice({
  name: "chithi",
  initialState,
  reducers: {
    addChithiArray: (state, action: PayloadAction<QLSXPLANDATA>) => {
      let temp_plan_id_array: string[] = state.multiple_chithi_array.map(
        (element: QLSXPLANDATA) => {
          return element.PLAN_ID;
        },
      );

      let temp_plan_step_array: QLSXPLANDATA[] = state.multiple_chithi_array.filter(
        (element: QLSXPLANDATA) => {
          return element.STEP === 0;
        },
      );

      if (temp_plan_id_array.indexOf(action.payload.PLAN_ID) !== -1) {
        showPlanIdAlreadyAdded();
      } else {
        if (temp_plan_step_array.length > 0 && action.payload.STEP === 0) {
          showOnlyOneStep0Allowed();
        } else {
          if (state.multiple_chithi_array.length === 0) {
            state.multiple_chithi_array = [...state.multiple_chithi_array, action.payload];
            showAddPlanSuccess();
          } else {
            if (state.multiple_chithi_array[0].PROD_REQUEST_NO === action.payload.PROD_REQUEST_NO) {
              state.multiple_chithi_array = [...state.multiple_chithi_array, action.payload];
              showAddPlanSuccess();
            } else {
              showOnlySameYcsxAllowed();
            }
          }
        }
      }
    },
    resetChithiArray: (state) => {
      state.multiple_chithi_array = [];
      showResetPlanSuccess();
    },
  },
});

export const { addChithiArray, resetChithiArray } = chithiSlice.actions;

export default chithiSlice.reducer;
