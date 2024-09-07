import React, { useState, useEffect, useCallback } from "react";
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
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

const colorSchemes = ["Earth", "Pastel", "Vibrant", "Monochrome"];

const defaultChartConfig = {
  colorScheme: "Earth",
  showLegend: true,
  showTitle: true,
  titleFontSize: "18",
  showAxisLabels: true,
};

export function ChartsForm() {
  const [chartConfig, setChartConfig] = useState(defaultChartConfig);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchChartConfig = useCallback(async () => {
    try {
      const response = await fetch('/api/fetch-chart-config');
      if (!response.ok) {
        throw new Error('Failed to fetch chart configuration');
      }
      const data = await response.json();
      setChartConfig({
        ...defaultChartConfig,
        ...data.chart_config,
      });
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchChartConfig();
  }, [fetchChartConfig]);

  const handleInputChange = useCallback((e) => {
    const { id, value } = e.target;
    setChartConfig(prev => ({ ...prev, [id]: value }));
  }, []);

  const handleSelectChange = useCallback((key, value) => {
    setChartConfig(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleSwitchChange = useCallback((key) => {
    setChartConfig(prev => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/save-chart-config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ chart_config: chartConfig }),
      });

      if (!response.ok) {
        throw new Error('Failed to update chart configuration');
      }

      toast.success("Chart configuration updated successfully");
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
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
        <CardTitle className="text-4xl font-normal">Configure Chart Styles</CardTitle>
        <CardDescription>Customize the styling behavior of your generated charts.</CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="colorScheme">Color Scheme</Label>
            <Select onValueChange={(value) => handleSelectChange("colorScheme", value)} value={chartConfig.colorScheme}>
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
          
          <div className="flex items-center space-x-2">
            <Switch
              id="showLegend"
              checked={chartConfig.showLegend}
              onCheckedChange={() => handleSwitchChange("showLegend")}
            />
            <Label htmlFor="showLegend">Show Legend</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="showTitle"
              checked={chartConfig.showTitle}
              onCheckedChange={() => handleSwitchChange("showTitle")}
            />
            <Label htmlFor="showTitle">Show Title</Label>
          </div>
          
          {chartConfig.showTitle && (
            <div className="space-y-2">
              <Label htmlFor="titleFontSize">Title Font Size</Label>
              <Input
                id="titleFontSize"
                type="number"
                placeholder="e.g., 18"
                value={chartConfig.titleFontSize}
                onChange={handleInputChange}
              />
            </div>
          )}
          
          <div className="flex items-center space-x-2">
            <Switch
              id="showAxisLabels"
              checked={chartConfig.showAxisLabels}
              onCheckedChange={() => handleSwitchChange("showAxisLabels")}
            />
            <Label htmlFor="showAxisLabels">Show Axis Labels</Label>
          </div>
        </form>
      </CardContent>
      <CardFooter className="px-0 pb-0 pt-4 flex justify-end space-x-2">
        <Button type="submit" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Configuration'}
        </Button>
      </CardFooter>
    </Card>
  );
}