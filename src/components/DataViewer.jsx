import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TextField,
  CircularProgress,
  Box,
} from "@mui/material";

const requiredColumns = [
  "created_dt",
  "data_source_modified_dt",
  "entity_type",
  "operating_status",
  "legal_name",
  "dba_name",
  "physical_address",
  "phone",
  "usdot_number",
  "mc_mx_ff_number",
  "power_units",
  "out_of_service_date",
];
const columnDisplayNames = {
  created_dt: "Created_DT",
  data_source_modified_dt: "Modified_DT",
  entity_type: "Entity",
  operating_status: "Operating status",
  legal_name: "Legal name",
  dba_name: "DBA name",
  physical_address: "Physical address",
  phone: "Phone",
  usdot_number: "DOT",
  mc_mx_ff_number: "MC/MX/FF",
  power_units: "Power units",
  out_of_service_date: "Out of service date",
};
const DataViewer = () => {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState(requiredColumns);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "https://docs.google.com/spreadsheets/d/1hB_LjBT9ezZigXnC-MblT2PXZledkZqBnvV23ssfSuE/gviz/tq?tqx=out:json"
        );

        const jsonData = JSON.parse(
          response.data.substring(47, response.data.length - 2)
        );
        const rows =
          jsonData?.table?.rows.map((row) => {
            const rowData = {};
            row.c.forEach((cell, index) => {
              const colId = jsonData.table.cols[index]?.label;
              if (requiredColumns.includes(colId)) {
                rowData[colId] = cell?.v || "";
              }
            });
            return rowData;
          }) || [];
        setData(rows);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const filteredData = data.filter((row) => {
    return Object.keys(filters).every((key) => {
      return row[key]
        ? row[key].toString().toLowerCase().includes(filters[key].toLowerCase())
        : true;
    });
  });

  return (
    <Paper sx={{ width: "100%" }}>
      <Box
        sx={{
          display: "flex",
          gap: "1rem",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        {columns.map((column) => (
          <TextField
            key={column}
            label={column}
            name={column}
            value={filters[column] || ""}
            onChange={handleFilterChange}
            variant="outlined"
            margin="dense"
            sx={{
              flex: "1",
              flexBasis: "calc(20% - 0.5rem)",
            }}
          />
        ))}
      </Box>
      <TableContainer>
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "200px",
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell key={column}>
                    {columnDisplayNames[column]}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => (
                  <TableRow key={index}>
                    {columns.map((column) => (
                      <TableCell key={column}>{row[column]}</TableCell>
                    ))}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        )}
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default DataViewer;
