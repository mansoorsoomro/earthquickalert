'use client';

import { Card } from '@/components/ui/card'
import { FileText, ListTodo, Settings, CheckCircle } from 'lucide-react'

interface FirstResponderToolsProps {
  onOpenAssignTask?: () => void
  onOpenSitRep?: () => void
  onOpenActivateEOC?: () => void
}

export function FirstResponderTools({ onOpenAssignTask, onOpenSitRep, onOpenActivateEOC }: FirstResponderToolsProps) {
  const tools = [
    {
      icon: FileText,
      title: 'Submit Situation Report',
      onClick: onOpenSitRep,
    },
    {
      icon: ListTodo,
      title: 'Assign Task',
      onClick: onOpenAssignTask,
    },
    {
      icon: Settings,
      title: 'Update Infrastructure Status',
      onClick: () => { },
    },
    {
      icon: CheckCircle,
      title: 'Approve Resource Activation',
      onClick: onOpenActivateEOC,
    },
  ]

  return (
    <Card className="p-6">
      <h2 className="text-lg font-bold mb-4">First Responder Tools</h2>

      <div className="grid grid-cols-2 gap-4">
        {tools.map((tool) => {
          const Icon = tool.icon
          return (
            <button
              key={tool.title}
              onClick={tool.onClick}
              className="p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <Icon className="w-5 h-5 text-gray-700 flex-shrink-0" />
                <p className="font-medium text-sm">{tool.title}</p>
              </div>
            </button>
          )
        })}
      </div>
    </Card>
  )
}
