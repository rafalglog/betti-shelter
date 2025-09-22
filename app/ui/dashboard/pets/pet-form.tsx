// "use client";

// import { PhotoIcon, TrashIcon } from "@heroicons/react/24/outline";
// import { startTransition, useState } from "react";
// import { Species } from "@prisma/client";
// import clsx from "clsx";
// import { AnimalByIDPayload } from "@/app/lib/types";
// import { AnimalFormState } from "@/app/lib/form-state-types";
// import {
//   ALLOWED_MIME_TYPES,
//   SEX_VALUES,
//   LISTING_STATUS_VALUES,
//   MAX_FILE_SIZE,
// } from "@/app/lib/constants/constants";
// import FieldError from "../../field-error";
// import CancelButton from "../../buttons/cancel-button-form";
// import SubmitButton from "../../buttons/submit-button";
// import { US_STATES } from "@/app/lib/constants/us-states";
// import Image from "next/image";
// import { Input, Label, Field } from "@headlessui/react";
// import FormInput from "../../forms/form-input";
// import FormSelect from "../../forms/form-select";
// import FormButtonWrapper from "../../buttons/form-button-wrapper";
// import FormTextArea from "../../forms/form-textarea";
// import FormHeader from "../../forms/form-header";

// interface PetFormProps {
//   state: AnimalFormState;
//   formAction: (payload: FormData) => void;
//   isPending: boolean;
//   speciesList: Species[];
//   pet?: AnimalByIDPayload;
//   canManagePet?: boolean;
// }

// const PetForm = ({
//   state,
//   formAction,
//   isPending,
//   speciesList,
//   pet,
//   canManagePet = true,
// }: PetFormProps) => {
//   const isEditMode = !!pet;
//   const [files, setFiles] = useState<File[]>([]);

//   // handle file change event
//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const { files } = event.target;
//     if (files) {
//       // Filter out invalid files with unsupported file types and max size of 5MB
//       const validFiles = Array.from(files).filter(
//         (file) =>
//           ALLOWED_MIME_TYPES.includes(file.type) && file.size <= MAX_FILE_SIZE
//       );
//       setFiles((prevFiles) => [...prevFiles, ...validFiles]);
//     }
//   };

//   // handle drop event
//   const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
//     event.preventDefault();
//     if (event.dataTransfer.items) {
//       const droppedFiles = Array.from(event.dataTransfer.items)
//         .filter((item) => item.kind === "file")
//         .map((item) => item.getAsFile())
//         .filter(
//           (file): file is File =>
//             file !== null &&
//             ALLOWED_MIME_TYPES.includes(file.type) &&
//             file.size <= MAX_FILE_SIZE
//         );
//       setFiles((prevFiles) => [...prevFiles, ...droppedFiles]);
//     }
//   };

//   // handle drag over event
//   const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
//     event.preventDefault();
//   };

//   // handle form submit
//   const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault(); // Prevent the default form submission

//     // You can access the form data here if needed
//     const formData = new FormData(event.currentTarget);

//     // Append the files to the form data
//     files.forEach((file) => {
//       if (file && file.size > 0) {
//         formData.append(`animalImages`, file);
//       }
//     });

//     // Manually call to formAction in startTransition
//     startTransition(() => {
//       formAction(formData);
//     });
//   };

