import { Responsive, WidthProvider } from 'react-grid-layout/legacy';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import type { GridWidget } from '../../types/widget.types';
import WidgetFactory from '../widgets/WidgetFactory';

const ResponsiveGrid = WidthProvider(Responsive);

interface RGLLayout {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  [key: string]: unknown;
}

interface Props {
  widgets: GridWidget[];
  deviceId: string;
  isEditMode: boolean;
  onLayoutChange: (layouts: RGLLayout[]) => void;
  onRemoveWidget: (id: string) => void;
}

const BREAKPOINTS = { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 };
const COLS = { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 };

export default function DraggableGrid({ widgets, deviceId, isEditMode, onLayoutChange, onRemoveWidget }: Props) {
  const layouts = {
    lg: widgets.map((w) => ({ i: w.i, x: w.x, y: w.y, w: w.w, h: w.h })),
  };

  return (
    // Force LTR on the grid container — react-grid-layout calculates pixel
    // positions from the left edge. RTL on the parent flips mouse coords and
    // makes drag/resize behave incorrectly. Widget content inherits its own dir.
    <div dir="ltr">
    <ResponsiveGrid
      className="layout"
      layouts={layouts}
      breakpoints={BREAKPOINTS}
      cols={COLS}
      rowHeight={120}
      isDraggable={isEditMode}
      isResizable={isEditMode}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onLayoutChange={(layout: any) => {
        if (isEditMode) onLayoutChange(layout as RGLLayout[]);
      }}
      margin={[12, 12]}
      containerPadding={[0, 0]}
      useCSSTransforms
    >
      {widgets.map((widget) => (
        <div key={widget.i} style={{ borderRadius: '16px', overflow: 'hidden' }}>
          <WidgetFactory
            widget={widget}
            deviceId={deviceId}
            isEditMode={isEditMode}
            onRemove={onRemoveWidget}
          />
        </div>
      ))}
    </ResponsiveGrid>
    </div>
  );
}
