"use client";

import { useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  useTheme,
  Button,
  Dialog,
} from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import { Edit, Delete, Visibility, DeleteForever } from "@mui/icons-material";
import axios from "axios";

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const DataTable = ({
  columns,
  rows,
  onView,
  onEdit,
  onDelete,
  showActions = true,
  initialOrderBy = "id",
  initialOrder = "asc",
  fetchWorkEntries,
}) => {
  const theme = useTheme();
  const [order, setOrder] = useState(initialOrder);
  const [orderBy, setOrderBy] = useState(initialOrderBy);
  const [page, setPage] = useState(0);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const handleClose = () => {
    setOpen(false);
  };
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return theme.palette.success;
      case "pending":
        return theme.palette.warning;
      case "rejected":
        return theme.palette.error;
      case "active":
        return theme.palette.success;
      case "inactive":
        return theme.palette.error;
      case "completed":
        return theme.palette.success;
      default:
        return theme.palette.info;
    }
  };

  const deteleWorkEntry = async (id) => {
    await axios
      .delete(
        `https://earn-and-learn-backend.onrender.com/api/work-entries/${id}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      )
      .then((response) => {
        fetchWorkEntries();
        console.log("Work entry deleted successfully:", response.data);
      })
      .catch((error) => {
        console.error("Error deleting work entry:", error);
      });
  };

  const renderCellContent = (column, row) => {
    const value = row[column.id];

    if (column.id === "actions") {
      return (
        <>
          <Tooltip title="Delete Work Entry">
            <Button
              onClick={() => {
                setDeleteId(row._id);
                setOpen(true);
              }}
            >
              <DeleteForever style={{ color: "red" }} />
            </Button>
          </Tooltip>
        </>
      );
    }

    if (column.type === "status") {
      const statusColor = getStatusColor(value);
      return (
        <Chip
          label={value?.charAt(0).toUpperCase() + value?.slice(1) || ""}
          size="small"
          sx={{
            bgcolor: `${statusColor.main}15`,
            color: statusColor.main,
            fontWeight: 500,
            minWidth: 80,
          }}
        />
      );
    }

    if (column.type === "date") {
      return new Date(value).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    }

    if (column.type === "time") {
      return new Date(value).toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    }

    if (column.type === "currency") {
      return `₹${Number.parseFloat(value).toFixed(2)}`;
    }

    if (column.type === "number") {
      return Number.parseFloat(value).toFixed(column.precision || 0);
    }

    if (column.render) {
      return column.render(value, row);
    }

    return value;
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  return (
    <Box sx={{ width: "100%" }}>
      <Paper
        sx={{
          width: "100%",
          mb: 2,
          borderRadius: 2,
          overflow: "hidden",
          boxShadow: 2,
        }}
      >
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size="medium"
          >
            <TableHead>
              <TableRow sx={{ bgcolor: theme.palette.primary.main }}>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.numeric ? "right" : "left"}
                    sortDirection={orderBy === column.id ? order : false}
                    sx={{ color: "white", fontWeight: "bold" }}
                  >
                    <TableSortLabel
                      active={orderBy === column.id}
                      direction={orderBy === column.id ? order : "asc"}
                      onClick={() => handleRequestSort(column.id)}
                      sx={{
                        color: "white !important",
                        "&.MuiTableSortLabel-active": {
                          color: "white !important",
                        },
                        "& .MuiTableSortLabel-icon": {
                          color: "white !important",
                        },
                      }}
                    >
                      {column.label}
                      {orderBy === column.id ? (
                        <Box component="span" sx={visuallyHidden}>
                          {order === "desc"
                            ? "sorted descending"
                            : "sorted ascending"}
                        </Box>
                      ) : null}
                    </TableSortLabel>
                  </TableCell>
                ))}
                {showActions && (
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Actions
                  </TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  return (
                    <TableRow
                      hover
                      tabIndex={-1}
                      key={row.id || index}
                      sx={{
                        "&:nth-of-type(odd)": {
                          bgcolor: "rgba(0, 0, 0, 0.02)",
                        },
                        "&:hover": { bgcolor: "rgba(0, 0, 0, 0.04)" },
                      }}
                    >
                      {columns.map((column) => (
                        <TableCell
                          key={column.id}
                          align={column.numeric ? "right" : "left"}
                        >
                          {renderCellContent(column, row)}
                        </TableCell>
                      ))}
                      {showActions && (
                        <TableCell>
                          <Box sx={{ display: "flex" }}>
                            {onView && (
                              <Tooltip title="View">
                                <IconButton
                                  size="small"
                                  onClick={() => onView(row)}
                                  color="info"
                                >
                                  <Visibility fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                            {onEdit && (
                              <Tooltip title="Edit">
                                <IconButton
                                  size="small"
                                  onClick={() => onEdit(row)}
                                  color="primary"
                                >
                                  <Edit fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                            {onDelete && (
                              <Tooltip title="Delete">
                                <IconButton
                                  size="small"
                                  onClick={() => onDelete(row)}
                                  color="error"
                                >
                                  <Delete fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                          </Box>
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={columns.length + (showActions ? 1 : 0)} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
        style={{ backgroundColor: "transparent" }}
      >
        <Box sx={{ padding: 2 }}>
          <h2>Are you sure you want to delete this work entry?</h2>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Button variant="contained" color="primary" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                deteleWorkEntry(deleteId);
                setDeleteId(null);
                handleClose();
              }}
            >
              Delete
            </Button>
          </Box>
        </Box>
      </Dialog>
    </Box>
  );
};

export default DataTable;
