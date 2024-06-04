import { Extension } from '@tiptap/core'

export default Extension.create({
  name: 'TextCustomStyles',

  addOptions () {
    return {
      types: ['textStyle']
    }
  },

  addGlobalAttributes () {
    return [
      {
        types: this.options.types,
        attributes: {
          fontWeight: {
            default: null,
            parseHTML: element => element.style.fontWeight,
            renderHTML: attributes => {
              if (!attributes.fontWeight) {
                return {}
              }

              return {
                style: `font-weight: ${attributes.fontWeight}`
              }
            }
          },
          fontStyle: {
            default: null,
            parseHTML: element => element.style.fontStyle,
            renderHTML: attributes => {
              if (!attributes.fontStyle) return {}

              return {
                style: `font-style: ${attributes.fontStyle}`
              }
            }
          },
          fontSize: {
            default: null,
            parseHTML: element => {
              const value = element.style.fontSize?.replace(/\D/g, '')
              return value && value + 'px'
            },
            renderHTML: attributes => {
              if (!attributes.fontSize) return {}
              return {
                style: `font-size: ${attributes.fontSize.value}`
              }
            }
          },
          color: {
            default: null,
            parseHTML: element => element.style.color?.replace(/['"]+/g, ''),
            renderHTML: attributes => {
              if (!attributes.color) return {}

              return {
                style: `color: ${attributes.color}`
              }
            }
          }
        }
      }
    ]
  },

  addCommands () {
    return {
      setStyles: attrs => ({ chain }) => {
        return chain()
          .setMark('textStyle', attrs)
          .run()
      }
    }
  }
})
