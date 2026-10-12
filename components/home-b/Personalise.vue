<script setup lang="ts">
// "Make it yours" bar under the hero. Collapses to a summary once set.
const { prefs, region, clear } = usePersonalisation()
const editing = ref(false)
</script>

<template>
  <section id="personalise" class="relative z-10 -mt-12 scroll-mt-28 md:-mt-14">
    <div class="container-x">
      <div class="mx-auto max-w-[1180px] rounded-[28px] bg-white p-6 shadow-[0_20px_50px_rgba(17,14,99,0.16)] md:p-8">
        <div v-if="prefs && !editing" class="flex flex-wrap items-center justify-between gap-4">
          <div class="flex items-center gap-4">
            <span class="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-pop-coral-soft" aria-hidden="true"><AltAiMark /></span>
            <div>
              <p class="m-0 text-sm font-extrabold uppercase tracking-[0.06em] text-muted">Personalised for you</p>
              <p class="m-0 font-heading text-xl font-extrabold leading-snug">
                {{ prefsSummary(prefs) }}<template v-if="region">, near {{ region.place }}</template>
              </p>
            </div>
          </div>
          <div class="flex gap-2">
            <button type="button" class="cursor-pointer rounded-full border-[1.5px] border-navy bg-white px-5 py-2.5 font-body text-[15px] font-extrabold text-navy" @click="editing = true">Edit</button>
            <button type="button" class="cursor-pointer rounded-full border-0 bg-transparent px-3 py-2.5 font-body text-[15px] font-bold text-navy underline" @click="clear">Reset</button>
          </div>
        </div>
        <template v-else>
          <div class="mb-5 flex flex-wrap items-baseline justify-between gap-2">
            <h2 class="m-0 text-2xl font-extrabold md:text-[28px]">Make it yours</h2>
            <p class="m-0 text-[15px] text-muted">We’ll match your curriculum and bring in examples from your area.</p>
          </div>
          <AltPersonaliseForm id-prefix="pb" variant="bar" @done="editing = false" />
        </template>
      </div>
    </div>
  </section>
</template>
