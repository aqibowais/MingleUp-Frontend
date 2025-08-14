import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const useAuthStore = create((set) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      console.log("Auth check data",res.data)
      set({ authUser: res.data });
    } catch (error) {
      console.log("Error in checkAuth in useAuthStore", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signUp:async(data)=>{
    const newUser = await axiosInstance.post("/auth/signup",data)
    console.log(newUser)
  }
}));
