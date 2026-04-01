'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Highlight from '@tiptap/extension-highlight';
import Placeholder from '@tiptap/extension-placeholder';
import BaseImage from '@tiptap/extension-image';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import Superscript from '@tiptap/extension-superscript';
import Subscript from '@tiptap/extension-subscript';
import Color from '@tiptap/extension-color';
import TableRow from '@tiptap/extension-table-row';
import TableHeader from '@tiptap/extension-table-header';
import TableCell from '@tiptap/extension-table-cell';
import { TextStyle } from '@tiptap/extension-text-style';
import { Table } from '@tiptap/extension-table';
import Dropcursor from '@tiptap/extension-dropcursor';
import Gapcursor from '@tiptap/extension-gapcursor';

import type { CommandProps, Editor as TiptapEditor } from '@tiptap/core';
import type { Node as PMNode } from 'prosemirror-model';

import { cn } from '@/lib/utils';
import inputStyles from '@/components/form-elements/input/input.module.css';
import styles from '@/components/form-elements/rich-text-editor/Tiptap.module.css';

import { uploadImageAction } from '@/actions/image-upload';
import { Toolbar } from '@/components/form-elements/rich-text-editor/Toolbar';

/* ───────── helpers ───────── */
function uuid(): string {
  const g = globalThis as typeof globalThis & {
    crypto?: {
      randomUUID?: () => string;
      getRandomValues?: (a: Uint8Array) => void;
    };
  };
  if (g?.crypto?.randomUUID) return g.crypto.randomUUID();
  if (g?.crypto?.getRandomValues) {
    const buf = new Uint8Array(16);
    g.crypto.getRandomValues(buf);
    buf[6] = (buf[6] & 0x0f) | 0x40;
    buf[8] = (buf[8] & 0x3f) | 0x80;
    const hex = Array.from(buf, (n) => n.toString(16).padStart(2, '0')).join('');
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
  }
  return `rte-fallback-${Date.now().toString(36)}`;
}

interface RichTextEditorProps {
  name: string;
  label?: string;
  error?: string;
  defaultValue?: string;
  className?: string;
  placeholder?: string;
  onChange?: (html: string) => void;
}

/* ───────── Image node: inline + draggable + custom attrs ───────── */
const Image = BaseImage.extend({
  name: 'image',
  draggable: true,
  addOptions() {
    const parent = (this as unknown as { parent?: () => Record<string, unknown> }).parent?.() || {};
    return {
      ...parent,
      inline: true,
      allowBase64: true,
      HTMLAttributes: { draggable: 'true' },
      resize: false,
    };
  },
  addAttributes() {
    const base = (this as unknown as { parent?: () => Record<string, unknown> }).parent?.() || {};

    return {
      ...base, // keeps src/alt/title intact
      uid: {
        default: null as string | null,
        parseHTML: (el: HTMLElement) => el.getAttribute('data-uid'),
        renderHTML: (attrs: Record<string, unknown>) =>
          attrs.uid ? { 'data-uid': String(attrs.uid) } : {},
      },
      cols: {
        default: null as number | null,
        parseHTML: (el: HTMLElement) => {
          const raw = el.getAttribute('data-cols');
          const n = raw ? Number(raw) : null;
          return n && n >= 2 && n <= 4 ? n : null;
        },
        renderHTML: (attrs: Record<string, unknown>) =>
          typeof attrs.cols === 'number' ? { 'data-cols': String(attrs.cols) } : {},
      },
      uploading: {
        default: null as boolean | null,
        parseHTML: (el: HTMLElement) =>
          el.getAttribute('data-uploading') === 'true' ? true : null,
        renderHTML: (attrs: Record<string, unknown>) =>
          attrs.uploading ? { 'data-uploading': 'true' } : {},
      },
      width: {
        default: null as number | string | null,
        parseHTML: (el: HTMLElement) => el.getAttribute('width'),
        renderHTML: (attrs: Record<string, unknown>) =>
          attrs.width ? { width: String(attrs.width) } : {},
      },
      height: {
        default: null as number | string | null,
        parseHTML: (el: HTMLElement) => el.getAttribute('height'),
        renderHTML: (attrs: Record<string, unknown>) =>
          attrs.height ? { height: String(attrs.height) } : {},
      },
    };
  },
});

