<script setup lang="ts">
import { useBemm } from 'bemm';

import {Button, ButtonSettings, popupService, Popup, Card, Size } from '@tikotalks/lib';
import { useSpeech } from '@tikotalks/lib';

import Board from './components/Board.vue'
import CardCreator from './components/CardCreator.vue';

import { useCards } from './composables/useCards';
const bemm = useBemm('app')

const openCreateCard = ()=>{
  popupService.showPopup({
    component: CardCreator,
      title: 'Create Card'
  })
}


const { cards } = useCards();
const { speak } = useSpeech();

const say = (text:string)=>{
  speak(text)
}

</script>

<template>
<div :class="bemm()">

<header :class="bemm('header')">
  <Button :icon="ButtonSettings.Icon.ADD_M" :color="ButtonSettings.Color.Secondary" @click="openCreateCard()"></Button>
</header>

  <Board>
    <Card v-for="card in cards" :size="Size.Large" :text="card.text" :image="card.image.name" @click="say(card.speak)"></Card>
  </Board>
</div>
<Popup />
</template>

<style lang="scss">
.app{
  &__header{
    position: fixed; top: 0; left: 0; right: 0;
    padding: var(--space);
    display: flex;
    justify-content: flex-end;
  }
}
</style>
