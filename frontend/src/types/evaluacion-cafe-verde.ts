import { z } from 'zod';

const defectoSchema = z.object({
  granos: z.coerce.number().int().min(0).nullable().optional(),
});

export const evaluacionCafeVerdeSchema = z.object({
  nombre:    z.string().optional(),
  fecha:     z.string().min(1, 'Requerido'),
  muestraNo: z.string().optional(),
  evaluador: z.string().optional(),

  negroCompleto:   defectoSchema,
  agrioCompleto:   defectoSchema,
  cerezaSeca:      defectoSchema,
  danoHongos:      defectoSchema,
  materiaExtrana:  defectoSchema,
  brocaSevera:     defectoSchema,

  negroParcial:   defectoSchema,
  agrioPartial:   defectoSchema,
  pergamino:      defectoSchema,
  flotador:       defectoSchema,
  inmaduro:       defectoSchema,
  averanado:      defectoSchema,
  conchas:        defectoSchema,
  rotosPartidos:  defectoSchema,
  cascaras:       defectoSchema,
  brocaLeve:      defectoSchema,

  tostadoMuestraNo: z.string().optional(),
  tostadoColor:     z.string().optional(),
  tostadoOlor:      z.string().optional(),
  tostadoQuakers:   z.coerce.number().int().min(0).nullable().optional(),
  tostadoGrado:     z.string().optional(),

  observaciones: z.string().optional(),
});

export type EvaluacionCafeVerdeForm = z.infer<typeof evaluacionCafeVerdeSchema>;

export const mockEvaluacionCafeVerde: EvaluacionCafeVerdeForm = {
  nombre:    '',
  fecha:     new Date().toISOString().slice(0, 10),
  muestraNo: '',
  evaluador: '',

  negroCompleto:  { granos: 0 },
  agrioCompleto:  { granos: 0 },
  cerezaSeca:     { granos: 0 },
  danoHongos:     { granos: 0 },
  materiaExtrana: { granos: 0 },
  brocaSevera:    { granos: 0 },

  negroParcial:   { granos: 0 },
  agrioPartial:   { granos: 0 },
  pergamino:      { granos: 0 },
  flotador:       { granos: 0 },
  inmaduro:       { granos: 0 },
  averanado:      { granos: 0 },
  conchas:        { granos: 0 },
  rotosPartidos:  { granos: 0 },
  cascaras:       { granos: 0 },
  brocaLeve:      { granos: 0 },

  tostadoMuestraNo: '',
  tostadoColor:     '',
  tostadoOlor:      '',
  tostadoQuakers:   0,
  tostadoGrado:     '',

  observaciones: '',
};
