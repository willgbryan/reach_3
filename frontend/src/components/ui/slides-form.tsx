import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileUpload } from "@/components/cult/file-upload";
import { toast } from "sonner";

export function SlidesForm() {
  const [files, setFiles] = useState<File[]>([]);
  const [themeName, setThemeName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [themeNameError, setThemeNameError] = useState("");

  const handleFileUpload = (uploadedFiles: File[]) => {
    setFiles(uploadedFiles);
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
      toast.success("Upload successful:", result);
      setFiles([]);
      setThemeName("");
    } catch (error) {
      toast.error("Error uploading file:", error);
      alert("Failed to upload file. Please try again.");
    } finally {
      setIsUploading(false);
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
            <Input 
              id="theme-name" 
              placeholder="Enter theme name (letters, numbers, underscores only)"
              value={themeName}
              onChange={handleThemeNameChange}
              required
            />
            {themeNameError && (
              <p className="text-sm text-red-500">{themeNameError}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label>Upload Slides</Label>
            <div className="w-full border border-dashed bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 rounded-lg">
              <FileUpload onChange={handleFileUpload} />
            </div>
          </div>
          <CardFooter className="px-0 pb-0 pt-4 flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => {setFiles([]); setThemeName(""); setThemeNameError("");}}>Cancel</Button>
            <Button type="submit" disabled={isUploading || !!themeNameError}>
              {isUploading ? "Uploading..." : "Add Theme"}
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}