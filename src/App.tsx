import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import './services/firebase/config';

import Routes from './pages';
import './App.scss';
import 'sweetalert2/src/sweetalert2.scss';

const App: React.FC<{}> = () => (
  <Router>
    <Routes />
  </Router>
);

export default App;
