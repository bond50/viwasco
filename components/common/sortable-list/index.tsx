// // components/common/sortable-list.tsx
// 'use client'
//
// import {closestCenter, DndContext, DragEndEvent, PointerSensor, useSensor, useSensors,} from '@dnd-kit/core'
// import {arrayMove, SortableContext, useSortable, verticalListSortingStrategy,} from '@dnd-kit/sortable'
// import {CSS} from '@dnd-kit/utilities'
// import {FiInfo, FiMove} from 'react-icons/fi'
// import {cn} from '@/lib/utils'
// import styles from './sortable-list.module.css'
//
// export interface SortableItem {
//
//
//     id: string;
//     rank: number;
//     name?: string;
//     title?: string;
//     description?: string | null;
// }
//
// interface SortableListProps<T extends SortableItem> {
//     items: T[]
//     onReorder: (items: T[]) => void
//     className?: string
//     getSecondaryText?: (item: T) => string | null | undefined
//     instructionText?: string
// }
//
// export function SortableList<T extends SortableItem>({
//                                                          items,
//                                                          onReorder,
//                                                          className,
//                                                          getSecondaryText,
//                                                          instructionText = "Drag to change order",
//                                                      }: SortableListProps<T>) {
//     const sensors = useSensors(
//         useSensor(PointerSensor, {
//             activationConstraint: {distance: 8},
//         })
//     )
//
//     const handleDragEnd = (event: DragEndEvent) => {
//         const {active, over} = event
//         if (!over || active.id === over.id) return
//
//         const oldIndex = items.findIndex(i => i.id === active.id)
//         const newIndex = items.findIndex(i => i.id === over.id)
//
//         const reordered = arrayMove(items, oldIndex, newIndex).map((item, idx) => ({
//             ...item,
//             rank: idx + 1,
//         }))
//         onReorder(reordered)
//     }
//
//     return (
//         <div className={styles.container}>
//             <div className={styles.instructions}>
//                 <FiInfo className={styles.instructionsIcon} size={16}/>
//                 <span className={styles.instructionsText}>
//           {instructionText} <FiMove className={styles.gripIcon} size={14}/>
//         </span>
//             </div>
//
//             <DndContext
//                 sensors={sensors}
//                 collisionDetection={closestCenter}
//                 onDragEnd={handleDragEnd}
//             >
//                 <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
//                     <ul className={cn(styles.items, className)}>
//                         {items.map(item => (
//                             <SortableItemRow
//                                 key={item.id}
//                                 item={item}
//                                 secondaryText={getSecondaryText?.(item) ?? item.description}
//                             />
//                         ))}
//                     </ul>
//                 </SortableContext>
//             </DndContext>
//         </div>
//     )
// }
//
// function SortableItemRow({
//                              item,
//                              secondaryText,
//                          }: {
//     item: SortableItem
//     secondaryText?: string | null
// }) {
//     const {
//         attributes,
//         listeners,
//         setNodeRef,
//         transform,
//         transition,
//         isDragging,
//     } = useSortable({id: item.id})
//
//     const style = {
//         transform: CSS.Transform.toString(transform),
//         transition,
//         cursor: 'grab',
//     }
//     const displayName = item.name ?? item.title ?? ''
//
//     return (
//         <li
//             ref={setNodeRef}
//             style={style}
//             className={cn(styles.item, {
//                 [styles.itemDragging]: isDragging,
//             })}
//             {...attributes}
//             {...listeners}
//         >
//             <div className={styles.itemContent}>
//                 <FiMove className={styles.dragHandleIcon} size={18}/>
//                 <div className={styles.itemText}>
//                     <div className={styles.itemName}>{displayName}</div>
//                     {secondaryText && (
//                         <div className={styles.itemDescription}>{secondaryText}</div>
//                     )}
//                 </div>
//             </div>
//             <span className={styles.rankBadge}>#{item.rank}</span>
//         </li>
//     )
// }

'use client';

import {
  closestCenter,
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FiInfo, FiMove } from 'react-icons/fi';
import { cn } from '@/lib/utils';
import styles from './sortable-list.module.css';

export interface SortableItem {
  id: string;
  rank: number;
  name?: string;
  title?: string;
  description?: string | null;
}

interface SortableListProps<T extends SortableItem> {
  items: T[];
  onReorder: (items: T[]) => void;
  className?: string;
  getSecondaryText?: (item: T) => string | null | undefined;
  instructionText?: string;
}

export function SortableList<T extends SortableItem>({
  items,
  onReorder,
  className,
  getSecondaryText,
  instructionText = 'Drag to change order',
}: SortableListProps<T>) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((i) => i.id === active.id);
    const newIndex = items.findIndex((i) => i.id === over.id);

    const reordered = arrayMove(items, oldIndex, newIndex).map((item, idx) => ({
      ...item,
      rank: idx + 1,
    }));
    onReorder(reordered);
  };

  return (
    <div className={styles.container}>
      <div className={styles.instructions}>
        <FiInfo className={styles.instructionsIcon} size={16} />
        <span className={styles.instructionsText}>
          {instructionText} <FiMove className={styles.gripIcon} size={14} />
        </span>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
          <ul className={cn(styles.items, className)}>
            {items.map((item) => {
              const displayName = item.name ?? item.title ?? '';
              const secondary =
                getSecondaryText?.(item) ??
                item.description ??
                (item.name ? item.title : undefined);

              return (
                <SortableItemRow
                  key={item.id}
                  item={{ ...item, name: displayName }}
                  secondaryText={secondary}
                />
              );
            })}
          </ul>
        </SortableContext>
      </DndContext>
    </div>
  );
}

function SortableItemRow({
  item,
  secondaryText,
}: {
  item: SortableItem;
  secondaryText?: string | null;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: 'grab',
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={cn(styles.item, {
        [styles.itemDragging]: isDragging,
      })}
      {...attributes}
      {...listeners}
    >
      <div className={styles.itemContent}>
        <FiMove className={styles.dragHandleIcon} size={18} />
        <div className={styles.itemText}>
          <div className={styles.itemName}>{item.name}</div>
          {secondaryText && <div className={styles.itemDescription}>{secondaryText}</div>}
        </div>
      </div>
      <span className={styles.rankBadge}>#{item.rank}</span>
    </li>
  );
}
