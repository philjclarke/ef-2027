<script setup lang="ts">
// Option C hero: set up your homepage. Once set, it becomes a personalised welcome.
const { prefs, region, nation } = usePersonalisation()
const { signedIn } = usePreviewState()
const editing = ref(false)

function done() {
  editing.value = false
  nextTick(() => document.getElementById('your-page')?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }))
}
const showForm = computed(() => !prefs.value || editing.value)
</script>

<template>
  <section id="personalise" class="studio relative overflow-hidden scroll-mt-24">
    <div class="container-x relative grid items-center gap-10 py-10 md:py-16 lg:grid-cols-[1fr_minmax(0,560px)] lg:gap-16 lg:py-20">
      <!-- Left -->
      <div class="flex min-w-0 flex-col gap-6">
        <template v-if="showForm && !prefs">
          <p class="m-0 inline-flex items-center gap-2 self-start rounded-full bg-white py-1.5 pl-2 pr-4 text-sm font-bold">
            <AltAiMark />Free · curriculum-linked STEM for ages 4–16
          </p>
          <h1 class="m-0 text-[40px] font-extrabold leading-[1.02] tracking-[-0.03em] sm:text-[56px] xl:text-[68px]">
            Science resources, <span class="text-[#5B3FD6]">made for your classroom</span>
          </h1>
          <p class="m-0 max-w-[560px] text-lg leading-normal md:text-xl">
            Tell us who and where you teach. We’ll match every resource to your curriculum and bring in examples from your area, so pupils can see STEM on their doorstep.
          </p>
        </template>
        <template v-else-if="prefs">
          <p class="m-0 inline-flex items-center gap-2 self-start rounded-full bg-white py-1.5 pl-2 pr-4 text-sm font-bold">
            <AltAiMark />Personalised for you
          </p>
          <h1 class="m-0 text-[40px] font-extrabold leading-[1.02] tracking-[-0.03em] sm:text-[56px] xl:text-[64px]">
            {{ signedIn ? 'Welcome back, Sam' : 'Your Energising Futures' }}
          </h1>
          <p class="m-0 max-w-[560px] text-lg leading-normal md:text-xl">
            Resources for <strong>{{ prefsSummary(prefs) }}</strong>,
            mapped to the {{ nations[nation].curriculum }}<template v-if="region">, with examples from <strong>{{ region.place }}</strong></template>.
          </p>
          <div v-if="!editing" class="flex flex-wrap gap-2.5">
            <a href="#your-page" class="btn-navy px-6 py-3.5">See your page<AppIcon name="arrow" :stroke="2.4" /></a>
            <button type="button" class="cursor-pointer rounded-full border-[1.5px] border-navy bg-white px-5 py-3 font-body text-base font-extrabold text-navy" @click="editing = true">
              Change details
            </button>
          </div>
        </template>
        <ul class="m-0 mt-2 grid max-w-[600px] list-none gap-3 p-0 sm:grid-cols-3">
          <li class="flex flex-col gap-1 rounded-2xl bg-white/70 p-4">
            <strong class="text-[15px]">Your curriculum</strong>
            <span class="text-sm leading-snug text-muted">England, Scotland, Wales or Northern Ireland</span>
          </li>
          <li class="flex flex-col gap-1 rounded-2xl bg-white/70 p-4">
            <strong class="text-[15px]">Your area</strong>
            <span class="text-sm leading-snug text-muted">Local examples, places and careers</span>
          </li>
          <li class="flex flex-col gap-1 rounded-2xl bg-white/70 p-4">
            <strong class="text-[15px]">Checked by teachers</strong>
            <span class="text-sm leading-snug text-muted">Every localised version is reviewed</span>
          </li>
        </ul>
      </div>

      <!-- Right -->
      <div class="relative min-w-0">
        <div v-if="showForm" class="rounded-[32px] bg-white p-6 shadow-[0_30px_60px_rgba(17,14,99,0.16)] md:p-8">
          <h2 class="m-0 mb-1 text-2xl font-extrabold">{{ prefs ? 'Change your details' : 'Set up your homepage' }}</h2>
          <p class="m-0 mb-6 text-[15px] text-muted">Takes 20 seconds. No account needed.</p>
          <AltPersonaliseForm id-prefix="pc" variant="studio" @done="done" />
        </div>
        <div v-else class="relative overflow-hidden rounded-[32px] bg-navy shadow-[0_30px_60px_rgba(17,14,99,0.2)]">
          <img
            :src="region?.image ?? '/photos/hero-c.jpg'"
            alt=""
            class="block aspect-[5/4] w-full object-cover"
          />
          <span v-if="region" class="absolute bottom-4 left-4 rounded-full bg-white/95 px-4 py-2 text-sm font-extrabold text-navy">
            {{ region.place }}
          </span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.studio {
  background:
    radial-gradient(60% 80% at 100% 0%, #eee8fe 0%, transparent 60%),
    radial-gradient(50% 70% at 0% 100%, #ddf5ea 0%, transparent 60%),
    #e1eefc;
}
</style>
