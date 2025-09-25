import AnimalForm from "@/components/dashboard/animals/animal-form";
import { fetchSpecies } from "@/app/lib/data/animals/public.data";
import { Permissions } from "@/app/lib/auth/permissions";
import { Authorize } from "@/components/auth/authorize";
import PageNotFoundOrAccessDenied from "@/components/PageNotFoundOrAccessDenied";

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