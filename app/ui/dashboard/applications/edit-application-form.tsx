"use client";

import { startTransition, useActionState, useState } from "react";
import {
  APPLICATION_STATUS_VALUES,
  BOOLEAN_OPTIONS,
  LIVING_SITUATION_OPTIONS,
} from "@/app/lib/constants/constants";
import { AdoptionApplicationPayload } from "@/app/lib/types";
import {
  INITIAL_FORM_STATE,
  StaffUpdateAppFormState,
} from "@/app/lib/form-state-types";
import { staffUpdateAdoptionApp } from "@/app/lib/actions/application.actions";
import FormSelect from "../../forms/form-select";
import FormTextArea from "../../forms/form-textarea";
import FormButtonWrapper from "../../buttons/form-button-wrapper";
import CancelButton from "../../buttons/cancel-button-form";
import SubmitButton from "../../buttons/submit-button";
import FormHeader from "../../forms/form-header";
import FormInput from "../../forms/form-input";
import FormRadio from "../../forms/form-radio";
import { US_STATES } from "@/app/lib/constants/us-states";
import { ApplicationStatus } from "@prisma/client";
import FormSwitch from "../../forms/form-switch";

interface Props {
  application: AdoptionApplicationPayload;
  canManage: boolean;
}

const EditApplicationForm = ({ application, canManage }: Props) => {
  const updateApplicationWithId = staffUpdateAdoptionApp.bind(
    null,
    application.id
  );

  const [state, formAction, isPending] = useActionState<
    StaffUpdateAppFormState,
    FormData
  >(updateApplicationWithId, INITIAL_FORM_STATE);

  const [currentStatus, setCurrentStatus] = useState<ApplicationStatus>(
    application.status
  );
  // State for the "Set as Primary" switch
  // Defaults to false if application.isPrimary is null or undefined
  const [isPrimarySelected, setIsPrimarySelected] = useState<boolean>(
    application.isPrimary ?? false
  );

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    if (currentStatus === application.status) {
      formData.delete("status");
      formData.delete("statusChangeReason");
    }

    startTransition(() => {
      formAction(formData);
    });
  };

  const originalStatus = application.status;
  const isStatusChanging = currentStatus !== originalStatus;
  const isPendingToReviewing =
    originalStatus === ApplicationStatus.PENDING &&
    currentStatus === ApplicationStatus.REVIEWING;

  const showStatusChangeReason =
    canManage && isStatusChanging && !isPendingToReviewing;
    
  // Rule: The "Set as Primary" option should only be shown for APPROVED applications.
  const showIsPrimaryToggle = currentStatus === ApplicationStatus.APPROVED;

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentStatus(e.target.value as ApplicationStatus);
  };

  return (
    <div>
      <div className="divide-y divide-gray-300 [&>div]:py-9 [&>div:first-child]:pt-0">
        {/* Applicant Information Section */}
        <div className="grid grid-cols-1 sm:grid-cols-6 gap-x-6 gap-y-8">
          <FormHeader
            className="sm:col-span-6"
            title="Applicant Information"
            description="Please provide your contact details."
          />

          <FormInput
            className="sm:col-span-2"
            label="Full Name"
            id="applicantName"
            type="text"
            defaultValue={application.applicantName || ""}
          />

          <FormInput
            className="sm:col-span-2"
            label="Email Address"
            id="applicantEmail"
            type="email"
            defaultValue={application.applicantEmail || ""}
          />

          <FormInput
            className="sm:col-span-2"
            label="Phone Number"
            id="applicantPhone"
            type="tel"
            defaultValue={application.applicantPhone || ""}
          />

          <FormInput
            className="sm:col-span-3"
            label="Street Address"
            id="applicantAddressLine1"
            type="text"
            defaultValue={application.applicantAddressLine1 || ""}
          />

          <FormInput
            className="sm:col-span-3"
            label="Apartment, suite, etc. (Optional)"
            id="applicantAddressLine2"
            type="text"
            defaultValue={application.applicantAddressLine2 || ""}
          />

          <FormInput
            className="sm:col-span-2"
            label="City"
            id="applicantCity"
            type="text"
            defaultValue={application.applicantCity || ""}
          />

          <FormSelect
            className="sm:col-span-2"
            label="State / Province"
            id="applicantState"
            defaultValue={application.applicantState || ""}
          >
            <option value="">Select State</option>
            {US_STATES.map((state) => (
              <option key={state.code} value={state.code}>
                {state.name}
              </option>
            ))}
          </FormSelect>

          <FormInput
            className="sm:col-span-2"
            label="ZIP / Postal Code"
            id="applicantZipCode"
            type="text"
            defaultValue={application.applicantZipCode || ""}
          />
        </div>

        {/* Living Situation and Household Information Section */}
        <div className="grid grid-cols-1 sm:grid-cols-6 gap-x-6 gap-y-8">
          <FormHeader
            className="sm:col-span-6"
            title="Living Situation & Household"
            description="Tell us about your home environment."
          />

          <FormSelect
            className="sm:col-span-3"
            label="Current Living Situation"
            id="livingSituation"
            defaultValue={application.livingSituation || ""}
          >
            <option value="">Select situation</option>
            {LIVING_SITUATION_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </FormSelect>

          <FormInput
            className="sm:col-span-3"
            label="Household Size (Number of people)"
            id="householdSize"
            type="number"
            defaultValue={application.householdSize || ""}
          />

          <FormRadio
            className="sm:col-span-3"
            legendText="Do you have a yard?"
            id="hasYard"
            options={BOOLEAN_OPTIONS}
            defaultValue={
              String(application.hasYard ?? "") || BOOLEAN_OPTIONS[0].value
            }
          />

          <FormRadio
            className="sm:col-span-3"
            legendText="If renting, do you have landlord permission for a pet?"
            id="landlordPermission"
            options={BOOLEAN_OPTIONS}
            defaultValue={
              String(application.landlordPermission ?? "") ||
              BOOLEAN_OPTIONS[0].value
            }
          />

          <FormRadio
            className="sm:col-span-3"
            legendText="Are there children in the household?"
            id="hasChildren"
            options={BOOLEAN_OPTIONS}
            defaultValue={
              String(application.hasChildren ?? "") || BOOLEAN_OPTIONS[0].value
            }
          />

          <FormInput
            className="sm:col-span-3"
            label="Ages of children (if applicable, comma-separated)"
            id="childrenAges"
            type="text"
            defaultValue={application.childrenAges?.join(", ") || ""}
            placeholder="E.g., 1, 2, 3"
          />
        </div>

        {/* Pet Experience and Adoption Reason Section */}
        <div className="grid grid-cols-1 sm:grid-cols-6 gap-x-6 gap-y-8">
          <FormHeader
            className="sm:col-span-6"
            title="Pet Experience & Adoption Reason"
            description="Help us understand your experience and motivation."
          />
          <FormTextArea
            className="sm:col-span-6"
            label="Description of other pets in the household (if any)"
            id="otherPetsDescription"
            rows={3}
            defaultValue={application.otherPetsDescription || ""}
            TextAreaDescription="E.g., Species, breed, age, temperament"
          />
          <FormTextArea
            className="sm:col-span-6"
            label="Previous Pet Experience"
            id="petExperience"
            defaultValue={application.petExperience || ""}
            rows={4}
            TextAreaDescription="Describe your experience with pets, types of animals, responsibilities, etc."
          />
          <FormTextArea
            className="sm:col-span-6"
            label="Reason for Wanting to Adopt This Pet"
            id="reasonForAdoption"
            rows={4}
            defaultValue={application.reasonForAdoption || ""}
            TextAreaDescription="Why are you interested in adopting this specific pet? What are you
                looking for in a companion animal?"
          />
        </div>
      </div>

      <form onSubmit={handleFormSubmit}>
        <div className="border-t border-gray-300 pt-9 divide-y divide-gray-300 [&>div]:py-9 [&>div:first-child]:pt-0">
          {(canManage || application.internalNotes || application.status) && (
            <div className="grid grid-cols-1 sm:grid-cols-6 gap-x-6 gap-y-8">
              <FormHeader
                className="sm:col-span-6"
                title="Staff Section"
                description={
                  !canManage
                    ? "Application status and internal notes (read-only)."
                    : "Update the application status and add internal notes."
                }
              />

              <FormSelect
                className="sm:col-span-3"
                label="Application Status"
                id="status"
                name="status"
                value={currentStatus}
                onChange={handleStatusChange}
                canManage={canManage}
                errors={state.errors?.status}
              >
                {APPLICATION_STATUS_VALUES.map((status) => (
                  <option key={status} value={status}>
                    {status.toLowerCase()}
                  </option>
                ))}
              </FormSelect>

              {/* Conditionally render Set as Primary toggle */}
              {canManage && showIsPrimaryToggle && (
                <FormSwitch
                  className="sm:col-span-3"
                  label="Set as Primary Applicant"
                  id="isPrimary"
                  name="isPrimary"
                  checked={isPrimarySelected}
                  onChange={setIsPrimarySelected}
                  value="true"
                  disabled={!canManage}
                  errors={state.errors?.isPrimary}
                />
              )}
              
              {showStatusChangeReason && (
                <FormTextArea
                  className="col-span-full"
                  label="Reason for Status Change"
                  id="statusChangeReason"
                  name="statusChangeReason"
                  errors={state.errors?.statusChangeReason}
                  canManage={canManage}
                  rows={4}
                  TextAreaDescription={
                    "A reason is required because the status has been changed."
                  }
                />
              )}

              <FormTextArea
                className="col-span-full"
                label="Internal Notes"
                id="internalNotes"
                name="internalNotes"
                errors={state.errors?.internalNotes}
                canManage={canManage}
                defaultValue={application.internalNotes ?? ""}
                rows={4}
                TextAreaDescription={String(
                  canManage &&
                    "Add any internal notes about the application here."
                )}
              />
            </div>
          )}

          <FormButtonWrapper id="application" errors={state.message}>
            <CancelButton href="/dashboard/applications" isPending={isPending} />
            {canManage && (
              <SubmitButton buttonName="Save" isPending={isPending} />
            )}
          </FormButtonWrapper>
        </div>
      </form>
    </div>
  );
};

export default EditApplicationForm;