
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import {
  createData,
  updateData,
  setFormView,
  getDataProducts,
} from "@/products/application/productSlice";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

import {
  ArrowLeft,
  Package,
  ImageIcon,
  Boxes,
  Save,
  RotateCcw,
} from "lucide-react";

import { toast } from "sonner";
import { motion } from "framer-motion";

import { ProductForm } from "./ProductForm";
import { ImageUploader } from "./ImageUploader";
import { InventoryManager } from "./InventoryManager";

/* ═══════════════════════════════════════════════
   ANIMATIONS
═══════════════════════════════════════════════ */

const pageVariants = {
  hidden: {
    opacity: 0,
    y: 8,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
};

const sectionVariants = {
  hidden: {
    opacity: 0,
    y: 6,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
};

/* ═══════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════ */

const getProductId = (product) =>
  product?.id || product?.id_ || null;

const normalizeImages = (product) => {
  const images = product?.images ?? [];

  return images.map((image, index) => ({
    id: image.id,
    uuid: image.uuid || `db_${image.id}`,
    url: image.url,
    file: image.file,
    cloudinaryId:
      image.cloudinary_id ||
      image.cloudinaryId ||
      null,
    position: image.position ?? index,
  }));
};

const getInitialFormData = (product = {}) => ({
  name: product?.name || product?.name_ || "",
  price: product?.price ?? "",
  category: product?.category || "",
  stock: product?.stock ?? "",
  description: product?.description || "",
  available:
    product?.available !== undefined
      ? String(product.available)
      : "true",
});

const getInitialInventory = (product = {}) =>
  product?.inventory ?? {
    manageStock: 1,
    stockAvailability: 1,
    qty: "",
  };

/* ═══════════════════════════════════════════════
   SECTION TITLE
═══════════════════════════════════════════════ */

const SectionTitle = ({
  icon: Icon,
  title,
  description,
  badge,
}) => {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="h-4 w-4" />
      </div>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-base font-semibold">
            {title}
          </h3>

          {badge && (
            <Badge
              variant="outline"
              className="text-[11px]"
            >
              {badge}
            </Badge>
          )}
        </div>

        {description && (
          <p className="mt-0.5 text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════
   PRODUCT EDITOR
═══════════════════════════════════════════════ */

export function ProductEditor({
  initialProduct = {},
  categories = [],
  onSave,
  onCancel,
  title = "Producto",
  showBackButton = true,
}) {
  const dispatch = useDispatch();

  const productId = useMemo(
    () => getProductId(initialProduct),
    [initialProduct]
  );

  const isEditMode = Boolean(productId);

  /* ─────────────────────────────────────────────
     FORM
  ───────────────────────────────────────────── */

  const [formData, setFormData] = useState(() =>
    getInitialFormData(initialProduct)
  );

  /* ─────────────────────────────────────────────
     INVENTORY
  ───────────────────────────────────────────── */

  const [inventory, setInventory] = useState(() =>
    getInitialInventory(initialProduct)
  );

  /* ─────────────────────────────────────────────
     IMAGES
  ───────────────────────────────────────────── */

  const [images, setImages] = useState(() =>
    normalizeImages(initialProduct)
  );

  const [imagesToDelete, setImagesToDelete] = useState([]);

  /* ─────────────────────────────────────────────
     UI
  ───────────────────────────────────────────── */

  const [isLoading, setIsLoading] = useState(false);

  /* ═══════════════════════════════════════════════
     SYNC INITIAL PRODUCT
  ═══════════════════════════════════════════════ */

  useEffect(() => {
    setFormData(getInitialFormData(initialProduct));
    setInventory(getInitialInventory(initialProduct));
    setImages(normalizeImages(initialProduct));
    setImagesToDelete([]);
  }, [initialProduct]);

  /* ═══════════════════════════════════════════════
     FORM HANDLERS
  ═══════════════════════════════════════════════ */

  const handleFormChange = (data) => {
    setFormData((current) => ({
      ...current,
      ...data,
    }));
  };

  const handleReset = () => {
    setFormData(getInitialFormData(initialProduct));
    setInventory(getInitialInventory(initialProduct));
    setImages(normalizeImages(initialProduct));
    setImagesToDelete([]);

    toast.info("Cambios restablecidos");
  };

  /* ═══════════════════════════════════════════════
     IMAGE HANDLERS
  ═══════════════════════════════════════════════ */

  const handleImageUpload = (uploadedImages = []) => {
    const normalized = uploadedImages.map((image) => ({
      uuid: image.uuid,
      url: image.url,
      file: image.file,
    }));

    setImages((current) => [
      ...current,
      ...normalized,
    ]);
  };

  const handleImageDelete = (image) => {
    if (image?.id) {
      setImagesToDelete((current) =>
        current.includes(image.id)
          ? current
          : [...current, image.id]
      );
    }

    setImages((current) =>
      current.filter(
        (currentImage) =>
          currentImage.uuid !== image.uuid
      )
    );
  };

  const handleSortEnd = (oldIndex, newIndex) => {
    if (
      oldIndex === newIndex ||
      oldIndex < 0 ||
      newIndex < 0
    ) {
      return;
    }

    setImages((current) => {
      if (
        oldIndex >= current.length ||
        newIndex >= current.length
      ) {
        return current;
      }

      const updated = [...current];
      const [movedImage] = updated.splice(oldIndex, 1);

      updated.splice(newIndex, 0, movedImage);

      return updated;
    });
  };

  /* ═══════════════════════════════════════════════
     VALIDATION
  ═══════════════════════════════════════════════ */

  const validate = () => {
    const errors = [];

    const name = formData.name?.trim();
    const category = formData.category?.trim();

    if (!name) {
      errors.push("Nombre requerido");
    }

    if (!category) {
      errors.push("Categoría requerida");
    }

    if (
      formData.price === "" ||
      Number(formData.price) <= 0
    ) {
      errors.push("Precio inválido");
    }

    if (
      formData.stock === "" ||
      Number(formData.stock) < 0
    ) {
      errors.push("Stock inválido");
    }

    if (errors.length > 0) {
      toast.error(errors.join(". "));
      return false;
    }

    return true;
  };

  /* ═══════════════════════════════════════════════
     BUILD FORM DATA
  ═══════════════════════════════════════════════ */

  const buildFormData = () => {
    const formDataToSend = new FormData();

    formDataToSend.append(
      "name",
      formData.name.trim()
    );

    formDataToSend.append(
      "price",
      String(Number(formData.price))
    );
    
    formDataToSend.append(
      "category",
      formData.category.trim()
    );
    
    formDataToSend.append(
      "stock",
      String(Number(formData.stock))
    );
    
    formDataToSend.append(
      "description",
      formData.description ?? ""
    );
    
    formDataToSend.append(
      "available",
      String(formData.available === "true")
    );

    /* New images */

    images.forEach((image) => {
      if (image.file) {
        formDataToSend.append(
          "images",
          image.file
        );
      }
    });

    /* Deleted images */

    formDataToSend.append(
      "imagesToDelete",
      JSON.stringify(imagesToDelete)
    );

    /* Existing image order */

    const existingImagesOrder = images
      .map((image, index) => ({
        id: image.id,
        position: index,
      }))
      .filter((image) => image.id);

    formDataToSend.append(
      "newOrder",
      JSON.stringify(existingImagesOrder)
    );

    return formDataToSend;
  };

  /* ═══════════════════════════════════════════════
     SAVE
  ═══════════════════════════════════════════════ */

  const handleSave = async () => {
    if (isLoading || !validate()) {
      return;
    }

    setIsLoading(true);

    try {
      const productFormData = buildFormData();

      if (isEditMode) {
        await dispatch(
          updateData({
            id: productId,
            product: productFormData,
          })
        ).unwrap();

        toast.success("Producto actualizado");
      } else {
        await dispatch(
          createData(productFormData)
        ).unwrap();

        toast.success("Producto creado");
      }

      /*
       * Refresh products after the mutation has
       * completed. Awaiting this avoids navigating
       * while the list is still stale.
       */
      await dispatch(getDataProducts()).unwrap();

      onSave?.();

      dispatch(setFormView(false));
    } catch (error) {
      console.error(
        "Error saving product:",
        error
      );

      toast.error(
        error?.message ||
          "No se pudo guardar el producto"
      );
    } finally {
      setIsLoading(false);
    }
  };

  /* ═══════════════════════════════════════════════
     CANCEL / BACK
  ═══════════════════════════════════════════════ */

  const handleCancel = () => {
    if (isLoading) {
      return;
    }

    onCancel?.();
    dispatch(setFormView(false));
  };

  /* ═══════════════════════════════════════════════
     LABELS
  ═══════════════════════════════════════════════ */

  const pageTitle = isEditMode
    ? `Editar ${title}`
    : `Crear ${title}`;

  const actionLabel = isEditMode
    ? "Actualizar producto"
    : "Crear producto";

  /* ═══════════════════════════════════════════════
     RENDER
  ═══════════════════════════════════════════════ */

  return (
    <motion.div
      className="w-full h-full min-h-0"
      initial="hidden"
      animate="visible"
      variants={pageVariants}
      transition={{
        duration: 0.2,
        ease: "easeOut",
      }}
    >
      <div className="mx-auto h-full w-full max-w-7xl">
        <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-border bg-bg-unit shadow-xl">
          {/* ═══════════════════════════════════════
              HEADER
          ═══════════════════════════════════════ */}

          <header className="shrink-0 border-b border-border">
            <div className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
              <div className="flex min-w-0 items-center gap-3">
                {showBackButton && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={handleCancel}
                    disabled={isLoading}
                    className="shrink-0"
                    aria-label="Volver"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                )}

                <div className="flex min-w-0 items-center gap-3">
                  <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary sm:flex">
                    <Package className="h-5 w-5" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h1 className="truncate text-xl font-semibold tracking-tight lg:text-2xl">
                        {pageTitle}
                      </h1>

                      <Badge
                        variant="outline"
                        className="shrink-0"
                      >
                        {isEditMode
                          ? "Edición"
                          : "Nuevo"}
                      </Badge>
                    </div>

                    <p className="mt-1 text-sm text-muted-foreground">
                      {isEditMode
                        ? "Actualiza la información, imágenes e inventario del producto."
                        : "Completa la información para agregar un nuevo producto."}
                    </p>
                  </div>
                </div>
              </div>

              <div className="hidden items-center gap-2 sm:flex">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleReset}
                  disabled={isLoading}
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Restablecer
                </Button>

                <Button
                  type="button"
                  onClick={handleSave}
                  disabled={isLoading}
                >
                  <Save className="mr-2 h-4 w-4" />

                  {isLoading
                    ? "Guardando..."
                    : actionLabel}
                </Button>
              </div>
            </div>
          </header>

          {/* ═══════════════════════════════════════
              CONTENT
          ═══════════════════════════════════════ */}

          <main className="min-h-0 flex-1 overflow-y-auto">
            <div className="p-5 sm:p-6 lg:p-8">
              <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1.15fr)_minmax(360px,0.85fr)]">
                {/* ═══════════════════════════════
                    LEFT COLUMN
                ═══════════════════════════════ */}

                <motion.div
                  className="min-w-0 space-y-8"
                  variants={sectionVariants}
                  transition={{ duration: 0.2 }}
                >
                  {/* General */}

                  <section>
                    <SectionTitle
                      icon={Package}
                      title="Información del producto"
                      description="Define los datos principales que verá el cliente."
                    />

                    <div className="mt-6">
                      <ProductForm
                        initialData={formData}
                        categories={categories}
                        onChange={handleFormChange}
                      />
                    </div>
                  </section>

                  <Separator />

                  {/* Inventory */}

                  <section>
                    <SectionTitle
                      icon={Boxes}
                      title="Inventario"
                      description="Configura cómo se controla la disponibilidad del producto."
                    />

                    <div className="mt-5">
                      <InventoryManager
                        inventory={inventory}
                        onChange={setInventory}
                      />
                    </div>
                  </section>
                </motion.div>

                {/* ═══════════════════════════════
                    RIGHT COLUMN
                ═══════════════════════════════ */}

                <motion.div
                  className="min-w-0"
                  variants={sectionVariants}
                  transition={{
                    duration: 0.2,
                    delay: 0.05,
                  }}
                >
                  <section>
                    <SectionTitle
                      icon={ImageIcon}
                      title="Imágenes"
                      description="Administra las imágenes y define cuál será la principal."
                      badge={
                        images.length > 0
                          ? `${images.length} ${
                              images.length === 1
                                ? "imagen"
                                : "imágenes"
                            }`
                          : "Sin imágenes"
                      }
                    />

                    <div className="mt-5 rounded-xl border border-border bg-bg-unit-2 p-4 sm:p-5">
                      <ImageUploader
                        currentImages={images}
                        isMultiple={true}
                        allowDelete={true}
                        allowSwap={true}
                        onUpload={handleImageUpload}
                        onDelete={handleImageDelete}
                        onSortEnd={handleSortEnd}
                      />
                    </div>
                  </section>

                  {/* Image hint */}

                  <div className="mt-4 rounded-xl border border-dashed border-border bg-background/40 p-4">
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      La primera imagen de la lista se utilizará
                      como imagen principal del producto.
                      Puedes arrastrar las imágenes para cambiar
                      su orden.
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </main>

          {/* ═══════════════════════════════════════
              FOOTER
          ═══════════════════════════════════════ */}

          <footer className="shrink-0 border-t border-border bg-bg-unit-2/50 px-5 py-4 sm:px-6 lg:px-8">
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-xs text-muted-foreground">
                {isEditMode
                  ? "Los cambios se aplicarán al guardar."
                  : "Revisa la información antes de crear el producto."}
              </div>

              <div className="flex w-full gap-2 sm:w-auto">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 sm:flex-none"
                  onClick={handleCancel}
                  disabled={isLoading}
                >
                  Cancelar
                </Button>

                <Button
                  type="button"
                  className="flex-1 sm:flex-none"
                  onClick={handleSave}
                  disabled={isLoading}
                >
                  <Save className="mr-2 h-4 w-4" />

                  {isLoading
                    ? "Guardando..."
                    : actionLabel}
                </Button>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </motion.div>
  );
}

export default ProductEditor;
