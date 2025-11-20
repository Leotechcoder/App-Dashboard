"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export function InventoryManager({ inventory = {}, onChange }) {
  const handleFieldChange = (name, value) => {
    onChange?.({
      ...inventory,
      [name]: value,
    })
  }

  const manageStock = Boolean(inventory.manageStock)

  return (
    <Card className="shadow-sm border rounded-2xl bg-gray-50">
      <CardHeader>
        <CardTitle className="text-lg">Inventario</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">

        {/* Administrar Stock */}
        <div className="flex flex-col gap-3">
          <Label className="font-medium">Administrar Stock</Label>

          <RadioGroup
            value={String(inventory.manageStock ?? 0)}
            onValueChange={(value) => handleFieldChange("manageStock", Number(value))}
            className="flex gap-4"
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem id="manage-stock-yes" value="1" />
              <Label htmlFor="manage-stock-yes">Sí</Label>
            </div>

            <div className="flex items-center gap-2">
              <RadioGroupItem id="manage-stock-no" value="0" />
              <Label htmlFor="manage-stock-no">No</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Mostrar SOLO si manageStock es true */}
        {manageStock && (
          <>
            {/* Stock Disponible */}
            <div className="flex flex-col gap-3">
              <Label className="font-medium">Stock Disponible</Label>

              <RadioGroup
                value={String(inventory.stockAvailability ?? 1)}
                onValueChange={(value) =>
                  handleFieldChange("stockAvailability", Number(value))
                }
                className="flex gap-4"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem id="stock-in" value="1" />
                  <Label htmlFor="stock-in">En Stock</Label>
                </div>

                <div className="flex items-center gap-2">
                  <RadioGroupItem id="stock-out" value="0" />
                  <Label htmlFor="stock-out">Fuera de Stock</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Cantidad Mínima */}
            <div className="flex flex-col gap-2">
              <Label className="font-medium">Cantidad Mínima</Label>
              <Input
                type="number"
                value={inventory.qty || ""}
                onChange={(e) => handleFieldChange("qty", e.target.value)}
                placeholder="Ej.: 5"
              />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
