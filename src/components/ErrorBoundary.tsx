import React from 'react'

type Props = { children: React.ReactNode }
type State = { hasError: boolean; error?: any }

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error }
  }
  componentDidCatch(error: any, info: any) {
    // eslint-disable-next-line no-console
    console.error('UI crashed:', error, info)
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="mx-auto max-w-3xl p-6 text-white/90">
          <div className="rounded-2xl border border-white/10 bg-black/40 p-6">
            <div className="text-lg font-semibold mb-2">Something went wrong</div>
            <div className="text-white/70 text-sm">The dashboard UI failed to render. A refresh usually fixes it. If the issue persists, we are already capturing logs.</div>
            <button onClick={()=>location.reload()} className="mt-4 px-3 py-2 rounded-lg bg-white/10 border border-white/10">Reload</button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}


