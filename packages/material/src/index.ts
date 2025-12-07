// Re-export MUI components
export * from '@mui/material';

// Re-export icons as namespace to avoid conflicts (Badge, Input, Link, List, Menu, Radio, Tab)
export * as Icons from '@mui/icons-material';

// Re-export DataGrid components (excluding Grid* conflicts with @mui/material)
export {
  DataGrid,
  type DataGridProps,
  type GridColDef,
  type GridRowParams,
  type GridCellParams,
  type GridRenderCellParams,
  type GridValueGetter,
  type GridSortModel,
  type GridFilterModel,
  type GridPaginationModel,
  type GridRowSelectionModel,
  GridToolbar,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarQuickFilter,
} from '@mui/x-data-grid';

// Export custom theme
export { theme } from './theme';
