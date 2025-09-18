"use client"; // Required for Next.js App Router with client-side hooks

import React, { useState, useEffect } from 'react';
import { Plus, XCircle } from 'lucide-react';

// --- shadcn/ui Component Imports ---
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
// To use the toast, you'd also need a <Toaster /> in your layout.
// import { useToast } from "@/components/ui/use-toast";


// --- Type Definitions for TypeScript ---

// Defines the shape for a single field in the form state
type FormField = {
  id: string;
  name: string;
  value: string;
  notes: string;
  isPredefined: boolean;
  valueOptions?: readonly string[]; // Use readonly for immutable options
  placeholder?: string | null;
};

// Defines the structure of the configuration for a "strict" assessment
type PredefinedAssessmentConfig = {
  allowCustomFields: boolean;
  fields: {
    name: string;
    valueOptions?: readonly string[];
    placeholder?: string;
  }[];
};

// Defines the available keys for our predefined assessment types for type safety
type PredefinedAssessmentKey = 'INTAKE_BEHAVIORAL' | 'INTAKE_MEDICAL';

// All possible assessment types, including flexible ones
type AssessmentType = PredefinedAssessmentKey | 'DAILY_MONITORING' | 'FOSTER_UPDATE';

// --- Configuration Data (Now with TypeScript) ---
const PREDEFINED_ASSESSMENTS: Record<PredefinedAssessmentKey, PredefinedAssessmentConfig> = {
  INTAKE_BEHAVIORAL: {
    allowCustomFields: false,
    fields: [
      { name: 'Kennel Presence', valueOptions: ['Quiet', 'Anxious', 'Barking', 'Alert'] },
      { name: 'Leash Manners', valueOptions: ['Pulls Heavily', 'Pulls Moderately', 'Loose Leash', 'Walks Politely'] },
      { name: 'Handling Sensitivity (Paws)', valueOptions: ['Tolerant', 'Hesitant', 'Pulls Away', 'Mouths Hand'] },
      { name: 'Food Guarding (High Value)', valueOptions: ['None', 'Stiffens', 'Growls', 'Snaps'] },
      { name: 'Toy Possessiveness', valueOptions: ['Shares Easily', 'Reluctant to Drop', 'Guards Toy'] },
    ]
  },
  INTAKE_MEDICAL: {
    allowCustomFields: true,
    fields: [
      { name: 'Body Condition Score', placeholder: 'e.g., 5/9' },
      { name: 'Dental Health', placeholder: 'e.g., Mild Tartar' },
      { name: 'Fleas Present', valueOptions: ['Yes', 'No', 'Treated'] },
      { name: 'Heart/Lungs', placeholder: 'e.g., Clear, no murmur' },
    ]
  }
};


