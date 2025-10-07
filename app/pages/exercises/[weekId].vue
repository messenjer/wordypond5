<script setup lang="ts">
const route = useRoute()
const { getWeek } = useWeeks()
const { t } = useI18n()

const weekId = route.params.weekId as string
const week = computed(() => getWeek(weekId))

const currentGame = ref<'spelling' | 'memory' | 'quiz'>('spelling')

// Spelling Game
const currentWordIndex = ref(0)
const spellingInput = ref('')
const spellingScore = ref(0)
const spellingFeedback = ref('')

const speakWord = (word: string) => {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(word)
    utterance.rate = 0.8
    utterance.pitch = 1.2
    window.speechSynthesis.speak(utterance)
  }
}

const checkSpelling = () => {
  if (!week.value) return

  const currentWord = week.value.words[currentWordIndex.value]
  if (spellingInput.value.toLowerCase().trim() === currentWord.toLowerCase()) {
    spellingScore.value++
    spellingFeedback.value = `✅ ${t('exercises.spelling.correct')}`
    setTimeout(() => {
      nextSpellingWord()
    }, 1500)
  } else {
    spellingFeedback.value = `❌ ${t('exercises.spelling.tryAgain')}`
    setTimeout(() => {
      spellingFeedback.value = ''
    }, 1500)
  }
}

const nextSpellingWord = () => {
  if (!week.value) return

  if (currentWordIndex.value < week.value.words.length - 1) {
    currentWordIndex.value++
    spellingInput.value = ''
    spellingFeedback.value = ''
  } else {
    spellingFeedback.value = `🎉 ${t('exercises.spelling.complete', { score: spellingScore.value, total: week.value.words.length })}`
  }
}

// Memory Game
const memoryCards = ref<Array<{ id: number, word: string, isFlipped: boolean, isMatched: boolean }>>([])
const flippedCards = ref<number[]>([])
const memoryScore = ref(0)

const initMemoryGame = () => {
  if (!week.value) return

  // Take first 5 words and duplicate them
  const words = week.value.words.slice(0, 5)
  const cards = [...words, ...words].map((word, index) => ({
    id: index,
    word,
    isFlipped: false,
    isMatched: false
  }))

  // Shuffle cards
  memoryCards.value = cards.sort(() => Math.random() - 0.5)
  memoryScore.value = 0
  flippedCards.value = []
}

const flipCard = (cardId: number) => {
  const card = memoryCards.value.find(c => c.id === cardId)
  if (!card || card.isFlipped || card.isMatched || flippedCards.value.length >= 2) return

  card.isFlipped = true
  flippedCards.value.push(cardId)

  if (flippedCards.value.length === 2) {
    setTimeout(checkMemoryMatch, 1000)
  }
}

const checkMemoryMatch = () => {
  const [id1, id2] = flippedCards.value
  const card1 = memoryCards.value.find(c => c.id === id1)
  const card2 = memoryCards.value.find(c => c.id === id2)

  if (card1 && card2 && card1.word === card2.word) {
    card1.isMatched = true
    card2.isMatched = true
    memoryScore.value++
  } else {
    if (card1) card1.isFlipped = false
    if (card2) card2.isFlipped = false
  }

  flippedCards.value = []
}

// Quiz Game
const quizQuestions = ref<Array<{ word: string, options: string[], correctAnswer: string }>>([])
const currentQuizIndex = ref(0)
const quizScore = ref(0)
const quizFeedback = ref('')
const selectedAnswer = ref('')

const initQuizGame = () => {
  if (!week.value) return

  quizQuestions.value = week.value.words.map((word) => {
    const otherWords = week.value!.words.filter(w => w !== word)
    const randomWords = otherWords.sort(() => Math.random() - 0.5).slice(0, 3)
    const options = [...randomWords, word].sort(() => Math.random() - 0.5)

    return {
      word,
      options,
      correctAnswer: word
    }
  })

  currentQuizIndex.value = 0
  quizScore.value = 0
  quizFeedback.value = ''
  selectedAnswer.value = ''
}

