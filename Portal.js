import React, { useState, useEffect } from 'react';
import { Router, Route, Routes, Link } from 'react-router-dom';
import ReactDOM from 'react-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Portal() {
    //GERİ SAYIM
    const [time, setTime] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    useEffect(() => {
        const endDate = new Date("Jul 30, 2023 12:00:00").getTime();
        const timer = setInterval(() => {
            const now = new Date().getTime();
            const t = endDate - now;

            if (t >= 0) {
                const days = Math.floor(t / (1000 * 60 * 60 * 24));
                const hours = Math.floor((t % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((t % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((t % (1000 * 60)) / 1000);

                setTime({ days, hours, minutes, seconds });
            } else {
                clearInterval(timer);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const formData = sessionStorage.getItem("basvuru_no");
        const dokuman_id = sessionStorage.getItem("dokuman_id");

        if (!formData) {
            document.getElementById("basvuruDurum").innerHTML = "Kullanıcı menüsünden Başvuru formuna erişebilirsiniz";
            document.getElementById("guncelle").innerHTML = "";
        } else if (formData && !dokuman_id) {
            document.getElementById("basvuruDurum").innerHTML = "Başvurunuz alınmıştır. Lütfen dokümanlarınızı yükleyin.";
            document.getElementById("guncelle").innerHTML = "Başvuru süresi bitene kadar bilgilerinizi güncelleyebilirsiniz.";
        } else if (formData && dokuman_id) {
            document.getElementById("basvuruDurum").innerHTML = "Dosyalarınız yüklenmiştir. Eksik dosyanız var ise tamamlayınız.";
            document.getElementById("guncelle").innerHTML = "Başvuru süresi bitene kadar bilgilerinizi güncelleyebilirsiniz.";
        } else {
            document.getElementById("basvuruDurum").innerHTML = "Lütfen eksik dokümanlarınızı yükleyin.";
            document.getElementById("guncelle").innerHTML = "Başvuru süresi bitene kadar bilgilerinizi güncelleyebilirsiniz.";
        }
    }, []);

    return (
        <>
            <div className="container">
                <div className="row py-5">
                    <div className="col-auto ">
                        <h5 id="timer">
                            <i>
                                <span className="kirp">CyberMACS'e başvurmak için son gün: </span>
                                <span id="timer-gunler">{time.days} </span>
                                <span className="gerisayim"> gün - </span>
                                <span id="timer-saatler">{time.hours} </span>
                                <span className="gerisayim"> saat - </span>
                                <span id="timer-dakikalar">{time.minutes} </span>
                                <span className="gerisayim"> dk - </span>
                                <span id="timer-saniyeler">{time.seconds} </span>
                                <span className="gerisayim"> sn </span>
                            </i>
                        </h5>
                    </div>
                </div>
                <div className="row">
                    <div className="col-auto" style={{ fontSize: 20 }}>
                        <b><i><p id="basvuruDurum"></p></i></b>
                        <b><i><p id="guncelle"></p></i></b>
                    </div>
                </div>
            </div>
        </>

    );
}

export default Portal;