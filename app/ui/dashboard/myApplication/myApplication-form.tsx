"use client";

import { startTransition } from "react";
import { US_STATES } from "@/app/lib/constants/us-states";
import {
  BOOLEAN_OPTIONS,
  LIVING_SITUATION_OPTIONS,
} from "@/app/lib/constants/constants";
import {
  AdoptionApplicationPayload,
  PetForApplicationPayload,
} from "@/app/lib/types";
import { MyAdoptionAppFormState } from "@/app/lib/form-state-types";
import AppPetMessage from "./app-pet-message";
import CancelButton from "../../buttons/cancel-button-form";
import SubmitButton from "../../buttons/submit-button";
import FormInput from "../../forms/form-input";
import FormSelect from "../../forms/form-select";
import FormButtonWrapper from "../../buttons/form-button-wrapper";
import FormTextArea from "../../forms/form-textarea";
import FormHeader from "../../forms/form-header";
import FormRadio from "../../forms/form-radio";
import { WithDrawButton } from "./withdraw-button";
import ReactivateAppButton from "./reactivate-app-button";
import { ApplicationStatus } from "@prisma/client";

// Define the array of statuses that prevent withdrawal with an explicit type
const NON_WITHDRAWABLE_APP_STATUSES: ApplicationStatus[] = [
  ApplicationStatus.ADOPTED,
  ApplicationStatus.WITHDRAWN,
  ApplicationStatus.REJECTED,
];

interface Props {
  state: MyAdoptionAppFormState;
  formAction: (payload: FormData) => void;
  isPending: boolean;
  myApplication?: AdoptionApplicationPayload;
  petToAdopt?: PetForApplicationPayload; // For creating a new application
  petId?: string;
}

