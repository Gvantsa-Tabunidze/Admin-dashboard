import { createContext, useContext, useState, type ReactNode } from "react";
import type { AuthProps } from "../interfaces/AuthProps";
import { useNavigate } from "react-router-dom";
import $axios from "../http/AxiosAuth.Post";

interface CourierCall {
  id: string;
  userId: string;
  courierId: string;
  callTime: string;
  status: "active" | "completed";
  userName: string;
  courierName: string;
}

interface IAuthContext {
  submitForm: (formData: AuthProps) => Promise<void>;
  logout: () => void;
  user: AuthProps | null;
  isAuthenticated: boolean;
  // API methods for dashboard functionality
  getUsers: () => Promise<AuthProps[]>;
  getCouriers: () => Promise<AuthProps[]>;
  getCourierCalls: (filters?: {
    userId?: string;
    courierId?: string;
  }) => Promise<CourierCall[]>;
  updateUser: (userId: string, userData: Partial<AuthProps>) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  createCourierCall: (callData: Omit<CourierCall, "id">) => Promise<void>;
}

const AuthContext = createContext<IAuthContext | undefined>(undefined);

export const AuthContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<AuthProps | null>(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const submitForm = async (formData: AuthProps) => {
    const role = formData.role as "admin" | "user" | "courier";
    if (!role) return console.error("Role is required");

    try {
      const payload = { data: [formData] };
      await $axios.post("/users", payload);

      //save user to local storage
      setUser(formData);
      console.log(formData);
      localStorage.setItem("user", JSON.stringify(formData));

      //Navigate based on role
      switch (role) {
        case "admin":
          navigate("/admin");
          break;
        case "user":
          navigate("/user");
          break;
        case "courier":
          navigate("/courier");
          break;
        default:
          console.warn("Unknown role");
      }
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  // API methods for dashboard functionality
  const getUsers = async (): Promise<AuthProps[]> => {
    try {
      const response = await $axios.get("/users?role=user");
      return response.data || [];
    } catch (error) {
      console.error("Error fetching users:", error);
      return [];
    }
  };

  const getCouriers = async (): Promise<AuthProps[]> => {
    try {
      const response = await $axios.get("/users?role=courier");
      return response.data || [];
    } catch (error) {
      console.error("Error fetching couriers:", error);
      return [];
    }
  };

  const getCourierCalls = async (filters?: {
    userId?: string;
    courierId?: string;
  }): Promise<CourierCall[]> => {
    try {
      let url = "/courier-calls";
      const params = new URLSearchParams();

      if (filters?.userId) params.append("userId", filters.userId);
      if (filters?.courierId) params.append("courierId", filters.courierId);

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await $axios.get(url);
      return response.data || [];
    } catch (error) {
      console.error("Error fetching courier calls:", error);
      return [];
    }
  };

  const updateUser = async (
    userId: string,
    userData: Partial<AuthProps>
  ): Promise<void> => {
    try {
      await $axios.put(`/users/${userId}`, userData);

      // Update local user if it's the current user
      if (user && user.id === userId) {
        const updatedUser = { ...user, ...userData };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  };

  const deleteUser = async (userId: string): Promise<void> => {
    try {
      await $axios.delete(`/users/${userId}`);
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  };

  const createCourierCall = async (
    callData: Omit<CourierCall, "id">
  ): Promise<void> => {
    try {
      await $axios.post("/courier-calls", {
        ...callData,
        id: Date.now().toString(), // Simple ID generation for demo
      });
    } catch (error) {
      console.error("Error creating courier call:", error);
      throw error;
    }
  };

  //log out
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/auth", { replace: true });
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        submitForm,
        logout,
        isAuthenticated,
        user,
        getUsers,
        getCouriers,
        getCourierCalls,
        updateUser,
        deleteUser,
        createCourierCall,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthContextProvider");
  }
  return context;
};
