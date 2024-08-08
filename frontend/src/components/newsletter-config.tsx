import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function NewsletterForm({ onSubmit }) {
  const [topic, setTopic] = React.useState("")
  const [style, setStyle] = React.useState("")
  const [cadence, setCadence] = React.useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({ topic, style, cadence })
  }

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Create Newsletter</CardTitle>
        <CardDescription>Set up your automated newsletter.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="topic">Topic</Label>
              <Input 
                id="topic" 
                placeholder="Newsletter topic" 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="style">Style</Label>
              <Select value={style} onValueChange={setStyle}>
                <SelectTrigger id="style">
                  <SelectValue placeholder="Select style" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="succinct">Succinct</SelectItem>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="in-depth">In-Depth</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="cadence">Cadence</Label>
              <Select value={cadence} onValueChange={setCadence}>
                <SelectTrigger id="cadence">
                  <SelectValue placeholder="Select cadence" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => onSubmit(null)}>Cancel</Button>
        <Button onClick={handleSubmit}>Create</Button>
      </CardFooter>
    </Card>
  )
}