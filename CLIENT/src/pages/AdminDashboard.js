"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tabs,
  Tab,
  CircularProgress,
  Chip,
  Avatar,
} from "@mui/material";
import {
  ExpandMore,
  Dashboard,
  Person,
  List,
  Settings,
  Notifications,
  ExitToApp,
  AddCircle,
  School,
  Assignment,
  SupervisorAccount,
} from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import MonthlyReportView from "../componenets/MonthlyReportView";
import StudentProfileView from "../componenets/StudentProfileView";
import styles from "./AdminDashboard.module.css";

const AdminDashboard = () => {
  const [students, setStudents] = useState([]);
  const [pendingProfiles, setPendingProfiles] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profilesLoading, setProfilesLoading] = useState(true);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [adminDialogOpen, setAdminDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [newAdminData, setNewAdminData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [adminError, setAdminError] = useState("");
  const { logout } = useAuth();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const fetchStudentsWithEntries = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/auth/students", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudents(res.data);
    } catch (err) {
      console.error("Error fetching students with entries:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingProfiles = async () => {
    try {
      setProfilesLoading(true);
      const res = await axios.get(
        "http://localhost:5000/api/profile/students?status=pending",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPendingProfiles(res.data);
    } catch (err) {
      console.error("Error fetching pending profiles:", err);
    } finally {
      setProfilesLoading(false);
    }
  };

  const fetchAdmins = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/auth/admins", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAdmins(res.data);
    } catch (err) {
      console.error("Error fetching admins:", err);
    }
  };

  useEffect(() => {
    fetchStudentsWithEntries();
    fetchPendingProfiles();
    fetchAdmins();
  }, [token]);

  const handleStatusChange = async (entryId, newStatus) => {
    try {
      const res = await axios.patch(
        `http://localhost:5000/api/work-entries/${entryId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update the entry in the state
      setStudents((prevStudents) => {
        return prevStudents.map((studentData) => {
          const updatedEntries = studentData.workEntries.map((entry) =>
            entry._id === entryId ? res.data : entry
          );
          return {
            ...studentData,
            workEntries: updatedEntries,
          };
        });
      });
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const formatTime = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleTimeString();
  };

  const openReportDialog = (student) => {
    setSelectedStudent(student);
    setReportDialogOpen(true);
  };

  const closeReportDialog = () => {
    setReportDialogOpen(false);
  };

  const openProfileDialog = (student) => {
    setSelectedProfile(student);
    setProfileDialogOpen(true);
  };

  const closeProfileDialog = () => {
    setProfileDialogOpen(false);
  };

  const openAdminDialog = () => {
    setAdminDialogOpen(true);
    setNewAdminData({
      email: "",
      password: "",
      confirmPassword: "",
    });
    setAdminError("");
  };

  const closeAdminDialog = () => {
    setAdminDialogOpen(false);
  };

  const handleNewAdminChange = (e) => {
    setNewAdminData({
      ...newAdminData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateAdmin = async () => {
    // Validate form
    if (newAdminData.password !== newAdminData.confirmPassword) {
      setAdminError("Passwords do not match");
      return;
    }

    if (newAdminData.password.length < 6) {
      setAdminError("Password must be at least 6 characters long");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/auth/create-admin",
        {
          email: newAdminData.email,
          password: newAdminData.password,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Refresh admin list
      fetchAdmins();
      closeAdminDialog();
    } catch (err) {
      setAdminError(
        err.response?.data?.error || "Failed to create admin account"
      );
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleProfileUpdate = (updatedProfile) => {
    // Update the profile in the pending profiles list
    setPendingProfiles((prevProfiles) =>
      prevProfiles.filter((profile) => profile._id !== updatedProfile._id)
    );

    // Refresh the profiles list
    fetchPendingProfiles();
  };

  // Get first letter of email for avatar
  const getInitial = (email) => {
    return email ? email.charAt(0).toUpperCase() : "A";
  };

  return (
    <div className={styles.dashboardContainer}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <div className={styles.logo}>
            <School />
            <span>Work Study</span>
          </div>
        </div>

        <div
          className={
            styles.navItem + " " + (tabValue === 0 ? styles.activeNavItem : "")
          }
        >
          <Dashboard className={styles.navIcon} />
          <span>Dashboard</span>
        </div>

        <div
          className={
            styles.navItem + " " + (tabValue === 0 ? styles.activeNavItem : "")
          }
        >
          <Assignment className={styles.navIcon} />
          <span>Student Records</span>
        </div>

        <div
          className={
            styles.navItem + " " + (tabValue === 1 ? styles.activeNavItem : "")
          }
        >
          <Person className={styles.navIcon} />
          <span>Profile Approvals</span>
        </div>

        <div
          className={
            styles.navItem + " " + (tabValue === 2 ? styles.activeNavItem : "")
          }
        >
          <SupervisorAccount className={styles.navIcon} />
          <span>Admin Management</span>
        </div>

        <div className={styles.navItem} onClick={handleLogout}>
          <ExitToApp className={styles.navIcon} />
          <span>Logout</span>
        </div>
      </aside>

      {/* Main Content */}
      <main className={styles.mainContent}>
        <div className={styles.header}>
          <Typography variant="h4" className={styles.pageTitle}>
            Admin Dashboard
          </Typography>
          <div className={styles.avatar}>A</div>
        </div>

        <div className={styles.tabsContainer}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            className={styles.customTabs}
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab label="Student Records" className={styles.customTab} />
            <Tab label="Profile Approvals" className={styles.customTab} />
            <Tab label="Admin Management" className={styles.customTab} />
          </Tabs>
        </div>

        {tabValue === 0 && (
          <div className={styles.contentCard}>
            <div className={styles.contentHeader}>
              <Typography variant="h5" className={styles.sectionTitle}>
                Student Work Records
              </Typography>
            </div>

            {loading ? (
              <div className={styles.loadingContainer}>
                <CircularProgress />
              </div>
            ) : students.length === 0 ? (
              <Typography className={styles.emptyContent}>
                No students found with work entries.
              </Typography>
            ) : (
              students.map((studentData) => (
                <Accordion
                  key={studentData.student._id}
                  className={styles.customAccordion}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMore />}
                    className={styles.accordionHeader}
                  >
                    <div className={styles.studentInfo}>
                      <Typography
                        variant="subtitle1"
                        className={styles.studentName}
                      >
                        {studentData.student.firstName &&
                        studentData.student.lastName
                          ? `${studentData.student.firstName} ${studentData.student.lastName}`
                          : studentData.student.email}
                      </Typography>
                      <div className={styles.studentActions}>
                        <div
                          className={`${styles.statusChip} ${
                            studentData.student.profileStatus === "approved"
                              ? styles.statusChipApproved
                              : studentData.student.profileStatus === "pending"
                              ? styles.statusChipPending
                              : styles.statusChipDefault
                          }`}
                        >
                          {studentData.student.profileStatus.toUpperCase()}
                        </div>
                        <Typography variant="body2">
                          {studentData.workEntries.length} Entries
                        </Typography>
                        <Button
                          className={`${styles.actionButton} ${styles.outlineButton}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            openProfileDialog(studentData.student);
                          }}
                        >
                          View Profile
                        </Button>
                        <Button
                          className={`${styles.actionButton} ${styles.primaryButton}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            openReportDialog(studentData.student);
                          }}
                        >
                          Generate Report
                        </Button>
                      </div>
                    </div>
                  </AccordionSummary>
                  <AccordionDetails>
                    <TableContainer className={styles.tableContainer}>
                      <Table size="small">
                        <TableHead className={styles.tableHeader}>
                          <TableRow>
                            <TableCell className={styles.tableHeaderCell}>
                              Date
                            </TableCell>
                            <TableCell className={styles.tableHeaderCell}>
                              Work Location
                            </TableCell>
                            <TableCell className={styles.tableHeaderCell}>
                              In Time
                            </TableCell>
                            <TableCell className={styles.tableHeaderCell}>
                              Out Time
                            </TableCell>
                            <TableCell className={styles.tableHeaderCell}>
                              Total Hours
                            </TableCell>
                            <TableCell className={styles.tableHeaderCell}>
                              Amount
                            </TableCell>
                            <TableCell className={styles.tableHeaderCell}>
                              Faculty
                            </TableCell>
                            <TableCell className={styles.tableHeaderCell}>
                              Status
                            </TableCell>
                            <TableCell className={styles.tableHeaderCell}>
                              Action
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {studentData.workEntries.length > 0 ? (
                            studentData.workEntries.map((entry) => (
                              <TableRow key={entry._id}>
                                <TableCell className={styles.tableCell}>
                                  {formatDate(entry.inTime)}
                                </TableCell>
                                <TableCell className={styles.tableCell}>
                                  {entry.workLocation}
                                </TableCell>
                                <TableCell className={styles.tableCell}>
                                  {formatTime(entry.inTime)}
                                </TableCell>
                                <TableCell className={styles.tableCell}>
                                  {formatTime(entry.outTime)}
                                </TableCell>
                                <TableCell className={styles.tableCell}>
                                  {entry.totalHours?.toFixed(2) || 0}
                                </TableCell>
                                <TableCell className={styles.tableCell}>
                                  ₹{entry.amountEarned}
                                </TableCell>
                                <TableCell className={styles.tableCell}>
                                  {entry.facultyName}
                                </TableCell>
                                <TableCell className={styles.tableCell}>
                                  {entry.status}
                                </TableCell>
                                <TableCell className={styles.tableCell}>
                                  <Select
                                    className={styles.statusSelect}
                                    size="small"
                                    value={entry.status}
                                    onChange={(e) =>
                                      handleStatusChange(
                                        entry._id,
                                        e.target.value
                                      )
                                    }
                                  >
                                    <MenuItem value="pending">Pending</MenuItem>
                                    <MenuItem value="approved">
                                      Approved
                                    </MenuItem>
                                    <MenuItem value="rejected">
                                      Rejected
                                    </MenuItem>
                                  </Select>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell
                                colSpan={9}
                                align="center"
                                className={styles.tableCell}
                              >
                                No work entries found for this student.
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </AccordionDetails>
                </Accordion>
              ))
            )}
          </div>
        )}

        {tabValue === 1 && (
          <div className={styles.contentCard}>
            <div className={styles.contentHeader}>
              <Typography variant="h5" className={styles.sectionTitle}>
                Pending Profile Approvals
              </Typography>
            </div>

            {profilesLoading ? (
              <div className={styles.loadingContainer}>
                <CircularProgress />
              </div>
            ) : pendingProfiles.length === 0 ? (
              <Typography className={styles.emptyContent}>
                No pending profiles to approve.
              </Typography>
            ) : (
              <TableContainer className={styles.tableContainer}>
                <Table>
                  <TableHead className={styles.tableHeader}>
                    <TableRow>
                      <TableCell className={styles.tableHeaderCell}>
                        Name
                      </TableCell>
                      <TableCell className={styles.tableHeaderCell}>
                        Email
                      </TableCell>
                      <TableCell className={styles.tableHeaderCell}>
                        College
                      </TableCell>
                      <TableCell className={styles.tableHeaderCell}>
                        Submitted On
                      </TableCell>
                      <TableCell className={styles.tableHeaderCell}>
                        Action
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pendingProfiles.map((profile) => (
                      <TableRow key={profile._id}>
                        <TableCell className={styles.tableCell}>
                          {profile.firstName && profile.lastName
                            ? `${profile.firstName} ${profile.lastName}`
                            : "Not provided"}
                        </TableCell>
                        <TableCell className={styles.tableCell}>
                          {profile.email}
                        </TableCell>
                        <TableCell className={styles.tableCell}>
                          {profile.collegeName || "Not provided"}
                        </TableCell>
                        <TableCell className={styles.tableCell}>
                          {formatDate(profile.profileSubmittedAt)}
                        </TableCell>
                        <TableCell className={styles.tableCell}>
                          <Button
                            className={`${styles.actionButton} ${styles.primaryButton}`}
                            onClick={() => openProfileDialog(profile)}
                          >
                            Review Profile
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </div>
        )}

        {tabValue === 2 && (
          <div className={styles.contentCard}>
            <div className={styles.contentHeader}>
              <Typography variant="h5" className={styles.sectionTitle}>
                Admin Management
              </Typography>
              <Button
                className={`${styles.actionButton} ${styles.primaryButton}`}
                startIcon={<AddCircle />}
                onClick={openAdminDialog}
              >
                Create New Admin
              </Button>
            </div>

            <TableContainer className={styles.tableContainer}>
              <Table>
                <TableHead className={styles.tableHeader}>
                  <TableRow>
                    <TableCell className={styles.tableHeaderCell}>
                      Email
                    </TableCell>
                    <TableCell className={styles.tableHeaderCell}>
                      Created At
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {admins.map((admin) => (
                    <TableRow key={admin._id}>
                      <TableCell className={styles.tableCell}>
                        {admin.email}
                      </TableCell>
                      <TableCell className={styles.tableCell}>
                        {formatDate(admin.createdAt)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        )}

        {/* Report Dialog */}
        <Dialog
          open={reportDialogOpen}
          onClose={closeReportDialog}
          maxWidth="lg"
          fullWidth
          className={styles.dialog}
        >
          <DialogTitle className={styles.dialogTitle}>
            Monthly Reports for {selectedStudent?.email}
            <Button
              onClick={closeReportDialog}
              color="inherit"
              sx={{ position: "absolute", right: 8, top: 8 }}
            >
              Close
            </Button>
          </DialogTitle>
          <DialogContent className={styles.dialogContent}>
            {selectedStudent && (
              <MonthlyReportView
                studentId={selectedStudent._id}
                isAdmin={true}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Profile Dialog */}
        <Dialog
          open={profileDialogOpen}
          onClose={closeProfileDialog}
          maxWidth="lg"
          fullWidth
          className={styles.dialog}
        >
          <DialogTitle className={styles.dialogTitle}>
            Student Profile
            <Button
              onClick={closeProfileDialog}
              color="inherit"
              sx={{ position: "absolute", right: 8, top: 8 }}
            >
              Close
            </Button>
          </DialogTitle>
          <DialogContent className={styles.dialogContent}>
            {selectedProfile && (
              <StudentProfileView
                student={selectedProfile}
                onProfileUpdate={handleProfileUpdate}
                token={token}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Create Admin Dialog */}
        <Dialog
          open={adminDialogOpen}
          onClose={closeAdminDialog}
          className={styles.dialog}
        >
          <DialogTitle className={styles.dialogTitle}>
            Create New Admin Account
          </DialogTitle>
          <DialogContent className={styles.dialogContent}>
            {adminError && (
              <Typography color="error" sx={{ mb: 2 }}>
                {adminError}
              </Typography>
            )}
            <TextField
              autoFocus
              margin="dense"
              name="email"
              label="Email Address"
              type="email"
              fullWidth
              variant="outlined"
              value={newAdminData.email}
              onChange={handleNewAdminChange}
              required
              className={styles.inputField}
            />
            <TextField
              margin="dense"
              name="password"
              label="Password"
              type="password"
              fullWidth
              variant="outlined"
              value={newAdminData.password}
              onChange={handleNewAdminChange}
              required
              className={styles.inputField}
            />
            <TextField
              margin="dense"
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              fullWidth
              variant="outlined"
              value={newAdminData.confirmPassword}
              onChange={handleNewAdminChange}
              required
              className={styles.inputField}
            />
          </DialogContent>
          <DialogActions className={styles.dialogActions}>
            <Button onClick={closeAdminDialog}>Cancel</Button>
            <Button
              onClick={handleCreateAdmin}
              className={`${styles.actionButton} ${styles.primaryButton}`}
            >
              Create Admin
            </Button>
          </DialogActions>
        </Dialog>
      </main>
    </div>
  );
};

export default AdminDashboard;
