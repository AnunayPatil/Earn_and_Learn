import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
// Register custom fonts
Font.register({
  family: "Montserrat",
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/montserrat/v15/JTUSjIg1_i6t8kCHKm459Wlhzg.ttf",
      fontWeight: 400,
    },
    {
      src: "https://fonts.gstatic.com/s/montserrat/v15/JTURjIg1_i6t8kCHKm45_bZF3gnD-w.ttf",
      fontWeight: 600,
    },
    {
      src: "https://fonts.gstatic.com/s/montserrat/v15/JTURjIg1_i6t8kCHKm45_dJE3gnD-w.ttf",
      fontWeight: 700,
    },
  ],
});
Font.register({
  family: "Open Sans",
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/opensans/v18/mem8YaGs126MiZpBA-UFVZ0e.ttf",
      fontWeight: 400,
    },
    {
      src: "https://fonts.gstatic.com/s/opensans/v18/mem5YaGs126MiZpBA-UNirkOUuhs.ttf",
      fontWeight: 600,
    },
  ],
});
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
    backgroundColor: "#007bff", // A more student-centric blue
    height: 55,
    width: "100%",
    position: "absolute",
    top: 0,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30, // Reduced margin
    marginTop: 20,
  },
  headerLeft: {
    width: "60%",
  },
  headerRight: {
    width: "35%", // Adjusted width
    backgroundColor: "#e3f2fd", // Light blue background
    borderRadius: 4,
    padding: 10,
    borderLeft: "4px solid #007bff",
  },
  title: {
    fontFamily: "Montserrat",
    fontSize: 20,
    fontWeight: 700,
    color: "#007bff",
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: "Montserrat",
    fontSize: 14,
    fontWeight: 600,
    color: "#64b5f6", // Lighter blue
    marginBottom: 8, // Increased margin
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
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 10,
    fontWeight: 600,
    color: "#007bff",
    marginBottom: 5, // Reduced margin
  },
  sectionContainer: {
    marginTop: 15,
    marginBottom: 15,
  },
  sectionTitle: {
    fontFamily: "Montserrat",
    fontSize: 13,
    fontWeight: 600,
    color: "#007bff",
    marginBottom: 10,
    backgroundColor: "#e3f2fd",
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
    color: "#007bff",
  },
  totalEarningsContainer: {
    backgroundColor: "#bbdefb", // Light blue-gray
    padding: 12,
    borderRadius: 4,
    marginBottom: 20,
    marginTop: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderLeft: "4px solid #007bff",
  },
  totalEarningsLabel: {
    fontSize: 12,
    fontWeight: 600,
    color: "#007bff",
  },
  totalEarningsValue: {
    fontSize: 16,
    fontWeight: 700,
    color: "#007bff",
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
    borderColor: "#90caf9", // Light blue border
    borderRadius: 4,
    overflow: "hidden",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#90caf9",
    borderBottomStyle: "solid",
    minHeight: 32,
    alignItems: "center",
  },
  tableRowEven: {
    backgroundColor: "#e3f2fd", // Light blue
  },
  tableRowOdd: {
    backgroundColor: "#ffffff",
  },
  tableColHeader: {
    backgroundColor: "#007bff",
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
  signatureSection: {
    marginTop: 80,
    borderTop: "1px solid #90caf9",
    paddingTop: 20,
    alignItems: "center",
  },

  signatureRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%", // Slight margin from edges
  },

  signatureBox: {
    width: "30%",
    alignItems: "center",
    paddingTop: 10,
    borderTopWidth: 2,
    borderTopStyle: "solid",
    borderTopColor: "#1976d2",
  },

  signatureTitle: {
    fontSize: 11,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 8,
    color: "#333",
  },

  signatureText: {
    fontSize: 10,
    textAlign: "center",
    color: "#666",
    marginTop: 5,
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
    backgroundColor: "#007bff",
  },
  pageNumber: {
    position: "absolute",
    bottom: 30,
    right: 30,
    fontSize: 9,
    color: "#666666",
  },
  signatureColumn: {
    width: "18%", // Adjusted width
    padding: 6,
    fontSize: 9,
    textAlign: "center",
    justifyContent: "center",
    borderLeft: "1px solid #90caf9", // Add a border to separate the columns visually
  },
  signaturePlaceholder: {
    height: 20,
    width: "80%",
    borderBottom: "1px solid #ccc",
    marginHorizontal: "10%",
  },
  facultyNameColumn: {
    width: "15%",
    padding: 6,
    fontSize: 9,
    textAlign: "center",
    justifyContent: "center",
    borderLeft: "1px solid #90caf9", // Add a border to separate the columns visually
  },
});
// Helper functions (same as ReportPDF)
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};
const formatTime = (dateString) => {
  return new Date(dateString).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};
