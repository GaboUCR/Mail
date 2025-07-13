import React, { useEffect, useState } from 'react';

export default function Toolbar({ editor }) {
  // estado ficticio para forzar re-renders
  const [, forceUpdate] = useState(0);

  /* ───────── Escucha eventos de TipTap ───────── */
  useEffect(() => {
    if (!editor) return;

    const refresh = () => forceUpdate(t => t + 1);

    editor.on('selectionUpdate', refresh); // cursor o rango cambió
    editor.on('transaction',    refresh); // se ejecutó un comando

    return () => {
      editor.off('selectionUpdate', refresh);
      editor.off('transaction',    refresh);
    };
  }, [editor]);

  if (!editor) return null;

  /* helper de botón */
  const Btn = ({ onClick, children, active }) => (
    <button
      type="button"
      onMouseDown={e => {
        e.preventDefault();   // evita blur
        onClick();
        forceUpdate(t => t + 1); // asegura refresco inmediato
      }}
      className={`px-3 py-1.5 m-1 rounded
        transition
        ${active
          ? 'bg-blue-500 text-white'
          : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}`}
    >
      {children}
    </button>
  );

  return (
    <div className="flex flex-wrap border-b bg-gray-50 p-2">
      <Btn
        onClick={() => editor.chain().focus().toggleBold().run()}
        active={editor.isActive('bold')}
      >
        <strong>B</strong>
      </Btn>

      <Btn
        onClick={() => editor.chain().focus().toggleItalic().run()}
        active={editor.isActive('italic')}
      >
        <em>I</em>
      </Btn>

      <Btn
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        active={editor.isActive('underline')}
      >
        <u>U</u>
      </Btn>

      <Btn
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        active={editor.isActive('codeBlock')}
      >
        {'{ }'}
      </Btn>

      {/* alineación */}
      <Btn
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        active={editor.isActive({ textAlign: 'left' })}
      >
        ⯇
      </Btn>
      <Btn
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        active={editor.isActive({ textAlign: 'center' })}
      >
        ≡
      </Btn>
      <Btn
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        active={editor.isActive({ textAlign: 'right' })}
      >
        ⯈
      </Btn>

      {/* imagen (sin estado activo) */}
      <Btn
        onClick={async () => {
          const input = document.createElement('input');
          input.type = 'file';
          input.accept = 'image/*';
          input.click();
          input.onchange = async () => {
            const file = input.files[0];
            if (!file) return;
            const fd = new FormData();
            fd.append('file', file);
            const res = await fetch('/mail/api/user/upload', {
              method: 'POST',
              body: fd,
            });
            const { url } = await res.json();
            editor.chain().focus().setImage({ src: url }).run();
          };
        }}
      >
        📷
      </Btn>

      {/* link */}
      <Btn
        onClick={() => {
          const url = prompt('Enter URL');
          if (url)
            editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
        }}
        active={editor.isActive('link')}
      >
        🔗
      </Btn>
    </div>
  );
}
