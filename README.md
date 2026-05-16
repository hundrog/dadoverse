# Dadoverse 🎲

Dadoverse is a free and minimalist web application designed for playing tabletop role-playing games (TTRPGs) remotely. Unlike generic dice rollers, Dadoverse is built to faithfully replicate the mechanics and “feel” of specific game systems.

**Try it live:** [dadoverse.hundrog.workers.dev](https://dadoverse.hundrog.workers.dev/?utm_source=chatgpt.com)

---

## ✨ Main Features

* **Real-Time Sessions:** Create a shared room or join an existing one through a link to sync your rolls with your gaming group.
* **Natively Supported Systems:**

  * **Daggerheart (Duality Dice):** Roll 2D12 (Hope and Fear) with automatic modifier calculation, advantage/disadvantage handling, and system-specific outcomes such as *“X with Hope”*, *“X with Fear”*, or *“Critical!”*.
  * **Fabula Ultima (Step Die):** Dynamic dice configuration and scaling based on your attributes.
* **Immersion-Focused Design:** A clean, fast, and responsive interface that does not interrupt the flow of the narrative.
* **Full Internationalization:** Native support for Spanish and English based on the user's browser preferences.

---

## 🚀 Coming Soon (Roadmap)

* [ ] Support for the **Year Zero Engine (YZE)** with *Push Roll* mechanics.
* [ ] **2D20 System** (Modiphius).
* [ ] **Session Statistics:** Dice streak charts and roll history within each game session.
* [ ] **Advanced Rolls:** Special mathematical calculations (averages, drop lowest/highest, etc.).

---

## 🛠️ Tech Stack

This project is built using a modern web development ecosystem focused on speed and server-side rendering (SSR):

* **Framework:** [Nuxt 3](https://nuxt.com/?utm_source=chatgpt.com) (Vue 3, TypeScript).
* **Styling & Components:** [Nuxt UI](https://ui.nuxt.com/?utm_source=chatgpt.com) & [Tailwind CSS](https://tailwindcss.com/?utm_source=chatgpt.com).
* **Database & Auth:** [Supabase](https://supabase.com/?utm_source=chatgpt.com) (PostgreSQL with Row Level Security).
* **Deployment / Hosting:** [Cloudflare Workers / Pages](https://pages.cloudflare.com/?utm_source=chatgpt.com).

---

## 💻 Local Development

If you'd like to clone the project and run it locally:

### Prerequisites

* Node.js (version 18 or higher recommended)

* A Supabase account/project (for the `sessions` tables and authentication)

### Steps

1. Clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/dadoverse.git
cd dadoverse
```

2. Install dependencies:

```bash
pnpm install
# or npm install / yarn install
```

3. Configure environment variables. Create a `.env` file in the project root:

```env
# .env.example
export NUXT_PUBLIC_SUPABASE_URL=
export NUXT_PUBLIC_SUPABASE_KEY=
export NUXT_PUBLIC_SITE_URL=
```

4. Configure the Database (Supabase)

This project uses the Supabase CLI to manage the database schema and RLS policies.

1. Make sure Docker is running on your machine.
2. Start the local Supabase environment:

```bash
npx supabase start
```

5. Start the development server:

```bash
pnpm run dev
```

---

## ☕ Support the Project

If this tool has improved your TTRPG nights and you'd like to support its development and server maintenance, you can buy us a coffee: [Buy Me a Coffee](https://buymeacoffee.com/the.blue.pixel?utm_source=chatgpt.com)

---

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for more details.
