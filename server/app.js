const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const { query } = require('express');
const cors = require('cors')
const app = express();
app.use(bodyParser.json());
app.use(cors());

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "erasmusdb"
});

connection.connect((err) => {
    if (err) {
        console.error('Veritabani baglanirken hata olustu: ', err)
        return;
    }
    console.log('Veritabani baglantisi basarili')
});

//KAYIT
app.post('/kayit', (req, res) => {
    const { kullanici_adi, email, sifre } = req.body;
    const hesap_acilis_tarihi = new Date();

    const kullanicikontrol = "SELECT kullanici_adi FROM hesap";
    connection.query(kullanicikontrol, (err, result) => {
        if (err) {
            console.error("Bilgilerin kontrolunde hata olustu. ", err);
            res.status(500).send({ error: 'Bilgilerin kontrolunde hata olustu.' });
            return;
        }

        let kullaniciVarMi = false;
        for (let i = 0; i < result.length; i++) {
            if (result[i].kullanici_adi === kullanici_adi) {
                kullaniciVarMi = true;
                break;
            }
        }

        if (kullaniciVarMi) {
            res.status(201).send({ message: "Bu kullanıcı adı zaten kullanılıyor" });
        }
        else {
            const query = "INSERT INTO hesap (kullanici_adi,email,sifre,hesap_acilis_tarihi) VALUES (?,?,?,?)";
            connection.query(query, [kullanici_adi, email, sifre, hesap_acilis_tarihi], (err, result) => {
                if (err) {
                    console.error("Veritabanina bilgi girerken hata: ", err);
                    res.status(500).send({ error: "Kayit girerken bir hata olustu" });
                    return;
                }
                res.status(200).send({ message: "Kayit basarili" })
            })
        }
    })
});

//GIRIS
app.post('/', (req, res) => {

    const { kullanici_adi, email, sifre } = req.body;
    const query = "SELECT * FROM hesap WHERE kullanici_adi=? AND email=? AND sifre=?";

    connection.query(query, [kullanici_adi, email, sifre], (err, result) => {
        if (err) {
            console.error("Bilgilerin kontrolunde hata olustu. ", err);
            res.status(500).send({ error: 'Bilgilerin kontrolunde hata olustu.' });
            return;
        }
        if (result.length > 0) {
            const user_id = result[0].kullanici_id;

            const isLoginQuery = "UPDATE hesap SET isLogin = 1 WHERE kullanici_id=?";

            connection.query(isLoginQuery, user_id, (err, result) => {
                if (err) {
                    console.error("Login bilgisi guncellenirken hata olustu. ", err);
                    res.status(500).send({ error: 'Login guncellenemedi.' });
                }

                //buton için bilgi atma
                const basvuruquery = "SELECT * FROM basvuru INNER JOIN kisisel_bilgiler ON basvuru.kimlik_no = kisisel_bilgiler.kimlik_no INNER JOIN hesap ON kisisel_bilgiler.kullanici_id = hesap.kullanici_id WHERE hesap.kullanici_id =?";

                connection.query(basvuruquery, [user_id], (err, basvururesult) => {
                    if (err) {
                        console.error("Bilgilerin kontrolunde hata olustu. ", err);
                        res.status(500).send({ error: 'Bilgilerin kontrolunde hata olustu.' });
                        return;
                    }

                    if (basvururesult && basvururesult.length > 0) {
                        const basvuruNo = basvururesult[0].basvuru_no;
                        if (!basvururesult[0].basvuru_no) {

                            res.status(201).send({ message: '1', id: user_id });
                        }

                        else if (basvururesult[0].basvuru_no) {
                            //sessionstorage dokuman
                            const querykimlik = "SELECT kimlik_no FROM kisisel_bilgiler WHERE kullanici_id=?"
                            connection.query(querykimlik, [user_id], (err, resultkimlik) => {

                                if (err) {
                                    console.error('Veritabanına yükleme sırasında bir hata oluştu: ', err);
                                    return res.status(500).json({ message: 'Veritabanına yükleme sırasında bir hata oluştu.' });
                                }
                                const kimlik_no = resultkimlik[0].kimlik_no;

                                const dokumanquery = "SELECT * FROM dokuman WHERE kimlik_no=?"
                                connection.query(dokumanquery, [kimlik_no], (err, dokumanresult) => {
                                    if (err) {
                                        console.error("Bilgilerin kontrolunde hata olustu. ", err);
                                        res.status(500).send({ error: 'Bilgilerin kontrolunde hata olustu.' });
                                        return;
                                    }

                                    if (dokumanresult && dokumanresult.length > 0) {
                                        const dokuman_id = dokumanresult[0].dokuman_id;
                                        if (dokumanresult[0].dokuman_id) {
                                            res.status(200).send({ message: '1', id: user_id, bid: basvuruNo, did: dokuman_id });
                                            return;
                                        }
                                    } else {
                                        res.status(202).send({ message: '1', id: user_id, bid: basvuruNo });
                                    }
                                });
                            });
                        }
                    } else {
                        res.status(201).send({ message: '1', id: user_id });
                    }
                });
            });

        } else {
            res.status(200).send({ message: '0' });
        }
    })

});

