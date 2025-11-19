// src/modules/products/components/ProductEditor.jsx
"use client";

import React, { useEffect, useState, useMemo, useRef } from "react";
import { useDispatch } from "react-redux";
import {
  createData,
  updateData,
  setFormView,
} from "../../application/productSlice";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import { ProductForm } from "./ProductForm";
import { ImageUploader } from "./ImageUploader";
import { InventoryManager } from "./InventoryManager";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

// 🔥 Framer Motion
import { motion } from "framer-motion";

export function ProductEditor({
  initialProduct = {},
  categories = [],
  onSave,
  onCancel,
  title = "Producto",
  showBackButton = true,
}) {
  const dispatch = useDispatch();

  const isEditMode = Boolean(
    initialProduct && (initialProduct.id || initialProduct.id_)
  );

  const productId = initialProduct?.id || initialProduct?.id_ || null;

  // ---------------------------------------------------------------------
  // FORM DATA
  // ---------------------------------------------------------------------
  const [formData, setFormData] = useState({
    name: initialProduct?.name || initialProduct?.name_ || "",
    description: initialProduct?.description || "",
    price: initialProduct?.price ?? "",
    stock: initialProduct?.stock ?? "",
    category: initialProduct?.category || "",
    available:
      initialProduct?.available !== undefined
        ? String(initialProduct?.available)
        : "true",
  });

  // ---------------------------------------------------------------------
  // INVENTORY
  // ---------------------------------------------------------------------
  const [inventory, setInventory] = useState(
    initialProduct.inventory || {
      manageStock: 1,
      stockAvailability: 1,
      qty: "",
    }
  );

  // ---------------------------------------------------------------------
  // IMAGES — FIXED + NORMALIZED
  // ---------------------------------------------------------------------
  const initialImages = useMemo(() => {
    const imgs = initialProduct.images || [];
    return imgs.map((img) => ({
      id: img.id,
      uuid: `db_${img.id}`,
      url: img.url,
      cloudinaryId:
        img.cloudinary_id || img.cloudinaryId || img.cloudinary_id,
      position: img.position ?? 0,
    }));
  }, [initialProduct]);

  const [images, setImages] = useState(initialImages);
  const imagesInitialized = useRef(false);
  const [imagesToDelete, setImagesToDelete] = useState([]);

  useEffect(() => {
    if (!imagesInitialized.current) {
      setImages(initialImages);
      imagesInitialized.current = true;
    }
  }, [initialImages]);

  // ---------------------------------------------------------------------
  // HANDLERS IMAGENES
  // ---------------------------------------------------------------------
  const handleImageUpload = (uploadedImages) => {
    const normalized = uploadedImages.map((u) => ({
      uuid: u.uuid,
      url: u.url,
      file: u.file,
    }));

    setImages((prev) => [...prev, ...normalized]);
  };

  const handleImageDelete = (image) => {
    if (image.id) {
      setImagesToDelete((prev) =>
        prev.includes(image.id) ? prev : [...prev, image.id]
      );
    }
    setImages((prev) => prev.filter((img) => img.uuid !== image.uuid));
  };

  const handleSortEnd = (oldIndex, newIndex) => {
    setImages((prev) => {
      const updated = [...prev];
      const [moved] = updated.splice(oldIndex, 1);
      updated.splice(newIndex, 0, moved);
      return updated;
    });
  };

  // ---------------------------------------------------------------------
  // VALIDACIÓN
  // ---------------------------------------------------------------------
  const validate = () => {
    const errs = [];
    if (!formData.name.trim()) errs.push("Nombre requerido");
    if (!formData.category.trim()) errs.push("Categoría requerida");
    if (formData.price === "" || Number(formData.price) <= 0)
      errs.push("Precio inválido");
    if (formData.stock === "" || Number(formData.stock) < 0)
      errs.push("Stock inválido");

    if (errs.length) {
      toast.error(errs.join(". "));
      return false;
    }
    return true;
  };

  // ---------------------------------------------------------------------
  // SAVE
  // ---------------------------------------------------------------------
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!validate()) return;

    setIsLoading(true);

    try {
      const fd = new FormData();

      fd.append("name", formData.name);
      fd.append("description", formData.description ?? "");
      fd.append("price", Number(formData.price));
      fd.append("stock", Number(formData.stock));
      fd.append("category", formData.category);
      fd.append("available", String(formData.available === "true"));

      images.forEach((img) => {
        if (img.file) fd.append("images", img.file);
      });

      fd.append("imagesToDelete", JSON.stringify(imagesToDelete));

      const orderForDb = images
        .map((img, index) => ({
          id: img.id,
          position: index,
        }))
        .filter((i) => i.id);

      fd.append("newOrder", JSON.stringify(orderForDb));

      if (isEditMode) {
        await dispatch(updateData({ id: productId, product: fd })).unwrap();
        toast.success("Producto actualizado");
      } else {
        await dispatch(createData(fd)).unwrap();
        toast.success("Producto creado");
      }

      onSave?.();
      dispatch(setFormView(false));
    } catch (err) {
      console.error("Error saving product:", err);
      toast.error(err?.message || "Error al guardar");
    } finally {
      setIsLoading(false);
    }
  };

  // CANCEL
  const handleCancel = () => {
    onCancel?.();
    dispatch(setFormView(false));
  };

  // ---------------------------------------------------------
  // ANIMATIONS
  // ---------------------------------------------------------

  const fadeInUp = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 },
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  // ---------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------

  return (
    <motion.div
      className="w-full bg-gray-100 overflow-hidden"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="container mx-auto py-8 px-4">
        <motion.div
          className="max-w-6xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {/* HEADER */}
          <motion.div
            className="flex items-center justify-between mb-6"
            variants={fadeInUp}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center gap-3">
              {showBackButton && (
                <Button variant="ghost" size="sm" onClick={handleCancel}>
                  <ArrowLeft className="w-4 h-4" />
                  Volver
                </Button>
              )}
              <h2 className="text-2xl font-bold">{initialProduct.name ? 'Editar ' + title : 'Crear ' + title}</h2>
            </div>
          </motion.div>

          {/* GRID */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* LEFT */}
            <motion.div
              className="space-y-4"
              variants={fadeInUp}
              transition={{ duration: 0.35 }}
            >
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle>General</CardTitle>
                </CardHeader>
                <CardContent>
                  <ProductForm
                    initialData={formData}
                    categories={categories}
                    onChange={(data) => setFormData({ ...formData, ...data })}
                  />
                </CardContent>
              </Card>
            </motion.div>

            {/* RIGHT */}
            <motion.div
              className="space-y-4"
              variants={fadeInUp}
              transition={{ duration: 0.35, delay: 0.05 }}
            >
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle>Imágenes</CardTitle>
                  <CardDescription>
                    La primera imagen es la principal.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <motion.div
                    key={images.length}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ImageUploader
                      currentImages={images}
                      isMultiple={true}
                      allowDelete={true}
                      allowSwap={true}
                      onUpload={handleImageUpload}
                      onDelete={handleImageDelete}
                      onSortEnd={handleSortEnd}
                    />
                  </motion.div>
                </CardContent>
              </Card>

              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                transition={{ duration: 0.35, delay: 0.1 }}
              >
                <InventoryManager
                  inventory={inventory}
                  onChange={setInventory}
                />
              </motion.div>
            </motion.div>
          </div>

          {/* BUTTONS */}
          <motion.div
            className="w-full flex gap-4 mt-8 justify-end"
            variants={fadeInUp}
            transition={{ duration: 0.3, delay: 0.05 }}
          >
            <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
              Cancelar
            </Button>

            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading
                ? "Guardando..."
                : isEditMode
                ? "Actualizar Producto"
                : "Crear Producto"}
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
