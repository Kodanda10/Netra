import React from 'react';
import { useParams, Navigate } from 'react-router-dom';

const Fdi: React.FC = () => {
  const { lang } = useParams<{ lang: 'hi' | 'en' }>();
  if (!lang || (lang !== 'hi' && lang !== 'en')) return <Navigate to="/hi/fdi" replace />;

  return (
    <div style={{ color: 'white' }}>
      <h1>FDI Page</h1>
      <p>This is the FDI page in {lang}.</p>
      <p>Foreign Direct Investment data will be displayed here.</p>
    </div>
  );
};

export default Fdi;