//CIKIS
app.post('/signout', (req, res) => {

    const { id } = req.body;
    const query = "UPDATE hesap SET isLogin = 0 WHERE kullanici_id=?";

    connection.query(query, [id], (err, result) => {
        if (err) {
            console.error("isLogin guncellemesinde hata olustu. ", err);
            res.status(500).send({ error: 'isLogin guncellemesinde hata olustu.' });
            return;
        }
        res.status(200).send({ message: 'Kullanici cikisi guncellendi.' });
    });

});

//HEADER KULLANICI ADI YAZDIRMA
app.post("/portal/kullaniciadi", (req, res) => {

    const user_id = req.body.id;
    const query = "SELECT * FROM hesap WHERE kullanici_id=?";

    connection.query(query, [user_id], (err, result) => {
        if (err) {
            console.error("Veritabanindan bilgi alinirken hata olustu.", err);
            res.status(500).send({ error: "Veritabanindan bilgi alinirken hata olustu." });
            return;
        }
        if (result.length === 0) {
            res.status(404).send({ message: "Basvuru Bulunamadi." });
        } else {
            res.status(200).send({ kullanici_adi: result[0].kullanici_adi });
        }
    });
});

//BASVURU FORMU GONDERME
app.post('/portal/formGonder', (req, res) => {

    const { id, isiminput, soyisiminput, tcinput, dtarihinput, cinsiyetinput, uyrukinput, uaciklama, aciklama, telefoninput, emailinput, adresinput, sehirinput, ulkeinput, mduruminput, uniinput, boluminput, mtarihinput, gpainput } = req.body;
    const kontrolQuery = "SELECT * FROM kisisel_bilgiler WHERE kullanici_id = ?";
    connection.query(kontrolQuery, [id], (err, result) => {
        if (result.length > 0) {
            res.status(201).send({ error: "Aynı hesaptan yalnizca bir basvuru yapilabilir." });
            return;
        } else {
            //KİSİSEL_BİLGİLER
            const query = "INSERT INTO kisisel_bilgiler (kullanici_id,kimlik_no, isim, soyisim, cinsiyet,dogum_tarihi,uyruk,ikinci_uyruk) VALUES (?,?,?,?,?,?,?,?)";
            connection.query(query, [id, tcinput, isiminput, soyisiminput, cinsiyetinput, dtarihinput, uyrukinput, uaciklama], (err, result) => {
                if (err) {
                    console.error("Veritabanina ekleme yapilirken hata olustu. ", err);
                    res.status(500).send({ error: "Veritabanina ekleme yapilirken hata olustu." });
                    return;
                }
            });

            //ENGELLI DURUM
            if (aciklama) {
                const queryengelli = "INSERT INTO engelli_durum (kimlik_no,engelli_durum,engel_aciklamasi) VALUES (?,1,?)";
                connection.query(queryengelli, [tcinput, aciklama], (err, result) => {
                    if (err) {
                        console.error("Veritabanina ekleme yapilirken hata olustu. ", err);
                        res.status(500).send({ error: "Veritabanina ekleme yapilirken hata olustu." });
                        return;
                    }
                });
            }

            //ILETİSİM
            const queryiletisim = "INSERT INTO iletisim (kimlik_no,telefon,email_iletisim,ulke,sehir,adres) VALUES (?,?,?,?,?,?)";
            connection.query(queryiletisim, [tcinput, telefoninput, emailinput, ulkeinput, sehirinput, adresinput], (err, result) => {
                if (err) {
                    console.error("Veritabanina ekleme yapilirken hata olustu. ", err);
                    res.status(500).send({ error: "Veritabanina ekleme yapilirken hata olustu." });
                    return;
                }
            });

            //EGİTİM
            const queryegitim = "INSERT INTO egitim (kimlik_no,mezun_durum,universite,mezun_bolum,mezun_tarih,gpa) VALUES (?,?,?,?,?,?)";
            connection.query(queryegitim, [tcinput, mduruminput, uniinput, boluminput, mtarihinput, gpainput], (err, result) => {
                if (err) {
                    console.error("Veritabanina ekleme yapilirken hata olustu. ", err);
                    res.status(500).send({ error: "Veritabanina ekleme yapilirken hata olustu." });
                    return;
                }
            });

            //BASVURU
            if (isiminput) {
                const basvuru_tarihi = new Date();
                const basvuruquery2 = "INSERT INTO basvuru (kimlik_no,basvuru_tarihi,basvuru_durum) VALUE(?,?,1)";
                connection.query(basvuruquery2, [tcinput, basvuru_tarihi], (err, result) => {
                    if (err) {
                        console.error("Basvuru hata olustu ", err);
                        res.status(500).send({ error: 'Basvuru guncellenemedi.' });
                    }
                });
            }

            //buton için bilgi atma
            const basvuruquery = "SELECT * FROM basvuru WHERE kimlik_no=?"
            connection.query(basvuruquery, [tcinput], (err, result) => {
                if (err) {
                    console.error("Bilgilerin kontrolunde hata olustu. ", err);
                    res.status(500).send({ error: 'Bilgilerin kontrolunde hata olustu.' });
                    return;
                }

                if (result.length > 0) {
                    const basvuruNo = result[0].basvuru_no;
                    res.status(200).send({ message: 'basvuru_no alındı', id: basvuruNo });
                } else {
                    res.status(404).send({ error: 'Belirtilen kimlik numarasına ait başvuru bulunamadı.' });
                }
            });
        }
    });
});

