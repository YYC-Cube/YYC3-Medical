"use client"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTranslation } from "@/hooks/use-translation"
import { zhCN } from "date-fns/locale"
import { CalendarIcon, Filter, X } from "lucide-react"
import { useState } from "react"

export interface FilterField {
  id: string
  label: string
  type: "text" | "select" | "date" | "number" | "boolean"
  options?: { value: string; label: string }[]
}

interface FilterValue {
  fieldId: string
  value: any
  operator?: string
}

interface DataFilterProps {
  fields: FilterField[]
  onFilterChange: (filters: FilterValue[]) => void
  className?: string
}

export function DataFilter({ fields, onFilterChange, className = "" }: DataFilterProps) {
  const [filters, setFilters] = useState<FilterValue[]>([])
  const [currentField, setCurrentField] = useState<string>("")
  const [currentValue, setCurrentValue] = useState<any>("")
  const [currentOperator, setCurrentOperator] = useState<string>("eq")
  const { tSync } = useTranslation()

  useEffectSync(() => {
    onFilterChange(filters)
  }, [filters, onFilterChange])

  const addFilter = () => {
    if (!currentField || currentValue === "") return

    const field = fields.find((f) => f.id === currentField)
    if (!field) return

    setFilters([
      ...filters,
      {
        fieldId: currentField,
        value: currentValue,
        operator: currentOperator,
      },
    ])

    setCurrentField("")
    setCurrentValue("")
    setCurrentOperator("eq")
  }

  const removeFilter = (index: number) => {
    const newFilters = [...filters]
    newFilters.splice(index, 1)
    setFilters(newFilters)
  }

  const getOperatorOptions = (fieldType: string) => {
    switch (fieldType) {
      case "text":
        return [
          { value: "eq", label: tSync("equals") },
          { value: "contains", label: tSync("contains") },
          { value: "startsWith", label: tSync("startsWith") },
          { value: "endsWith", label: tSync("endsWith") },
        ]
      case "number":
        return [
          { value: "eq", label: tSync("equals") },
          { value: "gt", label: tSync("greaterThan") },
          { value: "lt", label: tSync("lessThan") },
          { value: "gte", label: tSync("greaterThanOrEqual") },
          { value: "lte", label: tSync("lessThanOrEqual") },
        ]
      case "date":
        return [
          { value: "eq", label: tSync("equals") },
          { value: "gt", label: tSync("after") },
          { value: "lt", label: tSync("before") },
          { value: "between", label: tSync("between") },
        ]
      default:
        return [{ value: "eq", label: tSync("equals") }]
    }
  }

  const renderValueInput = () => {
    const field = fields.find((f) => f.id === currentField)
    if (!field) return null

    switch (field.type) {
      case "select":
        return (
          <Select value={currentValue} onValueChange={setCurrentValue}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={tSync("selectValue")} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      case "date":
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {currentValue ? formatSync(currentValue, "PPP", { locale: zhCN }) : tSync("selectDate")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={currentValue} onSelect={setCurrentValue} initialFocus />
            </PopoverContent>
          </Popover>
        )
      case "number":
        return (
          <Input
            type="number"
            value={currentValue}
            onChange={(e) => setCurrentValue(e.target.value)}
            placeholder={tSync("enterValue")}
          />
        )
      case "boolean":
        return (
          <Select value={currentValue} onValueChange={setCurrentValue}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={tSync("selectValue")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">{tSync("yes")}</SelectItem>
              <SelectItem value="false">{tSync("no")}</SelectItem>
            </SelectContent>
          </Select>
        )
      default:
        return (
          <Input
            type="text"
            value={currentValue}
            onChange={(e) => setCurrentValue(e.target.value)}
            placeholder={tSync("enterValue")}
          />
        )
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex flex-wrap gap-2">
        {filters.map((filter, index) => {
          const field = fields.find((f) => f.id === filter.fieldId)
          if (!field) return null

          const operatorLabel = getOperatorOptions(field.type).find((op) => op.value === filter.operator)?.label

          let valueDisplay = filter.value
          if (field.type === "date" && filter.value instanceof Date) {
            valueDisplay = formatSync(filter.value, "yyyy-MM-dd")
          } else if (field.type === "select") {
            valueDisplay = field.options?.find((opt) => opt.value === filter.value)?.label || filter.value
          } else if (field.type === "boolean") {
            valueDisplay = filter.value === "true" ? tSync("yes") : tSync("no")
          }

          return (
            <div key={index} className="flex items-center gap-1 bg-muted px-3 py-1 rounded-full text-sm">
              <span className="font-medium">{field.label}</span>
              <span className="text-muted-foreground">{operatorLabel}</span>
              <span>{valueDisplay}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-5 w-5 p-0 rounded-full"
                onClick={() => removeFilter(index)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )
        })}
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="w-full sm:w-auto">
          <Label htmlFor="filter-field">{tSync("field")}</Label>
          <Select value={currentField} onValueChange={setCurrentField}>
            <SelectTrigger id="filter-field" className="w-full sm:w-[180px]">
              <SelectValue placeholder={tSync("selectField")} />
            </SelectTrigger>
            <SelectContent>
              {fields.map((field) => (
                <SelectItem key={field.id} value={field.id}>
                  {field.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {currentField && (
          <>
            <div className="w-full sm:w-auto">
              <Label htmlFor="filter-operator">{tSync("operator")}</Label>
              <Select value={currentOperator} onValueChange={setCurrentOperator}>
                <SelectTrigger id="filter-operator" className="w-full sm:w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {getOperatorOptions(fields.find((f) => f.id === currentField)?.type || "text").map((op) => (
                    <SelectItem key={op.value} value={op.value}>
                      {op.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-full sm:w-auto">
              <Label htmlFor="filter-value">{tSync("value")}</Label>
              <div className="mt-2">{renderValueInputSync()}</div>
            </div>

            <div className="flex items-end">
              <Button onClick={addFilter} className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span>{tSync("addFilter")}</span>
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
