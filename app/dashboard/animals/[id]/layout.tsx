import { IDParamType } from "@/app/lib/types";
import { AnimalNavTabs } from "@/components/dashboard/animals/animal-nav-tabs";
import AnimalSectionCards from "@/components/pet-section-cards";

interface Props {
  children: React.ReactNode;
  params: IDParamType;
}

const Layout = ({ children, params }: Props) => {
  return (
    <>
      <AnimalSectionCards params={params} />
      <AnimalNavTabs />
      {children}
    </>
  );
};

export default Layout;
