# Dadoverse 🎲

Dadoverse es una aplicación web minimalista y gratuita diseñada para jugar juegos de rol de mesa (TTRPG) a distancia. A diferencia de los lanzadores de dados genéricos, Dadoverse está construido para replicar fielmente las mecánicas y el "sentimiento" de sistemas de reglas específicos.

**Pruébalo en vivo:** [dadoverso.hundrog.workers.dev](https://dadoverse.hundrog.workers.dev/)

---

## ✨ Características Principales

* **Sesiones en Tiempo Real:** Crea una sala compartida o únete a una existente mediante un enlace para sincronizar tus tiradas con tu mesa de juego.
* **Sistemas Soportados Nativamente:**
  * **Daggerheart (Duality Dice):** Tira 2D12 (Esperanza y Miedo) con cálculo automático de modificadores, ventajas/desventajas y resultados
  específicos como *"X con Esperanza"*, *"X con Miedo"* o *"¡Crítico!"*.
  * **Fabula Ultima (Step Die):** Configuración y escalonamiento dinámico de dados según tus atributos.
* **Diseño Enfocado en la Inmersión:** Interfaz limpia, ágil y responsiva que no interrumpe el flujo de la narrativa.
* **Internacionalización Completa:** Soporte nativo para Español e Inglés basado en la preferencia del navegador.

---

## 🚀 Próximamente (Roadmap)

* [ ] Soporte para **Year Zero Engine (YZE)** con opción de *Forzar la tirada (Push)*.
* [ ] Sistema **2D20** (Modiphius).
* [ ] **Estadísticas de sesión:** Gráficos e historial de rachas de dados dentro de cada partida.
* [ ] **Tiradas Avanzadas:** Cálculos matemáticos especiales (promedios, descartar el menor/mayor, etc.).

---

## 🛠️ Stack Tecnológico

Este proyecto está construido utilizando el ecosistema moderno de desarrollo web enfocado en la velocidad y el renderizado en el servidor (SSR):

* **Framework:** [Nuxt 3](https://nuxt.com/) (Vue 3, TypeScript).
* **Estilos y Componentes:** [Nuxt UI](https://ui.nuxt.com/) & [Tailwind CSS](https://tailwindcss.com/).
* **Base de Datos y Auth:** [Supabase](https://supabase.com/) (PostgreSQL con Row Level Security).
* **Despliegue / Hosting:** [Cloudflare Workers / Pages](https://pages.cloudflare.com/).

---

## 💻 Desarrollo Local

Si quieres clonar el proyecto y ejecutarlo en tu máquina:

### Prerrequisitos

* Node.js (versión 18 o superior recomendada)

* Una cuenta/proyecto en Supabase (para las tablas de `sessions` y autenticación)

### Pasos

1. Clonar el repositorio:

  ```bash
  git clone [https://github.com/TU_USUARIO/dadoverso.git](https://github.com/TU_USUARIO/dadoverso.git)
  cd dadoverso 
  ```

2. Instalar las dependencias:

  ```Bash
  pnpm install
  # o npm install / yarn install
  ```

3. Configurar las variables de entorno. Crea un archivo .env en la raíz del proyecto:

  ```env
  # .env.example
  export NUXT_PUBLIC_SUPABASE_URL=
  export NUXT_PUBLIC_SUPABASE_KEY=
  export NUXT_PUBLIC_SITE_URL=
  ```

4. Configurar la Base de Datos (Supabase)

  Este proyecto utiliza la CLI de Supabase para gestionar el esquema de la base de datos y las políticas RLS.

  1. Asegúrate de tener Docker corriendo en tu máquina.
  2. Levanta el entorno local de Supabase:

  ```bash
  npx supabase start
  ```

5. Iniciar el servidor de desarrollo:

  ```Bash
  pnpm run dev
  ```

## Apoya al Proyecto

Si esta herramienta ha mejorado tus noches de rol y quieres apoyar su desarrollo y mantenimiento de los servidores, puedes invitarnos a un café: [https://buymeacoffee.com/the.blue.pixel](https://buymeacoffee.com/the.blue.pixel)

---

## Licencia

Este proyecto está bajo la Licencia MIT. Consúltala en el archivo LICENSE para más detalles.