// --- The Main Application Component ---
export default function AssessmentForm() {
  const [assessmentType, setAssessmentType] = useState<AssessmentType>('INTAKE_BEHAVIORAL');
  const [fields, setFields] = useState<FormField[]>([]);
  const [summary, setSummary] = useState('');
  const [overallOutcome, setOverallOutcome] = useState('GOOD');
  // const { toast } = useToast(); // Optional: for better form submission feedback

  // This is the core logic: Reset and configure the form when the assessment type changes.
  useEffect(() => {
    const config = PREDEFINED_ASSESSMENTS[assessmentType as PredefinedAssessmentKey];

    if (config) {
      // It's a predefined assessment type
      const newFields: FormField[] = config.fields.map(field => ({
        id: crypto.randomUUID(),
        name: field.name,
        value: field.valueOptions ? field.valueOptions[0] : '',
        notes: '',
        isPredefined: true,
        valueOptions: field.valueOptions,
        placeholder: field.placeholder || null
      }));
      setFields(newFields);
    } else {
      // It's a flexible, custom assessment type (e.g., "Daily Monitoring")
      setFields([createEmptyField()]);
    }
    // Reset other form elements for a clean slate
    setSummary('');
    setOverallOutcome('GOOD');
  }, [assessmentType]);

  // --- Field Management Handlers ---
  const handleFieldChange = (id: string, property: keyof FormField, newValue: string) => {
    setFields(prevFields =>
      prevFields.map(field =>
        field.id === id ? { ...field, [property]: newValue } : field
      )
    );
  };
  
  const createEmptyField = (): FormField => ({
    id: crypto.randomUUID(),
    name: '',
    value: '',
    notes: '',
    isPredefined: false,
  });

  const addField = () => {
    setFields(prevFields => [...prevFields, createEmptyField()]);
  };

  const removeField = (id: string) => {
    setFields(prevFields => prevFields.filter(field => field.id !== id));
  };
    
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload = {
      animalId: '12345-buddy',
      assessmentType,
      assessorId: 'jane-doe',
      date: new Date().toISOString().split('T')[0],
      overallOutcome,
      summary,
      // Clean the fields for submission, removing internal state properties like `id`
      fields: fields.map(({ name, value, notes }) => ({ name, value, notes })) 
    };
    
    // Replace alert with a more modern notification if you have one
    alert("Form Submitted!\n\nCheck your browser's console (F12) to see the JSON payload.");
    // toast({
    //   title: "Assessment Submitted!",
    //   description: "Check the console for the JSON payload.",
    // });

    console.log("--- Payload for Server Action ---");
    console.log(JSON.stringify(payload, null, 2));
  }
    
  const currentConfig = PREDEFINED_ASSESSMENTS[assessmentType as PredefinedAssessmentKey] || { allowCustomFields: true };

  return (
    <div className="bg-background min-h-screen p-4 sm:p-6 lg:p-8 flex justify-center">
      <Card className="w-full max-w-4xl">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className="text-3xl font-bold">Hybrid Pet Assessment</CardTitle>
            <CardDescription>
              Select an assessment type to see how the form adapts for strict or flexible data entry.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-8">
            <Separator />
            {/* Main Assessment Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="pet">Pet to Assess</Label>
                <Select defaultValue="buddy">
                  <SelectTrigger id="pet">
                    <SelectValue placeholder="Select a pet" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="buddy">ID: 12345 - Buddy (Dog)</SelectItem>
                    <SelectItem value="whiskers">ID: 12346 - Whiskers (Cat)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="assessmentType">Assessment Type</Label>
                <Select value={assessmentType} onValueChange={(value: AssessmentType) => setAssessmentType(value)}>
                  <SelectTrigger id="assessmentType">
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INTAKE_BEHAVIORAL">Intake Behavioral (Strict)</SelectItem>
                    <SelectItem value="INTAKE_MEDICAL">Intake Medical (Hybrid)</SelectItem>
                    <SelectItem value="DAILY_MONITORING">Daily Monitoring (Flexible)</SelectItem>
                    <SelectItem value="FOSTER_UPDATE">Foster Update (Flexible)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Dynamic Assessment Fields Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Assessment Details</h3>
              {/* Grid Header */}
              <div className="hidden md:grid md:grid-cols-[2fr_2fr_3fr_auto] gap-4 px-1">
                <Label>Field Name</Label>
                <Label>Value</Label>
                <Label>Notes</Label>
              </div>
              {/* Fields List */}
              <div className="space-y-4">
                {fields.map((field) => (
                  <div key={field.id} className="grid grid-cols-1 md:grid-cols-[2fr_2fr_3fr_auto] gap-4 items-start">
                    {/* Field Name */}
                    <div className="space-y-1">
                       <Label htmlFor={`name-${field.id}`} className="md:hidden">Field Name</Label>
                       {field.isPredefined ? (
                          <p className="h-10 flex items-center px-3 text-sm font-medium text-muted-foreground">{field.name}</p>
                       ) : (
                          <Input
                             id={`name-${field.id}`}
                             placeholder="e.g., Reaction to dogs"
                             value={field.name}
                             onChange={(e) => handleFieldChange(field.id, 'name', e.target.value)}
                           />
                       )}
                    </div>
                    {/* Field Value */}
                    <div className="space-y-1">
                      <Label htmlFor={`value-${field.id}`} className="md:hidden">Value</Label>
                       {field.valueOptions ? (
                          <Select
                            value={field.value}
                            onValueChange={(value) => handleFieldChange(field.id, 'value', value)}
                          >
                             <SelectTrigger id={`value-${field.id}`}>
                                <SelectValue placeholder="Select an option" />
                             </SelectTrigger>
                             <SelectContent>
                                {field.valueOptions.map(option => <SelectItem key={option} value={option}>{option}</SelectItem>)}
                             </SelectContent>
                          </Select>
                       ) : (
                          <Input
                             id={`value-${field.id}`}
                             placeholder={field.placeholder || "e.g., Calm and disinterested"}
                             value={field.value}
                             onChange={(e) => handleFieldChange(field.id, 'value', e.target.value)}
                           />
                       )}
                    </div>
                     {/* Field Notes */}
                    <div className="space-y-1">
                       <Label htmlFor={`notes-${field.id}`} className="md:hidden">Notes</Label>
                       <Input
                          id={`notes-${field.id}`}
                          placeholder="Optional notes..."
                          value={field.notes}
                          onChange={(e) => handleFieldChange(field.id, 'notes', e.target.value)}
                        />
                    </div>
                    {/* Remove Button */}
                    <div className="flex items-center h-10">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeField(field.id)}
                        disabled={field.isPredefined}
                        aria-label="Remove field"
                      >
                        <XCircle className="h-5 w-5 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              {currentConfig.allowCustomFields && (
                <Button type="button" variant="outline" onClick={addField}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Custom Field
                </Button>
              )}
            </div>
            
            <Separator />

            {/* Summary and Outcome */}
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="overallOutcome">Overall Outcome</Label>
                <Select value={overallOutcome} onValueChange={setOverallOutcome}>
                  <SelectTrigger id="overallOutcome">
                    <SelectValue placeholder="Select an outcome" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EXCELLENT">Excellent</SelectItem>
                    <SelectItem value="GOOD">Good</SelectItem>
                    <SelectItem value="FAIR">Fair</SelectItem>
                    <SelectItem value="POOR">Poor</SelectItem>
                    <SelectItem value="NEEDS_ATTENTION">Needs Attention</SelectItem>
                    <SelectItem value="MONITOR">Monitor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                 <Label htmlFor="summary">Summary / Key Takeaways</Label>
                 <Textarea
                   id="summary"
                   placeholder="Briefly summarize the assessment findings and any recommendations."
                   rows={4}
                   value={summary}
                   onChange={e => setSummary(e.target.value)}
                 />
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-end space-x-3">
            <Button type="button" variant="outline">
              Cancel
            </Button>
            <Button type="submit">
              Submit Assessment
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}