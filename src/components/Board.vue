<script setup lang="ts">

import { useBemm } from "bemm";

const bemm = useBemm('board')

</script>

<template>
  <div :class="bemm()">
    <slot></slot>
  </div>
</template>

<style>
.board {
  display: flex;
  flex-wrap: wrap;
align-items: center;
  justify-content: center;
  gap: var(--space);
}
</style>
