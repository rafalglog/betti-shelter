import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { IntakeType } from "@prisma/client";
import { intakeTypeOptions } from "@/app/lib/utils/enum-formatter";
import { US_STATES } from "@/app/lib/constants/us-states";
import { PartnerPayload } from "@/app/lib/types";
import { Control, UseFormWatch } from "react-hook-form";
import { useTranslations } from "next-intl";

interface IntakeFormFieldsProps {
  control: Control<any>;
  watch: UseFormWatch<any>;
  partners: PartnerPayload[];
  isEditMode?: boolean;
}

export const IntakeFormFields = ({
  control,
  watch,
  partners,
  isEditMode = false,
}: IntakeFormFieldsProps) => {
  const t = useTranslations("dashboard");
  const intakeType = watch("intakeType");

  return (
    <div className="space-y-6">
      <h3 className="font-semibold border-b pb-2">
        {t("intake.sectionTitle")}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-6 gap-x-4 gap-y-8">
        <FormField
          control={control}
          name="intakeType"
          render={({ field }) => (
            <FormItem className="col-span-3">
              <FormLabel>{t("intake.typeLabel")}</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={isEditMode}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t("intake.typePlaceholder")} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {intakeTypeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {t(`intake.typeOptions.${option.value}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="intakeDate"
          render={({ field }) => (
            <FormItem className="col-span-3">
              <FormLabel>{t("intake.dateLabel")}</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                      disabled={isEditMode}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>{t("intake.datePlaceholder")}</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    autoFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="notes"
          render={({ field }) => (
            <FormItem className="col-span-full">
              <FormLabel>{t("intake.notesLabel")}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t("intake.notesPlaceholder")}
                  {...field}
                  disabled={isEditMode}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Conditional Source Fields */}
      <div className="pt-6">
        {!isEditMode && !intakeType && (
          <p className="text-sm text-center text-muted-foreground p-4 border border-dashed rounded-md">
            {t("intake.selectTypeHint")}
          </p>
        )}

        {intakeType === IntakeType.TRANSFER_IN && (
          <div className="grid grid-cols-1 md:grid-cols-6 gap-x-4 gap-y-8 p-4 border rounded-md">
            <h4 className="font-semibold col-span-full">
              {t("intake.transfer.title")}
            </h4>
            <FormField
              control={control}
              name="sourcePartnerId"
              render={({ field }) => (
                <FormItem className="col-span-full">
                  <FormLabel>{t("intake.transfer.partnerLabel")}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isEditMode}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={t("intake.transfer.partnerPlaceholder")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {partners.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        {intakeType === IntakeType.STRAY && (
          <div className="grid grid-cols-1 md:grid-cols-6 gap-x-4 gap-y-8 p-4 border rounded-md">
            <h4 className="font-semibold col-span-full">
              {t("intake.stray.title")}
            </h4>
            <FormField
              control={control}
              name="foundCity"
              render={({ field }) => (
                <FormItem className="col-span-3">
                  <FormLabel>{t("intake.stray.cityLabel")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("intake.stray.cityPlaceholder")}
                      {...field}
                      disabled={isEditMode}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="foundState"
              render={({ field }) => (
                <FormItem className="col-span-3">
                  <FormLabel>{t("intake.stray.stateLabel")}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isEditMode}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={t("intake.stray.statePlaceholder")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {US_STATES.map((state) => (
                        <SelectItem key={state.code} value={state.code}>
                          {state.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="foundAddress"
              render={({ field }) => (
                <FormItem className="col-span-full">
                  <FormLabel>{t("intake.stray.addressLabel")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("intake.stray.addressPlaceholder")}
                      {...field}
                      disabled={isEditMode}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        {intakeType === IntakeType.OWNER_SURRENDER && (
          <div className="grid grid-cols-1 md:grid-cols-6 gap-x-4 gap-y-8 p-4 border rounded-md">
            <h4 className="font-semibold col-span-full">
              {t("intake.surrender.title")}
            </h4>
            <FormField
              control={control}
              name="surrenderingPersonName"
              render={({ field }) => (
                <FormItem className="col-span-3">
                  <FormLabel>{t("intake.surrender.nameLabel")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("intake.surrender.namePlaceholder")}
                      {...field}
                      disabled={isEditMode}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="surrenderingPersonPhone"
              render={({ field }) => (
                <FormItem className="col-span-3">
                  <FormLabel>{t("intake.surrender.phoneLabel")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("intake.surrender.phonePlaceholder")}
                      {...field}
                      disabled={isEditMode}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}
      </div>
    </div>
  );
};
