<template>
  <!-- Homepage options B and C: same as default, with the mega-menu header -->
  <div class="min-w-0 overflow-x-clip">
    <a
      href="#main"
      class="sr-only z-[60] rounded-full bg-yellow px-5 py-3 font-extrabold focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
    >
      Skip to content
    </a>
    <PreviewBar />
    <MegaHeader />
    <main id="main" tabindex="-1" class="focus:outline-none">
      <slot />
    </main>
    <SiteFooter />
  </div>
</template>
