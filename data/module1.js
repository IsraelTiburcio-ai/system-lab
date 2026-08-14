/* ============================================================
   SYSTEM LAB · data/module1.js
   Módulo 1 — Anatomía del sistema.
   Escenarios de arrastre: Entrada, Proceso, Salida,
   Retroalimentación y Medio ambiente.
   Cada tarjeta: { id, text, category, feedback (acierto), hint }
   ============================================================ */
(function (SL) {
  "use strict";

  SL.Data = SL.Data || {};

  SL.Data.module1 = {
    id: "module1",
    name: "Módulo 1",
    title: "Anatomía del Sistema",
    icon: "layers",
    description:
      "Cada sistema real se puede desarmar en componentes: entrada, proceso, salida, retroalimentación y medio ambiente. Arrastra cada elemento a su zona.",
    scenarios: [
      {
        id: "cafeteria",
        name: "Cafetería Universitaria",
        emoji: "☕",
        context:
          "Analiza la cafetería del campus como un sistema: recibe pedidos e ingredientes, los transforma y entrega alimentos a los estudiantes.",
        hint:
          "Recuerda: la ENTRADA llega de fuera y da arranque; el PROCESO transforma; la SALIDA es el resultado; la RETROALIMENTACIÓN ajusta; el MEDIO AMBIENTE rodea al sistema.",
        cards: [
          {
            id: "caf_pedidos",
            text: "Pedidos de los clientes",
            category: "entrada",
            feedback: "Correcto. El pedido funciona como entrada porque proporciona información que el sistema deberá procesar.",
            hint: "¿El pedido entra al sistema para ser procesado o es un resultado?"
          },
          {
            id: "caf_ingredientes",
            text: "Ingredientes y materias primas",
            category: "entrada",
            feedback: "Correcto. Los ingredientes ingresan a la cafetería y dan arranque a la preparación de alimentos.",
            hint: "¿Los ingredientes llegan desde fuera del sistema para ser transformados?"
          },
          {
            id: "caf_preparacion",
            text: "Preparación de los alimentos",
            category: "proceso",
            feedback: "Correcto. La preparación es el proceso que transforma ingredientes y pedidos en comida lista.",
            hint: "¿Quién transforma los ingredientes y pedidos en comida lista?"
          },
          {
            id: "caf_comida",
            text: "Comida preparada y entregada",
            category: "salida",
            feedback: "Correcto. La comida preparada es el resultado que la cafetería entrega después del proceso.",
            hint: "¿Qué resultado produce la cafetería al terminar el proceso?"
          },
          {
            id: "caf_encuesta",
            text: "Encuesta de satisfacción",
            category: "retroalimentacion",
            feedback: "Correcto. La opinión de los clientes regresa al sistema para ajustar menús y servicio.",
            hint: "¿Qué información regresa a la cafetería después del resultado para permitir ajustes?"
          },
          {
            id: "caf_universidad",
            text: "Universidad y contexto del campus",
            category: "medio_ambiente",
            feedback: "Correcto. La universidad es el entorno que rodea a la cafetería y con el cual interactúa.",
            hint: "¿Qué rodea externamente a la cafetería y con lo cual interactúa sin ser parte de su operación interna?"
          },
          {
            id: "caf_reglas",
            text: "Reglamentos y normas de la universidad",
            category: "medio_ambiente",
            feedback: "Correcto. Las normas externas condicionan a la cafetería pero no forman parte de su proceso interno.",
            hint: "¿Las normas de la universidad están dentro de la cafetería o la rodean desde fuera?"
          }
        ]
      },
      {
        id: "hospital",
        name: "Hospital",
        emoji: "🏥",
        context:
          "Analiza un hospital como sistema: ingresan pacientes e información clínica, se transforman mediante el diagnóstico y el tratamiento, y entregan pacientes atendidos.",
        hint:
          "Identifica qué entra al hospital, qué transforma la atención, qué resulta de ella, qué información regresa y qué rodea al hospital.",
        cards: [
          {
            id: "hosp_pacientes",
            text: "Pacientes que requieren atención",
            category: "entrada",
            feedback: "Correcto. Los pacientes ingresan al hospital y dan arranque al proceso de atención.",
            hint: "¿Los pacientes llegan desde fuera del hospital para ser atendidos?"
          },
          {
            id: "hosp_clinica",
            text: "Información clínica e historial médico",
            category: "entrada",
            feedback: "Correcto. La información clínica entra al sistema para orientar el diagnóstico.",
            hint: "¿El historial médico entra al hospital como información para procesar?"
          },
          {
            id: "hosp_diagnostico",
            text: "Diagnóstico y tratamiento",
            category: "proceso",
            feedback: "Correcto. El diagnóstico y el tratamiento transforman la información y la condición del paciente en atención.",
            hint: "¿Qué mecanismo transforma la información clínica en atención médica?"
          },
          {
            id: "hosp_atendido",
            text: "Paciente atendido y recuperado",
            category: "salida",
            feedback: "Correcto. El paciente atendido es el resultado que el hospital entrega tras el proceso.",
            hint: "¿Qué resultado produce el hospital al finalizar la atención?"
          },
          {
            id: "hosp_seguimiento",
            text: "Seguimiento médico del paciente",
            category: "retroalimentacion",
            feedback: "Correcto. El seguimiento regresa información al sistema para ajustar el tratamiento.",
            hint: "¿Qué información regresa al hospital después del alta para verificar y ajustar?"
          },
          {
            id: "hosp_contexto",
            text: "Contexto sanitario y comunidad",
            category: "medio_ambiente",
            feedback: "Correcto. El contexto sanitario rodea al hospital y condiciona su funcionamiento.",
            hint: "¿Qué entorno rodea al hospital desde afuera?"
          }
        ]
      },
      {
        id: "tienda",
        name: "Tienda en línea",
        emoji: "🛒",
        context:
          "Analiza una tienda en línea como sistema: recibe pedidos, los procesa y envía paquetes; las reseñas y el mercado la rodean y la ajustan.",
        hint:
          "Pregúntate qué entra (pedidos, inventario), qué transforma, qué resultado entrega, qué información regresa y qué la rodea.",
        cards: [
          {
            id: "tie_pedidos",
            text: "Pedidos realizados por los clientes",
            category: "entrada",
            feedback: "Correcto. Los pedidos ingresan a la tienda como información que el sistema deberá procesar.",
            hint: "¿Los pedidos entran a la tienda desde fuera para ser procesados?"
          },
          {
            id: "tie_inventario",
            text: "Inventario de productos disponibles",
            category: "entrada",
            feedback: "Correcto. El inventario es un insumo que el sistema utiliza para surtir los pedidos.",
            hint: "¿El inventario ingresa al sistema como insumo para atender los pedidos?"
          },
          {
            id: "tie_procesamiento",
            text: "Procesamiento del pedido: pago y empaque",
            category: "proceso",
            feedback: "Correcto. El procesamiento transforma el pedido y el inventario en un paquete listo para enviar.",
            hint: "¿Qué etapa transforma el pedido en un paquete listo para enviar?"
          },
          {
            id: "tie_paquete",
            text: "Paquete enviado al cliente",
            category: "salida",
            feedback: "Correcto. El paquete enviado es el resultado que la tienda entrega al cliente.",
            hint: "¿Qué resultado entrega la tienda después de procesar el pedido?"
          },
          {
            id: "tie_resenas",
            text: "Reseñas y valoraciones de los compradores",
            category: "retroalimentacion",
            feedback: "Correcto. Las reseñas regresan información a la tienda para mejorar el servicio.",
            hint: "¿Qué opiniones regresan a la tienda después de la venta para permitir ajustes?"
          },
          {
            id: "tie_mercado",
            text: "Mercado y competencia",
            category: "medio_ambiente",
            feedback: "Correcto. El mercado y la competencia rodean a la tienda y con ello debe interactuar.",
            hint: "¿Qué entorno externo rodea a la tienda y con lo cual debe competir?"
          }
        ]
      },
      {
        id: "universidad",
        name: "Universidad",
        emoji: "🎓",
        context:
          "Analiza una universidad como sistema: ingresan estudiantes y programas académicos, se transforman mediante clases y evaluaciones, y egresan profesionales formados.",
        hint:
          "En una universidad: lo que entra, lo que transforma, lo que produce, lo que ajusta y lo que la rodea.",
        cards: [
          {
            id: "uni_estudiantes",
            text: "Estudiantes nuevos que ingresan",
            category: "entrada",
            feedback: "Correcto. Los estudiantes ingresan a la universidad y dan arranque a la formación.",
            hint: "¿Los estudiantes entran a la universidad desde fuera para formarse?"
          },
          {
            id: "uni_programas",
            text: "Conocimientos y programas académicos",
            category: "entrada",
            feedback: "Correcto. Los programas académicos ingresan como información que se impartirá y desarrollará.",
            hint: "¿El conocimiento y los programas entran al sistema como información a procesar?"
          },
          {
            id: "uni_clases",
            text: "Impartición de clases",
            category: "proceso",
            feedback: "Correcto. Las clases transforman los conocimientos y a los estudiantes en aprendizajes.",
            hint: "¿Qué actividad transforma el conocimiento en aprendizaje?"
          },
          {
            id: "uni_evaluaciones",
            text: "Evaluaciones del aprendizaje",
            category: "proceso",
            feedback: "Correcto. Las evaluaciones son parte del proceso que confirma y consolida la transformación del aprendizaje.",
            hint: "¿Las evaluaciones forman parte del mecanismo que transforma y verifica el aprendizaje?"
          },
          {
            id: "uni_egresados",
            text: "Egresados formados",
            category: "salida",
            feedback: "Correcto. Los egresados formados son el resultado que la universidad entrega a la sociedad.",
            hint: "¿Qué resultado entrega la universidad al terminar la formación?"
          },
          {
            id: "uni_retro",
            text: "Resultados académicos que ajustan los programas",
            category: "retroalimentacion",
            feedback: "Correcto. Los resultados académicos regresan al sistema para mejorar los programas y la enseñanza.",
            hint: "¿Qué información regresa a la universidad sobre los resultados para ajustar sus programas?"
          },
          {
            id: "uni_entorno",
            text: "Entorno educativo: familia y sociedad",
            category: "medio_ambiente",
            feedback: "Correcto. La familia y la sociedad son el entorno que rodea a la universidad y con el cual interactúa.",
            hint: "¿Qué entorno externo rodea a la universidad y con el cual interactúa?"
          }
        ]
      },
      {
        id: "fabrica",
        name: "Fábrica",
        emoji: "🏭",
        context:
          "Analiza una fábrica como sistema: entran materia prima y energía, se transforman mediante la producción, y salen productos terminados verificados por control de calidad.",
        hint:
          "En la fábrica distingue: lo que entra para producir, lo que transforma, lo que resulta, lo que regresa para ajustar y lo que la rodea.",
        cards: [
          {
            id: "fab_materia",
            text: "Materia prima",
            category: "entrada",
            feedback: "Correcto. La materia prima entra a la fábrica y será transformada por la producción.",
            hint: "¿La materia prima entra a la fábrica para ser transformada?"
          },
          {
            id: "fab_energia",
            text: "Energía e insumos de operación",
            category: "entrada",
            feedback: "Correcto. La energía es un insumo que da arranque y sostiene el proceso productivo.",
            hint: "¿La energía ingresa a la fábrica como insumo de operación?"
          },
          {
            id: "fab_produccion",
            text: "Producción con maquinaria y trabajadores",
            category: "proceso",
            feedback: "Correcto. La producción es el proceso que transforma la materia prima en producto terminado.",
            hint: "¿Qué mecanismo transforma la materia prima en producto terminado?"
          },
          {
            id: "fab_producto",
            text: "Producto terminado",
            category: "salida",
            feedback: "Correcto. El producto terminado es el resultado que la fábrica entrega después del proceso.",
            hint: "¿Qué resultado entrega la fábrica al terminar la producción?"
          },
          {
            id: "fab_calidad",
            text: "Control de calidad",
            category: "retroalimentacion",
            feedback: "Correcto. El control de calidad regresa información sobre los productos para corregir el proceso.",
            hint: "¿Qué revisión regresa información a la producción para corregir defectos?"
          },
          {
            id: "fab_mercado",
            text: "Mercado y proveedores",
            category: "medio_ambiente",
            feedback: "Correcto. El mercado y los proveedores rodean a la fábrica y con ellos interactúa.",
            hint: "¿Qué entorno externo rodea a la fábrica y con el cual comercia?"
          }
        ]
      },
      {
        id: "granja",
        name: "Granja Agrícola",
        emoji: "🌾",
        context:
          "Analiza una granja como sistema: entran semillas, agua y trabajo; el cultivo las transforma y entrega cosechas; el clima la rodea y el rendimiento la ajusta.",
        hint:
          "Distingue en la granja: lo que entra, lo que transforma, lo que produce, lo que regresa como información y lo que la rodea.",
        cards: [
          {
            id: "gra_semillas",
            text: "Semillas, agua y fertilizantes",
            category: "entrada",
            feedback: "Correcto. Las semillas, el agua y los fertilizantes entran a la granja y dan arranque al cultivo.",
            hint: "¿Estos insumos ingresan a la granja para iniciar el cultivo?"
          },
          {
            id: "gra_trabajo",
            text: "Trabajo y conocimientos de los agricultores",
            category: "entrada",
            feedback: "Correcto. El trabajo de los agricultores es un insumo que impulsa el proceso de cultivo.",
            hint: "¿El trabajo de los agricultores entra a la granja como recurso para el proceso?"
          },
          {
            id: "gra_cultivo",
            text: "Cultivo y cuidado de las plantas",
            category: "proceso",
            feedback: "Correcto. El cultivo es el proceso que transforma semillas, agua y trabajo en cosecha.",
            hint: "¿Qué actividad transforma las semillas y el agua en plantas y cosecha?"
          },
          {
            id: "gra_cosecha",
            text: "Cosecha lista para la venta",
            category: "salida",
            feedback: "Correcto. La cosecha es el resultado que la granja entrega después del proceso.",
            hint: "¿Qué resultado produce la granja al terminar el ciclo de cultivo?"
          },
          {
            id: "gra_rendimiento",
            text: "Registro del rendimiento por temporada",
            category: "retroalimentacion",
            feedback: "Correcto. El registro del rendimiento regresa información a la granja para ajustar sus prácticas.",
            hint: "¿Qué información regresa a la granja sobre la cosecha para mejorar el siguiente ciclo?"
          },
          {
            id: "gra_clima",
            text: "Clima y condiciones naturales",
            category: "medio_ambiente",
            feedback: "Correcto. El clima rodea a la granja y con él interactúa todo el sistema.",
            hint: "¿Qué entorno externo rodea a la granja y condiciona sus resultados?"
          }
        ]
      }
    ]
  };
})(window.SystemLab = window.SystemLab || {});