//KULLANICI ADI GUNCELLE
app.post('/portal/kullanici_gncl_kullaniciadi', (req, res) => {
    const { id, kullanici_adi } = req.body;
    if (kullanici_adi) {
        const query = "SELECT kullanici_adi FROM hesap";
        connection.query(query, (err, result) => {
            if (err) {
                console.error("Veritabanına bilgi girerken hata oluştu: ", err);
                return;
            }

            let kullaniciVarMi = false;
            for (let i = 0; i < result.length; i++) {
                if (result[i].kullanici_adi === kullanici_adi) {
                    kullaniciVarMi = true;
                    break;
                }
            }

            if (kullaniciVarMi) {
                res.status(203).send({ message: "Bu kullanıcı adı zaten kullanılıyor" });
            } else {
                const updateQuery = "UPDATE hesap SET kullanici_adi=? WHERE kullanici_id=?";
                connection.query(updateQuery, [kullanici_adi, id], (updateErr, updateResult) => {
                    if (updateErr) {
                        console.error("Veritabanına bilgi girerken hata oluştu: ", updateErr);
                        return;
                    }
                    res.status(200).send({ message: "Güncelleme başarılı" });
                });
            }
        });
    } else {
        res.status(500).send({ message: "Kullanıcı adı boş bırakılamaz" });
    }
});

//KULLANICI BİLGİLERİ GUNCELLE EMAIL
app.post('/portal/kullanici_gncl_email', (req, res) => {
    const { id, email } = req.body;

    if (email) {
        const queryemail = "UPDATE hesap SET email=? WHERE kullanici_id=?";
        connection.query(queryemail, [email, id], (err, result) => {
            if (err) {
                console.error("Veritabanina bilgi girerken hata: ", err);
                res.status(500).send({ error: "Güncelleme yaparken bir hata olustu" });
                return;
            }
            res.status(200).send({ message: "Güncelleme basarili" })

        })
    } else {
        res.status(500).send({ message: "Boş bilgi gönderilemez" })
    }

});

//KULLANICI BİLGİLERİ GUNCELLE SIFRE
app.post('/portal/kullanici_gncl_sifre', (req, res) => {
    const { id, sifre, resifre } = req.body;

    if (sifre == resifre && sifre && resifre) {
        const querysifre = "UPDATE hesap SET sifre=? WHERE kullanici_id=?";
        connection.query(querysifre, [sifre, id], (err, result) => {
            if (err) {
                console.error("Veritabanina bilgi girerken hata: ", err);
                res.status(500).send({ error: "Güncelleme yaparken bir hata olustu" });
                return;
            }
            res.status(200).send({ message: "Güncelleme basarili" })
        })
    }
    else {
        res.status(500).send({ message: "Sifreler eslesmiyor" })
    }
});

//Soru gonder GONDERME
app.post('/portal/soruGonder', (req, res) => {

    const { id, ad, email, mesaj } = req.body;
    const query = "INSERT INTO kullanici_iletisim (kullanici_id,ad_soyad,iletisim_email,mesaj) VALUES (?,?,?,?)";
    connection.query(query, [id, ad, email, mesaj], (err, result) => {
        if (err) {
            console.error("Veritabanina bilgi girerken hata: ", err);
            res.status(500).send({ error: "Kayit girerken bir hata olustu" });
            return;
        }
        res.status(200).send({ message: "Kayit basarili" })
    })
});

