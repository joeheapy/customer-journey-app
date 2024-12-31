import { useState } from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  // CardDescription,
  CardContent,
} from './ui/card'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import { Edit, Save } from 'lucide-react'
import type { JourneyStep } from '@/lib/types'

interface JourneyStepsProps {
  steps: JourneyStep[]
  onUpdate?: (updatedSteps: JourneyStep[]) => void
}

export default function JourneySteps({ steps, onUpdate }: JourneyStepsProps) {
  const [editableSteps, setEditableSteps] = useState(steps)
  const [editingId, setEditingId] = useState<string | null>(null)

  const handleEdit = (id: string) => {
    setEditingId(id)
  }

  const handleSave = (id: string) => {
    const updatedStep = editableSteps.find((step) => step.id === id)
    if (updatedStep) {
      const newSteps = editableSteps.map((step) =>
        step.id === id ? updatedStep : step
      )
      setEditableSteps(newSteps)
      onUpdate?.(newSteps)
    }
    setEditingId(null)
  }

  const handleChange = (
    id: string,
    field: 'title' | 'description',
    value: string
  ) => {
    setEditableSteps(
      steps.map((step) => (step.id === id ? { ...step, [field]: value } : step))
    )
  }

  return (
    <div className="flex overflow-x-auto gap-4 py-4 px-2">
      {editableSteps.map((step, index) => (
        <Card key={step.id} className="flex-shrink-0 w-[250px] h-auto">
          <CardHeader className="flex flex-row items-start justify-between space-y-0">
            {editingId === step.id ? (
              <Textarea
                value={step.title}
                onChange={(e) => handleChange(step.id, 'title', e.target.value)}
                className="font-semibold resize-none"
              />
            ) : (
              <CardTitle>
                {index + 1}: {step.title}
              </CardTitle>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                editingId === step.id
                  ? handleSave(step.id)
                  : handleEdit(step.id)
              }
            >
              {editingId === step.id ? (
                <Save className="h-4 w-4" />
              ) : (
                <Edit className="h-4 w-4" />
              )}
            </Button>
          </CardHeader>
          <CardContent>
            {editingId === step.id ? (
              <Textarea
                value={step.description}
                onChange={(e) =>
                  handleChange(step.id, 'description', e.target.value)
                }
                className="w-full min-h-[200px]"
              />
            ) : (
              <p className="text-gray-600 whitespace-pre-wrap">
                {step.description}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
