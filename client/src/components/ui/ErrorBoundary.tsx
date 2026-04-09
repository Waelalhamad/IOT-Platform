import { Component, type ReactNode, type ErrorInfo } from 'react';
import { ExclamationTriangleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

interface Props {
  children: ReactNode;
  /** If true, renders a compact inline card instead of a full-page fallback */
  inline?: boolean;
  label?: string;
  /** Translated strings — injected by parent function component */
  strings?: { title: string; tryAgain: string; retry: string };
}

interface State {
  hasError: boolean;
  message: string;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message ?? 'Unknown error' };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  reset = () => this.setState({ hasError: false, message: '' });

  render() {
    if (!this.state.hasError) return this.props.children;

    const { inline, label, strings } = this.props;
    const s = strings ?? { title: 'Something went wrong', tryAgain: 'TRY AGAIN', retry: 'RETRY' };

    if (inline) {
      return (
        <div
          className="w-full h-full flex flex-col items-center justify-center gap-3 rounded-2xl p-4"
          style={{
            background: 'rgba(239,68,68,0.06)',
            border: '1px solid rgba(239,68,68,0.18)',
          }}
        >
          <ExclamationTriangleIcon className="w-6 h-6 text-red flex-shrink-0" />
          <div className="text-center">
            <p className="text-xs font-mono font-bold text-red mb-0.5">
              {label ?? s.retry}
            </p>
            <p className="text-[10px] font-mono text-lo max-w-[20ch] leading-relaxed">
              {this.state.message}
            </p>
          </div>
          <button
            onClick={this.reset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold text-red transition-colors"
            style={{ background: 'rgba(239,68,68,0.10)', border: '1px solid rgba(239,68,68,0.2)' }}
          >
            <ArrowPathIcon className="w-3 h-3" />
            {s.retry}
          </button>
        </div>
      );
    }

    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-5 p-12 text-center">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center"
          style={{ background: 'rgba(239,68,68,0.10)', border: '1px solid rgba(239,68,68,0.2)' }}
        >
          <ExclamationTriangleIcon className="w-8 h-8 text-red" />
        </div>
        <div>
          <p className="text-sm font-semibold text-hi mb-1">{s.title}</p>
          <p className="text-xs text-lo max-w-[32ch] leading-relaxed">{this.state.message}</p>
        </div>
        <button
          onClick={this.reset}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold text-red transition-colors"
          style={{ background: 'rgba(239,68,68,0.10)', border: '1px solid rgba(239,68,68,0.2)' }}
        >
          <ArrowPathIcon className="w-4 h-4" />
          {s.tryAgain}
        </button>
      </div>
    );
  }
}
