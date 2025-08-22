import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set,get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUserLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUserLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      console.log("result of getusers",res)
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to get users");
    } finally {
      set({ isUserLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to get messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage:async(messageData)=>{
    const {messages,selectedUser} = get()
    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`,messageData)
      console.log(res)
      // Ensure messages is an array before spreading
      const currentMessages = Array.isArray(messages) ? messages : [];
      set({ messages: [...currentMessages, res.data] });
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || "Failed to send message");
    }
  },

  setSelectedUser: (selectedUser) => {
    set({ selectedUser });

  },
  subscribeToMessages:()=>{
    const {selectedUser} = get()
    if(!selectedUser) return 

    // todo: optimize this later
    
    const socket = useAuthStore.getState().socket
    socket.on("newMessages",(newMessage)=>{
      const isMessageSentFromSelectedUser = (selectedUser._id===newMessage.senderId)
      if(!isMessageSentFromSelectedUser) return
      set({messages:[...get().messages,newMessage]})
    })
  },
  unsubscribeFromMessages:()=>{
    const socket = useAuthStore.getState().socket
    socket.off("newMessages")
  }
}));
