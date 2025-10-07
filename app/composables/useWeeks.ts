export interface Week {
  id: string
  title: string
  words: string[]
}

export const useWeeks = () => {
  const weeks = useLocalStorage<Week[]>('wordypond-weeks', [])

  const addWeek = (title: string, words: string[]) => {
    const newWeek: Week = {
      id: Date.now().toString(),
      title,
      words
    }
    weeks.value = [...weeks.value, newWeek]
    return newWeek
  }

  const getWeek = (id: string) => {
    return weeks.value.find(week => week.id === id)
  }

  const updateWeek = (id: string, data: Partial<Week>) => {
    const index = weeks.value.findIndex(week => week.id === id)
    if (index !== -1) {
      weeks.value[index] = { ...weeks.value[index], ...data }
    }
  }

  const deleteWeek = (id: string) => {
    weeks.value = weeks.value.filter(week => week.id !== id)
  }

  return {
    weeks,
    addWeek,
    getWeek,
    updateWeek,
    deleteWeek
  }
}
