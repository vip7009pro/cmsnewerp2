import { GridProps as OriginalGridProps } from '@mui/material/Grid';

declare module '@mui/material/Grid' {
  interface GridProps extends OriginalGridProps {
    item?: boolean;
    container?: boolean;
    xs?: boolean | number | 'auto';
    sm?: boolean | number | 'auto';
    md?: boolean | number | 'auto';
    lg?: boolean | number | 'auto';
    xl?: boolean | number | 'auto';
    zeroMinWidth?: boolean;
  }
}
