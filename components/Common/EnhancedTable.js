import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import { NotificationManager } from 'react-notifications';

import axios from 'axios';
import baseUrl from '../../utils/baseUrl';

// function createData(_id, name, email, age, phone, services, bkdate, status) {
//   return {
//     _id,
//     name,
//     email,
//     age,
//     phone,
//     services,
//     bkdate,
//     status,
//   };
// }

// const rows = [
//   createData('Cupcake', 305, 3.7, 67, 4.3, 67, 4.3),
//   createData('Donut', 452, 25.0, 51, 4.9, 67, 4.3),
//   createData('Eclair', 262, 16.0, 24, 6.0, 67, 4.3),
//   createData('Frozen yoghurt', 159, 6.0, 24, 4.0, 67, 4.3),
//   createData('Gingerbread', 356, 16.0, 49, 3.9, 67, 4.3),
//   createData('Honeycomb', 408, 3.2, 87, 6.5, 67, 4.3),
//   createData('Ice cream sandwich', 237, 9.0, 37, 4.3, 67, 4.3),
//   createData('Jelly Bean', 375, 0.0, 94, 0.0, 67, 4.3),
//   createData('KitKat', 518, 26.0, 65, 7.0, 67, 4.3),
//   createData('Lollipop', 392, 0.2, 98, 0.0, 67, 4.3),
//   createData('Marshmallow', 318, 0, 81, 2.0, 67, 4.3),
//   createData('Nougat', 360, 19.0, 9, 37.0, 67, 4.3),
//   createData('Oreo', 437, 18.0, 63, 4.0, 67, 4.3),
// ];

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
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
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

const headCells = [
  {
    id: 'name',
    numeric: false,
    disablePadding: true,
    label: 'Name',
  },
  {
    id: 'email',
    numeric: false,
    disablePadding: false,
    label: 'Email',
  },
  {
    id: 'age',
    numeric: true,
    disablePadding: false,
    label: 'Age',
  },
  {
    id: 'phone',
    numeric: false,
    disablePadding: false,
    label: 'Phone',
  },
  {
    id: 'services',
    numeric: false,
    disablePadding: false,
    label: 'Services',
  },
  {
    id: 'bkdate',
    numeric: true,
    disablePadding: false,
    label: 'Book Time',
  },
  {
    id: 'status',
    numeric: true,
    disablePadding: false,
    label: 'Status',
  }
];

function EnhancedTableHead(props) {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;

    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
        <TableRow>
            <TableCell padding="checkbox">
                <Checkbox
                    color="primary"
                    indeterminate={numSelected > 0 && numSelected < rowCount}
                    checked={rowCount > 0 && numSelected === rowCount}
                    onChange={onSelectAllClick}
                    inputProps={{
                    'aria-label': 'select all desserts',
                    }}
                />
            </TableCell>
            {headCells.map((headCell) => (
            <TableCell
                key={headCell.id}
                align='right'
                padding='none'
                sortDirection={orderBy === headCell.id ? order : false}
            >
                <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
                >
                {headCell.label}
                {orderBy === headCell.id ? (
                    <Box component="span" sx={visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                    </Box>
                ) : null}
                </TableSortLabel>
            </TableCell>
            ))}
        </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};


export default function EnhancedTable() {
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('calories');
    const [selected, setSelected] = useState([]);
    const [page, setPage] = useState(0);
    const [dense, setDense] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [rows, setRows] = useState([]);


    const parseISOString = (s) => {
        var b = s.split(/\D+/);
        return (b[0] + '-' +  b[1] + '-' + b[2] + ' ' + b[3] + ':' + b[4] + ':' + b[5]);
    }

    useEffect(() => {
        const url = `${baseUrl}/api/appointment`;
        axios.get(url)
        .then((res) => {
            setRows(res.data);
        })
        .catch( (err) => {
            NotificationManager.error('Error Message', 'Something went wrong')
        });
    }, [])

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = rows.map((n) => n._id);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, id) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
        newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
        newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
        newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
        newSelected = newSelected.concat(
            selected.slice(0, selectedIndex),
            selected.slice(selectedIndex + 1),
        );
        }

        setSelected(newSelected);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleChangeDense = (event) => {
        setDense(event.target.checked);
    };

    const handleClickDelete = () => {
        const url = `${baseUrl}/api/appointment/delete`;
        axios.post(url, { selected })
        .then((res) => {
            if(res.status === 200){
                setRows(res.data);
                NotificationManager.info('Info message', `${selected.length} item was deleted!`);
                setSelected([]);
            } else {
                NotificationManager.error('Error Message', 'Something went wrong');
            }
        })
        .catch((err) => {
            NotificationManager.error('Error Message', 'Something went wrong');
        });
    }

    const isSelected = (name) => selected.indexOf(name) !== -1;

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    return (
        <Box sx={{ width: '100%' }}>
        <Paper sx={{ width: '100%', mb: 2 }}>
        <Toolbar
            sx={{
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
                ...(selected.length > 0 && {
                bgcolor: (theme) =>
                    alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                }),
            }}
            >
            {selected.length > 0 ? (
                <Typography
                sx={{ flex: '1 1 100%' }}
                color="inherit"
                variant="subtitle1"
                component="div"
                >
                {selected.length} selected
                </Typography>
            ) : (
                <Typography
                sx={{ flex: '1 1 100%' }}
                variant="h6"
                id="tableTitle"
                component="div"
                >
                Appointmented List
                </Typography>
            )}

            {selected.length > 0 ? (
                <Tooltip title="Delete">
                <IconButton onClick={handleClickDelete}>
                    <DeleteIcon />
                </IconButton>
                </Tooltip>
            ) : (
                <Tooltip title="Filter list">
                <IconButton>
                    <FilterListIcon />
                </IconButton>
                </Tooltip>
            )}
            </Toolbar>
            <TableContainer>
            <Table
                sx={{ minWidth: 750 }}
                aria-labelledby="tableTitle"
                size={dense ? 'small' : 'medium'}
            >
                <EnhancedTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={rows.length}
                />
                <TableBody>
                {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                    rows.slice().sort(getComparator(order, orderBy)) */}
                {stableSort(rows, getComparator(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                    const isItemSelected = isSelected(row._id);
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                        <TableRow
                        hover
                        onClick={(event) => handleClick(event, row._id)}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row._id}
                        selected={isItemSelected}
                        >
                        <TableCell padding="checkbox">
                            <Checkbox
                            color="primary"
                            checked={isItemSelected}
                            inputProps={{
                                'aria-labelledby': labelId,
                            }}
                            />
                        </TableCell>
                        <TableCell
                            component="th"
                            id={labelId}
                            scope="row"
                            padding="none"
                            align="right"
                        >
                            {row.name}
                        </TableCell>
                        <TableCell align="right">{row.email}</TableCell>
                        <TableCell align="right">{row.age}</TableCell>
                        <TableCell align="right">{row.phone}</TableCell>
                        <TableCell align="right">{row.services}</TableCell>
                        <TableCell align="right">{ parseISOString(row.date) }</TableCell>
                        <TableCell align="right">{ row.isopen ? 'Opened' : 'New'}</TableCell>
                        </TableRow>
                    );
                    })}
                {emptyRows > 0 && (
                    <TableRow
                    style={{
                        height: (dense ? 33 : 53) * emptyRows,
                    }}
                    >
                    <TableCell colSpan={6} />
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
        <FormControlLabel
            control={<Switch checked={dense} onChange={handleChangeDense} />}
            label="Dense padding"
        />
        </Box>
    );
}