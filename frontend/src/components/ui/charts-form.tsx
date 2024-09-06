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

const chartTypes = ["Bar", "Line", "Pie", "Scatter", "Area"];
const colorSchemes = ["Category10", "Accent", "Paired", "Set1", "Set2", "Set3"];

const defaultChartConfig = {
  chartType: "",
  width: "",
  height: "",
  margin: { top: "", right: "", bottom: "", left: "" },
  colorScheme: "",
  showLegend: false,
  showTooltip: false,
  xAxisLabel: "",
  yAxisLabel: "",
  animationDuration: "",
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
      // Ensure that margin is always an object with the expected properties
      const margin = data.chart_config?.margin || {};
      setChartConfig({
        ...defaultChartConfig,
        ...data.chart_config,
        margin: {
          top: margin.top || "",
          right: margin.right || "",
          bottom: margin.bottom || "",
          left: margin.left || "",
        },
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

  const handleMarginChange = useCallback((e) => {
    const { id, value } = e.target;
    setChartConfig(prev => ({
      ...prev,
      margin: { ...prev.margin, [id]: value }
    }));
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

  const handleReset = useCallback(() => {
    setChartConfig(defaultChartConfig);
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Card className="w-full border-none shadow-none dark:bg-transparent">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-4xl font-normal">Configure D3 Charts</CardTitle>
        <CardDescription>Customize the styling and behavior of your D3 charts.</CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="chartType">Chart Type</Label>
            <Select onValueChange={(value) => handleSelectChange("chartType", value)} value={chartConfig.chartType}>
              <SelectTrigger id="chartType">
                <SelectValue placeholder="Select a chart type" />
              </SelectTrigger>
              <SelectContent>
                {chartTypes.map((type) => (
                  <SelectItem key={type} value={type.toLowerCase()}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="width">Width (px)</Label>
              <Input
                id="width"
                type="number"
                placeholder="e.g., 800"
                value={chartConfig.width}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="height">Height (px)</Label>
              <Input
                id="height"
                type="number"
                placeholder="e.g., 400"
                value={chartConfig.height}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Margin</Label>
            <div className="grid grid-cols-2 gap-4">
              <Input
                id="top"
                placeholder="Top"
                value={chartConfig.margin.top}
                onChange={handleMarginChange}
              />
              <Input
                id="right"
                placeholder="Right"
                value={chartConfig.margin.right}
                onChange={handleMarginChange}
              />
              <Input
                id="bottom"
                placeholder="Bottom"
                value={chartConfig.margin.bottom}
                onChange={handleMarginChange}
              />
              <Input
                id="left"
                placeholder="Left"
                value={chartConfig.margin.left}
                onChange={handleMarginChange}
              />
            </div>
          </div>
          
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
              id="showTooltip"
              checked={chartConfig.showTooltip}
              onCheckedChange={() => handleSwitchChange("showTooltip")}
            />
            <Label htmlFor="showTooltip">Show Tooltip</Label>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="xAxisLabel">X-Axis Label</Label>
            <Input
              id="xAxisLabel"
              placeholder="e.g., Time"
              value={chartConfig.xAxisLabel}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="yAxisLabel">Y-Axis Label</Label>
            <Input
              id="yAxisLabel"
              placeholder="e.g., Value"
              value={chartConfig.yAxisLabel}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="animationDuration">Animation Duration (ms)</Label>
            <Input
              id="animationDuration"
              type="number"
              placeholder="e.g., 1000"
              value={chartConfig.animationDuration}
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