//BASVURU GUNCELLE
app.post('/portal/basvuru_gncl', (req, res) => {

    const { id, isim, soyisim, kimlik_no, dogum_tarihi, cinsiyet, uyruk, ikinci_uyruk, engel_aciklamasi, telefon, email_iletisim, adres, sehir, ulke, mezun_durum, universite, mezun_bolum, mezun_tarih, gpa } = req.body;
    //KİSİSEL_BİLGİLER
    const query = "UPDATE kisisel_bilgiler SET kimlik_no = ?, isim = ?, soyisim = ?, cinsiyet = ?, dogum_tarihi = ?, uyruk = ?, ikinci_uyruk = ? WHERE kullanici_id = ?";
    connection.query(query, [kimlik_no, isim, soyisim, cinsiyet, dogum_tarihi, uyruk, ikinci_uyruk, id], (err, result) => {

        if (err) {
            console.error("Veritabanina ekleme yapilirken hata olustu. ", err);
            res.status(500).send({ error: "Veritabanina ekleme yapilirken hata olustu." });
            return;
        }

        //ENGELLI DURUM
        const engeltablosu = "SELECT * FROM engelli_durum WHERE kimlik_no = ? AND engelli_durum = 1";
        connection.query(engeltablosu, [kimlik_no], (err, engeltablosu_result) => {
            if (err) {
                console.error("Veritabanina ekleme yapilirken hata olustu. ", err);
                res.status(500).send({ error: "Veritabanina ekleme yapilirken hata olustu." });
                return;
            }
            else {
                if (engel_aciklamasi && engeltablosu_result[0]) {
                    const queryengelli = "UPDATE engelli_durum SET engel_aciklamasi = ? WHERE kimlik_no = ? AND engelli_durum = 1";
                    connection.query(queryengelli, [engel_aciklamasi, kimlik_no], (err, result) => {
                        if (err) {
                            console.error("Veritabanina ekleme yapilirken hata olustu. ", err);
                            res.status(500).send({ error: "Veritabanina ekleme yapilirken hata olustu." });
                            return;
                        }
                    });
                }
                else if (engel_aciklamasi && !engeltablosu_result[0]) {
                    const queryengelli = "INSERT INTO engelli_durum (kimlik_no,engelli_durum,engel_aciklamasi) VALUES (?,1,?)";
                    connection.query(queryengelli, [kimlik_no, engel_aciklamasi], (err, result) => {
                        if (err) {
                            console.error("Veritabanina ekleme yapilirken hata olustu. ", err);
                            res.status(500).send({ error: "Veritabanina ekleme yapilirken hata olustu." });
                            return;
                        }
                    });
                }
            }
        })

        //ILETİSİM
        const queryiletisim = " UPDATE iletisim  SET telefon = ?, email_iletisim = ?, ulke = ?, sehir = ?, adres = ? WHERE kimlik_no = ? ";
        connection.query(queryiletisim, [telefon, email_iletisim, ulke, sehir, adres, kimlik_no], (err, result) => {
            if (err) {
                console.error("Veritabanina ekleme yapilirken hata olustu. ", err);
                res.status(500).send({ error: "Veritabanina ekleme yapilirken hata olustu." });
                return;
            }
        });

        //EGİTİM
        const queryegitim = "UPDATE egitim SET mezun_durum = ?, universite = ?, mezun_bolum = ?, mezun_tarih = ?, gpa = ? WHERE kimlik_no = ? ";
        connection.query(queryegitim, [mezun_durum, universite, mezun_bolum, mezun_tarih, gpa, kimlik_no], (err, result) => {
            if (err) {
                console.error("Veritabanina ekleme yapilirken hata olustu. ", err);
                res.status(500).send({ error: "Veritabanina ekleme yapilirken hata olustu." });
                return;
            }
        });

        res.status(200).send({ message: "Kayit güncellendi" })

    });
});

//BASVURU FORM BİLGİLERİNİ YAZDIR
app.post("/portal/bilgiGetir", (req, res) => {
    const user_id = req.body.id;

    // Kişisel bilgiler sorgusu
    const personal_info_query = "SELECT * FROM kisisel_bilgiler WHERE kullanici_id=?";
    connection.query(personal_info_query, [user_id], (err, personal_info_result) => {
        if (err) {
            console.error("Veritabanından kişisel bilgi alınırken hata oluştu.", err);
            res.status(500).send({ error: "Veritabanından kişisel bilgi alınırken hata oluştu." });
            return;
        }
        if (personal_info_result.length === 0) {
            res.status(404).send({ message: "Başvuru bulunamadı." });
            return;
        }

        // Engelli durum sorgusu
        const disability_query = "SELECT * FROM engelli_durum WHERE kimlik_no = ? AND engelli_durum = 1";
        connection.query(disability_query, [personal_info_result[0].kimlik_no], (err, disability_result) => {
            if (err) {
                console.error("Veritabanından engelli durumu alınırken hata oluştu.", err);
                res.status(500).send({ error: "Veritabanından engelli durumu alınırken hata oluştu." });
                return;
            }

            const egitimquery = "SELECT * FROM egitim WHERE kimlik_no= ?";
            connection.query(egitimquery, [personal_info_result[0].kimlik_no], (err, egitimquery_result) => {
                if (err) {
                    console.error("Veritabanından engelli durumu alınırken hata oluştu.", err);
                    res.status(500).send({ error: "Veritabanından engelli durumu alınırken hata oluştu." });
                    return;
                }

                const iletisimquery = "SELECT * FROM iletisim WHERE kimlik_no=?";
                connection.query(iletisimquery, [personal_info_result[0].kimlik_no], (err, iletisimquery_result) => {
                    if (err) {
                        console.error("Veritabanından engelli durumu alınırken hata oluştu.", err);
                        res.status(500).send({ error: "Veritabanından engelli durumu alınırken hata oluştu." });
                        return;
                    }
                    res.status(200).send({
                        isim: personal_info_result[0].isim,
                        soyisim: personal_info_result[0].soyisim,
                        cinsiyet: personal_info_result[0].cinsiyet,
                        kimlik_no: personal_info_result[0].kimlik_no,
                        uyruk: personal_info_result[0].uyruk,
                        dogum_tarihi: personal_info_result[0].dogum_tarihi,
                        ikinci_uyruk: personal_info_result[0].ikinci_uyruk,
                        engel_aciklamasi: (disability_result.length > 0) ? disability_result[0].engel_aciklamasi : "",
                        mezun_durum: egitimquery_result[0].mezun_durum,
                        universite: egitimquery_result[0].universite,
                        mezun_bolum: egitimquery_result[0].mezun_bolum,
                        mezun_tarih: egitimquery_result[0].mezun_tarih,
                        gpa: egitimquery_result[0].gpa,
                        telefon: iletisimquery_result[0].telefon,
                        email_iletisim: iletisimquery_result[0].email_iletisim,
                        ulke: iletisimquery_result[0].ulke,
                        sehir: iletisimquery_result[0].sehir,
                        adres: iletisimquery_result[0].adres,

                    });
                })
            })
        });
    });
});


