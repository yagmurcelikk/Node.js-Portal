import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Kayit() {

    const navigate = useNavigate();

    const [kullanici_adi, setKullanici_adi] = useState('');
    const [email, setEmail] = useState('');
    const [sifre, setSifre] = useState('');
    const [resifre, setReSifre] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (sifre != resifre) {
            setError("Şifreler eşleşmiyor");
            return;
        }

        try {
            const response = await axios.post('http://localhost:3001/kayit', {
                kullanici_adi,
                email,
                sifre
            });

            if (response.status == 200) {
                setSuccess("Kayıt Başarılı. Şimdi giriş yapabilirsiniz");
                setKullanici_adi("");
                setEmail("");
                setSifre("");
                setReSifre("");
                setError("");
                setTimeout(() => navigate('/'), 1000);
            }
            else if (response.status == 201) {
                setSuccess("");
                setKullanici_adi("");
                setEmail("");
                setSifre("");
                setReSifre("");
                setError("Bu ad kullanıldı. Lütfen başka bir kullanıcı adı belirleyin.");
            }
            else {
                setError("Kayit olustururken hata olustu");
            }

        } catch (err) {
            console.log(err.message);
            setError("catch Kayit olusturulurken bir hata olustu");
        }
    };

    return (
        <div className="container">
            <div className="row justify-content-center py-5 ">
                <div className="col-4 border border-danger py-2">
                    <form onSubmit={handleSubmit}>
                        <h3 align="center">
                            <i className="fa-sharp fa-solid fa-user-plus">&nbsp;&nbsp;</i>Kayıt Ol
                        </h3>
                        <div className="form-floating py-2">
                            <input type="text" className="form-control" value={kullanici_adi} onChange={(e) => setKullanici_adi(e.target.value)} placeholder="Kullanıcı Adı" />
                            <label htmlFor="floatingInput" style={{ color: 'black' }}>
                                Kullanıcı Adı
                            </label>
                        </div>
                        <div className="form-floating py-2">
                            <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" />
                            <label htmlFor="floatingInput" style={{ color: 'black' }}>
                                Email
                            </label>
                        </div>
                        <div className="form-floating py-2">
                            <input type="password" className="form-control" value={sifre} onChange={(e) => setSifre(e.target.value)} placeholder="Şifrenizi Giriniz" />
                            <label htmlFor="floatingPassword" style={{ color: 'black' }}>
                                Şifre
                            </label>
                        </div>
                        <div className="form-floating py-2">
                            <input type="password" className="form-control" value={resifre} onChange={(e) => setReSifre(e.target.value)} placeholder="Tekrar Şifrenizi Giriniz" />
                            <label htmlFor="floatingPassword" style={{ color: 'black' }}>
                                Şifrenizi tekrar girin
                            </label>
                        </div>
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                        {success && <p style={{ color: 'green' }}>{success}</p>}
                        <p>
                            Hesabınız var mı? <Link to={'/'}>Giriş Yap</Link>
                        </p>
                        <button className="w-100 btn btn-sm btn-outline-dark" type="submit">
                            Kayıt ol
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
export default Kayit;