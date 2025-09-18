import CreateAnimalForm from "@/app/ui/dashboard/pets/animal-create-form";
import { Permissions } from "@/app/lib/auth/permissions";
import { Authorize } from "@/app/ui/auth/authorize";
import PageNotFoundOrAccessDenied from "@/app/ui/PageNotFoundOrAccessDenied";
import { fetchColors, fetchPartners, fetchSpecies } from "@/app/lib/data/animals/animal.data";

const Page = async () => {
  return (
    <Authorize
      permission={Permissions.ANIMAL_CREATE}
      fallback={<PageNotFoundOrAccessDenied type="accessDenied" />}
    >
      <PageContent />
    </Authorize>
  );
};

const PageContent = async () => {
  const partners = await fetchPartners();
  const colors = await fetchColors();
  const speciesList = await fetchSpecies();

  return (
    <main>
      <CreateAnimalForm
        speciesList={speciesList}
        partners={partners}
        colors={colors}
      />
    </main>
  );
}

export default Page;