import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Unhandled error in Kantor MMA Production:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: '24px',
          background: 'var(--bg, #ECEFF3)',
          color: 'var(--ink, #13202C)',
          fontFamily: 'Inter, system-ui, sans-serif',
          textAlign: 'center'
        }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>
            Terjadi Kendala Memuat Kantor MMA
          </h2>
          <p style={{ maxWidth: '480px', color: 'var(--ink2, #4B5967)', marginBottom: '20px', lineHeight: 1.5 }}>
            {this.state.error?.message || 'Aplikasi mengalami kesalahan saat inisialisasi.'}
          </p>
          <button
            type="button"
            onClick={this.handleReload}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              background: 'var(--accent, #1D4ED8)',
              color: '#ffffff',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            Muat Ulang Halaman
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
