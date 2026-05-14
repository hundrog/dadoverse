<template>
  <UContainer class="py-12 max-w-3xl">
    <UCard>
      <div class="space-y-6 text-on-surface-dim">
        <h1 class="text-3xl font-display text-white">
          Terms of Service
        </h1>
        <p class="text-sm italic">
          Last updated: May 6, 2026
        </p>

        <section class="space-y-3">
          <h2 class="text-xl font-bold text-white">
            1. Acceptance of Terms
          </h2>
          <p>
            By accessing or using <strong>Dadoverso</strong>, you agree to be
            bound by these Terms of Service. This is a platform designed to
            facilitate tabletop RPG sessions through digital tools. If you
            disagree with any part of these terms, please discontinue use of the
            service.
          </p>
        </section>

        <section class="space-y-3">
          <h2 class="text-xl font-bold text-white">
            2. User Accounts & Security
          </h2>
          <p>
            Access to certain features requires authentication via Email,
            Google, or Facebook. You are responsible for:
          </p>
          <ul class="list-disc pl-5 space-y-1">
            <li>
              Maintaining the confidentiality of your session and account.
            </li>
            <li>All activities that occur under your profile.</li>
            <li>Ensuring your use of the platform complies with local laws.</li>
          </ul>
        </section>

        <section class="space-y-3">
          <h2 class="text-xl font-bold text-white">
            3. User Content & Conduct
          </h2>
          <p>
            You retain ownership of any content you create (campaign names,
            lore, character details). However, by using Dadoverso, you grant us
            a license to host and display this content to your designated
            session participants.
          </p>
          <div class="bg-primary-900/20 border-l-4 border-primary-500 p-4 my-2">
            <p class="text-sm">
              <strong>Prohibited Content:</strong> You may not upload, share, or
              promote content that is unlawful, defamatory, hateful, or
              infringes on the intellectual property rights of others (including
              unofficial TTRPG materials protected by copyright without proper
              authorization).
            </p>
          </div>
        </section>

        <section class="space-y-3">
          <h2 class="text-xl font-bold text-white">
            4. Fair Use & Prohibited Conduct
          </h2>
          <p>
            To maintain a healthy environment for all Directors and Players, you
            agree not to:
          </p>
          <ul class="list-disc pl-5 space-y-1">
            <li>
              Reverse engineer or attempt to disrupt the platform's
              infrastructure.
            </li>
            <li>
              Use automated scripts or "bots" to interact with the dice rolling
              engine.
            </li>
            <li>
              Exploit any bugs found; we encourage reporting them via our
              official channels instead.
            </li>
          </ul>
        </section>

        <section class="space-y-3">
          <h2 class="text-xl font-bold text-white">
            5. Service Availability ("As Is")
          </h2>
          <p>
            Dadoverso is an active open-source project. The service is provided
            <strong>"as is"</strong> and <strong>"as available"</strong>. We do
            not warrant that the service will be uninterrupted, secure, or free
            of bugs. We reserve the right to modify or discontinue features to
            improve the balance and performance of the platform.
          </p>
        </section>

        <section class="space-y-3">
          <h2 class="text-xl font-bold text-white">
            6. Limitation of Liability
          </h2>
          <p>
            To the maximum extent permitted by law, the creators of Dadoverso
            shall not be liable for any indirect, incidental, or consequential
            damages, including loss of game data, campaign progress, or service
            interruptions.
          </p>
        </section>

        <div class="pt-6">
          <UButton
            to="/"
            variant="ghost"
            icon="i-heroicons-arrow-left"
          >
            Back to Home
          </UButton>
        </div>
      </div>
    </UCard>
  </UContainer>
</template>
