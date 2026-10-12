<script setup lang="ts">
// Prototype-only strip above the header: makes the signed-in preview easy to find.
// Deliberately styled apart from the site (yellow, "Prototype" label) so it isn't mistaken for the design.
const { signedIn, setSignedIn } = usePreviewState()
</script>

<template>
  <div class="bg-yellow text-navy">
    <div class="container-x flex min-h-[44px] flex-nowrap items-center justify-between gap-x-4 gap-y-1 py-1.5 text-sm font-bold">
      <p class="m-0 flex items-center gap-2">
        <span class="rounded-full bg-navy px-2.5 py-0.5 text-xs font-extrabold tracking-[0.06em] text-white">PROTOTYPE</span>
        <span class="hidden sm:inline">For review. Content links open the live site.</span>
      </p>
      <div class="flex items-center gap-3">
        <span id="preview-label" class="whitespace-nowrap"><span class="sm:hidden">Signed-in view</span><span class="hidden sm:inline">Preview as signed-in teacher</span></span>
        <button
          type="button"
          role="switch"
          :aria-checked="signedIn"
          aria-labelledby="preview-label"
          class="relative h-8 w-14 flex-none cursor-pointer rounded-full border-2 border-navy transition-colors"
          :class="signedIn ? 'bg-navy' : 'bg-white'"
          @click="setSignedIn(!signedIn)"
        >
          <span
            aria-hidden="true"
            class="absolute top-[2px] h-6 w-6 rounded-full transition-[left]"
            :class="signedIn ? 'left-[26px] bg-yellow' : 'left-[2px] bg-navy'"
          />
        </button>
      </div>
    </div>
  </div>
</template>
