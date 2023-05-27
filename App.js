import { BrowserRouter as Router, Route, Routes, Link, Outlet, Navigate } from 'react-router-dom';

import Giris from './Giris';
import Kayit from './Kayit';
import Portal from './Portal';
import Header from './compenent/Header';
import Basvur from './compenent/Basvur';
import Dokuman from './compenent/Dokuman';
import Kullanici_blg from './compenent/Kullanici_blg';
import Iletisim from './compenent/Iletisim';
import BasvuruGncl from './compenent/BasvuruGncl';


function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<Giris />} />
          <Route path='/kayit' element={<Kayit />} />

          <Route path='/portal' element={<Header />}>
            <Route path='/portal' element={<Portal />} />
            <Route path='/portal/iletisim' element={<Iletisim />} />
            <Route path='/portal/basvur' element={<Basvur />} />
            <Route path='/portal/basvurgncl' element={<BasvuruGncl/>} />
            <Route path='/portal/dokuman' element={<Dokuman />} />
            <Route path='/portal/Kullanici_blg' element={<Kullanici_blg />} />
          </Route>
          
        </Routes>
      </Router>


    </>

  );
}

export default App;