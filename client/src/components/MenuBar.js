import React, { useEffect, useState, useCallback } from 'react'

export default function MenuBar({ editor }) {
  // 1. Estado dummy para forzar re-render
  const [, forceUpdate] = useState(0)
  const rerender = useCallback(() => forceUpdate(x => x + 1), [])

  // 2. Suscribirnos sólo al evento 'transaction'
  useEffect(() => {
    if (!editor) return
    editor.on('transaction', rerender)
    return () => {
      editor.off('transaction', rerender)
    }
  }, [editor, rerender])

  useEffect(() => {
    if (!editor) return
    const log = () => console.log('transaction', editor.isActive('bold'))
    editor.on('transaction', log)
    return () => editor.off('transaction', log)
  }, [editor])

  if (!editor) return null

  // 3. Helper para botones con estilo condicional
  const Button = ({ isActive, onClick, children }) => (
    <button
      type="button"
      onMouseDown={e => { e.preventDefault(); onClick() }}
      className={`px-3 py-1.5 m-1 rounded transition
        ${isActive
          ? 'bg-blue-500 text-white'
          : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
        }`}
    >
      {children}
    </button>
  )

  // 4. Render del toolbar
  return (
    <div className="flex flex-wrap bg-gray-50 p-2 border-b">
      <Button
        isActive={editor.isActive('bold')}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <strong>B</strong>
      </Button>

      <Button
        isActive={editor.isActive('italic')}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <em>I</em>
      </Button>

      <Button
        isActive={editor.isActive('underline')}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <u>U</u>
      </Button>

      <Button
        isActive={editor.isActive('codeBlock')}
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
      >
        {'{ }'}
      </Button>

      {['left', 'center', 'right'].map(dir => (
        <Button
          key={dir}
          isActive={editor.isActive({ textAlign: dir })}
          onClick={() => editor.chain().focus().setTextAlign(dir).run()}
        >
          {dir === 'left' ? '⯇' : dir === 'center' ? '≡' : '⯈'}
        </Button>
      ))}

      {/* Insertar imagen */}
      <Button onClick={async () => {
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = 'image/*'
        input.click()
        input.onchange = async () => {
          const file = input.files[0]
          if (!file) return
          const fd = new FormData()
          fd.append('file', file)
          const res = await fetch('/mail/api/user/upload', { method: 'POST', body: fd })
          const { url } = await res.json()
          editor.chain().focus().setImage({ src: url }).run()
        }
      }}>
        📷
      </Button>

      {/* Insertar link */}
      <Button
        isActive={editor.isActive('link')}
        onClick={() => {
          const url = prompt('Enter URL')
          if (url) {
            editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
          }
        }}
      >
        🔗
      </Button>
    </div>
  )
}
