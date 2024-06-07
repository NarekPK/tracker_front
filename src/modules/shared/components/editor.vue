<template>
  <div class="editor" @click.prevent>
    <div class="editor-menu">
      <!-- BOLD -->
      <button
        class="editor-menu__button"
        :class="{ 'is-active': weight === '700' }"
        @click="toggleBold"
      >
        <q-icon class="editor-menu__icon" name="format_bold" />
        <q-tooltip anchor="top middle" self="top middle" :offset="[25, 25]">{{ t('BOLD') }}</q-tooltip>
      </button>
      <!-- ./BOLD -->

      <!-- ITALIC -->
      <button
        class="editor-menu__button"
        :class="{ 'is-active': editor?.isActive('textStyle', { fontStyle: 'italic' }) }"
        @click="toggleItalic"
      >
        <q-icon class="editor-menu__icon" name="format_italic"/>
        <q-tooltip anchor="top middle" self="top middle" :offset="[25, 25]">{{ t('ITALICS') }}</q-tooltip>
      </button>
      <!-- ./ITALIC -->

      <!-- UNDERLINE -->
      <button
        class="editor-menu__button"
        :class="{ 'is-active': editor?.isActive('underline') }"
        @click="editor?.chain().focus().toggleUnderline().run()"
      >
        <q-icon class="editor-menu__icon" name="format_underlined" />
        <q-tooltip anchor="top middle" self="top middle" :offset="[25, 25]">{{ t('UNDERLINED') }}</q-tooltip>
      </button>
      <!-- ./UNDERLINE -->

      <!-- STRIKE -->
      <button
        class="editor-menu__button"
        :class="{ 'is-active': editor?.isActive('strike') }"
        @click="editor?.commands.toggleStrike()"
      >
        <q-icon class="editor-menu__icon" name="strikethrough_s" />
        <q-tooltip anchor="top middle" self="top middle" :offset="[25, 25]">{{ t('STRIKED') }}</q-tooltip>
      </button>
      <!-- ./STRIKE -->

      <!-- COLOR -->

      <button class="editor-menu__button">
        <q-icon class="editor-menu__icon" name="colorize" />
        <q-tooltip anchor="top middle" self="top middle" :offset="[25, 25]">{{ t('COLOR') }}</q-tooltip>
        <q-menu>
          <q-color
            v-model="currentColor"
            class="my-picker"
            @change="editor.chain().focus().setStyles({ color: $event }).run()"
          />
        </q-menu>
      </button>

      <!-- ./COLOR -->

      <button
        class="editor-menu__button"
        :class="{ 'is-active': editor?.isActive('bulletList') }"
        @click="editor?.chain().focus().toggleBulletList().run()"
      >
        <q-icon class="editor-menu__icon" name="format_list_bulleted" />
        <q-tooltip anchor="top middle" self="top middle" :offset="[25, 25]">{{ t('BULLET_LIST') }}</q-tooltip>
      </button>
      <button
        class="editor-menu__button"
        :class="{ 'is-active': editor?.isActive('orderedList') }"
        @click="editor?.chain().focus().toggleOrderedList().run()"
      >
        <q-icon class="editor-menu__icon" name="format_list_numbered" />
        <q-tooltip anchor="top middle" self="top middle" :offset="[25, 25]">{{ t('ORDERED_LIST') }}</q-tooltip>
      </button>

      <!-- FONT-SIZE -->
      <q-select
        v-if="currentFontSize"
        class="editor-menu__select"
        :options="fontSizes"
        v-model="currentFontSize"
        @update:model-value="editor?.chain().focus().setStyles({ fontSize: $event}).run()"
        borderless
      />
      <!-- ./FONT-SIZE -->

      <!-- LINK -->
      <!-- <button
        class="editor-menu__button"
        :class="{ 'is-active': editor?.isActive('link') }"
        @click.stop="handleShowLinkMenu"
      >
        <q-icon class="editor-menu__icon" name="link" />
        <q-tooltip anchor="top middle" self="top middle" :offset="[25, 25]">Ссылка</q-tooltip>
      </button> -->

      <!-- ./LINK -->

      <!-- CODE -->
      <button
        class="editor-menu__button"
        :class="{ 'is-active': editor?.isActive('codeBlock') }"
        @click="editor?.commands.toggleCodeBlock()"
      >
        <q-icon class="editor-menu__icon" name="code" />
        <q-tooltip anchor="top middle" self="top middle" :offset="[25, 25]">{{ t('CODE') }}</q-tooltip>
      </button>

      <!-- ./CODE -->

      <button
        class="editor-menu__button"
        @click="editor?.chain().focus().unsetAllMarks().run()"
      >
        <q-icon class="editor-menu__icon" name="auto_fix_normal" />
        <q-tooltip anchor="top middle" self="top middle" :offset="[25, 25]">{{ t('RESET_STYLES') }}</q-tooltip>
      </button>
    </div>

    <editor-content
      :editor="editor"
      class="editor-content"
    />
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import TextStyle from '@tiptap/extension-text-style'
import TextCustomStyles from 'src/modules/shared/utils/editor/extension-custom-styles'
import HardBreak from '@tiptap/extension-hard-break'
import Code from '@tiptap/extension-code'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const emit = defineEmits(['editor-focus', 'editor-blur', 'update:value'])
const props = defineProps({
  value: {
    type: String,
    default: ''
  }
})

