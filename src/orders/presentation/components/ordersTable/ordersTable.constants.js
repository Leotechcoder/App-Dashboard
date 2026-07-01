import {
  DollarSign,
  CreditCard,
  Smartphone,
  Monitor,
  MessageCircle,
  LayoutGrid,
} from "lucide-react";

// ── Semáforo de antigüedad de la orden ──────────────────────────────────────
export const AGE_STYLES = {
  green: {
    dot: "bg-green",
    badge: "bg-green/15 text-green border-green/30",
    label: "Verde",
  },
  yellow: {
    dot: "bg-yellow",
    badge: "bg-yellow/15 text-yellow border-yellow/30",
    label: "Demorada",
  },
  destructive: {
    dot: "bg-destructive",
    badge: "bg-destructive/12 text-destructive border-destructive/30",
    label: "Urgente",
  },
};

// ── Ícono por origen de la orden ─────────────────────────────────────────────
export const SOURCE_ICON_MAP = {
  pos: Monitor,
  app: Smartphone,
  whatsapp: MessageCircle,
  other: LayoutGrid,
};

// ── Métodos de pago disponibles al cerrar una orden ─────────────────────────
export const PAYMENT_OPTIONS = [
  { key: "efectivo", label: "Efectivo", icon: DollarSign },
  { key: "credito", label: "Crédito", icon: CreditCard },
  { key: "debito", label: "Débito", icon: Smartphone },
  { key: "transferencia", label: "Transferencia", icon: Smartphone },
];