const MyApplicationForm = ({
  state,
  formAction,
  isPending,
  myApplication,
  petToAdopt,
  petId,
}: Props) => {
  const isEditMode = !!myApplication;
  // --- Test Data Configuration ---
  // Set to true to pre-fill the form with test data in create mode.
  // Set to false for a normal blank form.
  const ENABLE_TEST_DATA = true; 

  const testData = {
    applicantName: "John Doe",
    applicantEmail: "john.doe@example.com",
    applicantPhone: "123-456-7890",
    applicantAddressLine1: "123 Main St",
    applicantAddressLine2: "Apt 4B",
    applicantCity: "Anytown",
    applicantState: "CA", // Ensure 'CA' is a valid US_STATE code
    applicantZipCode: "90210",
    livingSituation:
      LIVING_SITUATION_OPTIONS.length > 0
        ? LIVING_SITUATION_OPTIONS[0].value
        : "",
    householdSize: "2",
    hasYard: BOOLEAN_OPTIONS.find(opt => opt.label === "Yes")?.value || "true", 
    landlordPermission: BOOLEAN_OPTIONS.find(opt => opt.label === "Yes")?.value || "true",
    hasChildren: BOOLEAN_OPTIONS.find(opt => opt.label === "Yes")?.value || "true",
    childrenAges: "5, 8", // Example: "5, 8" or ""
    otherPetsDescription: "One friendly Labrador, 3 years old.",
    petExperience: "Grew up with dogs and cats. Have owned two dogs as an adult.",
    reasonForAdoption: "Looking for a companion for my current dog and to give a loving home.",
  };
  // --- End of Test Data Configuration ---

  // Prevent default browser submission and avoids form fields reset when the form is submitted and fails
  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    // Manually call formAction within startTransition
    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <AppPetMessage
        petName={petToAdopt?.name || myApplication?.pet.name || ""}
        petBreed={petToAdopt?.breed || myApplication?.pet.breed || ""}
        petSpecies={
          petToAdopt?.species.name || myApplication?.pet.species.name || ""
        }
      />

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
            errors={state.errors?.applicantName}
            required={true}
            defaultValue={isEditMode
              ? (myApplication.applicantName || "")
              : (ENABLE_TEST_DATA ? testData.applicantName : "")}
            canManage={true}
          />

          <FormInput
            className="sm:col-span-2"
            label="Email Address"
            id="applicantEmail"
            type="email"
            errors={state.errors?.applicantEmail}
            required={true}
            defaultValue={isEditMode
              ? (myApplication.applicantEmail || "")
              : (ENABLE_TEST_DATA ? testData.applicantEmail : "")}
            canManage={true}
          />

          <FormInput
            className="sm:col-span-2"
            label="Phone Number"
            id="applicantPhone"
            type="tel"
            errors={state.errors?.applicantPhone}
            required={true}
            defaultValue={isEditMode
              ? (myApplication.applicantPhone || "")
              : (ENABLE_TEST_DATA ? testData.applicantPhone : "")}
            canManage={true}
          />

          <FormInput
            className="sm:col-span-3"
            label="Street Address"
            id="applicantAddressLine1"
            type="text"
            errors={state.errors?.applicantAddressLine1}
            required={true}
            defaultValue={isEditMode
              ? (myApplication.applicantAddressLine1 || "")
              : (ENABLE_TEST_DATA ? testData.applicantAddressLine1 : "")}
            canManage={true}
          />

          <FormInput
            className="sm:col-span-3"
            label="Apartment, suite, etc. (Optional)"
            id="applicantAddressLine2"
            type="text"
            errors={state.errors?.applicantAddressLine2}
            defaultValue={isEditMode
              ? (myApplication.applicantAddressLine2 || "")
              : (ENABLE_TEST_DATA ? testData.applicantAddressLine2 : "")}
            canManage={true}
          />

          <FormInput
            className="sm:col-span-2"
            label="City"
            id="applicantCity"
            type="text"
            errors={state.errors?.applicantCity}
            required={true}
            defaultValue={isEditMode
              ? (myApplication.applicantCity || "")
              : (ENABLE_TEST_DATA ? testData.applicantCity : "")}
            canManage={true}
          />

          <FormSelect
            className="sm:col-span-2"
            label="State / Province"
            id="applicantState"
            errors={state.errors?.applicantState}
            required={true}
            defaultValue={isEditMode
              ? (myApplication.applicantState || "")
              : (ENABLE_TEST_DATA ? testData.applicantState : "")}
            canManage={true}
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
            errors={state.errors?.applicantZipCode}
            required={true}
            defaultValue={isEditMode
              ? (myApplication.applicantZipCode || "")
              : (ENABLE_TEST_DATA ? testData.applicantZipCode : "")}
            canManage={true}
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
            errors={state.errors?.livingSituation}
            required={true}
            defaultValue={isEditMode
              ? (myApplication.livingSituation || "")
              : (ENABLE_TEST_DATA ? testData.livingSituation : "")}
            canManage={true}
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
            errors={state.errors?.householdSize}
            required={true}
            defaultValue={isEditMode
              ? (myApplication.householdSize?.toString() || "")
              : (ENABLE_TEST_DATA ? testData.householdSize : "")}
            canManage={true}
          />

          <FormRadio
            className="sm:col-span-3"
            legendText="Do you have a yard?"
            id="hasYard"
            options={BOOLEAN_OPTIONS}
            defaultValue={isEditMode
              ? (String(myApplication.hasYard ?? "") || BOOLEAN_OPTIONS[0].value)
              : (ENABLE_TEST_DATA ? testData.hasYard : BOOLEAN_OPTIONS[0].value)}
            errors={state.errors?.hasYard}
            canManage={true}
          />

          <FormRadio
            className="sm:col-span-3"
            legendText="If renting, do you have landlord permission for a pet?"
            id="landlordPermission"
            options={BOOLEAN_OPTIONS}
            defaultValue={isEditMode
              ? (String(myApplication.landlordPermission ?? "") || BOOLEAN_OPTIONS[0].value)
              : (ENABLE_TEST_DATA ? testData.landlordPermission : BOOLEAN_OPTIONS[0].value)}
            errors={state.errors?.landlordPermission}
            canManage={true}
          />

          <FormRadio
            className="sm:col-span-3"
            legendText="Are there children in the household?"
            id="hasChildren"
            options={BOOLEAN_OPTIONS}
            defaultValue={isEditMode
              ? (String(myApplication.hasChildren ?? "") || BOOLEAN_OPTIONS[0].value)
              : (ENABLE_TEST_DATA ? testData.hasChildren : BOOLEAN_OPTIONS[0].value)}
            errors={state.errors?.hasChildren}
            canManage={true}
          />

          <FormInput
            className="sm:col-span-3"
            label="Ages of children (if applicable, comma-separated)"
            id="childrenAges"
            type="text"
            errors={state.errors?.childrenAges}
            defaultValue={isEditMode
              ? (myApplication.childrenAges?.join(", ") || "")
              : (ENABLE_TEST_DATA ? testData.childrenAges : "")}
            canManage={true}
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
            errors={state.errors?.otherPetsDescription}
            rows={3}
            defaultValue={isEditMode
              ? (myApplication.otherPetsDescription || "")
              : (ENABLE_TEST_DATA ? testData.otherPetsDescription : "")}
            canManage={true}
            TextAreaDescription="E.g., Species, breed, age, temperament"
          />
          <FormTextArea
            className="sm:col-span-6"
            label="Previous Pet Experience"
            id="petExperience"
            errors={state.errors?.petExperience}
            required={true}
            defaultValue={isEditMode
              ? (myApplication.petExperience || "")
              : (ENABLE_TEST_DATA ? testData.petExperience : "")}
            canManage={true}
            rows={4}
            TextAreaDescription="Describe your experience with pets, types of animals, responsibilities, etc."
          />
          <FormTextArea
            className="sm:col-span-6"
            label="Reason for Wanting to Adopt This Pet"
            id="reasonForAdoption"
            errors={state.errors?.reasonForAdoption}
            required={true}
            rows={4}
            defaultValue={isEditMode
              ? (myApplication.reasonForAdoption || "")
              : (ENABLE_TEST_DATA ? testData.reasonForAdoption : "")}
            canManage={true}
            TextAreaDescription="Why are you interested in adopting this specific pet? What are you
                looking for in a companion animal?"
          />
        </div>

        {/* Form-wide errors and submission buttons */}
        <FormButtonWrapper id="myApplication" errors={state.message}>
          <CancelButton
            href={petId ? `/pets/${petId}` : "/dashboard/my-applications"}
            isPending={isPending}
          />
          <SubmitButton
            buttonName={isEditMode ? "Save" : "Submit Application"}
            isPending={isPending}
          />
          {myApplication && !NON_WITHDRAWABLE_APP_STATUSES.includes(myApplication.status) && (
              <WithDrawButton myApplicationId={myApplication.id} />
            )}
          {myApplication && myApplication.status === ApplicationStatus.WITHDRAWN && <ReactivateAppButton myApplicationId={myApplication.id} />}
        </FormButtonWrapper>
      </div>
    </form>
  );
};

export default MyApplicationForm;