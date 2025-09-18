import { Suspense } from 'react';
import { notFound, redirect } from 'next/navigation';
import { prisma } from '@/app/lib/prisma';
import { AssessmentFormData, IDParamType } from '@/app/lib/types';
import { auth } from '@/auth';
import { getAssessmentTemplates } from '@/app/lib/data/animals/animal-assessment.data';
import { AssessmentForm } from '@/components/dashboard/animals/assessments/assessment-form';

interface Props {
  params: IDParamType;
}

export default async function NewAssessmentPage({ params }: Props) {
  const { id: animalId } = await params;
  
  const templates = await getAssessmentTemplates();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              New Assessment
            </h1>
            <p className="mt-2 text-gray-600">
              Create a new assessment using one of the available templates.
            </p>
          </div>
          
          <Suspense fallback={<div>Loading assessment form...</div>}>
            <AssessmentForm
              animalId={animalId}
              templates={templates}
              />

          </Suspense>
        </div>
      </div>
    </div>
  );
}