// editor init
const options = {
  content: props.value,
  extensions: [
    StarterKit.configure({
      bold: false,
      italic: false,
      hardBreak: false
    }),
    HardBreak,
    TextStyle,
    TextCustomStyles,
    Link,
    Underline,
    Code
  ],
  onUpdate: ({ editor }) => {
    // const html = editor.getHTML().replace(/\u2028/g, ' ').replace(/(<\/p>)|(<p>)/g, '').trim().replace(/<br>$/, '<br><br>')
    emit('update:value', editor.getHTML())
    currentFontSize.value = editor.value?.getAttributes('textStyle').fontSize || computedStyles.fontSize
  },
  onFocus ({ event }) {
    const { fontSize, color, fontWeight, fontStyle } = getComputedStyle(event.target)
    computedStyles.fontWeight = fontWeight
    computedStyles.fontStyle = fontStyle
    computedStyles.fontSize = fontSize
    computedStyles.color = color
  }
}

const editor = useEditor(options)
const computedStyles = reactive({})

// bold
const weight = computed(() => editor.value?.getAttributes('textStyle').fontWeight || computedStyles.fontWeight)
function toggleBold () {
  const fontWeight = weight.value === '400' ? '700' : '400'
  editor.value?.chain().focus().setStyles({ fontWeight }).run()
}

// italic
const style = computed(() => editor.value?.getAttributes('textStyle').fontStyle || computedStyles.fontStyle)
function toggleItalic () {
  const fontStyle = style.value === 'italic' ? 'normal' : 'italic'
  editor.value?.chain().focus().setStyles({ fontStyle }).run()
}

// font-size
const fontSizes = generateFontSizes(8, 64, 2).map(s => ({ label: s + 'px', value: s + 'px' }))
const currentFontSize = ref(editor.value?.getAttributes('textStyle').fontSize || computedStyles.fontSize)

function generateFontSizes (min, max, step) {
  const sizes = []
  for (let i = min; i <= max; i = i + step) {
    sizes.push(i)
  }
  return sizes
}

// color
const currentColor = ref(editor.value?.getAttributes('textStyle').color || computedStyles.color)

</script>

<style lang="sass" scoped>
.editor
  box-shadow: 0px 3px 12px rgba(10, 8, 58, 0.13)

.editor-content:deep
  .ProseMirror
    outline: none
    min-height: 500px
    max-height: 100%
    border-radius: 4px
    padding: 10px
  code
    background: #f5f5f5

.editor-menu
  display: flex
  flex-wrap: wrap
  align-items: center
  min-height: 50px
  background: #FFFFFF
  box-shadow: 0px 3px 12px rgba(10, 8, 58, 0.13)
  border-radius: 4px
  padding-left: 12px
  padding-right: 12px

.editor-menu__button
  background: none
  border: none
  cursor: pointer
  margin-right: 8px
  flex-shrink: 0
  display: flex
  align-items: center
  justify-content: center
  position: relative
  height: 36px
  &:last-child
    margin-right: 0
  &.is-active
    background: $primary
    border-radius: 4px
    color: #ffffff
    &:hover .editor-menu__icon
      color: #000
  &:hover .editor-menu__icon
    color: $primary

.editor-menu__icon
  font-size: 24px
  transition: color 0.3s
  &:hover
    color: $primary

</style>
