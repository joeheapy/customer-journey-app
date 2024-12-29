import { Download } from 'react-feather'
import { Button } from '@/components/ui/button'
import { JourneyStep } from '@/lib/types'
import { convertToCSV } from '@/lib/utils'

interface CsvDownloadButtonProps {
  journeySteps: JourneyStep[]
}

const CsvDownloadButton = ({ journeySteps }: CsvDownloadButtonProps) => {
  const handleDownload = () => {
    const csv = convertToCSV(journeySteps)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', 'customer_journey.csv')
    document.body.appendChild(link)
    link.click()
    link.parentNode?.removeChild(link)
  }

  return (
    <Button onClick={handleDownload} className="flex items-center gap-2">
      <Download className="h-4 w-4" />
      Download CSV
    </Button>
  )
}

export default CsvDownloadButton
