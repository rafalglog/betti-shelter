import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";

interface Props {
  petName: string;
  petBreed: string | null;
  petSpecies: string;
}

const AppPetMessage = ({ petName, petBreed, petSpecies }: Props) => {
  return (
    <div className="p-4 my-8 bg-amber-50 border-l-3 border-amber-300 flex items-start">
      <ExclamationTriangleIcon className="size-5 text-amber-400 mr-4 flex-shrink-0" />
      <p className="text-amber-800">
        You are applying to adopt{" "}
        <strong className="font-semibold text-amber-900">
          {petName}
        </strong>
        , a wonderful{" "}
        {petBreed
          ? `${petBreed} (${petSpecies})`
          : petSpecies}
        . Please complete the form below.
      </p>
    </div>
  );
};

export default AppPetMessage;