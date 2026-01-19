"use client";

import { useState, useMemo } from "react";
import { ShoppingBag, ArrowUp, ArrowDown } from "lucide-react";
import { useSelector } from "react-redux";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

const TopProductsTable = ({ orders }) => {
  const items = useSelector((store) => store.items.data || []);
  const [sortOrder, setSortOrder] = useState("desc");

  const topProductsOverall = useMemo(() => {
    if (!orders?.length) return [];

    const closedOrderIds = orders.map((o) => o.id);
    const closedItems = items.filter((item) =>
      closedOrderIds.includes(item.orderId)
    );

    return Object.values(
      closedItems.reduce((acc, item) => {
        if (!acc[item.productId]) {
          acc[item.productId] = {
            id: item.productId,
            name: item.productName,
            sales: 0,
          };
        }
        acc[item.productId].sales += Number(item.quantity) || 0;
        return acc;
      }, {})
    );
  }, [items, orders]);

  const sortedProducts = useMemo(() => {
    return [...topProductsOverall]
      .sort((a, b) =>
        sortOrder === "desc" ? b.sales - a.sales : a.sales - b.sales
      )
      .slice(0, 5);
  }, [topProductsOverall, sortOrder]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <ShoppingBag className="h-5 w-5 text-[hsl(var(--primary))]" />
          Productos más vendidos
        </CardTitle>

        <button
          onClick={() =>
            setSortOrder(sortOrder === "desc" ? "asc" : "desc")
          }
          className="flex items-center gap-1 text-sm text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
        >
          {sortOrder === "desc" ? (
            <>
              <ArrowDown className="h-4 w-4" />
              Mayor a menor
            </>
          ) : (
            <>
              <ArrowUp className="h-4 w-4" />
              Menor a mayor
            </>
          )}
        </button>
      </CardHeader>

      <CardContent className="p-0">
        <table className="w-full border-t border-[hsl(var(--border))]">
          <thead className="bg-muted">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-[hsl(var(--muted-foreground))]">
                Producto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-[hsl(var(--muted-foreground))]">
                Ventas
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[hsl(var(--border))]">
            {sortedProducts.map((product) => (
              <tr
                key={product.id}
                className="hover:bg-muted/50 transition-colors"
              >
                <td className="px-6 py-4 text-sm font-medium text-[hsl(var(--foreground))]">
                  {product.name}
                </td>
                <td className="px-6 py-4 text-sm text-[hsl(var(--muted-foreground))]">
                  {product.sales}
                </td>
              </tr>
            ))}

            {sortedProducts.length === 0 && (
              <tr>
                <td
                  colSpan={2}
                  className="px-6 py-6 text-center text-sm text-[hsl(var(--muted-foreground))]"
                >
                  No hay productos vendidos todavía.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
};

export default TopProductsTable;
