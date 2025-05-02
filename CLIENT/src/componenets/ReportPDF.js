"use client"

import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer"

// Register custom fonts


// Register custom fonts
Font.register({
  family: "Montserrat",
  fonts: [
    { src: "https://fonts.gstatic.com/s/montserrat/v15/JTUSjIg1_i6t8kCHKm459Wlhzg.ttf", fontWeight: 400 },
    { src: "https://fonts.gstatic.com/s/montserrat/v15/JTURjIg1_i6t8kCHKm45_bZF3gnD-w.ttf", fontWeight: 600 },
    { src: "https://fonts.gstatic.com/s/montserrat/v15/JTURjIg1_i6t8kCHKm45_dJE3gnD-w.ttf", fontWeight: 700 },
  ],
})

Font.register({
  family: "Open Sans",
  fonts: [
    { src: "https://fonts.gstatic.com/s/opensans/v18/mem8YaGs126MiZpBA-UFVZ0e.ttf", fontWeight: 400 },
    { src: "https://fonts.gstatic.com/s/opensans/v18/mem5YaGs126MiZpBA-UNirkOUuhs.ttf", fontWeight: 600 },
  ],
})

// Create styles with improved typography and colors
const styles = StyleSheet.create({
  page: {
    fontFamily: "Open Sans",
    fontSize: 10,
    color: "#333333",
    backgroundColor: "#FFFFFF",
    padding: 0,
  },
  mainContent: {
    padding: "40px 30px 60px 30px",
  },
  headerStrip: {
    backgroundColor: "#3f51b5",
    height: 55,
    width: "100%",
    position: "absolute",
    top: 0,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 40,
    marginTop: 20,
  },
  headerLeft: {
    width: "60%",
  },
  headerRight: {
    width: "30%",
    backgroundColor: "#f5f7ff",
    borderRadius: 4,
    padding: 10,
    borderLeft: "4px solid #3f51b5",
  },
  reportIdBadge: {
    position: "absolute",
    top: 70,
    right: 30,
    backgroundColor: "#3f51b5",
    color: "white",
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 15,
    fontSize: 9,
    fontWeight: "bold",
  },
  title: {
    fontFamily: "Montserrat",
    fontSize: 20,
    fontWeight: 700,
    color: "#3f51b5",
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: "Montserrat",
    fontSize: 14,
    fontWeight: 600,
    color: "#5c6bc0",
    marginBottom: 5,
  },
  reportPeriod: {
    fontSize: 12,
    fontWeight: 600,
    color: "#333333",
    marginBottom: 15,
  },
  detailLabel: {
    fontSize: 9,
    color: "#666666",
    marginBottom: 3,
  },
  detailValue: {
    fontSize: 10,
    fontWeight: 600,
    color: "#3f51b5",
    marginBottom: 7,
  },
  sectionContainer: {
    marginTop: 15,
    marginBottom: 15,
  },
  sectionTitle: {
    fontFamily: "Montserrat",
    fontSize: 13,
    fontWeight: 600,
    color: "#3f51b5",
    marginBottom: 10,
    backgroundColor: "#f5f7ff",
    padding: "6px 10px",
    borderRadius: 3,
  },
  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 15,
  },
  infoItem: {
    width: "33%",
    marginBottom: 12,
    paddingRight: 10,
  },
  infoLabel: {
    fontSize: 9,
    color: "#666666",
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 11,
    fontWeight: 600,
    color: "#333333",
  },
  infoHighlight: {
    fontSize: 12,
    fontWeight: 600,
    color: "#3f51b5",
  },
  totalEarningsContainer: {
    backgroundColor: "#e8eaf6",
    padding: 12,
    borderRadius: 4,
    marginBottom: 20,
    marginTop: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderLeft: "4px solid #3f51b5",
  },
  totalEarningsLabel: {
    fontSize: 12,
    fontWeight: 600,
    color: "#3f51b5",
  },
  totalEarningsValue: {
    fontSize: 16,
    fontWeight: 700,
    color: "#3f51b5",
  },
  tableContainer: {
    marginTop: 10,
    marginBottom: 20,
  },
  table: {
    display: "table",
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 4,
    overflow: "hidden",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    borderBottomStyle: "solid",
    minHeight: 32,
    alignItems: "center",
  },
  tableRowEven: {
    backgroundColor: "#f9faff",
  },
  tableRowOdd: {
    backgroundColor: "#ffffff",
  },
  tableColHeader: {
    backgroundColor: "#3f51b5",
    padding: 8,
    fontFamily: "Montserrat",
    fontWeight: 600,
    fontSize: 9,
    color: "#ffffff",
    textTransform: "uppercase",
    textAlign: "center",
  },
  tableCol: {
    padding: 6,
    fontSize: 9,
    textAlign: "center",
    justifyContent: "center",
  },
  statusText: {
    borderRadius: 12,
    paddingVertical: 3,
    paddingHorizontal: 8,
    fontSize: 8,
    fontWeight: 600,
    textAlign: "center",
    display: "inline-block",
  },
  statusApproved: {
    color: "#2e7d32",
    backgroundColor: "#e8f5e9",
  },
  statusPending: {
    color: "#f57c00",
    backgroundColor: "#fff3e0",
  },
  statusRejected: {
    color: "#d32f2f",
    backgroundColor: "#ffebee",
  },
  signatureSection: {
    marginTop: 40,
    borderTop: "1px solid #e0e0e0",
    paddingTop: 20,
  },
  signatureRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  signatureBox: {
    width: "30%",
    borderTopWidth: 1,
    borderTopStyle: "solid",
    borderTopColor: "#3f51b5",
    paddingTop: 8,
    marginTop: 20,
  },
  signatureText: {
    fontSize: 9,
    textAlign: "center",
    color: "#666666",
  },
  signatureTitle: {
    fontSize: 10,
    fontWeight: 600,
    textAlign: "center",
    marginTop: 5,
    color: "#333333",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: "10px 30px",
    fontSize: 8,
    color: "#ffffff",
    textAlign: "center",
    backgroundColor: "#3f51b5",
  },
  pageNumber: {
    position: "absolute",
    bottom: 30,
    right: 30,
    fontSize: 9,
    color: "#666666",
  },
})

