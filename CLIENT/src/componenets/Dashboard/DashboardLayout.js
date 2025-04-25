"use client"

import { useState, useEffect } from "react"
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  useTheme,
  useMediaQuery,
  Badge,
  Container,
} from "@mui/material"
import {
  Menu as MenuIcon,
  Dashboard,
  Work,
  Person,
  Assessment,
  Settings,
  Notifications,
  Logout,
  AdminPanelSettings,
  School,
  AccountCircle,
} from "@mui/icons-material"
import { useNavigate } from "react-router-dom"
import axios from "axios"

const drawerWidth = 240

const DashboardLayout = ({ children, title, currentTab, onLogout }) => {
  const theme = useTheme()
  const navigate = useNavigate()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const [mobileOpen, setMobileOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token")
      if (!token) {
        navigate("/")
        return
      }

      try {
        const response = await axios.get("https://earn-and-learn-backend.onrender.com/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        })
        setUserData(response.data)
      } catch (error) {
        console.error("Error fetching user data:", error)
        // If token is invalid, redirect to login
        if (error.response?.status === 401) {
          localStorage.removeItem("token")
          navigate("/")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [navigate])

  const isAdmin = userData?.role === "admin"

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    // Clear token from localStorage
    localStorage.removeItem("token")

    // Call the logout function from props if provided
    if (onLogout) {
      onLogout()
    }

    // Redirect to login page
    navigate("/")

    handleMenuClose()
  }

  const studentMenuItems = [
    { text: "Dashboard", icon: <Dashboard />, path: "/student-dashboard" },
    { text: "Work Entries", icon: <Work />, path: "/student-dashboard?tab=entries" },
    { text: "My Profile", icon: <Person />, path: "/student-dashboard?tab=profile" },
  ]

  const adminMenuItems = [
    { text: "Dashboard", icon: <Dashboard />, path: "/admin-dashboard" },
    { text: "Student Records", icon: <School />, path: "/admin-dashboard?tab=records" },
    { text: "Profile Approvals", icon: <Person />, path: "/admin-dashboard?tab=profiles" },
    { text: "Reports", icon: <Assessment />, path: "/admin-dashboard?tab=reports" },
    { text: "Admin Management", icon: <AdminPanelSettings />, path: "/admin-dashboard?tab=admins" },
  ]

  const menuItems = isAdmin ? adminMenuItems : studentMenuItems

  const drawer = (
    <div>
      <Toolbar
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: 1,
          bgcolor: theme.palette.primary.main,
          color: "white",
        }}
      >
        <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 700 }}>
          Earn & Learn
        </Typography>
      </Toolbar>
      <Divider />
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <Avatar
            src={userData?.profileImage ? `http://localhost:5000${userData.profileImage}` : ""}
            alt={userData?.email || ""}
            sx={{ width: 40, height: 40, mr: 2 }}
          />
          <Box>
            <Typography variant="subtitle2" noWrap sx={{ fontWeight: 600 }}>
              {userData?.firstName ? `${userData.firstName} ${userData.lastName}` : userData?.email || "Loading..."}
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap>
              {isAdmin ? "Administrator" : "Student"}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={currentTab === item.text.toLowerCase()}
              onClick={() => {
                navigate(item.path)
                if (isMobile) setMobileOpen(false)
              }}
              sx={{
                "&.Mui-selected": {
                  bgcolor: `${theme.palette.primary.main}15`,
                  borderRight: `3px solid ${theme.palette.primary.main}`,
                  "&:hover": {
                    bgcolor: `${theme.palette.primary.main}25`,
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: currentTab === item.text.toLowerCase() ? theme.palette.primary.main : "inherit",
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontWeight: currentTab === item.text.toLowerCase() ? 600 : 400,
                  color: currentTab === item.text.toLowerCase() ? theme.palette.primary.main : "inherit",
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon>
              <Logout />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  )

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Typography>Loading...</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f5f5f5" }}>
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          boxShadow: 1,
          bgcolor: "white",
          color: "text.primary",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
            {title}
          </Typography>

          <Box sx={{ display: "flex" }}>
            <Tooltip title="Notifications">
              <IconButton color="inherit">
                <Badge badgeContent={3} color="error">
                  <Notifications />
                </Badge>
              </IconButton>
            </Tooltip>
            <Tooltip title="Settings">
              <IconButton color="inherit">
                <Settings />
              </IconButton>
            </Tooltip>
            <Tooltip title="Account">
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>
      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }} aria-label="dashboard navigation">
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          minHeight: "100vh",
          bgcolor: "#f5f5f5",
        }}
      >
        <Toolbar />
        <Container maxWidth="xl">{children}</Container>
      </Box>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => navigate(isAdmin ? "/admin-dashboard?tab=profile" : "/student-dashboard?tab=profile")}>
          My Profile
        </MenuItem>
        <MenuItem onClick={() => navigate("/settings")}>Settings</MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </Box>
  )
}

export default DashboardLayout
