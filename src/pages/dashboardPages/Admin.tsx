// pages/dashboardPages/Admin.tsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Chip,
  Tabs,
  Tab,
  Alert,
  Container,
  Stack,
  Card,
  CardContent,
  Grid,
  Avatar,
  Badge,
  Divider,
} from "@mui/material";
import {
  Edit,
  Delete,
  Visibility,
  Person,
  DirectionsCar,
  Call,
  Refresh,
  AdminPanelSettings,
} from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import $axios from "../../http/AxiosAuth.Post";
import type {
  AuthProps,
  WeekDay,
  WorkingHours,
} from "../../interfaces/AuthProps";
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

const Admin = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [users, setUsers] = useState<AuthProps[]>([]);
  const [couriers, setCouriers] = useState<AuthProps[]>([]);
  const [calls, setCalls] = useState<CourierCall[]>([]);
  const [editDialog, setEditDialog] = useState(false);
  const [editingCourier, setEditingCourier] = useState<AuthProps | null>(null);
  const [viewCallsDialog, setViewCallsDialog] = useState(false);
  const [selectedCourierId, setSelectedCourierId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{
    type: "success" | "error" | "warning" | "info";
    message: string;
  } | null>(null);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    await Promise.all([fetchUsers(), fetchCouriers(), fetchCalls()]);
    setLoading(false);
  };

  const fetchUsers = async () => {
    try {
      const response = await $axios.get("/users?role=user");
      setUsers(response.data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      showAlert("error", "Failed to fetch users");
    }
  };

  const fetchCouriers = async () => {
    try {
      const response = await $axios.get("/users?role=courier");
      setCouriers(response.data || []);
    } catch (error) {
      console.error("Error fetching couriers:", error);
      showAlert("error", "Failed to fetch couriers");
    }
  };

  const fetchCalls = async () => {
    try {
      const response = await $axios.get("/courier-calls");
      setCalls(response.data || []);
    } catch (error) {
      console.error("Error fetching calls:", error);
      showAlert("error", "Failed to fetch calls");
    }
  };

  const showAlert = (
    type: "success" | "error" | "warning" | "info",
    message: string
  ) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 4000);
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await $axios.delete(`/users/${userId}`);
      fetchUsers();
      showAlert("success", "User deleted successfully");
    } catch (error) {
      console.error("Error deleting user:", error);
      showAlert("error", "Failed to delete user");
    }
  };

  const handleDeleteCourier = async (courierId: string) => {
    if (!window.confirm("Are you sure you want to delete this courier?"))
      return;
    try {
      await $axios.delete(`/users/${courierId}`);
      fetchCouriers();
      showAlert("success", "Courier deleted successfully");
    } catch (error) {
      console.error("Error deleting courier:", error);
      showAlert("error", "Failed to delete courier");
    }
  };

  const handleEditCourier = (courier: AuthProps) => {
    setEditingCourier({ ...courier });
    setEditDialog(true);
  };

  const handleSaveCourierEdit = async () => {
    if (!editingCourier) return;
    try {
      setLoading(true);
      await $axios.put(`/users/${editingCourier.id}`, {
        working_days: editingCourier.working_days,
        working_hours: editingCourier.working_hours,
      });
      setEditDialog(false);
      setEditingCourier(null);
      fetchCouriers();
      showAlert("success", "Courier updated successfully");
    } catch (error) {
      console.error("Error updating courier:", error);
      showAlert("error", "Failed to update courier");
    } finally {
      setLoading(false);
    }
  };

  const handleViewCalls = (courierId: string) => {
    setSelectedCourierId(courierId);
    setViewCallsDialog(true);
  };

  const getCallsForCourier = (courierId: string) => {
    return calls.filter((call) => call.courierId === courierId);
  };

  const getStats = () => {
    const activeCalls = calls.filter((call) => call.status === "active");
    const todaysCalls = CourierAvailabilityService.getTodayCalls(calls);
    const workingToday = couriers.filter((courier) =>
      CourierAvailabilityService.isCourierWorkingToday(courier)
    );

    return { activeCalls, todaysCalls, workingToday };
  };

  const stats = getStats();

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4" color="primary" fontWeight="bold">
          Admin Dashboard
        </Typography>
        <Stack direction="row" spacing={2}>
          <IconButton onClick={fetchAllData} disabled={loading}>
            <Refresh />
          </IconButton>
          <Button
            onClick={() => {
              logout();
              navigate("/auth");
            }}
            variant="outlined"
          >
            Logout
          </Button>
        </Stack>
      </Stack>

      {alert && (
        <Alert severity={alert.type} sx={{ mb: 2 }}>
          {alert.message}
        </Alert>
      )}

      {/* Stats Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ bgcolor: "primary.main" }}>
                  <Person />
                </Avatar>
                <Box>
                  <Typography variant="h4">{users.length}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    Total Users
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ bgcolor: "success.main" }}>
                  <DirectionsCar />
                </Avatar>
                <Box>
                  <Typography variant="h4">{couriers.length}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    Total Couriers
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ bgcolor: "info.main" }}>
                  <Call />
                </Avatar>
                <Box>
                  <Typography variant="h4">
                    {stats.activeCalls.length}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Active Calls
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ bgcolor: "warning.main" }}>
                  <AdminPanelSettings />
                </Avatar>
                <Box>
                  <Typography variant="h4">
                    {stats.workingToday.length}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Working Today
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ borderRadius: 2, overflow: "hidden" }}>
        <Tabs
          value={tabValue}
          onChange={(_, newValue) => setTabValue(newValue)}
          variant="fullWidth"
        >
          <Tab
            label={
              <Badge badgeContent={users.length} color="primary">
                Users
              </Badge>
            }
            icon={<Person />}
            iconPosition="start"
          />
          <Tab
            label={
              <Badge badgeContent={couriers.length} color="success">
                Couriers
              </Badge>
            }
            icon={<DirectionsCar />}
            iconPosition="start"
          />
          <Tab
            label={
              <Badge badgeContent={calls.length} color="info">
                All Calls
              </Badge>
            }
            icon={<Call />}
            iconPosition="start"
          />
        </Tabs>

        {/* Users Tab */}
        <TabPanel value={tabValue} index={0}>
          <Typography variant="h5" gutterBottom>
            Users Management
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Contact</TableCell>
                  <TableCell>Address</TableCell>
                  <TableCell>Total Calls</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar src={user.profile_image}>
                          {user.first_name[0]}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2">
                            {user.first_name} {user.last_name}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            ID: {user.id}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2">{user.email}</Typography>
                        <Typography variant="body2" color="textSecondary">
                          {user.phone}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{user.address || "N/A"}</TableCell>
                    <TableCell>
                      <Chip
                        label={
                          calls.filter((call) => call.userId === user.id).length
                        }
                        color="primary"
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteUser(user.id)}
                        size="small"
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Couriers Tab */}
        <TabPanel value={tabValue} index={1}>
          <Typography variant="h5" gutterBottom>
            Couriers Management
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Courier</TableCell>
                  <TableCell>Contact</TableCell>
                  <TableCell>Vehicle</TableCell>
                  <TableCell>Schedule</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Calls</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {couriers.map((courier) => (
                  <TableRow key={courier.id} hover>
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar src={courier.profile_image}>
                          {courier.first_name[0]}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2">
                            {courier.first_name} {courier.last_name}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            ID: {courier.id}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2">{courier.email}</Typography>
                        <Typography variant="body2" color="textSecondary">
                          {courier.phone}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{courier.vehicle}</TableCell>
                    <TableCell>
                      <Box>
                        <Chip
                          label={courier.working_days}
                          size="small"
                          color="default"
                        />
                        <Typography variant="body2" color="textSecondary">
                          {courier.working_hours
                            ? `${courier.working_hours.start} - ${courier.working_hours.end}`
                            : "Not set"}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={
                          CourierAvailabilityService.isCourierWorkingToday(
                            courier
                          )
                            ? "Working Today"
                            : "Off Today"
                        }
                        color={
                          CourierAvailabilityService.isCourierWorkingToday(
                            courier
                          )
                            ? "success"
                            : "default"
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getCallsForCourier(courier.id).length}
                        color="info"
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Stack direction="row">
                        <IconButton
                          color="primary"
                          onClick={() => handleEditCourier(courier)}
                          size="small"
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          color="info"
                          onClick={() => handleViewCalls(courier.id)}
                          size="small"
                        >
                          <Visibility />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleDeleteCourier(courier.id)}
                          size="small"
                        >
                          <Delete />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* All Calls Tab */}
        <TabPanel value={tabValue} index={2}>
          <Typography variant="h5" gutterBottom>
            All Calls ({calls.length})
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Courier</TableCell>
                  <TableCell>Date & Time</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Duration</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {calls.map((call) => (
                  <TableRow key={call.id} hover>
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar>
                          <Person />
                        </Avatar>
                        {call.userName}
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar>
                          <DirectionsCar />
                        </Avatar>
                        {call.courierName}
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2">
                          {new Date(call.callTime).toLocaleDateString()}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {new Date(call.callTime).toLocaleTimeString()}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={call.status}
                        color={call.status === "active" ? "success" : "default"}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="textSecondary">
                        {new Date().getTime() -
                          new Date(call.callTime).getTime() >
                        0
                          ? `${Math.floor(
                              (new Date().getTime() -
                                new Date(call.callTime).getTime()) /
                                (1000 * 60)
                            )} min ago`
                          : "Upcoming"}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
      </Paper>

      {/* Edit Courier Dialog */}
      <Dialog
        open={editDialog}
        onClose={() => setEditDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Courier Schedule</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {editingCourier && (
            <Stack spacing={3}>
              <Typography variant="body2" color="textSecondary">
                Editing schedule for {editingCourier.first_name}{" "}
                {editingCourier.last_name}
              </Typography>

              <FormControl fullWidth>
                <InputLabel>Working Day</InputLabel>
                <Select
                  value={editingCourier.working_days || ""}
                  label="Working Day"
                  onChange={(e) =>
                    setEditingCourier({
                      ...editingCourier,
                      working_days: e.target.value as WeekDay,
                    })
                  }
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

              <Stack direction="row" spacing={2}>
                <TextField
                  label="Start Time"
                  type="time"
                  value={editingCourier.working_hours?.start || ""}
                  onChange={(e) =>
                    setEditingCourier({
                      ...editingCourier,
                      working_hours: {
                        ...editingCourier.working_hours,
                        start: e.target.value,
                        end: editingCourier.working_hours?.end || "",
                      } as WorkingHours,
                    })
                  }
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
                <TextField
                  label="End Time"
                  type="time"
                  value={editingCourier.working_hours?.end || ""}
                  onChange={(e) =>
                    setEditingCourier({
                      ...editingCourier,
                      working_hours: {
                        ...editingCourier.working_hours,
                        start: editingCourier.working_hours?.start || "",
                        end: e.target.value,
                      } as WorkingHours,
                    })
                  }
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
              </Stack>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog(false)}>Cancel</Button>
          <Button
            onClick={handleSaveCourierEdit}
            variant="contained"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Calls Dialog */}
      <Dialog
        open={viewCallsDialog}
        onClose={() => setViewCallsDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Courier Calls History</DialogTitle>
        <DialogContent>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {getCallsForCourier(selectedCourierId).map((call) => (
                  <TableRow key={call.id}>
                    <TableCell>{call.userName}</TableCell>
                    <TableCell>
                      {new Date(call.callTime).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {new Date(call.callTime).toLocaleTimeString()}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={call.status}
                        color={call.status === "active" ? "success" : "default"}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {getCallsForCourier(selectedCourierId).length === 0 && (
            <Box textAlign="center" py={4}>
              <Typography variant="body1" color="textSecondary">
                No calls found for this courier
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewCallsDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Admin;
