import type { GridWidget } from '../../types/widget.types';
import ErrorBoundary from '../ui/ErrorBoundary';
import { useI18n } from '../../i18n/context';
import ValueCard from './ValueCard';
import GaugeWidget from './GaugeWidget';
import LineChartWidget from './LineChartWidget';
import ColorPreviewWidget from './ColorPreviewWidget';
import StatusBadgeWidget from './StatusBadgeWidget';

interface Props {
  widget: GridWidget;
  deviceId: string;
  isEditMode: boolean;
  onRemove: (id: string) => void;
}

function WidgetInner({ widget, deviceId, isEditMode, onRemove }: Props) {
  const common = { deviceId, isEditMode, onRemove: () => onRemove(widget.i) };

  switch (widget.type) {
    case 'value-card':
      return <ValueCard {...common} sensorType={widget.sensorType} config={widget.config as never} />;
    case 'gauge':
      return <GaugeWidget {...common} sensorType={widget.sensorType} config={widget.config as never} />;
    case 'line-chart':
      return <LineChartWidget {...common} sensorType={widget.sensorType} config={widget.config as never} />;
    case 'color-preview':
      return <ColorPreviewWidget {...common} />;
    case 'status-badge':
      return <StatusBadgeWidget {...common} />;
    default:
      return null;
  }
}

export default function WidgetFactory(props: Props) {
  const { t } = useI18n();
  return (
    <ErrorBoundary
      inline
      label={`${props.widget.type.toUpperCase()} ${t.widgets.error}`}
      strings={{ title: t.error.title, tryAgain: t.error.tryAgain, retry: t.error.retry }}
    >
      <WidgetInner {...props} />
    </ErrorBoundary>
  );
}
