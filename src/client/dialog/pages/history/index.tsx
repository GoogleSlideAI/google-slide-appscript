import { useState } from 'react';
import { 
  DataGrid, 
  GridColDef,
  GridRenderCellParams 
} from '@mui/x-data-grid';
import { useAppStore } from '../../../shared/stores';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { IconButton, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { Trash } from 'react-bootstrap-icons';

// Initialize dayjs relative time plugin
dayjs.extend(relativeTime);

const History = () => {
  const histories = useAppStore((state) => state.histories);
  const removeHistory = useAppStore((state) => state.removeHistory);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
  };

  const handleDeleteConfirm = () => {
    if (deleteId) {
      removeHistory(deleteId);
      setDeleteId(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteId(null);
  };

  const columns: GridColDef[] = [
    { 
      field: 'id', 
      headerName: 'ID', 
      width: 130,
      renderCell: (params: GridRenderCellParams) => (
        <div className="truncate" title={params.value}>
          {params.value}
        </div>
      )
    },
    { 
      field: 'title', 
      headerName: 'Title', 
      flex: 1,
      minWidth: 200 
    },
    { 
      field: 'createdAt', 
      headerName: 'Created', 
      width: 180,
      // Remove valueGetter and handle formatting in renderCell
      renderCell: (params: GridRenderCellParams) => {
        const formattedDate = dayjs(params.row.createdAt).fromNow();
        const fullDate = dayjs(params.row.createdAt).format('YYYY-MM-DD HH:mm:ss');
        
        return (
          <Tooltip title={fullDate}>
            <div>{formattedDate}</div>
          </Tooltip>
        );
      }
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Tooltip title="Delete">
          <IconButton 
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteClick(params.row.id);
            }}
            size="small"
            className="text-gray-500 hover:text-red-500"
          >
            <Trash size={20} />
          </IconButton>
        </Tooltip>
      )
    }
  ];

  return (
    <div className="p-6 h-full">
      <div className="mb-4">
        <h1 className="text-2xl font-semibold">History</h1>
      </div>
      <div className="h-[calc(100vh-100px)] w-full">
        <DataGrid
          rows={histories}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
            sorting: {
              sortModel: [{ field: 'createdAt', sort: 'desc' }]
            }
          }}
          pageSizeOptions={[5, 10, 20]}
          disableRowSelectionOnClick
          className="bg-white"
          getRowId={(row) => row.id}
        />
      </div>

      <Dialog open={!!deleteId} onClose={handleDeleteCancel}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this history item?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default History;