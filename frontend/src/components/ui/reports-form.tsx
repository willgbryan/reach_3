import React from "react";
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
  return (
    <Card className="w-full border-none shadow-none dark:bg-transparent">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-4xl font-normal">Configure Reports</CardTitle>
        <CardDescription>Customize the styling of your reports.</CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        <form className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="font">Font</Label>
            <Select>
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
            <Label htmlFor="bullet-style">Bullet Style</Label>
            <Select>
              <SelectTrigger id="bullet-style">
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
            <Label htmlFor="color-scheme">Color Scheme</Label>
            <Select>
              <SelectTrigger id="color-scheme">
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
            <Label htmlFor="header-style">Header Style</Label>
            <Input id="header-style" placeholder="e.g., Bold 16pt Uppercase" />
          </div>
          
          <div className="space-y-2">
            <Label>Page Orientation</Label>
            <RadioGroup defaultValue="portrait">
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
            <Label htmlFor="margin-size">Margin Size (in inches)</Label>
            <Input id="margin-size" type="number" placeholder="e.g., 1" min="0" step="0.1" />
          </div>
        </form>
      </CardContent>
      <CardFooter className="px-0 pb-0 pt-4 flex justify-end space-x-2">
        <Button variant="outline">Reset to Default</Button>
        <Button>Save Configuration</Button>
      </CardFooter>
    </Card>
  );
}