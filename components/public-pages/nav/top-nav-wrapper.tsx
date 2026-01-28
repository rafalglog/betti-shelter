import { auth } from "@/auth";
import TopNav from "./top-nav";
import { Role } from "@prisma/client";
import { getTranslations } from "next-intl/server";

const TopNavWrapper = async () => {
  const session = await auth();
  const showUserProfile = session ? true : false;
  const t = await getTranslations("nav");

  let dashboardHref = "/dashboard";
  if (session?.user?.role === Role.USER) {
    dashboardHref = "/dashboard/my-applications"; // Specific link for regular users
  }

  // Define the navigation links dynamically
  const navLinks = [
    { id: "home", name: t("home"), href: "/" },
    { id: "pets", name: t("pets"), href: "/pets" },
    { id: "about", name: t("about"), href: "/about" },
    { id: "contact", name: t("contact"), href: "/contact" },
    { id: "dashboard", name: t("dashboard"), href: dashboardHref }, // Use the dynamic href
  ];

  return (
    <TopNav
      userImage={session?.user.image}
      showUserProfile={showUserProfile}
      links={navLinks}
    />
  );
};

export default TopNavWrapper;
