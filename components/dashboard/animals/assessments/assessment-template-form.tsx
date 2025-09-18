"use client";

import React, { useState, FC } from 'react';

// --- TYPESCRIPT DEFINITIONS ---
// Defines the structure for a single field/question within a template.
type TemplateField = {
  id: string;
  label: string;
  fieldType: 'TEXT' | 'SELECT' | 'NUMBER';
  placeholder: string;
  options: string[]; // For SELECT type
  redFlags: string[]; // For SELECT type
  isRequired: boolean;
};

// Defines the overall structure for the assessment template being built.
type AssessmentTemplate = {
  name: string;
  description: string;
  allowCustomFields: boolean;
  fields: TemplateField[];
};

// --- HELPER ICONS (Inline SVGs to avoid dependencies) ---
const PlusIcon: FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14"/><path d="M12 5v14"/></svg>
);

const GripVerticalIcon: FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="9" cy="12" r="1"/><circle cx="9" cy="5" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="19" r="1"/></svg>
);

const TrashIcon: FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
);


// --- MAIN TEMPLATE CREATOR COMPONENT ---
export default function AssessmentTemplateCreator() {
  // --- STATE MANAGEMENT ---
  const [template, setTemplate] = useState<AssessmentTemplate>({
    name: 'Post-Surgery Daily Check',
    description: 'To be completed once daily for 7 days following any surgical procedure.',
    allowCustomFields: true,
    fields: [
      { id: crypto.randomUUID(), label: 'Incision Site Appearance', fieldType: 'SELECT', placeholder: '', options: ['Clean and Dry', 'Minor Redness', 'Swelling', 'Discharge'], redFlags: ['Swelling', 'Discharge'], isRequired: true },
      { id: crypto.randomUUID(), label: 'Appetite Level', fieldType: 'SELECT', placeholder: '', options: ['Normal', 'Decreased', 'Not Eaten'], redFlags: ['Not Eaten'], isRequired: true },
    ],
  });

  // --- EVENT HANDLERS ---
  const handleTemplateChange = (key: keyof AssessmentTemplate, value: string | boolean) => {
    setTemplate(prev => ({ ...prev, [key]: value }));
  };

  const handleFieldChange = (id: string, key: keyof TemplateField, value: string | boolean | string[]) => {
    setTemplate(prev => ({
      ...prev,
      fields: prev.fields.map(field =>
        field.id === id ? { ...field, [key]: value } : field
      ),
    }));
  };

  const addField = () => {
    const newField: TemplateField = {
      id: crypto.randomUUID(),
      label: '',
      fieldType: 'TEXT',
      placeholder: '',
      options: [],
      redFlags: [],
      isRequired: true,
    };
    setTemplate(prev => ({ ...prev, fields: [...prev.fields, newField] }));
  };

  const removeField = (id: string) => {
    setTemplate(prev => ({ ...prev, fields: prev.fields.filter(field => field.id !== id) }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Saving Template:", JSON.stringify(template, null, 2));
    alert("Template saved! Check the browser console for the data payload.");
  };

  // --- RENDER ---
  return (
    <div className="p-4 sm:p-6 md:p-8 bg-muted/40 font-sans">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Create New Assessment Template</h1>
          <p className="text-muted-foreground mt-2">Design a standardized form for staff to complete during assessments.</p>
        </div>

        {/* Template Details Section */}
        <fieldset className="space-y-6 p-6 bg-card rounded-lg border">
          <legend className="text-lg font-semibold -ml-2 px-2">Template Details</legend>
          <div className="space-y-1.5">
            <label htmlFor="templateName" className="text-sm font-medium">Template Name</label>
            <input id="templateName" type="text" value={template.name} onChange={e => handleTemplateChange('name', e.target.value)} placeholder="e.g., Post-Surgery Daily Check" className="form-input w-full h-10 rounded-md border border-input px-3 text-sm" />
            <p className="text-xs text-muted-foreground">This is what staff will see in the dropdown list.</p>
          </div>
          <div className="space-y-1.5">
            <label htmlFor="templateDescription" className="text-sm font-medium">Description</label>
            <textarea id="templateDescription" value={template.description} onChange={e => handleTemplateChange('description', e.target.value)} placeholder="A brief explanation of when to use this template." className="form-textarea w-full min-h-[80px] rounded-md border border-input px-3 py-2 text-sm" />
          </div>
          <div className="flex items-center space-x-2">
            <input type="checkbox" id="allowCustomFields" checked={template.allowCustomFields} onChange={e => handleTemplateChange('allowCustomFields', e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-ring" />
            <label htmlFor="allowCustomFields" className="text-sm font-medium">Allow staff to add custom fields to this assessment.</label>
          </div>
        </fieldset>

        {/* Form Fields Section */}
        <fieldset className="space-y-6">
          <legend className="text-lg font-semibold">Form Fields</legend>
          <div className="p-6 bg-card rounded-lg border space-y-6">
            {template.fields.map((field, index) => (
              <div key={field.id} className="p-4 border rounded-md bg-background relative group">
                <div className="absolute -left-8 top-4 hidden md:flex">
                    <GripVerticalIcon className="h-5 w-5 text-muted-foreground cursor-grab group-hover:opacity-100 opacity-0 transition-opacity" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor={`field-label-${index}`} className="text-sm font-medium">Field Label</label>
                    <input id={`field-label-${index}`} type="text" value={field.label} onChange={e => handleFieldChange(field.id, 'label', e.target.value)} className="form-input mt-1.5 w-full h-10 rounded-md border border-input px-3 text-sm" />
                  </div>
                  <div>
                    <label htmlFor={`field-type-${index}`} className="text-sm font-medium">Field Type</label>
                    <select id={`field-type-${index}`} value={field.fieldType} onChange={e => handleFieldChange(field.id, 'fieldType', e.target.value)} className="form-select mt-1.5 w-full h-10 rounded-md border border-input px-3 text-sm">
                      <option value="TEXT">Text Input</option>
                      <option value="SELECT">Dropdown Select</option>
                      <option value="NUMBER">Number Input</option>
                    </select>
                  </div>
                </div>
                {field.fieldType === 'SELECT' && (
                  <div className="mt-6 space-y-6">
                    <div>
                      <label htmlFor={`field-options-${index}`} className="text-sm font-medium">Options</label>
                      <input id={`field-options-${index}`} type="text" value={field.options.join(', ')} onChange={e => handleFieldChange(field.id, 'options', e.target.value.split(',').map(s => s.trim()))} className="form-input mt-1.5 w-full h-10 rounded-md border border-input px-3 text-sm" />
                      <p className="text-xs text-muted-foreground mt-1.5">Enter comma-separated values (e.g., Option 1, Option 2).</p>
                    </div>
                     <div>
                      <label htmlFor={`field-redflags-${index}`} className="text-sm font-medium">Red Flag Options <span className="text-muted-foreground">(Optional)</span></label>
                      <input id={`field-redflags-${index}`} type="text" value={field.redFlags.join(', ')} onChange={e => handleFieldChange(field.id, 'redFlags', e.target.value.split(',').map(s => s.trim()))} className="form-input mt-1.5 w-full h-10 rounded-md border border-input px-3 text-sm" />
                      <p className="text-xs text-muted-foreground mt-1.5">Which options should trigger an alert? Must match an option above.</p>
                    </div>
                  </div>
                )}
                <div className="absolute -right-3 -top-3">
                    <button type="button" onClick={() => removeField(field.id)} className="p-1.5 bg-destructive rounded-full text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                        <TrashIcon className="h-4 w-4" />
                    </button>
                </div>
              </div>
            ))}
            <button type="button" onClick={addField} className="w-full h-12 btn btn-outline border-dashed hover:border-solid bg-transparent">
              <PlusIcon className="mr-2 h-4 w-4" /> Add Another Field
            </button>
          </div>
        </fieldset>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-6 border-t">
          <button type="button" className="btn btn-outline px-6 h-10">Cancel</button>
          <button type="submit" className="btn btn-primary px-6 h-10 bg-primary text-primary-foreground hover:bg-primary/90">Save Template</button>
        </div>
      </form>
    </div>
  );
}
