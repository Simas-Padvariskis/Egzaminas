import React, { useEffect }  from 'react';
import { Link } from 'react-router-dom';
import demoImg from '../assets/images/movieBackground.jpg';
import { useLoading } from '../context/LoadingContext';

function Home() {
  const { setLoading } = useLoading();

  useEffect(() => {
    setLoading(true);
    const fetchData = () => {
      setTimeout(() => {
        setLoading(false);
      }, 200); // 0.2 sekundžių uždelsimas testas
    };
  
    fetchData();
  }, [setLoading]);

  return (
    <main>
      {/* Hero sekcija */}
      <div className="home-container">
        <div className="bg-light text-center py-5">
          <h1 className="display-5 fw-bold text-dark mb-3">Sveiki atvykę į Movie Application</h1>
          <p className="lead text-secondary mb-3">Patogi filmų apžvalga</p>
          <Link to="/register" className="btn btn-primary btn-lg">Registruotis</Link>
        </div>

        {/* Pagrindinis turinys */}
        <div className="container my-5">
          <div className="row align-items-center">
            <div className="col-md-6 text-center mb-3 mb-md-0">
              <img src={demoImg} className="img-fluid rounded shadow custom-img demoImg" alt="competitions" />
            </div>
            <div className="col-md-6">
              <h2 className="mb-2">Kaip tai veikia?</h2>
              <p className="mb-4">Naudodami Movie Application, galite pridėti ir įvertinti filmus, komentuoti, peržiūrėti atsiliepimus.</p>

              {/* Modernizuotas sąrašas */}
              <div className="d-flex flex-column gap-3">
                <div className="d-flex align-items-center p-3 border rounded shadow-sm bg-white">
                  <span className="text-success fs-4 me-2">✔️</span>
                  <span>Sukurkite filmą</span>
                </div>
                <div className="d-flex align-items-center p-3 border rounded shadow-sm bg-white">
                  <span className="text-success fs-4 me-2">✔️</span>
                  <span>Valdykite filmų duomenis</span>
                </div>
                <div className="d-flex align-items-center p-3 border rounded shadow-sm bg-white">
                  <span className="text-success fs-4 me-2">✔️</span>
                  <span>Peržiūrėkite visu filmų duomenis</span>
                </div>
                <div>
                  <Link to="/movies" className="btn btn-outline-primary mt-3">Jūsų filmai</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Home;