type CloudinaryVariant = { secure_url?: string };
type CloudinaryMain = { secure_url?: string; width?: number; height?: number };
type UploadResponse = {
  main?: CloudinaryMain;
  variants?: Record<string, CloudinaryVariant>;
};

/* ---------- auto-cols helpers ---------- */

/** Apply auto cols (2/3/4) to images in the current paragraph;
 * clear cols if only one image. */
function applyAutoColsInCurrentParagraph(ed: TiptapEditor | null): void {
  if (!ed) return;
  ed.commands.command(({ state, tr, dispatch }: CommandProps) => {
    const $from = state.selection.$from;
    const parent = $from.parent;
    if (parent.type.name !== 'paragraph') return false;

    const paraFrom = $from.before($from.depth);
    const paraTo = paraFrom + parent.nodeSize - 1;

    let imgCount = 0;
    state.doc.nodesBetween(paraFrom, paraTo, (node: PMNode) => {
      if (node.type.name === 'image') imgCount++;
      return true;
    });

    const targetCols: 2 | 3 | 4 | null =
      imgCount >= 4 ? 4 : imgCount === 3 ? 3 : imgCount === 2 ? 2 : null;

    let changed = false;
    state.doc.nodesBetween(paraFrom, paraTo, (node: PMNode, pos: number) => {
      if (node.type.name !== 'image') return true;
      const attrs = node.attrs as Record<string, unknown>;
      const current = (attrs.cols ?? null) as number | null;

      if (targetCols === null) {
        if (current !== null) {
          tr.setNodeMarkup(pos, undefined, { ...attrs, cols: null });
          changed = true;
        }
      } else if (current !== targetCols) {
        tr.setNodeMarkup(pos, undefined, { ...attrs, cols: targetCols });
        changed = true;
      }
      return true;
    });

    if (changed && dispatch) dispatch(tr);
    return changed;
  });
}

/** Normalize the whole document once: paragraphs that contain >=2 images
 * but have no cols get 2/3/4 assigned. */
