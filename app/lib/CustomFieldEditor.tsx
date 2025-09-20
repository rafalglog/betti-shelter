// "use client"

// import React, { useState } from "react";
// import { FieldType } from "@prisma/client";
// import { TemplateField } from "./types";

// interface CustomFieldEditorProps {
//   field: TemplateField;
//   onUpdate: (field: TemplateField) => void;
//   onRemove: (fieldId: string) => void;
// }

// export function CustomFieldEditor({
//   field,
//   onUpdate,
//   onRemove,
// }: CustomFieldEditorProps) {
//   const [isEditing, setIsEditing] = useState(true);
//   const [editField, setEditField] = useState<TemplateField>(field);

//   const handleSave = () => {
//     onUpdate(editField);
//     setIsEditing(false);
//   };

//   const handleCancel = () => {
//     setEditField(field);
//     setIsEditing(false);
//   };

//   const addOption = () => {
//     const newOptions = [...(editField.options || []), "New Option"];
//     setEditField({ ...editField, options: newOptions });
//   };

//   const removeOption = (index: number) => {
//     const newOptions = editField.options?.filter((_, i) => i !== index);
//     setEditField({ ...editField, options: newOptions });
//   };

//   const updateOption = (index: number, value: string) => {
//     const newOptions = [...(editField.options || [])];
//     newOptions[index] = value;
//     setEditField({ ...editField, options: newOptions });
//   };

//   if (!isEditing) {
//     return (
//       <div className="border border-gray-300 rounded-md p-4 bg-gray-50">
//         <div className="flex justify-between items-center mb-2">
//           <h4 className="font-medium">{field.label}</h4>
//           <div className="space-x-2">
//             <button
//               type="button"
//               onClick={() => setIsEditing(true)}
//               className="text-blue-500 hover:text-blue-700 text-sm"
//             >
//               Edit
//             </button>
//             <button
//               type="button"
//               onClick={() => onRemove(field.id)}
//               className="text-red-500 hover:text-red-700 text-sm"
//             >
//               Remove
//             </button>
//           </div>
//         </div>
//         <p className="text-sm text-gray-600">Type: {field.fieldType}</p>
//         {field.options && field.options.length > 0 && (
//           <p className="text-sm text-gray-600">
//             Options: {field.options.join(", ")}
//           </p>
//         )}
//       </div>
//     );
//   }

//   return (
//     <div className="border border-gray-300 rounded-md p-4 bg-gray-50">
//       <div className="space-y-4">
//         <div>
//           <label className="block text-sm font-medium mb-1">Field Label</label>
//           <input
//             type="text"
//             value={editField.label}
//             onChange={(e) =>
//               setEditField({ ...editField, label: e.target.value })
//             }
//             className="w-full p-2 border rounded-md"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium mb-1">Field Type</label>
//           <select
//             value={editField.fieldType}
//             onChange={(e) =>
//               setEditField({
//                 ...editField,
//                 fieldType: e.target.value as FieldType,
//                 options:
//                   e.target.value === FieldType.SELECT ||
//                   e.target.value === FieldType.RADIO
//                     ? editField.options || []
//                     : [],
//               })
//             }
//             className="w-full p-2 border rounded-md"
//           >
//             <option value={FieldType.TEXT}>Text</option>
//             <option value={FieldType.TEXTAREA}>Textarea</option>
//             <option value={FieldType.NUMBER}>Number</option>
//             <option value={FieldType.SELECT}>Select</option>
//             <option value={FieldType.RADIO}>Radio</option>
//             <option value={FieldType.CHECKBOX}>Checkbox</option>
//             <option value={FieldType.DATE}>Date</option>
//           </select>
//         </div>

//         {editField.fieldType !== FieldType.CHECKBOX && (
//           <div>
//             <label className="block text-sm font-medium mb-1">
//               Placeholder
//             </label>
//             <input
//               type="text"
//               value={editField.placeholder || ""}
//               onChange={(e) =>
//                 setEditField({ ...editField, placeholder: e.target.value })
//               }
//               className="w-full p-2 border rounded-md"
//             />
//           </div>
//         )}

//         {(editField.fieldType === FieldType.SELECT ||
//           editField.fieldType === FieldType.RADIO) && (
//           <div>
//             <label className="block text-sm font-medium mb-1">Options</label>
//             <div className="space-y-2">
//               {editField.options?.map((option, index) => (
//                 <div key={index} className="flex gap-2">
//                   <input
//                     type="text"
//                     value={option}
//                     onChange={(e) => updateOption(index, e.target.value)}
//                     className="flex-1 p-2 border rounded-md"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => removeOption(index)}
//                     className="text-red-500 hover:text-red-700"
//                   >
//                     Remove
//                   </button>
//                 </div>
//               ))}
//               <button
//                 type="button"
//                 onClick={addOption}
//                 className="text-blue-500 hover:text-blue-700 text-sm"
//               >
//                 Add Option
//               </button>
//             </div>
//           </div>
//         )}

//         <div className="flex items-center">
//           <input
//             type="checkbox"
//             checked={editField.isRequired}
//             onChange={(e) =>
//               setEditField({ ...editField, isRequired: e.target.checked })
//             }
//             className="mr-2"
//           />
//           <label className="text-sm">Required field</label>
//         </div>

//         <div className="flex gap-2">
//           <button
//             type="button"
//             onClick={handleSave}
//             className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
//           >
//             Save
//           </button>
//           <button
//             type="button"
//             onClick={handleCancel}
//             className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
//           >
//             Cancel
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
