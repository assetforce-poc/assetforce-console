// Re-export MUI components
export * from '@mui/material';

// Re-export icons as namespace to avoid conflicts (Badge, Input, Link, List, Menu, Radio, Tab)
export * as Icons from '@mui/icons-material';

// Re-export DataGrid components (excluding Grid* conflicts with @mui/material)
export {
  DataGrid,
  type DataGridProps,
  type GridCellParams,
  type GridColDef,
  type GridFilterModel,
  type GridPaginationModel,
  type GridRenderCellParams,
  type GridRowParams,
  type GridRowSelectionModel,
  type GridSortModel,
  GridToolbar,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarFilterButton,
  GridToolbarQuickFilter,
  type GridValueGetter,
} from '@mui/x-data-grid';

// Export custom theme
export { theme } from './theme';