function normalizeExistingImageCols(ed: TiptapEditor | null): void {
  if (!ed) return;
  ed.commands.command(({ state, tr, dispatch }: CommandProps) => {
    let changed = false;

    state.doc.descendants((node: PMNode, pos: number) => {
      if (node.type.name !== 'paragraph') return true;

      const from = pos + 1;
      const to = pos + node.nodeSize - 1;

      let count = 0;
      let anyCols = false;
      state.doc.nodesBetween(from, to, (n: PMNode) => {
        if (n.type.name === 'image') {
          count++;
          if ((n.attrs as Record<string, unknown>).cols) anyCols = true;
        }
        return true;
      });

      if (count >= 2 && !anyCols) {
        const target: 2 | 3 | 4 = count >= 4 ? 4 : (count as 2 | 3);
        state.doc.nodesBetween(from, to, (n: PMNode, p: number) => {
          if (n.type.name === 'image') {
            tr.setNodeMarkup(p, undefined, {
              ...(n.attrs as object),
              cols: target,
            });
            changed = true;
          }
          return true;
        });
      }
      return true;
    });

    if (changed && dispatch) dispatch(tr);
    return changed;
  });
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  name,
  label,
  error,
  defaultValue = '',
  className = '',
  onChange,
  placeholder = 'Write your content…',
}) => {
  const feedbackId = `${name}-feedback`;
  const editorId = `${name}-editor`;

  const [html, setHtml] = useState<string>(defaultValue || '');
  const [color, setColor] = useState<string>('#000000');
  const [isUploading, setIsUploading] = useState(false);

  const fileRef = useRef<HTMLInputElement | null>(null);

  const extensions = useMemo(
    () => [
      StarterKit.configure({
        link: false,
        underline: false,
        horizontalRule: false,
        dropcursor: false,
        gapcursor: false,
      }),
      Underline,
      Superscript,
      Subscript,
      TextStyle,
      Color,
      Link.configure({
        HTMLAttributes: {
          rel: 'noopener noreferrer nofollow',
          target: '_blank',
        },
        openOnClick: false,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right', 'justify'],
      }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight.configure({ multicolor: false }),
      Image,
      HorizontalRule,
      Table.configure({ resizable: false, lastColumnResizable: false }),
      TableRow,
      TableHeader,
      TableCell,
      Placeholder.configure({
        placeholder,
        emptyEditorClass: 'is-editor-empty',
        showOnlyWhenEditable: true,
        includeChildren: true,
      }),
      Dropcursor,
      Gapcursor,
    ],
    [placeholder],
  );

  const editor = useEditor({
    immediatelyRender: false,
    extensions,
    content: defaultValue || '',
    onCreate({ editor }) {
      ensureImageUids(editor);
      normalizeExistingImageCols(editor);
      const v = editor.getHTML() ?? '';
      setHtml(v);
      onChange?.(v);
    },
    onUpdate({ editor }) {
      const v = editor.getHTML() ?? '';
      setHtml(v);
      onChange?.(v);
    },
  });

  function ensureImageUids(ed: TiptapEditor | null) {
    if (!ed) return;
    ed.commands.command(({ state, tr, dispatch }: CommandProps) => {
      let changed = false;
      state.doc.descendants((node: PMNode, pos: number) => {
        if (node.type.name === 'image' && !(node.attrs as Record<string, unknown>)?.uid) {
          tr.setNodeMarkup(pos, undefined, {
            ...(node.attrs as object),
            uid: uuid(),
          });
          changed = true;
        }
        return true;
      });
      if (changed && dispatch) dispatch(tr);
      return changed;
    });
  }

  useEffect(() => {
    if (!editor) return;
    const incoming = defaultValue || '';
    const current = editor.getHTML() ?? '';
    if (incoming !== current) {
      editor.commands.setContent(incoming);
      ensureImageUids(editor);
      normalizeExistingImageCols(editor);
      setHtml(incoming);
    }
  }, [editor, defaultValue]);

  const run = (fn: () => void) => {
    if (!editor) return;
    editor.chain().focus();
    fn();
  };

  /* set cols for image nearest the cursor, and harmonize all images in same paragraph */
  const setImageCols = (cols: 2 | 3 | 4) => {
    if (!editor) return;
    editor.commands.command(({ state, tr, dispatch }: CommandProps) => {
      const sel = state.selection;
      const $from = sel.$from;
      const paraPos = $from.before($from.depth);
      const parent = $from.parent;

      let changed = false;

      // pass 1: update image at/near selection
      const start = Math.max(0, sel.from - 8);
      const end = Math.min(state.doc.content.size, sel.to + 8);
      state.doc.nodesBetween(start, end, (node: PMNode, pos: number) => {
        if (node.type.name === 'image') {
          tr.setNodeMarkup(pos, undefined, { ...(node.attrs as object), cols });
          changed = true;
          return false;
        }
        return true;
      });

      // pass 2: harmonize within same paragraph
      if (parent.type.name === 'paragraph') {
        const from = paraPos;
        const to = paraPos + parent.nodeSize - 1;
        state.doc.nodesBetween(from, to, (node: PMNode, pos: number) => {
          if (node.type.name === 'image') {
            tr.setNodeMarkup(pos, undefined, {
              ...(node.attrs as object),
              cols,
            });
            changed = true;
          }
          return true;
        });
      }

      if (changed && dispatch) dispatch(tr);
      return changed;
    });
  };

  /* upload + insert + auto-cols */
  const insertImageFromFile = async (file: File) => {
    const tempUid = uuid();
    const localUrl = URL.createObjectURL(file);

    const attrsWithExtras = {
      uid: tempUid,
      src: localUrl,
      alt: file.name,
      uploading: true,
    };

    run(() =>
      editor
        ?.chain()
        .setImage(
          attrsWithExtras as unknown as {
            src: string;
            alt?: string;
            title?: string;
          },
        )
        .run(),
    );

    // ensure newly inserted image groups into 2/3/4 automatically
    applyAutoColsInCurrentParagraph(editor);
    setIsUploading(true);

    try {
      const fd = new FormData();
      fd.append('file', file, file.name);
      fd.append('folder', 'jitmat');
      const uploaded = (await uploadImageAction(fd)) as unknown as UploadResponse;

      const cdnUrl =
        (uploaded?.variants as Record<string, CloudinaryVariant> | undefined)?.content
          ?.secure_url ||
        uploaded?.main?.secure_url ||
        uploaded?.variants?.wide?.secure_url;

      const width: number | undefined = uploaded?.main?.width;
      const height: number | undefined = uploaded?.main?.height;

      if (!cdnUrl) throw new Error('No URL from uploadImageAction');

      editor?.commands.command(({ state, tr, dispatch }: CommandProps) => {
        let found = false;
        state.doc.descendants((node: PMNode, pos: number) => {
          if (
            node.type.name === 'image' &&
            (node.attrs as Record<string, unknown>)?.uid === tempUid
          ) {
            tr.setNodeMarkup(pos, undefined, {
              ...(node.attrs as object),
              src: cdnUrl,
              uploading: null,
              ...(width ? { width } : {}),
              ...(height ? { height } : {}),
            });
            found = true;
            return false;
          }
          return true;
        });
        if (found && dispatch) dispatch(tr);
        return found;
      });

      // keep grid consistent after swap (in case selection moved)
      applyAutoColsInCurrentParagraph(editor);
    } catch {
      // remove temp
      editor?.commands.command(({ state, tr, dispatch }: CommandProps) => {
        state.doc.descendants((node: PMNode, pos: number) => {
          if (
            node.type.name === 'image' &&
            (node.attrs as Record<string, unknown>)?.uid === tempUid
          ) {
            tr.delete(pos, pos + node.nodeSize);
            return false;
          }
          return true;
        });
        if (dispatch) dispatch(tr);
        return true;
      });
      alert('Image upload failed. Check Cloudinary config & action.');
    } finally {
      setIsUploading(false);
      URL.revokeObjectURL(localUrl);
    }
  };

  const onPickImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    e.currentTarget.value = '';
    if (!f) return;
    await insertImageFromFile(f);

    // keep next image in same paragraph if user keeps clicking
    run(() => editor?.chain().insertContent(' ').run());
  };

  return (
    <div className={cn('mb-3', styles.Rte)}>
      {label && (
        <label htmlFor={editorId} className={inputStyles.Label}>
          {label}
        </label>
      )}

      {/* sticky toolbar */}
      <Toolbar
        editor={editor}
        color={color}
        setColorAction={(v) => {
          setColor(v);
          editor?.chain().focus().setColor(v).run();
        }}
        onPickImageClickAction={() => fileRef.current?.click()}
        isUploading={isUploading}
        setImageColsAction={(c) => setImageCols(c)}
        removeImageAction={() => {}}
      />

      {/* Content area */}
      <div
        className={cn(
          inputStyles.InputWrapper,
          styles.RteContent,
          error && 'is-invalid',
          className,
        )}
        aria-invalid={!!error}
        aria-describedby={error ? feedbackId : undefined}
      >
        <EditorContent
          id={editorId}
          editor={editor}
          className="tiptap"
          data-placeholder={placeholder}
          role="textbox"
          aria-multiline="true"
        />
      </div>

      {/* Hidden input submitted to the server */}
      <input type="hidden" name={name} value={html} />

      {/* Hidden file input for images */}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={onPickImage}
      />

      {error && (
        <div id={feedbackId} className="invalid-feedback">
          {error}
        </div>
      )}
    </div>
  );
};