// Helper functions
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

const formatTime = (dateString) => {
  return new Date(dateString).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })
}

const getMonthName = (month) => {
  return new Date(2000, month - 1, 1).toLocaleString("en-IN", { month: "long" })
}

// Get status style based on entry status
const getStatusStyle = (status) => {
  switch (status.toLowerCase()) {
    case "approved":
      return styles.statusApproved
    case "pending":
      return styles.statusPending
    case "rejected":
      return styles.statusRejected
    default:
      return {}
  }
}

// PDF Document Component
const ReportPDF = ({ reportData }) => {
  // Generate a report ID for reference
  const reportId = `REP-${reportData.year}${reportData.month.toString().padStart(2, "0")}-${reportData.student.id.substring(0, 5)}`

  // Get the faculty name from the first entry (if available)
  const facultyName = reportData.entries.length > 0 ? reportData.entries[0].facultyName : "Not specified"
  
  // Calculate total approved and pending hours
  const approvedHours = reportData.entries
    .filter((entry) => entry.status === "approved")
    .reduce((sum, entry) => sum + entry.totalHours, 0)
    .toFixed(2)
    
  const pendingHours = reportData.entries
    .filter((entry) => entry.status === "pending")
    .reduce((sum, entry) => sum + entry.totalHours, 0)
    .toFixed(2)

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Top Color Strip */}
        <View style={styles.headerStrip} />
        
        {/* Report ID Badge */}
        <View style={styles.reportIdBadge}>
          <Text>Report ID: {reportId}</Text>
        </View>
        
        <View style={styles.mainContent}>
          {/* Header Section */}
          <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              <Text style={styles.title}>Government Earn & Learn Scheme</Text>
              <Text style={styles.subtitle}>Monthly Work Report</Text>
              <Text style={styles.reportPeriod}>
                {getMonthName(reportData.month)} {reportData.year}
              </Text>
            </View>
            <View style={styles.headerRight}>
              <Text style={styles.detailLabel}>Student Name</Text>
              <Text style={styles.detailValue}>
                {reportData.student.firstName || ""} {reportData.student.lastName || reportData.student.email}
              </Text>
              
              <Text style={styles.detailLabel}>College</Text>
              <Text style={styles.detailValue}>{reportData.student.collegeName || "Not specified"}</Text>
              
              <Text style={styles.detailLabel}>PRN Number</Text>
              <Text style={styles.detailValue}>{reportData.student.prnNumber || "Not specified"}</Text>
            </View>
          </View>
          
          {/* Student & Work Information Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Student Details</Text>
            <View style={styles.infoGrid}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Student Email</Text>
                <Text style={styles.infoValue}>{reportData.student.email}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Department</Text>
                <Text style={styles.infoValue}>{reportData.student.department || "Not specified"}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Faculty Name</Text>
                <Text style={styles.infoValue}>{facultyName}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Total Days Worked</Text>
                <Text style={styles.infoValue}>{reportData.summary.totalDays}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Total Hours</Text>
                <Text style={styles.infoValue}>{reportData.summary.totalHours.toFixed(2)} hours</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Average Hours/Day</Text>
                <Text style={styles.infoValue}>
                  {reportData.summary.totalDays > 0
                    ? (reportData.summary.totalHours / reportData.summary.totalDays).toFixed(2)
                    : "0"}{" "}
                  hours
                </Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Approved Hours</Text>
                <Text style={styles.infoValue}>{approvedHours} hours</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Pending Hours</Text>
                <Text style={styles.infoValue}>{pendingHours} hours</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Hourly Rate</Text>
                <Text style={styles.infoHighlight}>₹50.00</Text>
              </View>
            </View>
          </View>
          
          {/* Total Earnings */}
          <View style={styles.totalEarningsContainer}>
            <Text style={styles.totalEarningsLabel}>
              Total Earnings for {getMonthName(reportData.month)} {reportData.year}:
            </Text>
            <Text style={styles.totalEarningsValue}>
              ₹{reportData.summary.totalEarnings.toFixed(2)}
            </Text>
          </View>
          
          {/* Work Entries Table */}
          <View style={styles.tableContainer}>
            <Text style={styles.sectionTitle}>Work Entry Details</Text>
            <View style={styles.table}>
              {/* Table Header */}
              <View style={styles.tableRow}>
                <View style={[styles.tableColHeader, { width: "12%" }]}>
                  <Text>Date</Text>
                </View>
                <View style={[styles.tableColHeader, { width: "20%" }]}>
                  <Text>Location</Text>
                </View>
                <View style={[styles.tableColHeader, { width: "14%" }]}>
                  <Text>In Time</Text>
                </View>
                <View style={[styles.tableColHeader, { width: "14%" }]}>
                  <Text>Out Time</Text>
                </View>
                <View style={[styles.tableColHeader, { width: "10%" }]}>
                  <Text>Hours</Text>
                </View>
                <View style={[styles.tableColHeader, { width: "15%" }]}>
                  <Text>Amount</Text>
                </View>
                <View style={[styles.tableColHeader, { width: "15%" }]}>
                  <Text>Status</Text>
                </View>
              </View>

              {/* Table Data Rows */}
              {reportData.entries.map((entry, index) => (
                <View key={index} style={[styles.tableRow, index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd]}>
                  <View style={[styles.tableCol, { width: "12%" }]}>
                    <Text>{formatDate(entry.inTime)}</Text>
                  </View>
                  <View style={[styles.tableCol, { width: "20%" }]}>
                    <Text>{entry.workLocation}</Text>
                  </View>
                  <View style={[styles.tableCol, { width: "14%" }]}>
                    <Text>{formatTime(entry.inTime)}</Text>
                  </View>
                  <View style={[styles.tableCol, { width: "14%" }]}>
                    <Text>{formatTime(entry.outTime)}</Text>
                  </View>
                  <View style={[styles.tableCol, { width: "10%" }]}>
                    <Text>{entry.totalHours.toFixed(2)}</Text>
                  </View>
                  <View style={[styles.tableCol, { width: "15%" }]}>
                    <Text>₹{entry.amountEarned.toFixed(2)}</Text>
                  </View>
                  <View style={[styles.tableCol, { width: "15%" }]}>
                    <Text style={[styles.statusText, getStatusStyle(entry.status)]}>
                      {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
          
          {/* Signature Section */}
          <View style={styles.signatureSection}>
            <View style={styles.signatureRow}>
              <View style={styles.signatureBox}>
                <Text style={styles.signatureTitle}>Student</Text>
                <Text style={styles.signatureText}>
                  {reportData.student.firstName || ""} {reportData.student.lastName || reportData.student.email}
                </Text>
              </View>
              <View style={styles.signatureBox}>
                <Text style={styles.signatureTitle}>Faculty</Text>
                <Text style={styles.signatureText}>{facultyName}</Text>
              </View>
              <View style={styles.signatureBox}>
                <Text style={styles.signatureTitle}>Admin</Text>
                <Text style={styles.signatureText}>Authorized Signature</Text>
              </View>
            </View>
          </View>
          
          {/* Page Number */}
          <Text
            style={styles.pageNumber}
            render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
            fixed
          />
        </View>
        
        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text>
            This is an official document of the Government Earn & Learn Scheme. Generated on {formatDate(new Date())}
          </Text>
        </View>
      </Page>
    </Document>
  )
}

export default ReportPDF