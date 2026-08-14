/* ============================================================
   SYSTEM LAB · data/module3.js
   Módulo 3 — Clasificación de sistemas.
   El alumno construye el perfil del sistema en 4 ejes:
   Naturaleza, Representación, Relación con el ambiente y
   Comportamiento.
   ============================================================ */
(function (SL) {
  "use strict";

  SL.Data = SL.Data || {};

  SL.Data.module3 = {
    id: "module3",
    name: "Módulo 3",
    title: "Clasificación de Sistemas",
    icon: "dna",
    description:
      "Clasifica cada sistema construyendo su perfil completo. Analiza su naturaleza, su representación, su relación con el ambiente y su comportamiento.",
    systems: [
      {
        id: "ser_humano",
        name: "Ser humano",
        icon: "user",
        description: "Organismo biológico complejo que nace, crece, se desarrolla y mantiene constantes sus condiciones internas.",
        profile: { naturaleza: "viviente", representacion: "concreto", ambiente: "abierto", comportamiento: "homeostatico" },
        justification: "El ser humano es viviente porque tiene vida y se desarrolla; es concreto por su existencia física; es abierto porque intercambia materia, energía e información (respira, come, percibe) con su ambiente; y es homeostático porque regula su temperatura y otras condiciones para mantenerse en equilibrio."
      },
      {
        id: "automovil",
        name: "Automóvil",
        icon: "cube",
        description: "Vehículo de transporte que consume combustible y desplaza personas o carga mediante sus mecanismos.",
        profile: { naturaleza: "no_viviente", representacion: "concreto", ambiente: "abierto", comportamiento: "dinamico" },
        justification: "El automóvil es no viviente porque no tiene vida; es concreto porque existe físicamente; es abierto porque intercambia materia y energía (combustible, gases, calor) con su ambiente; y es dinámico porque se desplaza y cambia de estado con el tiempo."
      },
      {
        id: "idioma",
        name: "Idioma",
        icon: "idea",
        description: "Sistema de signos y reglas que una comunidad usa para comunicarse.",
        profile: { naturaleza: "no_viviente", representacion: "abstracto", ambiente: "abierto", comportamiento: "dinamico" },
        justification: "El idioma es no viviente porque no tiene vida biológica; es abstracto porque existe como sistema de signos y reglas sin cuerpo físico; es abierto porque toma y aporta palabras e influencias de otros idiomas; y es dinámico porque evoluciona y cambia con el uso de la comunidad."
      },
      {
        id: "software",
        name: "Software",
        icon: "idea",
        description: "Conjunto de programas e instrucciones que procesan datos y controlan una computadora.",
        profile: { naturaleza: "no_viviente", representacion: "abstracto", ambiente: "abierto", comportamiento: "dinamico" },
        justification: "El software es no viviente porque no posee vida; es abstracto porque es un conjunto de instrucciones lógicas sin existencia física (su soporte es físico, pero él mismo es conceptual); es abierto porque recibe datos del ambiente y devuelve resultados; y es dinámico porque se actualiza, cambia de versión y evoluciona."
      },
      {
        id: "universidad",
        name: "Universidad",
        icon: "book",
        description: "Organización dedicada a la enseñanza superior, la investigación y la difusión del conocimiento.",
        profile: { naturaleza: "no_viviente", representacion: "concreto", ambiente: "abierto", comportamiento: "dinamico" },
        justification: "La universidad es no viviente porque como organización no tiene vida biológica; es concreto porque existe físicamente con instalaciones y recursos; es abierto porque intercambia información, personas y recursos con la sociedad; y es dinámico porque sus planes, grupos y procesos cambian con el tiempo."
      },
      {
        id: "familia",
        name: "Familia",
        icon: "heart",
        description: "Grupo de personas unidas por vínculos que conviven y se apoyan.",
        profile: { naturaleza: "viviente", representacion: "concreto", ambiente: "abierto", comportamiento: "homeostatico" },
        justification: "La familia es viviente porque está formada por personas vivas; es concreta porque sus integrantes existen físicamente; es abierta porque convive e intercambia con la comunidad y la sociedad; y es homeostática porque regula normas, roles y rutinas para mantener el equilibrio y la estabilidad del grupo."
      },
      {
        id: "ecosistema",
        name: "Ecosistema",
        icon: "leaf",
        description: "Comunidad de seres vivos que interactúa con su ambiente físico (agua, suelo, clima).",
        profile: { naturaleza: "viviente", representacion: "concreto", ambiente: "abierto", comportamiento: "homeostatico" },
        justification: "El ecosistema es viviente porque está formado por seres vivos; es concreto porque existe físicamente en un territorio; es abierto porque recibe y cede materia y energía (luz solar, nutrientes, calor); y es homeostático porque tiende a autorregularse para mantener su equilibrio ecológico."
      },
      {
        id: "reloj",
        name: "Reloj",
        icon: "cube",
        description: "Mecanismo que mide el paso del tiempo mediante movimientos constantes y regulares.",
        profile: { naturaleza: "no_viviente", representacion: "concreto", ambiente: "cerrado", comportamiento: "estatico" },
        justification: "El reloj es no viviente porque carece de vida; es concreto porque existe físicamente; es cerrado porque una vez en funcionamiento no requiere intercambio con su ambiente para realizar su función; y es estático porque su estructura y su mecánica permanecen sin cambios a lo largo del tiempo."
      },
      {
        id: "organizacion",
        name: "Organización",
        icon: "layers",
        description: "Empresa o institución que coordina personas, recursos y procesos para lograr objetivos.",
        profile: { naturaleza: "no_viviente", representacion: "concreto", ambiente: "abierto", comportamiento: "dinamico" },
        justification: "La organización es no viviente porque como entidad no tiene vida biológica; es concreta porque existe físicamente con instalaciones y equipos; es abierta porque intercambia información, dinero, personas y materiales con su ambiente; y es dinámica porque sus estrategias y procesos se transforman continuamente."
      },
      {
        id: "maquina_industrial",
        name: "Máquina industrial",
        icon: "cog",
        description: "Equipo de producción que recibe materia y energía y las convierte en productos.",
        profile: { naturaleza: "no_viviente", representacion: "concreto", ambiente: "abierto", comportamiento: "dinamico" },
        justification: "La máquina industrial es no viviente porque carece de vida; es concreta porque existe físicamente; es abierta porque recibe materia y energía del ambiente y entrega sus productos; y es dinámica porque opera, se mueve y cambia de estado continuamente mientras funciona."
      }
    ]
  };
})(window.SystemLab = window.SystemLab || {});
