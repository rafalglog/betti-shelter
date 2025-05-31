import {
  IdentificationIcon,
  AtSymbolIcon,
  PhoneIcon,
  ChatBubbleBottomCenterTextIcon,
} from "@heroicons/react/24/outline";

const Page = () => {
  return (
    // Added a bit of padding to the overall container for better spacing on smaller screens
    <div className="p-4 md:p-0">
      <div className="mx-auto max-w-lg"> {/* Changed max-w-160 to max-w-lg for better typical form width */}
        <h1 className="text-2xl font-semibold text-gray-900">Contact Us</h1> {/* Added font-semibold and text-gray-900 for consistency */}
        <p className="text-gray-600 text-sm mt-1"> {/* Adjusted text color and margin */}
          We will contact you as soon as possible
        </p>

        <form className="pt-6 grid grid-cols-6 gap-x-6 gap-y-8"> {/* Changed div to form for semantics */}
          {/* user name label */}
          <div className="col-span-full sm:col-span-3"> {/* Adjusted colspan for responsiveness */}
            <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-900"> {/* Matched label style */}
              Name
            </label>
            <div className="relative"> {/* Removed unnecessary nested div and mt-2 rounded-md */}
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="off"
                placeholder="Enter name"
                // Applied styles from create-form.txt, kept pl-10
                className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 shadow-xs ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              <IdentificationIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            </div>
          </div>

          {/* phone number label */}
          <div className="col-span-full sm:col-span-3"> {/* Adjusted colspan for responsiveness */}
            <label htmlFor="phone" className="mb-2 block text-sm font-medium text-gray-900">
              Phone Number
            </label>
            <div className="relative">
              <input
                id="phone"
                name="phone"
                type="tel" // Changed to type="tel" for phone numbers
                autoComplete="off"
                placeholder="Enter phone number"
                // Applied styles from create-form.txt, kept pl-10
                className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 shadow-xs ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              <PhoneIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            </div>
          </div>

          {/* email label */}
          <div className="col-span-full">
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-900">
              E-mail
            </label>
            <div className="relative">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="off"
                placeholder="Enter e-mail"
                // Applied styles from create-form.txt, kept pl-10
                className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 shadow-xs ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            </div>
          </div>

          {/* message label */}
          <div className="col-span-full">
            <label htmlFor="message" className="mb-2 block text-sm font-medium text-gray-900">
              Message
            </label>
            <div className="relative">
              <textarea
                id="message"
                name="message"
                rows={3}
                autoComplete="off"
                placeholder="Enter message"
                // Applied styles from create-form.txt, kept pl-10
                className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 shadow-xs ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              {/* Adjusted icon position for better vertical alignment with py-1.5 */}
              <ChatBubbleBottomCenterTextIcon className="pointer-events-none absolute left-3 top-[calc(0.75rem+1px)] h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
              {/* Alternative for textarea icon positioning if the above isn't perfect: top-1/2 -translate-y-1/2 and adjust textarea padding-top if needed */}
            </div>
          </div>
          {/* submit button */}
          <div className="col-span-full"> {/* Changed col-start-1 to col-span-full for better layout */}
            <button
              type="submit"
              // Applied styles from create-form.txt's save button, kept w-full
              className="w-full rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Page;
