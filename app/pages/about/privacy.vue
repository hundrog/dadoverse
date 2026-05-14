<template>
  <UContainer class="py-12 max-w-3xl">
    <UCard>
      <div class="space-y-6 text-on-surface-dim">
        <h1 class="text-3xl font-display text-white">
          Privacy Policy
        </h1>
        <p class="text-sm italic">
          Last updated: May 6, 2026
        </p>

        <section class="space-y-3">
          <h2 class="text-xl font-bold text-white">
            1. Introduction
          </h2>
          <p>
            Welcome to <strong>Dadoverso</strong>. We value your privacy and are
            committed to being transparent about how we handle your information.
            This policy describes how your personal data is collected and used
            when you interact with our virtual dice rolling platform.
          </p>
        </section>

        <section class="space-y-3">
          <h2 class="text-xl font-bold text-white">
            2. Data We Collect
          </h2>
          <p>
            We only collect the minimum information necessary to provide our
            TTRPG services:
          </p>
          <ul class="list-disc pl-5 space-y-1">
            <li>
              <strong>Identity Data:</strong> Full name and profile picture
              provided via Google or Facebook OAuth.
            </li>
            <li>
              <strong>Contact Data:</strong> Email address used for
              authentication and account recovery.
            </li>
            <li>
              <strong>Game Data:</strong> Campaign names, session settings, and
              historical dice roll results that you create within the platform.
            </li>
            <li>
              <strong>Technical Data:</strong> Cookies and local storage data
              required for session persistence (e.g., your character name and
              preferred dice system).
            </li>
          </ul>
        </section>

        <section class="space-y-3">
          <h2 class="text-xl font-bold text-white">
            3. How We Use Your Data
          </h2>
          <p>Your information is used strictly to:</p>
          <ul class="list-disc pl-5 space-y-1">
            <li>
              Provide real-time dice rolling synchronization between players.
            </li>
            <li>Manage account security and session ownership.</li>
            <li>
              Personalize your experience (displaying your character name and
              avatar in the Log).
            </li>
          </ul>
        </section>

        <section class="space-y-3">
          <h2 class="text-xl font-bold text-white">
            4. Infrastructure & Third-Party Services
          </h2>
          <p>
            To ensure high availability and security, Dadoverso integrates with
            the following providers:
          </p>
          <ul class="list-disc pl-5 space-y-1">
            <li>
              <strong>Supabase:</strong> For secure database hosting and
              identity management.
            </li>
            <li>
              <strong>Cloudflare:</strong> For web hosting, DDoS protection, and
              global delivery.
            </li>
            <li>
              <strong>OAuth Providers:</strong> Google and Facebook for secure,
              passwordless authentication.
            </li>
          </ul>
        </section>

        <section class="space-y-3">
          <h2 class="text-xl font-bold text-white">
            5. Data Retention & Deletion
          </h2>
          <p>
            You retain full control over your data. You may delete your account
            and all associated campaign data at any time through your profile
            settings. We do not sell your data to third parties, nor do we use
            it for marketing or profiling.
          </p>
        </section>

        <section class="space-y-3">
          <h2 class="text-xl font-bold text-white">
            6. Contact
          </h2>
          <p>
            For privacy inquiries or to exercise your data rights, please
            contact us via our official GitHub repository or community channels.
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
