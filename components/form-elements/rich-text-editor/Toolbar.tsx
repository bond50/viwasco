'use client';

import React, { useState } from 'react';
import type { Editor } from '@tiptap/core';
import styles from '@/components/form-elements/rich-text-editor/Tiptap.module.css';

import {
  MdCode,
  MdDeleteOutline,
  MdFormatAlignCenter,
  MdFormatAlignJustify,
  MdFormatAlignLeft,
  MdFormatAlignRight,
  MdSubject,
  MdFormatBold,
  MdFormatClear,
  MdFormatColorReset,
  MdFormatItalic,
  MdFormatStrikethrough,
  MdFormatUnderlined,
  MdHorizontalRule,
  MdImage,
  MdLink,
  MdRedo,
  MdTableChart,
  MdUndo,
} from 'react-icons/md';
import {
  TbBlockquote,
  TbColumnInsertLeft,
  TbColumnInsertRight,
  TbColumnRemove,
  TbH1,
  TbH2,
  TbH3,
  TbHighlight,
  TbList,
  TbListNumbers,
  TbRowInsertBottom,
  TbRowInsertTop,
  TbRowRemove,
  TbSquareNumber2,
  TbSquareNumber3,
  TbSquareNumber4,
  TbSubscript,
  TbSuperscript,
  TbTableMinus,
  TbTableOff,
  TbTablePlus,
} from 'react-icons/tb';

type Props = {
  editor: Editor | null;
  color: string;
  setColorAction: (v: string) => void;
  onPickImageClickAction: () => void;
  isUploading: boolean;
  setImageColsAction: (cols: 2 | 3 | 4) => void;
  removeImageAction: () => void;
};

