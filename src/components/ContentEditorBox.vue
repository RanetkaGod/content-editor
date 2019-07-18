<template>
    <div class="content-editor-wrapper">
        <div class="navigation">
            <div @click="currentComponent=key" v-for="(tab, key) in tabs" :key="key" class="navigation-button"
                 :class="{active: currentComponent===key}"><span>{{tab}}</span></div>
        </div>
        <transition name="fade"  mode="out-in">
            <keep-alive>
                <component :is="currentComponent"></component>
            </keep-alive>
        </transition>
    </div>
</template>

<script>
    import ContentEditorBoxEdit from './ContentEditorBoxEdit'
    import ContentEditorBoxPreview from './ContentEditorBoxPreview'

    export default {
        name: "ContentEditorBox",
        components: {
            ContentEditorBoxEdit,
            ContentEditorBoxPreview
        },
        data() {
            return {
                tabs: {ContentEditorBoxEdit: 'Редактор', ContentEditorBoxPreview: 'Превью'},
                currentComponent: 'ContentEditorBoxEdit',
            }
        }
    }
</script>

<style scoped lang="sass">
    @import "../variables.sass"

    .content-editor-wrapper
        border-bottom: $content-editor-border
        position: relative
        top: $editor-top
        font-family: $default-font
        .navigation
            width: 100%
            height: $nav-height
            padding: 0 10px 0 10px
            display: flex
            flex-direction: row
            justify-content: flex-end
            align-items: center
            border-bottom: $content-editor-border
            .navigation-button
                +deselect
                //width: 200px
                text-align: center
                font-size: 1.1em
                font-weight: 400
                border: $content-editor-border
                border-bottom: none
                height: 100%
                border-top-left-radius: $nav-button-border-radius
                border-top-right-radius: $nav-button-border-radius
                line-height: $nav-height
                padding: 0 10px 0 10px
                cursor: pointer
                transition: $smooth-animation
                &.active
                    background: $active-color
                    color: white
                &:first-child
                    border-right: none
</style>