import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import './services/firebase/config';

import Routes from './pages';
import 'bootstrap/dist/css/bootstrap.min.css';

const App: React.FC<{}> = () => (
  <Router>
    <Routes />
  </Router>
);

export default App;
