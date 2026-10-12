<script setup lang="ts">
// "Suggest a resource": a simple native <dialog>. Prototype only, nothing is sent.
const dlg = ref<HTMLDialogElement | null>(null)
const sent = ref(false)
const text = ref('')
defineExpose({
  open: () => {
    sent.value = false
    dlg.value?.showModal()
  },
})
</script>

<template>
  <dialog
    ref="dlg"
    aria-labelledby="suggest-title"
    class="w-[min(560px,calc(100vw-32px))] rounded-[28px] border-0 p-0 text-navy backdrop:bg-navy/50"
  >
    <form method="dialog" class="flex flex-col gap-4 p-7 md:p-8" @submit="sent = true">
      <div class="flex items-start justify-between gap-4">
        <h2 id="suggest-title" class="m-0 text-2xl font-extrabold">{{ sent ? 'Thanks for the suggestion' : 'Suggest a resource' }}</h2>
        <button
          type="button"
          aria-label="Close"
          class="flex h-11 w-11 flex-none cursor-pointer items-center justify-center rounded-full border-0 bg-lilac-50 text-navy"
          @click="dlg?.close()"
        >
          <AppIcon name="close" :size="16" :stroke="2.4" />
        </button>
      </div>
      <template v-if="!sent">
        <label for="suggest-text" class="text-base font-bold">What are you teaching, and what would help?</label>
        <textarea
          id="suggest-text"
          v-model="text"
          rows="4"
          required
          class="rounded-2xl border-[1.5px] border-line-strong p-4 font-body text-base text-navy focus:border-navy"
          placeholder="For example: a Year 4 sound investigation with a careers link"
        />
        <p class="m-0 text-sm text-muted">This is a prototype, so nothing is sent.</p>
        <button type="submit" class="self-start rounded-full border-0 bg-yellow px-6 py-3.5 font-body text-base font-extrabold text-navy" @click.prevent="text.trim() && (sent = true)">
          Send suggestion
        </button>
      </template>
      <p v-else class="m-0 text-[17px] leading-normal">Requests like yours help shape the resources we make next.</p>
    </form>
  </dialog>
</template>
