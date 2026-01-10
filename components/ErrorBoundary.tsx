import React, { ErrorInfo, ReactNode } from "react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  public state: State = { hasError: false, error: null };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      const isChunkError = this.state.error?.message?.includes("dynamically imported module") || 
                           this.state.error?.message?.includes("Importing a module script failed") ||
                           this.state.error?.name === "ChunkLoadError";

      return (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0a101f] text-white p-6 text-center">
            <div className="max-w-md w-full bg-black/40 border-2 border-red-500/50 rounded-xl p-8 shadow-2xl backdrop-blur-md">
                <div className="mb-6 text-red-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                
                <h2 className="font-cinzel text-2xl font-bold text-red-100 mb-4 tracking-widest">
                    {isChunkError ? "CONNECTION LOST" : "CRITICAL ERROR"}
                </h2>
                
                <p className="text-gray-300 mb-8 leading-relaxed font-sans text-sm">
                    {isChunkError 
                        ? "새로운 업데이트가 감지되었거나 연결이 끊어졌습니다. 페이지를 새로고침하여 최신 버전을 받아와 주세요." 
                        : "예기치 않은 오류가 발생했습니다. 문제가 지속되면 개발자에게 문의해주세요."}
                </p>
                
                <button
                    onClick={this.handleReload}
                    className="group relative px-8 py-3 bg-red-900/40 hover:bg-red-800/60 border border-red-500/50 rounded-lg transition-all duration-300 w-full"
                >
                    <span className="relative z-10 font-cinzel font-bold text-red-100 tracking-wider">
                        RELOAD PAGE
                    </span>
                    <div className="absolute inset-0 bg-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"></div>
                </button>

                {!isChunkError && this.state.error && (
                    <div className="mt-6 p-3 bg-black/60 rounded border border-red-900/30 text-left overflow-auto max-h-32">
                        <code className="text-[10px] text-red-400 font-mono break-all">
                            {this.state.error.toString()}
                        </code>
                    </div>
                )}
            </div>
        </div>
      );
    }

    return this.props.children;
  }
}