//DOKUMAN GONDER
app.post('/portal/dokumanGonder', (req, res) => {
    const { id, pasaport, cv, niyetmektubu, ikametgah, diploma, dilyeterlilik } = req.body;
    const yuklendigi_tarih = new Date();

    const querykimlik = "SELECT kimlik_no FROM kisisel_bilgiler WHERE kullanici_id=?"
    connection.query(querykimlik, [id], (err, resultkimlik) => {
        if (err) {
            console.error('Veritabanına yükleme sırasında bir hata oluştu: ', err);
            return res.status(500).json({ message: 'Veritabanına yükleme sırasında bir hata oluştu.' });
        }
        const kimlik_no = resultkimlik[0].kimlik_no;

        if (pasaport) {
            const queryPasaport = "SELECT dokuman_tip.tip FROM dokuman INNER JOIN dokuman_tip ON dokuman.tip_id = dokuman_tip.tip_id WHERE dokuman.kimlik_no = ? AND dokuman_tip.tip = 'pasaport'";
            connection.query(queryPasaport, [kimlik_no], (err, resultPasaport) => {
                if (err) {
                    console.error('Veritabanına yükleme sırasında bir hata oluştu: ', err);
                    return res.status(500).json({ message: 'Pasaport belgesi veritabanında kontrol edilirken bir hata oluştu.' });
                }

                if (resultPasaport && resultPasaport.length > 0) {
                    // Veritabanında pasaport belgesi zaten var, yükleme yapma
                    return res.status(201).send({ message: 'Veritabanında bir pasaport belgesi zaten var.' });
                }

                //VERITABANINDA BELGE YOKSA YUKLEME YAP
                else {
                    // Veritabanında pasaport belgesi yok, yükleme yapabilirsiniz
                    const queryPasaportTip = "SELECT tip_id FROM dokuman_tip WHERE tip='pasaport'";
                    connection.query(queryPasaportTip, (err, resultPasaportTip) => {
                        if (err) {
                            console.error('Veritabanına yükleme sırasında bir hata oluştu: ', err);
                            return res.status(500).json({ message: 'Pasaport belgesi veritabanına yükleme sırasında bir hata oluştu.' });
                        }

                        const tip_id = resultPasaportTip[0].tip_id;

                        //dokuman yukleme
                        const query = "INSERT INTO dokuman (kimlik_no,tip_id,yuklendigi_tarih,yuklendigi_yer) VALUES (?,?,?,?)"
                        connection.query(query, [kimlik_no, tip_id, yuklendigi_tarih, pasaport], (err, pasaportresult) => {
                            if (err) {
                                console.error('Veritabanına yükleme sırasında bir hata oluştu: ', err);
                                return res.status(500).json({ message: 'Pasaport belgesi Veritabanına yükleme sırasında bir hata oluştu.' });
                            }
                            const dokumanquery = "SELECT * FROM dokuman WHERE kimlik_no=?"
                            connection.query(dokumanquery, [kimlik_no], (err, result) => {
                                if (err) {
                                    console.error("Bilgilerin kontrolunde hata olustu. ", err);
                                    return res.status(500).send({ error: 'Bilgilerin kontrolunde hata olustu.' });
                                }

                                if (result.length > 0) {
                                    const dokuman_id = result[0].dokuman_id;
                                    res.status(200).send({ message: 'basvuru_no alındı', id: dokuman_id });
                                } else {
                                    return res.status(404).send({ error: 'Belirtilen kimlik numarasına ait başvuru bulunamadı.' });
                                }
                            });
                        });
                    });

                }
            });
        }

        else if (cv) {
            const querycv = "SELECT dokuman_tip.tip FROM dokuman INNER JOIN dokuman_tip ON dokuman.tip_id = dokuman_tip.tip_id WHERE dokuman.kimlik_no = ? AND dokuman_tip.tip = 'cv'";
            connection.query(querycv, [kimlik_no], (err, resultcv) => {
                if (err) {
                    console.error('Veritabanına yükleme sırasında bir hata oluştu: ', err);
                    return res.status(500).json({ message: 'Pasaport belgesi veritabanında kontrol edilirken bir hata oluştu.' });
                }

                if (resultcv && resultcv.length > 0) {
                    // Veritabanında pasaport belgesi zaten var, yükleme yapma
                    return res.status(202).send({ message: 'Veritabanında bir cv belgesi zaten var.' });
                }

                //VERITABANINDA BELGE YOKSA YUKLEME YAP
                else {
                    // Veritabanında cv belgesi yok, yükleme yapabilirsiniz
                    const querycvTip = "SELECT tip_id FROM dokuman_tip WHERE tip='cv'";
                    connection.query(querycvTip, (err, resultcvTip) => {
                        if (err) {
                            console.error('Veritabanına yükleme sırasında bir hata oluştu: ', err);
                            return res.status(500).json({ message: 'Pasaport belgesi veritabanına yükleme sırasında bir hata oluştu.' });
                        }

                        const tip_id = resultcvTip[0].tip_id;

                        //cv yukleme
                        const query = "INSERT INTO dokuman (kimlik_no,tip_id,yuklendigi_tarih,yuklendigi_yer) VALUES (?,?,?,?)"
                        connection.query(query, [kimlik_no, tip_id, yuklendigi_tarih, cv], (err, cvresult) => {
                            if (err) {
                                console.error('Veritabanına yükleme sırasında bir hata oluştu: ', err);
                                return res.status(500).json({ message: 'Pasaport belgesi Veritabanına yükleme sırasında bir hata oluştu.' });
                            }
                            const dokumanquery = "SELECT * FROM dokuman WHERE kimlik_no=?"
                            connection.query(dokumanquery, [kimlik_no], (err, result) => {
                                if (err) {
                                    console.error("Bilgilerin kontrolunde hata olustu. ", err);
                                    return res.status(500).send({ error: 'Bilgilerin kontrolunde hata olustu.' });
                                }

                                if (result.length > 0) {
                                    const dokuman_id = result[0].dokuman_id;
                                    res.status(200).send({ message: 'basvuru_no alındı', id: dokuman_id });
                                } else {
                                    return res.status(404).send({ error: 'Belirtilen kimlik numarasına ait başvuru bulunamadı.' });
                                }
                            });
                        });
                    });
                }

            });
        }

        else if (niyetmektubu) {
            const queryniyetmektubu = "SELECT dokuman_tip.tip FROM dokuman INNER JOIN dokuman_tip ON dokuman.tip_id = dokuman_tip.tip_id WHERE dokuman.kimlik_no = ? AND dokuman_tip.tip = 'niyetmektubu'";
            connection.query(queryniyetmektubu, [kimlik_no], (err, resultniyetmektubu) => {
                if (err) {
                    console.error('Veritabanına yükleme sırasında bir hata oluştu: ', err);
                    return res.status(500).json({ message: 'Pasaport belgesi veritabanında kontrol edilirken bir hata oluştu.' });
                }
                if (resultniyetmektubu && resultniyetmektubu.length > 0) {
                    // Veritabanında pasaport belgesi zaten var, yükleme yapma
                    return res.status(203).send({ message: 'Veritabanında bir niyetmektubu belgesi zaten var.' });
                }

                else { //VERITABANINDA BELGE YOKSA YUKLEME YAP
                    // Veritabanında niyet belgesi yok, yükleme yapabilirsiniz
                    const queryniyetmektubuTip = "SELECT tip_id FROM dokuman_tip WHERE tip='niyetmektubu'";
                    connection.query(queryniyetmektubuTip, (err, resultniyetmektubuTip) => {
                        if (err) {
                            console.error('Veritabanına yükleme sırasında bir hata oluştu: ', err);
                            return res.status(500).json({ message: 'Pasaport belgesi veritabanına yükleme sırasında bir hata oluştu.' });
                        }

                        const tip_id = resultniyetmektubuTip[0].tip_id;

                        //niyetmektubu yukleme
                        const query = "INSERT INTO dokuman (kimlik_no,tip_id,yuklendigi_tarih,yuklendigi_yer) VALUES (?,?,?,?)"
                        connection.query(query, [kimlik_no, tip_id, yuklendigi_tarih, niyetmektubu], (err, niyetmektuburesult) => {
                            if (err) {
                                console.error('Veritabanına yükleme sırasında bir hata oluştu: ', err);
                                return res.status(500).json({ message: 'Pasaport belgesi Veritabanına yükleme sırasında bir hata oluştu.' });
                            }
                            //res.status(200).send({ message: 'basvuru_no alındı' });
                            const dokumanquery = "SELECT * FROM dokuman WHERE kimlik_no=?"
                            connection.query(dokumanquery, [kimlik_no], (err, result) => {
                                if (err) {
                                    console.error("Bilgilerin kontrolunde hata olustu. ", err);
                                    return res.status(500).send({ error: 'Bilgilerin kontrolunde hata olustu.' });
                                }

                                if (result.length > 0) {
                                    const dokuman_id = result[0].dokuman_id;
                                    res.status(200).send({ message: 'basvuru_no alındı', id: dokuman_id });
                                } else {
                                    return res.status(404).send({ error: 'Belirtilen kimlik numarasına ait başvuru bulunamadı.' });
                                }
                            });
                        });
                    });

                }

            });
        }

        else if (ikametgah) {
            const queryikametgah = "SELECT dokuman_tip.tip FROM dokuman INNER JOIN dokuman_tip ON dokuman.tip_id = dokuman_tip.tip_id WHERE dokuman.kimlik_no = ? AND dokuman_tip.tip = 'ikametgah'";
            connection.query(queryikametgah, [kimlik_no], (err, resultikametgah) => {
                if (err) {
                    console.error('Veritabanına yükleme sırasında bir hata oluştu: ', err);
                    return res.status(500).json({ message: 'Pasaport belgesi veritabanında kontrol edilirken bir hata oluştu.' });
                }

                if (resultikametgah && resultikametgah.length > 0) {
                    // Veritabanında pasaport belgesi zaten var, yükleme yapma
                    res.status(204).send({ message: 'Veritabanında bir ikametgah belgesi zaten var.' });
                }

                else { //VERITABANINDA BELGE YOKSA YUKLEME YAP
                    // Veritabanında ikametgah belgesi yok, yükleme yapabilirsiniz
                    const queryikametgahTip = "SELECT tip_id FROM dokuman_tip WHERE tip='ikametgah'";
                    connection.query(queryikametgahTip, (err, resultikametgahTip) => {
                        if (err) {
                            console.error('Veritabanına yükleme sırasında bir hata oluştu: ', err);
                            return res.status(500).json({ message: 'Pasaport belgesi veritabanına yükleme sırasında bir hata oluştu.' });
                        }

                        const tip_id = resultikametgahTip[0].tip_id;

                        //ikametgah yukleme
                        const query = "INSERT INTO dokuman (kimlik_no,tip_id,yuklendigi_tarih,yuklendigi_yer) VALUES (?,?,?,?)"
                        connection.query(query, [kimlik_no, tip_id, yuklendigi_tarih, ikametgah], (err, result) => {
                            if (err) {
                                console.error('Veritabanına yükleme sırasında bir hata oluştu: ', err);
                                return res.status(500).json({ message: 'Pasaport belgesi Veritabanına yükleme sırasında bir hata oluştu.' });
                            }
                            const dokumanquery = "SELECT * FROM dokuman WHERE kimlik_no=?"
                            connection.query(dokumanquery, [kimlik_no], (err, result) => {
                                if (err) {
                                    console.error("Bilgilerin kontrolunde hata olustu. ", err);
                                    return res.status(500).send({ error: 'Bilgilerin kontrolunde hata olustu.' });
                                }

                                if (result.length > 0) {
                                    const dokuman_id = result[0].dokuman_id;
                                    res.status(200).send({ message: 'basvuru_no alındı', id: dokuman_id });
                                } else {
                                    return res.status(404).send({ error: 'Belirtilen kimlik numarasına ait başvuru bulunamadı.' });
                                }
                            });
                        });
                    });

                }

            });
        }
        /**************************************** */
        else if (diploma) {
            const querytip = "SELECT tip_id FROM dokuman_tip WHERE tip='diploma'";
            connection.query(querytip, (err, resulttip) => {
                if (err) {
                    console.error('Veritabanına yükleme sırasında bir hata oluştu: ', err);
                    return res.status(500).json({ message: 'diploma belgesi Veritabanına yükleme sırasında bir hata oluştu.' });
                }
                const tip_id = resulttip[0].tip_id;

                const query = "INSERT INTO dokuman (kimlik_no,tip_id,yuklendigi_tarih,yuklendigi_yer) VALUES (?,?,?,?)"
                connection.query(query, [kimlik_no, tip_id, yuklendigi_tarih, diploma], (err, result) => {
                    if (err) {
                        console.error('Veritabanına yükleme sırasında bir hata oluştu: ', err);
                        return res.status(500).json({ message: 'diploma belgesi Veritabanına yükleme sırasında bir hata oluştu.' });
                    }
                    const dokumanquery = "SELECT * FROM dokuman WHERE kimlik_no=?"
                    connection.query(dokumanquery, [kimlik_no], (err, result) => {
                        if (err) {
                            console.error("Bilgilerin kontrolunde hata olustu. ", err);
                            return res.status(500).send({ error: 'Bilgilerin kontrolunde hata olustu.' });
                        }

                        if (result.length > 0) {
                            const dokuman_id = result[0].dokuman_id;
                            res.status(200).send({ message: 'basvuru_no alındı', id: dokuman_id });
                        } else {
                            return res.status(404).send({ error: 'Belirtilen kimlik numarasına ait başvuru bulunamadı.' });
                        }
                    });
                });
            })
        }

        else if (dilyeterlilik) {
            const querytip = "SELECT tip_id FROM dokuman_tip WHERE tip='dilyeterlilik'";
            connection.query(querytip, (err, resulttip) => {
                if (err) {
                    console.error('Veritabanına yükleme sırasında bir hata oluştu: ', err);
                    return res.status(500).json({ message: 'dilyeterlilik belgesi Veritabanına yükleme sırasında bir hata oluştu.' });
                }
                const tip_id = resulttip[0].tip_id;

                const query = "INSERT INTO dokuman (kimlik_no,tip_id,yuklendigi_tarih,yuklendigi_yer) VALUES (?,?,?,?)"
                connection.query(query, [kimlik_no, tip_id, yuklendigi_tarih, dilyeterlilik], (err, result) => {
                    if (err) {
                        console.error('Veritabanına yükleme sırasında bir hata oluştu: ', err);
                        return res.status(500).json({ message: 'dilyeterlilik belgesi Veritabanına yükleme sırasında bir hata oluştu.' });
                    }

                    const dokumanquery = "SELECT * FROM dokuman WHERE kimlik_no=?"
                    connection.query(dokumanquery, [kimlik_no], (err, result) => {
                        if (err) {
                            console.error("Bilgilerin kontrolunde hata olustu. ", err);
                            return res.status(500).send({ error: 'Bilgilerin kontrolunde hata olustu.' });
                        }

                        if (result.length > 0) {
                            const dokuman_id = result[0].dokuman_id;
                            res.status(200).send({ message: 'basvuru_no alındı', id: dokuman_id });
                        } else {
                            return res.status(404).send({ error: 'Belirtilen kimlik numarasına ait başvuru bulunamadı.' });
                        }
                    });
                });
            })
        }
        else {
            return res.status(500).json({ message: 'Veritabanına yükleme sırasında bir hata oluştu.' });
        }
    })
});

