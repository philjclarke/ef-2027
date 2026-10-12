<script setup lang="ts">
// Save/unsave toggle. Persists to localStorage via usePreviewState.
const props = withDefaults(defineProps<{ id: string; title: string; size?: number }>(), { size: 17 })
const { isSaved, toggleSaved } = usePreviewState()
const on = computed(() => isSaved(props.id))
</script>

<template>
  <button
    type="button"
    class="card-raise flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border-0 text-navy transition-colors"
    :class="on ? 'bg-yellow' : 'bg-white hover:bg-lilac-50'"
    :aria-pressed="on"
    :aria-label="on ? `Remove ${title} from My resources` : `Save ${title} to My resources`"
    @click.stop.prevent="toggleSaved(id)"
  >
    <AppIcon name="bookmark" :size="size" :filled="on" />
  </button>
</template>
