<script setup lang="ts">
// Card for a single item in grids and rows. Handles collections too (navy "COLLECTION · N" badge),
// because the designs use this card style for saved and new items of either kind.
import type { Item } from '~/utils/catalogue'

const props = withDefaults(
  defineProps<{
    item: Item
    size?: 'sm' | 'md'
    bordered?: boolean
    description?: boolean
    action?: boolean
    bookmark?: boolean
    isNew?: boolean
    savedLabel?: string
    hint?: string
  }>(),
  { size: 'sm', bordered: true, description: false, action: true, bookmark: true, isNew: false },
)

const badge = computed(() => badgeFor(props.item, { isNew: props.isNew }))
const act = computed(() => actionFor(props.item))
const isCollection = computed(() => props.item.kind === 'collection')
</script>

<template>
  <article
    class="lift relative flex flex-col bg-white"
    :class="[
      size === 'md' ? 'gap-3.5 rounded-3xl p-3 pb-5' : 'gap-3 rounded-[22px] p-2.5 pb-4',
      bordered ? 'border-[1.5px] border-line-soft' : '',
    ]"
  >
    <div class="relative overflow-hidden leading-none" :class="size === 'md' ? 'rounded-2xl' : 'rounded-[14px]'">
      <img
        :src="item.img"
        alt=""
        width="800"
        height="492"
        loading="lazy"
        decoding="async"
        class="block aspect-[800/492] w-full object-cover"
      />
      <span
        class="absolute left-2 top-2 flex items-center gap-1.5 rounded-full px-2.5 py-[5px] text-xs font-extrabold leading-[1.2]"
        :class="isNew ? 'bg-yellow text-navy' : isCollection ? 'bg-navy text-white' : 'bg-white text-navy'"
      >
        <AppIcon v-if="isCollection && !isNew" name="stack" :size="12" :stroke="2.6" />{{ badge }}
      </span>
      <BookmarkButton v-if="bookmark" :id="item.id" :title="item.title" class="absolute right-1.5 top-1.5" />
    </div>
    <div class="flex flex-1 flex-col gap-2 px-1.5" :class="size === 'md' ? 'gap-2.5 px-2' : ''">
      <div class="flex flex-wrap items-center gap-1.5 text-[13px] font-bold">
        <span class="mr-0.5 text-muted">{{ levelLabel(item) }}</span>
        <AgePill v-for="a in item.ages" :key="a" :age="a" />
      </div>
      <h3
        class="m-0 font-heading"
        :class="[
          description ? '' : 'flex-1',
          size === 'md' ? 'text-[19px] font-bold leading-[1.3]' : 'text-[17px] font-extrabold leading-[1.3]',
        ]"
      >
        <a :href="item.liveUrl" target="_blank" rel="noopener" class="card-link">
          {{ item.title }}<span class="sr-only"> (opens in a new tab)</span>
        </a>
      </h3>
      <p v-if="description && item.description" class="m-0 line-clamp-3 text-[15px] leading-normal text-muted">
        {{ item.description }}
      </p>
      <span v-if="hint" class="text-sm font-semibold text-muted">{{ hint }}</span>
      <span v-if="savedLabel" class="text-sm font-semibold text-muted">{{ savedLabel }}</span>
      <a
        v-if="action"
        :href="item.liveUrl"
        target="_blank"
        rel="noopener"
        tabindex="-1"
        aria-hidden="true"
        class="card-raise inline-flex min-h-[36px] items-center gap-1.5 self-start rounded-full bg-lilac-100 px-3.5 py-2 text-sm font-extrabold hover:bg-line"
      >
        <AppIcon :name="act.icon" :size="15" :stroke="2.4" />{{ act.label }}
      </a>
    </div>
  </article>
</template>
