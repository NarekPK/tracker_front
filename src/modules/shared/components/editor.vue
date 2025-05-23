<template>
  <div class="editor" @click.prevent>
    <div class="editor-menu" v-if="showMenu || value">
      <!-- BOLD -->
      <button
        class="editor-menu__button"
        :class="{ 'is-active': weight === '700' }"
        @click="toggleBold"
      >
        <q-icon class="editor-menu__icon" name="format_bold" />
        <q-tooltip anchor="top middle" self="top middle" :offset="[25, 25]" class="bg-primary">{{ t('BOLD') }}</q-tooltip>
      </button>
      <!-- ./BOLD -->

      <!-- ITALIC -->
      <button
        class="editor-menu__button"
        :class="{ 'is-active': editor?.isActive('textStyle', { fontStyle: 'italic' }) }"
        @click="toggleItalic"
      >
        <q-icon class="editor-menu__icon" name="format_italic"/>
        <q-tooltip anchor="top middle" self="top middle" :offset="[25, 25]" class="bg-primary">{{ t('ITALICS') }}</q-tooltip>
      </button>
      <!-- ./ITALIC -->

      <!-- UNDERLINE -->
      <button
        class="editor-menu__button"
        :class="{ 'is-active': editor?.isActive('underline') }"
        @click="editor?.chain().focus().toggleUnderline().run()"
      >
        <q-icon class="editor-menu__icon" name="format_underlined" />
        <q-tooltip anchor="top middle" self="top middle" :offset="[25, 25]" class="bg-primary">{{ t('UNDERLINED') }}</q-tooltip>
      </button>
      <!-- ./UNDERLINE -->

      <!-- STRIKE -->
      <button
        class="editor-menu__button"
        :class="{ 'is-active': editor?.isActive('strike') }"
        @click="editor?.commands.toggleStrike()"
      >
        <q-icon class="editor-menu__icon" name="strikethrough_s" />
        <q-tooltip anchor="top middle" self="top middle" :offset="[25, 25]" class="bg-primary">{{ t('STRIKED') }}</q-tooltip>
      </button>
      <!-- ./STRIKE -->

      <!-- COLOR -->

      <button class="editor-menu__button">
        <q-icon class="editor-menu__icon" name="colorize" />
        <q-tooltip anchor="top middle" self="top middle" :offset="[25, 25]" class="bg-primary">{{ t('COLOR') }}</q-tooltip>
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
        <q-tooltip anchor="top middle" self="top middle" :offset="[25, 25]" class="bg-primary">{{ t('BULLET_LIST') }}</q-tooltip>
      </button>
      <button
        class="editor-menu__button"
        :class="{ 'is-active': editor?.isActive('orderedList') }"
        @click="editor?.chain().focus().toggleOrderedList().run()"
      >
        <q-icon class="editor-menu__icon" name="format_list_numbered" />
        <q-tooltip anchor="top middle" self="top middle" :offset="[25, 25]" class="bg-primary">{{ t('ORDERED_LIST') }}</q-tooltip>
      </button>

      <!-- FONT-SIZE -->
      <q-select
        v-if="currentFontSize"
        class="editor-menu__select"
        :options="fontSizes"
        v-model="currentFontSize"
        @update:model-value="editor?.chain().focus().setStyles({ fontSize: $event}).run()"
        borderless
        :dense="true"
      />
      <!-- ./FONT-SIZE -->

      <!-- LINK -->
      <!-- <button
        class="editor-menu__button"
        :class="{ 'is-active': editor?.isActive('link') }"
        @click.stop="handleShowLinkMenu"
      >
        <q-icon class="editor-menu__icon" name="link" />
        <q-tooltip anchor="top middle" self="top middle" :offset="[25, 25]" class="bg-primary">Ссылка</q-tooltip>
      </button> -->

      <!-- ./LINK -->

      <!-- CODE -->
      <button
        class="editor-menu__button"
        :class="{ 'is-active': editor?.isActive('codeBlock') }"
        @click="editor?.commands.toggleCodeBlock()"
      >
        <q-icon class="editor-menu__icon" name="code" />
        <q-tooltip anchor="top middle" self="top middle" :offset="[25, 25]" class="bg-primary">{{ t('CODE') }}</q-tooltip>
      </button>

      <!-- ./CODE -->

      <button
        class="editor-menu__button"
        @click="editor?.chain().focus().unsetAllMarks().run()"
      >
        <q-icon class="editor-menu__icon" name="auto_fix_normal" />
        <q-tooltip anchor="top middle" self="top middle" :offset="[25, 25]" class="bg-primary">{{ t('RESET_STYLES') }}</q-tooltip>
      </button>
    </div>

    <Editor-Content
      :editor="editor"
      class="editor-content"
      :class="{ 'editor-content--fixed': fixedHeight }"
    />
  </div>
