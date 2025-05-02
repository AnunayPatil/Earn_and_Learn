"use client"

import { useState } from "react"
import {
  Box,
  Button,
  TextField,
  Grid,
  Typography,
  Paper,
  MenuItem,
  Divider,
  Alert,
  CircularProgress,
  Avatar,
} from "@mui/material"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import axios from "axios"
import { format } from "date-fns"

const ProfileForm = ({ user, onProfileUpdate }) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [imageLoading, setImageLoading] = useState(false)
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    phoneNumber: user?.phoneNumber || "",
    dateOfBirth: user?.dateOfBirth ? new Date(user.dateOfBirth) : null,
    gender: user?.gender || "",
    address: {
      street: user?.address?.street || "",
      city: user?.address?.city || "",
      state: user?.address?.state || "",
      postalCode: user?.address?.postalCode || "",
      country: user?.address?.country || "",
    },
    collegeName: user?.collegeName || "",
    department: user?.department || "",
    course: user?.course || "",
    yearOfStudy: user?.yearOfStudy || "",
    rollNumber: user?.rollNumber || "",
    prnNumber: user?.prnNumber || "",
    aadharNumber: user?.aadharNumber || "",
    bankDetails: {
      accountHolderName: user?.bankDetails?.accountHolderName || "",
      accountNumber: user?.bankDetails?.accountNumber || "",
      bankName: user?.bankDetails?.bankName || "",
      ifscCode: user?.bankDetails?.ifscCode || "",
      branch: user?.bankDetails?.branch || "",
    },
  })

  const handleChange = (e) => {
    const { name, value } = e.target

    if (name.includes(".")) {
      const [parent, child] = name.split(".")
      setProfileData({
        ...profileData,
        [parent]: {
          ...profileData[parent],
          [child]: value,
        },
      })
    } else {
      setProfileData({
        ...profileData,
        [name]: value,
      })
    }
  }

  const handleDateChange = (date) => {
    setProfileData({
      ...profileData,
      dateOfBirth: date,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      // Format date for API
      const formattedData = {
        ...profileData,
        dateOfBirth: profileData.dateOfBirth ? format(profileData.dateOfBirth, "yyyy-MM-dd") : null,
      }

      const response = await axios.patch("https://earn-and-learn-backend.onrender.com/api/profile/me", formattedData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })

      setSuccess("Profile updated successfully")
      if (onProfileUpdate) {
        onProfileUpdate(response.data)
      }
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update profile")
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const formData = new FormData()
    formData.append("profileImage", file)

    setImageLoading(true)
    try {
      const response = await axios.post("https://earn-and-learn-backend.onrender.com/api/profile/me/image", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      })

      if (onProfileUpdate) {
        onProfileUpdate({ ...user, profileImage: response.data.profileImage })
      }
      setSuccess("Profile image uploaded successfully")
    } catch (err) {
      setError(err.response?.data?.error || "Failed to upload image")
    } finally {
      setImageLoading(false)
    }
  }

  const handleSubmitProfile = async () => {
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const response = await axios.post(
        "https://earn-and-learn-backend.onrender.com/api/profile/me/submit",
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      )

      setSuccess("Profile submitted for approval")
      if (onProfileUpdate) {
        onProfileUpdate({ ...user, profileStatus: "pending" })
      }
    } catch (err) {
      setError(err.response?.data?.error || "Failed to submit profile")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Typography variant="h5" gutterBottom>
        Student Profile
      </Typography>

      {user?.profileStatus === "pending" && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Your profile is pending approval from the administrator.
        </Alert>
      )}

      {user?.profileStatus === "rejected" && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Your profile was rejected. Reason: {user.profileFeedback || "No reason provided"}
          <br />
          Please update your information and submit again.
        </Alert>
      )}

      {user?.profileStatus === "approved" && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Your profile has been approved.
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

      <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
        <Box sx={{ position: "relative" }}>
          <Avatar
            src={user?.profileImage ? `http://localhost:5000${user.profileImage}` : ""}
            alt={`${profileData.firstName} ${profileData.lastName}`}
            sx={{ width: 120, height: 120, mb: 2 }}
          />
          <input
            accept="image/*"
            style={{ display: "none" }}
            id="profile-image-upload"
            type="file"
            onChange={handleImageUpload}
            disabled={imageLoading}
          />
          <label htmlFor="profile-image-upload">
            <Button
              variant="contained"
              component="span"
              size="small"
              disabled={imageLoading}
              sx={{ position: "absolute", bottom: 0, right: 0 }}
            >
              {imageLoading ? <CircularProgress size={24} /> : "Upload"}
            </Button>
          </label>
        </Box>
      </Box>

      <Box component="form" onSubmit={handleSubmit}>
        <Typography variant="h6" gutterBottom>
          Personal Information
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="First Name"
              name="firstName"
              value={profileData.firstName}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Last Name"
              name="lastName"
              value={profileData.lastName}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Phone Number"
              name="phoneNumber"
              value={profileData.phoneNumber}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Date of Birth"
                value={profileData.dateOfBirth}
                onChange={handleDateChange}
                renderInput={(params) => <TextField {...params} fullWidth required />}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              select
              label="Gender"
              name="gender"
              value={profileData.gender}
              onChange={handleChange}
              required
            >
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="female">Female</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </TextField>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>
          Address
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Street Address"
              name="address.street"
              value={profileData.address.street}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="City"
              name="address.city"
              value={profileData.address.city}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="State/Province"
              name="address.state"
              value={profileData.address.state}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Postal Code"
              name="address.postalCode"
              value={profileData.address.postalCode}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Country"
              name="address.country"
              value={profileData.address.country}
              onChange={handleChange}
              required
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>
          Academic Information
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="College Name"
              name="collegeName"
              value={profileData.collegeName}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Department"
              name="department"
              value={profileData.department}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Course"
              name="course"
              value={profileData.course}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Year of Study"
              name="yearOfStudy"
              type="number"
              value={profileData.yearOfStudy}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Roll Number"
              name="rollNumber"
              value={profileData.rollNumber}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="PRN Number"
              name="prnNumber"
              value={profileData.prnNumber}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Aadhar Number"
              name="aadharNumber"
              value={profileData.aadharNumber}
              onChange={handleChange}
              required
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>
          Bank Details
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Account Holder Name"
              name="bankDetails.accountHolderName"
              value={profileData.bankDetails.accountHolderName}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Account Number"
              name="bankDetails.accountNumber"
              value={profileData.bankDetails.accountNumber}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Bank Name"
              name="bankDetails.bankName"
              value={profileData.bankDetails.bankName}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="IFSC Code"
              name="bankDetails.ifscCode"
              value={profileData.bankDetails.ifscCode}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Branch"
              name="bankDetails.branch"
              value={profileData.bankDetails.branch}
              onChange={handleChange}
              required
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 3, display: "flex", justifyContent: "space-between" }}>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : "Save Profile"}
          </Button>

          {user?.profileStatus !== "pending" && (
            <Button
              variant="contained"
              color="secondary"
              onClick={handleSubmitProfile}
              disabled={loading || user?.profileStatus === "approved"}
            >
              {loading ? <CircularProgress size={24} /> : "Submit for Approval"}
            </Button>
          )}
        </Box>
      </Box>
    </Paper>
  )
}

export default ProfileForm
