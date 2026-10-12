<script setup lang="ts">
// Signed-in only: saved items row.
const { signedIn, saved, savedLabel } = usePreviewState()
const items = computed(() => saved.value.map((s) => getItem(s.id)).filter((i) => !!i).slice(0, 4))
</script>

<template>
  <section v-if="signedIn && items.length" class="pt-20" aria-labelledby="saved-h">
    <div class="container-x flex flex-col gap-7">
      <div class="flex flex-wrap items-end justify-between gap-4">
        <h2 id="saved-h" class="h2-section">Pick up where you left off</h2>
        <a href="#" class="link-strong">Go to My resources</a>
      </div>
      <div class="grid grid-cols-[repeat(auto-fill,minmax(min(250px,100%),1fr))] gap-6">
        <ResourceCard v-for="i in items" :key="i!.id" :item="i!" :action="false" :saved-label="savedLabel(i!.id)" />
      </div>
    </div>
  </section>
</template>
