import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

// ── Types ──────────────────────────────────────────────────────────────────────
type Section = "home" | "about" | "teachers" | "schedule" | "parents" | "contacts" | "news";

// ── Data ───────────────────────────────────────────────────────────────────────
const NAV_ITEMS: { id: Section; label: string }[] = [
  { id: "home", label: "Главная" },
  { id: "about", label: "О школе" },
  { id: "teachers", label: "Учителя" },
  { id: "schedule", label: "Расписание" },
  { id: "parents", label: "Родителям" },
  { id: "news", label: "Новости" },
  { id: "contacts", label: "Контакты" },
];

const TEACHERS = [
  { name: "Иванова Мария Сергеевна", subject: "Математика", emoji: "📐", exp: "18 лет" },
  { name: "Петров Алексей Владимирович", subject: "История", emoji: "📜", exp: "12 лет" },
  { name: "Сидорова Елена Николаевна", subject: "Русский язык", emoji: "✍️", exp: "22 года" },
  { name: "Кузнецова Анна Дмитриевна", subject: "Биология", emoji: "🌿", exp: "9 лет" },
  { name: "Морозов Игорь Павлович", subject: "Физика", emoji: "⚛️", exp: "15 лет" },
  { name: "Волкова Татьяна Ивановна", subject: "Английский язык", emoji: "🌍", exp: "11 лет" },
];

const NEWS = [
  { date: "20 мая 2026", title: "Итоги городской олимпиады по математике", tag: "Достижения", emoji: "🏆" },
  { date: "15 мая 2026", title: "День открытых дверей для будущих первоклассников", tag: "Мероприятия", emoji: "🚪" },
  { date: "8 мая 2026", title: "Праздничный концерт ко Дню Победы", tag: "Культура", emoji: "🎗️" },
  { date: "1 мая 2026", title: "Весенний субботник: школьный двор стал ещё красивее", tag: "Жизнь школы", emoji: "🌸" },
];

const SCHEDULE = [
  { time: "08:00", lesson: "1 урок", duration: "45 мин" },
  { time: "08:50", lesson: "2 урок", duration: "45 мин" },
  { time: "09:45", lesson: "3 урок", duration: "45 мин" },
  { time: "10:40", lesson: "4 урок", duration: "45 мин" },
  { time: "11:35", lesson: "5 урок", duration: "45 мин" },
  { time: "12:30", lesson: "6 урок", duration: "45 мин" },
  { time: "13:25", lesson: "7 урок", duration: "45 мин" },
];