const checkQuizAnswer = (answer: string) => {
  selectedAnswer.value = answer
  const question = quizQuestions.value[currentQuizIndex.value]

  if (answer === question.correctAnswer) {
    quizScore.value++
    quizFeedback.value = `✅ ${t('exercises.quiz.correct')}`
  } else {
    quizFeedback.value = `❌ ${t('exercises.quiz.wrong', { answer: question.correctAnswer })}`
  }

  setTimeout(() => {
    if (currentQuizIndex.value < quizQuestions.value.length - 1) {
      currentQuizIndex.value++
      quizFeedback.value = ''
      selectedAnswer.value = ''
    } else {
      quizFeedback.value = `🎉 ${t('exercises.quiz.complete', { score: quizScore.value, total: quizQuestions.value.length })}`
    }
  }, 2000)
}

// Initialize games
watch(currentGame, (game) => {
  if (game === 'memory') {
    initMemoryGame()
  } else if (game === 'quiz') {
    initQuizGame()
  } else if (game === 'spelling') {
    currentWordIndex.value = 0
    spellingInput.value = ''
    spellingScore.value = 0
    spellingFeedback.value = ''
  }
}, { immediate: true })

onMounted(() => {
  if (!week.value) {
    navigateTo('/weeks')
  }
})
</script>

