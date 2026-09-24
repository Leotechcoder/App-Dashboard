import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Check,
  PackageSearch,
  Plus,
  Search,
} from "lucide-react";

import {
  getDataProducts,
  setSelectedProduct,
} from "@/products/application/productSlice";

import { formatCurrency } from "@/shared/utils/formatPriceLocal";
import { categorias } from "@/shared/infrastructure/utils/stateInitial";

const ProductSelector = ({
  setIsModalOpen,
  setUpdateItem,
}) => {
  const dispatch = useDispatch();

  const { data: products = [] } = useSelector(
    (state) => state.products
  );

  const [selectedCategory, setSelectedCategory] =
    useState(categorias.data[0]);

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (products.length === 0) {
      dispatch(getDataProducts());
    }
  }, [dispatch, products.length]);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchTerm
      .trim()
      .toLowerCase();

    return products.filter((product) => {
      const matchesCategory =
        product.category === selectedCategory;

      const matchesSearch =
        !normalizedSearch ||
        product.name
          ?.toLowerCase()
          .includes(normalizedSearch);

      return matchesCategory && matchesSearch;
    });
  }, [
    products,
    selectedCategory,
    searchTerm,
  ]);

  const handleSelectProduct = (product) => {
    const newItem = {
      productId: product.id,
      productName: product.name,
      description: "",
      unitPrice: product.price,
      quantity: 1,
    };

    /*
     * Seleccionar desde el catálogo siempre inicia
     * un nuevo item, nunca conserva el modo edición.
     */
    setUpdateItem?.(false);

    dispatch(setSelectedProduct(newItem));

    setIsModalOpen(true);
  };

  return (
    <section
      className="
        flex
        h-full
        min-h-0
        min-w-0
        flex-col
        overflow-hidden
        bg-[hsl(var(--background-unit))]
      "
    >
      {/* ====================================================================== 
      /* FILTERS                                                                 */
      /* ====================================================================== */}

      <div className="shrink-0 px-3 pt-3">
        {/* SEARCH */}

        <div className="relative mb-3">
          <Search
            className="
              absolute
              left-3
              top-1/2
              size-4
              -translate-y-1/2
              text-[hsl(var(--muted-foreground))]
            "
          />

          <input
            type="text"
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
            placeholder="Buscar producto..."
            className="
              h-10
              w-full
              rounded-lg
              border
              border-[hsl(var(--border))]
              bg-[hsl(var(--background-unit-2))]
              pl-9
              pr-3
              text-sm
              text-[hsl(var(--foreground))]
              outline-none
              placeholder:text-[hsl(var(--muted-foreground))]
              transition
              focus:border-[hsl(var(--green))]
              focus:ring-2
              focus:ring-[hsl(var(--green)/0.12)]
            "
          />
        </div>

        {/* CATEGORIES */}

        <div
          className="
            flex
            gap-2
            overflow-x-auto
            pb-2
            [scrollbar-width:none]
            [&::-webkit-scrollbar]:hidden
          "
        >
          {categorias.data.map((category) => {
            const isSelected =
              selectedCategory === category;

            return (
              <button
                key={category}
                type="button"
                onClick={() =>
                  setSelectedCategory(category)
                }
                className={`
                  flex
                  shrink-0
                  items-center
                  gap-1.5
                  rounded-lg
                  border
                  px-3
                  py-1.5
                  text-xs
                  font-medium
                  transition-all
                  ${
                    isSelected
                      ? `
                        border-[hsl(var(--green))]
                        bg-[hsl(var(--green)/0.12)]
                        text-[hsl(var(--green))]
                      `
                      : `
                        border-[hsl(var(--border))]
                        bg-[hsl(var(--background-unit-2))]
                        text-[hsl(var(--muted-foreground))]
                        hover:bg-[hsl(var(--background-unit-3))]
                        hover:text-[hsl(var(--foreground))]
                      `
                  }
                `}
              >
                {isSelected && (
                  <Check className="size-3" />
                )}

                {category}
              </button>
            );
          })}
        </div>
      </div>

      {/* ====================================================================== 
      /* SCROLLABLE PRODUCTS                                                     */
      /* ====================================================================== */}

      <div
        className="
          min-h-0
          min-w-0
          flex-1
          overflow-y-auto
          overscroll-contain
          px-3
          pb-3
          pt-1
          [scrollbar-gutter:stable]
        "
      >
        {filteredProducts.length === 0 ? (
          <div
            className="
              flex
              min-h-40
              flex-col
              items-center
              justify-center
              rounded-xl
              border
              border-dashed
              border-[hsl(var(--border))]
              px-4
              text-center
            "
          >
            <PackageSearch
              className="
                mb-2
                size-7
                text-[hsl(var(--muted-foreground))]
              "
            />

            <p
              className="
                text-sm
                font-medium
                text-[hsl(var(--foreground))]
              "
            >
              No encontramos productos
            </p>

            <p
              className="
                mt-1
                text-xs
                text-[hsl(var(--muted-foreground))]
              "
            >
              Probá con otra búsqueda o categoría.
            </p>
          </div>
        ) : (
          <div className="grid gap-2">
            {filteredProducts.map((product) => (
              <button
                key={product.id}
                type="button"
                onClick={() =>
                  handleSelectProduct(product)
                }
                className="
                  group
                  flex
                  w-full
                  items-center
                  justify-between
                  gap-3
                  rounded-xl
                  border
                  border-[hsl(var(--border))]
                  bg-[hsl(var(--background-unit-2))]
                  px-3
                  py-3
                  text-left
                  transition-all
                  hover:border-[hsl(var(--green)/0.5)]
                  hover:bg-[hsl(var(--green)/0.05)]
                  active:scale-[0.99]
                "
              >
                <div className="min-w-0">
                  <p
                    className="
                      truncate
                      text-sm
                      font-medium
                      text-[hsl(var(--foreground))]
                    "
                  >
                    {product.name}
                  </p>

                  <div className="mt-0.5 flex items-center gap-2">
                    {product.category && (
                      <>
                        <span
                          className="
                            truncate
                            text-[11px]
                            text-[hsl(var(--muted-foreground))]
                          "
                        >
                          {product.category}
                        </span>

                        <span
                          className="
                            size-1
                            shrink-0
                            rounded-full
                            bg-[hsl(var(--border))]
                          "
                        />
                      </>
                    )}

                    <span
                      className="
                        text-xs
                        font-semibold
                        text-[hsl(var(--green))]
                      "
                    >
                      {formatCurrency(product.price)}
                    </span>
                  </div>
                </div>

                <span
                  className="
                    flex
                    size-8
                    shrink-0
                    items-center
                    justify-center
                    rounded-lg
                    bg-[hsl(var(--green)/0.1)]
                    text-[hsl(var(--green))]
                    transition-all
                    group-hover:bg-[hsl(var(--green))]
                    group-hover:text-[hsl(var(--background))]
                  "
                >
                  <Plus className="size-4" />
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductSelector;