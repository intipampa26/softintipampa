import { z } from 'zod';

const medicionSchema = z.object({
  valor1: z.coerce.number().nullable().optional(),
  valor2: z.coerce.number().nullable().optional(),
});

const conteoSchema = z.object({
  valor1: z.coerce.number().int().min(0).nullable().optional(),
  valor2: z.coerce.number().int().min(0).nullable().optional(),
});

export const registroMuestraSchema = z.object({
  idMuestra:      z.string().min(1, 'Requerido'),
  fechaIngreso:   z.string().min(1, 'Requerido'),
  productor:      z.string().min(1, 'Requerido'),
  distrito:       z.string().min(1, 'Requerido'),
  variedad:       z.string().optional(),
  fechaCosecha:   z.string().optional(),

  peso100Granos:  medicionSchema,
  humedad:        medicionSchema,
  indiceGrano:    medicionSchema,

  bienFermentados:          conteoSchema,
  medianamenteFermentados:  conteoSchema,
  granosVioletas:           conteoSchema,
  granosPizarrosos:         conteoSchema,

  danadosPorInsectos: conteoSchema,
  granosGerminados:   conteoSchema,
  granosMohosos:      conteoSchema,
  calificacionMuestra: z.enum(['excelente', 'buena', 'regular', 'defectuosa']).optional(),

  aromaApariencia: z.string().optional(),
  fechaEvaluacion: z.string().optional(),
  evaluador:       z.string().optional(),
});

export type RegistroMuestraForm = z.infer<typeof registroMuestraSchema>;

export const mockRegistroMuestra: RegistroMuestraForm = {
  idMuestra:    'MU-2026-001',
  fechaIngreso: '2026-05-25',
  productor:    'Jorge Huamán Quispe',
  distrito:     'San Ignacio',
  variedad:     'Caturra / Catimor',
  fechaCosecha: '2026-04-20',

  peso100Granos: { valor1: 142.5, valor2: 143.0 },
  humedad:       { valor1: 11.2,  valor2: 11.4  },
  indiceGrano:   { valor1: 1.43,  valor2: 1.43  },

  bienFermentados:         { valor1: 34, valor2: 35 },
  medianamenteFermentados: { valor1: 8,  valor2: 7  },
  granosVioletas:          { valor1: 4,  valor2: 4  },
  granosPizarrosos:        { valor1: 4,  valor2: 4  },

  danadosPorInsectos: { valor1: 1, valor2: 2 },
  granosGerminados:   { valor1: 0, valor2: 1 },
  granosMohosos:      { valor1: 2, valor2: 1 },
  calificacionMuestra: 'buena',

  aromaApariencia: 'Aroma agradable, notas frutales y a nuez. Apariencia homogénea con buena uniformidad de color.',
  fechaEvaluacion: '2026-05-25',
  evaluador:       'María González',
};
