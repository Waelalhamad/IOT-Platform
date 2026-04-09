import { create } from 'zustand';
import type { GridWidget } from '../types/widget.types';
import { nanoid } from 'nanoid';

interface RGLLayout {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  [key: string]: unknown;
}

interface DashboardState {
  widgetsByDevice: Record<string, GridWidget[]>;
  isDirty: boolean;
  isEditMode: boolean;
  setWidgets: (deviceId: string, widgets: GridWidget[]) => void;
  addWidget: (deviceId: string, widget: Omit<GridWidget, 'i' | 'x' | 'y'>) => void;
  removeWidget: (deviceId: string, widgetId: string) => void;
  updateLayout: (deviceId: string, layouts: RGLLayout[]) => void;
  setEditMode: (v: boolean) => void;
  markClean: () => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  widgetsByDevice: {},
  isDirty: false,
  isEditMode: false,

  setWidgets: (deviceId, widgets) =>
    set((s) => ({
      widgetsByDevice: { ...s.widgetsByDevice, [deviceId]: widgets },
      isDirty: false,
    })),

  addWidget: (deviceId, widget) =>
    set((s) => {
      const existing = s.widgetsByDevice[deviceId] ?? [];
      const maxY = existing.reduce((m, w) => Math.max(m, w.y + w.h), 0);
      return {
        widgetsByDevice: {
          ...s.widgetsByDevice,
          [deviceId]: [...existing, { ...widget, i: nanoid(8), x: 0, y: maxY }],
        },
        isDirty: true,
      };
    }),

  removeWidget: (deviceId, id) =>
    set((s) => ({
      widgetsByDevice: {
        ...s.widgetsByDevice,
        [deviceId]: (s.widgetsByDevice[deviceId] ?? []).filter((w) => w.i !== id),
      },
      isDirty: true,
    })),

  updateLayout: (deviceId, layouts) =>
    set((s) => ({
      widgetsByDevice: {
        ...s.widgetsByDevice,
        [deviceId]: (s.widgetsByDevice[deviceId] ?? []).map((w) => {
          const l = layouts.find((l) => l.i === w.i);
          return l ? { ...w, x: l.x, y: l.y, w: l.w, h: l.h } : w;
        }),
      },
      isDirty: true,
    })),

  setEditMode: (isEditMode) => set({ isEditMode }),
  markClean: () => set({ isDirty: false }),
}));
