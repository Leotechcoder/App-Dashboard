"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Loader2, Camera, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

// ----------------------------------------------------
// Helpers
// ----------------------------------------------------
const generateId = () =>
  `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const simulateUpload = (files) =>
  new Promise((resolve) => {
    setTimeout(() => {
      const uploadedImages = [...files].map((file) => ({
        uuid: generateId(),
        url: URL.createObjectURL(file),
        file,
      }));
      resolve(uploadedImages);
    }, 400);
  });

// ----------------------------------------------------
// Upload Button
// ----------------------------------------------------
const Upload = ({ onUpload, disabled = false, isSingleMode = false }) => {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef(null);
  const id = useRef(generateId()).current;

  const handleChange = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0 || disabled) return;

    setUploading(true);

    try {
      const uploaded = await simulateUpload(files);
      await onUpload(uploaded);
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setUploading(false);

      // Reset input
      if (inputRef.current) {
        inputRef.current.type = "text";
        inputRef.current.type = "file";
      }
    }
  };

  return (
    <div
      className={cn(
        "relative flex items-center justify-center border-2 border-dashed border-border bg-background w-full h-full hover:bg-accent/50 transition-colors cursor-pointer"
      )}
    >
      <label htmlFor={id} className="w-full h-full flex items-center justify-center cursor-pointer">
        {uploading ? (
          <Loader2 className="animate-spin text-primary w-8 h-8" />
        ) : (
          <Camera className="text-primary w-8 h-8" />
        )}
      </label>

      <input
        ref={inputRef}
        id={id}
        type="file"
        multiple={!isSingleMode}
        accept="image/*"
        className="hidden"
        disabled={disabled || uploading}
        onChange={handleChange}
      />
    </div>
  );
};

// ----------------------------------------------------
// Image View
// ----------------------------------------------------
const ImageDisplay = ({ image, allowDelete, onDelete, isFirst }) => {
  const [deleting, setDeleting] = useState(false);
  const mounted = useRef(true);

  useEffect(() => () => (mounted.current = false), []);

  const handleDelete = async () => {
    setDeleting(true);
    await onDelete(image);
    if (mounted.current) setDeleting(false);
  };

  return (
    <div className="relative border border-border bg-card overflow-hidden group w-full h-full">
      <img
        src={image.url}
        alt="image"
        className="w-full h-full object-contain p-1"
      />

      {allowDelete && (
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="absolute top-2 left-2 p-1.5 bg-destructive text-destructive-foreground rounded-full hover:cursor-pointer transition"
        >
          {deleting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Trash2 className="w-4 h-4" />
          )}
        </button>
      )}
    </div>
  );
};

// ----------------------------------------------------
// Sortable Wrapper
// ----------------------------------------------------
const SortableImage = ({ image, allowDelete, onDelete, isFirst }) => {
  const { setNodeRef, attributes, listeners, transform, transition, isDragging } =
    useSortable({ id: image.uuid });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
      }}
      className={cn(
        "cursor-grab active:cursor-grabbing",
        isFirst && "col-span-2 row-span-2"
      )}
      {...attributes}
      {...listeners}
    >
      <ImageDisplay
        image={image}
        allowDelete={allowDelete}
        onDelete={onDelete}
        isFirst={isFirst}
      />
    </div>
  );
};

// ----------------------------------------------------
// Main Component
// ----------------------------------------------------
export function ImageUploader({
  currentImages = [],
  isMultiple = true,
  allowDelete = true,
  allowSwap = true,
  maxImages = 3,          // ⭐ DEFAULT LIMIT = 3
  onUpload,
  onDelete,
  onSortEnd,
}) {
  const [images, setImages] = useState(currentImages);

  useEffect(() => setImages(currentImages), [currentImages]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = images.findIndex((i) => i.uuid === active.id);
    const newIndex = images.findIndex((i) => i.uuid === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    const sorted = arrayMove(images, oldIndex, newIndex);
    setImages(sorted);
    onSortEnd?.(oldIndex, newIndex);
  };

  const handleUpload = async (uploadedImgs) => {
    if (images.length >= maxImages) return;

    const availableSlots = maxImages - images.length;
    const limited = uploadedImgs.slice(0, availableSlots);

    await onUpload?.(limited);
    setImages((prev) => [...prev, ...limited]);
  };

  const handleDelete = async (image) => {
    await onDelete?.(image);
    setImages((prev) => prev.filter((i) => i.uuid !== image.uuid));
  };

  const canAddMore = images.length < maxImages;

  // ----------------------------------------------------
  // Single Image Mode
  // ----------------------------------------------------
  if (!isMultiple) {
    const hasImage = images.length > 0;

    return (
      <div className="relative w-full aspect-square">
        {hasImage && (
          <ImageDisplay
            image={images[0]}
            allowDelete={allowDelete}
            onDelete={handleDelete}
            isFirst={true}
          />
        )}

        {canAddMore && (
          <div className="absolute inset-0">
            <Upload onUpload={handleUpload} isSingleMode={true} disabled={!canAddMore} />
          </div>
        )}
      </div>
    );
  }

  // ----------------------------------------------------
  // Multiple Images with Drag & Drop
  // ----------------------------------------------------
  if (allowSwap && images.length > 1) {
    return (
      <div className="grid grid-cols-4 gap-2 auto-rows-fr">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={images.map((i) => i.uuid)}>
            {images.map((img, idx) => (
              <SortableImage
                key={img.uuid}
                image={img}
                allowDelete={allowDelete}
                onDelete={handleDelete}
                isFirst={idx === 0}
              />
            ))}
          </SortableContext>
        </DndContext>

        {/* Upload only if limit not reached */}
        {canAddMore && (
          <div className="aspect-square w-full h-full">
            <Upload onUpload={handleUpload} disabled={!canAddMore} />
          </div>
        )}
      </div>
    );
  }

  // ----------------------------------------------------
  // Multiple Images without DND
  // ----------------------------------------------------
  return (
    <div className="grid grid-cols-4 gap-2 auto-rows-fr">
      {images.map((img, idx) => (
        <div key={img.uuid} className={cn(idx === 0 && "col-span-2 row-span-2")}>
          <ImageDisplay
            image={img}
            allowDelete={allowDelete}
            onDelete={handleDelete}
            isFirst={idx === 0}
          />
        </div>
      ))}

      {canAddMore && (
        <div className="aspect-square w-full h-full">
          <Upload onUpload={handleUpload} disabled={!canAddMore} />
        </div>
      )}
    </div>
  );
}
