import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';



function Dokuman() {

    const [pasaport, setPasaport] = useState('');
    const [cv, setCv] = useState('');
    const [niyetmektubu, setNiyetmektubu] = useState('');
    const [ikametgah, setIkametgah] = useState('');
    const [diploma, setDiploma] = useState('');
    const [dilyeterlilik, setDilyeterlilik] = useState('');
    const [values, setValues] = useState({
        pasaport: "",
        cv: "",
        niyetmektubu: "",
        ikametgah: "",
        dilyeterlilik: "",
        diploma: "",
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const id = sessionStorage.getItem('id');
    const dokuman_id = sessionStorage.getItem('dokuman_id');
    const [tip_id, setTipId] = useState("");

    // FORM GÖNDERME
    const dokuman_form = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:3001/portal/dokumanGonder", {
                id,
                dokuman_id,
                pasaport,
                cv,
                niyetmektubu,
                ikametgah,
                diploma,
                dilyeterlilik
            }
            );
            console.log(response);
            if (response.status === 200) {//dokuman ekler
                sessionStorage.setItem("dokuman_id", response.data.id);
                alert("Dokuman eklendi");
                setCv('');
                setNiyetmektubu('');
                setIkametgah('');
                setDiploma('');
                setDilyeterlilik('');
                setPasaport('');
                setError('');
                window.location.reload();
            }
            else if (response.status === 201) {//dokuman var
                setSuccess("");
                setCv('');
                setNiyetmektubu('');
                setIkametgah('');
                setDiploma('');
                setDilyeterlilik('');
                setPasaport('');
                alert('Dokuman zaten var');
            } else if (response.status === 202) {//dokuman var
                setSuccess("");
                setCv('');
                setNiyetmektubu('');
                setIkametgah('');
                setDiploma('');
                setDilyeterlilik('');
                setPasaport('');
                alert('Dokuman zaten var');
            } else if (response.status === 203) {//dokuman var
                setSuccess("");
                setCv('');
                setNiyetmektubu('');
                setIkametgah('');
                setDiploma('');
                setDilyeterlilik('');
                setPasaport('');
                alert('Dokuman zaten var');
            } else if (response.status === 204) {//dokuman var
                setSuccess("");
                setCv('');
                setNiyetmektubu('');
                setIkametgah('');
                setDiploma('');
                setDilyeterlilik('');
                setPasaport('');
                alert('Dokuman zaten var');
            }
            else {
                setError(response.data.error);
            }


        } catch (err) {
            console.log(err);
            setError(" Veritabani bağlantısında hata oluştu. ", err);
        }

    };

    //DOKUMANLARI YAZDIR
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.post('http://localhost:3001/portal/dokumanyazdir', { id, dokuman_id });
                setValues(response.data);


            } catch (error) {
                console.error(error);
                setError('Veriler alınamadı');
            }
        };

        fetchData();
    }, []);

    //DOKUMAN SİL
    const dokuman_sil = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:3001/portal/dokumanSil", {
                id,
                tip_id,
            });
            console.log(response);
            if (response.status === 200) {
                alert("Dokuman silindi.");
                setCv('');
                setNiyetmektubu('');
                setIkametgah('');
                setDiploma('');
                setDilyeterlilik('');
                setPasaport('');
                setError('');
                window.location.reload();
            }
            else if (response.status === 201) {
                sessionStorage.removeItem("dokuman_id", response.data.id);
                alert("Dokuman silindi.");
                setCv('');
                setNiyetmektubu('');
                setIkametgah('');
                setDiploma('');
                setDilyeterlilik('');
                setPasaport('');
                setError('');
                window.location.reload();
            }
            else {
                setError(response.data.error);
            }
        } catch (err) {
            console.log(err);
            setError("Veritabani bağlantısında hata oluştu. ", err);
        }
    }


    return (
        <>
            <div className="container" style={{ marginBottom: '20px', marginTop: '20px' }}>
                <div className="row justify-content-center">
                    <div className="col-6 my-3">

                        <div className="row justify-content-center">
                            <div className=" col mb-3">
                                <h5><i><b>Lütfen Dosyalarınızı tek tek yükleyiniz.</b></i></h5>
                            </div>
                        </div>

                        <div className="row justify-content-center">
                            <div className=" col-4 mb-3">
                                <span for="pasaport" className="form-label">Pasaport</span>
                            </div>
                            <div className="col-4 mb-3">
                                <input className="form-control form-control-sm" value={pasaport} onChange={(e) => setPasaport(e.target.value)} type="file" id="pasaport" name="pasaport" multiple />
                            </div>
                            <div className="col-2 bm-3">
                                <button type="button" onClick={dokuman_form} className="w-100 btn btn-sm btn-outline-dark">Gönder</button>
                            </div>
                        </div>

                        <div className="row justify-content-center">
                            <div className=" col-4 mb-3">
                                <span for="cv" className="form-label">Özgeçmiş</span>
                            </div>
                            <div className="col-4 mb-3">
                                <input className="form-control form-control-sm" value={cv} onChange={(e) => setCv(e.target.value)} type="file" id="cv" name="cv" multiple />
                            </div>
                            <div className="col-2 bm-3">
                                <button type="button" onClick={dokuman_form} className="w-100 btn btn-sm btn-outline-dark">Gönder</button>
                            </div>
                        </div>

                        <div className="row justify-content-center">
                            <div className=" col-4 mb-3">
                                <span for="niyetmektubu" className="form-label">Niyet Mektubu</span>
                            </div>
                            <div className="col-4 mb-3">
                                <input className="form-control form-control-sm" type="file" id="niyetmektubu" name="niyetmektubu" value={niyetmektubu} onChange={(e) => setNiyetmektubu(e.target.value)} multiple />
                            </div>
                            <div className="col-2 bm-3">
                                <button type="button" onClick={dokuman_form} className="w-100 btn btn-sm btn-outline-dark">Gönder</button>
                            </div>
                        </div>

                        <div className="row justify-content-center">
                            <div className=" col-4 mb-3">
                                <span for="ikametgah" className="form-label">İkametgah</span>
                            </div>
                            <div className="col-4 mb-3">
                                <input className="form-control form-control-sm" type="file" id="ikametgah" name="ikametgah" value={ikametgah} onChange={(e) => setIkametgah(e.target.value)} multiple />
                            </div>
                            <div className="col-2 bm-3">
                                <button type="button" onClick={dokuman_form} className="w-100 btn btn-sm btn-outline-dark">Gönder</button>
                            </div>
                        </div>

                        <div className="row justify-content-center">
                            <div className=" col-4 mb-3">
                                <span for="diploma" className="form-label">Diploma</span>
                            </div>
                            <div className="col-4 mb-3">
                                <input className="form-control form-control-sm" type="file" id="diploma" name="diploma" value={diploma} onChange={(e) => setDiploma(e.target.value)} multiple />
                            </div>
                            <div className="col-2 bm-3">
                                <button type="button" onClick={dokuman_form} className="w-100 btn btn-sm btn-outline-dark">Gönder</button>
                            </div>
                        </div>

                        <div className="row justify-content-center">
                            <div className=" col-4 mb-3">
                                <span for="dilyeterlilik" className="form-label">Yabancı Dil Yeterlilik Belgesi</span>
                            </div>
                            <div className="col-4 mb-3">
                                <input className="form-control form-control-sm" type="file" id="dilyeterlilik" name="dilyeterlilik" value={dilyeterlilik} onChange={(e) => setDilyeterlilik(e.target.value)} multiple />
                            </div>
                            <div className="col-2 bm-3">
                                <button type="button" onClick={dokuman_form} className="w-100 btn btn-sm btn-outline-dark">Gönder</button>
                            </div>
                        </div>

                    </div>

                    <div className="col-6  py-5 px-5">
                        <div className="row justify-content-center">
                            <p><b>Pasaport:</b> {values.pasaport}</p>
                            <p><b>Özgeçmiş:</b> {values.cv}</p>
                            <p><b>Niyet Mektubu:</b> {values.niyetmektubu}</p>
                            <p><b>İkametgah:</b> {values.ikametgah}</p>
                            <p><b>Diploma:</b> {values.diploma}</p>
                            <p><b>Yabancı Dil Belgesi:</b> {values.dilyeterlilik}</p>
                        </div>
                    </div>

                </div>
                <div className="row justify-content-center">
                    <div className="col-6 my-3">
                        {error && <p style={{ color: 'red' }}> {error} </p>}
                        {success && <p style={{ color: 'green' }}> {success} </p>}
                    </div>
                </div>

                {/*DOKUMAN SIL SELECT */}
                <div className="row">
                    <div className="col">


                        <div className="row justify-content-center">
                            <div className="col-3 py-4">
                                <span><b>Silmek istediğiniz dokumanı seçin</b></span>
                            </div>
                        </div>
                        <div className="row justify-content-center">
                            <div className="col-3">
                                <select className="form-select form-select-m mb-3" onChange={(e) => setTipId(e.target.value)} aria-label="select example" id="sil" name="sil"
                                    required>
                                    <option value="">Seç</option>
                                    <option value="1">Pasaport</option>
                                    <option value="2">Özgeçmiş</option>
                                    <option value="3">Niyet Mektubu</option>
                                    <option value="4">İkametgah</option>
                                    <option value="5">Diploma</option>
                                    <option value="6">Yabancı Dil Yeterlilik Belgesi</option>
                                </select>
                            </div>
                        </div>
                        <div className="row justify-content-center">
                            <div className="col-3">
                                <button type="button" onClick={dokuman_sil} className="w-100 btn btn-sm btn-outline-dark">Sil</button>
                            </div>
                        </div>
                    </div>
                </div>

            </div >
        </>
    );


} export default Dokuman;
