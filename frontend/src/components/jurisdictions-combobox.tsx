import React, { useState } from "react"
import { Check, ChevronsUpDown, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"

const jurisdictions = [
  { value: "federal", label: "Federal" },
  { value: "1st_circuit", label: "1st Circuit" },
  { value: "2nd_circuit", label: "2nd Circuit" },
  { value: "3rd_circuit", label: "3rd Circuit" },
  { value: "4th_circuit", label: "4th Circuit" },
  { value: "5th_circuit", label: "5th Circuit" },
  { value: "6th_circuit", label: "6th Circuit" },
  { value: "7th_circuit", label: "7th Circuit" },
  { value: "8th_circuit", label: "8th Circuit" },
  { value: "9th_circuit", label: "9th Circuit" },
  { value: "10th_circuit", label: "10th Circuit" },
  { value: "11th_circuit", label: "11th Circuit" },
  { value: "dc_circuit", label: "D.C. Circuit" },
  { value: "federal_circuit", label: "Federal Circuit" },
  { value: "supreme_court", label: "Supreme Court" },
  { value: "federal", label: "Federal" },
  { value: "alabama", label: "Alabama" },
  { value: "alaska", label: "Alaska" },
  { value: "arizona", label: "Arizona" },
  { value: "arkansas", label: "Arkansas" },
  { value: "california", label: "California" },
  { value: "colorado", label: "Colorado" },
  { value: "connecticut", label: "Connecticut" },
  { value: "delaware", label: "Delaware" },
  { value: "florida", label: "Florida" },
  { value: "georgia", label: "Georgia" },
  { value: "hawaii", label: "Hawaii" },
  { value: "idaho", label: "Idaho" },
  { value: "illinois", label: "Illinois" },
  { value: "indiana", label: "Indiana" },
  { value: "iowa", label: "Iowa" },
  { value: "kansas", label: "Kansas" },
  { value: "kentucky", label: "Kentucky" },
  { value: "louisiana", label: "Louisiana" },
  { value: "maine", label: "Maine" },
  { value: "maryland", label: "Maryland" },
  { value: "massachusetts", label: "Massachusetts" },
  { value: "michigan", label: "Michigan" },
  { value: "minnesota", label: "Minnesota" },
  { value: "mississippi", label: "Mississippi" },
  { value: "missouri", label: "Missouri" },
  { value: "montana", label: "Montana" },
  { value: "nebraska", label: "Nebraska" },
  { value: "nevada", label: "Nevada" },
  { value: "new_hampshire", label: "New Hampshire" },
  { value: "new_jersey", label: "New Jersey" },
  { value: "new_mexico", label: "New Mexico" },
  { value: "new_york", label: "New York" },
  { value: "north_carolina", label: "North Carolina" },
  { value: "north_dakota", label: "North Dakota" },
  { value: "ohio", label: "Ohio" },
  { value: "oklahoma", label: "Oklahoma" },
  { value: "oregon", label: "Oregon" },
  { value: "pennsylvania", label: "Pennsylvania" },
  { value: "rhode_island", label: "Rhode Island" },
  { value: "south_carolina", label: "South Carolina" },
  { value: "south_dakota", label: "South Dakota" },
  { value: "tennessee", label: "Tennessee" },
  { value: "texas", label: "Texas" },
  { value: "utah", label: "Utah" },
  { value: "vermont", label: "Vermont" },
  { value: "virginia", label: "Virginia" },
  { value: "washington", label: "Washington" },
  { value: "west_virginia", label: "West Virginia" },
  { value: "wisconsin", label: "Wisconsin" },
  { value: "wyoming", label: "Wyoming" },
  { value: "district_of_columbia", label: "District of Columbia" },
]

interface MultiJurisdictionSelectorProps {
    onSelect: (values: string[]) => void
  }
  
  export function MultiJurisdictionSelector({ onSelect }: MultiJurisdictionSelectorProps) {
    const [open, setOpen] = useState(false)
    const [selectedValues, setSelectedValues] = useState<string[]>([])
  
    const handleSelect = (currentValue: string) => {
      const newSelectedValues = selectedValues.includes(currentValue)
        ? selectedValues.filter((value) => value !== currentValue)
        : [...selectedValues, currentValue]
      setSelectedValues(newSelectedValues)
      onSelect(newSelectedValues)
    }
  
    const removeJurisdiction = (valueToRemove: string) => {
      const newSelectedValues = selectedValues.filter((value) => value !== valueToRemove)
      setSelectedValues(newSelectedValues)
      onSelect(newSelectedValues)
    }
  
    return (
      <div className="flex flex-col items-start">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between"
            >
              {selectedValues.length > 0
                ? `${selectedValues.length} selected`
                : "Select jurisdictions..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent side="right" align="start" className="w-[400px] p-0">
            <Command>
              <CommandInput placeholder="Search jurisdiction..." />
              <CommandList>
                <CommandEmpty>No jurisdiction found.</CommandEmpty>
                <CommandGroup>
                  {jurisdictions.map((jurisdiction) => (
                    <CommandItem
                      key={jurisdiction.value}
                      value={jurisdiction.value}
                      onSelect={() => handleSelect(jurisdiction.value)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedValues.includes(jurisdiction.value) ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {jurisdiction.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedValues.map((value) => {
            const jurisdiction = jurisdictions.find((j) => j.value === value)
            return (
              <Badge key={value} variant="secondary" className="text-sm font-base">
                {jurisdiction?.label}
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-1 h-4 w-4 p-0"
                  onClick={() => removeJurisdiction(value)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )
          })}
        </div>
      </div>
    )
  }