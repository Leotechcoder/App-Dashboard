"use client";

import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/text-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ProductForm({
  initialData = {},
  categories = [],
  onChange,
}) {
  const [formData, setFormData] = useState({
    name: initialData.name || "",
    description: initialData.description || "",
    price: initialData.price ?? "",
    stock: initialData.stock ?? "",
    category: initialData.category || "",
    available:
      initialData.available !== undefined
        ? String(initialData.available)
        : "true",
  });

  useEffect(() => {
    onChange?.(formData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6 text-[hsl(var(--muted-foreground))]">
      {/* NOMBRE */}
      <div className="space-y-2">
        <Label htmlFor="name">Nombre</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => updateField("name", e.target.value)}
          className="bg-[hsl(var(--background-unit-2))] 
                     border-[hsl(var(--border))] text-[hsl(var(--foreground))] "
        />
      </div>

      {/* DESCRIPCIÓN */}
      <div className="space-y-2">
        <Label htmlFor="description">Descripción</Label>
        <Textarea
          id="description"
          rows={4}
          value={formData.description}
          onChange={(e) => updateField("description", e.target.value)}
          className="bg-[hsl(var(--background-unit-2))] 
                     border-[hsl(var(--border))] text-[hsl(var(--foreground))] "
        />
      </div>

      {/* PRECIO / STOCK */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Precio</Label>
          <Input
            id="price"
            type="number"
            min="0"
            step="0.01"
            value={formData.price}
            onChange={(e) => updateField("price", e.target.value)}
            className="bg-[hsl(var(--background-unit-2))] 
                       border-[hsl(var(--border))] text-[hsl(var(--foreground))] "
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="stock">Stock</Label>
          <Input
            id="stock"
            type="number"
            min="0"
            value={formData.stock}
            onChange={(e) => updateField("stock", e.target.value)}
            className="bg-[hsl(var(--background-unit-2))] 
                       border-[hsl(var(--border))] text-[hsl(var(--foreground))] "
          />
        </div>
      </div>

      {/* CATEGORÍA */}
      <div className="space-y-2">
        <Label>Categoría</Label>
        <Select
          value={formData.category}
          onValueChange={(value) => updateField("category", value)}
        >
          <SelectTrigger
            className="bg-[hsl(var(--background-unit-2))] 
                       border-[hsl(var(--border))]"
          >
            <SelectValue placeholder="Seleccionar categoría" />
          </SelectTrigger>

          <SelectContent
            className="bg-[hsl(var(--background-unit-2))] 
                       border border-[hsl(var(--border))] "
          >
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* ESTADO */}
      <div className="space-y-2">
        <Label>Estado</Label>
        <Select
          value={String(formData.available)}
          onValueChange={(value) => updateField("available", value)}
        >
          <SelectTrigger
            className="bg-[hsl(var(--background-unit-2))] 
                       border-[hsl(var(--border))]"
          >
            <SelectValue />
          </SelectTrigger>

          <SelectContent
            className="bg-[hsl(var(--background-unit-2))] 
                       border border-[hsl(var(--border))]"
          >
            <SelectItem value="true">Disponible</SelectItem>
            <SelectItem value="false">No disponible</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