export function Toolbar({
  editor,
  color,
  setColorAction,
  onPickImageClickAction,
  isUploading,
  setImageColsAction,
  removeImageAction,
}: Props) {
  const [textMenuOpen, setTextMenuOpen] = useState(false);
  const [tableMenuOpen, setTableMenuOpen] = useState(false);

  const run = (fn: () => void) => {
    editor?.chain().focus();
    fn();
  };

  function makeIsActive(editorInstance: Editor | null) {
    function isActive(attrs: Record<string, unknown>): boolean;
    function isActive(name: string, attrs?: Record<string, unknown>): boolean;
    function isActive(
      nameOrAttrs: string | Record<string, unknown>,
      maybeAttrs?: Record<string, unknown>,
    ): boolean {
      if (!editorInstance) return false;
      return typeof nameOrAttrs === 'string'
        ? editorInstance.isActive(nameOrAttrs, maybeAttrs)
        : editorInstance.isActive(nameOrAttrs);
    }
    return isActive;
  }

  const isActive = makeIsActive(editor);
  const getAlign = (v: 'left' | 'center' | 'right' | 'justify') =>
    (editor?.getAttributes('paragraph')?.textAlign ?? 'left') === v;

  const closeTextMenu = () => setTextMenuOpen(false);
  const closeTableMenu = () => setTableMenuOpen(false);

  const toggleTextMenu = () => {
    setTextMenuOpen((open) => !open);
    setTableMenuOpen(false);
  };

  const toggleTableMenu = () => {
    setTableMenuOpen((open) => !open);
    setTextMenuOpen(false);
  };

  return (
    <div className={styles.RteToolbar} role="toolbar" aria-label="Editor toolbar">
      {/* Inline text formatting */}
      <span className={styles.RteGroup} aria-label="Text formatting">
        <button
          type="button"
          className={styles.RteButton}
          aria-pressed={isActive('bold')}
          data-tip="Bold (Ctrl+B)"
          onMouseDown={(e) => {
            e.preventDefault();
            run(() => editor?.chain().toggleBold().run());
          }}
        >
          <MdFormatBold />
        </button>

        <button
          type="button"
          className={styles.RteButton}
          aria-pressed={isActive('italic')}
          data-tip="Italic (Ctrl+I)"
          onMouseDown={(e) => {
            e.preventDefault();
            run(() => editor?.chain().toggleItalic().run());
          }}
        >
          <MdFormatItalic />
        </button>

        <button
          type="button"
          className={styles.RteButton}
          aria-pressed={isActive('underline')}
          data-tip="Underline (Ctrl+U)"
          onMouseDown={(e) => {
            e.preventDefault();
            run(() => editor?.chain().toggleUnderline().run());
          }}
        >
          <MdFormatUnderlined />
        </button>

        <button
          type="button"
          className={styles.RteButton}
          aria-pressed={isActive('strike')}
          data-tip="Strikethrough"
          onMouseDown={(e) => {
            e.preventDefault();
            run(() => editor?.chain().toggleStrike().run());
          }}
        >
          <MdFormatStrikethrough />
        </button>

        <button
          type="button"
          className={styles.RteButton}
          aria-pressed={isActive('code')}
          data-tip="Inline code"
          onMouseDown={(e) => {
            e.preventDefault();
            run(() => editor?.chain().toggleCode().run());
          }}
        >
          <MdCode />
        </button>

        <button
          type="button"
          className={styles.RteButton}
          aria-pressed={isActive('superscript')}
          data-tip="Superscript"
          onMouseDown={(e) => {
            e.preventDefault();
            run(() => editor?.chain().toggleSuperscript().run());
          }}
        >
          <TbSuperscript />
        </button>

        <button
          type="button"
          className={styles.RteButton}
          aria-pressed={isActive('subscript')}
          data-tip="Subscript"
          onMouseDown={(e) => {
            e.preventDefault();
            run(() => editor?.chain().toggleSubscript().run());
          }}
        >
          <TbSubscript />
        </button>

        <input
          type="color"
          className={styles.RteInput}
          value={color}
          aria-label="Text color"
          title="Text color"
          onChange={(e) => {
            const v = e.target.value;
            setColorAction(v);
            run(() => editor?.chain().setColor(v).run());
          }}
          onMouseDown={(e) => e.preventDefault()}
        />

        <button
          type="button"
          className={styles.RteButton}
          data-tip="Clear color"
          onMouseDown={(e) => {
            e.preventDefault();
            run(() => editor?.chain().unsetColor().run());
          }}
        >
          <MdFormatColorReset />
        </button>

        <button
          type="button"
          className={styles.RteButton}
          aria-pressed={isActive('highlight')}
          data-tip="Highlight"
          onMouseDown={(e) => {
            e.preventDefault();
            run(() => editor?.chain().toggleHighlight().run());
          }}
        >
          <TbHighlight />
        </button>
      </span>

      {/* Text structure: headings in a dropdown */}
      <span className={styles.RteGroup} aria-label="Headings and lists">
        <div className={styles.RteDropdownWrapper}>
          <button
            type="button"
            className={styles.RteButton}
            data-tip="Text styles"
            aria-expanded={textMenuOpen}
            onMouseDown={(e) => {
              e.preventDefault();
              toggleTextMenu();
            }}
          >
            <TbH2 />
          </button>

          {textMenuOpen && (
            <div className={styles.RteDropdown} role="menu">
              <button
                type="button"
                className={styles.RteDropdownItem}
                onMouseDown={(e) => {
                  e.preventDefault();
                  closeTextMenu();
                  run(() => editor?.chain().setParagraph().run());
                }}
              >
                <MdSubject />
                <span>Paragraph</span>
              </button>

              <div className={styles.RteDropdownDivider} />

              <button
                type="button"
                className={styles.RteDropdownItem}
                onMouseDown={(e) => {
                  e.preventDefault();
                  closeTextMenu();
                  run(() => editor?.chain().toggleHeading({ level: 1 }).run());
                }}
              >
                <TbH1 />
                <span>Heading 1</span>
              </button>
              <button
                type="button"
                className={styles.RteDropdownItem}
                onMouseDown={(e) => {
                  e.preventDefault();
                  closeTextMenu();
                  run(() => editor?.chain().toggleHeading({ level: 2 }).run());
                }}
              >
                <TbH2 />
                <span>Heading 2</span>
              </button>
              <button
                type="button"
                className={styles.RteDropdownItem}
                onMouseDown={(e) => {
                  e.preventDefault();
                  closeTextMenu();
                  run(() => editor?.chain().toggleHeading({ level: 3 }).run());
                }}
              >
                <TbH3 />
                <span>Heading 3</span>
              </button>

              <div className={styles.RteDropdownDivider} />

              <button
                type="button"
                className={styles.RteDropdownItem}
                onMouseDown={(e) => {
                  e.preventDefault();
                  closeTextMenu();
                  run(() => editor?.chain().toggleCodeBlock().run());
                }}
              >
                <MdCode />
                <span>Code block</span>
              </button>
            </div>
          )}
        </div>
      </span>

      <span className={styles.RteGroup} aria-label="Lists">
        <button
          type="button"
          className={styles.RteButton}
          aria-pressed={isActive('bulletList')}
          data-tip="Bullet list"
          onMouseDown={(e) => {
            e.preventDefault();
            run(() => editor?.chain().toggleBulletList().run());
          }}
        >
          <TbList />
        </button>
        <button
          type="button"
          className={styles.RteButton}
          aria-pressed={isActive('orderedList')}
          data-tip="Numbered list"
          onMouseDown={(e) => {
            e.preventDefault();
            run(() => editor?.chain().toggleOrderedList().run());
          }}
        >
          <TbListNumbers />
        </button>
      </span>

      {/* Blocks & Links */}
      <span className={styles.RteGroup} aria-label="Blocks and links">
        <button
          type="button"
          className={styles.RteButton}
          aria-pressed={isActive('blockquote')}
          data-tip="Blockquote"
          onMouseDown={(e) => {
            e.preventDefault();
            run(() => editor?.chain().toggleBlockquote().run());
          }}
        >
          <TbBlockquote />
        </button>

        <button
          type="button"
          className={styles.RteButton}
          data-tip="Horizontal rule"
          onMouseDown={(e) => {
            e.preventDefault();
            run(() => editor?.chain().setHorizontalRule().run());
          }}
        >
          <MdHorizontalRule />
        </button>

        <button
          type="button"
          className={styles.RteButton}
          aria-pressed={isActive('link')}
          data-tip={isActive('link') ? 'Remove link' : 'Insert link'}
          onMouseDown={(e) => {
            e.preventDefault();
            if (!editor) return;
            if (editor.isActive('link')) {
              run(() => editor.chain().unsetLink().run());
            } else {
              const url = window.prompt('Enter URL:', 'https://');
              if (url) {
                run(() => editor.chain().extendMarkRange('link').setLink({ href: url }).run());
              }
            }
          }}
        >
          <MdLink />
        </button>
      </span>

      {/* Media (images + grids) */}
      <span className={styles.RteGroup} aria-label="Media and images">
        <button
          type="button"
          className={styles.RteButton}
          data-tip={isUploading ? 'Uploading…' : 'Insert image from device'}
          onMouseDown={(e) => {
            e.preventDefault();
            if (!isUploading) onPickImageClickAction();
          }}
          disabled={isUploading}
        >
          {isUploading ? '⏳' : <MdImage />}
        </button>

        <button
          type="button"
          className={styles.RteButton}
          data-tip="Image grid: 2 per row"
          onMouseDown={(e) => {
            e.preventDefault();
            setImageColsAction(2);
          }}
        >
          <TbSquareNumber2 />
        </button>
        <button
          type="button"
          className={styles.RteButton}
          data-tip="Image grid: 3 per row"
          onMouseDown={(e) => {
            e.preventDefault();
            setImageColsAction(3);
          }}
        >
          <TbSquareNumber3 />
        </button>
        <button
          type="button"
          className={styles.RteButton}
          data-tip="Image grid: 4 per row"
          onMouseDown={(e) => {
            e.preventDefault();
            setImageColsAction(4);
          }}
        >
          <TbSquareNumber4 />
        </button>

        <button
          type="button"
          className={styles.RteButton}
          data-tip="Remove image (and delete from Cloudinary)"
          onMouseDown={(e) => {
            e.preventDefault();
            removeImageAction();
          }}
        >
          <MdDeleteOutline />
        </button>
      </span>

      {/* Table controls — dropdown */}
      <span className={styles.RteGroup} aria-label="Table tools">
        <div className={styles.RteDropdownWrapper}>
          <button
            type="button"
            className={styles.RteButton}
            data-tip="Table tools"
            aria-expanded={tableMenuOpen}
            onMouseDown={(e) => {
              e.preventDefault();
              toggleTableMenu();
            }}
          >
            <MdTableChart />
          </button>

          {tableMenuOpen && (
            <div className={styles.RteDropdown} role="menu">
              <button
                type="button"
                className={styles.RteDropdownItem}
                onMouseDown={(e) => {
                  e.preventDefault();
                  closeTableMenu();
                  run(() =>
                    editor?.chain().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(),
                  );
                }}
              >
                <MdTableChart />
                <span>Insert 3×3 (header)</span>
              </button>

              <button
                type="button"
                className={styles.RteDropdownItem}
                onMouseDown={(e) => {
                  e.preventDefault();
                  closeTableMenu();
                  run(() =>
                    editor?.chain().insertTable({ rows: 2, cols: 2, withHeaderRow: false }).run(),
                  );
                }}
              >
                <TbTablePlus />
                <span>Insert 2×2</span>
              </button>

              <div className={styles.RteDropdownDivider} />

              <button
                type="button"
                className={styles.RteDropdownItem}
                onMouseDown={(e) => {
                  e.preventDefault();
                  closeTableMenu();
                  run(() => editor?.chain().addRowBefore().run());
                }}
              >
                <TbRowInsertTop />
                <span>Add row above</span>
              </button>
              <button
                type="button"
                className={styles.RteDropdownItem}
                onMouseDown={(e) => {
                  e.preventDefault();
                  closeTableMenu();
                  run(() => editor?.chain().addRowAfter().run());
                }}
              >
                <TbRowInsertBottom />
                <span>Add row below</span>
              </button>
              <button
                type="button"
                className={styles.RteDropdownItem}
                onMouseDown={(e) => {
                  e.preventDefault();
                  closeTableMenu();
                  run(() => editor?.chain().deleteRow().run());
                }}
              >
                <TbRowRemove />
                <span>Delete row</span>
              </button>

              <div className={styles.RteDropdownDivider} />

              <button
                type="button"
                className={styles.RteDropdownItem}
                onMouseDown={(e) => {
                  e.preventDefault();
                  closeTableMenu();
                  run(() => editor?.chain().addColumnBefore().run());
                }}
              >
                <TbColumnInsertLeft />
                <span>Add column left</span>
              </button>
              <button
                type="button"
                className={styles.RteDropdownItem}
                onMouseDown={(e) => {
                  e.preventDefault();
                  closeTableMenu();
                  run(() => editor?.chain().addColumnAfter().run());
                }}
              >
                <TbColumnInsertRight />
                <span>Add column right</span>
              </button>
              <button
                type="button"
                className={styles.RteDropdownItem}
                onMouseDown={(e) => {
                  e.preventDefault();
                  closeTableMenu();
                  run(() => editor?.chain().deleteColumn().run());
                }}
              >
                <TbColumnRemove />
                <span>Delete column</span>
              </button>

              <div className={styles.RteDropdownDivider} />

              <button
                type="button"
                className={styles.RteDropdownItem}
                onMouseDown={(e) => {
                  e.preventDefault();
                  closeTableMenu();
                  run(() => editor?.chain().deleteTable().run());
                }}
              >
                <TbTableOff />
                <span>Delete table</span>
              </button>
              <button
                type="button"
                className={styles.RteDropdownItem}
                onMouseDown={(e) => {
                  e.preventDefault();
                  closeTableMenu();
                  run(() => editor?.chain().deleteTable().run());
                }}
              >
                <TbTableMinus />
                <span>Clear table</span>
              </button>
            </div>
          )}
        </div>
      </span>

      {/* Alignment & Clear */}
      <span className={styles.RteGroup} aria-label="Alignment and clear">
        <button
          type="button"
          className={styles.RteButton}
          aria-pressed={getAlign('left')}
          data-tip="Align left"
          onMouseDown={(e) => {
            e.preventDefault();
            run(() => editor?.chain().setTextAlign('left').run());
          }}
        >
          <MdFormatAlignLeft />
        </button>
        <button
          type="button"
          className={styles.RteButton}
          aria-pressed={getAlign('center')}
          data-tip="Align center"
          onMouseDown={(e) => {
            e.preventDefault();
            run(() => editor?.chain().setTextAlign('center').run());
          }}
        >
          <MdFormatAlignCenter />
        </button>
        <button
          type="button"
          className={styles.RteButton}
          aria-pressed={getAlign('right')}
          data-tip="Align right"
          onMouseDown={(e) => {
            e.preventDefault();
            run(() => editor?.chain().setTextAlign('right').run());
          }}
        >
          <MdFormatAlignRight />
        </button>
        <button
          type="button"
          className={styles.RteButton}
          aria-pressed={getAlign('justify')}
          data-tip="Justify"
          onMouseDown={(e) => {
            e.preventDefault();
            run(() => editor?.chain().setTextAlign('justify').run());
          }}
        >
          <MdFormatAlignJustify />
        </button>

        <button
          type="button"
          className={styles.RteButton}
          data-tip="Clear formatting"
          onMouseDown={(e) => {
            e.preventDefault();
            run(() => editor?.chain().unsetAllMarks().clearNodes().run());
          }}
        >
          <MdFormatClear />
        </button>
      </span>

      {/* History */}
      <span className={styles.RteGroup} aria-label="Undo and redo">
        <button
          type="button"
          className={styles.RteButton}
          data-tip="Undo (Ctrl+Z)"
          onMouseDown={(e) => {
            e.preventDefault();
            editor?.commands.undo();
          }}
        >
          <MdUndo />
        </button>
        <button
          type="button"
          className={styles.RteButton}
          data-tip="Redo (Ctrl+Y)"
          onMouseDown={(e) => {
            e.preventDefault();
            editor?.commands.redo();
          }}
        >
          <MdRedo />
        </button>
      </span>
    </div>
  );
}
