"use client"

import { useState, useEffect } from "react"
import { Box, Typography, CircularProgress, Grid, Paper, Button, Chip, useTheme } from "@mui/material"
import axios from "axios"

const StudentProfileView = ({ student, onProfileUpdate, token }) => {
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState(null)
  const theme = useTheme()

  useEffect(() => {
    const fetchStudentProfile = async () => {
      if (!student || !student._id) return

      setLoading(true)
      try {
        const response = await axios.get(`http://localhost:5000/api/profile/students/${student._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setProfile(response.data)
      } catch (error) {
        console.error("Error fetching student profile:", error)
        // If the student is the profile itself, use it directly
        if (student.firstName) {
          setProfile(student)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchStudentProfile()
  }, [student, token])

  const handleApproveProfile = async () => {
    if (!profile || !profile._id) return

    setLoading(true)
    try {
      const response = await axios.patch(
        `http://localhost:5000/api/profile/students/${profile._id}/status`,
        { status: "approved" },
        { headers: { Authorization: `Bearer ${token}` } },
      )

      if (onProfileUpdate) {
        onProfileUpdate(response.data)
      }
    } catch (error) {
      console.error("Error approving profile:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleRejectProfile = async () => {
    if (!profile || !profile._id) return

    setLoading(true)
    try {
      const response = await axios.patch(
        `http://localhost:5000/api/profile/students/${profile._id}/status`,
        {
          status: "rejected",
          feedback: "Please update your information and try again.", // You could add a feedback form
        },
        { headers: { Authorization: `Bearer ${token}` } },
      )

      if (onProfileUpdate) {
        onProfileUpdate(response.data)
      }
    } catch (error) {
      console.error("Error rejecting profile:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
        <CircularProgress />
      </Box>
    )
  }

  // If no profile data is available, use the student data directly
  const displayProfile = profile || student

  if (!displayProfile) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6">No profile information available</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 3, color: theme.palette.primary.main }}>
        Student Profile: {displayProfile.firstName} {displayProfile.lastName}
      </Typography>

      {/* Display profile information */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              Personal Information
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Email
              </Typography>
              <Typography variant="body1">{displayProfile.email}</Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Phone Number
              </Typography>
              <Typography variant="body1">{displayProfile.phoneNumber || "Not provided"}</Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Date of Birth
              </Typography>
              <Typography variant="body1">
                {displayProfile.dateOfBirth
                  ? new Date(displayProfile.dateOfBirth).toLocaleDateString()
                  : "Not provided"}
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Gender
              </Typography>
              <Typography variant="body1">{displayProfile.gender || "Not provided"}</Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              Academic Information
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                College
              </Typography>
              <Typography variant="body1">{displayProfile.collegeName || "Not provided"}</Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Department
              </Typography>
              <Typography variant="body1">{displayProfile.department || "Not provided"}</Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Course
              </Typography>
              <Typography variant="body1">{displayProfile.course || "Not provided"}</Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Year of Study
              </Typography>
              <Typography variant="body1">{displayProfile.yearOfStudy || "Not provided"}</Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              Address Information
            </Typography>
            {displayProfile.address ? (
              <>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Street
                  </Typography>
                  <Typography variant="body1">{displayProfile.address.street || "Not provided"}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    City
                  </Typography>
                  <Typography variant="body1">{displayProfile.address.city || "Not provided"}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    State
                  </Typography>
                  <Typography variant="body1">{displayProfile.address.state || "Not provided"}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Postal Code
                  </Typography>
                  <Typography variant="body1">{displayProfile.address.postalCode || "Not provided"}</Typography>
                </Box>
              </>
            ) : (
              <Typography variant="body1">No address information provided</Typography>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              Bank Details
            </Typography>
            {displayProfile.bankDetails ? (
              <>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Account Holder
                  </Typography>
                  <Typography variant="body1">
                    {displayProfile.bankDetails.accountHolderName || "Not provided"}
                  </Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Bank Name
                  </Typography>
                  <Typography variant="body1">{displayProfile.bankDetails.bankName || "Not provided"}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Account Number
                  </Typography>
                  <Typography variant="body1">
                    {displayProfile.bankDetails.accountNumber
                      ? `XXXX${displayProfile.bankDetails.accountNumber.slice(-4)}`
                      : "Not provided"}
                  </Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    IFSC Code
                  </Typography>
                  <Typography variant="body1">{displayProfile.bankDetails.ifscCode || "Not provided"}</Typography>
                </Box>
              </>
            ) : (
              <Typography variant="body1">No bank details provided</Typography>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Profile Status
              </Typography>
              <Chip
                label={displayProfile.profileStatus ? displayProfile.profileStatus.toUpperCase() : "INCOMPLETE"}
                size="small"
                sx={{
                  bgcolor:
                    displayProfile.profileStatus === "approved"
                      ? `${theme.palette.success.main}15`
                      : displayProfile.profileStatus === "pending"
                        ? `${theme.palette.warning.main}15`
                        : `${theme.palette.error.main}15`,
                  color:
                    displayProfile.profileStatus === "approved"
                      ? theme.palette.success.main
                      : displayProfile.profileStatus === "pending"
                        ? theme.palette.warning.main
                        : theme.palette.error.main,
                  fontWeight: 500,
                }}
              />
            </Box>

            {displayProfile.profileStatus === "pending" && (
              <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
                <Button variant="contained" color="primary" onClick={handleApproveProfile} disabled={loading}>
                  Approve Profile
                </Button>
                <Button variant="outlined" color="error" onClick={handleRejectProfile} disabled={loading}>
                  Reject Profile
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default StudentProfileView
