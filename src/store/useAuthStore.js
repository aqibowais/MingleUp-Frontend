import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import {io} from "socket.io-client"


const SOCKET_URL = import.meta.env.MODE==="development"? "http://localhost:8000":"/"
export const useAuthStore = create((set,get) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  onlineUsers:[],
  socket:null,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      console.log("Auth check data",res.data)
      set({ authUser: res.data });
      get().connectSocket()
    } catch (error) {
      console.log("Error in checkAuth in useAuthStore", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signUp:async(data)=>{
    set({isSigningUp:true})
    try {
    const res = await axiosInstance.post("/auth/signup",data)
    console.log(res)
    set({authUser:res.data})
    toast.success("Account created Successfully")
    } catch (error) {
      toast.error(error.response.data.message)
    } finally{
      set({isSigningUp:false})
    }
  },

  logout:async()=>{
    //no need for logout state as it is already very quick
    try {
      await axiosInstance.post("/auth/logout")
      set({authUser:null})
      toast.success("Logged out successfully")
      get().disconnectSocket()
    } catch (error) {
      toast.error(error.response.data.message)
    }
  },

  logIn:async(data)=>{
    set({isLoggingIn:true})
    try {
      const res = await axiosInstance.post("/auth/login",data)
      console.log(res.data)
      set({authUser:res.data})
      toast.success("Logged In successfully")
      //after login we have to connect with socket
      get().connectSocket()
    } catch (error) {
      toast.error(error.response.data.message)
    }finally{
      set({isLoggingIn:false})
    }
  },

  updateProfile:async(data)=>{
    set({isUpdatingProfile:true})
    try {
      console.log("data is ",data)
      const res = await axiosInstance.put("/auth/update-profile",data)
      set({authUser:res.data})
      console.log("in update profile",res.data)
      toast.success("Profile Image updated successfully")
    } catch (error) {
      console.log(error)
      // Better error handling for different error types
      if (error.response) {
        // Server responded with error status
        toast.error(error.response.data.message || "Failed to update profile")
      } else if (error.code === 'ERR_NETWORK') {
        // Network error (could be payload too large)
        toast.error("Upload failed. Image may be too large. Please try a smaller image.")
      } else {
        // Other errors
        toast.error(error.message || "Failed to update profile")
      }
    }finally{
      set({isUpdatingProfile:false})
    }
  },

  connectSocket:()=>{
    const {authUser} = get()
    if(!authUser || get().socket?.connected) return
    const socket = io(SOCKET_URL,{
      query:{
        userId : authUser._id
      }
    })
    socket.connect()
    set({socket})
    
    socket.on("getOnlineUsers",(userIds)=>{
      set({onlineUsers:userIds})
    })
  },
  disconnectSocket:()=>{
    if(get().socket?.connected) get().socket?.disconnect()
    set({socket})
  }
}));
