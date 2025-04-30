"use client";

import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Grid,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import axios from "axios";

const WorkEntryForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    workLocation: "",
    inTime: "",
    outTime: "",
    facultyName: "",
    studentName: "",
    className: "",
    division: "",
    collegeName: "",
    prnNumber: "",
    aadharNumber: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [facultyOptions, setFacultyOptions] = useState([
    "Dr. Sharmila Wagh",
    "Faculty 2",
    "Faculty 3",
  ]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(
        "https://earn-and-learn-backend.onrender.com/api/work-entries",
        formData,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (onSuccess) {
        onSuccess(res.data);
      }

      // Reset form
      setFormData({
        workLocation: "",
        inTime: "",
        outTime: "",
        facultyName: "",
        studentName: "",
        className: "",
        division: "",
        collegeName: "",
        prnNumber: "",
        aadharNumber: "",
      });
    } catch (err) {
      setError(err.response?.data?.error || "Failed to submit work entry");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Add New Work Entry
      </Typography>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Work And Location"
              name="workLocation"
              value={formData.workLocation}
              onChange={handleChange}
              required
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required margin="normal">
              <InputLabel id="faculty-name-label">Faculty Name</InputLabel>
              <Select
                labelId="faculty-name-label"
                id="facultyName"
                name="facultyName"
                value={formData.facultyName}
                label="Faculty Name"
                onChange={handleChange}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 200,
                    },
                  },
                }}
              >
                {facultyOptions.map((faculty) => (
                  <MenuItem key={faculty} value={faculty}>
                    {faculty}
                  </MenuItem>
                ))}
                {facultyOptions.length === 0 && (
                  <MenuItem value="" disabled>
                    Select Faculty
                  </MenuItem>
                )}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Student Name"
              name="studentName"
              value={formData.studentName}
              onChange={handleChange}
              required
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Class Name"
              name="className"
              value={formData.className}
              onChange={handleChange}
              required
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Division"
              name="division"
              value={formData.division}
              onChange={handleChange}
              required
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="College Name"
              name="collegeName"
              value={formData.collegeName}
              onChange={handleChange}
              required
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="PRN Number"
              name="prnNumber"
              value={formData.prnNumber}
              onChange={handleChange}
              required
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Aadhar Number"
              name="aadharNumber"
              value={formData.aadharNumber}
              onChange={handleChange}
              required
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="datetime-local"
              label="In Time"
              name="inTime"
              value={formData.inTime}
              onChange={(event) => {
                const selectedDate = new Date(event.target.value);
                const day = selectedDate.getDay();
                if (day === 0) {
                  alert("Please select a weekday (Monday to Saturday).");
                } else {
                  handleChange(event);
                }
              }}
              required
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="datetime-local"
              label="Out Time"
              name="outTime"
              value={formData.outTime}
              onChange={(event) => {
                const selectedDate = new Date(event.target.value);
                const day = selectedDate.getDay();
                if (day === 0) {
                  alert("Please select a weekday (Monday to Saturday).");
                } else {
                  handleChange(event);
                }
              }}
              required
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>

        <Button
          type="submit"
          variant="contained"
          disabled={loading}
          sx={{ mt: 3 }}
        >
          {loading ? "Submitting..." : "Submit Work Entry"}
        </Button>
      </Box>
    </Paper>
  );
};

export default WorkEntryForm;