</template>

<script setup>
import { ref, computed, reactive, watch } from 'vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import TextStyle from '@tiptap/extension-text-style'
import TextCustomStyles from 'src/modules/shared/utils/editor/extension-custom-styles'
import { clearTagsWithExclusions } from 'src/modules/shared/utils/editor/clear-tags'
import HardBreak from '@tiptap/extension-hard-break'
import { Fragment } from '@tiptap/pm/model'
import Code from '@tiptap/extension-code'
import Placeholder from '@tiptap/extension-placeholder'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const emit = defineEmits(['editor-focus', 'editor-blur', 'update:value'])
const props = defineProps({
  value: {
    type: String,
    default: ''
  },
  showMenu: {
    type: Boolean,
    default: true
  },
  fixedHeight: {
    type: Boolean,
    default: true
  },
  isComment: {
    type: Boolean,
    default: false
  },
})

// editor init
const options = {
  content: props.value,
  editorProps: {
    transformPastedText(text) {
      return text.replace(/\u00a0|&nbsp;/g, ' ')
    },
    transformPastedHTML(html) {
      return clearTagsWithExclusions(html.replace(/\u00a0|&nbsp;/g, ' '), ['br', 'p'])
    },
    transformPasted: (slice, editorView) => {
      const fragment = slice.content

      const isMultipleParagraphs = fragment.content.length > 1 && fragment.content.every(node => node.type.name === 'paragraph')

      // чистим от всех marks
      if (!isMultipleParagraphs) {
        fragment.descendants(child => {
          child.marks = []
        })
        slice.content = fragment
        return slice
      }

      // при вставке нескольких абзацев необходимо их склеить в одну node для корректной генерации HTML
      const nodes = []

      fragment.forEach(child => {
        if (child.textContent && child.textContent.trim()) {
          const nodeText = editorView.state.schema.text(child.textContent)
          nodes.push(nodeText)
        }
      })

      // между абзацами ставим 2 <br>
      const brEl = editorView.state.schema.nodes.hardBreak
      const breakLineArray = [brEl.create(), brEl.create()]

      const nodesWithBreaks = nodes.reduce((acc, curr, index) => {
        if (index) return [...acc, ...breakLineArray, curr]
        return [...acc, curr]
      }, [])

      const newFragment = new Fragment(nodesWithBreaks)
      slice.content = newFragment
      return slice
    }
  },
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
    Code,
    Placeholder.configure({
      placeholder: props.isComment ? t('WRITE_COMMENT') : '',
    })
  ],
  onUpdate: ({ editor }) => {
    editorChange.value = true
    // const html = editor.getHTML().replace(/(<\/p>)|(<p>)/g, '').trim().replace(/<br>$/, '<br><br>')
    const html = editor.getHTML().replace('<p></p>', '')
    emit('update:value', html)
    currentFontSize.value = editor.value?.getAttributes('textStyle').fontSize || computedStyles.fontSize
  },
  onFocus ({ event }) {
    const { fontSize, color, fontWeight, fontStyle } = getComputedStyle(event.target)
    computedStyles.fontWeight = fontWeight
    computedStyles.fontStyle = fontStyle
    computedStyles.fontSize = fontSize
    computedStyles.color = color
    emit('editor-focus')
  },
  onBlur ({ event }) {
    if (!event.relatedTarget?.closest('.editor')) emit('editor-blur')
  }
}

const editor = useEditor(options)
const computedStyles = reactive({})
const editorChange = ref(false)

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

watch(() => props.value, (val) => {
  if (editor.value && !editorChange.value) {
    editor.value.commands.setContent(val, false)
  }
  editorChange.value = false
})

</script>

<style lang="sass" scoped>
.editor
  border-radius: 8px
  box-shadow: 0px 3px 12px rgba(10, 8, 58, 0.13)
  overflow: hidden
  background: #fff

.editor-content:deep
  .ProseMirror
    outline: none
    max-height: 100%
    border-radius: 4px
    padding: 10px
  code
    background: #f5f5f5
  .is-editor-empty:first-child::before
    color: $secondary-text
    content: attr(data-placeholder)
    float: left
    height: 0
    pointer-events: none

.editor-content--fixed:deep
  .ProseMirror
    min-height: 500px

.editor-menu
  display: flex
  flex-wrap: wrap
  align-items: center
  min-height: 40px
  background: #FFFFFF
  box-shadow: 0px 3px 12px rgba(10, 8, 58, 0.13)
  border-radius: 4px
  padding: 5px 12px
  gap: 8px

.editor-menu__button
  background: none
  border: none
  cursor: pointer
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
