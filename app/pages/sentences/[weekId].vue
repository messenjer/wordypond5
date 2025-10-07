<script setup lang="ts">
const route = useRoute()
const { getWeek } = useWeeks()

const weekId = route.params.weekId as string
const week = computed(() => getWeek(weekId))

const sentences = ref<string[]>([])
const isLoading = ref(false)
const error = ref('')

// You can configure this with your OpenAI API key
const apiKey = ref('')
const showApiKeyInput = ref(false)

const generateSentences = async () => {
  if (!week.value) return

  isLoading.value = true
  error.value = ''

  try {
    // If no API key, generate simple placeholder sentences
    if (!apiKey.value) {
      sentences.value = week.value.words.slice(0, 5).map((word, index) => {
        const otherWord = week.value!.words[index + 1] || week.value!.words[0]
        return `The ${word} and the ${otherWord} are friends.`
      })
      return
    }

    // Call OpenAI API to generate sentences
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey.value}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that creates simple, fun sentences for children learning new vocabulary words.'
          },
          {
            role: 'user',
            content: `Create 8 simple and fun sentences for a 7-year-old child. Each sentence should use 2-3 of these vocabulary words: ${week.value.words.join(', ')}. Make the sentences playful and easy to understand. Return only the sentences, one per line.`
          }
        ],
        temperature: 0.8,
        max_tokens: 500
      })
    })

    if (!response.ok) {
      throw new Error('Failed to generate sentences. Please check your API key.')
    }

    const data = await response.json()
    const generatedText = data.choices[0].message.content
    sentences.value = generatedText.split('\n').filter((s: string) => s.trim())
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to generate sentences'
    // Fallback to simple sentences
    sentences.value = week.value.words.slice(0, 5).map((word, index) => {
      const otherWord = week.value!.words[index + 1] || week.value!.words[0]
      return `The ${word} and the ${otherWord} are playing together.`
    })
  } finally {
    isLoading.value = false
  }
}

const speakSentence = (sentence: string) => {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(sentence)
    utterance.rate = 0.9
    utterance.pitch = 1.1
    window.speechSynthesis.speak(utterance)
  }
}

onMounted(() => {
  if (!week.value) {
    navigateTo('/weeks')
  } else {
    generateSentences()
  }
})
</script>

<template>
  <div
    v-if="week"
    class="container mx-auto p-6 max-w-4xl"
  >
    <div class="mb-8">
      <NuxtLink
        to="/weeks"
        class="text-primary hover:underline mb-2 inline-block"
      >
        ← Back to Weeks
      </NuxtLink>
      <h1 class="text-4xl font-bold text-primary mb-2">
        ✨ {{ week.title }} - AI Sentences
      </h1>
      <p class="text-lg text-muted">
        Fun sentences using your vocabulary words
      </p>
    </div>

    <!-- API Key Section -->
    <UCard
      v-if="!apiKey"
      class="mb-6"
    >
      <div class="text-center py-4">
        <p class="text-muted mb-4">
          💡 Using demo mode. Add your OpenAI API key for AI-generated sentences.
        </p>
        <UButton
          v-if="!showApiKeyInput"
          variant="outline"
          size="sm"
          @click="showApiKeyInput = true"
        >
          Add API Key (Optional)
        </UButton>
        <div
          v-else
          class="max-w-md mx-auto space-y-2"
        >
          <UInput
            v-model="apiKey"
            placeholder="sk-..."
            type="password"
            size="lg"
          />
          <div class="flex gap-2 justify-center">
            <UButton
              size="sm"
              @click="generateSentences"
            >
              Save & Generate
            </UButton>
            <UButton
              variant="ghost"
              size="sm"
              @click="showApiKeyInput = false"
            >
              Cancel
            </UButton>
          </div>
        </div>
      </div>
    </UCard>

    <!-- Loading State -->
    <div
      v-if="isLoading"
      class="text-center py-20"
    >
      <div class="text-6xl mb-4 animate-bounce">
        ✨
      </div>
      <p class="text-xl text-muted">
        Generating magical sentences...
      </p>
    </div>

    <!-- Error State -->
    <UCard
      v-if="error"
      color="red"
      class="mb-6"
    >
      <p class="text-red-500">
        {{ error }}
      </p>
    </UCard>

    <!-- Sentences Display -->
    <div
      v-if="!isLoading && sentences.length > 0"
      class="space-y-4"
    >
      <div class="flex justify-end mb-4">
        <UButton
          icon="i-lucide-refresh-cw"
          :loading="isLoading"
          @click="generateSentences"
        >
          Generate New
        </UButton>
      </div>

      <UCard
        v-for="(sentence, index) in sentences"
        :key="index"
        class="hover:shadow-lg transition-shadow"
      >
        <div class="flex items-start gap-4">
          <div class="text-3xl font-bold text-primary min-w-[40px]">
            {{ index + 1 }}
          </div>
          <div class="flex-1">
            <p class="text-xl leading-relaxed mb-3">
              {{ sentence }}
            </p>
            <UButton
              icon="i-lucide-volume-2"
              size="sm"
              variant="outline"
              @click="speakSentence(sentence)"
            >
              Read Aloud
            </UButton>
          </div>
        </div>
      </UCard>

      <!-- Word List Reference -->
      <UCard class="mt-8">
        <template #header>
          <h3 class="text-lg font-bold">
            📖 Your Vocabulary Words
          </h3>
        </template>
        <div class="flex flex-wrap gap-2">
          <UBadge
            v-for="word in week.words"
            :key="word"
            size="lg"
            variant="subtle"
          >
            {{ word }}
          </UBadge>
        </div>
      </UCard>
    </div>
  </div>
</template>
