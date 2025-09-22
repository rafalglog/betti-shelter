import AnimalForm from "@/app/ui/dashboard/pets/animal-form";
import { fetchSpecies } from "@/app/lib/data/animals/public.data";
import { Permissions } from "@/app/lib/auth/permissions";
import { Authorize } from "@/app/ui/auth/authorize";
import PageNotFoundOrAccessDenied from "@/app/ui/PageNotFoundOrAccessDenied";

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
  const speciesList = await fetchSpecies();

  return (
    <main>
      <AnimalForm
        speciesList={speciesList}
      />
    </main>
  );
}

export default Page;