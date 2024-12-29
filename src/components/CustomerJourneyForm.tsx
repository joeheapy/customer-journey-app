import { useState, ChangeEvent, FormEvent } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'
import type { CustomerJourneyFormProps } from '@/lib/types'

const CustomerJourneyForm = ({
  onSubmit,
  isLoading,
}: CustomerJourneyFormProps) => {
  const [formData, setFormData] = useState({
    business_proposition: '',
    target_customers: '',
    customer_scenario: '',
    persona_name: '',
  })

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Customer Journey Generator</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="business_proposition">Business Proposition</Label>
            <Textarea
              id="business_proposition"
              name="business_proposition"
              value={formData.business_proposition}
              onChange={handleChange}
              //placeholder="Describe your business proposition"
              placeholder="Roadside recovery for electric vehicles."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="target_customers">Target Customers</Label>
            <Textarea
              id="target_customers"
              name="target_customers"
              value={formData.target_customers}
              onChange={handleChange}
              //placeholder="Describe your target customers"
              placeholder="Motorists with electric vehicles."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="customer_scenario">Customer Scenario</Label>
            <Textarea
              id="customer_scenario"
              name="customer_scenario"
              value={formData.customer_scenario}
              onChange={handleChange}
              //placeholder="Describe the specific customer journey or scenario you are designing"
              placeholder="Breaking down on a motorway in an electric vehicle."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="persona_name">Persona Name</Label>
            <Input
              id="persona_name"
              name="persona_name"
              value={formData.persona_name}
              onChange={handleChange}
              //placeholder="Enter a persona name"
              placeholder="Susan"
            />
          </div>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="animate-spin" />
            ) : (
              'Generate Journey'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

export default CustomerJourneyForm
