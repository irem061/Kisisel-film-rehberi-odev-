import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, NavLink, useParams, useNavigate } from "react-router-dom";

// 1. GLOBAL STİL AYARI (Sayfayı Tam Kaplaması İçin)
const GlobalStyle = () => (
  <style>{`
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background-color: #0a0a0a; font-family: 'Inter', sans-serif; color: white; overflow-x: hidden; }
    ::-webkit-scrollbar { width: 8px; }
    ::-webkit-scrollbar-track { background: #141414; }
    ::-webkit-scrollbar-thumb { background: #E50914; border-radius: 10px; }
  `}</style>
);

// 2. VERİ SETİ (Kapak Fotoğrafları ve İlgi Çekici Özetlerle)
const INITIAL_MOVIES = [
  { 
    id: 1, slug: "dunya-savasi-z", title: "Dünya Savaşı Z", genre: "Aksiyon / Korku",
    image: "https://images.alphacoders.com/439/439169.jpg",
    director: "Marc Forster", releaseDate: "15 Mart 2026",
    summary: "İnsanlığın bildiği son sabah... Brad Pitt, dünyayı saniyeler içinde dize getiren amansız bir zombi pandemisinin ortasında, ailesini ve medeniyeti kurtarmak için kıtalararası bir yarışa giriyor. Kaos hiç bu kadar yakın olmamıştı!",
    theaters: [{ salon: "Salon 1 (IMAX)", hours: ["14:00", "17:30", "21:00"] }, { salon: "Salon 3", hours: ["12:00", "22:15"] }],
    comments: [{ user: "ZombiSever", text: "Gerilim bir an olsun düşmüyor!", star: 5 }]
  },
  { 
    id: 2, slug: "igne-iplik", title: "İğne İplik", genre: "Dram / Başarı Hikayesi",
    image: "https://m.media-amazon.com/images/M/MV5BMjE3MDYyMjc1N15BMl5BanBnXkFtZTgwNjA2MjkyNjM@._V1_.jpg",
    director: "Sharat Katariya", releaseDate: "16 Mart 2026",
    summary: "Sıfırdan zirveye giden bir dikiş makinesinin hikayesi... Kendi yeteneğine güvenen bir adam ve ona ilham veren eşinin, tüm dünyaya meydan okuyan 'Made in India' mucizesine tanıklık edin.",
    theaters: [{ salon: "Salon 2", hours: ["13:00", "18:00"] }],
    comments: [{ user: "Samimiyet", text: "Aamir Khan sonrası en iyi Hint filmlerinden.", star: 4 }]
  },
  { 
    id: 3, slug: "gorunmeyen-misafir", title: "Görünmeyen Misafir", genre: "Gizem / Suç",
    image: "https://m.media-amazon.com/images/M/MV5BMDk0YzAwYjktMWFiZi00Y2VlLTg3MzMtMGY3NmZlNGUyYjI1XkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg",
    director: "Oriol Paulo", releaseDate: "17 Mart 2026",
    summary: "Gerçek, kapalı kapılar ardındaki bir yalandır. Sevgilisinin cesediyle bir otel odasında kilitli kalan genç bir iş adamı ve onun itibarını kurtarmaya çalışan efsanevi bir avukat. Her saniye yeni bir teori, her dakika yeni bir şok!",
    theaters: [{ salon: "Salon 5", hours: ["15:00", "20:30", "23:00"] }],
    comments: [{ user: "ZekaKüpü", text: "Son 10 dakikada beynim yandı!", star: 5 }]
  },
  { 
    id: 4, slug: "zindan-adasi", title: "Zindan Adası", genre: "Psikolojik Gerilim",
    image: "https://images.alphacoders.com/165/165213.jpg",
    director: "Martin Scorsese", releaseDate: "18 Mart 2026",
    summary: "Kaçışın olmadığı bir ada, güvenin olmadığı bir soruşturma... Leonardo DiCaprio, fırtınanın ortasında kaybolan bir akıl hastasının peşindeyken, gerçeklik algısının nasıl paramparça olduğunu dehşetle fark edecek.",
    theaters: [{ salon: "Salon 1 (IMAX)", hours: ["11:00", "16:00", "21:30"] }],
    comments: [{ user: "SinemaTutkunu", text: "Scorsese ve DiCaprio iş birliği yine muazzam.", star: 5 }]
  },
  { 
    id: 5, slug: "jumanji", title: "Jumanji: Yeni Seviye", genre: "Macera / Komedi",
    image: "https://images8.alphacoders.com/105/1054522.jpg",
    director: "Jake Kasdan", releaseDate: "19 Mart 2026",
    summary: "Oyun sizi değil, siz oyunu bitirmek zorundasınız! Ekip bu kez sadece hayatta kalmak için değil, bozulan sistemi düzeltmek için karlı dağlardan kızgın çöllere savruluyor. Kemerlerinizi bağlayın, yeni seviye çok tehlikeli!",
    theaters: [{ salon: "Salon 4", hours: ["12:30", "15:30", "18:30"] }],
    comments: [{ user: "Eğlence", text: "Ailece izlenecek en iyi macera.", star: 4 }]
  },
  { 
    id: 6, slug: "labirent", title: "Labirent: Ölümcül Kaçış", genre: "Bilim Kurgu / Aksiyon",
    image: "https://images7.alphacoders.com/514/514330.jpg",
    director: "Wes Ball", releaseDate: "20 Mart 2026",
    summary: "Hatıralar silindi, duvarlar yükseldi. Thomas ve bir grup genç, her sabah şekil değiştiren devasa bir labirentin ortasında uyanır. Labirentin sırrını çözmek ya da içinde ölmek arasında tek bir fark var: Cesaret.",
    theaters: [{ salon: "Salon 3", hours: ["14:00", "19:00", "22:00"] }],
    comments: [{ user: "Survivor", text: "Tempo bir saniye bile durmuyor.", star: 4 }]
  },
  { 
    id: 7, slug: "aclik-oyunları", title: "Açlık Oyunları", genre: "Distopya / Aksiyon",
    image: "https://images3.alphacoders.com/267/267954.jpg",
    director: "Gary Ross", releaseDate: "21 Mart 2026",
    summary: "Açlık bir ceza, oyunlar bir ibret! 12 mıntıka, her yıl 24 kurban ve tek bir kazanan. Katniss Everdeen, sadece hayatta kalmak için değil, bu adaletsiz düzeni yıkacak ateşi yakmak için arenaya giriyor.",
    theaters: [{ salon: "Salon 2", hours: ["13:00", "17:00", "21:00"] }],
    comments: [{ user: "AlaycıKuş", text: "Jennifer Lawrence rolüyle devleşmiş.", star: 5 }]
  },
  { 
    id: 8, slug: "katliam-gecesi", title: "Katliam Gecesi", genre: "Korku / Gerilim",
    image: "https://m.media-amazon.com/images/M/MV5BMjI3Mzg3NTE3OV5BMl5BanBnXkFtZTcwNjIyODcxOQ@@._V1_.jpg",
    director: "James DeMonaco", releaseDate: "22 Mart 2026",
    summary: "12 saat boyunca hiçbir kural yok, hiçbir yardım yok. Amerika'da yılda bir gece tüm suçlar serbest bırakılıyor. Komşularınızın size gülümseyen maskelerinin altındaki gerçek yüzleriyle tanışmaya hazır mısınız?",
    theaters: [{ salon: "Salon 6", hours: ["23:00", "01:00"] }],
    comments: [{ user: "GerilimHattı", text: "Fikri bile korkutmaya yetiyor.", star: 4 }]
  },
  { 
    id: 9, slug: "uyumsuz", title: "Uyumsuz", genre: "Bilim Kurgu / Macera",
    image: "https://images5.alphacoders.com/488/488138.jpg",
    director: "Neil Burger", releaseDate: "23 Mart 2026",
    summary: "Dünya gruplara ayrıldı: Fedakarlık, Dostluk, Dürüstlük, Bilgelik ve Cesaret. Ama Tris hiçbir gruba ait değil. O bir Uyumsuz ve sistemin en büyük korkusu. Kuralları yıkanların hikayesi başlıyor!",
    theaters: [{ salon: "Salon 4", hours: ["15:00", "20:00"] }],
    comments: [{ user: "Rebel", text: "Farklı olmak suç değil, güçtür!", star: 4 }]
  },
  { 
    id: 10, slug: "sherlock-holmes", title: "Sherlock Holmes", genre: "Gizem / Aksiyon",
    image: "https://images.alphacoders.com/225/225134.jpg",
    director: "Guy Ritchie", releaseDate: "24 Mart 2026",
    summary: "Zeka hiç bu kadar tehlikeli olmamıştı. Robert Downey Jr. ve Jude Law, Viktorya dönemi Londra'sında mistik bir komplonun izini sürüyor. Mantık, hız ve muazzam bir mizah anlayışı bir arada!",
    theaters: [{ salon: "Salon 1 (IMAX)", hours: ["13:00", "18:00", "22:30"] }],
    comments: [{ user: "BakerStreet", text: "Efsanevi karakterin en modern hali.", star: 5 }]
  },
  { 
    id: 11, slug: "dangal", title: "Dangal", genre: "Biyografi / Dram",
    image: "https://m.media-amazon.com/images/M/MV5BMTQ4MzQzMzM2Nl5BMl5BanBnXkFtZTgwMTQ1NzU3MDI@._V1_.jpg",
    director: "Nitesh Tiwari", releaseDate: "25 Mart 2026",
    summary: "Altın madalyayı bir oğlan getirebilir ama bir kız çocuğu da tarih yazabilir. Eski bir güreşçinin kızlarını olimpiyat şampiyonu yapmak için verdiği unutulmaz mücadele. Kalbinize dokunacak gerçek bir zafer öyküsü.",
    theaters: [{ salon: "Salon 2", hours: ["11:30", "16:30", "20:30"] }],
    comments: [{ user: "BabaHayali", text: "İzlediğim en ilham verici film.", star: 5 }]
  }
];

