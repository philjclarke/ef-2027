<script setup lang="ts">
// Careers band card: circular portrait on a coloured card, or the video-still variant.
import type { Person } from '~/utils/catalogue'

const props = defineProps<{ person: Person }>()
const item = computed(() => getItem(props.person.itemId))
const bg = computed(() => ({ yellow: '#FFCF2C', green: '#5FBE98', white: '#FFFFFF' })[props.person.cardColour])
const isVideo = computed(() => props.person.badge === 'VIDEO')
</script>

<template>
  <a
    :href="item?.liveUrl ?? '#'"
    target="_blank"
    rel="noopener"
    class="lift flex flex-col overflow-hidden rounded-[28px] text-center text-navy hover:text-navy"
    :class="isVideo ? '' : 'items-center gap-3.5 px-6 pb-[26px] pt-7'"
    :style="{ background: bg }"
  >
    <template v-if="isVideo">
      <div class="relative h-[270px] overflow-hidden">
        <img :src="person.image" alt="" class="block h-full w-full object-cover" style="object-position: center 20%" />
      </div>
      <div class="flex flex-col gap-1 px-[22px] pb-[22px] pt-[18px]">
        <span class="font-heading text-2xl font-extrabold leading-[1.1]">{{ person.name }}</span>
        <span class="text-base font-bold">{{ person.role }}</span>
        <span class="sr-only">Video (opens in a new tab)</span>
      </div>
    </template>
    <template v-else>
      <img
        :src="person.image"
        alt=""
        width="150"
        height="150"
        class="block h-[150px] w-[150px] rounded-full border-[5px] border-white bg-white"
      />
      <span class="font-heading text-2xl font-extrabold leading-[1.1]">{{ person.name }}</span>
      <span class="text-base font-bold">{{ person.role }}</span>
      <span class="rounded-full bg-navy px-3 py-[5px] text-[13px] font-extrabold text-white">{{ person.badge }}</span>
      <span class="sr-only">(opens in a new tab)</span>
    </template>
  </a>
</template>
