// "use client";

// import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
// import { XMarkIcon } from "@heroicons/react/24/outline";
// import clsx from "clsx";
// import { Dispatch, SetStateAction } from "react";
// import type { NavItem } from "./nav-links.config";
// import SidebarContent from "./sidebar-content";

// interface Props {
//   isOpen: boolean;
//   setIsOpen: Dispatch<SetStateAction<boolean>>;
//   links: NavItem[];
//   quickActions: NavItem[];
// }

// const LeftFloatingNav = ({ isOpen, setIsOpen, links, quickActions }: Props) => {
//   return (
//     <>
//       <Dialog
//         open={isOpen}
//         onClose={() => setIsOpen(false)}
//         className="relative z-50"
//       >
//         <DialogBackdrop
//           transition
//           className="fixed inset-0 bg-black/50 duration-300 ease-out data-[closed]:opacity-0"
//         />

//         <div className="fixed inset-0 flex w-screen">
//           <DialogPanel
//             transition
//             className={clsx(
//               "flex flex-1 max-w-80 w-full mr-16 relative bg-white",
//               "transform transition-transform duration-300 ease-out",
//               "data-[closed]:-translate-x-full"
//             )}
//           >
//             {/* close button */}
//             <div className="pt-5 justify-center w-16 flex top-0 left-full absolute">
//               <button
//                 onClick={() => setIsOpen(false)}
//                 className="bg-white shadow rounded-full p-1 flex items-center justify-center"
//               >
//                 <XMarkIcon className="w-6 h-6 text-gray-700 hover:text-black" />
//               </button>
//             </div>

//             <SidebarContent links={links} quickActions={quickActions} />
//           </DialogPanel>
//         </div>
//       </Dialog>
//     </>
//   );
// };

// export default LeftFloatingNav;