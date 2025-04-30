"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  Button,
  useTheme,
} from "@mui/material";
import {
  Add,
  AccessTime,
  CalendarMonth,
  AttachMoney,
  WorkOutline,
  Download,
} from "@mui/icons-material";
import WorkEntryForm from "../componenets/WorkEntryForm";
import ProfileForm from "../componenets/ProfileForm";
import DashboardLayout from "../componenets/Dashboard/DashboardLayout";
import StatisticsCard from "../componenets/Dashboard/StatisticsCard";
import DataTable from "../componenets/Dashboard/DataTable";
import axios from "axios";
import { PDFDownloadLink } from "@react-pdf/renderer";
import StudentReportPDF from "../componenets/StudentReportPDF";

const StudentDashboard = () => {
  const theme = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const tabFromUrl = queryParams.get("tab");

  const [workEntries, setWorkEntries] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [profileData, setProfileData] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEntries: 0,
    totalHours: 0,
    totalEarnings: 0,
    approvedEntries: 0,
    pendingEntries: 0,
    rejectedEntries: 0,
  });

  useEffect(() => {
    if (tabFromUrl === "profile") setTabValue(1);
    else setTabValue(0);
  }, [tabFromUrl]);

  const fetchWorkEntries = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "https://earn-and-learn-backend.onrender.com/api/work-entries/my-entries",
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setWorkEntries(res.data);

      const totalHours = res.data.reduce(
        (sum, entry) => sum + entry.totalHours,
        0
      );
      const totalEarnings = res.data.reduce(
        (sum, entry) => sum + entry.amountEarned,
        0
      );
      const approvedEntries = res.data.filter(
        (entry) => entry.status === "approved"
      ).length;
      const pendingEntries = res.data.filter(
        (entry) => entry.status === "pending"
      ).length;
      const rejectedEntries = res.data.filter(
        (entry) => entry.status === "rejected"
      ).length;

      setStats({
        totalEntries: res.data.length,
        totalHours,
        totalEarnings,
        approvedEntries,
        pendingEntries,
        rejectedEntries,
      });
    } catch (err) {
      console.error("Error fetching entries", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async () => {
    try {
      setProfileLoading(true);
      const res = await axios.get(
        "https://earn-and-learn-backend.onrender.com/api/profile/me",
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setProfileData(res.data);
    } catch (err) {
      console.error("Error fetching profile", err);
    } finally {
      setProfileLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkEntries();
    fetchProfile();
  }, []);

  const handleNewEntry = () => {
    fetchWorkEntries();
    setShowForm(false);
  };

  const handleProfileUpdate = (updatedProfile) => {
    setProfileData(updatedProfile);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    const tabNames = ["entries", "profile"];
    navigate(`/student-dashboard?tab=${tabNames[newValue]}`);
  };

  const isProfileIncomplete =
    profileData && profileData.profileStatus === "incomplete";
  const isProfileRejected =
    profileData && profileData.profileStatus === "rejected";
  const canAddWorkEntries =
    profileData && profileData.profileStatus === "approved";

  // ✅ Updated to use "inTime" for the Date column
  const tableColumns = [
    { id: "inTime", label: "Date", type: "date" },
    { id: "workLocation", label: "Work Location" },
    { id: "inTime", label: "In Time", type: "time" },
    { id: "outTime", label: "Out Time", type: "time" },
    { id: "totalHours", label: "Hours", type: "number", precision: 2 },
    { id: "amountEarned", label: "Amount", type: "currency" },
    { id: "facultyName", label: "Faculty" },
    { id: "status", label: "Status", type: "status" },
  ];

  return (
    <DashboardLayout
      title="Student Dashboard"
      currentTab={tabFromUrl || "entries"}
      onLogout={logout}
    >
      {(isProfileIncomplete || isProfileRejected) && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          {isProfileIncomplete
            ? "Please complete your profile before adding work entries."
            : "Your profile was rejected. Please update and resubmit it."}
        </Alert>
      )}

      <Box sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="dashboard tabs"
        >
          <Tab label="Work Entries" />
          <Tab label="My Profile" />
        </Tabs>
      </Box>

      {tabValue === 0 && (
        <>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <StatisticsCard
                title="Total Entries"
                value={stats.totalEntries}
                subtitle="All work submissions"
                icon={<WorkOutline />}
                color={theme.palette.primary.main}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatisticsCard
                title="Total Hours"
                value={stats.totalHours.toFixed(1)}
                subtitle="Hours worked"
                icon={<AccessTime />}
                color={theme.palette.secondary.main}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatisticsCard
                title="Total Earnings"
                value={`₹${stats.totalEarnings.toFixed(0)}`}
                subtitle="At ₹60 per hour"
                icon={<AttachMoney />}
                color={theme.palette.success.main}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatisticsCard
                title="Approval Rate"
                value={`${
                  stats.totalEntries > 0
                    ? (
                        (stats.approvedEntries / stats.totalEntries) *
                        100
                      ).toFixed(0)
                    : 0
                }%`}
                subtitle={`${stats.approvedEntries} approved, ${stats.pendingEntries} pending`}
                icon={<CalendarMonth />}
                color={theme.palette.info.main}
              />
            </Grid>
          </Grid>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              Work Entries
            </Typography>
            {canAddWorkEntries && (
              <div style={{ display: "flex", gap: "10px" }}>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => setShowForm(!showForm)}
                  sx={{ borderRadius: 2 }}
                >
                  {showForm ? "Cancel" : "Add New Entry"}
                </Button>
                <PDFDownloadLink
                  document={<StudentReportPDF workEntries={workEntries} />}
                  fileName={`work-report-${
                    user?.email || "student"
                  }-${new Date().toISOString().slice(0, 10)}.pdf`}
                >
                  {({ loading }) => (
                    <Button
                      variant="contained"
                      startIcon={<Download />}
                      disabled={loading}
                      sx={{ borderRadius: 2 }}
                    >
                      {loading ? "Generating PDF..." : "Download Report"}
                    </Button>
                  )}
                </PDFDownloadLink>
              </div>
            )}
          </Box>

          {!canAddWorkEntries && (
            <Alert severity="info" sx={{ mb: 3 }}>
              You need an approved profile before you can add work entries.
            </Alert>
          )}

          {showForm && <WorkEntryForm onSuccess={handleNewEntry} />}

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
              <CircularProgress />
            </Box>
          ) : workEntries.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: "center", borderRadius: 2 }}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                No work entries found
              </Typography>
              <Typography color="text.secondary">
                {canAddWorkEntries
                  ? "Add your first work entry to get started."
                  : "Complete your profile to start adding work entries."}
              </Typography>
            </Paper>
          ) : (
            <DataTable
              columns={tableColumns}
              rows={workEntries}
              showActions={false}
              initialOrderBy="inTime"
              initialOrder="desc"
            />
          )}
        </>
      )}

      {tabValue === 1 && (
        <>
          {profileLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <ProfileForm
              user={profileData}
              onProfileUpdate={handleProfileUpdate}
            />
          )}
        </>
      )}
    </DashboardLayout>
  );
};

export default StudentDashboard;
