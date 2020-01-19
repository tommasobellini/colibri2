<template>
  <text> {{item.id}}. {{item.text}} </text>
</template>
<script>
export default {
  props: {
    item: {
      Type: Object
    }
  }
};
</script>