<script setup lang="ts">
const { weeks } = useWeeks()
const { t } = useI18n()

const heroLinks = computed(() => [{
  label: t('home.hero.getStarted'),
  to: '/weeks',
  trailingIcon: 'i-lucide-arrow-right',
  size: 'xl'
}])

const features = computed(() => [{
  icon: 'i-lucide-book-open',
  title: t('home.features.weeklyWords.title'),
  description: t('home.features.weeklyWords.description')
}, {
  icon: 'i-lucide-gamepad-2',
  title: t('home.features.interactiveGames.title'),
  description: t('home.features.interactiveGames.description')
}, {
  icon: 'i-lucide-sparkles',
  title: t('home.features.aiSentences.title'),
  description: t('home.features.aiSentences.description')
}, {
  icon: 'i-lucide-trophy',
  title: t('home.features.trackProgress.title'),
  description: t('home.features.trackProgress.description')
}, {
  icon: 'i-lucide-smile',
  title: t('home.features.kidFriendly.title'),
  description: t('home.features.kidFriendly.description')
}, {
  icon: 'i-lucide-save',
  title: t('home.features.saveLocally.title'),
  description: t('home.features.saveLocally.description')
}])

const ctaLinks = computed(() => [{
  label: t('home.cta.createFirst'),
  to: '/weeks',
  trailingIcon: 'i-lucide-arrow-right',
  color: 'primary'
}])
</script>

<template>
  <div class="container mx-auto p-6 max-w-6xl">
    <UPageHero
      :title="$t('home.hero.title')"
      :description="$t('home.hero.description')"
      :links="heroLinks"
    />

    <UPageSection
      id="features"
      :title="$t('home.features.title')"
      :description="$t('home.features.description')"
      :features="features"
    />

    <UPageSection v-if="weeks.length > 0">
      <div class="text-center mb-8">
        <h2 class="text-3xl font-bold mb-4">
          {{ $t('home.recentWeeks.title') }}
        </h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <UCard
          v-for="week in weeks.slice(0, 3)"
          :key="week.id"
          class="hover:shadow-lg transition-shadow"
        >
          <template #header>
            <h3 class="text-xl font-bold">
              {{ week.title }}
            </h3>
          </template>

          <p class="text-sm text-muted mb-4">
            {{ week.words.length }} {{ $t('home.recentWeeks.words') }}
          </p>

          <template #footer>
            <div class="flex gap-2">
              <UButton
                :to="`/exercises/${week.id}`"
                icon="i-lucide-gamepad-2"
                size="sm"
                block
              >
                {{ $t('home.recentWeeks.play') }}
              </UButton>
              <UButton
                :to="`/sentences/${week.id}`"
                icon="i-lucide-sparkles"
                size="sm"
                variant="outline"
                block
              >
                {{ $t('home.recentWeeks.sentences') }}
              </UButton>
            </div>
          </template>
        </UCard>
      </div>

      <div class="text-center mt-8">
        <UButton
          to="/weeks"
          size="lg"
          variant="outline"
        >
          {{ $t('home.recentWeeks.viewAll') }}
        </UButton>
      </div>
    </UPageSection>

    <UPageSection v-else>
      <UPageCTA
        :title="$t('home.cta.title')"
        :description="$t('home.cta.description')"
        variant="subtle"
        :links="ctaLinks"
      />
    </UPageSection>
  </div>
</template>
