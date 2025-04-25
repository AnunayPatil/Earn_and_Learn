"use client"

import { useState, useEffect } from "react"
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material"
import axios from "axios"
import { PDFDownloadLink } from "@react-pdf/renderer"
import ReportPDF from "./ReportPDF"

const MonthlyReportView = ({ studentId, isAdmin = false }) => {
  const [loading, setLoading] = useState(true)
  const [availableMonths, setAvailableMonths] = useState([])
  const [selectedMonth, setSelectedMonth] = useState(null)
  const [selectedYear, setSelectedYear] = useState(null)
  const [reportData, setReportData] = useState(null)

  // Get current month and year for default selection
  const currentDate = new Date()
  const currentMonth = currentDate.getMonth() + 1 // JavaScript months are 0-indexed
  const currentYear = currentDate.getFullYear()

  // Fetch available months for reports
  useEffect(() => {
    const fetchAvailableMonths = async () => {
      try {
        const res = await axios.get(`https://earn-and-learn-backend.onrender.com/api/reports/available-months/${studentId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        setAvailableMonths(res.data)

        // Set default selection to current month if available, otherwise first available month
        if (res.data.length > 0) {
          const currentMonthData = res.data.find((m) => m.month === currentMonth && m.year === currentYear)
          if (currentMonthData) {
            setSelectedMonth(currentMonthData.month)
            setSelectedYear(currentMonthData.year)
          } else {
            setSelectedMonth(res.data[0].month)
            setSelectedYear(res.data[0].year)
          }
        }
      } catch (err) {
        console.error("Error fetching available months:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchAvailableMonths()
  }, [studentId, currentMonth, currentYear])

  // Fetch report data when month/year selection changes
  useEffect(() => {
    if (selectedMonth && selectedYear) {
      fetchReportData(selectedYear, selectedMonth)
    }
  }, [selectedMonth, selectedYear, studentId])

  const fetchReportData = async (year, month) => {
    try {
      setLoading(true)
      const res = await axios.get(`https://earn-and-learn-backend.onrender.com/api/reports/monthly/${studentId}/${year}/${month}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      setReportData(res.data)
    } catch (err) {
      console.error("Error fetching report data:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleMonthChange = (event) => {
    const value = event.target.value
    const [year, month] = value.split("-")
    setSelectedYear(Number.parseInt(year))
    setSelectedMonth(Number.parseInt(month))
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString()
  }

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const getMonthName = (month) => {
    return new Date(2000, month - 1, 1).toLocaleString("default", { month: "long" })
  }

  if (loading && !reportData) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (availableMonths.length === 0) {
    return (
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6">No work entries found</Typography>
        <Typography>There are no work entries available to generate reports.</Typography>
      </Paper>
    )
  }

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h6">Monthly Work Report</Typography>

        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="month-select-label">Select Month</InputLabel>
          <Select
            labelId="month-select-label"
            value={`${selectedYear}-${selectedMonth}`}
            label="Select Month"
            onChange={handleMonthChange}
          >
            {availableMonths.map((m) => (
              <MenuItem key={`${m.year}-${m.month}`} value={`${m.year}-${m.month}`}>
                {getMonthName(m.month)} {m.year}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
          <CircularProgress />
        </Box>
      ) : reportData ? (
        <>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6">
              {getMonthName(reportData.month)} {reportData.year} Report
            </Typography>
            <Typography>Student: {reportData.student.email}</Typography>
            <Typography>Total Days Worked: {reportData.summary.totalDays}</Typography>
            <Typography>Total Hours: {reportData.summary.totalHours.toFixed(2)}</Typography>
            <Typography>Total Earnings: ₹{reportData.summary.totalEarnings.toFixed(2)}</Typography>

            {reportData.entries.length > 0 && (
              <PDFDownloadLink
                document={<ReportPDF reportData={reportData} />}
                fileName={`work-report-${reportData.student.email}-${reportData.month}-${reportData.year}.pdf`}
                style={{
                  textDecoration: "none",
                  marginTop: "16px",
                  display: "inline-block",
                }}
              >
                {({ blob, url, loading, error }) => (
                  <Button variant="contained" color="primary" disabled={loading}>
                    {loading ? "Generating PDF..." : "Download PDF Report"}
                  </Button>
                )}
              </PDFDownloadLink>
            )}
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Work Location</TableCell>
                  <TableCell>In Time</TableCell>
                  <TableCell>Out Time</TableCell>
                  <TableCell>Total Hours</TableCell>
                  <TableCell>Amount Earned</TableCell>
                  <TableCell>Faculty Name</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reportData.entries.map((entry) => (
                  <TableRow key={entry._id}>
                    <TableCell>{formatDate(entry.inTime)}</TableCell>
                    <TableCell>{entry.workLocation}</TableCell>
                    <TableCell>{formatTime(entry.inTime)}</TableCell>
                    <TableCell>{formatTime(entry.outTime)}</TableCell>
                    <TableCell>{entry.totalHours.toFixed(2)}</TableCell>
                    <TableCell>₹{entry.amountEarned.toFixed(2)}</TableCell>
                    <TableCell>{entry.facultyName}</TableCell>
                    <TableCell>{entry.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      ) : (
        <Typography>Select a month to view the report</Typography>
      )}
    </Paper>
  )
}

export default MonthlyReportView