// --- BİLEŞENLER ---

const Navbar = () => (
  <nav style={{ 
    width: "100%", height: "70px", background: "linear-gradient(to bottom, rgba(0,0,0,0.9), transparent)", 
    display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 50px", 
    position: "fixed", top: 0, zIndex: 1000 
  }}>
    <NavLink to="/" style={{ color: "#E50914", fontSize: "2rem", fontWeight: "900", textDecoration: "none", letterSpacing: "2px" }}>SİNEVİZYON</NavLink>
    <div style={{ display: "flex", gap: "30px" }}>
      <NavLink to="/" style={({ isActive }) => ({ color: isActive ? "#E50914" : "white", textDecoration: "none", fontWeight: "bold" })}>ANA SAYFA</NavLink>
      <NavLink to="/filmler" style={({ isActive }) => ({ color: isActive ? "#E50914" : "white", textDecoration: "none", fontWeight: "bold" })}>FİLMLER</NavLink>
    </div>
  </nav>
);

const Home = () => (
  <div style={{ 
    width: "100vw", height: "100vh", background: "url('https://images.alphacoders.com/133/1338423.png') center/cover", 
    display: "flex", flexDirection: "column", justifyContent: "center", paddingLeft: "80px", backgroundAttachment: "fixed" 
  }}>
    <div style={{ maxWidth: "600px", background: "rgba(0,0,0,0.4)", padding: "30px", borderRadius: "10px", backdropFilter: "blur(5px)" }}>
      <h1 style={{ fontSize: "5rem", fontWeight: "900", lineHeight: "1" }}>SINIRSIZ<br/><span style={{ color: "#E50914" }}>SİNEMA</span></h1>
      <p style={{ fontSize: "1.3rem", margin: "20px 0", textShadow: "2px 2px 4px black" }}>Dünyanın en çok konuşulan yapımları, şimdi vizyonda ve tek bir tık uzağında.</p>
      <NavLink to="/filmler" style={{ 
        background: "#E50914", color: "white", padding: "15px 40px", borderRadius: "5px", 
        textDecoration: "none", fontWeight: "bold", fontSize: "1.1rem", display: "inline-block" 
      }}>KEŞFETMEYE BAŞLA</NavLink>
    </div>
  </div>
);

