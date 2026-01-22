'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useEffect } from 'react'

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
}

export default function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
      }),
    ],
    content,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none min-h-[200px] px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  // Update editor content when prop changes
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content)
    }
  }, [content, editor])

  if (!editor) {
    return null
  }

  return (
    <div className="border border-slate-300 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="bg-slate-50 border-b border-slate-300 p-2 flex flex-wrap gap-1">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-3 py-1 rounded text-sm font-medium transition ${
            editor.isActive('bold')
              ? 'bg-slate-900 text-white'
              : 'bg-white text-slate-700 hover:bg-slate-100'
          }`}
        >
          Bold
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-3 py-1 rounded text-sm font-medium transition ${
            editor.isActive('italic')
              ? 'bg-slate-900 text-white'
              : 'bg-white text-slate-700 hover:bg-slate-100'
          }`}
        >
          Italic
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`px-3 py-1 rounded text-sm font-medium transition ${
            editor.isActive('strike')
              ? 'bg-slate-900 text-white'
              : 'bg-white text-slate-700 hover:bg-slate-100'
          }`}
        >
          Strike
        </button>
        <div className="w-px bg-slate-300 mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`px-3 py-1 rounded text-sm font-medium transition ${
            editor.isActive('heading', { level: 2 })
              ? 'bg-slate-900 text-white'
              : 'bg-white text-slate-700 hover:bg-slate-100'
          }`}
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`px-3 py-1 rounded text-sm font-medium transition ${
            editor.isActive('heading', { level: 3 })
              ? 'bg-slate-900 text-white'
              : 'bg-white text-slate-700 hover:bg-slate-100'
          }`}
        >
          H3
        </button>
        <div className="w-px bg-slate-300 mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-3 py-1 rounded text-sm font-medium transition ${
            editor.isActive('bulletList')
              ? 'bg-slate-900 text-white'
              : 'bg-white text-slate-700 hover:bg-slate-100'
          }`}
        >
          • List
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`px-3 py-1 rounded text-sm font-medium transition ${
            editor.isActive('orderedList')
              ? 'bg-slate-900 text-white'
              : 'bg-white text-slate-700 hover:bg-slate-100'
          }`}
        >
          1. List
        </button>
        <div className="w-px bg-slate-300 mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`px-3 py-1 rounded text-sm font-medium transition ${
            editor.isActive('blockquote')
              ? 'bg-slate-900 text-white'
              : 'bg-white text-slate-700 hover:bg-slate-100'
          }`}
        >
          Quote
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className="px-3 py-1 rounded text-sm font-medium bg-white text-slate-700 hover:bg-slate-100 transition"
        >
          HR
        </button>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />
    </div>
  )
}
