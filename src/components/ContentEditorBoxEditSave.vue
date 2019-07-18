<template>
    <div class="save-button" @click="$emit('save_article')">
        <span>Сохранить</span>
    </div>
</template>

<script>
    export default {
        name: "ContentEditorBoxEditSave"
    }
</script>

<style scoped lang="sass">

    @import "../variables"

    .save-button
        +deselect
        display: block
        padding: 0 10px
        border: $content-editor-border
        border-radius: $nav-button-border-radius
        transition: $smooth-animation
        color: black
        line-height: 50px
        &:hover
            background: $active-color
            color: white
</style>