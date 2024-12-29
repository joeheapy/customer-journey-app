export interface JourneyStep {
  id: string
  title: string
  description: string
}

export interface JourneyStepsProps {
  steps: JourneyStep[]
}

export interface FormData {
  business_proposition: string
  target_customers: string
  customer_scenario: string
  persona_name: string
}

export interface CustomerJourneyFormProps {
  onSubmit: (data: FormData) => void
  isLoading: boolean
}
