"use client"

import { Box, Card, CardContent, Typography, useTheme } from "@mui/material"

const StatisticsCard = ({ title, value, subtitle, icon, color, trend }) => {
  const theme = useTheme()

  return (
    <Card
      sx={{
        height: "100%",
        borderRadius: 2,
        boxShadow: 2,
        position: "relative",
        overflow: "hidden",
        transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: 4,
        },
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "100px",
          height: "100px",
          background: `linear-gradient(135deg, ${color}15 0%, transparent 50%)`,
          borderRadius: "0 0 0 100%",
        }}
      />
      <CardContent sx={{ position: "relative", zIndex: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 40,
              height: 40,
              borderRadius: "50%",
              bgcolor: `${color}15`,
              color: color,
              mr: 2,
            }}
          >
            {icon}
          </Box>
          <Typography variant="subtitle2" sx={{ color: "text.secondary", fontWeight: 500 }}>
            {title}
          </Typography>
        </Box>
        <Typography variant="h4" sx={{ fontWeight: 700, color: color, my: 1 }}>
          {value}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {subtitle}
          </Typography>
          {trend && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                bgcolor: trend.positive ? "success.light" : "error.light",
                color: trend.positive ? "success.dark" : "error.dark",
                px: 1,
                py: 0.5,
                borderRadius: 1,
                fontSize: "0.75rem",
                fontWeight: 500,
              }}
            >
              {trend.positive ? "↑" : "↓"} {trend.value}%
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  )
}

export default StatisticsCard
