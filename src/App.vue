<template>
    <div id="app">
        <content-editor-box class="editor-component"/>
    </div>
</template>

<script>

    import ContentEditorBox from './components/ContentEditorBox'
    export default {
        name: 'app',
        components: {
            ContentEditorBox
        }
    }
</script>

<style scoped lang="sass">
    @import "variables"
    @import "./normalize/normalize.css"
    body
        font-size: $default-font-size
    .editor-component
        position: relative
        top: $editor-top
</style>
