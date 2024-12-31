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
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Customer Journey Generator</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Column 1 */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="business_proposition">
                  Business Proposition
                </Label>
                <Textarea
                  id="business_proposition"
                  name="business_proposition"
                  value={formData.business_proposition}
                  onChange={handleChange}
                  placeholder="Roadside assistance for electric vehicles"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="target_customers">Target Customers</Label>
                <Textarea
                  id="target_customers"
                  name="target_customers"
                  value={formData.target_customers}
                  onChange={handleChange}
                  placeholder="Motorists with electric vehicles."
                />
              </div>
            </div>

            {/* Column 2 */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="customer_scenario">Customer Scenario</Label>
                <Textarea
                  id="customer_scenario"
                  name="customer_scenario"
                  value={formData.customer_scenario}
                  onChange={handleChange}
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
                  placeholder="Susan"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-2">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                'Generate Journey'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default CustomerJourneyForm