//DOKUMAN YAZDIR
app.post('/portal/dokumanyazdir', (req, res) => {
    const { id } = req.body;
    const querykimlik = "SELECT kimlik_no FROM kisisel_bilgiler WHERE kullanici_id=?";
    connection.query(querykimlik, [id], (err, resultkimlik) => {
        if (err) {
            console.error('Veritabanına yükleme sırasında bir hata oluştu: ', err);
            return res.status(500).json({ message: 'Veritabanına yükleme sırasında bir hata oluştu.' });
        }
        const kimlik_no = resultkimlik[0].kimlik_no;

        const queryDokumanlar = "SELECT tip, yuklendigi_yer FROM dokuman INNER JOIN dokuman_tip ON dokuman.tip_id = dokuman_tip.tip_id WHERE dokuman.kimlik_no = ?";
        connection.query(queryDokumanlar, [kimlik_no], (err, result) => {
            if (err) {
                console.error('Veritabanında kontrol edilirken bir hata oluştu: ', err);
                return res.status(500).json({ message: 'Veritabanında kontrol edilirken bir hata oluştu.' });
            }

            const dokumanlar = {};
            result.forEach(dokuman => {
                if (dokuman.tip === 'pasaport') {
                    if (!dokumanlar.pasaport) dokumanlar.pasaport = [];
                    dokumanlar.pasaport.push(dokuman.yuklendigi_yer);
                } else if (dokuman.tip === 'cv') {
                    if (!dokumanlar.cv) dokumanlar.cv = [];
                    dokumanlar.cv.push(dokuman.yuklendigi_yer);
                } else if (dokuman.tip === 'niyetmektubu') {
                    if (!dokumanlar.niyetmektubu) dokumanlar.niyetmektubu = [];
                    dokumanlar.niyetmektubu.push(dokuman.yuklendigi_yer);
                } else if (dokuman.tip === 'ikametgah') {
                    if (!dokumanlar.ikametgah) dokumanlar.ikametgah = [];
                    dokumanlar.ikametgah.push(dokuman.yuklendigi_yer);
                } else if (dokuman.tip === 'diploma') {
                    if (!dokumanlar.diploma) dokumanlar.diploma = [];
                    dokumanlar.diploma.push(dokuman.yuklendigi_yer);
                } else if (dokuman.tip === 'dilyeterlilik') {
                    if (!dokumanlar.dilyeterlilik) dokumanlar.dilyeterlilik = [];
                    dokumanlar.dilyeterlilik.push(dokuman.yuklendigi_yer);
                }
            });
            res.status(200).send(dokumanlar);
        });
    });
});

