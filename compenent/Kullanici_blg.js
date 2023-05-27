import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Kullanici_blg = () => {
    const [showEmailGuncelle, setShowEmailGuncelle] = useState(false);
    const [showKullaniciGuncelle, setShowKullaniciGuncelle] = useState(false);
    const [showSifreGuncelle, setShowSifreGuncelle] = useState(false);

    const [kullanici_adi, setKullanici_adi] = useState('');
    const [email, setEmail] = useState('');
    const [sifre, setSifre] = useState('');
    const [resifre, setReSifre] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const emailInput = () => {
        setShowEmailGuncelle(!showEmailGuncelle); // Eğer showEmailGuncelle değişkeni true ise emailGuncelle div'i görünür, false ise emailGuncelle div'i gizlenir.
    };

    const kullaniciAdInput = () => {
        setShowKullaniciGuncelle(!showKullaniciGuncelle);
    };

    const SifreInput = () => {
        setShowSifreGuncelle(!showSifreGuncelle);
    };

    //GÜNCELLEME
    const kullaniciad_gnclle = async (event) => {
        event.preventDefault();
        const id = sessionStorage.getItem("id");
        try {

            const response = await axios.post('http://localhost:3001/portal/kullanici_gncl_kullaniciadi', {
                id,
                kullanici_adi,

            });

            if (response.status == 200) {
                alert("Güncelleme başarılı.")
                setKullanici_adi('');
                setError('');
                window.location.reload();


            }
            else if (response.status == 203) {
                setSuccess("")
                setKullanici_adi('');
                setError("Bilgiler aynı olamaz.");

            }
            else {
                setError("Güncelleme yaparken hata olustu")
            }


        } catch (err) {
            console.log(err.message);
            setError("Güncelleme yaparken  bir hata oluştu.")

        }
    };

    const email_gunclle = async (event) => {
        event.preventDefault();
        const id = sessionStorage.getItem("id");
        try {

            const response = await axios.post('http://localhost:3001/portal/kullanici_gncl_email', {
                id,
                email,

            });

            if (response.status == 200) {
                alert("Güncelleme başarılı.")
                setEmail('');
                setError('');
                

            }
            else {
                setError("Güncelleme yaparken hata oluştu.")
            }

        } catch (err) {
            console.log(err.message);
            setError("Güncelleme yaparken  bir hata oluştu.")

        }


    };

    const sifre_gunclle = async (event) => {
        event.preventDefault();
        const id = sessionStorage.getItem("id");
        try {

            const response = await axios.post('http://localhost:3001/portal/kullanici_gncl_sifre', {
                id,
                sifre,
                resifre
            });

            if (response.status == 200) {
                alert("Güncelleme başarılı")
                setSifre('');
                setReSifre('');
                setError('');
            }

            else {
                setError("Güncelleme yaparken hata oluştu.")
            }


        } catch (err) {
            console.log(err.message);
            setError("Güncelleme yaparken  bir hata oluştu.")

        }


    };


    return (
        <>
            <div className="container" style={{ marginBottom: '20px', marginTop: '20px', marginLeft: '500px' }}>
                <div className='row justify-content-center'>

                    <div className='col' style={{ alignItems: 'center', alignSelf: 'center', fontSize: "20px", fontFamily: "'Times New Roman', Times, serif" }}>

                        <div className="row justify-content-center"> {/*KULLANICIADI GUNCELLE */}
                            <div className="row py-3">
                                <div className="col-4">
                                    <span>
                                        <i>Kullanıcı adınızı güncellemek için{" "}
                                            <a href="#" onClick={kullaniciAdInput}>
                                                tıklayın
                                            </a></i>
                                    </span>
                                </div>
                            </div>
                            {showKullaniciGuncelle && (
                                <form onSubmit={kullaniciad_gnclle}>
                                    <div className="row py-2">
                                        <div className='col-8'>
                                            <div className='row'>
                                                <div className="col-4">
                                                    <input type="text" className="form-control" value={kullanici_adi} onChange={(e) => setKullanici_adi(e.target.value)} id="kullanici_adi" name="kullanici_adi" />
                                                </div>
                                                <div className="col-2">
                                                    <button type="submit" className="w-100 btn btn-sm btn-outline-dark">
                                                        Güncelle
                                                    </button>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </form>
                            )}
                        </div>

                        <div className="row justify-content-center">{/*EMAIL GUNCELLE */}
                            <div className="row py-3">

                                <div className="col-4">
                                    <span>
                                        <i>Email adresini güncellemek için{" "}
                                            <a href="#" onClick={emailInput}>
                                                tıklayın
                                            </a></i>
                                    </span>
                                </div>
                                {showEmailGuncelle && (
                                    <form onSubmit={email_gunclle}>
                                        <div className="row py-2">
                                            <div className='col-8'>
                                                <div className='row'>
                                                    <div className="col-4">
                                                        <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} id="email" name="email" placeholder="name@example.com" />
                                                    </div>
                                                    <div className="col-2">
                                                        <button type="submit" className="w-100 btn btn-sm btn-outline-dark">
                                                            Güncelle
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                )}
                            </div>

                        </div>

                        <div className="row justify-content-center"> {/*SIFRE GUNCELLE */}
                            <div className="row py-3">
                                <div className="col-4">
                                    <span>
                                        <i> Şifrenizi güncellemek için{" "}
                                            <a href="#" onClick={SifreInput}>
                                                tıklayın
                                            </a></i>
                                    </span>
                                </div>
                            </div>
                            {showSifreGuncelle && (
                                <form onSubmit={sifre_gunclle}>
                                    <div className="row py-2">
                                        <div className='col-8'>
                                            <div className='row'>
                                                <div className="col-3">
                                                    <input type="password" className="form-control" value={sifre} onChange={(e) => setSifre(e.target.value)} id="sifre" name="sifre" placeholder="Şifrenizi Giriniz" />
                                                </div>
                                                <div className="col-3">
                                                    <input type="password" className="form-control" value={resifre} onChange={(e) => setReSifre(e.target.value)} id="resifre" name="resifre" placeholder="Tekrar Şifrenizi Giriniz" />
                                                </div>
                                                <div className="col-2">
                                                    <button type="submt" className="w-100 btn btn-sm btn-outline-dark">
                                                        Güncelle
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            )}
                        </div>

                    </div>
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {success && <p style={{ color: 'green' }}>{success}</p>}
                <p></p>
            </div>

        </>
    );
};

export default Kullanici_blg;
