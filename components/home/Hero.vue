<script setup lang="ts">
import homepage from '~/data/homepage.json'

const h = homepage.hero
const person = people.find((p) => p.id === h.collage.badgePerson)
</script>

<template>
  <section class="relative bg-sky">
    <img src="/brand/assorted-icons-1.svg" alt="" aria-hidden="true" class="doodle -right-[60px] top-2.5 w-[900px] opacity-[0.22]" />
    <div class="container-x relative flex flex-wrap items-center gap-12 pb-14 pt-10 md:pb-[72px] md:pt-16">
      <div class="flex min-w-0 flex-[1_1_540px] flex-col gap-[26px]">
        <p class="m-0 inline-flex items-center gap-2.5 self-start rounded-full bg-white py-2 pl-2 pr-4 text-sm font-bold md:text-[15px]">
          <span class="rounded-full bg-yellow px-2.5 py-1 text-[13px] font-extrabold tracking-[0.04em]">{{ h.eyebrow.badge }}</span>
          {{ h.eyebrow.text }}
        </p>
        <h1 class="m-0 text-[40px] font-extrabold leading-none tracking-[-0.025em] sm:text-[54px] xl:text-[72px]">
          {{ h.h1 }}
          <span class="highlight">{{ h.h1Highlight }}</span>
        </h1>
        <p class="m-0 max-w-[580px] text-lg leading-normal md:text-[21px]">{{ h.intro }}</p>
        <div class="mt-1 flex max-w-[640px] flex-col gap-3.5">
          <SearchField id="hero-search" size="hero" typeahead :placeholder="h.searchPlaceholder" />
          <div class="flex flex-wrap items-center gap-2 text-[15px]">
            <span class="mr-1 font-bold">Popular:</span>
            <NuxtLink
              v-for="p in h.popular"
              :key="p"
              :to="{ path: '/search', query: { q: p.toLowerCase() } }"
              class="rounded-full bg-white/60 px-[15px] py-[7px] font-bold hover:bg-white"
            >
              {{ p }}
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Collage: shrinks below 1024px; below 768px just the photo and the badge, unrotated -->
      <div class="collage relative min-w-0 flex-[1_1_440px] md:h-[440px] lg:h-[560px]" aria-hidden="false">
        <div class="photo overflow-hidden rounded-[28px] border-[6px] border-white shadow-[0_24px_50px_rgba(17,14,99,0.28)]">
          <img :src="h.collage.photo.src" :alt="h.collage.photo.alt" width="800" height="492" class="block h-full w-full object-cover" />
        </div>
        <div class="card hidden overflow-hidden rounded-[22px] border-[6px] border-white shadow-[0_24px_50px_rgba(17,14,99,0.28)] md:block">
          <img :src="h.collage.card.src" :alt="h.collage.card.alt" width="800" height="492" class="block h-full w-full object-cover" />
        </div>
        <div v-if="person" class="badge flex items-center gap-3.5 rounded-full bg-navy py-2 pl-2 pr-6 text-white shadow-[0_18px_40px_rgba(17,14,99,0.35)]">
          <img :src="person.image" alt="" width="72" height="72" class="block h-14 w-14 rounded-full bg-yellow md:h-[72px] md:w-[72px]" />
          <span class="flex flex-col gap-0.5">
            <span class="text-[13px] font-bold uppercase tracking-[0.04em] text-yellow">Meet {{ person.name }}</span>
            <span class="font-heading text-lg font-bold">{{ person.role }}</span>
          </span>
        </div>
        <div class="sticker hidden rounded-full bg-yellow px-[18px] py-2.5 text-[15px] font-extrabold shadow-[0_10px_24px_rgba(17,14,99,0.2)] md:block">
          {{ h.collage.sticker }}
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.highlight {
  background: linear-gradient(transparent 62%, #ffcf2c 62%, #ffcf2c 92%, transparent 92%);
  -webkit-box-decoration-break: clone;
  box-decoration-break: clone;
}
.photo {
  aspect-ratio: 800 / 492;
}
.badge {
  position: relative;
  margin: -32px 0 0 12px;
  width: fit-content;
}
@media (min-width: 768px) {
  .photo {
    position: absolute;
    left: 6%;
    top: 0;
    width: 70%;
    transform: rotate(-3deg);
  }
  .card {
    position: absolute;
    right: 0;
    top: 160px;
    width: 56%;
    aspect-ratio: 800 / 492;
    transform: rotate(4deg);
  }
  .badge {
    position: absolute;
    left: 0;
    bottom: 18px;
    margin: 0;
    transform: rotate(-2deg);
  }
  .sticker {
    position: absolute;
    right: 4%;
    top: 44px;
    transform: rotate(6deg);
  }
}
@media (min-width: 1024px) {
  .card {
    top: 200px;
  }
}
</style>