<template>
  <div
    v-if="week"
    class="container mx-auto p-6 max-w-5xl"
  >
    <div class="mb-8">
      <NuxtLink
        to="/weeks"
        class="text-primary hover:underline mb-2 inline-block"
      >
        ← {{ $t('exercises.backToWeeks') }}
      </NuxtLink>
      <h1 class="text-4xl font-bold text-primary mb-2">
        🎮 {{ week.title }} - {{ $t('exercises.title') }}
      </h1>
    </div>

    <!-- Game Selector -->
    <div class="flex gap-4 mb-8">
      <UButton
        size="lg"
        :variant="currentGame === 'spelling' ? 'solid' : 'outline'"
        @click="currentGame = 'spelling'"
      >
        🔤 {{ $t('exercises.spelling.name') }}
      </UButton>
      <UButton
        size="lg"
        :variant="currentGame === 'memory' ? 'solid' : 'outline'"
        @click="currentGame = 'memory'"
      >
        🃏 {{ $t('exercises.memory.name') }}
      </UButton>
      <UButton
        size="lg"
        :variant="currentGame === 'quiz' ? 'solid' : 'outline'"
        @click="currentGame = 'quiz'"
      >
        📝 {{ $t('exercises.quiz.name') }}
      </UButton>
    </div>

    <!-- Spelling Game -->
    <UCard
      v-if="currentGame === 'spelling'"
      class="text-center"
    >
      <div class="py-12">
        <h2 class="text-2xl font-bold mb-6">
          {{ $t('exercises.spelling.title') }}
        </h2>

        <div class="mb-6">
          <p class="text-lg text-muted mb-4">
            {{ $t('exercises.spelling.wordOf', { current: currentWordIndex + 1, total: week.words.length }) }}
          </p>
          <p class="text-sm text-muted mb-4">
            {{ $t('common.score') }}: {{ spellingScore }} / {{ week.words.length }}
          </p>

          <UButton
            size="xl"
            icon="i-lucide-volume-2"
            class="mb-6"
            @click="speakWord(week.words[currentWordIndex])"
          >
            🔊 {{ $t('exercises.spelling.listen') }}
          </UButton>

          <div class="max-w-md mx-auto mb-4">
            <UInput
              v-model="spellingInput"
              :placeholder="$t('exercises.spelling.placeholder')"
              size="xl"
              :disabled="spellingFeedback.includes('complete')"
              @keyup.enter="checkSpelling"
            />
          </div>

          <UButton
            size="lg"
            :disabled="!spellingInput.trim() || spellingFeedback.includes('complete')"
            @click="checkSpelling"
          >
            {{ $t('exercises.spelling.check') }}
          </UButton>
        </div>

        <div
          v-if="spellingFeedback"
          class="text-2xl font-bold mt-6"
        >
          {{ spellingFeedback }}
        </div>
      </div>
    </UCard>

    <!-- Memory Game -->
    <UCard v-if="currentGame === 'memory'">
      <div class="py-8">
        <h2 class="text-2xl font-bold mb-6 text-center">
          {{ $t('exercises.memory.title') }}
        </h2>

        <p class="text-center text-muted mb-6">
          {{ $t('exercises.memory.matches', { score: memoryScore }) }}
        </p>

        <div class="grid grid-cols-5 gap-4 max-w-3xl mx-auto">
          <div
            v-for="card in memoryCards"
            :key="card.id"
            class="aspect-square cursor-pointer"
            @click="flipCard(card.id)"
          >
            <div
              class="w-full h-full rounded-lg border-2 flex items-center justify-center font-bold text-lg transition-all"
              :class="{
                'bg-primary text-primary-foreground': card.isFlipped || card.isMatched,
                'bg-muted hover:bg-muted/80': !card.isFlipped && !card.isMatched,
                'opacity-50': card.isMatched
              }"
            >
              {{ (card.isFlipped || card.isMatched) ? card.word : '?' }}
            </div>
          </div>
        </div>

        <div
          v-if="memoryScore === 5"
          class="text-2xl font-bold text-center mt-8"
        >
          🎉 {{ $t('exercises.memory.won') }}
        </div>

        <div class="text-center mt-6">
          <UButton @click="initMemoryGame">
            🔄 {{ $t('exercises.memory.restart') }}
          </UButton>
        </div>
      </div>
    </UCard>

    <!-- Quiz Game -->
    <UCard
      v-if="currentGame === 'quiz'"
      class="text-center"
    >
      <div class="py-12">
        <h2 class="text-2xl font-bold mb-6">
          {{ $t('exercises.quiz.title') }}
        </h2>

        <div v-if="currentQuizIndex < quizQuestions.length">
          <p class="text-lg text-muted mb-4">
            {{ $t('exercises.quiz.questionOf', { current: currentQuizIndex + 1, total: quizQuestions.length }) }}
          </p>
          <p class="text-sm text-muted mb-6">
            {{ $t('common.score') }}: {{ quizScore }} / {{ quizQuestions.length }}
          </p>

          <div class="mb-8">
            <p class="text-xl font-bold mb-2">
              {{ $t('exercises.quiz.spellWord') }}
            </p>
            <UButton
              size="xl"
              icon="i-lucide-volume-2"
              class="mb-6"
              @click="speakWord(quizQuestions[currentQuizIndex].word)"
            >
              🔊 {{ quizQuestions[currentQuizIndex].word }}
            </UButton>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto mb-6">
            <UButton
              v-for="option in quizQuestions[currentQuizIndex].options"
              :key="option"
              size="xl"
              variant="outline"
              :disabled="!!selectedAnswer"
              :color="selectedAnswer === option ? (option === quizQuestions[currentQuizIndex].correctAnswer ? 'green' : 'red') : 'primary'"
              @click="checkQuizAnswer(option)"
            >
              {{ option }}
            </UButton>
          </div>

          <div
            v-if="quizFeedback && !quizFeedback.includes('complete')"
            class="text-xl font-bold"
          >
            {{ quizFeedback }}
          </div>
        </div>

        <div
          v-if="quizFeedback.includes('complete')"
          class="space-y-6"
        >
          <div class="text-2xl font-bold">
            {{ quizFeedback }}
          </div>
          <UButton @click="initQuizGame">
            🔄 {{ $t('exercises.quiz.tryAgain') }}
          </UButton>
        </div>
      </div>
    </UCard>
  </div>
</template>