const getMonthName = (month) => {
  return new Date(2000, month - 1, 1).toLocaleString("en-IN", {
    month: "long",
  });
};
// PDF Document Component for Student
const StudentReportPDF = ({ workEntries }) => {
  // Calculate total hours and earnings, with safety checks
  const totalHours = Array.isArray(workEntries)
    ? workEntries
        .reduce((sum, entry) => sum + (entry?.totalHours || 0), 0)
        .toFixed(2)
    : "0.00";
  const totalEarnings = Array.isArray(workEntries)
    ? workEntries
        .reduce((sum, entry) => sum + (entry?.amountEarned || 0), 0)
        .toFixed(2)
    : "0.00";
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Top Color Strip */}
        <View style={styles.headerStrip}>
          <Text
            style={{
              color: "#ffffff",
              fontSize: 16,
              fontWeight: 600,
              padding: 10,
            }}
          >
            Modern Education Society's Wadia College of Engineering, Pune
          </Text>
        </View>

        <View style={styles.mainContent}>
          {/* Header Section */}
          <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              <Text style={styles.title}>Earn And Learn Worksheet</Text>
              <Text style={styles.subtitle}>Summary of Your Work</Text>
              <Text style={styles.reportPeriod}>
                Generated on {formatDate(new Date())}
              </Text>
              <Text style={styles.reportPeriod}>
                {workEntries[0]?.studentName} - {workEntries[0]?.className}
              </Text>
            </View>
            <View style={styles.headerRight}>
              <Text style={styles.detailLabel}>Total Hours Worked</Text>
              <Text style={styles.detailValue}>{totalHours} hours</Text>
              <Text style={styles.detailLabel}>Total Earnings (Estimated)</Text>
              <Text style={styles.detailValue}>{totalEarnings}</Text>
            </View>
          </View>

          {/* Work Entries Table */}
          <View style={styles.tableContainer}>
            <Text style={styles.sectionTitle}>Your Work Entries</Text>
            <View style={styles.table}>
              {/* Table Header */}
              <View style={styles.tableRow}>
                <View
                  style={[
                    styles.tableColHeader,
                    { width: "18%", height: "100%" },
                  ]}
                >
                  <Text>Date</Text>
                </View>
                <View
                  style={[
                    styles.tableColHeader,
                    { width: "18%", height: "100%" },
                  ]}
                >
                  <Text>Work-Type & Location</Text>
                </View>
                <View
                  style={[
                    styles.tableColHeader,
                    { width: "15%", height: "100%" },
                  ]}
                >
                  <Text>In Time</Text>
                </View>
                <View
                  style={[
                    styles.tableColHeader,
                    { width: "15%", height: "100%" },
                  ]}
                >
                  <Text>Out Time</Text>
                </View>
                <View
                  style={[
                    styles.tableColHeader,
                    { width: "10%", height: "100%" },
                  ]}
                >
                  <Text>Hours</Text>
                </View>
                <View
                  style={[
                    styles.tableColHeader,
                    { width: "18%", height: "100%" },
                  ]}
                >
                  <Text>Faculty</Text>
                </View>
                <View
                  style={[
                    styles.tableColHeader,
                    { width: "18%", height: "100%" },
                  ]}
                >
                  <Text>Signature</Text>
                </View>
              </View>

              {/* Table Data Rows */}
              {Array.isArray(workEntries) &&
                workEntries.map((entry, index) => (
                  <View
                    key={index}
                    style={[
                      styles.tableRow,
                      index % 2 === 0
                        ? styles.tableRowEven
                        : styles.tableRowOdd,
                    ]}
                  >
                    <View style={[styles.tableCol, { width: "18%" }]}>
                      <Text>{formatDate(entry?.inTime)}</Text>
                    </View>
                    <View style={[styles.tableCol, { width: "18%" }]}>
                      <Text>{entry?.workLocation}</Text>
                    </View>
                    <View style={[styles.tableCol, { width: "15%" }]}>
                      <Text>{formatTime(entry?.inTime)}</Text>
                    </View>
                    <View style={[styles.tableCol, { width: "15%" }]}>
                      <Text>{formatTime(entry?.outTime)}</Text>
                    </View>
                    <View style={[styles.tableCol, { width: "10%" }]}>
                      <Text>{entry?.totalHours?.toFixed(2) || "0.00"}</Text>
                    </View>
                    <View style={[styles.facultyNameColumn, { width: "18%" }]}>
                      <Text>{entry?.facultyName}</Text>
                    </View>
                    <View style={[styles.signatureColumn, { width: "18%" }]}>
                      <View style={styles.signaturePlaceholder} />
                    </View>
                  </View>
                ))}
              {!Array.isArray(workEntries) ||
                (workEntries.length === 0 && (
                  <View style={styles.tableRow}>
                    <View
                      style={[
                        styles.tableCol,
                        { width: "100%", textAlign: "center" },
                      ]}
                    >
                      <Text>No work entries available.</Text>
                    </View>
                  </View>
                ))}
            </View>
          </View>

          {/* Signature Section (Aligned in a row with space around) */}
          <View style={styles.signatureSection}>
            <View style={styles.signatureRow}>
              <View style={styles.signatureBox}>
                <Text style={styles.signatureTitle}>Student Signature</Text>
                <Text style={styles.signatureText}>
                  _________________________
                </Text>
              </View>
              <View style={styles.signatureBox}>
                <Text style={styles.signatureTitle}>
                  Dept. Co-ordinator
                </Text>
                <Text style={styles.signatureTitle}>
                  Signature
                </Text>
                <Text style={styles.signatureText}>
                  _________________________
                </Text>
              </View>
              <View style={styles.signatureBox}>
                <Text style={styles.signatureTitle}>SWO Signature</Text>
                <Text style={styles.signatureText}>
                  _________________________
                </Text>
              </View>
            </View>
          </View>

          {/* Page Number */}
          <Text
            style={styles.pageNumber}
            render={({ pageNumber, totalPages }) =>
              `Page ${pageNumber} of ${totalPages}`
            }
            fixed
          />
        </View>
        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text>This is a summary of your work entries.</Text>
        </View>
      </Page>
    </Document>
  );
};
export default StudentReportPDF;
