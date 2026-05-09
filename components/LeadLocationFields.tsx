"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { BRAZIL_STATES } from "@/lib/brazil-states";
import { fetchMunicipiosByUf } from "@/lib/ibge-municipios";
import type { LeadFormData } from "@/lib/questionnaire-data";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const SELECT_NO_UF = "__nexar_select_no_uf__";
const SELECT_NO_CITY = "__nexar_select_no_city__";

const locationSelectTriggerClass = (hasError: boolean) =>
  cn(
    "h-auto min-h-[2.875rem] w-full rounded-xl border bg-dark-card px-4 py-3 text-sm text-on-dark transition-all",
    "shadow-none ring-offset-0 focus:ring-2 focus:ring-primary/50 focus:ring-offset-0",
    "disabled:cursor-not-allowed disabled:opacity-60",
    "data-[placeholder]:text-on-dark-muted/60",
    "justify-between gap-3 [&>span]:min-w-0 [&>span]:flex-1 [&>span]:text-left",
    "[&_svg]:pointer-events-none [&_svg]:ml-3 [&_svg]:mr-1 [&_svg]:h-[1.125rem] [&_svg]:w-[1.125rem] [&_svg]:shrink-0 [&_svg]:text-on-dark-muted",
    hasError ? "border-red-500" : "border-dark",
  );

const locationSelectContentClass = cn(
  "z-[250] max-h-[min(22rem,55vh)] overflow-hidden rounded-xl border border-dark bg-dark-card py-1.5 shadow-lg shadow-black/40",
  "text-on-dark [&_button]:bg-transparent [&_button]:text-on-dark-muted",
);

const locationSelectItemClass = cn(
  "cursor-pointer rounded-lg py-2.5 pl-9 pr-4 text-sm text-on-dark outline-none",
  "focus:bg-primary/20 focus:text-on-dark data-[highlighted]:bg-primary/15 data-[highlighted]:text-on-dark",
);

export type BrazilCitiesStatus = { loading: boolean; error: string | null };

type LeadLocationFieldsProps = {
  data: LeadFormData;
  mergeData: (partial: Partial<LeadFormData>) => void;
  errors: Record<string, string>;
  onBrazilFetchStatus: (status: BrazilCitiesStatus) => void;
};

