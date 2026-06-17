

export interface CountryInfo {
  label: string;      
  docLabel: string;   
}

export const COUNTRIES: Record<string, CountryInfo> = {
  'Perú':              { label: 'Perú',              docLabel: 'DNI / RUC' },
  'Argentina':         { label: 'Argentina',         docLabel: 'DNI / CUIT' },
  'Bolivia':           { label: 'Bolivia',           docLabel: 'CI / NIT' },
  'Brasil':            { label: 'Brasil',            docLabel: 'CPF / CNPJ' },
  'Chile':             { label: 'Chile',             docLabel: 'RUT' },
  'Colombia':          { label: 'Colombia',          docLabel: 'CC / NIT' },
  'Costa Rica':        { label: 'Costa Rica',        docLabel: 'Cédula / RUC' },
  'Cuba':              { label: 'Cuba',              docLabel: 'Carné de Identidad' },
  'Ecuador':           { label: 'Ecuador',           docLabel: 'CI / RUC' },
  'El Salvador':       { label: 'El Salvador',       docLabel: 'DUI / NIT' },
  'España':            { label: 'España',            docLabel: 'DNI / NIF' },
  'Estados Unidos':    { label: 'Estados Unidos',    docLabel: 'SSN / EIN' },
  'Guatemala':         { label: 'Guatemala',         docLabel: 'DPI / NIT' },
  'Honduras':          { label: 'Honduras',          docLabel: 'DNI / RTN' },
  'México':            { label: 'México',            docLabel: 'CURP / RFC' },
  'Nicaragua':         { label: 'Nicaragua',         docLabel: 'Cédula / RUC' },
  'Panamá':            { label: 'Panamá',            docLabel: 'Cédula / RUC' },
  'Paraguay':          { label: 'Paraguay',          docLabel: 'CI / RUC' },
  'Puerto Rico':       { label: 'Puerto Rico',       docLabel: 'SSN / EIN' },
  'República Dominicana': { label: 'República Dominicana', docLabel: 'Cédula / RNC' },
  'Uruguay':           { label: 'Uruguay',           docLabel: 'CI / RUT' },
  'Venezuela':         { label: 'Venezuela',         docLabel: 'CI / RIF' },
  'Alemania':          { label: 'Alemania',          docLabel: 'Personalausweis / Steuernummer' },
  'Canada':            { label: 'Canada',            docLabel: 'SIN / BN' },
  'China':             { label: 'China',             docLabel: 'Número de Identidad' },
  'Francia':           { label: 'Francia',           docLabel: 'Carte Nationale d\'Identité / SIREN' },
  'Italia':            { label: 'Italia',            docLabel: 'Codice Fiscale / P.IVA' },
  'Japón':             { label: 'Japón',             docLabel: 'My Number' },
  'Portugal':          { label: 'Portugal',          docLabel: 'NIF' },
  'Reino Unido':       { label: 'Reino Unido',       docLabel: 'NIN / UTR' },
  'Otro':              { label: 'Otro',              docLabel: 'Nro. Documento' },
};

export const COUNTRY_OPTIONS = [
  'Perú',
  ...Object.keys(COUNTRIES)
    .filter((k) => k !== 'Perú' && k !== 'Otro')
    .sort((a, b) => a.localeCompare(b, 'es')),
  'Otro',
];

 
export function getDocLabel(pais: string | null | undefined): string {
  if (!pais) return 'Nro. Documento';
  return COUNTRIES[pais]?.docLabel ?? 'Nro. Documento';
}
