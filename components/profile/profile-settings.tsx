"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea" // Added for bio
import { supabase } from "@/lib/supabase" // Added for avatar upload
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { User, Lock, Moon } from "lucide-react"
import { useUser } from "@/context/user-context"
import { useState } from "react"
import { toast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function ProfileSettings() {
  const { user, updateProfile, updatePreferences } = useUser()

  // Add safe fallbacks for preferences
  const safeTheme = user?.preferences?.theme || "system"
  const safeLanguage = user?.preferences?.language || "en"

  const [profile, setProfile] = useState({
    name: user?.name || "",
    email: user?.email || "",
    age: user?.age || undefined,
    height: user?.height || undefined,
    weight: user?.weight || undefined,
    gender: user?.gender || "",
    bio: user?.bio || "",
    avatar_url: user?.avatar_url || null,
  })
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

  const [theme, setTheme] = useState(safeTheme)
  const [language, setLanguage] = useState(safeLanguage)

  const handleProfileChange = (key: string, value: string | number | null) => {
    setProfile((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleSaveProfile = async () => {
    try {
      setUploading(true);
      const updatesToSend: Record<string, any> = {};

      // 1. Avatar Handling
      let finalAvatarUrl = user?.avatar_url || null; // Start with original or null
      if (avatarFile && user?.id) {
        const fileExtension = avatarFile.name.split('.').pop();
        const filePath = `${user.id}/${user.id}-${Date.now()}.${fileExtension}`;
        
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, avatarFile, { upsert: true });

        if (uploadError) {
          console.error('Error uploading avatar:', uploadError);
          toast({ title: 'Error', description: `Avatar upload failed: ${uploadError.message}`, variant: 'destructive' });
          setUploading(false);
          return;
        }
        const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(filePath);
        finalAvatarUrl = publicUrlData.publicUrl;
      }

      // Only add avatar_url to updates if it has actually changed
      if (finalAvatarUrl !== (user?.avatar_url || null)) {
        updatesToSend.avatar_url = finalAvatarUrl;
      }

      // 2. Other profile fields
      const currentProfileState = profile; // Current values from the form inputs

      // Name
      const originalName = user?.name || "";
      if (currentProfileState.name !== originalName && currentProfileState.name.trim() !== "") {
        updatesToSend.name = currentProfileState.name;
      }

      // Age
      const currentAgeInput = currentProfileState.age;
      const currentAge = (currentAgeInput === "" || currentAgeInput === undefined || currentAgeInput === null) ? null : Number(currentAgeInput);
      const originalAge = (user?.age === undefined || user?.age === null) ? null : Number(user.age);
      if (currentAge !== originalAge && currentAge !== null) { // Only update if changed and not empty
        updatesToSend.age = currentAge;
      }

      // Height
      const currentHeightInput = currentProfileState.height;
      const currentHeight = (currentHeightInput === "" || currentHeightInput === undefined || currentHeightInput === null) ? null : Number(currentHeightInput);
      const originalHeight = (user?.height === undefined || user?.height === null) ? null : Number(user.height);
      if (currentHeight !== originalHeight && currentHeight !== null) { // Only update if changed and not empty
        updatesToSend.height = currentHeight;
      }

      // Weight
      const currentWeightInput = currentProfileState.weight;
      const currentWeight = (currentWeightInput === "" || currentWeightInput === undefined || currentWeightInput === null) ? null : Number(currentWeightInput);
      const originalWeight = (user?.weight === undefined || user?.weight === null) ? null : Number(user.weight);
      if (currentWeight !== originalWeight && currentWeight !== null) { // Only update if changed and not empty
        updatesToSend.weight = currentWeight;
      }
      
      // Gender
      const originalGender = user?.gender || "";
      if (currentProfileState.gender !== originalGender && currentProfileState.gender !== "") {
        updatesToSend.gender = currentProfileState.gender;
      }

      // Bio
      const originalBio = user?.bio || "";
      if (currentProfileState.bio !== originalBio && currentProfileState.bio.trim() !== "") {
        updatesToSend.bio = currentProfileState.bio;
      }
      
      if (Object.keys(updatesToSend).length > 0) {
        await updateProfile(updatesToSend); 
        toast({
          title: "Profile updated",
          description: "Your profile information has been successfully updated.",
        });
      } else {
        toast({
          title: "No changes",
          description: "No information was changed, or fields were left empty.",
        });
      }

    } catch (error) {
      console.error("Error updating profile:", error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
      toast({
        title: "Error",
        description: `Failed to update profile: ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      // Do not reset avatarFile here if you want to allow retrying the same upload
      // setAvatarFile(null); 
    }
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setAvatarFile(event.target.files[0])
      // Preview image locally
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfile(prev => ({ ...prev, avatar_url: e.target?.result as string | null }))
      }
      reader.readAsDataURL(event.target.files[0])
    }
  }

  const handleSavePreferences = async () => {
    try {
      await updatePreferences({ theme: theme as any, language })
      toast({
        title: "Preferences updated",
        description: "Your app preferences have been saved.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update preferences. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center">
            <User className="h-4 w-4 mr-2 text-primary" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-center space-y-2 mb-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={profile.avatar_url || "/placeholder-user.jpg"} alt={profile.name} />
              <AvatarFallback>{profile.name?.substring(0, 2).toUpperCase() || "U"}</AvatarFallback>
            </Avatar>
            <Input id="avatar" type="file" accept="image/*" onChange={handleAvatarChange} className="text-sm" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={profile.name} onChange={(e) => handleProfileChange("name", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={profile.email} disabled />
          </div>
          <div className="space-y-2">
            <Label htmlFor="member_since">Member Since</Label>
            <Input
              id="member_since"
              value={
                profile?.member_since && !isNaN(new Date(profile.member_since).getTime())
                  ? new Date(profile.member_since).toLocaleDateString()
                  : "N/A"
              }
              disabled
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input id="age" type="number" value={profile.age === null || profile.age === undefined ? '' : profile.age} onChange={(e) => handleProfileChange("age", e.target.value ? parseInt(e.target.value) : null)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="height">Height (cm)</Label>
              <Input id="height" type="number" value={profile.height === null || profile.height === undefined ? '' : profile.height} onChange={(e) => handleProfileChange("height", e.target.value ? parseFloat(e.target.value) : null)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input id="weight" type="number" value={profile.weight === null || profile.weight === undefined ? '' : profile.weight} onChange={(e) => handleProfileChange("weight", e.target.value ? parseFloat(e.target.value) : null)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            <Select value={profile.gender || ""} onValueChange={(value) => handleProfileChange("gender", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
                <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea id="bio" value={profile.bio || ""} onChange={(e) => handleProfileChange("bio", e.target.value)} placeholder="Tell us a little about yourself" />
          </div>
          <Button className="w-full" onClick={handleSaveProfile} disabled={uploading}>
            {uploading ? "Saving..." : "Save Profile"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center">
            <Lock className="h-4 w-4 mr-2 text-primary" />
            Password
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">Current Password</Label>
            <Input id="current-password" type="password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <Input id="new-password" type="password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <Input id="confirm-password" type="password" />
          </div>
          <Button className="w-full">Change Password</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center">
            <Moon className="h-4 w-4 mr-2 text-primary" />
            Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="theme">Theme</Label>
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger>
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="language">Language</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
                <SelectItem value="fr">French</SelectItem>
                <SelectItem value="de">German</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button className="w-full" onClick={handleSavePreferences}>
            Save Preferences
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
