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
import { Loader2 } from "lucide-react"

type FormData = {
  topic: string;
  style: 'succinct' | 'standard' | 'in-depth';
  cadence: string;
};

type NewsletterFormProps = {
  onSubmit: (data: FormData) => Promise<void>;
};

export function NewsletterForm({ onSubmit }: NewsletterFormProps) {
  const [topic, setTopic] = React.useState("")
  const [style, setStyle] = React.useState<FormData['style']>('standard')
  const [cadence, setCadence] = React.useState("")
  const [isCreating, setIsCreating] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!topic || !style || !cadence) {
      // show an error message here
      return
    }
    setIsCreating(true)
    try {
      await onSubmit({ topic, style, cadence })
    } catch (error) {
      console.error("Error creating newsletter:", error)
      // show an error message to the user
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <Card className="w-full dark:bg-stone-800">
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
                required
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="style">Style</Label>
              <Select value={style} onValueChange={setStyle as (value: string) => void} required>
                <SelectTrigger id="style">
                  <SelectValue placeholder="Select style" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="succinct">Summary</SelectItem>
                  <SelectItem value="standard">Single-page Report</SelectItem>
                  <SelectItem value="in-depth">Multi-page Report - Experimental</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="cadence">Cadence</Label>
              <Select value={cadence} onValueChange={setCadence} required>
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
      <CardFooter className="flex justify-center">
        <Button 
          onClick={handleSubmit} 
          className="w-full"
          disabled={isCreating || !topic || !style || !cadence}
        >
          {isCreating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating newsletter...
            </>
          ) : (
            'Create Newsletter'
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}