// ── Stars ──────────────────────────────────────────────────────────────────────
function Stars() {
  const stars = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    duration: `${2 + Math.random() * 4}s`,
    delay: `${Math.random() * 4}s`,
    size: Math.random() > 0.7 ? 4 : 2,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {stars.map((s) => (
        <div
          key={s.id}
          className="star"
          style={{
            top: s.top,
            left: s.left,
            width: s.size,
            height: s.size,
            "--duration": s.duration,
            "--delay": s.delay,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

// ── Login Modal ────────────────────────────────────────────────────────────────
function LoginModal({ role, onClose }: { role: "teacher" | "parent"; onClose: () => void }) {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#0d1b3e] border border-amber-500/30 rounded-3xl p-8 w-full max-w-md animate-scale-in">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-orange-400 to-amber-500 rounded-t-3xl" />

        <button onClick={onClose} className="absolute top-4 right-4 text-amber-500/60 hover:text-amber-400 transition-colors">
          <Icon name="X" size={20} />
        </button>

        <div className="text-center mb-8">
          <div className="text-4xl mb-3">{role === "teacher" ? "👩‍🏫" : "👨‍👩‍👧"}</div>
          <h3 className="font-display text-2xl font-bold text-amber-400">
            {role === "teacher" ? "Кабинет учителя" : "Кабинет родителя"}
          </h3>
          <p className="text-slate-400 text-sm mt-1">Введите данные для входа</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs text-amber-500/70 uppercase tracking-widest mb-2 block">Логин</label>
            <input
              type="text"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              className="w-full bg-white/5 border border-amber-500/20 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
              placeholder="Введите логин"
            />
          </div>
          <div>
            <label className="text-xs text-amber-500/70 uppercase tracking-widest mb-2 block">Пароль</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-amber-500/20 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
              placeholder="Введите пароль"
            />
          </div>
          <button className="w-full bg-amber-500 hover:bg-amber-400 text-[#0d1b3e] font-bold py-3 rounded-xl transition-all duration-200 hover:scale-[1.02] mt-2">
            Войти
          </button>
          <p className="text-center text-slate-500 text-sm">
            Забыли пароль?{" "}
            <span className="text-amber-400 cursor-pointer hover:underline">Обратитесь к администратору</span>
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function Index() {
  const [activeSection, setActiveSection] = useState<Section>("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [loginModal, setLoginModal] = useState<"teacher" | "parent" | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      const sections = Object.entries(sectionRefs.current);
      for (const [id, el] of sections) {
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= 120 && rect.bottom >= 120) {
          setActiveSection(id as Section);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: Section) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const setRef = (id: string) => (el: HTMLElement | null) => {
    sectionRefs.current[id] = el;
  };

  return (
    <div className="mesh-bg min-h-screen relative">
      <Stars />

      {/* ── NAVBAR ─────────────────────────────────────────────────── */}
      <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        scrolled ? "bg-[#060e1f]/90 backdrop-blur-xl shadow-lg shadow-black/20" : ""
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            <button onClick={() => scrollTo("home")} className="flex items-center gap-3 group">
              <div className="relative">
                <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center font-bold text-[#060e1f] text-lg transition-transform group-hover:scale-110">
                  А
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-400 rounded-full animate-pulse" />
              </div>
              <div className="hidden sm:block">
                <div className="font-display text-amber-400 font-bold text-lg leading-tight">Антарес</div>
                <div className="text-[10px] text-slate-400 leading-tight tracking-wider uppercase">СОШ №2 · Партизанск</div>
              </div>
            </button>

            <div className="hidden lg:flex items-center gap-6">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className={`nav-link text-sm font-medium transition-colors ${
                    activeSection === item.id ? "text-amber-400 active" : "text-slate-300 hover:text-amber-300"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => setLoginModal("teacher")}
                className="flex items-center gap-2 bg-white/5 hover:bg-amber-500/10 border border-white/10 hover:border-amber-500/40 px-3 py-2 rounded-xl text-sm text-slate-300 hover:text-amber-300 transition-all duration-200"
              >
                <Icon name="GraduationCap" size={15} />
                <span>Учитель</span>
              </button>
              <button
                onClick={() => setLoginModal("parent")}
                className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 px-3 py-2 rounded-xl text-sm font-semibold text-[#060e1f] transition-all duration-200 hover:scale-105"
              >
                <Icon name="Users" size={15} />
                <span>Родитель</span>
              </button>
            </div>

            <button
              className="lg:hidden text-slate-300 hover:text-amber-400 transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <Icon name={menuOpen ? "X" : "Menu"} size={24} />
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="lg:hidden bg-[#060e1f]/95 backdrop-blur-xl border-t border-white/5 px-4 py-4">
            <div className="flex flex-col gap-1">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className={`text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    activeSection === item.id
                      ? "bg-amber-500/10 text-amber-400"
                      : "text-slate-300 hover:text-amber-300 hover:bg-white/5"
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <div className="border-t border-white/10 mt-2 pt-2 flex gap-2">
                <button onClick={() => setLoginModal("teacher")} className="flex-1 bg-white/5 border border-white/10 py-2 rounded-xl text-sm text-slate-300">
                  👩‍🏫 Учитель
                </button>
                <button onClick={() => setLoginModal("parent")} className="flex-1 bg-amber-500 py-2 rounded-xl text-sm font-semibold text-[#060e1f]">
                  👨‍👩‍👧 Родитель
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* ── HERO ───────────────────────────────────────────────────── */}
      <section ref={setRef("home")} className="relative min-h-screen flex items-center pt-20">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-10 pointer-events-none">
          <div className="w-full h-full border-2 border-amber-500 rounded-full animate-rotate-slow" />
          <div className="absolute inset-8 border border-amber-400/50 rounded-full" />
          <div className="absolute inset-16 border border-sky-400/30 rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-4 py-2 rounded-full text-amber-400 text-sm mb-8 animate-fade-in-up">
              <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
              Официальный сайт школы
            </div>

            <h1 className="font-display text-6xl sm:text-7xl md:text-8xl font-bold leading-none mb-6 animate-fade-in-up delay-100">
              <span className="text-white">МБОУ</span>{" "}
              <span className="text-gold-gradient">СОШ №2</span>
              <br />
              <span className="text-white italic">«Антарес»</span>
            </h1>

            <p className="text-slate-300 text-xl leading-relaxed mb-10 max-w-xl animate-fade-in-up delay-200">
              Школа, где каждый ребёнок — звезда. Основана в 1999 году. Мы верим в силу творчества,
              знаний и дружбы. Партизанск, Приморский край.
            </p>

            <div className="flex flex-wrap gap-4 animate-fade-in-up delay-300">
              <button
                onClick={() => scrollTo("about")}
                className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-[#060e1f] font-bold px-6 py-3 rounded-2xl transition-all duration-200 hover:scale-105 animate-pulse-glow"
              >
                Узнать больше
                <Icon name="ArrowRight" size={18} />
              </button>
              <button
                onClick={() => scrollTo("contacts")}
                className="flex items-center gap-2 border border-white/20 hover:border-amber-500/50 text-white hover:text-amber-300 px-6 py-3 rounded-2xl transition-all duration-200 hover:bg-white/5"
              >
                <Icon name="Phone" size={18} />
                Связаться с нами
              </button>
            </div>

            <div className="grid grid-cols-3 gap-6 mt-16 animate-fade-in-up delay-400">
              {[
                { value: "10+", label: "лет стажа" },
                { value: "200+", label: "учеников" },
                { value: "60+", label: "педагогов" },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <div className="font-display text-4xl font-bold text-gold-gradient">{s.value}</div>
                  <div className="text-slate-400 text-sm mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-500 text-xs animate-float">
          <span>Листайте вниз</span>
          <Icon name="ChevronDown" size={16} />
        </div>
      </section>

      {/* ── ABOUT ──────────────────────────────────────────────────── */}
      <section ref={setRef("about")} className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="section-divider w-full mb-16" />

          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="text-amber-500/60 text-xs uppercase tracking-widest mb-4 font-body">О нас</div>
              <h2 className="font-display text-5xl font-bold text-white mb-6 leading-tight">
                Школа с душой{" "}
                <span className="text-gold-gradient italic">и характером</span>
              </h2>
              <p className="text-slate-300 text-lg leading-relaxed mb-6">
                МБОУ СОШ №2 «Антарес» — образовательный центр города Партизанска, основанный 17 ноября 1999 года.
                Включает среднее образование, дошкольное воспитание и дополнительные программы на двух корпусах.
              </p>
              <p className="text-slate-400 leading-relaxed mb-4">
                Директор школы — <span className="text-amber-300 font-medium">Морозова Нэлли Викторовна</span>.
              </p>
              <p className="text-slate-400 leading-relaxed mb-8">
                Наша миссия — воспитать людей, способных мечтать и воплощать мечты в жизнь. Как звёзды
                Антареса, наши ученики ярко светят в любой области.
              </p>
              <div className="flex flex-wrap gap-3">
                {["Творчество", "Наука", "Спорт", "Дружба", "Культура"].map((tag) => (
                  <span key={tag} className="bg-amber-500/10 border border-amber-500/20 text-amber-300 px-3 py-1 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { emoji: "🏫", title: "Современные классы", desc: "Оснащённые лаборатории и мастерские" },
                { emoji: "🎓", title: "Опытные педагоги", desc: "Средний стаж — 15 лет" },
                { emoji: "🏆", title: "Победители олимпиад", desc: "Краевые и федеральные награды" },
                { emoji: "🌟", title: "Атмосфера роста", desc: "Каждый ребёнок раскрывает потенциал" },
              ].map((card) => (
                <div key={card.title} className="bg-white/3 border border-white/10 rounded-2xl p-5 card-hover">
                  <div className="text-3xl mb-3">{card.emoji}</div>
                  <div className="font-semibold text-white text-sm mb-1">{card.title}</div>
                  <div className="text-slate-400 text-xs">{card.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TEACHERS ───────────────────────────────────────────────── */}
      <section ref={setRef("teachers")} className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="section-divider w-full mb-16" />

          <div className="text-center mb-14">
            <div className="text-amber-500/60 text-xs uppercase tracking-widest mb-4">Педагогический состав</div>
            <h2 className="font-display text-5xl font-bold text-white">
              Наши <span className="text-gold-gradient italic">учителя</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {TEACHERS.map((t) => (
              <div key={t.name} className="group bg-white/3 border border-white/10 hover:border-amber-500/30 rounded-3xl p-6 card-hover cursor-pointer">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-110 transition-transform">
                    {t.emoji}
                  </div>
                  <div>
                    <div className="font-semibold text-white text-sm leading-snug mb-1">{t.name}</div>
                    <div className="text-amber-400 text-sm font-medium">{t.subject}</div>
                    <div className="text-slate-500 text-xs mt-1">Стаж: {t.exp}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <button className="border border-amber-500/30 text-amber-400 hover:bg-amber-500/10 px-6 py-3 rounded-2xl text-sm transition-all duration-200">
              Весь педагогический состав →
            </button>
          </div>
        </div>
      </section>

      {/* ── SCHEDULE ───────────────────────────────────────────────── */}
      <section ref={setRef("schedule")} className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="section-divider w-full mb-16" />

          <div className="grid md:grid-cols-2 gap-16 items-start">
            <div>
              <div className="text-amber-500/60 text-xs uppercase tracking-widest mb-4">Организация учёбы</div>
              <h2 className="font-display text-5xl font-bold text-white mb-6 leading-tight">
                Расписание <span className="text-gold-gradient italic">звонков</span>
              </h2>
              <p className="text-slate-400 mb-8">
                Уроки начинаются в 8:00. Между уроками — перемены от 5 до 20 минут.
              </p>

              <div className="space-y-2">
                {SCHEDULE.map((s, i) => (
                  <div key={s.time} className="flex items-center gap-4 bg-white/3 border border-white/8 rounded-2xl px-5 py-4 transition-all hover:border-amber-500/30 hover:bg-amber-500/5">
                    <div className="w-8 h-8 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-400 font-bold text-sm flex-shrink-0">
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <div className="text-white text-sm font-medium">{s.lesson}</div>
                    </div>
                    <div className="text-amber-400 font-mono text-sm">{s.time}</div>
                    <div className="text-slate-500 text-xs">{s.duration}</div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="bg-white/3 border border-amber-500/20 rounded-3xl p-8">
                <h3 className="font-display text-2xl font-bold text-amber-400 mb-6">📅 Учебный год</h3>
                <div className="space-y-4">
                  {[
                    { period: "I четверть", dates: "сентябрь — октябрь" },
                    { period: "II четверть", dates: "ноябрь — декабрь" },
                    { period: "III четверть", dates: "январь — март" },
                    { period: "IV четверть", dates: "апрель — май" },
                  ].map((q) => (
                    <div key={q.period} className="flex justify-between items-center py-3 border-b border-white/8 last:border-0">
                      <span className="text-white text-sm font-medium">{q.period}</span>
                      <span className="text-slate-400 text-sm">{q.dates}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
                  <div className="flex items-center gap-2 text-amber-400 text-sm font-medium mb-2">
                    <Icon name="Info" size={16} />
                    Полное расписание
                  </div>
                  <p className="text-slate-400 text-xs">
                    Расписание уроков по классам доступно в личных кабинетах учителей и родителей.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PARENTS ────────────────────────────────────────────────── */}
      <section ref={setRef("parents")} className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="section-divider w-full mb-16" />

          <div className="text-center mb-14">
            <div className="text-amber-500/60 text-xs uppercase tracking-widest mb-4">Для семьи</div>
            <h2 className="font-display text-5xl font-bold text-white">
              Родителям <span className="text-gold-gradient italic">и опекунам</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {[
              { emoji: "📋", title: "Документы и справки", desc: "Все необходимые формы и бланки для оформления", link: "Перейти" },
              { emoji: "💰", title: "Питание в школе", desc: "Меню и оплата школьного питания онлайн", link: "Подробнее" },
              { emoji: "🏥", title: "Медицинская служба", desc: "График работы медкабинета и контакты врача", link: "Контакты" },
              { emoji: "📞", title: "Родительский комитет", desc: "Состав и контакты комитета вашего класса", link: "Список" },
              { emoji: "📊", title: "Успеваемость", desc: "Войдите в личный кабинет для просмотра оценок", link: "Войти" },
              { emoji: "📅", title: "Родительские собрания", desc: "Расписание собраний на текущий учебный год", link: "Расписание" },
            ].map((card) => (
              <div key={card.title} className="group bg-white/3 border border-white/10 hover:border-amber-500/30 rounded-3xl p-6 card-hover cursor-pointer">
                <div className="text-3xl mb-4">{card.emoji}</div>
                <h3 className="text-white font-semibold mb-2">{card.title}</h3>
                <p className="text-slate-400 text-sm mb-4 leading-relaxed">{card.desc}</p>
                <span className="text-amber-400 text-sm group-hover:underline flex items-center gap-1">
                  {card.link} <Icon name="ArrowRight" size={14} />
                </span>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/5 border border-amber-500/20 rounded-3xl p-8 text-center">
            <div className="text-4xl mb-4">🔐</div>
            <h3 className="font-display text-3xl font-bold text-white mb-3">Личный кабинет родителя</h3>
            <p className="text-slate-300 mb-6 max-w-lg mx-auto">
              Оценки, расписание, уведомления об отсутствии и связь с классным руководителем — всё в одном месте.
            </p>
            <button
              onClick={() => setLoginModal("parent")}
              className="bg-amber-500 hover:bg-amber-400 text-[#060e1f] font-bold px-8 py-3 rounded-2xl transition-all duration-200 hover:scale-105 inline-flex items-center gap-2"
            >
              <Icon name="LogIn" size={18} />
              Войти в кабинет
            </button>
          </div>
        </div>
      </section>

      {/* ── NEWS ───────────────────────────────────────────────────── */}
      <section ref={setRef("news")} className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="section-divider w-full mb-16" />

          <div className="flex items-end justify-between mb-14">
            <div>
              <div className="text-amber-500/60 text-xs uppercase tracking-widest mb-4">Жизнь школы</div>
              <h2 className="font-display text-5xl font-bold text-white">
                Новости <span className="text-gold-gradient italic">и события</span>
              </h2>
            </div>
            <button className="hidden md:flex items-center gap-2 border border-white/10 hover:border-amber-500/30 text-slate-400 hover:text-amber-300 px-4 py-2 rounded-xl text-sm transition-all">
              Все новости <Icon name="ArrowRight" size={14} />
            </button>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {NEWS.map((news) => (
              <div key={news.title} className="group bg-white/3 border border-white/10 hover:border-amber-500/30 rounded-3xl p-6 card-hover cursor-pointer">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0">
                    {news.emoji}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-amber-500/10 text-amber-400 text-xs px-2 py-0.5 rounded-full">{news.tag}</span>
                      <span className="text-slate-500 text-xs">{news.date}</span>
                    </div>
                    <h3 className="text-white font-medium leading-snug group-hover:text-amber-300 transition-colors">
                      {news.title}
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACTS ───────────────────────────────────────────────── */}
      <section ref={setRef("contacts")} className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="section-divider w-full mb-16" />

          <div className="text-center mb-14">
            <div className="text-amber-500/60 text-xs uppercase tracking-widest mb-4">Связаться с нами</div>
            <h2 className="font-display text-5xl font-bold text-white">
              Контактная <span className="text-gold-gradient italic">информация</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              {[
                { icon: "MapPin", title: "Корпус 1", value: "г. Партизанск, ул. Садовая, 2", sub: "692864, Приморский край" },
                { icon: "MapPin", title: "Корпус 2", value: "г. Партизанск, ул. Лазо, 6", sub: "Приморский край" },
                { icon: "Phone", title: "Телефоны", value: "+7 (42363) 6-76-53  •  6-70-29  •  6-56-71", sub: "Пн–Пт 8:00–17:00" },
                { icon: "Mail", title: "Электронная почта", value: "antares.pgo@gmail.com", sub: "Ответ в течение 1 рабочего дня" },
                { icon: "Clock", title: "Режим работы", value: "Пн–Пт: 7:30 – 18:00", sub: "Сб–Вс: выходной" },
              ].map((c) => (
                <div key={c.title} className="flex items-start gap-4 bg-white/3 border border-white/10 rounded-2xl p-5 card-hover">
                  <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon name={c.icon as "MapPin"} size={18} className="text-amber-400" />
                  </div>
                  <div>
                    <div className="text-slate-400 text-xs mb-0.5">{c.title}</div>
                    <div className="text-white font-medium text-sm">{c.value}</div>
                    <div className="text-slate-500 text-xs">{c.sub}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white/3 border border-amber-500/20 rounded-3xl p-8">
              <h3 className="font-display text-2xl font-bold text-amber-400 mb-6">Написать нам</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-amber-500/70 uppercase tracking-widest mb-2 block">Ваше имя</label>
                  <input
                    type="text"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
                    placeholder="Иван Петров"
                  />
                </div>
                <div>
                  <label className="text-xs text-amber-500/70 uppercase tracking-widest mb-2 block">Телефон или Email</label>
                  <input
                    type="text"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
                    placeholder="+7 (xxx) xxx-xx-xx"
                  />
                </div>
                <div>
                  <label className="text-xs text-amber-500/70 uppercase tracking-widest mb-2 block">Сообщение</label>
                  <textarea
                    rows={4}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors resize-none"
                    placeholder="Ваш вопрос или предложение..."
                  />
                </div>
                <button className="w-full bg-amber-500 hover:bg-amber-400 text-[#060e1f] font-bold py-3 rounded-xl transition-all duration-200 hover:scale-[1.02]">
                  Отправить сообщение
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────────── */}
      <footer className="border-t border-white/8 py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center font-bold text-[#060e1f] text-lg">А</div>
              <div>
                <div className="font-display text-amber-400 font-bold">МБОУ СОШ №2 «Антарес»</div>
                <div className="text-slate-500 text-xs">г. Партизанск, Приморский край</div>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 justify-center">
              {NAV_ITEMS.slice(0, 5).map((item) => (
                <button key={item.id} onClick={() => scrollTo(item.id)} className="text-slate-500 hover:text-amber-400 text-sm transition-colors">
                  {item.label}
                </button>
              ))}
            </div>
            <div className="text-slate-600 text-xs text-center md:text-right">
              © 2026 МБОУ СОШ №2 «Антарес»<br />
              Все права защищены
            </div>
          </div>
        </div>
      </footer>

      {/* ── LOGIN MODAL ────────────────────────────────────────────── */}
      {loginModal && (
        <LoginModal role={loginModal} onClose={() => setLoginModal(null)} />
      )}
    </div>
  );
}