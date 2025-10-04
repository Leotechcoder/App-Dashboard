"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateData, setFormView } from "../../application/productSlice";
import { ArrowLeft, Image } from "lucide-react";
import { toast } from "sonner";

const EditProductForm = () => {
  const dispatch = useDispatch();
  const { isEditing, categorias } = useSelector((store) => store.products);
  const product = isEditing;
  const [form, setForm] = useState(product);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (product) {
      setForm(product);
    }
  }, [product]);

  const validateForm = () => {
    const newErrors = {};
    if (!form.name.trim())
      newErrors.name = "El nombre del producto es requerido";
    if (!form.description.trim())
      newErrors.description = "La descripción es requerida";
    if (!form.price || Number(form.price) <= 0)
      newErrors.price = "El precio debe ser un número positivo";
    if (!form.category.trim()) newErrors.category = "La categoría es requerida";
    if (!form.stock || Number(form.stock) < 0)
      newErrors.stock = "El stock debe ser un número no negativo";
    if (form.available === null || form.available === undefined) {
      newErrors.available = "El estado es requerido";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setForm((prev) => ({ ...prev, image_url: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setForm((prev) => ({ ...prev, image_url: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const newForm = {
          id: form.id,
          name: form.name,
          price: Number(form.price),
          category: form.category,
          stock: Number(form.stock),
          image_url: form.image_url,
          description: form.description,
          available: form.available, // ahora siempre boolean
        };
        await dispatch(updateData(newForm)).unwrap();
        dispatch(setFormView(false));
      } catch (error) {
        toast.error(
          error.message || "Ha ocurrido un error al actualizar el producto"
        );
      }
    }
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === "available" ? value === "true" : value, // 👈 conversión automática
    });

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleGoBack = () => {
    dispatch(setFormView(false));
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-6 px-4 lg:pt-0 bg-gray-50 lg:px-12">
      <div className="flex justify-start w-full pl-5">
        <button
          onClick={handleGoBack}
          className="mt-6 flex items-center gap-2 text-gray-700 hover:text-gray-900"
        >
          <ArrowLeft className="w-6 h-6" />
          <span>Volver</span>
        </button>
      </div>
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-md overflow-hidden lg:scale-90 lg:flex lg:items-stretch">
        <div
          className="w-full lg:w-1/2 h-64 lg:h-auto bg-gray-100 flex items-center justify-center"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleFileDrop}
        >
          {form.image_url ? (
            <img
              src={form.image_url || "/placeholder.svg"}
              alt="Vista previa"
              className="h-full w-full object-cover"
            />
          ) : (
            <label
              htmlFor="image"
              className="flex flex-col items-center justify-center cursor-pointer h-full w-full"
            >
              <Image className="text-gray-500 w-16 h-16" />
              <span className="text-sm text-gray-500">
                Arrastra una imagen o haz clic para seleccionar
              </span>
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                className="hidden"
                onChange={handleFileSelect}
              />
            </label>
          )}
        </div>

        <form
          onSubmit={handleSubmit}
          className="w-full lg:w-1/2 p-6 lg:p-8 space-y-4 flex flex-col"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nombre del producto
            </label>
            <input
              name="name_"
              value={form.name}
              onChange={handleInput}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
            />
            {errors.name_ && (
              <p className="text-sm text-red-500 mt-1">{errors.name_}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Descripción
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleInput}
              rows={3}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
            ></textarea>
            {errors.description && (
              <p className="text-sm text-red-500 mt-1">{errors.description}</p>
            )}
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">
                Precio
              </label>
              <input
                name="price"
                type="number"
                value={form.price}
                onChange={handleInput}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
              />
              {errors.price && (
                <p className="text-sm text-red-500 mt-1">{errors.price}</p>
              )}
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">
                Stock
              </label>
              <input
                name="stock"
                type="number"
                value={form.stock}
                onChange={handleInput}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
              />
              {errors.stock && (
                <p className="text-sm text-red-500 mt-1">{errors.stock}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Categoría
            </label>
            <select
              name="category"
              value={form.category || ""} // 👈 mantiene la categoría seleccionada
              onChange={handleInput}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="">Seleccione una categoría</option>
              {categorias.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-sm text-red-500 mt-1">{errors.category}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Estado
            </label>
            <select
              name="available"
              value={String(form.available)} // 👈 importante: forzar string para que el select se sincronice
              onChange={handleInput}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="true">Disponible</option>
              <option value="false">No Disponible</option>
            </select>
            {errors.available && (
              <p className="text-sm text-red-500 mt-1">{errors.available}</p>
            )}
          </div>

          <button
            type="submit"
            className="mt-auto w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700"
          >
            Guardar Cambios
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProductForm;
