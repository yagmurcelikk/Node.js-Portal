import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const Iletisim = () => {
    const [mesajDisabled, setMesajDisabled] = useState(true);

    const [mesaj, setMesaj] = useState('');
    const [ad, setAd] = useState('');
    const [email, setEmail] = useState('');

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const navigate = useNavigate();

    const id = sessionStorage.getItem('id');

    const igonder = async (e) => {

        e.preventDefault();

        try {

            const response = await axios.post("http://localhost:3001/portal/soruGonder", {
                id,
                ad,
                email,
                mesaj
            }
            );

            if (response.status === 200) {
                setMesaj('');
                setAd('');
                setEmail('');
                setError('');
                alert("Mesajınız gönderildi")
                setTimeout(() => navigate('/portal'), 2000);

            } else {
                setError(response.data.error);
            }

        } catch (err) {
            console.log(err);
            setError("Veritabani baglantisinda hata olustu. ", err);
        }

    };

    const addegistiginde = () => {
        setMesajDisabled(!document.getElementById('email').value); //email'de deger yoksa
    };

    const emaildegistiginde = () => {
        setMesajDisabled(!document.getElementById('ad').value);
    };

    return (
        <>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-4"></div>
                    <div className="col-4">
                        <form id="iletisim" onSubmit={igonder}>
                            <div className="row justify-content-center">
                                <div className="col-auto py-2">
                                    <h4>Bizimle İletişime Geçin</h4>
                                </div>
                            </div>

                            <div className="row justify-content-center py-3">
                                <div className="col-6 form-group">
                                    <label htmlFor="ad">Ad Soyad:</label>
                                    <input type="text" className="form-control" value={ad} id="ad" onChange={(e) => setAd(e.target.value)} onClick={addegistiginde} required />
                                </div>
                                <div className="col-6 form-group">
                                    <label htmlFor="email">E-Posta:</label>
                                    <input type="email" className="form-control" value={email} id="email" onChange={(e) => setEmail(e.target.value)} onClick={emaildegistiginde} required />
                                </div>
                            </div>
                            <div className="row justify-content-center py-3">
                                <div className="form-group">
                                    <label htmlFor="mesaj">Mesaj:</label>
                                    <input className="form-control" id="mesaj" value={mesaj} onChange={(e) => setMesaj(e.target.value)} placeholder="Mesajınızı girin." disabled={mesajDisabled} />
                                </div>
                            </div>
                            <button type="submit" className="w-auto btn btn-sm btn-outline-dark">Gönder</button>

                            <div className="row justify-content-center py-3">
                                <div className="form-group">
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="col-4 py-5">
                        {error && <p style={{ color: 'red' }}> {error} </p>}
                        {success && <p style={{ color: 'green' }}> {success} </p>}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Iletisim;
