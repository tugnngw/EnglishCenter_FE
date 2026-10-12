/**
 * App.tsx — Root của ứng dụng PrepMaster AI.
 * -----------------------------------------------------------
 * Khởi tạo BrowserRouter và mount AppRoutes.
 */

import React from 'react';
import AppRoutes from '@/routes/AppRoutes';

const App: React.FC = () => {
  return <AppRoutes />;
};

export default App;
