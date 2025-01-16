import React, { useState } from 'react';
import ProfessionalSlide from '../../../../shared/assets/imgs/professtional.png';
import FunnySlide from '../../../../shared/assets/imgs/fun.png';
import DarkSlide from '../../../../shared/assets/imgs/dark.png';

interface Template {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  imageUrl: string;
}

interface TemplateGalleryProps {
  onSelect?: (template: Template) => void;
}

const templates: Template[] = [
  {
    id: '16r2x1rIf8aKPPbN2O3R7eilJQMsoo4BbbxdFgEpa8-k',
    title: 'Professional Theme',
    subtitle: 'Clean and Sophisticated Design',
    description:
      'Create a polished, modern presentation that exudes confidence and expertise perfect for business or academic settings.',
    imageUrl: ProfessionalSlide
  },
  {
    id: '1m6XtGs83nobVBd2M32uq_QL8LEyIgvIYlQXRlXndAGA',
    title: 'Funny Theme',
    subtitle: 'Lighthearted and Whimsical Approach',
    description:
      'Engage your audience with playful visuals, witty text, and a laid-back style. Great for entertaining or casual topics.',
    imageUrl: FunnySlide
  },
  {
    id: '1j8uvIoAs2Ra3Bz9E_db2X4C4O8fXDAvNEFBzfZyvHQo',
    title: 'Dark Theme',
    subtitle: 'Bold, Dramatic Visuals',
    description:
      'Make a statement with high-contrast layouts and a mysterious flair—ideal for intense or creative subject matter.',
    imageUrl: DarkSlide
  }
];


const SelectTheme: React.FC<TemplateGalleryProps> = ({ onSelect }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<Template>(templates[0]);

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);
    onSelect?.(template);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      {/* Preview Section */}
      <div className="mb-12 flex flex-col items-center">
        <div className="flex gap-6 justify-center items-center">
          {/* Template Preview Card */}
          <div className="w-96 h-56 rounded-lg overflow-hidden">
            <div 
              className="w-full h-full bg-cover bg-center border-2 border-gray-200"
              style={{ backgroundImage: `url(${selectedTemplate.imageUrl})` }}
            >
            </div>
          </div>

          {/* Template Details */}
          <div className="flex-1">
            <div className="text-sm text-gray-500">{selectedTemplate.subtitle}</div>
            <h2 className="text-2xl font-medium mb-2">{selectedTemplate.title}</h2>
            <p className="text-gray-600 mb-4">{selectedTemplate.description}</p>
            <button className="inline-flex items-center text-blue-600 hover:text-blue-700">
              <span className="mr-2">Edit theme</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Template Grid */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-4">Pick a style</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {templates.map((template) => (
            <button
              key={template.id}
              onClick={() => handleTemplateSelect(template)}
              className={`
                relative w-full aspect-video rounded-lg overflow-hidden 
                transition-all duration-200 hover:ring-2 hover:ring-blue-500
                ${selectedTemplate.id === template.id ? 'ring-2 ring-blue-600' : 'ring-1 ring-gray-200'}
              `}
            >
              <div 
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${template.imageUrl})` }}
              >
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SelectTheme;