import { auth } from "@/auth";
import TopNav from "./top-nav";

const TopNavWrapper = async () => {
  const session = await auth();

  const showUserProfile = session ? true : false;

  return (
    <TopNav userImage={session?.user.image} showUserProfile={showUserProfile} />
  );
};

export default TopNavWrapper;
