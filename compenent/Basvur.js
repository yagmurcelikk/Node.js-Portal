import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const Basvur = () => {

    const [isiminput, setIsimInput] = useState('');
    const [soyisiminput, setSoyIsiminput] = useState('');
    const [tcinput, setTcinput] = useState('');
    const [dtarihinput, setDtarihInput] = useState('');
    const [cinsiyetinput, setCinsiyetinput] = useState('');
    const [uyrukinput, setUyrukinput] = useState('');
    const [uaciklama, setUaciklama] = useState('');
    const [aciklama, setAciklama] = useState('');
    const [telefoninput, setTelefoninput] = useState('');
    const [emailinput, setEmailinput] = useState('');
    const [adresinput, setAdresinput] = useState('');
    const [sehirinput, setSehirinput] = useState('');
    const [ulkeinput, setUlkeinput] = useState('');
    const [mduruminput, setMduruminput] = useState('');
    const [uniinput, setUniinput] = useState('');
    const [boluminput, setBoluminput] = useState('');
    const [mtarihinput, setMtarihinput] = useState('');
    const [gpainput, setGpainput] = useState('');

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const id = sessionStorage.getItem('id');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const response = await axios.post("http://localhost:3001/portal/formGonder", {
                id,
                isiminput,
                soyisiminput,
                tcinput,
                dtarihinput,
                cinsiyetinput,
                uyrukinput,
                uaciklama,
                aciklama,
                telefoninput,
                emailinput,
                adresinput,
                sehirinput,
                ulkeinput,
                mduruminput,
                uniinput,
                boluminput,
                mtarihinput,
                gpainput
            }
            );
            console.log(response);

            if (response.status === 200) {
                alert("Başvuru başarılı şekilde alındı.");
                sessionStorage.setItem("basvuru_no", response.data.id);
                setIsimInput('');
                setSoyIsiminput('');
                setTcinput('');
                setDtarihInput('');
                setCinsiyetinput('');
                setUyrukinput('');
                setUaciklama('');
                setAciklama('');
                setTelefoninput('');
                setEmailinput('');
                setAdresinput('');
                setSehirinput('');
                setUlkeinput('');
                setMduruminput('');
                setUniinput('');
                setBoluminput('');
                setMtarihinput('');
                setGpainput('');
                setError('');
                setTimeout(() => {
                    navigate('/portal');
                    window.location.reload();
                }, 1000);

            } else {
                setError(response.data.error);
            }


        } catch (err) {
            console.log(err);
            setError("Veritabanı bağlantısında hata oluştu. ", err);
        }
    }


    //ENGEL VE UYRUK ACIKLAMASI
    const [ikinciUyruk, setIkinciUyruk] = useState(false);
    const [engelDurumu, setEngelDurumu] = useState(false);
    useEffect(() => {
        const uaciklamaInput = document.getElementById("uaciklama");
        const aciklamaInput = document.getElementById("aciklama");

        if (ikinciUyruk) {
            uaciklamaInput.disabled = false;
        } else {
            uaciklamaInput.disabled = true;
        }

        if (engelDurumu) {
            aciklamaInput.disabled = false;
        } else {
            aciklamaInput.disabled = true;
        }
    }, [ikinciUyruk, engelDurumu]);

    return (
        <>
            <div className="container" style={{ marginBottom: '20px', marginTop: '20px' }}>


                <div className="row">
                    <div className="col-12 my-3 ">
                        <h3 className="text-center">Başvuru Formu</h3>
                    </div>
                </div>

                <form id="basvuru_formu" onSubmit={handleSubmit} >
                    <div className="row justify-content-center">

                        <div className="col-4" style={{ borderRight: "2px solid red" }}>
                            <div className="row justify-content-center">
                                <div className="col-12 py-2">
                                </div>
                            </div>
                            <div className="row justify-content-center">
                                <div className="col-6 py-2">
                                    <h3>Kişisel Bilgiler</h3>
                                </div>
                            </div>

                            <div className="row justify-content-center">{/*İSİM/SOYİSİM*/}
                                <div className="col-6 form-group">
                                    <label for="isim" className="col-form-label">İsim:</label>
                                    <input type="text" id="isiminput" name="isiminput" value={isiminput} onChange={(e) => setIsimInput(e.target.value)} className="form-control form-control-sm" required />
                                    <div className="valid-feedback"></div>
                                </div>
                                <div className="col-6 form-group">
                                    <label for="soyisim" className="col-form-label">Soyisim:</label>
                                    <input type="text" id="soyisiminput" name="soyisiminput" value={soyisiminput} onChange={(e) => setSoyIsiminput(e.target.value)} className="form-control form-control-sm" required />
                                    <div className="valid-feedback"></div>
                                </div>
                            </div>

                            <div className="row justify-content-center">{/*TC/DTARİH*/}
                                <div className="col-6 form-group">
                                    <label for="tc" class="col-form-label">T.C. Kimlik / Pasaport No:</label>
                                    <input type="text" id="tcinput" name="tcinput" value={tcinput} onChange={(e) => setTcinput(e.target.value)} className="form-control form-control-sm" required />
                                    <div className="valid-feedback"></div>
                                </div>
                                <div className="col-6 form-group">
                                    <label for="dtarih" className="col-form-label ">Doğum Tarihi:</label>
                                    <input type="date" id="dtarihinput" name="dtarihinput" value={dtarihinput} onChange={(e) => setDtarihInput(e.target.value)} className="form-control form-control-sm" required />
                                    <div className="valid-feedback"></div>
                                </div>
                            </div>

                            <div className="row justify-content-center">{/*CİNSİYET/UYRUK*/}
                                <div className="col-6 form-group">
                                    <label for="cinsiyet" className="col-form-label">Cinsiyet:</label>
                                    <input type="text" id="cinsiyetinput" name="cinsiyetinput" value={cinsiyetinput} onChange={(e) => setCinsiyetinput(e.target.value)} className="form-control form-control-sm"
                                        required />
                                    <div className="valid-feedback"></div>
                                </div>
                                <div className="col-6 form-group">
                                    <label for="uyruk" className="col-form-label">Uyruk:</label>
                                    <input type="text" id="uyrukinput" name="uyrukinput" value={uyrukinput} onChange={(e) => setUyrukinput(e.target.value)} className="form-control form-control-sm" required />
                                    <div className="valid-feedback"></div>
                                </div>
                            </div>

                            <div className="row justify-content-center">{/*2.uyruk*/}

                                <div className="row">
                                    <div className="col-auto py-3">
                                        <span>İkinci bir uyruğunuz var mı?</span>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-3 py-3 form-check form-group">

                                        <input type="radio" class="form-check-input" id="uvar" name="ikinciuyruk"
                                            onChange={() => setIkinciUyruk(true)} required />
                                        <label className="form-check-label" for="validationFormCheck2">var</label>

                                    </div>

                                    <div className="col-3 py-3 form-check mb-3 form-group">
                                        <input type="radio" className="form-check-input" id="uyok" name="ikinciuyruk"
                                            onChange={() => setIkinciUyruk(false)} required />
                                        <label className="form-check-label" for="validationFormCheck3">yok</label>
                                        <div className="invalid-feedback"></div>

                                    </div>

                                    <div className="col-6 form-group">
                                        <label for="uaciklama" className="col-form-label">Açıklama:</label>

                                        <input type="text" id="uaciklama" name="uaciklama" value={uaciklama} onChange={(e) => setUaciklama(e.target.value)} placeholder="Var ise nedir?"
                                            className="form-control form-control-sm" required disabled />
                                        <div className="valid-feedback"></div>

                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-auto">
                                        <i><p id="uyruksecim"></p></i>
                                    </div>
                                </div>

                            </div>


                            <div className="row justify-content-center">{/*ENGEL/AÇIKLAMA*/}

                                <div className="row">
                                    <div className="col-auto py-md-3">
                                        <span>Engel Durumu:</span>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-3 py-3 form-check form-group">

                                        <input type="radio" className="form-check-input" id="evar" name="engel" onChange={() => setEngelDurumu(true)}
                                            required />
                                        <label className="form-check-label" for="validationFormCheck2">var</label>

                                    </div>

                                    <div className="col-3 py-3 form-check mb-3 form-group">
                                        <input type="radio" class="form-check-input" id="eyok" name="engel"
                                            onChange={() => setEngelDurumu(false)} required />
                                        <label className="form-check-label" for="validationFormCheck3">yok</label>
                                        <div className="invalid-feedback"></div>
                                    </div>

                                    <div class="col-6 form-group">
                                        <label for="aciklama" class="col-form-label">Açıklama:</label>

                                        <input type="text" id="aciklama" name="aciklama" value={aciklama} onChange={(e) => setAciklama(e.target.value)} placeholder="Var ise nedir?Açıklayınız."
                                            class="form-control form-control-sm" required disabled />
                                        <div class="valid-feedback"></div>

                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-auto">
                                        <i><p id="engelsecim"></p></i>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-4" style={{ borderRight: "2px solid red" }}>

                            <div className="row justify-content-center b">
                                <div className="col-12 py-2">
                                </div>
                            </div>

                            <div className="row justify-content-center ">
                                <div className="col py-2" style={{ paddingLeft: "120px" }}>
                                    <h3>İletişim Bilgileri</h3>
                                </div>
                            </div>

                            <div className="row justify-content-center">{/*TELEFON*/}
                                <div className="col-6 form-group">
                                    <label for="telefon" className="col-form-label">Telefon:</label>
                                    <input type="number" id="telefoninput" name="telefoninput" value={telefoninput} onChange={(e) => setTelefoninput(e.target.value)} className="form-control form-control-sm"
                                        required />
                                    <div className="valid-feedback"></div>
                                </div>
                            </div>
                            <div className="row justify-content-center">{/*EMAİL*/}
                                <div className="col-6 form-group">
                                    <label for="mail" className="col-form-label">E-mail:</label>
                                    <input type="email" id="emailinput" name="emailinput" value={emailinput} onChange={(e) => setEmailinput(e.target.value)} className="form-control form-control-sm" required />
                                    <div className="valid-feedback"></div>
                                </div>
                            </div>




                            <div className="row justify-content-center">{/*ADRES*/}
                                <div className="col-6 form-group">
                                    <label for="adres" className="col-form-label">Adres:</label>
                                    <textarea id="adresinput" name="adresinput" value={adresinput} onChange={(e) => setAdresinput(e.target.value)} rows="1" className="form-control form-control-sm"
                                        placeholder="Cadde,Sokak,Apt..." required></textarea>
                                    <div className="valid-feedback"></div>
                                </div>
                            </div>
                            <div className="row justify-content-center">{/*SEHİR*/}
                                <div className="col-6 form-group">
                                    <label for="sehir" className="col-form-label">Şehir:</label>
                                    <input type="text" id="sehirinput" name="sehirinput" value={sehirinput} onChange={(e) => setSehirinput(e.target.value)} className="form-control form-control-sm" required />
                                    <div class="valid-feedback"></div>
                                </div>
                            </div>
                            <div className="row justify-content-center">{/*Ulke*/}
                                <div className="col-6 form-group">
                                    <label for="ulke" className="col-form-label">Ülke:</label>
                                    <input type="text" id="ulkeinput" name="ulkeinput" value={ulkeinput} onChange={(e) => setUlkeinput(e.target.value)} className="form-control form-control-sm" required />
                                    <div className="valid-feedback"></div>
                                </div>
                            </div>

                        </div>

                        <div className="col-4">
                            <div className="row justify-content-center">
                                <div className="col-12 py-2">
                                </div>
                            </div>

                            <div className="row justify-content-center">
                                <div className="col-6 py-2">
                                    <h3>Eğitim Bilgileri</h3>
                                </div>
                            </div>

                            <div className="row justify-content-center">{/*MDURUM/ÜNİ*/}
                                <div className="col-6 form-group px-4">
                                    <label for="mdurum" className="col-form-label">Mezuniyet Durumu:</label>
                                    <select className="form-select form-select-m mb-3" aria-label="select example" id="mduruminput" name="mduruminput" value={mduruminput} onChange={(e) => setMduruminput(e.target.value)}
                                        required>
                                        <option value="">Seç</option>
                                        <option value="1">Lisans</option>
                                        <option value="2">Yükseklisans</option>
                                        <option value="3">Doktora</option>

                                    </select>
                                    <div className="valid-feedback"></div>

                                </div>

                                <div className="col-6 form-group px-4">
                                    <label for="uni" className="col-form-label">Üniversite:</label>
                                    <input type="text" id="uniinput" name="uniinput" value={uniinput} onChange={(e) => setUniinput(e.target.value)} className="form-control form-control-sm" required />
                                    <div className="valid-feedback"></div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-auto px-4">
                                    <i><p id="mezuniyetsecim"></p></i>
                                </div>
                            </div>

                            <div className="row justify-content-center"> {/*BÖLÜM*/}
                                <div className="col-6 form-group px-4">
                                    <label for="inputName" className="col-form-label">Bölüm:</label>
                                    <input type="text" id="boluminput" name="boluminput" value={boluminput} onChange={(e) => setBoluminput(e.target.value)} class="form-control form-control-sm" required />
                                    <div className="valid-feedback"></div>
                                </div>
                                <div className="col-6 form-group px-4">
                                    <label for="inputName" className="col-form-label ">Mezuniyet Tarihi:</label>
                                    <input type="date" id="mtarihinput" name="mtarihinput" value={mtarihinput} onChange={(e) => setMtarihinput(e.target.value)} className="form-control form-control-sm" required />
                                    <span><i style={{ fontSize: "smaller;" }}>Devam ediyor ise tahmini mezuniyet tarihinizi
                                        giriniz.</i></span>
                                    <div className="valid-feedback"></div>
                                </div>
                            </div>

                            <div className="row justify-content-center"> {/*GPA*/}
                                <div className="col-6 form-group px-4">
                                    <label for="inputName" className="col-form-label">GPA:</label>
                                    <input type="number" step="0.05" id="gpainput" name="gpainput" value={gpainput} onChange={(e) => setGpainput(e.target.value)} className="form-control form-control-sm"
                                        required />
                                    <div className="valid-feedback"></div>
                                </div>
                            </div>



                            <div className="row justify-content-center py-5" style={{ alignSelf: "center;" }}>
                                <div className="col-6 px-4">
                                    <button type="submit" className="w-100 btn btn-sm btn-outline-dark">Gönder</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form >
                {error && <p style={{ color: 'red' }}> {error} </p>}
                {success && <p style={{ color: 'green' }}> {success} </p>}

            </div >

        </>
    );
};
export default Basvur;