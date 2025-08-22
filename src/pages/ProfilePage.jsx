import { Camera, Mail, User } from "lucide-react";
import React, { useEffect,useState } from "react";
import { useAuthStore } from "../store/useAuthStore";

function ProfilePage() {
  const { authUser, isUpdatingProfile, updateProfile,checkAuth } = useAuthStore();
  const [selectedImage,setselectedImage] = useState("")

  useEffect(()=>{
    checkAuth()
  },[])


  const handleUploadImage = async (e) => {
    e.preventDefault()
    const file = e.target.files[0]
    if(!file) return

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      console.error("File too large")
      alert("Please select an image smaller than 5MB")
      return
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      console.error("Invalid file type")
      alert("Please select a valid image file")
      return
    }

    const reader = new FileReader()
    reader.readAsDataURL(file)
    
    reader.onload = async () => {
      try {
        console.log("FileReader result:", reader.result)
        const base64Image = reader.result
        setselectedImage(base64Image)
        await updateProfile({profilePic:base64Image})
      } catch (error) {
        console.error("Error processing image:", error)
      }
    }
    
    reader.onerror = () => {
      console.error("FileReader error")
    }
    
  };
  return (
    <div className="max-h-svh">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl text-primary font-semibold">Profile</h1>
            <p className="text-base mt-2">Welcome to your profile page!</p>
          </div>
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                className="size-32 rounded-full border-4 object-cover"
                src={selectedImage || authUser?.profilePic || "/avatar.png"} 
                alt="Profile"
              />

              <label
              
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-0 right-0 
                  bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200
                   ${
                     isUpdatingProfile
                       ? "animate-pulse pointer-events-none"
                       : ""
                   }
                `}
             
              >
                <Camera className="w-5 h-5 text-base-200" />
                 <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleUploadImage}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            <p className="text-sm text-base-content/60">
              {isUpdatingProfile
                ? "Uploading..."
                : "Click the camera icon to update your photo"}
            </p>

            <div className="space-y-6 w-full px-5 mb-8">
              <div className="space-y-1.5">
                <div className="text-sm text-base-content/60 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Full Name
                </div>
                <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                  {authUser?.fullName}
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="text-sm text-base-content/60 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Address
                </div>
                <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                  {authUser?.email}
                </p>
              </div>
            </div>
            
          </div>
          
        </div>
        <div className="mt-6 bg-base-300 rounded-xl p-6 space-y-8">
            <h2 className="text-lg font-medium  mb-4">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Member Since</span>
                <span>{authUser.createdAt?.split("T")[0]}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Account Status</span>
                <span className="text-green-500">Active</span>
              </div>
            </div>
          </div>
      </div>
   
           
    
    </div>
  );
}

export default ProfilePage;
