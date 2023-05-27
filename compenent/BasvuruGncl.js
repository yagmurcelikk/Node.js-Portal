import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const BasvuruGncl = () => {

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [values, setValues] = useState({
        isim: "",
        soyisim: "",
        kimlik_no: "",
        cinsiyet: "",
        dogum_tarihi: "",
        uyruk: "",
        ikinci_uyruk: "",
        engel_aciklamasi: "",
        telefon: "",
        email_iletisim: "",
        adres: "",
        sehir: "",
        ulke: "",
        universite: "",
        mezun_bolum: "",
        mezun_tarih: "",
        gpa: "",
    });

    const id = sessionStorage.getItem('id');

    const navigate = useNavigate();

    const [formattedDogumTarihi, setFormattedDogumTarihi] = useState('');
    const [formattedMezunTarihi, setFormattedMezunTarihi] = useState('');

    useEffect(() => {
        const bilgiGetir = async () => {
            const id = sessionStorage.getItem("id");
            try {
                const response = await axios.post("http://localhost:3001/portal/bilgiGetir",
                    {
                        id,

                    }
                );

                if (response.status === 200) {
                    setValues(response.data);
                    const formattedDogumTarihi = response.data.dogum_tarihi ? new Date(response.data.dogum_tarihi).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '';
                    setFormattedDogumTarihi(formattedDogumTarihi);
                    const formattedMezunTarihi = response.data.mezun_tarih ? new Date(response.data.mezun_tarih).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '';
                    setFormattedMezunTarihi(formattedMezunTarihi);

                }

            } catch (err) {
                setError("Kullanici bilgileri gosterilemedi.");
            }
        }
        bilgiGetir();

    }, []);


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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues((prevValues) => ({ ...prevValues, [name]: value }));
    };


    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post("http://localhost:3001/portal/basvuru_gncl",
                {
                    id,
                    ...values

                }
            );
            if (response.status === 200) {
                alert("Bilgiler güncellendi.");

                navigate('/portal');




            }
        } catch (err) {
            setError("Bilgiler güncellenirken bir hata oluştu.");
        }
    }


    return (
        <>
            <div className="container" style={{ marginBottom: '20px', marginTop: '20px' }}>


                <div className="row">
                    <div className="col-12 my-3 ">
                        <h3 className="text-center">Başvuru Formu</h3>
                    </div>
                </div>

                <form id="basvuru_formu" onSubmit={handleSubmit}>
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
                                    <input type="text" id="isiminput" name="isim" value={values.isim} onChange={handleChange} className="form-control form-control-sm" required />{values.isim}
                                    <div className="valid-feedback"></div>
                                </div>
                                <div className="col-6 form-group">
                                    <label for="soyisim" className="col-form-label">Soyisim:</label>
                                    <input type="text" id="soyisiminput" name="soyisim" value={values.soyisim} onChange={handleChange} className="form-control form-control-sm" required />
                                    <div className="valid-feedback"></div>
                                </div>
                            </div>

                            <div className="row justify-content-center">{/*TC/DTARİH*/}
                                <div className="col-6 form-group">
                                    <label for="tc" class="col-form-label">T.C. Kimlik / Pasaport No:</label>
                                    <input type="text" id="tcinput" name="kimlik_no" value={values.kimlik_no} onChange={handleChange} className="form-control form-control-sm" required />
                                    <div className="valid-feedback"></div>
                                </div>
                                <div className="col-6 form-group">
                                    <label for="dtarih" className="col-form-label ">Doğum Tarihi:</label>
                                    <input type="date" id="dtarihinput" name="dogum_tarihi" value={values.formattedDogumTarihi} onChange={handleChange} className="form-control form-control-sm" required />
                                    <b><i><span style={{ fontSize: '11px' }}>Kayıtlı doğum tarihiniz: {formattedDogumTarihi}</span></i></b>
                                    <div className="valid-feedback"></div>
                                </div>
                            </div>

                            <div className="row justify-content-center">{/*CİNSİYET/UYRUK*/}
                                <div className="col-6 form-group">
                                    <label for="cinsiyet" className="col-form-label">Cinsiyet:</label>
                                    <input type="text" id="cinsiyetinput" name="cinsiyet" value={values.cinsiyet} onChange={handleChange} className="form-control form-control-sm"
                                        required />
                                    <div className="valid-feedback"></div>
                                </div>
                                <div className="col-6 form-group">
                                    <label for="uyruk" className="col-form-label">Uyruk:</label>
                                    <input type="text" id="uyrukinput" name="uyruk" value={values.uyruk} onChange={handleChange} className="form-control form-control-sm" required />
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

                                        <input type="text" id="uaciklama" name="ikinci_uyruk" value={values.ikinci_uyruk} onChange={handleChange} placeholder="Var ise nedir?"
                                            className="form-control form-control-sm" required disabled />
                                        <div className="valid-feedback"></div>

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

                                        <input type="text" id="aciklama" name="engel_aciklamasi" value={values.engel_aciklamasi} onChange={handleChange} placeholder="Var ise nedir?Açıklayınız."
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
                                    <h3>İletişim valuesleri</h3>
                                </div>
                            </div>

                            <div className="row justify-content-center">{/*TELEFON*/}
                                <div className="col-6 form-group">
                                    <label for="telefon" className="col-form-label">Telefon:</label>
                                    <input type="number" id="telefoninput" name="telefon" value={values.telefon} onChange={handleChange} className="form-control form-control-sm"
                                        required />
                                    <div className="valid-feedback"></div>
                                </div>
                            </div>
                            <div className="row justify-content-center">{/*EMAİL*/}
                                <div className="col-6 form-group">
                                    <label for="mail" className="col-form-label">E-mail:</label>
                                    <input type="email" id="emailinput" name="email_iletisim" value={values.email_iletisim} onChange={handleChange} className="form-control form-control-sm" required />
                                    <div className="valid-feedback"></div>
                                </div>
                            </div>

                            <div className="row justify-content-center">{/*ADRES*/}
                                <div className="col-6 form-group">
                                    <label for="adres" className="col-form-label">Adres:</label>
                                    <textarea id="adresinput" name="adres" value={values.adres} onChange={handleChange} rows="1" className="form-control form-control-sm"
                                        placeholder="Cadde,Sokak,Apt..." required></textarea>
                                    <div className="valid-feedback"></div>
                                </div>
                            </div>
                            <div className="row justify-content-center">{/*SEHİR*/}
                                <div className="col-6 form-group">
                                    <label for="sehir" className="col-form-label">Şehir:</label>
                                    <input type="text" id="sehirinput" name="sehir" value={values.sehir} onChange={handleChange} className="form-control form-control-sm" required />
                                    <div class="valid-feedback"></div>
                                </div>
                            </div>
                            <div className="row justify-content-center">{/*Ulke*/}
                                <div className="col-6 form-group">
                                    <label for="ulke" className="col-form-label">Ülke:</label>
                                    <input type="text" id="ulkeinput" name="ulke" value={values.ulke} onChange={handleChange} className="form-control form-control-sm" required />
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
                                    <select className="form-select form-select-m mb-3" aria-label="select example" id="mduruminput" name="mezun_durum" value={values.mezun_durum} onChange={handleChange}
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
                                    <input type="text" id="uniinput" name="universite" value={values.universite} onChange={handleChange} className="form-control form-control-sm" required />
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
                                    <input type="text" id="boluminput" name="mezun_bolum" value={values.mezun_bolum} onChange={handleChange} class="form-control form-control-sm" required />
                                    <div className="valid-feedback"></div>
                                </div>
                                <div className="col-6 form-group px-4">
                                    <label for="inputName" className="col-form-label ">Mezuniyet Tarihi:</label>
                                    <input type="date" id="mezun_tarih" name="mezun_tarih" value={values.formattedMezunTarihi} onChange={handleChange} className="form-control form-control-sm" required />
                                    <b><i><span style={{ fontSize: '11px' }}>Kayıtlı mezun tarihiniz: {formattedMezunTarihi}</span></i></b>
                                    <div className="valid-feedback"></div>
                                </div>
                            </div>

                            <div className="row justify-content-center"> {/*GPA*/}
                                <div className="col-6 form-group px-4">
                                    <label for="inputName" className="col-form-label">GPA:</label>
                                    <input type="number" step="0.05" id="gpainput" name="gpa" value={values.gpa} onChange={handleChange} className="form-control form-control-sm"
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
export default BasvuruGncl;