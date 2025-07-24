// pages/dashboardPages/User.tsx
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
  Chip,
  Tabs,
  Tab,
  Card,
  CardContent,
  CardActions,
  Grid,
  Alert,
  IconButton,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Badge,
  Container,
  Stack,
} from "@mui/material";
import {
  Edit,
  Call,
  Person,
  AccessTime,
  DirectionsCar,
  Email,
  Phone,
  LocationOn,
  CheckCircle,
  Cancel,
  Today,
  Refresh,
} from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import $axios from "../../http/AxiosAuth.Post";
import type { AuthProps } from "../../interfaces/AuthProps";
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

const User = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [couriers, setCouriers] = useState<AuthProps[]>([]);
  const [myCalls, setMyCalls] = useState<CourierCall[]>([]);
  const [editDialog, setEditDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<AuthProps | null>(null);
  const [callDialog, setCallDialog] = useState(false);
  const [selectedCourier, setSelectedCourier] = useState<AuthProps | null>(
    null
  );
  const [callTime, setCallTime] = useState("");
  const [callDate, setCallDate] = useState("");
  const [alert, setAlert] = useState<{
    type: "success" | "error" | "warning" | "info";
    message: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) setEditingUser({ ...user });
    fetchData();
  }, [user]);

  const fetchData = async () => {
    await Promise.all([fetchCouriers(), fetchMyCalls()]);
  };

  const fetchCouriers = async () => {
    try {
      setLoading(true);
      const response = await $axios.get("/users?role=courier");
      setCouriers(response.data || []);
    } catch (error) {
      console.error("Error fetching couriers:", error);
      showAlert("error", "Failed to load couriers");
    } finally {
      setLoading(false);
    }
  };

  const fetchMyCalls = async () => {
    try {
      const response = await $axios.get(`/courier-calls?userId=${user?.id}`);
      setMyCalls(response.data || []);
    } catch (error) {
      console.error("Error fetching my calls:", error);
    }
  };

  const showAlert = (
    type: "success" | "error" | "warning" | "info",
    message: string
  ) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 4000);
  };

  const handleUpdateProfile = async () => {
    if (!editingUser) return;
    try {
      setLoading(true);
      await $axios.put(`/users/${editingUser.id}`, editingUser);
      setEditDialog(false);
      showAlert("success", "Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      showAlert("error", "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleCallCourier = (courier: AuthProps) => {
    setSelectedCourier(courier);
    setCallDialog(true);
    setCallTime("");
    setCallDate(new Date().toISOString().split("T")[0]);
  };

  const handleConfirmCall = async () => {
    if (!selectedCourier || !callTime || !callDate || !user) return;

    if (
      !CourierAvailabilityService.isTimeSlotAvailable(
        selectedCourier,
        callDate,
        callTime,
        myCalls
      )
    ) {
      showAlert("error", "This time slot is not available");
      return;
    }

    if (
      CourierAvailabilityService.hasUserConflict(
        user.id,
        callDate,
        callTime,
        myCalls
      )
    ) {
      showAlert("error", "You already have a call at this time");
      return;
    }

    try {
      setLoading(true);
      const callData = {
        id: Date.now().toString(),
        userId: user.id,
        courierId: selectedCourier.id,
        callTime: `${callDate}T${callTime}:00`,
        status: "active" as const,
        userName: `${user.first_name} ${user.last_name}`,
        courierName: `${selectedCourier.first_name} ${selectedCourier.last_name}`,
      };

      await $axios.post("/courier-calls", callData);
      setCallDialog(false);
      setSelectedCourier(null);
      fetchMyCalls();
      showAlert("success", "Courier called successfully!");
    } catch (error) {
      console.error("Error calling courier:", error);
      showAlert("error", "Failed to call courier");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelCall = async (callId: string) => {
    if (!window.confirm("Cancel this call?")) return;
    try {
      setLoading(true);
      await $axios.delete(`/courier-calls/${callId}`);
      fetchMyCalls();
      showAlert("success", "Call cancelled");
    } catch (error) {
      console.error("Error cancelling call:", error);
      showAlert("error", "Failed to cancel call");
    } finally {
      setLoading(false);
    }
  };

  const availableCouriers = CourierAvailabilityService.getAvailableCouriers(
    couriers,
    myCalls
  );
  const activeCalls = myCalls.filter((call) => call.status === "active");
  const todaysCalls = CourierAvailabilityService.getTodayCalls(myCalls);

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
          User Dashboard
        </Typography>
        <Stack direction="row" spacing={2}>
          <IconButton onClick={fetchData} disabled={loading}>
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

      <Paper sx={{ borderRadius: 2, overflow: "hidden" }}>
        <Tabs
          value={tabValue}
          onChange={(_, newValue) => setTabValue(newValue)}
          variant="fullWidth"
        >
          <Tab label="Profile" icon={<Person />} iconPosition="start" />
          <Tab
            label={
              <Badge badgeContent={availableCouriers.length} color="primary">
                Couriers
              </Badge>
            }
            icon={<DirectionsCar />}
            iconPosition="start"
          />
          <Tab
            label={
              <Badge badgeContent={activeCalls.length} color="success">
                My Calls
              </Badge>
            }
            icon={<Call />}
            iconPosition="start"
          />
          <Tab
            label={
              <Badge badgeContent={todaysCalls.length} color="info">
                Today
              </Badge>
            }
            icon={<Today />}
            iconPosition="start"
          />
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
                      sx={{
                        width: 80,
                        height: 80,
                        border: 2,
                        borderColor: "primary.main",
                      }}
                    />
                    <Box>
                      <Typography variant="h4">
                        {user?.first_name} {user?.last_name}
                      </Typography>
                      <Typography variant="h6" color="textSecondary">
                        User Account
                      </Typography>
                      <Chip
                        label={`${myCalls.length} Total Calls`}
                        color="primary"
                        size="small"
                      />
                    </Box>
                  </Stack>

                  <Divider sx={{ mb: 3 }} />

                  <Grid container spacing={3}>
                    {[
                      { icon: <Person />, label: "ID", value: user?.id },
                      { icon: <Phone />, label: "Phone", value: user?.phone },
                      { icon: <Email />, label: "Email", value: user?.email },
                      {
                        icon: <LocationOn />,
                        label: "Address",
                        value: user?.address || "Not provided",
                      },
                    ].map((item, index) => (
                      <Grid item xs={12} sm={6} key={index}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          {React.cloneElement(item.icon, {
                            sx: { color: "primary.main" },
                          })}
                          <Box>
                            <Typography variant="body2" color="textSecondary">
                              {item.label}
                            </Typography>
                            <Typography variant="body1" fontWeight="medium">
                              {item.value}
                            </Typography>
                          </Box>
                        </Stack>
                      </Grid>
                    ))}
                  </Grid>

                  <Stack direction="row" spacing={2} mt={3}>
                    <Chip
                      label={`${activeCalls.length} Active`}
                      color="success"
                    />
                    <Chip
                      label={`${
                        myCalls.filter((c) => c.status === "completed").length
                      } Completed`}
                      color="default"
                    />
                  </Stack>
                </CardContent>
                <CardActions sx={{ p: 3, pt: 0 }}>
                  <Button
                    startIcon={<Edit />}
                    onClick={() => setEditDialog(true)}
                    variant="contained"
                  >
                    Edit Profile
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Available Couriers Tab */}
        <TabPanel value={tabValue} index={1}>
          <Typography variant="h5" gutterBottom>
            Available Couriers Today
          </Typography>
          <Grid container spacing={3}>
            {availableCouriers.map((courier) => (
              <Grid item xs={12} sm={6} md={4} key={courier.id}>
                <Card
                  elevation={2}
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Stack
                      direction="row"
                      spacing={2}
                      alignItems="center"
                      mb={2}
                    >
                      <Avatar src={courier.profile_image} />
                      <Box>
                        <Typography variant="h6">
                          {courier.first_name} {courier.last_name}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {courier.email}
                        </Typography>
                      </Box>
                    </Stack>

                    <Divider sx={{ mb: 2 }} />

                    <Stack spacing={1}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <DirectionsCar fontSize="small" color="primary" />
                        <Typography variant="body2">
                          {courier.vehicle}
                        </Typography>
                      </Stack>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <AccessTime fontSize="small" color="primary" />
                        <Typography variant="body2">
                          {courier.working_hours
                            ? `${courier.working_hours.start} - ${courier.working_hours.end}`
                            : "Not set"}
                        </Typography>
                      </Stack>
                    </Stack>

                    <Stack direction="row" spacing={1} mt={2}>
                      <Chip
                        label={`Working ${courier.working_days}`}
                        color="success"
                        size="small"
                      />
                      <Chip label="Available" color="info" size="small" />
                    </Stack>
                  </CardContent>
                  <CardActions>
                    <Button
                      startIcon={<Call />}
                      onClick={() => handleCallCourier(courier)}
                      variant="contained"
                      fullWidth
                      disabled={loading}
                    >
                      Book Call
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        {/* My Calls Tab */}
        <TabPanel value={tabValue} index={2}>
          <Typography variant="h5" gutterBottom>
            All My Calls ({myCalls.length})
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Courier</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {myCalls.map((call) => (
                  <TableRow key={call.id}>
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar>
                          <Person />
                        </Avatar>
                        {call.courierName}
                      </Stack>
                    </TableCell>
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
                    <TableCell>
                      {call.status === "active" && (
                        <IconButton
                          color="error"
                          onClick={() => handleCancelCall(call.id)}
                          disabled={loading}
                        >
                          <Cancel />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Today's Calls Tab */}
        <TabPanel value={tabValue} index={3}>
          <Typography variant="h5" gutterBottom>
            Today's Calls ({todaysCalls.length})
          </Typography>
          {todaysCalls.length > 0 ? (
            <List>
              {todaysCalls.map((call) => (
                <ListItem key={call.id} divider>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: "primary.main" }}>
                      <Person />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={call.courierName}
                    secondary={`${new Date(
                      call.callTime
                    ).toLocaleTimeString()} - ${call.status}`}
                  />
                  <Chip
                    label={call.status}
                    color={call.status === "active" ? "success" : "default"}
                    size="small"
                  />
                  {call.status === "active" && (
                    <IconButton
                      color="error"
                      onClick={() => handleCancelCall(call.id)}
                    >
                      <Cancel />
                    </IconButton>
                  )}
                </ListItem>
              ))}
            </List>
          ) : (
            <Box textAlign="center" py={4}>
              <Today sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
              <Typography variant="h6">No calls today</Typography>
            </Box>
          )}
        </TabPanel>
      </Paper>

      {/* Edit Profile Dialog */}
      <Dialog
        open={editDialog}
        onClose={() => setEditDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          {editingUser && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="First Name"
                  value={editingUser.first_name}
                  onChange={(e) =>
                    setEditingUser({
                      ...editingUser,
                      first_name: e.target.value,
                    })
                  }
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Last Name"
                  value={editingUser.last_name}
                  onChange={(e) =>
                    setEditingUser({
                      ...editingUser,
                      last_name: e.target.value,
                    })
                  }
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Phone"
                  value={editingUser.phone}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, phone: e.target.value })
                  }
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Email"
                  value={editingUser.email}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, email: e.target.value })
                  }
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Address"
                  value={editingUser.address || ""}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, address: e.target.value })
                  }
                  fullWidth
                  multiline
                  rows={2}
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog(false)}>Cancel</Button>
          <Button
            onClick={handleUpdateProfile}
            variant="contained"
            disabled={loading}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Call Courier Dialog */}
      <Dialog
        open={callDialog}
        onClose={() => setCallDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Book Courier Call</DialogTitle>
        <DialogContent>
          {selectedCourier && (
            <Stack spacing={3} sx={{ mt: 2 }}>
              <Card variant="outlined">
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Avatar src={selectedCourier.profile_image} />
                    <Box>
                      <Typography variant="h6">
                        {selectedCourier.first_name} {selectedCourier.last_name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {selectedCourier.vehicle}
                      </Typography>
                    </Box>
                  </Stack>
                  <Typography variant="body2" color="primary" mt={1}>
                    Available: {selectedCourier.working_hours?.start} -{" "}
                    {selectedCourier.working_hours?.end}
                  </Typography>
                </CardContent>
              </Card>

              <TextField
                label="Date"
                type="date"
                value={callDate}
                onChange={(e) => setCallDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                fullWidth
                inputProps={{ min: new Date().toISOString().split("T")[0] }}
              />
              <TextField
                label="Time"
                type="time"
                value={callTime}
                onChange={(e) => setCallTime(e.target.value)}
                InputLabelProps={{ shrink: true }}
                fullWidth
                helperText="Select a time within courier's working hours"
              />

              {callTime &&
                callDate &&
                !CourierAvailabilityService.isTimeSlotAvailable(
                  selectedCourier,
                  callDate,
                  callTime,
                  myCalls
                ) && (
                  <Alert severity="warning">
                    This time slot is not available
                  </Alert>
                )}

              {callTime &&
                callDate &&
                CourierAvailabilityService.hasUserConflict(
                  user?.id || "",
                  callDate,
                  callTime,
                  myCalls
                ) && (
                  <Alert severity="error">
                    You already have a call at this time
                  </Alert>
                )}
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCallDialog(false)}>Cancel</Button>
          <Button
            onClick={handleConfirmCall}
            variant="contained"
            disabled={
              !callTime ||
              !callDate ||
              loading ||
              (selectedCourier &&
                (!CourierAvailabilityService.isTimeSlotAvailable(
                  selectedCourier,
                  callDate,
                  callTime,
                  myCalls
                ) ||
                  CourierAvailabilityService.hasUserConflict(
                    user?.id || "",
                    callDate,
                    callTime,
                    myCalls
                  )))
            }
          >
            {loading ? "Booking..." : "Confirm Call"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default User;
