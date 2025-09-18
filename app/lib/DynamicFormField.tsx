import React from 'react';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { FieldType } from '@prisma/client';
import { TemplateField } from './types';

interface DynamicFormFieldProps {
  field: TemplateField;
  control: Control<any>;
  errors: FieldErrors<any>;
}

export function DynamicFormField({ field, control, errors }: DynamicFormFieldProps) {
  const renderField = (onChange: (value: any) => void, value: any) => {
    switch (field.fieldType) {
      case FieldType.TEXT:
        return (
          <input
            type="text"
            placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            onChange={(e) => onChange(e.target.value)}
            value={value || ''}
          />
        );
      
      case FieldType.TEXTAREA:
        return (
          <textarea
            placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={3}
            onChange={(e) => onChange(e.target.value)}
            value={value || ''}
          />
        );
      
      case FieldType.NUMBER:
        return (
          <input
            type="number"
            placeholder={field.placeholder || '0'}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            onChange={(e) => onChange(e.target.value ? Number(e.target.value) : '')}
            value={value || ''}
          />
        );
      
      case FieldType.SELECT:
        return (
          <select 
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            onChange={(e) => onChange(e.target.value)}
            value={value || ''}
          >
            <option value="">Select an option</option>
            {field.options?.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );
      
      case FieldType.RADIO:
        return (
          <div className="space-y-2">
            {field.options?.map(option => (
              <label key={option} className="flex items-center">
                <input
                  type="radio"
                  value={option}
                  checked={value === option}
                  onChange={(e) => onChange(e.target.value)}
                  className="mr-2"
                />
                {option}
              </label>
            ))}
          </div>
        );
      
      case FieldType.CHECKBOX:
        return (
          <label className="flex items-center">
            <input 
              type="checkbox" 
              className="mr-2"
              checked={value || false}
              onChange={(e) => onChange(e.target.checked)}
            />
            {field.label}
          </label>
        );
      
      case FieldType.DATE:
        return (
          <input
            type="date"
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            onChange={(e) => onChange(e.target.value ? new Date(e.target.value) : '')}
            value={value ? new Date(value).toISOString().split('T')[0] : ''}
          />
        );
      
      default:
        return (
          <input 
            type="text" 
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            onChange={(e) => onChange(e.target.value)}
            value={value || ''}
          />
        );
    }
  };

  return (
    <div className="mb-4">
      {field.fieldType !== FieldType.CHECKBOX && (
        <label className="block text-sm font-medium mb-2 text-gray-700">
          {field.label}
          {field.isRequired && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <Controller
        name={field.id}
        control={control}
        render={({ field: controllerField }) => (
          <div>
            {renderField(controllerField.onChange, controllerField.value)}
          </div>
        )}
      />
      {/* {errors[field.id] && (
        <p className="text-red-500 text-sm mt-1">{errors[field.id]?.message}</p>
      )} */}
    </div>
  );
}