//DOKUMAN SIL
app.post('/portal/dokumanSil', (req, res) => {
    const { id, tip_id } = req.body;
    const querykimlik = "SELECT kimlik_no FROM kisisel_bilgiler WHERE kullanici_id=?";
    connection.query(querykimlik, [id], (err, resultkimlik) => {
        if (err) {
            console.error('Veritabanına erişim sırasında bir hata oluştu: ', err);
            return res.status(500).json({ message: 'Veritabanına erişim sırasında bir hata oluştu.' });
        }
        const kimlik_no = resultkimlik[0].kimlik_no;

        const querypBelge = "SELECT * FROM dokuman WHERE kimlik_no = ?";
        connection.query(querypBelge, [kimlik_no], (err, resultBelge) => {
            if (err) {
                console.error('Veritabanına erişim sırasında bir hata oluştu: ', err);
                return res.status(500).json({ message: 'Belge veritabanında kontrol edilirken bir hata oluştu.' });
            }

            if (!resultBelge || resultBelge.length === 0) {
                return res.status(404).send({ error: 'Belirtilen belge tipine ait belge bulunamadı.' });
            }
            else {
                const dokuman_id = resultBelge[0].dokuman_id;
                const querysil = "DELETE FROM dokuman WHERE kimlik_no = ? AND tip_id = ?";
                connection.query(querysil, [kimlik_no, tip_id], (err, result) => {
                    if (err) {
                        console.error('Veritabanından silme sırasında bir hata oluştu: ', err);
                        return res.status(500).json({ message: 'Belge veritabanından silinirken bir hata oluştu.' });
                    }

                    const dokumanquery = "SELECT * FROM dokuman WHERE kimlik_no=?"
                    connection.query(dokumanquery, [kimlik_no], (err, result) => {
                        if (err) {
                            console.error("Bilgilerin kontrolunde hata olustu. ", err);
                            return res.status(500).send({ error: 'Bilgilerin kontrolunde hata olustu.' });
                        }

                        if (!result || result.length <= 0) {
                            res.status(201).send({ message: 'Bütün belgeler silindi', id: dokuman_id });
                        }
                        else {
                            return res.status(200).send({ error: 'Bütün belgeler silindi' });
                        }
                    });
                });
            }
        });
    });
});





const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server ${PORT} üzerinde dinleniyor`)
})