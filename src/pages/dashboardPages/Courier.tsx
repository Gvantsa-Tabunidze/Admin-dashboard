// pages/dashboardPages/Courier.tsx
import React, { useState, useEffect } from "react";
import {
  Box, Button, Typography, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Select, MenuItem,
  FormControl, InputLabel, Chip, Tabs, Tab, Card, CardContent,
  Grid, Alert, Avatar, List, ListItem, ListItemText, ListItemAvatar,
  Container, Stack, Divider, Badge
} from "@mui/material";
import {
  Edit, AccessTime, Person, DirectionsCar, Phone, Email,
  Today, Schedule, Group, Refresh
} from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import $axios from "../../http/AxiosAuth.Post";
import type { AuthProps, WeekDay, WorkingHours } from "../../interfaces/AuthProps";
import { CourierAvailabilityService } from "../../services/CourierAvailabilityService.ts";

interface CourierCall {
  id: string;
  userId: string;
  courierId: string;
  callTime: string;
  status: "active" | "completed";
  userName: string;
  courierName: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => (
  <div hidden={value !== index}>
    {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
  </div>
);

const Courier = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [otherCouriers, setOtherCouriers] = useState<AuthProps[]>([]);
  const [myCalls, setMyCalls] = useState<CourierCall[]>([]);
  const [allCalls, setAllCalls] = useState<CourierCall[]>([]);
  const [editDialog, setEditDialog] = useState(false);
  const [editingCourier, setEditingCourier] = useState<AuthProps | null>(null);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: "success" | "error" | "warning" | "info"; message: string; } | null>(null);

  useEffect(() => {
    if (user) setEditingCourier({ ...user });
    fetchData();
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    await Promise.all([fetchOtherCouriers(), fetchMyCalls(), fetchAllCalls()]);
    setLoading(false);
  };

  const fetchOtherCouriers = async () => {
    try {
      const response = await $axios.get("/users?role=courier");
      const couriers = response.data || [];
      setOtherCouriers(couriers.filter((courier: AuthProps) => courier.id !== user?.id));
    } catch (error) {
      console.error("Error fetching couriers:", error);
      showAlert("error", "Failed to fetch couriers");
    }
  };

  const fetchMyCalls = async () => {
    try {
      const response = await $axios.get(`/courier-calls?courierId=${user?.id}`);
      setMyCalls(response.data || []);
    } catch (error) {
      console.error("Error fetching my calls:", error);
    }
  };

  const fetchAllCalls = async () => {
    try {
      const response = await $axios.get("/courier-calls");
      setAllCalls(response.data || []);
    } catch (error) {
      console.error("Error fetching all calls:", error);
    }
  };

  const showAlert = (type: "success" | "error" | "warning" | "info", message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 4000);
  };

