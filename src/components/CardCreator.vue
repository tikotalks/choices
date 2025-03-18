<template>
  <div :class="bemm()">
    <section :class="bemm('section')">

    <FormGroup>
      <InputText v-if="!selectedImage" label="Search Image"  v-model="searchImage" />
  </FormGroup>

    <Card v-if="selectedImage" :image="selectedImage.name" :text="titleCard" :actions="[{
      icon: ButtonSettings.Icon.MULTIPLY_M,
      label: 'Clear',
      action: removeSelectedImage
    }]"></Card>
    <FormGroup>

    <InputText v-if="selectedImage" label="Speak" v-model="speakCard" />
    <InputText v-if="selectedImage" label="Title" v-model="titleCard" />
    <Button :color="ButtonSettings.Color.Primary" :icon="ButtonSettings.Icon.ADD_M" v-if="selectedImage" @click="addCard">Add card</Button>
  </FormGroup>


      <div :class="bemm('card-list', ['','capped'])">
        <Card  v-for="image in imageOptions" :size="Size.Small" @click="selectImage(image)" :image="image.name" :text="image.title"></Card>
      </div>


    </section>

    <section :class="bemm('section',['','selected'])">
      <h3>My Cards</h3>
      <div :class="bemm('card-list')">
        <Card v-for="card in myCards" :image="card.image.name" :text="card.text" @click="say(card.speak)"
          :actions="[{
            icon: ButtonSettings.Icon.MULTIPLY_M,
            label: 'Delete',
            action: ()=>deleteCard(card)
          }]"
        />
      </div>
    </section>

    <Button v-if="hasNewCards" @click="saveCards" :color="ButtonSettings.Color.Secondary">Save</Button>


  </div>
</template>


<script lang="ts" setup>
import { InputText, Card, Button,  ButtonSettings, useSpeech, FormGroup, Size, popupService } from "@tikotalks/lib";
import { useImages, type ImageData } from "@tikotalks/media";
import { useBemm } from "bemm";
import { computed, onMounted, ref, watch } from "vue";

import type { CardData } from '../composables/useCards.model'

import { useCards } from "../composables/useCards";

const { setCards, cards } = useCards()

const { speak } = useSpeech()
const { searchImages } = useImages()


const searchImage = ref('')

const speakCard = ref('')
const titleCard = ref('')

const myCards = ref<CardData[]>([])

const bemm = useBemm('card-creator');

onMounted(()=>{
  setCurrentCards()
})

const setCurrentCards = ()=>{
  cards.value.map((card)=>{
    myCards.value.push(card)
  })
}
const hasNewCards = computed(()=>{
  if(!myCards.value) return false;

    if(myCards.value.length === cards.value.length){
      return myCards.value.some((card, index)=>card !== cards.value[index])
    } else {
      return true;
    }
})

const imageOptions = ref<ImageData[]>();

const selectedImage = ref<ImageData>();

watch(()=>searchImage.value,()=>{
  if(selectedImage.value) return;
  if(!searchImage.value) return imageOptions.value = undefined;
  else {

    imageOptions.value = searchImages([searchImage.value])
  }
})

const addCard = ()=>{
  if(!selectedImage.value) return;
  myCards.value.push({
    text: titleCard.value,
    image: selectedImage.value,
    speak: speakCard.value
  })
  resetValues();
}

const deleteCard = (card:CardData)=>{
  myCards.value = myCards.value.filter(c=>c !== card)
}

const resetValues = ()=>{
searchImage.value = '';
speakCard.value = '';
titleCard.value = '';
  selectedImage.value = undefined
}

const selectImage = (image:ImageData)=>{
  imageOptions.value = undefined
  titleCard.value = image.title;
  speakCard.value = image.title;
  selectedImage.value = image
}

const removeSelectedImage = ()=>{
  selectedImage.value = undefined
}

const say = (text:string)=>{
  speak(text);
}

const saveCards = ()=>{
 setCards(myCards.value)
 popupService.closeAllPopups()
}
</script>

<style lang="scss">
.card-creator{
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: var(--space);

  width: 80vw;

  &__section{
    border-radius: var(--space);
    padding: var(--space);
    width: 100%;

    &--selected{
      background-color: color-mix(in srgb, var(--color-primary), transparent 50%);
    }
  }

  &__card-list{
    display: flex;
    flex-wrap: wrap;
    gap: var(--space);

    &--capped{
      max-height: 50vh;
      overflow: auto;
      padding: var(--space);
      background-color: var(--color-background);border-radius: var(--border-radius);
    }

  }


}

// .row{
//   display: flex;
//   gap: var(--space);
//   .column{
//     width: 50%;
//   }
// }
</style>
