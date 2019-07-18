<template>
    <div class="content-editor">
        <div class="input-wrapper">
            <label for="title">Заголовок</label>
            <input type="text" id="title" v-model="title"/>
        </div>
        <div class="input-wrapper">
            <label for="subtitle">Подзаголовок</label>
            <input type="text" id="subtitle" v-model="subtitle"/>
        </div>
        <div class="input-wrapper">
            <label for="article">Статья</label>
            <textarea ref="textarea" class="text-area editor-element" id="article"
                      v-model="clean_article_text"></textarea>
        </div>
        <div class="manage">
            <image-button @image_load="image_load"></image-button>
            <transition name="fade" mode="out-in">
                <save-button v-if="title !=='' &&subtitle !=='' &&clean_article_text !==''"
                             @save_article="save_article"></save-button>
            </transition>
        </div>
    </div>
</template>

<script>
    /* eslint-disable no-console */


    import SaveButton from './ContentEditorBoxEditSave'
    import ImageButton from './ContentEditorBoxEditAddImage'

    const uuidv4 = require('uuid/v4');
    import {db, storage} from '../main.js'


    export default {
        name: "ContentEditorBoxEdit",
        components: {
            SaveButton,
            ImageButton
        },
        data() {
            return {
                clean_article_text: '',
                title: '',
                subtitle: '',
                lowres_image: '',
                highres_image: '',
                highres_url: '',
                lowres_url: '',
                images_path: '',
                default_image_url: 'https://firebasestorage.googleapis.com/v0/b/blogrnt.appspot.com/o/articles%2F'
            }
        },
        mounted: function () {
            this.images_path = 'article_id_' + uuidv4() + '/'
            //console.log(this.$refs.textarea.selectionStart) Позиция каретки, поподробнее разобрать
        },
        computed: {
            article_text: function () {
                let article_text = '<p>'
                article_text += this.clean_article_text.replace(/\n/g, '</p><p>')
                return article_text + '</p>'
            }
        },
        methods: {
            save_article: function () {

                db.collection('articles').add({
                    Title: this.title,
                    Subtitle: this.subtitle,
                    Article: this.article_text
                })
            },
            to_latin: function (text) { //Потом для создания рутов юзать эту функцию + uuidv4() (что-то вроде new-article-123bfkks7hn23ifd)
                var arrru = new Array('Я', 'я', 'Ю', 'ю', 'Ч', 'ч', 'Ш', 'ш', 'Щ', 'щ', 'Ж', 'ж', 'А', 'а', 'Б', 'б', 'В', 'в', 'Г', 'г', 'Д', 'д', 'Е', 'е', 'Ё', 'ё', 'З', 'з', 'И', 'и', 'Й', 'й', 'К', 'к', 'Л', 'л', 'М', 'м', 'Н', 'н', 'О', 'о', 'П', 'п', 'Р', 'р', 'С', 'с', 'Т', 'т', 'У', 'у', 'Ф', 'ф', 'Х', 'х', 'Ц', 'ц', 'Ы', 'ы', 'Ь', 'ь', 'Ъ', 'ъ', 'Э', 'э');
                var arren = new Array('Ya', 'ya', 'Yu', 'yu', 'Ch', 'ch', 'Sh', 'sh', 'Sh', 'sh', 'Zh', 'zh', 'A', 'a', 'B', 'b', 'V', 'v', 'G', 'g', 'D', 'd', 'E', 'e', 'E', 'e', 'Z', 'z', 'I', 'i', 'J', 'j', 'K', 'k', 'L', 'l', 'M', 'm', 'N', 'n', 'O', 'o', 'P', 'p', 'R', 'r', 'S', 's', 'T', 't', 'U', 'u', 'F', 'f', 'H', 'h', 'C', 'c', 'Y', 'y', '`', '`', '\'', '\'', 'E', 'e');
                for (var i = 0; i < arrru.length; i++) {
                    var reg = new RegExp(arrru[i], "g");
                    text = text.replace(reg, arren[i]);
                }
                return text;
            },
            send_image: function (file_name) {
                let self = this
                storage.ref().child(self.images_path + file_name).put(self.highres_image).then(function (response) {
                    if (response.state === 'success') {
                        storage.ref().child(self.images_path + file_name).getDownloadURL().then(function (url) {
                            self.highres_url = url
                            //let img_tag = '<img src=' + '"' + self.highres_url + '"' + '/>' //Допилить (но уже работает)
                            //console.log(img_tag)
                        })
                        storage.ref().child(self.images_path + file_name + '_lowres').put(self.lowres_image).then(function (response) {
                            if (response.state === 'success') {
                                storage.ref().child(self.images_path + file_name + '_lowres').getDownloadURL().then(function (url) {
                                    self.lowres_url = url
                                })
                                console.log('done')
                            }
                        })
                    }
                })
            },
            create_jpg_image: function (file_name, image_file, MAX_WIDTH, MAX_HEIGHT, type) {
                const reader = new FileReader();
                reader.readAsDataURL(image_file)
                let self = this
                reader.onload = event => {
                    const img = new Image();
                    img.src = event.target.result;
                    img.onload = () => {
                        const elem = document.createElement('canvas');
                        var width = img.width;
                        var height = img.height;
                        if (width > height) {
                            if (width > MAX_WIDTH) {
                                height *= MAX_WIDTH / width;
                                width = MAX_WIDTH;
                            }
                        } else {
                            if (height > MAX_HEIGHT) {
                                width *= MAX_HEIGHT / height;
                                height = MAX_HEIGHT;
                            }
                        }
                        elem.width = width;
                        elem.height = height;
                        const ctx = elem.getContext('2d');
                        // img.width and img.height will contain the original dimensions
                        ctx.drawImage(img, 0, 0, width, height);
                        ctx.canvas.toBlob((blob) => {
                            const file = new File([blob], file_name, {
                                type: 'image/jpeg',
                                lastModified: Date.now()
                            });
                            console.log(file)
                            if (type === 'highres') {
                                self.highres_image = file
                                self.create_jpg_image(file_name, image_file, 20, 20)
                            }
                            else {
                                self.lowres_image = file
                                self.send_image(file_name)
                            }

                        }, 'image/jpeg', 1);

                    },
                        reader.onerror = error => console.log(error);
                }
            },
            image_load: function (event) {
                let file_name = uuidv4()
                let image_file = event.target.files[0];
                this.create_jpg_image(file_name, image_file, 2000, 2000, 'highres')
            }
        },
    }
</script>

<style scoped lang="sass">
    @import "../variables.sass"
    .content-editor
        height: 100%
        display: block
        position: relative
        .input-wrapper
            width: 100%
            padding: $editor-element-padding
            //float: left
            label, input
                display: block
            label
                padding-bottom: 10px
            input
                width: 100%
                border: none
                padding: 5px 0
                border-bottom: $content-editor-border
                &#title
                    font-family: $title_font
                    letter-spacing: 2px
                    font-size: 3em
                &#subtitle
                    font-family: $subtitle_font
                    font-size: 1.5em
                    color: gray
        .text-area
            display: block
            resize: none
            font-size: 1.3em
            position: relative
            border: none
            min-width: 100%
            max-width: 100%
            min-height: 200px
            max-height: 100%
        .manage
            width: 100%
            display: flex
            flex-direction: row
            justify-content: space-between
            padding: 10px 10px 10px 10px
            & > *
                height: 50px
                cursor: pointer
</style>