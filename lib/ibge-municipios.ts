/**
 * Municípios por UF — API oficial do IBGE (sem chave).
 */

const CACHE = new Map<string, string[]>();

type IbgeMunicipio = { nome: string };

function normalizeUf(uf: string): string {
  return uf.trim().toUpperCase();
}

export async function fetchMunicipiosByUf(uf: string): Promise<string[]> {
  const key = normalizeUf(uf);
  if (!key) return [];

  const hit = CACHE.get(key);
  if (hit) return hit;

  const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${encodeURIComponent(key)}/municipios`;

  const res = await fetch(url).catch(() => null);
  if (!res?.ok) {
    throw new Error(`IBGE: falha ao carregar municípios (${res?.status ?? "rede"})`);
  }

  const data = (await res.json()) as IbgeMunicipio[];
  if (!Array.isArray(data)) {
    throw new Error("IBGE: resposta inesperada");
  }

  const names = data
    .map((m) => m.nome?.trim())
    .filter((n): n is string => Boolean(n))
    .sort((a, b) => a.localeCompare(b, "pt-BR"));

  CACHE.set(key, names);
  return names;
}
