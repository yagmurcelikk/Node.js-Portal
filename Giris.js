import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Giris() {

    const navigate = useNavigate();
    const [kullanici_adi, setKullanici_adi] = useState('');
    const [email, setEmail] = useState('');
    const [sifre, setSifre] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            const response = await axios.post('http://localhost:3001/',
                {

                    kullanici_adi,
                    email,
                    sifre
                }
            );

            if (response.status === 200) {
                if (response.data.message === "1") {
                    sessionStorage.setItem("id", response.data.id);
                    sessionStorage.setItem("basvuru_no", response.data.bid);
                    sessionStorage.setItem("dokuman_id", response.data.did);
                    setSuccess('Giriş Başarılı. Yönlendiriliyorsunuz...')

                    setTimeout(() => {
                        navigate('/portal');
                    }, 1000);
                } else {
                    setError('Kullanıcı adı veya şifre hatalı,tekrar deneyiniz.');
                }
            }
            else if (response.status === 201) {
                if (response.data.message === "1") {
                    sessionStorage.setItem("id", response.data.id);
                    setSuccess('Giriş Başarılı. Yönlendiriliyorsunuz...')

                    setTimeout(() => {
                        navigate('/portal');
                    }, 1000);
                } else {
                    setError('Kullanıcı adı veya şifre hatalı,tekrar deneyiniz.');
                }
            }else if (response.status === 202) {
                if (response.data.message === "1") {
                    sessionStorage.setItem("id", response.data.id);
                    sessionStorage.setItem("basvuru_no", response.data.bid);
                    setSuccess('Giriş Başarılı. Yönlendiriliyorsunuz...')

                    setTimeout(() => {
                        navigate('/portal');
                    }, 1000);
                } else {
                    setError('Kullanıcı adı veya şifre hatalı,tekrar deneyiniz.');
                }
            }
        } catch (err) {
            setError('Kullanıcı adı veya şifre kontrolünde hata oluştu.');
        }
    }

    return (
        <div className='container'>
            <div className="row justify-content-center py-5 ">

                <div className="col-4 border border-danger py-2">
                    <form onSubmit={handleSubmit}>

                        <h2 align="center"><i className="fa-solid fa-right-to-bracket">&nbsp;&nbsp;</i>Giriş Yap</h2>
                        <div class="form-floating py-2">
                            <input type="text" className="form-control" value={kullanici_adi} onChange={(e) => setKullanici_adi(e.target.value)} id="kullanici_adi" placeholder="Kullanıcı Adı" />
                            <label for="floatingInput" style={{ color: 'black' }}>Kullanıcı Adı</label>
                        </div>
                        <div class="form-floating py-2">
                            <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} id="email" placeholder="name@example.com" />
                            <label for="floatingInput" style={{ color: 'black' }}>Email adresi</label>
                        </div>
                        <div class="form-floating py-2">
                            <input type="password" className="form-control" value={sifre} onChange={(e) => setSifre(e.target.value)} id="sifre" placeholder="Şifrenizi Giriniz" />
                            <label for="floatingPassword" style={{ color: 'black' }}>Şifrenizi Giriniz</label>
                        </div>

                        <p>Hesabınız yok mu?
                            <Link to={'/kayit'}>Kayıt ol</Link>
                        </p>
                        <button className="w-100 btn btn-sm btn-outline-dark" id="giris">Giriş</button>
                    </form>

                    {error && <p style={{ color: 'red' }}> {error} </p>}
                    {success && <p style={{ color: 'green' }}>{success}</p>}
                </div>

            </div>
        </div>
    );

} export default Giris;