import { computed, reactive, watch } from "vue";
import { retrieveState, saveState } from "@sil/storage";
import type { CardData } from "./useCards.model";


const storageKey = "tiko:choices";

const state = reactive<{
  cards: CardData[];
}>({
  cards: [],
});

watch(() => state.cards, (cards) => {
  if(state.cards.length > 0) saveState(cards, storageKey);
})

export const useCards = () => {

  const loadCards = async () => {
    const savedState = await retrieveState([], storageKey);
    if (savedState) {
      // Convert the saved state to an array if it's not already
      const plainCards = Array.isArray(savedState)
        ? JSON.parse(JSON.stringify(savedState))
        : Object.values(JSON.parse(JSON.stringify(savedState)));
      setCards(plainCards);
    }
  }
  loadCards();


  const setCards = (cards: CardData[]) => {
    state.cards = cards;
  }

  const addCard = (card: CardData) => {
    state.cards.push(card);
  }

  const removeCard = (card: CardData) => {
    const index = state.cards.indexOf(card);
    if (index > -1) {
      state.cards.splice(index, 1);
    }
  }

  const resetCards = () => {
    state.cards = [];
    saveState([], storageKey);
  }

  return {
    setCards,
    addCard,
    // Convert the Proxy object to a plain array when accessing cards
    cards: computed<CardData[]>(() => JSON.parse(JSON.stringify(state.cards))),
    removeCard,
    resetCards
  }
}
