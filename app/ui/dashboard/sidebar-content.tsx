// "use client";

// import { LifebuoyIcon } from "@heroicons/react/24/solid";
// import NavLinks from "./nav-links";
// import type { NavItem } from "./nav-links.config";

// interface SidebarContentProps {
//   links: NavItem[];
//   quickActions: NavItem[];
// }

// const SidebarContent = ({ links, quickActions }: SidebarContentProps) => {
//   return (
//     <div className="antialiased px-6 overflow-auto gap-y-5 flex-col flex-grow flex bg-[#fcfdff]">
//       <div className="-mx-6 pl-6 border-b py-4 items-center flex-shrink-0 h-16 flex gap-x-2">
//         <div className="w-9 h-9 rounded-full items-center flex justify-center">
//           <LifebuoyIcon className="size-7 text-indigo-600" />
//         </div>
//         <div className="text-lg flex font-bold font-opensans text-indigo-700">
//           Pet Adopt
//         </div>
//       </div>
//       <NavLinks links={links} quickActions={quickActions} />
//     </div>
//   );
// };

// export default SidebarContent;