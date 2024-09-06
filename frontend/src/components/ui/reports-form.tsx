import React, { useState, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

const fonts = [
  "Arial", "Helvetica", "Times New Roman", "Calibri", "Cambria", 
  "Georgia", "Palatino", "Garamond", "Bookman", "Trebuchet MS", 
  "Verdana", "Tahoma"
];

const bulletStyles = [
  "Circular", "Square", "Diamond", "Dash", "Arrow"
];

const colorSchemes = [
  "Professional", "Vibrant", "Monochrome", "Pastel", "Dark"
];

export function ReportsForm() {
  const [reportConfig, setReportConfig] = useState({
    font: "",
    bulletStyle: "",
    colorScheme: "",
    headerStyle: "",
    pageOrientation: "portrait",
    marginSize: "",
    // New fields for Word document generation
    documentTitle: "",
    author: "",
    subject: "",
    keywords: "",
    tableOfContents: false,
    pageNumbering: false,
    headerText: "",
    footerText: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReportConfig = async () => {
      try {
        const response = await fetch('/api/fetch-report-config');
        if (!response.ok) {
          throw new Error('Failed to fetch report configuration');
        }
        const data = await response.json();
        setReportConfig(data.report_config || {
          font: "",
          bulletStyle: "",
          colorScheme: "",
          headerStyle: "",
          pageOrientation: "portrait",
          marginSize: "",
          documentTitle: "",
          author: "",
          subject: "",
          keywords: "",
          tableOfContents: false,
          pageNumbering: false,
          headerText: "",
          footerText: "",
        });
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReportConfig();
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setReportConfig(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (key, value) => {
    setReportConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleRadioChange = (value) => {
    setReportConfig(prev => ({ ...prev, pageOrientation: value }));
  };

  const handleSwitchChange = (key) => {
    setReportConfig(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/save-report-config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ report_config: reportConfig }),
      });

      if (!response.ok) {
        throw new Error('Failed to update report configuration');
      }

      toast.success("Report configuration updated successfully");
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setReportConfig({
      font: "",
      bulletStyle: "",
      colorScheme: "",
      headerStyle: "",
      pageOrientation: "portrait",
      marginSize: "",
      documentTitle: "",
      author: "",
      subject: "",
      keywords: "",
      tableOfContents: false,
      pageNumbering: false,
      headerText: "",
      footerText: "",
    });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Card className="w-full border-none shadow-none dark:bg-transparent">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-4xl font-normal">Configure Reports</CardTitle>
        <CardDescription>Customize the styling of your reports and Word document settings.</CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
            <Label htmlFor="font">Font</Label>
            <Select onValueChange={(value) => handleSelectChange("font", value)} value={reportConfig.font}>
              <SelectTrigger id="font">
                <SelectValue placeholder="Select a font" />
              </SelectTrigger>
              <SelectContent>
                {fonts.map((font) => (
                  <SelectItem key={font} value={font.toLowerCase()}>
                    {font}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bulletStyle">Bullet Style</Label>
            <Select onValueChange={(value) => handleSelectChange("bulletStyle", value)} value={reportConfig.bulletStyle}>
              <SelectTrigger id="bulletStyle">
                <SelectValue placeholder="Select bullet style" />
              </SelectTrigger>
              <SelectContent>
                {bulletStyles.map((style) => (
                  <SelectItem key={style} value={style.toLowerCase()}>
                    {style}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="colorScheme">Color Scheme</Label>
            <Select onValueChange={(value) => handleSelectChange("colorScheme", value)} value={reportConfig.colorScheme}>
              <SelectTrigger id="colorScheme">
                <SelectValue placeholder="Select color scheme" />
              </SelectTrigger>
              <SelectContent>
                {colorSchemes.map((scheme) => (
                  <SelectItem key={scheme} value={scheme.toLowerCase()}>
                    {scheme}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="headerStyle">Header Style</Label>
            <Input
              id="headerStyle"
              placeholder="e.g., Bold 16pt Uppercase"
              value={reportConfig.headerStyle}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Page Orientation</Label>
            <RadioGroup value={reportConfig.pageOrientation} onValueChange={handleRadioChange}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="portrait" id="portrait" />
                <Label htmlFor="portrait">Portrait</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="landscape" id="landscape" />
                <Label htmlFor="landscape">Landscape</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="marginSize">Margin Size (in inches)</Label>
            <Input
              id="marginSize"
              type="number"
              placeholder="e.g., 1"
              min="0"
              step="0.1"
              value={reportConfig.marginSize}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="documentTitle">Document Title</Label>
            <Input
              id="documentTitle"
              placeholder="Enter document title"
              value={reportConfig.documentTitle}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="author">Author</Label>
            <Input
              id="author"
              placeholder="Enter author name"
              value={reportConfig.author}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              placeholder="Enter document subject"
              value={reportConfig.subject}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="keywords">Keywords</Label>
            <Input
              id="keywords"
              placeholder="Enter keywords, separated by commas"
              value={reportConfig.keywords}
              onChange={handleInputChange}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="tableOfContents"
              checked={reportConfig.tableOfContents}
              onCheckedChange={() => handleSwitchChange("tableOfContents")}
            />
            <Label htmlFor="tableOfContents">Include Table of Contents</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="pageNumbering"
              checked={reportConfig.pageNumbering}
              onCheckedChange={() => handleSwitchChange("pageNumbering")}
            />
            <Label htmlFor="pageNumbering">Include Page Numbering</Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="headerText">Header Text</Label>
            <Input
              id="headerText"
              placeholder="Enter header text"
              value={reportConfig.headerText}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="footerText">Footer Text</Label>
            <Input
              id="footerText"
              placeholder="Enter footer text"
              value={reportConfig.footerText}
              onChange={handleInputChange}
            />
          </div>
        </form>
      </CardContent>
      <CardFooter className="px-0 pb-0 pt-4 flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={handleReset}>Reset to Default</Button>
        <Button type="submit" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Configuration'}
        </Button>
      </CardFooter>
    </Card>
  );
}