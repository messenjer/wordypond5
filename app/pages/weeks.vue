<script setup lang="ts">
const { weeks, addWeek, deleteWeek } = useWeeks()

const isOpen = ref(false)
const newWeekTitle = ref('')
const newWords = ref<string[]>(Array(10).fill(''))

const openDialog = () => {
  isOpen.value = true
  newWeekTitle.value = ''
  newWords.value = Array(10).fill('')
}

const handleSubmit = () => {
  if (!newWeekTitle.value.trim()) {
    return
  }

  const filteredWords = newWords.value.filter(word => word.trim())
  if (filteredWords.length !== 10) {
    alert('Please enter exactly 10 words!')
    return
  }

  addWeek(newWeekTitle.value, filteredWords)
  isOpen.value = false
}

const confirmDelete = (id: string, title: string) => {
  if (confirm(`Delete "${title}"?`)) {
    deleteWeek(id)
  }
}
</script>

<template>
  <div class="container mx-auto p-6 max-w-6xl">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-4xl font-bold text-primary mb-2">
          📚 Weekly Words
        </h1>
        <p class="text-lg text-muted">
          Manage your vocabulary weeks
        </p>
      </div>
      <UButton
        size="xl"
        icon="i-lucide-plus"
        @click="openDialog"
      >
        Add Week
      </UButton>
    </div>

    <div
      v-if="weeks.length === 0"
      class="text-center py-20"
    >
      <div class="text-6xl mb-4">
        📖
      </div>
      <p class="text-xl text-muted mb-6">
        No weeks yet! Create your first vocabulary week.
      </p>
      <UButton
        size="lg"
        @click="openDialog"
      >
        Get Started
      </UButton>
    </div>

    <div
      v-else
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <UCard
        v-for="week in weeks"
        :key="week.id"
        class="hover:shadow-lg transition-shadow"
      >
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-xl font-bold">
              {{ week.title }}
            </h3>
            <UButton
              icon="i-lucide-trash-2"
              color="red"
              variant="ghost"
              size="sm"
              @click="confirmDelete(week.id, week.title)"
            />
          </div>
        </template>

        <div class="space-y-2 mb-4">
          <div
            v-for="(word, index) in week.words"
            :key="index"
            class="flex items-center gap-2 text-sm"
          >
            <span class="text-muted">{{ index + 1 }}.</span>
            <span class="font-medium">{{ word }}</span>
          </div>
        </div>

        <template #footer>
          <div class="flex gap-2">
            <UButton
              :to="`/exercises/${week.id}`"
              icon="i-lucide-gamepad-2"
              block
              color="primary"
            >
              Play Games
            </UButton>
            <UButton
              :to="`/sentences/${week.id}`"
              icon="i-lucide-sparkles"
              block
              color="primary"
              variant="outline"
            >
              Sentences
            </UButton>
          </div>
        </template>
      </UCard>
    </div>

    <UModal
      v-model:open="isOpen"
      title="✨ Add New Week"
      :ui="{ content: 'w-[calc(100vw-2rem)] max-w-3xl' }"
    >
      <template #body>
        <form
          class="space-y-6"
          @submit.prevent="handleSubmit"
        >
          <div>
            <label class="block text-sm font-medium mb-2">
              Week Title *
            </label>
            <UInput
              v-model="newWeekTitle"
              placeholder="e.g., Week 1, Animals, Food..."
              size="lg"
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-3">
              Words (10 required) *
            </label>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <UInput
                v-for="(_, index) in newWords"
                :key="index"
                v-model="newWords[index]"
                :placeholder="`Word ${index + 1}`"
              />
            </div>
          </div>
        </form>
      </template>

      <template #footer="{ close }">
        <div class="flex gap-2 justify-end">
          <UButton
            type="button"
            color="neutral"
            variant="ghost"
            @click="close"
          >
            Cancel
          </UButton>
          <UButton
            @click="handleSubmit"
          >
            Create Week
          </UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>
