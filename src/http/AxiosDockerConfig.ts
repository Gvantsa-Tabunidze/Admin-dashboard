// http/AxiosDockerConfig.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

// Docker environment configuration
const isDevelopment = import.meta.env.MODE === "development";
const isDocker = import.meta.env.VITE_DOCKER === "true";

// API Configuration for different environments
const getApiConfig = () => {
  if (isDocker) {
    // Docker container network configuration
    return {
      baseURL: import.meta.env.VITE_API_URL || "http://api:3000/api/v1",
      timeout: 10000,
    };
  } else if (isDevelopment) {
    // Local development configuration
    return {
      baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1",
      timeout: 5000,
    };
  } else {
    // Production configuration
    return {
      baseURL: import.meta.env.VITE_API_URL || "/api/v1",
      timeout: 8000,
    };
  }
};

// Create axios instance with Docker-compatible configuration
const createAxiosInstance = (): AxiosInstance => {
  const config = getApiConfig();

  const instance = axios.create({
    ...config,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      // Add your API key if needed
      ...(import.meta.env.VITE_API_KEY && {
        "x-bypass-token": import.meta.env.VITE_API_KEY,
        Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
      }),
    },
    // Important for Docker: handle network issues gracefully
    validateStatus: (status) => status >= 200 && status < 300,
    maxRedirects: 3,
    // Retry configuration for Docker network issues
    timeout: config.timeout,
  });

  // Request interceptor for Docker-specific handling
  instance.interceptors.request.use(
    (config: AxiosRequestConfig) => {
      // Log requests in development
      if (isDevelopment) {
        console.log(
          `[API Request] ${config.method?.toUpperCase()} ${config.url}`,
          config.data
        );
      }

      // Add timestamp to prevent caching issues in Docker
      if (config.method === "get") {
        config.params = {
          ...config.params,
          _t: Date.now(),
        };
      }

      return config;
    },
    (error) => {
      console.error("[API Request Error]", error);
      return Promise.reject(error);
    }
  );

  // Response interceptor for Docker-specific error handling
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      if (isDevelopment) {
        console.log(`[API Response] ${response.status}`, response.data);
      }
      return response;
    },
    (error) => {
      // Handle Docker-specific network errors
      if (error.code === "ECONNREFUSED" || error.code === "ENOTFOUND") {
        console.error(
          "[Docker Network Error] Cannot connect to API container:",
          error.message
        );
        // You might want to show a user-friendly message here
        error.userMessage =
          "Cannot connect to server. Please check if the API service is running.";
      } else if (error.code === "ECONNABORTED") {
        console.error("[Timeout Error] Request timed out:", error.message);
        error.userMessage = "Request timed out. Please try again.";
      } else if (
        error.response?.status === 502 ||
        error.response?.status === 503
      ) {
        console.error(
          "[Service Unavailable] API service is down:",
          error.message
        );
        error.userMessage =
          "Service temporarily unavailable. Please try again later.";
      }

      console.error("[API Response Error]", error);
      return Promise.reject(error);
    }
  );

  return instance;
};

// Export the configured instance
export const $dockerAxios = createAxiosInstance();

// Specific methods for common Docker scenarios
export const dockerApiMethods = {
  // Health check for Docker container
  async healthCheck(): Promise<boolean> {
    try {
      const response = await $dockerAxios.get("/health");
      return response.status === 200;
    } catch (error) {
      console.error("Health check failed:", error);
      return false;
    }
  },

  // Retry mechanism for Docker network issues
  async retryRequest<T>(
    requestFn: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<T> {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await requestFn();
      } catch (error: any) {
        if (i === maxRetries - 1) throw error;

        // Only retry on network errors
        if (
          error.code === "ECONNREFUSED" ||
          error.code === "ENOTFOUND" ||
          error.response?.status >= 500
        ) {
          console.log(`Retry attempt ${i + 1}/${maxRetries} after ${delay}ms`);
          await new Promise((resolve) => setTimeout(resolve, delay));
          delay *= 1.5; // Exponential backoff
        } else {
          throw error;
        }
      }
    }
    throw new Error("Max retries exceeded");
  },

  // Batch requests with error handling
  async batchRequest<T>(
    requests: (() => Promise<T>)[],
    options: { failFast?: boolean; maxConcurrent?: number } = {}
  ): Promise<(T | Error)[]> {
    const { failFast = false, maxConcurrent = 5 } = options;
    const results: (T | Error)[] = [];

    // Process requests in batches to avoid overwhelming Docker network
    for (let i = 0; i < requests.length; i += maxConcurrent) {
      const batch = requests.slice(i, i + maxConcurrent);
      const batchPromises = batch.map(async (request, index) => {
        try {
          return await request();
        } catch (error) {
          if (failFast) throw error;
          return error as Error;
        }
      });

      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);
    }

    return results;
  },
};

// Export default instance for backward compatibility
export default $dockerAxios;

// Environment info for debugging
export const environmentInfo = {
  isDevelopment,
  isDocker,
  apiUrl: getApiConfig().baseURL,
  timeout: getApiConfig().timeout,
};