  const handleUpdateProfile = async () => {
    if (!editingCourier) return;
    try {
      setLoading(true);
      await $axios.put(`/users/${editingCourier.id}`, editingCourier);
      setEditDialog(false);
      showAlert("success", "Profile updated successfully!");
      // Refresh data
      fetchData();
    } catch (error) {
      console.error("Error updating profile:", error);
      showAlert("error", "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const getCallsForCourier = (courierId: string) => {
    return allCalls.filter(call => call.courierId === courierId);
  };

  const getMyCallsToday = () => {
    return CourierAvailabilityService.getTodayCalls(myCalls);
  };

  const getStats = () => {
    const todaysCalls = getMyCallsToday();
    const activeCalls = myCalls.filter(call => call.status === "active");
    const completedCalls = myCalls.filter(call => call.status === "completed");
    const workingToday = CourierAvailabilityService.isCourierWorkingToday(user!);
    
    return { todaysCalls, activeCalls, completedCalls, workingToday };
  };

  const stats = getStats();

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" color="primary" fontWeight="bold">
          Courier Dashboard
        </Typography>
        <Stack direction="row" spacing={2}>
          <IconButton onClick={fetchData} disabled={loading}>
            <Refresh />
          </IconButton>
          <Button onClick={() => { logout(); navigate("/auth"); }} variant="outlined">
            Logout
          </Button>
        </Stack>
      </Stack>

      {alert && <Alert severity={alert.type} sx={{ mb: 2 }}>{alert.message}</Alert>}

      {/* Stats Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ bgcolor: "primary.main" }}><Call /></Avatar>
                <Box>
                  <Typography variant="h4">{myCalls.length}</Typography>
                  <Typography variant="body2" color="textSecondary">Total Calls</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ bgcolor: "success.main" }}><Today /></Avatar>
                <Box>
                  <Typography variant="h4">{stats.todaysCalls.length}</Typography>
                  <Typography variant="body2" color="textSecondary">Today's Calls</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ bgcolor: "info.main" }}><Schedule /></Avatar>
                <Box>
                  <Typography variant="h4">{stats.activeCalls.length}</Typography>
                  <Typography variant="body2" color="textSecondary">Active Calls</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ bgcolor: stats.workingToday ? "success.main" : "grey.500" }}>
                  <AccessTime />
                </Avatar>
                <Box>
                  <Typography variant="h6">{stats.workingToday ? "Working" : "Off"}</Typography>
                  <Typography variant="body2" color="textSecondary">Today Status</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ borderRadius: 2, overflow: "hidden" }}>
        <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)} variant="fullWidth">
          <Tab label="My Profile" icon={<Person />} iconPosition="start" />
          <Tab label={<Badge badgeContent={otherCouriers.length} color="primary">Other Couriers</Badge>} icon={<Group />} iconPosition="start" />
          <Tab label={<Badge badgeContent={myCalls.length} color="success">My Calls</Badge>} icon={<Call />} iconPosition="start" />
          <Tab label={<Badge badgeContent={stats.todaysCalls.length} color="info">Today's Calls</Badge>} icon={<Today />} iconPosition="start" />
        </Tabs>

        {/* Profile Tab */}
        <TabPanel value={tabValue} index={0}>
          <Grid container justifyContent="center">
            <Grid item xs={12} md={8}>
              <Card elevation={2}>
                <CardContent sx={{ p: 4 }}>
                  <Stack direction="row" spacing={3} alignItems="center" mb={4}>
                    <Avatar 
                      src={user?.profile_image} 
                      sx={{ width: 100, height: 100, border: 3, borderColor: "primary.main" }}
                    >
                      {user?.first_name?.[0]}
                    </Avatar>
                    <Box>
                      <Typography variant="h4">{user?.first_name} {user?.last_name}</Typography>
                      <Typography variant="h6" color="textSecondary" gutterBottom>Courier</Typography>
                      <Stack direction="row" spacing={1}>
                        <Chip label={`${myCalls.length} Total Calls`} color="primary" size="small" />
                        <Chip 
                          label={stats.workingToday ? "Working Today" : "Off Today"} 
                          color={stats.workingToday ? "success" : "default"} 
                          size="small" 
                        />
                      </Stack>
                    </Box>
                  </Stack>

                  <Divider sx={{ mb: 3 }} />

                  <Grid container spacing={3}>
                    {[
                      { icon: <Person />, label: "ID", value: user?.id },
                      { icon: <Phone />, label: "Phone", value: user?.phone },
                      { icon: <Email />, label: "Email", value: user?.email },
                      { icon: <DirectionsCar />, label: "Vehicle", value: user?.vehicle },
                      { icon: <Schedule />, label: "Working Day", value: user?.working_days },
                      { 
                        icon: <AccessTime />, 
                        label: "Working Hours", 
                        value: user?.working_hours ? `${user.working_hours.start} - ${user.working_hours.end}` : "Not set" 
                      },
                    ].map((item, index) => (
                      <Grid item xs={12} sm={6} key={index}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          {React.cloneElement(item.icon, { sx: { color: "primary.main" } })}
                          <Box>
                            <Typography variant="body2" color="textSecondary">{item.label}</Typography>
                            <Typography variant="body1" fontWeight="medium">{item.value}</Typography>
                          </Box>
                        </Stack>
                      </Grid>
                    ))}
                  </Grid>

                  <Stack direction="row" spacing={2} mt={3}>
                    <Chip label={`${stats.activeCalls.length} Active`} color="success" />
                    <Chip label={`${stats.completedCalls.length} Completed`} color="default" />
                    <Chip label={`${stats.todaysCalls.length} Today`} color="info" />
                  </Stack>
                </CardContent>
                <CardActions sx={{ p: 3, pt: 0 }}>
                  <Button startIcon={<Edit />} onClick={() => setEditDialog(true)} variant="contained">
                    Edit Profile
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Other Couriers Tab */}
        <TabPanel value={tabValue} index={1}>
          <Typography variant="h5" gutterBottom>Other Couriers Activity</Typography>
          <Grid container spacing={3}>
            {otherCouriers.map(courier => (
              <Grid item xs={12} sm={6} md={4} key={courier.id}>
                <Card elevation={2}>
                  <CardContent>
                    <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                      <Avatar src={courier.profile_image}>{courier.first_name?.[0]}</Avatar>
                      <Box>
                        <Typography variant="h6">{courier.first_name} {courier.last_name}</Typography>
                        <Typography variant="body2" color="textSecondary">{courier.email}</Typography>
                      </Box>
                    </Stack>

                    <Divider sx={{ mb: 2 }} />

                    <Stack spacing={1}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <DirectionsCar fontSize="small" color="primary" />
                        <Typography variant="body2">{courier.vehicle}</Typography>
                      </Stack>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <AccessTime fontSize="small" color="primary" />
                        <Typography variant="body2">
                          {courier.working_hours 
                            ? `${courier.working_hours.start} - ${courier.working_hours.end}` 
                            : "Hours not set"}
                        </Typography>
                      </Stack>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Schedule fontSize="small" color="primary" />
                        <Typography variant="body2">{courier.working_days}</Typography>
                      </Stack>
                    </Stack>

                    <Stack direction="row" justifyContent="space-between" alignItems="center" mt={2}>
                      <Chip 
                        label={CourierAvailabilityService.isCourierWorkingToday(courier) ? "Working Today" : "Off Today"} 
                        color={CourierAvailabilityService.isCourierWorkingToday(courier) ? "success" : "default"} 
                        size="small" 
                      />
                      <Chip 
                        label={`${getCallsForCourier(courier.id).length} calls`} 
                        color="primary" 
                        size="small" 
                      />
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        {/* My Calls Tab */}
        <TabPanel value={tabValue} index={2}>
          <Typography variant="h5" gutterBottom>All My Calls ({myCalls.length} total)</Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Duration</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {myCalls.map(call => (
                  <TableRow key={call.id} hover>
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar><Person /></Avatar>
                        {call.userName}
                      </Stack>
                    </TableCell>
                    <TableCell>{new Date(call.callTime).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(call.callTime).toLocaleTimeString()}</TableCell>
                    <TableCell>
                      <Chip 
                        label={call.status} 
                        color={call.status === "active" ? "success" : "default"} 
                        size="small" 
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="textSecondary">
                        {new Date().getTime() - new Date(call.callTime).getTime() > 0 
                          ? `${Math.floor((new Date().getTime() - new Date(call.callTime).getTime()) / (1000 * 60))} min ago`
                          : "Upcoming"
                        }
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {myCalls.length === 0 && (
            <Box textAlign="center" py={6}>
              <Call sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
              <Typography variant="h6" gutterBottom>No Calls Yet</Typography>
              <Typography variant="body2" color="textSecondary">
                You haven't received any calls yet.
              </Typography>
            </Box>
          )}
        </TabPanel>

        {/* Today's Calls Tab */}
        <TabPanel value={tabValue} index={3}>
          <Typography variant="h5" gutterBottom>Today's Calls ({stats.todaysCalls.length})</Typography>
          
          {stats.todaysCalls.length > 0 ? (
            <List>
              {stats.todaysCalls.map(call => (
                <ListItem key={call.id} divider>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: "primary.main" }}>
                      <Person />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={call.userName}
                    secondary={
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Typography variant="body2">
                          {new Date(call.callTime).toLocaleTimeString()}
                        </Typography>
                        <Chip 
                          label={call.status} 
                          color={call.status === "active" ? "success" : "default"} 
                          size="small" 
                        />
                        <Typography variant="body2" color="textSecondary">
                          {new Date().getTime() - new Date(call.callTime).getTime() > 0 
                            ? `${Math.floor((new Date().getTime() - new Date(call.callTime).getTime()) / (1000 * 60))} min ago`
                            : "Upcoming"
                          }
                        </Typography>
                      </Stack>
                    }
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Box textAlign="center" py={6}>
              <Today sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                {stats.workingToday ? "No Calls Today" : "Not Working Today"}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {stats.workingToday 
                  ? "You don't have any calls scheduled for today." 
                  : "Today is your day off."}
              </Typography>
            </Box>
          )}
        </TabPanel>
      </Paper>

      {/* Edit Profile Dialog */}
      <Dialog open={editDialog} onClose={() => setEditDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Edit Courier Profile</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {editingCourier && (
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="First Name"
                  value={editingCourier.first_name}
                  onChange={(e) => setEditingCourier({ ...editingCourier, first_name: e.target.value })}
                  fullWidth
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Last Name"
                  value={editingCourier.last_name}
                  onChange={(e) => setEditingCourier({ ...editingCourier, last_name: e.target.value })}
                  fullWidth
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Phone"
                  value={editingCourier.phone}
                  onChange={(e) => setEditingCourier({ ...editingCourier, phone: e.target.value })}
                  fullWidth
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Email"
                  value={editingCourier.email}
                  onChange={(e) => setEditingCourier({ ...editingCourier, email: e.target.value })}
                  fullWidth
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Vehicle"
                  value={editingCourier.vehicle || ""}
                  onChange={(e) => setEditingCourier({ ...editingCourier, vehicle: e.target.value })}
                  fullWidth
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Working Day</InputLabel>
                  <Select
                    value={editingCourier.working_days || ""}
                    label="Working Day"
                    onChange={(e) => setEditingCourier({
                      ...editingCourier,
                      working_days: e.target.value as WeekDay,
                    })}
                  >
                    <MenuItem value="monday">Monday</MenuItem>
                    <MenuItem value="tuesday">Tuesday</MenuItem>
                    <MenuItem value="wednesday">Wednesday</MenuItem>
                    <MenuItem value="thursday">Thursday</MenuItem>
                    <MenuItem value="friday">Friday</MenuItem>
                    <MenuItem value="saturday">Saturday</MenuItem>
                    <MenuItem value="sunday">Sunday</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Start Time"
                  type="time"
                  value={editingCourier.working_hours?.start || ""}
                  onChange={(e) => setEditingCourier({
                    ...editingCourier,
                    working_hours: {
                      ...editingCourier.working_hours,
                      start: e.target.value,
                      end: editingCourier.working_hours?.end || "",
                    } as WorkingHours,
                  })}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="End Time"
                  type="time"
                  value={editingCourier.working_hours?.end || ""}
                  onChange={(e) => setEditingCourier({
                    ...editingCourier,
                    working_hours: {
                      ...editingCourier.working_hours,
                      start: editingCourier.working_hours?.start || "",
                      end: e.target.value,
                    } as WorkingHours,
                  })}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  margin="normal"
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog(false)}>Cancel</Button>
          <Button onClick={handleUpdateProfile} variant="contained" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Courier;