import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { HashRouter, Routes, Route } from 'react-router-dom'
import PreloaderPreview from './preview/PreloaderPreview'


class ErrorBoundary extends React.Component<React.PropsWithChildren<{}>, { hasError: boolean; message?: string; stack?: string; componentStack?: string }>{
  constructor(props: any){
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError(error: any){
    return { hasError: true, message: String(error?.message || error) }
  }
  componentDidCatch(error: any, info: any){
    // eslint-disable-next-line no-console
    console.error('App error:', error, info)
    this.setState({ stack: String(error?.stack || ''), componentStack: String(info?.componentStack || '') })
  }
  render(){
    if (this.state.hasError){
      return (
        <div style={{ color: '#fff', background:'#121212', minHeight:'100vh', display:'grid', placeItems:'center', padding:24 }}>
          <div style={{ maxWidth: 640 }}>
            <h1 style={{ fontSize: 20, marginBottom: 8 }}>Something went wrong.</h1>
            <div style={{ opacity: .85, fontSize: 14, marginBottom: 12 }}>{this.state.message}</div>
            {this.state.componentStack ? (
              <pre style={{ whiteSpace:'pre-wrap', fontSize: 12, opacity:.75, lineHeight:1.35, background:'#1a1a1a', padding:12, borderRadius:8 }}>
                {this.state.componentStack}
              </pre>
            ) : null}
            {this.state.stack ? (
              <details style={{ marginTop:12 }}>
                <summary style={{ cursor:'pointer' }}>Stack trace</summary>
                <pre style={{ whiteSpace:'pre-wrap', fontSize: 12, opacity:.75, lineHeight:1.35, background:'#1a1a1a', padding:12, borderRadius:8 }}>
                  {this.state.stack}
                </pre>
              </details>
            ) : null}
          </div>
        </div>
      )
    }
    return this.props.children as any
  }
}

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <HashRouter>
        <Routes>
          <Route path="/preloader-preview" element={<PreloaderPreview />} />
          <Route path="/*" element={<App />} />
        </Routes>
      </HashRouter>
    </ErrorBoundary>
  </React.StrictMode>
)