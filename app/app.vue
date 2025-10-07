<script setup>
const { locale, locales, setLocale } = useI18n()
const route = useRoute()

useHead({
  meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
  link: [{ rel: 'icon', href: '/favicon.ico' }],
  htmlAttrs: {
    lang: computed(() => locale.value)
  }
})

const title = 'WordyPond - Learn Vocabulary Words'
const description
  = 'A fun and interactive app for children to practice weekly vocabulary words with games and AI-generated sentences.'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description
})

const languageOptions = computed(() => [
  locales.value.map(loc => ({
    label: loc.name,
    icon:
      loc.code === 'fr'
        ? 'i-circle-flags-fr'
        : loc.code === 'en'
          ? 'i-circle-flags-gb'
          : 'i-circle-flags-it',
    onSelect: () => setLocale(loc.code)
  }))
])
</script>

<template>
  <UApp>
    <UHeader class="border-b-4 border-primary/20">
      <template #left>
        <NuxtLink
          to="/"
          class="flex items-center gap-2 font-bold text-xl"
        >
          <span class="text-3xl">🐸</span>
          <span class="text-primary">WordyPond</span>
        </NuxtLink>
      </template>

      <template #center>
        <nav class="hidden md:flex items-center gap-1">
          <UButton
            to="/weeks"
            :variant="route.path.includes('/weeks') ? 'solid' : 'ghost'"
            size="lg"
          >
            📚 {{ $t("nav.weeks") }}
          </UButton>
          <UButton
            to="/weeks"
            :variant="route.path.includes('/exercises') ? 'solid' : 'ghost'"
            size="lg"
          >
            🎮 {{ $t("nav.exercises") }}
          </UButton>
          <UButton
            to="/weeks"
            :variant="route.path.includes('/sentences') ? 'solid' : 'ghost'"
            size="lg"
          >
            ✨ {{ $t("nav.sentences") }}
          </UButton>
        </nav>
      </template>

      <template #right>
        <UDropdownMenu :items="languageOptions">
          <UButton
            icon="i-lucide-languages"
            variant="ghost"
            color="neutral"
            :label="locale.toUpperCase()"
          />
        </UDropdownMenu>
        <UColorModeButton />
      </template>
    </UHeader>

    <UMain class="min-h-[calc(100vh-200px)]">
      <NuxtPage />
    </UMain>

    <UFooter class="border-t-4 border-primary/20">
      <template #left>
        <p class="text-sm text-muted flex items-center gap-2">
          <span class="text-xl">🐸</span>
          {{ $t("footer.madeWith") }} • © {{ new Date().getFullYear() }}
        </p>
      </template>
    </UFooter>
  </UApp>
</template>
