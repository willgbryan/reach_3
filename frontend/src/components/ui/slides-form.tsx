import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileUpload } from "@/components/cult/file-upload";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface Theme {
  name: string;
  path: string;
}

export function SlidesForm() {
  const [files, setFiles] = useState<File[]>([]);
  const [themeName, setThemeName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [themeNameError, setThemeNameError] = useState("");
  const [themes, setThemes] = useState<Theme[]>([]);
  const [selectedTheme, setSelectedTheme] = useState("");
  const [isSettingFavorite, setIsSettingFavorite] = useState(false);
  const [favoriteTheme, setFavoriteTheme] = useState("");

  useEffect(() => {
    fetchThemes();
    fetchFavoriteTheme();
  }, []);

  const fetchThemes = async () => {
    try {
      const response = await fetch("/api/fetch-user-themes");
      if (!response.ok) {
        throw new Error("Failed to fetch themes");
      }
      const data: { themes: Theme[] } = await response.json();
      setThemes(data.themes);
    } catch (error) {
      console.error("Error fetching themes:", error);
    }
  };

  const fetchFavoriteTheme = async () => {
    try {
      const response = await fetch("/api/fetch-favorite-theme");
      if (!response.ok) {
        throw new Error("Failed to fetch favorite theme");
      }
      const data = await response.json();
      setFavoriteTheme(data.favoriteTheme);
      setSelectedTheme(data.favoriteTheme);
    } catch (error) {
      console.error("Error fetching favorite theme:", error);
    }
  };

  const handleFileUpload = (uploadedFiles: File[]) => {
    const pptxFiles = uploadedFiles.filter(file => file.name.endsWith('.pptx'));
    setFiles(pptxFiles);
    if (pptxFiles.length < uploadedFiles.length) {
      alert("Only .pptx files are allowed. Non-pptx files were removed.");
    }
  };

  const validateThemeName = (name: string) => {
    const regex = /^[a-zA-Z0-9_]+$/;
    if (!regex.test(name)) {
      setThemeNameError("Theme name can only contain letters, numbers, and underscores.");
      return false;
    }
    setThemeNameError("");
    return true;
  };

  const handleThemeNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value.replace(/[^a-zA-Z0-9_]/g, '');
    setThemeName(newName);
    validateThemeName(newName);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0 || !themeName) {
      alert("Please provide a theme name and upload a file.");
      return;
    }

    if (!validateThemeName(themeName)) {
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", files[0]);
    formData.append("themeName", themeName);

    try {
      const response = await fetch("/api/upload-slide-theme", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const result = await response.json();
      console.log("Upload successful:", result);
      fetchThemes();  // Refresh the themes list
      setFiles([]);
      setThemeName("");
      toast.success("Theme uploaded successfully");
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Failed to upload file. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSetFavorite = async () => {
    if (!selectedTheme) {
      toast.error("Please select a theme first");
      return;
    }

    setIsSettingFavorite(true);

    try {
      const response = await fetch("/api/set-favorite-theme", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ favorite_theme: selectedTheme }),
      });

      if (!response.ok) {
        throw new Error("Failed to set favorite theme");
      }

      setFavoriteTheme(selectedTheme);
      toast.success("Favorite theme set successfully");
    } catch (error) {
      console.error("Error setting favorite theme:", error);
      toast.error("Failed to set favorite theme. Please try again.");
    } finally {
      setIsSettingFavorite(false);
    }
  };

  return (
    <Card className="w-full border-none shadow-none dark:bg-transparent">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-4xl font-normal">Configure Slide Theme</CardTitle>
        <CardDescription>Provide an example deck and Heighliner will handle the rest.</CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="theme-name">Theme Name</Label>
            <div className="flex space-x-2">
              <Input 
                id="theme-name" 
                placeholder="Enter theme name (letters, numbers, underscores only)"
                value={themeName}
                onChange={handleThemeNameChange}
                required
              />
              <Button type="submit" disabled={isUploading || !!themeNameError}>
                {isUploading ? "Uploading..." : "Add Theme"}
              </Button>
            </div>
            {themeNameError && (
              <p className="text-sm text-red-500">{themeNameError}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label>Upload Slides (.pptx only)</Label>
            <div className="w-full border border-dashed bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 rounded-lg">
              <FileUpload onChange={handleFileUpload} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="select-theme">Set Favorite Theme</Label>
            <div className="flex space-x-2">
              <Select onValueChange={setSelectedTheme} value={selectedTheme}>
                <SelectTrigger id="select-theme">
                  <SelectValue placeholder="Choose a theme" />
                </SelectTrigger>
                <SelectContent>
                  {themes.map((theme) => (
                    <SelectItem key={theme.path} value={theme.path}>
                      {theme.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button 
                type="button" 
                onClick={handleSetFavorite} 
                disabled={isSettingFavorite || !selectedTheme}
              >
                {isSettingFavorite ? "Setting..." : "Set Favorite"}
              </Button>
            </div>
          </div>
          {favoriteTheme && (
            <p className="text-sm text-green-500">
              Current favorite theme: {themes.find(theme => theme.path === favoriteTheme)?.name || favoriteTheme}
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}