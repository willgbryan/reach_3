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

export function SlidesForm() {
  const [files, setFiles] = useState<File[]>([]);
  const [themeName, setThemeName] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = (uploadedFiles: File[]) => {
    setFiles(uploadedFiles);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0 || !themeName) {
      alert("Please provide a theme name and upload a file.");
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
      // Reset form or show success message
      setFiles([]);
      setThemeName("");
    } catch (error) {
      console.error("Error uploading file:", error);
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
              placeholder="Enter theme name" 
              value={themeName}
              onChange={(e) => setThemeName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Upload Slides</Label>
            <div className="w-full border border-dashed bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 rounded-lg">
              <FileUpload onChange={handleFileUpload} />
            </div>
          </div>
          <CardFooter className="px-0 pb-0 pt-4 flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => {setFiles([]); setThemeName("");}}>Cancel</Button>
            <Button type="submit" disabled={isUploading}>
              {isUploading ? "Uploading..." : "Add Theme"}
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}