"use client";
import { updateUser } from "@/app/lib/actions/user.actions";
import { ROLE_VALUES } from "@/app/lib/constants";
import { updateUserFormState } from "@/app/lib/error-messages-type";
import { Role } from "@prisma/client";
import Link from "next/link";
import { useActionState } from "react";

interface userWithRole {
  id: string;
  email: string;
  role: Role;
}

interface EditUserFormProps {
  user: userWithRole;
}

const EditUserForm = ({ user }: EditUserFormProps) => {
  const updateUserWithId = updateUser.bind(null, user.id);
  const initialState = { message: null, errors: {} };
  const [state, dispatch] = useActionState<updateUserFormState, FormData>(
    updateUserWithId,
    initialState
  );

  return (
    <form action={dispatch}>
      <div>
        <div className="border-b border-gray-900/10 pb-5">
          <div className="mt-5 grid grid-cols-1 gap-y-4">
            <div>
              <span className="text-sm font-medium leading-6">Email</span>
              <div className="mt-1 font-medium">{user.email}</div>
            </div>

            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Role
              </label>
              <div className="mt-2">
                <select
                  id="role"
                  name="role"
                  defaultValue={user.role}
                  autoComplete="off"
                  aria-describedby="role-error"
                  className="block capitalize w-full rounded-md border-0 py-1.5 text-gray-900 sm:max-w-xs sm:text-sm sm:leading-6 shadow-xs ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                >
                  {ROLE_VALUES.map((role) => {
                    return (
                      <option key={role} value={role}>
                        {role.toLowerCase()}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div id="role-error" aria-live="polite" aria-atomic="true">
                {state.errors?.role &&
                  state.errors.role.map((error: string) => (
                    <p className="mt-2 text-sm text-red-500" key={error}>
                      {error}
                    </p>
                  ))}
              </div>
            </div>
          </div>

          {/* form errors */}
          <div id="users-error" aria-live="polite" aria-atomic="true">
            {state.message && (
              <p className="mt-2 text-sm text-red-500" key={state.message}>
                {state.message}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <Link
          href="/dashboard/users"
          type="button"
          className="text-sm font-semibold leading-6 text-gray-900"
        >
          Cancel
        </Link>
        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default EditUserForm;
