import { Outlet, Link, Form, useNavigate } from "react-router-dom";
import axios from 'axios';
import React, { useState, useEffect } from "react";
import SignOut from "../functions/SignOut";

const still = {
    display: 'inline-block',
    margin: '0 10px'
}

//DOKUMAN BUTONU
export const dokumanbuton = () => {
    const formData = sessionStorage.getItem("basvuru_no");
    const dokumanData = sessionStorage.getItem("dokuman_id");

    const basvur = document.getElementById("basvur");
    const basvur_gncl = document.getElementById("basvur_gncl");
    const dokuman = document.getElementById("dokuman");
    const dokuman_gncl = document.getElementById("dokuman_gncl");

    switch (true) {
        case Boolean(dokumanData):
            dokuman.style.display = "none";
            dokuman_gncl.style.display = "";
            basvur.style.display = "none";
            basvur_gncl.style.display = "block";
            break;
        case Boolean(formData):
            basvur.style.display = "none";
            basvur_gncl.style.display = "block";
            dokuman.style.display = "block";
            dokuman_gncl.style.display = "none";
            break;

        case !Boolean(formData):
            basvur_gncl.style.display = "none";
            dokuman.style.display = "none";
            dokuman_gncl.style.display = "none";
            break;
        default:
            basvur.style.display = "block";
            basvur_gncl.style.display = "none";
            dokuman.style.display = "none";
            break;
    }

};

const Header = () => {
    const [bilgi, setBilgi] = useState('');
    const [error, setError] = useState('');
    const [basvuruDurumu, setBasvuruDurumu] = useState(false);
    
    useEffect(() => {
        const bilgiGetir = async () => {
            const id = sessionStorage.getItem("id");

            try {
                const response = await axios.post("http://localhost:3001/portal/kullaniciadi",
                    { id }
                );

                if (response.status === 200) {
                    setBilgi(response.data);
                }

            } catch (err) {
                setError("Kullanıcı bilgileri gösterilemedi.");
            }
        }

        bilgiGetir();

    }, []);

    useEffect(() => {
        dokumanbuton();
    }, [dokumanbuton]);

    const navigate = useNavigate();

    return (
        <>
            <nav>
                <div className="p-3 text-bg-dark" >
                    <div className="container">
                        <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
                            <ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0 ">
                                <li style={still}>
                                    <Link to="/portal" className="btn btn-outline-secondary">Anasayfa</Link>
                                </li>
                                <li style={still}>
                                    <Link to="/portal/Iletisim" className="btn btn-outline-secondary">İletişim</Link>
                                </li>
                            </ul>

                            <div className="text-end" id="header_sag" style={{ display: 'inline-block', color: 'white', }}>
                                <i> {<span>{bilgi.kullanici_adi}&nbsp;&nbsp;</span>}</i>
                            </div>

                            <div class="dropdown">
                                <a href="#" class="d-flex align-items-center text-white text-decoration-none dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">

                                </a>
                                <ul class="dropdown-menu dropdown-menu-dark text-small shadow">

                                    <li id="basvur">
                                        <Link to="/portal/Basvur" className="dropdown-item">Başvur</Link>
                                    </li>

                                    <li id="basvur_gncl"  >
                                        <Link to="/portal/basvurgncl" className="dropdown-item">Başvuru Güncelle</Link>
                                    </li>

                                    <li id="dokuman">
                                        <Link to="/portal/Dokuman" className="dropdown-item">Dokuman</Link>
                                    </li>

                                    <li id="dokuman_gncl">
                                        <Link to="/portal/Dokuman" className="dropdown-item">Dokuman Güncelle</Link>
                                    </li>

                                    <li><hr class="dropdown-divider bgcolor-white" /></li>

                                    <li id="kullanici_gncl">
                                        <Link to="/portal/Kullanici_blg" className="dropdown-item">Kullanıcı Bilgileri</Link>
                                    </li>

                                    <li><div className="text-end" style={{ display: 'inline-block' }}>
                                        <a class="dropdown-item" href="#" onClick={() => SignOut(navigate)} >Çıkış</a>
                                    </div></li>
                                </ul>
                            </div>

                        </div>

                    </div>
                </div>
            </nav>
            <Outlet />

        </>
    );
}
export default Header;