//   return (
//     <form onSubmit={handleFormSubmit}>
//       <div className="divide-y divide-gray-300 [&>div]:py-9 [&>div:first-child]:pt-0">
//         <div className="grid grid-cols-1 sm:grid-cols-6 gap-x-6 gap-y-8">
//           <FormHeader
//             className="col-span-full"
//             title={canManagePet ? "Edit Pet Information" : "Pet Information"}
//             description="Please provide Pet details"
//           />
//           <FormInput
//             className="sm:col-span-3"
//             label="Name"
//             id="name"
//             type="text"
//             required={true}
//             defaultValue={pet?.name || ""}
//             canManage={canManagePet}
//             errors={state.errors?.name}
//           />
//           <FormSelect
//             className="sm:col-span-2"
//             label="Gender"
//             id="gender"
//             defaultValue={pet?.sex || SEX_VALUES[0]}
//             canManage={canManagePet}
//             errors={state.errors?.gender}
//           >
//             {SEX_VALUES.map((gender) => (
//               <option key={gender} value={gender}>
//                 {gender.toLowerCase()}
//               </option>
//             ))}
//           </FormSelect>
//           <FormInput
//             className="sm:col-span-2"
//             label="Birth Date"
//             id="birthDate"
//             type="date"
//             defaultValue={pet?.birthDate.toISOString().split("T")[0] || ""}
//             canManage={canManagePet}
//             errors={state.errors?.birthDate}
//           />
//           <FormInput
//             className="sm:col-span-2"
//             label="Weight (kg)"
//             id="weightKg"
//             type="number"
//             defaultValue={pet?.weightKg || ""}
//             canManage={canManagePet}
//             errors={state.errors?.weightKg}
//           />
//           <FormInput
//             className="sm:col-span-2"
//             label="Height (cm)"
//             id="heightCm"
//             type="number"
//             defaultValue={pet?.heightCm || ""}
//             canManage={canManagePet}
//             errors={state.errors?.heightCm}
//           />
//           {/* <FormSelect
//             className="sm:col-span-3"
//             label="Species"
//             id="speciesId"
//             defaultValue={pet?. || ""}
//             canManage={canManagePet}
//             errors={state.errors?.speciesId}
//           >
//             {speciesList.map((species) => (
//               <option key={species.id} value={species.id}>
//                 {species.name}
//               </option>
//             ))}
//           </FormSelect> */}
//           {/* <FormInput
//             className="sm:col-span-3"
//             label="Breed"
//             id="breed"
//             type="text"
//             defaultValue={pet?.breed || ""}
//             canManage={canManagePet}
//             errors={state.errors?.breed}
//           /> */}
//           <FormInput
//             className="sm:col-span-3"
//             label="City"
//             id="city"
//             type="text"
//             defaultValue={pet?.city || ""}
//             canManage={canManagePet}
//             errors={state.errors?.city}
//           />
//           <FormSelect
//             className="sm:col-span-3"
//             label="State"
//             id="state"
//             defaultValue={pet?.state || US_STATES[0].code}
//             canManage={canManagePet}
//             errors={state.errors?.state}
//           >
//             {US_STATES.map((state) => (
//               <option key={state.code} value={state.code}>
//                 {state.name}
//               </option>
//             ))}
//           </FormSelect>
//           <FormSelect
//             className="sm:col-span-2"
//             label="Listing Status"
//             id="listingStatus"
//             defaultValue={pet?.listingStatus || LISTING_STATUS_VALUES[0]}
//             canManage={canManagePet}
//             errors={state.errors?.listingStatus}
//           >
//             {LISTING_STATUS_VALUES.map((status) => (
//               <option key={status} value={status}>
//                 {status.toLowerCase().replace("_", " ")}
//               </option>
//             ))}
//           </FormSelect>
//           <FormTextArea
//             className="col-span-full"
//             label="Description"
//             id="description"
//             errors={state.errors?.description}
//             defaultValue={pet?.description || ""}
//             canManage={canManagePet}
//             rows={3}
//             TextAreaDescription="Write a few sentences about the pet."
//           />
//         </div>

//         {/* images section */}
//         <div
//           className={clsx(
//             !canManagePet && "opacity-50 pointer-events-none cursor-not-allowed"
//           )}
//         >
//           <Field>
//             <Label
//               htmlFor="file-upload"
//               className="block text-sm font-medium leading-6 text-gray-900"
//             >
//               Drop photos
//             </Label>
//             <div
//               className="dropzone mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10"
//               onDrop={handleDrop}
//               onDragOver={handleDragOver}
//             >
//               <div className="text-center">
//                 <PhotoIcon
//                   className="mx-auto h-12 w-12 text-gray-300"
//                   aria-hidden="true"
//                 />
//                 <div className="mt-4 flex text-sm leading-6 text-gray-600">
//                   <Label
//                     htmlFor="file-upload"
//                     className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-hidden focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
//                   >
//                     Upload a Photo
//                   </Label>
//                   <Input
//                     type="file"
//                     id="file-upload"
//                     multiple
//                     className="sr-only"
//                     onChange={handleFileChange}
//                   />
//                   <p className="pl-1">or drag and drop</p>
//                 </div>
//                 <p className="text-xs leading-5 text-gray-600">
//                   PNG, JPG, GIF, WEBP up to 5MB
//                 </p>
//               </div>
//             </div>
//           </Field>
//           <div>
//             <h1 className="text-sm text-gray-500">Images to be uploaded</h1>
//             {files.map((file, index) => (
//               <div key={index} className="flex text-gray-600 items-center">
//                 <Image
//                   src={URL.createObjectURL(file)}
//                   alt={file.name}
//                   width={40}
//                   height={40}
//                 />
//                 <span className="font-medium text-sm px-2" key={index}>
//                   {file.name} - {(file.size / 1024).toFixed(2)} KB
//                 </span>
//                 {canManagePet && (
//                   <TrashIcon
//                     className="h-4 w-4 hover:cursor-pointer hover:text-red-600"
//                     aria-hidden="true"
//                     // remove the file from the state list
//                     onClick={() => {
//                       setFiles((prevFiles) =>
//                         prevFiles.filter((_, i) => i !== index)
//                       );
//                     }}
//                   />
//                 )}
//               </div>
//             ))}
//           </div>
//         {/* image errors */}
//         <FieldError id="animalImages-error" errors={state.errors?.animalImages} />
//         </div>

//         <FormButtonWrapper id="users" errors={state.message}>
//           <CancelButton href="/dashboard/pets" isPending={isPending} />
//           {canManagePet && (
//             <SubmitButton
//               buttonName={isEditMode ? "Save" : "Create Pet"}
//               isPending={isPending}
//             />
//           )}
//         </FormButtonWrapper>
//       </div>
//     </form>
//   );
// };

// export default PetForm;