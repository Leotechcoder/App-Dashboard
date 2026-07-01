"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";

export function InventoryManager({ inventory = {}, onChange }) {
  const handleFieldChange = (name, value) => {
    onChange?.({
      ...inventory,
      [name]: value,
    });
  };

  const manageStock = Boolean(inventory.manageStock);

  return (
    <Card
      className="
        border border-border
        shadow-sm rounded-xl
      "
    >
      <CardHeader>
        <CardTitle className="text-lg text-foreground">
          Inventario
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Administrar Stock */}
        <div className="flex flex-col gap-3">
          <Label className="font-medium text-muted-foreground">
            Administrar Stock
          </Label>

          <RadioGroup
            value={String(inventory.manageStock ?? 0)}
            onValueChange={(value) =>
              handleFieldChange("manageStock", Number(value))
            }
            className="flex gap-6"
          >
            <div className="flex items-center gap-2 text-muted-foreground">
              <RadioGroupItem id="manage-stock-yes" value="1" />
              <Label
                htmlFor="manage-stock-yes"
                className=""
              >
                Sí
              </Label>
            </div>

            <div className="flex items-center gap-2">
              <RadioGroupItem id="manage-stock-no" value="0" />
              <Label
                htmlFor="manage-stock-no"
                className="text-muted-foreground"
              >
                No
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* SOLO si se administra stock */}
        {manageStock && (
          <>
            {/* Stock Disponible */}
            <div className="flex flex-col gap-3">
              <Label className="font-medium text-muted-foreground">
                Stock Disponible
              </Label>

              <RadioGroup
                value={String(inventory.stockAvailability ?? 1)}
                onValueChange={(value) =>
                  handleFieldChange(
                    "stockAvailability",
                    Number(value)
                  )
                }
                className="flex gap-6"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem id="stock-in" value="1" />
                  <Label
                    htmlFor="stock-in"
                    className="text-muted-foreground"
                  >
                    En Stock
                  </Label>
                </div>

                <div className="flex items-center gap-2">
                  <RadioGroupItem id="stock-out" value="0" />
                  <Label
                    htmlFor="stock-out"
                    className="text-muted-foreground"
                  >
                    Fuera de Stock
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Cantidad mínima */}
            <div className="flex flex-col gap-2">
              <Label className="font-medium text-muted-foreground">
                Cantidad Mínima
              </Label>
              <Input
                type="number"
                value={inventory.qty || ""}
                onChange={(e) =>
                  handleFieldChange("qty", e.target.value)
                }
                placeholder="Ej.: 5"
              />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
