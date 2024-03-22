import React from 'react';
import { Header, Footer } from '../Components/Layout';
import { Home } from '../Pages';
import { Routes,Route } from 'react-router-dom';

function App() {
  return (
    <div>
      <Header />
      <div className='pb-5'>
        <Routes>
          <Route path="/" element={<Home />}> </Route>
        </Routes>

      </div>
      <Home />
      <Footer />
    </div>
  );
}

export default App;
