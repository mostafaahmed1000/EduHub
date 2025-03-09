import { Module } from '@/app/types'
import { ChevronRight } from 'lucide-react'

interface ModuleNavPanelProps {
  modules: Module[];
  activeModule?: number;
  onModuleSelect: (moduleOrder: number) => void;
}

export default function ModuleNavPanel({ modules, activeModule, onModuleSelect }: ModuleNavPanelProps) {
  return (
    <div className="w-64 bg-white shadow-lg rounded-lg p-4 h-[calc(100vh-2rem)] sticky top-4 overflow-y-auto">
      <h3 className="text-lg font-semibold mb-4 px-2">Course Content</h3>
      <nav className="space-y-1">
        {modules.map((module) => (
          <button
            key={module.order}
            onClick={() => onModuleSelect(module.order)}
            className={`w-full text-left px-2 py-2 rounded-md transition-colors ${
              activeModule === module.order
                ? 'bg-gray-100 text-primary font-medium'
                : 'hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-2">
              <ChevronRight className="w-4 h-4" />
              <span>{module.title}</span>
            </div>
          </button>
        ))}
      </nav>
    </div>
  )
}