const MovieList = ({ movies }) => (
  <div style={{ width: "100%", minHeight: "100vh", paddingTop: "100px", paddingBottom: "50px", background: "#141414" }}>
    <h2 style={{ padding: "0 50px", marginBottom: "30px", fontSize: "2rem" }}>Şu An Vizyonda</h2>
    <div style={{ 
      display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", 
      gap: "20px", padding: "0 50px" 
    }}>
      {movies.map(movie => (
        <NavLink key={movie.id} to={`/film/${movie.slug}`} style={{ textDecoration: "none" }}>
          <div style={{ 
            background: "#181818", borderRadius: "8px", overflow: "hidden", 
            transition: "all 0.3s", border: "1px solid #333" 
          }} onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"} onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}>
            <img src={movie.image} alt={movie.title} style={{ width: "100%", height: "400px", objectFit: "cover" }} />
            <div style={{ padding: "15px" }}>
              <span style={{ color: "#E50914", fontSize: "0.8rem", fontWeight: "bold" }}>{movie.genre}</span>
              <h3 style={{ margin: "5px 0", color: "white" }}>{movie.title}</h3>
            </div>
          </div>
        </NavLink>
      ))}
    </div>
  </div>
);

const MovieDetail = ({ movies, setMovies }) => {
  const { filmSlug } = useParams();
  const navigate = useNavigate();
  const movie = movies.find(m => m.slug === filmSlug);
  const [form, setForm] = useState({ user: "", text: "", star: "5" });

  if (!movie) return <div style={{ paddingTop: "100px", textAlign: "center" }}><h1>Film Bulunamadı</h1></div>;

  const handleComment = (e) => {
    e.preventDefault();
    const updated = movies.map(m => m.id === movie.id ? { ...m, comments: [...m.comments, { ...form, star: parseInt(form.star) }] } : m);
    setMovies(updated);
    setForm({ user: "", text: "", star: "5" });
  };

  return (
    <div style={{ width: "100%", minHeight: "100vh", background: "#0a0a0a", paddingTop: "100px" }}>
      {/* Banner */}
      <div style={{ 
        width: "100%", height: "50vh", background: `linear-gradient(to top, #0a0a0a, transparent), url(${movie.image}) center/cover`,
        display: "flex", alignItems: "flex-end", padding: "50px" 
      }}>
        <h1 style={{ fontSize: "4rem", fontWeight: "900", textShadow: "4px 4px 10px black" }}>{movie.title}</h1>
      </div>

      <div style={{ padding: "50px", display: "grid", gridTemplateColumns: "2fr 1fr", gap: "60px" }}>
        {/* Sol Kolon: Detaylar */}
        <div>
          <div style={{ display: "flex", gap: "20px", marginBottom: "30px" }}>
            <span style={{ color: "#E50914", fontWeight: "bold", border: "1px solid #E50914", padding: "5px 15px", borderRadius: "20px" }}>{movie.genre}</span>
            <span style={{ color: "#aaa" }}>Vizyon: {movie.releaseDate}</span>
            <span style={{ color: "#aaa" }}>Yönetmen: {movie.director}</span>
          </div>
          <p style={{ fontSize: "1.4rem", lineHeight: "1.6", color: "#ddd" }}>{movie.summary}</p>
          
          <div style={{ marginTop: "50px", background: "#181818", padding: "30px", borderRadius: "10px" }}>
            <h3 style={{ color: "#E50914", marginBottom: "20px" }}>📍 GÖSTERİM & SALON BİLGİLERİ</h3>
            {movie.theaters.map((t, i) => (
              <div key={i} style={{ marginBottom: "20px" }}>
                <strong style={{ fontSize: "1.2rem" }}>{t.salon}</strong>
                <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                  {t.hours.map(h => <span key={h} style={{ background: "#E50914", padding: "8px 20px", borderRadius: "4px", fontWeight: "bold" }}>{h}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sağ Kolon: Yorumlar */}
        <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
          <div style={{ background: "#181818", padding: "30px", borderRadius: "10px" }}>
            <h3>Puanla & Yorumla</h3>
            <form onSubmit={handleComment} style={{ display: "flex", flexDirection: "column", gap: "15px", marginTop: "20px" }}>
              <input type="text" placeholder="Adınız" value={form.user} onChange={e => setForm({...form, user: e.target.value})} required style={{ padding: "12px", background: "#333", border: "none", color: "white", borderRadius: "4px" }} />
              <select value={form.star} onChange={e => setForm({...form, star: e.target.value})} style={{ padding: "12px", background: "#333", border: "none", color: "white", borderRadius: "4px" }}>
                {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} Yıldız</option>)}
              </select>
              <textarea placeholder="Düşünceleriniz..." value={form.text} onChange={e => setForm({...form, text: e.target.value})} required style={{ padding: "12px", background: "#333", border: "none", color: "white", borderRadius: "4px", height: "100px" }} />
              <button type="submit" style={{ background: "#E50914", color: "white", padding: "12px", border: "none", borderRadius: "4px", fontWeight: "bold", cursor: "pointer" }}>GÖNDER</button>
            </form>
          </div>

          <div style={{ background: "#181818", padding: "30px", borderRadius: "10px" }}>
            <h3>Son Yorumlar</h3>
            {movie.comments.map((c, i) => (
              <div key={i} style={{ borderBottom: "1px solid #333", padding: "15px 0" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <strong>{c.user}</strong>
                  <span style={{ color: "#ffcc00" }}>{"★".repeat(c.star)}</span>
                </div>
                <p style={{ color: "#aaa", marginTop: "10px", fontSize: "0.9rem" }}>"{c.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- MAIN APP ---

export default function App() {
  const [movies, setMovies] = useState(INITIAL_MOVIES);

  return (
    <Router>
      <GlobalStyle />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/filmler" element={<MovieList movies={movies} />} />
        <Route path="/film/:filmSlug" element={<MovieDetail movies={movies} setMovies={setMovies} />} />
        <Route path="*" element={<div style={{ textAlign: "center", paddingTop: "150px" }}><h1>404 - Sayfa Bulunamadı</h1><NavLink to="/" style={{ color: "#E50914" }}>Ana Sayfaya Dön</NavLink></div>} />
      </Routes>
    </Router>
  );
}