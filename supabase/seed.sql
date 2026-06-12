insert into public.worlds (id, name, description, tone, rules)
values
  ('science_fiction', 'Ciencia ficcion', 'Naves, estaciones orbitales, IA y dilemas de supervivencia.', 'Asombro tecnico con tension humana.', '{"visualCue":"Orbitas, metal frio, luces de emergencia"}'),
  ('fantasy', 'Fantasia', 'Reinos, magia, criaturas antiguas y profecias personales.', 'Maravilla, destino y conflicto del corazon.', '{"visualCue":"Bosques imposibles, runas, antorchas"}'),
  ('mystery', 'Misterio', 'Secretos, pistas ambiguas y verdades ocultas.', 'Suspenso cerebral con revelaciones graduales.', '{"visualCue":"Sombras, lluvia, papeles marcados"}'),
  ('cyberpunk', 'Cyberpunk', 'Megaciudades, corporaciones, implantes y datos robados.', 'Tenso, urbano, brillante y moralmente gris.', '{"visualCue":"Neon, pantallas, callejones"}'),
  ('medieval', 'Medieval', 'Castillos, gremios, duelos y alianzas familiares.', 'Dramatico, politico y ligado a promesas.', '{"visualCue":"Piedra, mapas, sellos de cera"}'),
  ('real_world', 'Mundo real', 'Escenas contemporaneas, conversaciones dificiles y ciudad.', 'Intimo, cinematografico y cercano.', '{"visualCue":"Cafes, apartamentos, oficinas"}')
on conflict (id) do update set
  name = excluded.name,
  description = excluded.description,
  tone = excluded.tone,
  rules = excluded.rules,
  updated_at = now();