export function LeadLocationFields({
  data,
  mergeData,
  errors,
  onBrazilFetchStatus,
}: LeadLocationFieldsProps) {
  const stateSelectId = useId();
  const citySelectId = useId();
  const intlCountryId = useId();
  const intlCityId = useId();
  const notBrId = useId();

  const brUfRef = useRef(data.brazil_state_uf);

  useLayoutEffect(() => {
    brUfRef.current = data.brazil_state_uf;
  }, [data.brazil_state_uf]);

  const [cityList, setCityList] = useState<string[]>([]);
  const [fetchLoading, setFetchLoading] = useState(
    () => !data.not_from_brazil && data.brazil_state_uf.trim().length > 0,
  );
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    onBrazilFetchStatus({ loading: fetchLoading, error: fetchError });
  }, [fetchLoading, fetchError, onBrazilFetchStatus]);

  useEffect(() => {
    if (data.not_from_brazil || !data.brazil_state_uf.trim()) {
      return;
    }

    const uf = data.brazil_state_uf.trim().toUpperCase();
    let cancelled = false;

    fetchMunicipiosByUf(uf)
      .then((list) => {
        if (cancelled) return;
        if (brUfRef.current.trim().toUpperCase() !== uf) return;
        setCityList(list);
        setFetchLoading(false);
        setFetchError(null);
      })
      .catch(() => {
        if (cancelled) return;
        if (brUfRef.current.trim().toUpperCase() !== uf) return;
        setCityList([]);
        setFetchLoading(false);
        setFetchError(
          "Não foi possível carregar as cidades deste estado. Verifique sua conexão ou tente outro estado.",
        );
      });

    return () => {
      cancelled = true;
    };
  }, [data.brazil_state_uf, data.not_from_brazil]);

  useEffect(() => {
    if (!data.brazil_city || cityList.length === 0 || fetchLoading) return;
    if (!cityList.includes(data.brazil_city)) {
      mergeData({ brazil_city: "" });
    }
  }, [cityList, data.brazil_city, fetchLoading, mergeData]);

  const brStateErr = errors.brazil_state_uf;
  const brCityErr = errors.brazil_city;
  const intlCountryErr = errors.international_country;
  const intlCityErr = errors.international_city;

  const cityPlaceholder = !data.brazil_state_uf
    ? "Selecione primeiro o estado"
    : fetchLoading
      ? "Carregando cidades…"
      : fetchError
        ? "Erro ao carregar — tente outro estado"
        : "Selecione a cidade";

  return (
    <div className="sm:col-span-2 space-y-4">
      {!data.not_from_brazil ? (
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor={stateSelectId} className="block text-sm font-medium text-on-dark mb-1.5">
              Estado
            </label>
            <Select
              value={data.brazil_state_uf ? data.brazil_state_uf : SELECT_NO_UF}
              onValueChange={(uf) =>
                mergeData({
                  brazil_state_uf: uf === SELECT_NO_UF ? "" : uf,
                  brazil_city: "",
                })
              }
            >
              <SelectTrigger
                id={stateSelectId}
                aria-invalid={Boolean(brStateErr)}
                aria-describedby={brStateErr ? `${stateSelectId}-err` : undefined}
                className={locationSelectTriggerClass(Boolean(brStateErr))}
              >
                <SelectValue placeholder="Selecione o estado" />
              </SelectTrigger>
              <SelectContent className={locationSelectContentClass} position="popper" sideOffset={8}>
                <SelectItem
                  value={SELECT_NO_UF}
                  className={cn(locationSelectItemClass, "text-on-dark-muted")}
                >
                  Selecione o estado
                </SelectItem>
                {BRAZIL_STATES.map((s) => (
                  <SelectItem key={s.uf} value={s.uf} className={locationSelectItemClass}>
                    {s.name} ({s.uf})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {brStateErr ? (
              <p id={`${stateSelectId}-err`} className="text-xs text-red-400 mt-1" role="alert">
                {brStateErr}
              </p>
            ) : null}
          </div>
          <div>
            <label htmlFor={citySelectId} className="block text-sm font-medium text-on-dark mb-1.5">
              Cidade
            </label>
            <Select
              value={data.brazil_city ? data.brazil_city : SELECT_NO_CITY}
              onValueChange={(cidade) =>
                mergeData({ brazil_city: cidade === SELECT_NO_CITY ? "" : cidade })
              }
              disabled={!data.brazil_state_uf || fetchLoading || Boolean(fetchError)}
            >
              <SelectTrigger
                id={citySelectId}
                aria-invalid={Boolean(brCityErr || fetchError)}
                aria-describedby={
                  brCityErr || fetchError ? `${citySelectId}-err` : undefined
                }
                className={locationSelectTriggerClass(Boolean(brCityErr || fetchError))}
              >
                <SelectValue placeholder={cityPlaceholder} />
              </SelectTrigger>
              <SelectContent className={locationSelectContentClass} position="popper" sideOffset={8}>
                <SelectItem
                  value={SELECT_NO_CITY}
                  className={cn(locationSelectItemClass, "text-on-dark-muted")}
                >
                  {cityPlaceholder}
                </SelectItem>
                {cityList.map((nome) => (
                  <SelectItem key={nome} value={nome} className={locationSelectItemClass}>
                    {nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {brCityErr || fetchError ? (
              <p id={`${citySelectId}-err`} className="text-xs text-red-400 mt-1" role="alert">
                {brCityErr || fetchError}
              </p>
            ) : null}
          </div>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor={intlCountryId} className="block text-sm font-medium text-on-dark mb-1.5">
              País
            </label>
            <input
              id={intlCountryId}
              type="text"
              value={data.international_country}
              onChange={(e) => mergeData({ international_country: e.target.value })}
              placeholder="Ex.: Portugal"
              autoComplete="country-name"
              aria-invalid={Boolean(intlCountryErr)}
              aria-describedby={intlCountryErr ? `${intlCountryId}-err` : undefined}
              className={`w-full rounded-xl bg-dark-card border ${
                intlCountryErr ? "border-red-500" : "border-dark"
              } px-4 py-3 text-sm text-on-dark placeholder:text-on-dark-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all`}
            />
            {intlCountryErr ? (
              <p id={`${intlCountryId}-err`} className="text-xs text-red-400 mt-1" role="alert">
                {intlCountryErr}
              </p>
            ) : null}
          </div>
          <div>
            <label htmlFor={intlCityId} className="block text-sm font-medium text-on-dark mb-1.5">
              Cidade
            </label>
            <input
              id={intlCityId}
              type="text"
              value={data.international_city}
              onChange={(e) => mergeData({ international_city: e.target.value })}
              placeholder="Ex.: Lisboa"
              autoComplete="address-level2"
              aria-invalid={Boolean(intlCityErr)}
              aria-describedby={intlCityErr ? `${intlCityId}-err` : undefined}
              className={`w-full rounded-xl bg-dark-card border ${
                intlCityErr ? "border-red-500" : "border-dark"
              } px-4 py-3 text-sm text-on-dark placeholder:text-on-dark-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all`}
            />
            {intlCityErr ? (
              <p id={`${intlCityId}-err`} className="text-xs text-red-400 mt-1" role="alert">
                {intlCityErr}
              </p>
            ) : null}
          </div>
        </div>
      )}

      <div className="flex items-start gap-3 pt-1">
        <input
          id={notBrId}
          type="checkbox"
          checked={data.not_from_brazil}
          onChange={(e) => {
            const checked = e.target.checked;
            mergeData(
              checked
                ? {
                    not_from_brazil: true,
                    brazil_state_uf: "",
                    brazil_city: "",
                  }
                : {
                    not_from_brazil: false,
                    international_country: "",
                    international_city: "",
                  },
            );
          }}
          className="mt-1 h-4 w-4 shrink-0 rounded border-dark bg-dark-card text-primary focus:ring-2 focus:ring-primary/50 focus:ring-offset-0 focus:ring-offset-dark-base"
        />
        <label htmlFor={notBrId} className="text-sm text-on-dark leading-snug cursor-pointer">
          Não sou do Brasil
        </label>
      </div>
    </div>
  );
}
