// "use client";

// import { updateUserRole } from "@/app/lib/actions/user.actions";
// import { ROLE_VALUES } from "@/app/lib/constants/constants";
// import {
//   INITIAL_FORM_STATE,
//   UpdateUserFormState,
// } from "@/app/lib/form-state-types";
// import { UserByIdPayload } from "@/app/lib/types";
// import { useActionState } from "react";
// import CancelButton from "../../buttons/cancel-button-form";
// import FormSelect from "../../forms/form-select";
// import FormInput from "../../forms/form-input";
// import SubmitButton from "../../buttons/submit-button";
// import FormButtonWrapper from "../../buttons/form-button-wrapper";
// import FormHeader from "../../forms/form-header";

// interface EditUserFormProps {
//   user: UserByIdPayload;
// }

// const EditUserForm = ({ user }: EditUserFormProps) => {
//   const updateUserWithId = updateUserRole.bind(null, user.id);
  // const [state, formAction, isPending] = useActionState<
  //   UpdateUserFormState,
  //   FormData
  // >(updateUserWithId, INITIAL_FORM_STATE);

//   return (
//     <form action={formAction}>
//       <div className="divide-y divide-gray-300 [&>div]:py-9 [&>div:first-child]:pt-0">
//         <div className="grid grid-cols-1 sm:grid-cols-6 gap-x-6 gap-y-8">
//           <FormHeader
//             className="sm:col-span-6"
//             title="Edit User Role"
//             description="Update the user's role and permissions in the system."
//           />
//           <FormInput
//             className="sm:col-span-3"
//             label="User Email"
//             id="email"
//             type="email"
//             defaultValue={user.email}
//             canManage={false}
//           />
//           <FormSelect
//             className="sm:col-span-3"
//             label="Role"
//             id="role"
//             defaultValue={user.role}
//             errors={state.errors?.role}
//             canManage={true}
//           >
//             {ROLE_VALUES.map((role) => {
//               return (
//                 <option key={role} value={role}>
//                   {role.toLowerCase()}
//                 </option>
//               );
//             })}
//           </FormSelect>
//         </div>

//         <FormButtonWrapper id="users" errors={state.message}>
//           <CancelButton href="/dashboard/users" isPending={isPending} />
//           <SubmitButton buttonName="Save" isPending={isPending} />
//         </FormButtonWrapper>
//       </div>
//     </form>
//   );
// };

// export default EditUserForm;
