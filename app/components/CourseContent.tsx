import { Module } from '@/app/types'
import parse from 'html-react-parser'
import { API_ENDPOINT } from '@/app/config'
import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import ModuleNavPanel from './ModuleNavPanel'

interface CourseContentProps {
  modules: Module[];
}

const transformContent = (content: string) => {
  // Transform src and href attributes to include API_ENDPOINT
  return content.replace(
    /(src|href)="(\/media\/[^"]*)/g,
    `$1="${API_ENDPOINT}$2`
  );
};

const isImageContent = (content: string) => {
  return content.includes('<img');
};

const isIframeContent = (content: string) => {
  return content.includes('<iframe');
};

const isMediaContent = (content: string) => {
  return content.includes('<img') || content.includes('<iframe');
};

export default function CourseContent({ modules }: CourseContentProps) {
  const [expandedModules, setExpandedModules] = useState<number[]>([])

  const toggleModule = (moduleOrder: number) => {
    const isExpanding = !expandedModules.includes(moduleOrder);
    setExpandedModules(prev => 
      prev.includes(moduleOrder)
        ? prev.filter(m => m !== moduleOrder)
        : [...prev, moduleOrder]
    );

    // Only scroll when expanding
    if (isExpanding) {
      const element = document.getElementById(`module-${moduleOrder}`);
      element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  return (
    <div className="flex gap-8">
      <ModuleNavPanel 
        modules={modules}
        activeModule={expandedModules[expandedModules.length - 1]}
        onModuleSelect={toggleModule}
      />
      
      <div className="flex-1 space-y-12">
        {modules.map((module) => (
          <div 
            id={`module-${module.order}`}
            key={module.order} 
            className="bg-white rounded-lg shadow-md p-8"
          >
            <div 
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleModule(module.order)}
            >
              <div>
                <h3 className="text-2xl font-semibold mb-2">{module.title}</h3>
                <p className="text-gray-600">{module.description}</p>
              </div>
              {expandedModules.includes(module.order) ? (
                <ChevronUp className="w-6 h-6" />
              ) : (
                <ChevronDown className="w-6 h-6" />
              )}
            </div>
            
            {expandedModules.includes(module.order) && (
              <div className="space-y-8 mt-6">
                {module.contents?.map((content) => (
                  <div key={content.id} className="border-t pt-6">
                    <div className={`media-content ${
                      isImageContent(content.item) ? 'image-content' : ''
                    }`}>
                      {parse(transformContent(content.item))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
