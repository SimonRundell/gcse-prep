/**
 * @file RichTextEditor.jsx
 * @description TipTap rich-text answer box for students. Toolbar: bold, italic,
 *              underline, H1, H2, normal paragraph, code, subscript, superscript,
 *              horizontal rule, undo, redo. Reports HTML to the parent and returns
 *              an empty string while the editor has no content, so existing
 *              "answer.trim()" checks keep working.
 */
import { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import { Placeholder } from '@tiptap/extensions';

/**
 * @param {{ value?: string, onChange?: Function, placeholder?: string, minHeight?: number }} props
 *        value       - HTML content (controlled); pass '' to clear the editor
 *        onChange    - called with the editor HTML, or '' when empty
 *        placeholder - ghost text shown while empty
 *        minHeight   - minimum height of the writing area in px
 */
export default function RichTextEditor({ value = '', onChange, placeholder = '', minHeight = 100 }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2] } }),
      Subscript,
      Superscript,
      Placeholder.configure({ placeholder }),
    ],
    content: value,
    shouldRerenderOnTransaction: true,
    onUpdate: ({ editor: ed }) => onChange?.(ed.isEmpty ? '' : ed.getHTML()),
  });

  // Clear the editor when the parent resets the answer (e.g. a new question loads)
  useEffect(() => {
    if (editor && value === '' && !editor.isEmpty) editor.commands.clearContent();
  }, [value, editor]);

  if (!editor) return null;

  /** Toolbar button definitions: [icon or text, title, isActive args, command] */
  const buttons = [
    { icon: 'fa-bold',        title: 'Bold',            active: ['bold'],                   run: c => c.toggleBold() },
    { icon: 'fa-italic',      title: 'Italic',          active: ['italic'],                 run: c => c.toggleItalic() },
    { icon: 'fa-underline',   title: 'Underline',       active: ['underline'],              run: c => c.toggleUnderline() },
    { text: 'H1',             title: 'Heading 1',       active: ['heading', { level: 1 }],  run: c => c.toggleHeading({ level: 1 }) },
    { text: 'H2',             title: 'Heading 2',       active: ['heading', { level: 2 }],  run: c => c.toggleHeading({ level: 2 }) },
    { icon: 'fa-paragraph',   title: 'Normal text',     active: ['paragraph'],              run: c => c.setParagraph() },
    { icon: 'fa-code',        title: 'Code',            active: ['code'],                   run: c => c.toggleCode() },
    { icon: 'fa-subscript',   title: 'Subscript',       active: ['subscript'],              run: c => c.toggleSubscript() },
    { icon: 'fa-superscript', title: 'Superscript',     active: ['superscript'],            run: c => c.toggleSuperscript() },
    { icon: 'fa-minus',       title: 'Horizontal rule',                                     run: c => c.setHorizontalRule() },
    { icon: 'fa-rotate-left', title: 'Undo',                                                run: c => c.undo() },
    { icon: 'fa-rotate-right', title: 'Redo',                                               run: c => c.redo() },
  ];

  return (
    <div className="rte-wrap" style={{ '--rte-min-height': minHeight + 'px' }}>
      <div className="rte-toolbar">
        {buttons.map(b => (
          <button
            key={b.title}
            type="button"
            title={b.title}
            className={b.active && editor.isActive(...b.active) ? 'active' : ''}
            onClick={() => b.run(editor.chain().focus()).run()}
          >
            {b.icon ? <i className={`fa-solid fa-fw ${b.icon}`} /> : b.text}
          </button>
        ))}
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
