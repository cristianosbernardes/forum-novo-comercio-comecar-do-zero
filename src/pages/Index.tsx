import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CheckCircle2, XCircle, Loader2, Calendar, MapPin, ArrowRight,
  Users, TrendingUp, ShoppingCart, Shield, Instagram,
  Plus, Minus, Zap, Target, Lightbulb, Star,
  Search, Package, BarChart3, EyeOff,
} from "lucide-react";
import { z } from "zod";
import carlosSpeaker from "@/assets/carlos-speaker.webp";
import carlosHeroBg from "@/assets/carlos-hero-bg.webp";

/* ═══════════════════════════════════════════
   DATA — Variante "Começar do Zero / Investir"
   ═══════════════════════════════════════════ */

const GOOGLE_SHEETS_URL = "https://script.google.com/macros/s/AKfycbzLoNJYoomxlHgKhn-9LgXK2t4hcDkuUK5p4Gps9Mof7gDNtpZ2n-_KzrRvDgar350V/exec";

const contactSchema = z.object({
  nome: z.string().trim().min(2, "Preencha seu nome completo"),
  email: z.string().trim().email("Digite um e-mail válido"),
  telefone: z.string().trim().min(14, "Digite um telefone válido com DDD"),
});

/* 7 perguntas — qualificação para público iniciante / investidor.
   Mantém triagem por investimento (redireciona quem ainda não pode investir p/ o método F.R.O). */
const multiStepQuestions = [
  {
    id: "momento",
    label: "Qual frase descreve melhor o seu momento hoje?",
    options: ["Quero começar meu primeiro negócio online", "Já tenho um negócio e quero expandir pro digital", "Quero investir em um novo negócio escalável", "Só estou pesquisando o assunto"],
    disqualify: ["Só estou pesquisando o assunto"],
  },
  {
    id: "produto",
    label: "Você já tem um produto ou nicho em mente para vender?",
    options: ["Sim, já sei o que quero vender", "Tenho algumas ideias", "Ainda não — quero descobrir no evento"],
    disqualify: [] as string[],
  },
  {
    id: "marketplaceExp",
    label: "Você já vendeu em algum marketplace (Mercado Livre, Shopee, Amazon)?",
    options: ["Já vendo hoje", "Já tentei, mas parei", "Nunca vendi — quero começar", "Não sei como funciona ainda"],
    disqualify: [] as string[],
  },
  {
    id: "objetivo",
    label: "Qual seu objetivo de renda nos próximos 12 meses com marketplaces?",
    options: ["Uma renda extra (até R$ 5k/mês)", "Uma nova fonte de renda (R$ 5k a R$ 20k/mês)", "Um negócio principal (R$ 20k a R$ 100k/mês)", "Uma operação em escala (acima de R$ 100k/mês)"],
    disqualify: [] as string[],
  },
  {
    id: "tempo",
    label: "Quanto tempo você consegue dedicar por semana ao novo negócio?",
    options: ["Algumas horas por semana", "Período parcial (meio turno)", "Dedicação integral"],
    disqualify: [] as string[],
  },
  {
    id: "investimento",
    label: "Quanto você consegue investir para iniciar sua operação (estoque + estrutura)?",
    options: ["Acima de R$ 50k", "Entre R$ 10k e R$ 50k", "Entre R$ 5k e R$ 10k", "Menos de R$ 5k por enquanto"],
    disqualify: ["Menos de R$ 5k por enquanto"],
  },
  {
    id: "interesse",
    label: "Você teria interesse em participar de um evento presencial em São Paulo para aprender a operar nos marketplaces?",
    options: ["Sim, quero garantir minha vaga", "Quero mais informações antes", "Apenas estou pesquisando"],
    disqualify: ["Apenas estou pesquisando"],
  },
];

const speakers = [
  { name: "Carlos Arantes", role: "CEO da UseVertice e CTA Marketing", bio: "Empresário com mais de 10 anos operando no mercado digital. Construiu operações reais nos maiores marketplaces do Brasil e já ajudou pessoas a saírem do absoluto zero ao primeiro milhão — inclusive foi pessoalmente à China validar fornecedores. Sem teoria. Só o que funciona na prática.", instagram: "https://www.instagram.com/carlosarantesm/", image: carlosSpeaker, imagePos: "center 0%" },
];

/* Dados de mercado COM FONTES — seção de credibilidade (diferencial desta variante) */
const marketStats = [
  { icon: ShoppingCart, value: "~80%", label: "DAS VENDAS ONLINE", desc: "do Brasil já passam pelos marketplaces" },
  { icon: Users, value: "85%+", label: "DOS COMPRADORES", desc: "brasileiros online já compraram em marketplaces" },
  { icon: BarChart3, value: "R$ 450 bi", label: "E-COMMERCE EM 2025", desc: "movimentados no comércio eletrônico brasileiro" },
  { icon: TrendingUp, value: "Dezenas de mi", label: "USUÁRIOS ATIVOS", desc: "só no Mercado Livre, todos os meses no Brasil" },
];

const marketSources = [
  "E-Commerce Brasil — crescimento do e-commerce e marketplaces",
  "BXTData — GMV do e-commerce brasileiro e marketshare",
  "E-Commerce Update — comportamento dos consumidores em marketplaces",
  "Exame — ranking dos maiores marketplaces do Brasil",
  "FGV IBRE — Indicador de vendas online no Brasil",
];

/* "Você NÃO precisa…" — quebra de objeção do público iniciante */
const naoPrecisa = [
  "Aparecer nas redes sociais",
  "Virar influencer",
  "Gravar vídeos todos os dias",
  "Dominar tráfego pago para começar",
  "Investir fortunas em anúncios",
  "Depender de seguidores",
];

/* "Tráfego Pronto" — o foco real da operação */
const trafegoFoco = [
  "Estratégia",
  "Produto certo",
  "Posicionamento",
  "Escala",
  "Estrutura profissional",
  "Operação inteligente",
];

const learnings = [
  { number: "01", title: "Como funciona o ecossistema dos marketplaces — do zero", subtitle: "O mapa do jogo", desc: "Entenda como Mercado Livre, Shopee, Amazon e Magalu realmente funcionam por dentro e onde estão as oportunidades reais para quem está começando agora.", icon: Search, bullets: ["Como os marketplaces operam", "Onde está o dinheiro", "Por onde começar"] },
  { number: "02", title: "Como encontrar o produto certo e validar oportunidades reais", subtitle: "Produto & Oportunidade", desc: "O método para escolher o que vender com demanda comprovada, sem achismo — mesmo que você ainda não tenha ideia de qual produto começar.", icon: Package, bullets: ["Pesquisa de demanda", "Precificação estratégica", "Validação sem risco"] },
  { number: "03", title: "Como estruturar uma operação profissional e vender em escala", subtitle: "Estrutura & Escala", desc: "Os sistemas e processos que transformam uma conta de vendedor em uma empresa de verdade — sem aparecer e sem depender de seguidores.", icon: TrendingUp, bullets: ["Operação silenciosa", "Processos e automação", "Crescimento previsível"] },
  { number: "04", title: "Avançado: importação da China, marca própria e tráfego pago", subtitle: "Próximo nível (opcional)", desc: "Depois que sua operação no marketplace está de pé, o caminho para multiplicar margem importando da China, criar marca própria e acelerar com anúncios — quando fizer sentido.", icon: Zap, bullets: ["Importação com segurança", "Marca própria & margem", "Tráfego pago como alavanca"] },
];

const outcomes = [
  { icon: EyeOff, title: "Enxergar o mercado invisível", desc: "Você vai entender o ecossistema dos marketplaces que movimenta bilhões e quase ninguém compreende — e onde estão as oportunidades reais hoje." },
  { icon: Target, title: "Direcionamento para começar", desc: "Sai do evento com um caminho definido: qual marketplace, qual produto e qual o próximo passo — mesmo partindo do zero." },
  { icon: CheckCircle2, title: "Estratégias já validadas", desc: "Não são teorias. São caminhos que já funcionaram para operadores reais — incluindo quem foi do zero ao primeiro milhão." },
  { icon: TrendingUp, title: "Visão de quem opera de verdade", desc: "Aprenda os bastidores com quem vende todos os dias nos maiores marketplaces do país, não com quem só fala sobre o assunto." },
];

const faqs = [
  { q: "Preciso já ter um negócio ou empresa para participar?", a: "Não. Este evento foi desenhado especialmente para quem quer começar do zero, investir em um novo negócio ou expandir para o digital. Você não precisa ter empresa, produto ou experiência prévia." },
  { q: "Preciso já vender online hoje?", a: "Não. A maior parte das pessoas que chega aqui ainda não vendeu nada online. Você vai aprender exatamente como dar o primeiro passo dentro dos marketplaces." },
  { q: "Vou precisar aparecer, gravar vídeos ou virar influencer?", a: "Não. O modelo de marketplace tem tráfego pronto: o cliente já está na plataforma. O foco é estratégia, produto e operação — não a sua imagem." },
  { q: "O evento é presencial ou online?", a: "O Fórum Novo Comércio é 100% presencial, em São Paulo. A experiência ao vivo, o networking e a imersão com operadores reais são parte essencial do resultado." },
  { q: "Quanto preciso investir para começar nos marketplaces?", a: "Dá para começar de forma enxuta e crescer com o reinvestimento. No evento você vai entender as faixas de investimento e como estruturar sua operação de acordo com a sua realidade." },
  { q: "Qual o horário e como funciona o credenciamento?", a: "Das 10h às 18h (1 dia intensivo). Após o cadastro, você recebe por e-mail todas as instruções de credenciamento, horários e o local exato. Chegue 30 min antes." },
];

/* Stats do evento */
const eventStats = [
  { icon: Users, value: "DO ZERO", label: "AO 1º MILHÃO", desc: "O caminho que já levou alunos do absoluto zero ao primeiro milhão" },
  { icon: TrendingUp, value: "OPERADORES", label: "REAIS NO PALCO", desc: "Aprenda com quem vive a operação dos maiores marketplaces" },
  { icon: MapPin, value: "SÃO PAULO", label: "PRESENCIAL", desc: "1 dia de imersão total no novo comércio digital" },
  { icon: Calendar, value: "24.07", label: "1 DIA INTENSIVO", desc: "8 horas para entrar no mercado que mais cresce no Brasil" },
];

const EVENT_DATE = new Date("2026-07-24T10:00:00");

/* ═══════════════════════════════════════════
   HOOKS & ANIMATIONS
   ═══════════════════════════════════════════ */

const useCountdown = () => {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    const calc = () => {
      const diff = EVENT_DATE.getTime() - Date.now();
      if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      return { days: Math.floor(diff / 86400000), hours: Math.floor((diff / 3600000) % 24), minutes: Math.floor((diff / 60000) % 60), seconds: Math.floor((diff / 1000) % 60) };
    };
    setTime(calc());
    const id = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(id);
  }, []);
  return time;
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } };
const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};

/* ═══════════════════════════════════════════
   VIDEO PLAYER — VSL style
   ═══════════════════════════════════════════ */

const VideoPlayer = () => {
  const [open, setOpen] = useState(false);
  const modalRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") handleClose(); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const v = modalRef.current;
    if (!v) return;
    v.currentTime = 0;
    v.muted = false;
    v.play().catch(() => {});
  }, [open]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => { modalRef.current?.pause(); setOpen(false); };

  return (
    <>
      {/* ── Inline silent preview ── */}
      <div
        className="relative cursor-pointer group rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-primary/10"
        style={{ maxWidth: 520, width: "100%", aspectRatio: "9/16" }}
        onClick={handleOpen}
      >
        <img
          src="/evento-poster.webp"
          alt="Última edição do Fórum Novo Comércio"
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-300" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent" />

        <div className="absolute top-4 left-4 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-sm border border-primary/30 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-primary text-[10px] font-body font-bold uppercase tracking-wider">Última Edição</span>
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            <span className="absolute inset-0 rounded-full bg-primary/40 animate-ping" style={{ animationDuration: "1.5s" }} />
            <span className="absolute inset-0 rounded-full bg-primary/20 animate-ping" style={{ animationDuration: "1.5s", animationDelay: "0.5s" }} />
            <div className="relative w-[72px] h-[72px] rounded-full bg-primary flex items-center justify-center shadow-2xl shadow-primary/60 group-hover:scale-110 transition-transform duration-300">
              <div className="ml-1.5" style={{ width: 0, height: 0, borderTop: "12px solid transparent", borderBottom: "12px solid transparent", borderLeft: "20px solid black" }} />
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 inset-x-0 p-5">
          <p className="font-display text-white text-base leading-tight">FÓRUM NOVO COMÉRCIO 2026</p>
          <p className="font-body text-white/50 text-xs mt-1">Clique para assistir com som</p>
        </div>
      </div>

      {/* ── Modal with sound ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            onClick={handleClose}
          >
            <div className="absolute inset-0 bg-black/92 backdrop-blur-md" />
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
              className="relative z-10 flex flex-col items-center gap-3 w-full"
              style={{ maxWidth: 420 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-full flex justify-end">
                <button
                  onClick={handleClose}
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white/60 hover:text-white font-body text-xs flex items-center gap-1.5"
                >
                  ✕ Fechar
                </button>
              </div>
              <div className="relative w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black" style={{ aspectRatio: "9/16", maxHeight: "78vh" }}>
                <video
                  ref={modalRef}
                  className="w-full h-full object-contain"
                  playsInline
                  controls
                  preload="none"
                  poster="/evento-poster.webp"
                >
                  <source src="/evento-video-720.webm" type="video/webm" />
                  <source src="/evento-video-720.mp4" type="video/mp4" />
                </video>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

/* ═══════════════════════════════════════════
   SUB-COMPONENTS
   ═══════════════════════════════════════════ */

const SectionLabel = ({ text }: { text: string }) => (
  <p className="flex items-center justify-center gap-2 text-primary font-body text-sm font-semibold uppercase tracking-[0.15em] mb-4">
    <span className="w-2 h-2 rounded-full bg-primary" />
    {text}
  </p>
);

const SectionHeading = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <h2 className={`font-display text-[clamp(1.5rem,4vw,2rem)] leading-[1.3] text-center ${className}`}>
    {children}
  </h2>
);

const CtaButton = ({ children, onClick, className = "" }: { children: React.ReactNode; onClick: () => void; className?: string }) => (
  <button
    onClick={onClick}
    className={`inline-flex items-center gap-3 bg-gradient-to-r from-[#b8860b] via-[#d4af37] to-[#f4df8e] text-primary-foreground font-body font-bold text-sm uppercase tracking-[0.1em] px-8 py-4 rounded hover:brightness-110 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 ${className}`}
  >
    {children}
    <ArrowRight className="w-5 h-5" />
  </button>
);

const SpeakerCard = ({ speaker: s }: { speaker: typeof speakers[0] }) => (
  <motion.div variants={scaleIn} className="group relative rounded-3xl overflow-hidden bg-[#111] border border-white/8 hover:border-primary/25 transition-all duration-500">
    <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-primary to-transparent z-20" />
    <div className="flex flex-col md:flex-row">
      <div className="relative md:w-[340px] md:flex-shrink-0 h-80 md:h-auto overflow-hidden">
        {s.image ? (
          <img
            src={s.image}
            alt={s.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
            style={{ objectPosition: (s as any).imagePos || "center top" }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-transparent">
            <span className="font-display text-7xl text-primary/15">{s.name.split(" ").map((n: string) => n[0]).join("")}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#111]/80 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-[#111]" />
      </div>

      <div className="flex-1 p-8 md:p-10 flex flex-col justify-center gap-5">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          <span className="font-body text-primary text-[11px] font-bold uppercase tracking-widest">Palestrante Principal</span>
        </div>

        <div>
          <h3 className="font-display text-3xl sm:text-4xl text-white leading-none">{s.name}</h3>
          <p className="text-primary font-body font-semibold text-sm mt-2">{s.role}</p>
        </div>

        <p className="font-body text-white/60 text-base leading-relaxed">{s.bio}</p>

        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "+10 anos", desc: "no mercado digital" },
            { label: "China", desc: "validou fornecedores pessoalmente" },
            { label: "R$1M+", desc: "alunos do zero ao 1º milhão" },
            { label: "Presencial", desc: "aprenda com quem opera" },
          ].map((c) => (
            <div key={c.label} className="bg-white/4 border border-white/6 rounded-xl px-4 py-3">
              <p className="font-display text-primary text-lg leading-none">{c.label}</p>
              <p className="font-body text-white/40 text-xs mt-1 leading-snug">{c.desc}</p>
            </div>
          ))}
        </div>

        <a
          href={s.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="self-start flex items-center gap-2 px-4 py-2 rounded-full bg-white/6 border border-white/10 hover:bg-primary/10 hover:border-primary/30 transition-all text-white/50 hover:text-white font-body text-sm"
        >
          <Instagram className="w-3.5 h-3.5" />
          @carlosarantesm
        </a>
      </div>
    </div>
  </motion.div>
);

const MarqueeBand = ({ reverse = false }: { reverse?: boolean }) => (
  <div className="relative overflow-hidden py-3">
    <div className={`flex ${reverse ? "animate-marquee-reverse" : "animate-marquee"} whitespace-nowrap`}>
      {Array.from({ length: 16 }).map((_, i) => (
        <span key={i} className="mx-6 font-display text-sm sm:text-base tracking-[0.1em] uppercase">
          <span className="text-primary">▼</span>
          <span className="text-white ml-3">GARANTA SUA VAGA</span>
          <span className="text-white/30 mx-3">·</span>
          <span className="text-white/70">7 PERGUNTAS</span>
          <span className="text-white/30 mx-3">·</span>
          <span className="text-primary">2 MINUTOS</span>
          <span className="inline-block mx-5 text-primary/60">▼</span>
        </span>
      ))}
    </div>
  </div>
);

const FaqItem = ({ item, isOpen, toggle }: { item: typeof faqs[0]; isOpen: boolean; toggle: () => void }) => (
  <motion.div variants={fadeUp} className={`border rounded-lg transition-all duration-300 ${isOpen ? "border-primary/40 bg-white/[0.03]" : "border-white/10 hover:border-white/20"}`}>
    <button onClick={toggle} className="w-full flex items-center justify-between p-5 text-left gap-4">
      <span className={`font-body font-semibold text-[15px] transition-colors ${isOpen ? "text-primary" : "text-white"}`}>{item.q}</span>
      <span className={`flex-shrink-0 w-7 h-7 rounded flex items-center justify-center transition-all ${isOpen ? "bg-primary text-black" : "bg-white/10 text-white/50"}`}>
        {isOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
      </span>
    </button>
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
          <p className="px-5 pb-5 text-sm text-white/50 font-body leading-relaxed">{item.a}</p>
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
);

/* ═══════════════════════════════════════════
   MULTI-STEP QUALIFICATION FORM
   ═══════════════════════════════════════════ */

const MultiStepForm = () => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [contact, setContact] = useState({ nome: "", email: "", telefone: "" });
  const [contactErrors, setContactErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const TOTAL_Q = multiStepQuestions.length;
  const qIndex = step - 1;
  const isQuestionStep = step >= 1 && step <= TOTAL_Q;

  const maskPhone = (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 11);
    if (d.length <= 2) return d.length ? `(${d}` : "";
    if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
    return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  };

  const sendToSheets = async (currentAnswers: Record<string, string>, qualified: boolean) => {
    if (!GOOGLE_SHEETS_URL) return;
    const dataHora = new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
    await fetch(GOOGLE_SHEETS_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        Data: dataHora,
        Origem: "LP Começar do Zero",
        Nome: contact.nome,
        "E-mail": contact.email,
        WhatsApp: contact.telefone,
        Status: qualified ? "Qualificado" : "Desqualificado",
        Momento: currentAnswers.momento || "",
        "Produto em mente": currentAnswers.produto || "",
        "Experiência marketplace": currentAnswers.marketplaceExp || "",
        "Objetivo 12 meses": currentAnswers.objetivo || "",
        "Tempo disponível": currentAnswers.tempo || "",
        "Investimento disponível": currentAnswers.investimento || "",
        "Vem no evento": currentAnswers.interesse || "",
      }),
    });
  };

  const trackLead = () => {
    if (typeof window.fbq === "function") {
      window.fbq("track", "Lead", { content_name: "Fórum Novo Comércio 2026 — Começar do Zero", content_category: "Evento", value: 0, currency: "BRL" });
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    const result = contactSchema.safeParse(contact);
    if (!result.success) {
      const fe: Record<string, string> = {};
      result.error.errors.forEach((err) => { if (err.path[0]) fe[err.path[0] as string] = err.message; });
      setContactErrors(fe);
      return;
    }
    setStep(1);
  };

  const handleOptionSelect = async (option: string) => {
    if (isSubmitting) return;
    const q = multiStepQuestions[qIndex];
    const nextAnswers = { ...answers, [q.id]: option };
    setAnswers(nextAnswers);

    if (q.disqualify.includes(option)) {
      setIsSubmitting(true);
      try { await sendToSheets(nextAnswers, false); trackLead(); } catch { /* segue mesmo se der erro */ }
      setIsSubmitting(false);
      setStep(TOTAL_Q + 1);
      return;
    }

    if (step === TOTAL_Q) {
      setIsSubmitting(true);
      try {
        await sendToSheets(nextAnswers, true);
        trackLead();
        navigate("/obrigado");
      } catch {
        setSubmitError("Erro ao enviar. Tente novamente.");
        setIsSubmitting(false);
      }
      return;
    }

    setStep(step + 1);
  };

  const handleContactChange = (field: "nome" | "email" | "telefone", value: string) => {
    if (field === "telefone") value = maskPhone(value);
    setContact((prev) => ({ ...prev, [field]: value }));
    if (contactErrors[field]) setContactErrors((prev) => { const n = { ...prev }; delete n[field]; return n; });
  };

  // Valida o e-mail apenas quando o lead sai do campo (blur): mostra erro se vazio
  // ou em formato inválido; limpa o erro se estiver correto.
  const handleEmailBlur = () => {
    const result = contactSchema.shape.email.safeParse(contact.email);
    setContactErrors((prev) => {
      if (!result.success) return { ...prev, email: result.error.errors[0]?.message || "Digite um e-mail válido" };
      const n = { ...prev }; delete n.email; return n;
    });
  };

  const progressPct = step === 0 ? 0 : isQuestionStep ? Math.round((step / TOTAL_Q) * 95) : 100;

  if (step === TOTAL_Q + 1) {
    return (
      <div className="bg-[#1A1A1A] border border-white/5 rounded-2xl p-6 sm:p-10 text-center space-y-6">
        <div className="w-14 h-14 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center mx-auto">
          <XCircle className="w-7 h-7 text-white/30" />
        </div>
        <div className="space-y-3">
          <p className="font-display text-xl text-white leading-tight">Entendemos o seu momento</p>
          <p className="font-body text-white/50 text-sm leading-relaxed max-w-sm mx-auto">
            Pelos dados enviados, ainda não é o momento ideal para o evento presencial — estamos pensando no seu momento atual. Mas isso não te impede de começar agora.
          </p>
          <p className="font-body text-white/50 text-sm leading-relaxed max-w-sm mx-auto">
            Recomendamos o <span className="text-white font-semibold">F.R.O = Fature Rápido Online</span>, ideal para quem está dando o primeiro passo com pouco investimento.
          </p>
        </div>
        <a
          href="https://carlosarantes.com.br/metodo-fro-v3/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-[#b8860b] via-[#d4af37] to-[#f4df8e] text-black font-body font-bold text-sm uppercase tracking-wider px-6 py-3 rounded hover:brightness-110 transition-all"
        >
          Veja como funciona esse método
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    );
  }

  return (
    <div className="bg-[#1A1A1A] border border-white/5 rounded-2xl p-6 sm:p-8 space-y-6">
      <div className="space-y-2.5">
        <div className="flex justify-between items-center">
          <span className="text-[11px] text-white/40 font-body font-medium">
            {step === 0 ? "Comece pelos seus dados" : isQuestionStep ? `Pergunta ${step} de ${TOTAL_Q}` : "Finalizando..."}
          </span>
          <span className="text-[11px] text-primary font-body font-bold">{progressPct}%</span>
        </div>
        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
        <div className="flex gap-1">
          {multiStepQuestions.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                isQuestionStep && i < qIndex ? "bg-primary" : isQuestionStep && i === qIndex ? "bg-primary/50" : "bg-white/10"
              }`}
            />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 0 ? (
          <motion.div
            key="contact"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="space-y-5"
          >
            <div className="flex items-start gap-3 p-4 rounded-lg bg-primary/5 border border-primary/15">
              <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <p className="font-body text-white/70 text-sm leading-relaxed">
                <span className="text-white font-semibold">Comece por aqui.</span> Preencha seus dados e em seguida responda 7 perguntas rápidas pra liberar sua vaga.
              </p>
            </div>
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="ms-nome" className="text-xs font-body font-medium text-white/80">Nome completo</Label>
                <Input
                  id="ms-nome"
                  placeholder="Seu nome completo"
                  value={contact.nome}
                  onChange={(e) => handleContactChange("nome", e.target.value)}
                  className={`h-11 bg-black/30 border-white/15 text-white placeholder:text-white/30 ${contactErrors.nome ? "border-yellow-500" : ""}`}
                />
                {contactErrors.nome && <p className="text-[11px] text-yellow-400">{contactErrors.nome}</p>}
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="ms-email" className="text-xs font-body font-medium text-white/80">E-mail</Label>
                  <Input
                    id="ms-email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="seu@email.com"
                    value={contact.email}
                    onChange={(e) => handleContactChange("email", e.target.value)}
                    onBlur={handleEmailBlur}
                    className={`h-11 bg-black/30 border-white/15 text-white placeholder:text-white/30 ${contactErrors.email ? "border-yellow-500" : ""}`}
                  />
                  {contactErrors.email && <p className="text-[11px] text-yellow-400">{contactErrors.email}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="ms-telefone" className="text-xs font-body font-medium text-white/80">WhatsApp</Label>
                  <Input
                    id="ms-telefone"
                    type="text"
                    inputMode="numeric"
                    placeholder="(11) 99999-9999"
                    value={contact.telefone}
                    onChange={(e) => handleContactChange("telefone", e.target.value)}
                    className={`h-11 bg-black/30 border-white/15 text-white placeholder:text-white/30 ${contactErrors.telefone ? "border-yellow-500" : ""}`}
                  />
                  {contactErrors.telefone && <p className="text-[11px] text-yellow-400">{contactErrors.telefone}</p>}
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#b8860b] via-[#d4af37] to-[#f4df8e] text-black font-body font-bold text-sm uppercase tracking-wider py-4 rounded hover:brightness-110 transition-all flex items-center justify-center gap-2 glow-green"
              >
                Continuar — responder 7 perguntas
                <ArrowRight className="w-4 h-4" />
              </button>
              <div className="flex items-center justify-center">
                <span className="inline-flex items-center gap-1.5 text-[11px] text-white/30 font-body">
                  <Shield className="w-3 h-3" /> Seus dados estão protegidos
                </span>
              </div>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key={`q-${step}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="space-y-4"
          >
            <p className="font-body font-semibold text-white text-base leading-snug">
              {multiStepQuestions[qIndex].label}
            </p>
            <div className="space-y-2">
              {multiStepQuestions[qIndex].options.map((option) => (
                <button
                  key={option}
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleOptionSelect(option)}
                  className="w-full text-left px-4 py-3.5 rounded-lg border border-white/10 bg-white/[0.02] hover:border-primary/40 hover:bg-primary/5 active:bg-primary/10 transition-all duration-150 font-body text-white/65 hover:text-white text-sm flex items-center justify-between gap-3 group disabled:opacity-50 disabled:cursor-wait"
                >
                  <span>{option}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-white/20 group-hover:text-primary flex-shrink-0 transition-colors" />
                </button>
              ))}
            </div>
            {submitError && <p className="text-sm text-yellow-400 text-center font-body">{submitError}</p>}
            {isSubmitting && (
              <div className="flex items-center justify-center gap-2 text-white/60 text-sm font-body">
                <Loader2 className="w-4 h-4 animate-spin" /> Enviando...
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ═══════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════ */

const Index = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const countdown = useCountdown();

  const scrollToForm = () => document.getElementById("formulario")?.scrollIntoView({ behavior: "smooth" });

  return (
    <>
      {/* ══ PREMIUM BACKGROUND — fixed orbs + light beams ══ */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden bg-background" style={{ zIndex: -1 }}>
        <div className="absolute rounded-full" style={{ top: "-20%", right: "-12%", width: "70vw", height: "70vw", maxWidth: 900, maxHeight: 900, background: "radial-gradient(circle at center, rgba(212,175,55,0.13) 0%, transparent 60%)" }} />
        <div className="absolute rounded-full" style={{ top: "38%", left: "-18%", width: "55vw", height: "55vw", maxWidth: 700, maxHeight: 700, background: "radial-gradient(circle at center, rgba(212,175,55,0.09) 0%, transparent 60%)" }} />
        <div className="absolute rounded-full" style={{ bottom: "8%", right: "-5%", width: "42vw", height: "42vw", maxWidth: 520, maxHeight: 520, background: "radial-gradient(circle at center, rgba(212,175,55,0.07) 0%, transparent 60%)" }} />
        <div className="absolute rounded-full" style={{ top: "55%", left: "30%", width: "35vw", height: "35vw", maxWidth: 440, maxHeight: 440, background: "radial-gradient(circle at center, rgba(184,134,11,0.06) 0%, transparent 60%)" }} />
        <div className="absolute" style={{ top: "-8%", left: "20%", width: 80, height: "72vh", background: "linear-gradient(to bottom, rgba(212,175,55,0.11) 0%, transparent 100%)", transform: "rotate(22deg)", transformOrigin: "top center", filter: "blur(24px)" }} />
        <div className="absolute" style={{ top: "-5%", right: "26%", width: 50, height: "55vh", background: "linear-gradient(to bottom, rgba(255,255,255,0.06) 0%, transparent 100%)", transform: "rotate(-14deg)", transformOrigin: "top center", filter: "blur(14px)" }} />
        <div className="absolute" style={{ top: 0, left: "57%", width: 2, height: "48vh", background: "linear-gradient(to bottom, rgba(212,175,55,0.30) 0%, transparent 100%)", transform: "rotate(8deg)", transformOrigin: "top center" }} />
        <div className="absolute" style={{ top: 0, right: "40%", width: 1.5, height: "38vh", background: "linear-gradient(to bottom, rgba(255,255,255,0.15) 0%, transparent 100%)", transform: "rotate(-5deg)", transformOrigin: "top center" }} />
        <div className="absolute" style={{ top: "45%", right: "10%", width: 60, height: "50vh", background: "linear-gradient(to bottom, rgba(212,175,55,0.07) 0%, transparent 100%)", transform: "rotate(-18deg)", transformOrigin: "top center", filter: "blur(20px)" }} />
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen text-white overflow-x-hidden">

          {/* ══ NAV ══ */}
          <nav className="fixed top-0 left-0 right-0 z-[5000] bg-[rgba(3,12,24,0.92)] backdrop-blur-[12px]">
            <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 sm:h-[72px] flex items-center justify-between gap-2 sm:gap-4">
              <span className="font-display text-[11px] sm:text-base tracking-tight flex-shrink-0">
                <span className="text-white">FÓRUM</span>
                <span className="text-primary ml-1">NOVO COMÉRCIO</span>
                <span className="text-white/30 ml-1 text-[10px] hidden sm:inline">2026</span>
              </span>

              <div className="hidden lg:block text-center font-body font-medium text-[13px] leading-tight">
                <span className="text-white/60">GARANTA SEU INGRESSO ANTES</span>
                <br />
                <span className="text-white/60">QUE </span><span className="text-white font-bold underline">AS VAGAS SE ESGOTEM!</span>
              </div>

              <div className="hidden sm:flex items-center gap-1 font-body">
                {[
                  { v: countdown.days, l: "DIAS" },
                  { v: countdown.hours, l: "HORAS" },
                  { v: countdown.minutes, l: "MINUTOS" },
                  { v: countdown.seconds, l: "SEGUNDOS" },
                ].map((u, i) => (
                  <div key={i} className="flex items-center gap-1">
                    <div className="flex flex-col items-center">
                      <div className="bg-[#1A1A1A] border border-white/10 rounded-md px-2 py-1 min-w-[38px] text-center">
                        <span className="text-primary font-extrabold text-base tabular-nums leading-none">{String(u.v).padStart(2, "0")}</span>
                      </div>
                      <span className="text-[7px] text-white/40 font-bold tracking-wider mt-0.5">{u.l}</span>
                    </div>
                    {i < 3 && <span className="text-primary font-bold text-sm -mt-3">:</span>}
                  </div>
                ))}
              </div>

              <button onClick={scrollToForm} className="flex-shrink-0 bg-gradient-to-r from-[#b8860b] via-[#d4af37] to-[#f4df8e] text-black font-body font-bold text-[10px] sm:text-[11px] uppercase tracking-wider px-3 sm:px-4 py-2 sm:py-2.5 rounded hover:brightness-110 transition-all flex items-center gap-1.5 sm:gap-2">
                <span className="hidden sm:inline">Garantir Vaga</span>
                <span className="sm:hidden">Vaga</span>
                <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </button>
            </div>
          </nav>

          {/* ══ HERO — A nova era dos negócios digitais ══ */}
          <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-16 sm:pt-[72px]">
            <img src={carlosHeroBg} alt="" aria-hidden="true" {...{ fetchpriority: "high" }} decoding="sync" className="absolute inset-0 w-full h-full object-cover object-center" />
            <div className="absolute inset-0 bg-background/60" />
            <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background" />

            <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 2 }}>
              <div className="absolute rounded-full" style={{ top: "-30%", right: "-10%", width: "60%", height: "120%", background: "radial-gradient(circle at 70% 30%, rgba(212,175,55,0.12) 0%, transparent 55%)" }} />
              <div className="absolute rounded-full" style={{ bottom: "-20%", left: "-10%", width: "50%", height: "80%", background: "radial-gradient(circle at 30% 70%, rgba(212,175,55,0.07) 0%, transparent 55%)" }} />
              <div className="absolute" style={{ top: 0, left: "32%", width: 1.5, height: "80%", background: "linear-gradient(to bottom, rgba(212,175,55,0.35) 0%, transparent 100%)", transform: "rotate(12deg)", transformOrigin: "top center" }} />
              <div className="absolute" style={{ top: "-5%", right: "20%", width: 55, height: "70%", background: "linear-gradient(to bottom, rgba(212,175,55,0.07) 0%, transparent 100%)", transform: "rotate(-10deg)", transformOrigin: "top center", filter: "blur(18px)" }} />
            </div>

            <div className="relative z-10 text-center px-6 max-w-4xl mx-auto flex flex-col items-center">
              <motion.div initial="hidden" animate="visible" variants={stagger} className="flex flex-col items-center">
                <motion.div variants={fadeUp}>
                  <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-[13px] font-body text-white/70">
                    <Zap className="w-4 h-4 text-primary" />
                    24 de Julho · São Paulo · <span className="text-primary font-bold">Vagas Limitadas</span>
                  </span>
                </motion.div>

                <motion.h1 variants={fadeUp} className="font-display text-[clamp(1.75rem,5.5vw,2.5rem)] mt-8 leading-[1.3] uppercase">
                  Enquanto você enrola, seu concorrente{" "}
                  <span className="text-primary">está vendendo.</span>
                </motion.h1>

                <motion.p variants={fadeUp} className="mt-6 text-white/60 font-body font-medium text-base sm:text-xl max-w-2xl leading-[1.4]">
                  Cada dia fora dos marketplaces é <span className="text-white font-semibold">dinheiro saindo do seu bolso</span> — e indo direto pro dele.
                </motion.p>

                <motion.div variants={fadeUp} className="mt-8">
                  <CtaButton onClick={scrollToForm} className="px-10 sm:px-14 py-5 text-base glow-green-strong">
                    Quero Ganhar Mais Online
                  </CtaButton>
                </motion.div>

                <motion.p variants={fadeUp} className="mt-6 font-body font-medium text-white/60 text-base flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-primary" /> 24 de Julho
                  <span className="text-white/20">|</span>
                  <MapPin className="w-4 h-4 text-primary" /> São Paulo, SP
                </motion.p>
              </motion.div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />
          </section>

          {/* ══ MARQUEE BANDS → form ══ */}
          <div className="relative -mt-4 py-1 overflow-hidden">
            <div className="relative z-10 -rotate-[1.5deg] -ml-[10%] w-[120%] bg-[#0F0F0F] border-y border-white/10">
              <MarqueeBand />
            </div>
            <div className="relative z-20 rotate-[1.5deg] -ml-[10%] w-[120%] -mt-2 bg-[#141414] border-y border-primary/15">
              <MarqueeBand reverse />
            </div>
          </div>

          {/* ══ FORM (segundo fold) ══ */}
          <section id="formulario" className="py-14 sm:py-20 relative section-elevated">
            <div className="max-w-xl mx-auto px-6">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} variants={stagger}>
                <motion.div variants={fadeUp} className="text-center mb-8">
                  <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary font-body font-bold text-[11px] uppercase tracking-wider mb-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    Garanta sua vaga · Vagas limitadas
                  </span>
                  <SectionHeading>
                    Garanta sua vaga <span className="text-primary">em 2 minutos</span>
                  </SectionHeading>
                  <p className="font-body font-medium text-white/60 text-base mt-3 max-w-md mx-auto">Preencha seus dados e responda 7 perguntas rápidas. Sem compromisso.</p>
                </motion.div>

                <motion.div variants={fadeUp} className="relative">
                  <div className="absolute -inset-6 sm:-inset-8 bg-primary/20 blur-3xl rounded-[2.5rem] pointer-events-none" aria-hidden="true" />
                  <div className="absolute -inset-2 bg-gradient-to-br from-primary/40 via-[#f4df8e]/20 to-primary/40 blur-xl rounded-3xl pointer-events-none animate-pulse" aria-hidden="true" />
                  <div className="relative rounded-2xl p-[1.5px] bg-gradient-to-br from-primary via-[#f4df8e] to-primary/40 shadow-2xl shadow-primary/30">
                    <MultiStepForm />
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </section>

          {/* ══ O COMPORTAMENTO DO CONSUMIDOR MUDOU ══ */}
          <section className="py-16 sm:py-20 section-elevated">
            <div className="max-w-4xl mx-auto px-6">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} variants={stagger}>
                <motion.div variants={fadeUp} className="text-center mb-10">
                  <SectionLabel text="O jogo mudou" />
                  <SectionHeading>
                    O COMPORTAMENTO DO CONSUMIDOR{" "}
                    <span className="text-primary">MUDOU.</span>
                  </SectionHeading>
                  <p className="font-body font-medium text-white/60 text-lg mt-4 max-w-xl mx-auto">
                    As pessoas não procuram mais lojas.{" "}
                    <span className="text-white font-semibold">Elas procuram marketplaces.</span>
                  </p>
                </motion.div>

                <motion.div variants={fadeUp} className="grid sm:grid-cols-2 gap-5">
                  <div className="rounded-2xl bg-[#1A1A1A] border border-white/5 p-6 relative overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-[3px] bg-red-500/80 rounded-b" />
                    <p className="font-body font-bold text-red-400/80 text-xs uppercase tracking-wider mt-2 mb-4">Enquanto a maioria:</p>
                    <ul className="space-y-3">
                      {[
                        "Tenta abrir negócios tradicionais e caros",
                        "Investe fortunas em franquias",
                        "Depende de redes sociais para vender",
                        "Acha que o digital é complicado demais",
                        "Continua só consumindo online",
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-white/45 font-body text-[14px] leading-snug">
                          <span className="mt-1 w-3.5 h-3.5 rounded-full border border-red-500/40 flex items-center justify-center flex-shrink-0">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500/60" />
                          </span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-2xl bg-[#1A1A1A] border border-primary/10 p-6 relative overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-[3px] bg-primary rounded-b" />
                    <p className="font-body font-bold text-primary text-xs uppercase tracking-wider mt-2 mb-4">Os operadores de marketplace:</p>
                    <ul className="space-y-3">
                      {[
                        "Entram num mercado com tráfego pronto",
                        "Vendem todos os dias no Mercado Livre e Shopee",
                        "Escalam produtos sem aparecer",
                        "Automatizam processos e faturam alto",
                        "Aprenderam a lucrar com o que move bilhões",
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-white/70 font-body text-[14px] leading-snug">
                          <CheckCircle2 className="mt-0.5 w-4 h-4 text-primary flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>

                <motion.div variants={fadeUp} className="text-center mt-6">
                  <p className="font-body text-white/60 text-base">
                    O dinheiro já está circulando.{" "}
                    <span className="text-primary font-bold">Você só precisa aprender como entrar nesse fluxo.</span>
                  </p>
                </motion.div>

                <motion.div variants={fadeUp} className="text-center mt-8">
                  <CtaButton onClick={scrollToForm}>Quero Entrar no Fluxo</CtaButton>
                </motion.div>
              </motion.div>
            </div>
          </section>

          {/* ══ DADOS DE MERCADO COM FONTES ══ */}
          <section className="py-16 sm:py-20 relative bg-grid-fade">
            <div className="max-w-5xl mx-auto px-6">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} variants={stagger} className="text-center mb-12">
                <motion.div variants={fadeUp}>
                  <SectionLabel text="Os números do mercado" />
                  <SectionHeading>
                    O MERCADO QUE MOVIMENTA{" "}
                    <span className="text-primary">BILHÕES NO BRASIL</span>
                  </SectionHeading>
                  <p className="font-body font-medium text-white/50 text-lg mt-4 max-w-xl mx-auto">
                    Não é hype. São dados públicos do comportamento de compra do{" "}
                    <span className="text-white font-semibold">consumidor brasileiro.</span>
                  </p>
                </motion.div>
              </motion.div>

              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {marketStats.map((s, i) => (
                  <motion.div key={i} variants={scaleIn} className="relative rounded-2xl bg-[#1A1A1A] border border-white/5 p-5 sm:p-6 text-center overflow-hidden group hover:border-primary/20 transition-colors">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-[3px] bg-primary rounded-b" />
                    <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mt-2">
                      <s.icon className="w-5 h-5 text-primary" />
                    </div>
                    <p className="font-display text-2xl sm:text-3xl text-primary mt-4">{s.value}</p>
                    <p className="font-display text-xs sm:text-sm text-white mt-1">{s.label}</p>
                    <p className="font-body text-[11px] sm:text-xs text-white/40 mt-2 leading-snug">{s.desc}</p>
                  </motion.div>
                ))}
              </motion.div>

              {/* Fontes */}
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="mt-8 rounded-2xl bg-white/[0.02] border border-white/5 p-5 sm:p-6">
                <p className="font-body font-bold text-white/70 text-[11px] uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5 text-primary" /> Fontes e dados utilizados
                </p>
                <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2">
                  {marketSources.map((src, i) => (
                    <li key={i} className="flex items-start gap-2 text-white/40 font-body text-xs leading-snug">
                      <span className="mt-1 w-1 h-1 rounded-full bg-primary/60 flex-shrink-0" />
                      {src}
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mt-10">
                <CtaButton onClick={scrollToForm}>Quero Aproveitar Esse Mercado</CtaButton>
              </motion.div>
            </div>
          </section>

          {/* ══ VOCÊ NÃO PRECISA — quebra de objeção ══ */}
          <section className="py-16 sm:py-20 section-elevated">
            <div className="max-w-4xl mx-auto px-6">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} variants={stagger}>
                <motion.div variants={fadeUp} className="text-center mb-10">
                  <SectionLabel text="O mercado oculto" />
                  <SectionHeading>
                    VOCÊ <span className="text-primary">NÃO PRECISA</span> SER UM EXPERT EM MARKETING
                  </SectionHeading>
                  <p className="font-body font-medium text-white/50 text-base mt-3 max-w-xl mx-auto">
                    A maioria acredita que para ganhar dinheiro online precisa de tudo isso. Os maiores operadores fazem o contrário.
                  </p>
                </motion.div>

                <motion.div variants={fadeUp} className="rounded-2xl bg-[#1A1A1A] border border-red-500/15 p-6 sm:p-8 relative overflow-hidden">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-[3px] bg-red-500/60 rounded-b" />
                  <p className="font-body font-bold text-red-400/80 text-xs uppercase tracking-wider mt-2 mb-5 text-center">Você NÃO precisa:</p>
                  <ul className="grid sm:grid-cols-2 gap-4">
                    {naoPrecisa.map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-white/55 font-body text-[15px]">
                        <div className="w-6 h-6 rounded bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0">
                          <XCircle className="w-3.5 h-3.5 text-red-400" />
                        </div>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 pt-5 border-t border-white/5">
                    <p className="font-body text-white/60 text-sm text-center leading-relaxed">
                      Os maiores sellers criam <span className="text-white font-semibold">operações silenciosas</span>: escalam produtos, automatizam processos e faturam alto{" "}
                      <span className="text-primary font-semibold">sem expor a própria imagem.</span>
                    </p>
                  </div>
                </motion.div>

                <motion.div variants={fadeUp} className="text-center mt-8">
                  <CtaButton onClick={scrollToForm}>Quero Operar Sem Aparecer</CtaButton>
                </motion.div>
              </motion.div>
            </div>
          </section>

          {/* ══ TRÁFEGO PRONTO — mecanismo único ══ */}
          <section className="py-16 sm:py-20 relative bg-grid-fade">
            <div className="max-w-4xl mx-auto px-6">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} variants={stagger}>
                <motion.div variants={fadeUp} className="text-center mb-10">
                  <SectionLabel text="O mecanismo" />
                  <SectionHeading>
                    O MARKETPLACE JÁ TEM O QUE TODO NEGÓCIO SONHA:{" "}
                    <span className="text-primary">TRÁFEGO PRONTO.</span>
                  </SectionHeading>
                  <p className="font-body font-medium text-white/50 text-lg mt-4 max-w-xl mx-auto">
                    Todos os dias, milhões de pessoas entram no Mercado Livre, Shopee, Amazon e Magalu com intenção de compra.{" "}
                    <span className="text-white font-semibold">O cliente já está lá.</span>
                  </p>
                </motion.div>

                <motion.div variants={fadeUp} className="rounded-2xl bg-[#1A1A1A] border border-primary/10 p-6 sm:p-8 relative overflow-hidden">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-[3px] bg-primary rounded-b" />
                  <p className="font-body font-bold text-primary text-xs uppercase tracking-wider mt-2 mb-5 text-center">Você não precisa de anos de marketing. O foco é:</p>
                  <ul className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {trafegoFoco.map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-white/70 font-body text-[15px]">
                        <div className="w-6 h-6 rounded bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                          <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                        </div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>

                <motion.div variants={fadeUp} className="text-center mt-8">
                  <CtaButton onClick={scrollToForm}>Quero Vender Onde o Cliente Já Está</CtaButton>
                </motion.div>
              </motion.div>
            </div>
          </section>

          {/* ══ STATS DO EVENTO ══ */}
          <section className="py-16 sm:py-20 relative bg-grid-fade">
            <div className="max-w-5xl mx-auto px-6">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} variants={stagger} className="text-center mb-12">
                <motion.div variants={fadeUp}>
                  <SectionLabel text="O evento" />
                  <SectionHeading>
                    O EVENTO QUE VAI REUNIR OS MAIORES NOMES DO{" "}
                    <span className="text-primary">E-COMMERCE E MARKETPLACE</span>
                  </SectionHeading>
                  <p className="font-body font-medium text-white/50 text-lg mt-4 max-w-xl mx-auto">
                    Aprenda diretamente com quem <span className="text-white font-semibold">vive a operação dos maiores marketplaces do Brasil.</span>
                  </p>
                </motion.div>
              </motion.div>

              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {eventStats.map((s, i) => (
                  <motion.div key={i} variants={scaleIn} className="relative rounded-2xl bg-[#1A1A1A] border border-white/5 p-5 sm:p-6 text-center overflow-hidden group hover:border-primary/20 transition-colors">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-[3px] bg-primary rounded-b" />
                    <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mt-2">
                      <s.icon className="w-5 h-5 text-primary" />
                    </div>
                    <p className="font-display text-2xl sm:text-3xl text-primary mt-4">{s.value}</p>
                    <p className="font-display text-xs sm:text-sm text-white mt-1">{s.label}</p>
                    <p className="font-body text-[11px] sm:text-xs text-white/40 mt-2 leading-snug">{s.desc}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>

          {/* ══ VÍDEO — ÚLTIMA EDIÇÃO ══ */}
          <section className="py-16 sm:py-20 section-elevated">
            <div className="max-w-5xl mx-auto px-6">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} variants={stagger}>
                <motion.div variants={fadeUp} className="text-center mb-10">
                  <SectionLabel text="Última edição" />
                  <SectionHeading>
                    VEJA COMO FOI A <span className="text-primary">ÚLTIMA EDIÇÃO</span>
                  </SectionHeading>
                  <p className="font-body font-medium text-white/50 text-lg mt-4 max-w-lg mx-auto">
                    Pessoas reunidas para{" "}
                    <span className="text-white font-semibold">dar o primeiro passo no novo comércio digital.</span>
                  </p>
                </motion.div>

                <motion.div variants={scaleIn} className="flex justify-center">
                  <VideoPlayer />
                </motion.div>

                <motion.div variants={fadeUp} className="text-center mt-10">
                  <CtaButton onClick={scrollToForm}>Quero Estar na Próxima Edição</CtaButton>
                </motion.div>
              </motion.div>
            </div>
          </section>

          {/* ══ SPEAKER — CARLOS (autoridade) ══ */}
          <section className="py-16 sm:py-20 relative bg-grid-fade">
            <div className="max-w-6xl mx-auto px-6">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} variants={stagger} className="text-center mb-12">
                <motion.div variants={fadeUp}>
                  <SectionLabel text="Aprenda com quem opera" />
                  <SectionHeading>
                    QUEM ESTÁ NO PALCO DO <span className="text-primary">FÓRUM NOVO COMÉRCIO?</span>
                  </SectionHeading>
                  <p className="font-body font-medium text-white/50 text-lg mt-4 max-w-lg mx-auto">
                    Aprenda diretamente com quem <span className="text-white font-semibold">vive o que ensina — todos os dias.</span>
                  </p>
                </motion.div>
              </motion.div>

              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-40px" }} variants={stagger}>
                <SpeakerCard speaker={speakers[0]} />
              </motion.div>

              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mt-12">
                <CtaButton onClick={scrollToForm}>Quero Aprender com Ele</CtaButton>
              </motion.div>
            </div>
          </section>

          {/* ══ CASE STUDY — FELIZZO (prova: do zero ao 1º milhão) ══ */}
          <section className="py-16 sm:py-20 section-elevated">
            <div className="max-w-4xl mx-auto px-6">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} variants={stagger}>
                <motion.div variants={fadeUp} className="text-center mb-10">
                  <SectionLabel text="Caso real" />
                  <SectionHeading>
                    COMEÇOU DO ZERO. VOCÊ PODE SER O <span className="text-primary">PRÓXIMO.</span>
                  </SectionHeading>
                </motion.div>

                <motion.div variants={scaleIn} className="rounded-2xl bg-[#1A1A1A] border border-primary/15 p-6 sm:p-8 relative overflow-hidden">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-[3px] bg-primary rounded-b" />
                  <div className="flex flex-col gap-6 mt-4">
                    <div className="flex items-center gap-3">
                      <div className="px-3 py-1.5 rounded bg-primary/10 border border-primary/20">
                        <span className="font-display text-xs text-primary tracking-wider">FELIZZO</span>
                      </div>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 text-primary fill-primary" />
                        ))}
                      </div>
                    </div>
                    <p className="font-display text-[clamp(1.1rem,3vw,1.5rem)] text-white leading-tight">
                      Do absoluto zero ao{" "}
                      <span className="text-primary">R$1.000.000 faturados</span>{" "}
                      no primeiro ano.
                    </p>
                    <p className="font-body text-white/50 text-sm leading-relaxed max-w-xl">
                      Começou sem experiência no e-commerce. Aplicou as estratégias, foi pessoalmente à China com Carlos Arantes validar fornecedores, e no primeiro ano de operação já atingiu{" "}
                      <span className="text-white font-semibold">R$1 milhão faturados — sem ter nenhum funcionário.</span>
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {[
                        { value: "R$1M", label: "No 1º Ano" },
                        { value: "Zero", label: "Funcionários" },
                        { value: "Do Zero", label: "Ponto de Partida" },
                      ].map((s, i) => (
                        <div key={i} className="px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                          <p className="font-display text-primary text-lg">{s.value}</p>
                          <p className="font-body text-white/30 text-[10px] uppercase tracking-wider mt-0.5">{s.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>

                <motion.div variants={fadeUp} className="text-center mt-8">
                  <CtaButton onClick={scrollToForm}>Quero Resultados Como Esses</CtaButton>
                </motion.div>
              </motion.div>
            </div>
          </section>

          {/* ══ O QUE VOCÊ VAI DESCOBRIR — learnings ══ */}
          <section className="py-16 sm:py-20 section-elevated">
            <div className="max-w-5xl mx-auto px-6">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} variants={stagger} className="text-center mb-12">
                <motion.div variants={fadeUp}>
                  <SectionLabel text="Conteúdo do evento" />
                  <SectionHeading>
                    O QUE VOCÊ VAI DESCOBRIR
                  </SectionHeading>
                  <p className="font-body font-medium text-white/50 text-lg mt-4 max-w-lg mx-auto">
                    Como funciona o ecossistema dos marketplaces — <span className="text-white font-semibold">do primeiro passo à operação em escala.</span>
                  </p>
                </motion.div>
              </motion.div>

              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-40px" }} variants={stagger} className="space-y-4">
                {learnings.map((item, i) => (
                  <motion.div key={i} variants={fadeUp} className="rounded-2xl bg-[#1A1A1A] border border-white/5 overflow-hidden hover:border-primary/20 transition-colors">
                    <div className="h-[3px] bg-gradient-to-r from-primary via-primary/50 to-transparent" />
                    <div className="flex flex-col sm:flex-row gap-5 p-5 sm:p-6">
                      <div className="flex sm:flex-col items-center sm:items-start gap-3 flex-shrink-0">
                        <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                          <item.icon className="w-5 h-5 text-primary" />
                        </div>
                        <span className="font-display text-3xl text-primary/15">{item.number}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-display text-base sm:text-lg text-white leading-tight">{item.title}</h3>
                        <p className="text-primary font-body font-semibold text-xs mt-1 uppercase tracking-wider">{item.subtitle}</p>
                        <p className="text-white/40 font-body text-sm mt-3 leading-relaxed">{item.desc}</p>
                        <div className="flex flex-wrap gap-2 mt-4">
                          {item.bullets.map((b, j) => (
                            <span key={j} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/[0.03] border border-white/[0.06] text-[11px] text-white/35 font-body font-medium">
                              <CheckCircle2 className="w-3 h-3 text-primary/40" /> {b}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mt-12">
                <CtaButton onClick={scrollToForm}>Quero Descobrir Tudo Isso</CtaButton>
              </motion.div>
            </div>
          </section>

          {/* ══ VOCÊ VAI SAIR COM — outcomes ══ */}
          <section className="py-16 sm:py-20 relative bg-grid-fade">
            <div className="max-w-5xl mx-auto px-6">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} variants={stagger}>
                <motion.div variants={fadeUp} className="text-center mb-12">
                  <SectionLabel text="A transformação" />
                  <SectionHeading>
                    VOCÊ VAI SAIR DO EVENTO{" "}
                    <span className="text-primary">DIFERENTE.</span>
                  </SectionHeading>
                  <p className="font-body font-medium text-white/50 text-lg mt-4 max-w-lg mx-auto">
                    Não é teoria. É{" "}
                    <span className="text-white font-semibold">um caminho real para começar no novo comércio.</span>
                  </p>
                </motion.div>

                <motion.div variants={stagger} className="grid sm:grid-cols-2 gap-4">
                  {outcomes.map((item, i) => (
                    <motion.div key={i} variants={scaleIn} className="rounded-2xl bg-[#1A1A1A] border border-white/5 p-6 relative overflow-hidden hover:border-primary/20 transition-colors">
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-[3px] bg-primary rounded-b" />
                      <div className="flex items-start gap-4 mt-2">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                          <item.icon className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-display text-sm text-white leading-tight">{item.title}</h3>
                          <p className="text-white/40 font-body text-xs mt-2 leading-relaxed">{item.desc}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>

                <motion.div variants={fadeUp} className="text-center mt-10">
                  <CtaButton onClick={scrollToForm}>Quero Essa Transformação</CtaButton>
                </motion.div>
              </motion.div>
            </div>
          </section>

          {/* ══ PARA QUEM É ESSE EVENTO ══ */}
          <section className="py-16 sm:py-20 section-elevated">
            <div className="max-w-3xl mx-auto px-6">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} variants={stagger}>
                <motion.div variants={fadeUp} className="text-center mb-10">
                  <SectionLabel text="Para quem é" />
                  <SectionHeading>
                    ESSE EVENTO É PARA{" "}
                    <span className="text-primary">VOCÊ QUE:</span>
                  </SectionHeading>
                </motion.div>

                <motion.div variants={fadeUp} className="rounded-2xl bg-[#1A1A1A] border border-primary/10 p-6 sm:p-8 relative overflow-hidden">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-[3px] bg-primary rounded-b" />
                  <ul className="space-y-4 mt-2">
                    {[
                      "Quer criar uma nova fonte de renda",
                      "É empresário e deseja expandir para o digital",
                      "É investidor buscando novas oportunidades",
                      "Quer construir um negócio escalável do zero",
                      "Quer entrar em um mercado em crescimento acelerado",
                      "Quer aprender com operadores reais do mercado",
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-white/70 font-body text-[15px]">
                        <div className="w-6 h-6 rounded bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                          <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                        </div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>

                <motion.div variants={fadeUp} className="text-center mt-8">
                  <CtaButton onClick={scrollToForm}>Esse Sou Eu — Quero Participar</CtaButton>
                </motion.div>
              </motion.div>
            </div>
          </section>

          {/* ══ NÃO É PARA VOCÊ SE ══ */}
          <section className="py-16 sm:py-20 relative bg-grid-fade">
            <div className="max-w-3xl mx-auto px-6">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} variants={stagger}>
                <motion.div variants={fadeUp} className="text-center mb-10">
                  <SectionLabel text="Seja honesto consigo" />
                  <SectionHeading>
                    MAS SE VOCÊ É ASSIM,{" "}
                    <span className="text-red-400">NÃO VENHA.</span>
                  </SectionHeading>
                  <p className="font-body font-medium text-white/50 text-base mt-3 max-w-lg mx-auto">
                    Vagas são limitadas. Não queremos desperdiçar a sua — nem a nossa.
                  </p>
                </motion.div>

                <motion.div variants={fadeUp} className="rounded-2xl bg-[#1A1A1A] border border-red-500/15 p-6 sm:p-8 relative overflow-hidden">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-[3px] bg-red-500/60 rounded-b" />
                  <ul className="space-y-4 mt-2">
                    {[
                      "Procura uma fórmula mágica para enriquecer sem esforço",
                      "Não está disposto a aprender e implementar",
                      "Quer só conteúdo superficial de 'ganhar dinheiro online'",
                      "Acha que vai ficar rico sem investir tempo nem estrutura",
                      "Prefere continuar só consumindo online a operar de verdade",
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-white/45 font-body text-[15px]">
                        <div className="w-6 h-6 rounded bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0">
                          <XCircle className="w-3.5 h-3.5 text-red-400" />
                        </div>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 pt-5 border-t border-white/5">
                    <p className="font-body text-white/30 text-sm text-center leading-relaxed">
                      Se você se identificou com algum item acima, este evento não foi feito para você — e tudo bem.{" "}
                      <span className="text-white/60 font-semibold">Se não se identificou, seu lugar está aqui.</span>
                    </p>
                  </div>
                </motion.div>

                <motion.div variants={fadeUp} className="text-center mt-8">
                  <CtaButton onClick={scrollToForm}>Meu Lugar É Aqui — Quero Me Inscrever</CtaButton>
                </motion.div>
              </motion.div>
            </div>
          </section>

          {/* ══ O MOMENTO É AGORA — urgência ══ */}
          <section className="py-16 sm:py-20 section-elevated">
            <div className="max-w-3xl mx-auto px-6">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} variants={stagger} className="text-center">
                <motion.div variants={fadeUp}>
                  <SectionLabel text="Urgência" />
                  <SectionHeading>
                    O MOMENTO É <span className="text-primary">AGORA.</span>
                  </SectionHeading>
                  <p className="font-body font-medium text-white/60 text-lg mt-5 max-w-xl mx-auto leading-relaxed">
                    O mercado está se expandindo. As vendas online aumentam ano após ano.{" "}
                    <span className="text-white font-semibold">E quem entra cedo constrói vantagem.</span>
                  </p>
                </motion.div>

                <motion.div variants={fadeUp} className="grid sm:grid-cols-3 gap-4 mt-10 text-left">
                  {[
                    "Aprenda com quem realmente performa",
                    "Conheça o mercado que movimenta bilhões",
                    "Descubra como transformar marketplace em crescimento real",
                  ].map((item, i) => (
                    <div key={i} className="rounded-2xl bg-[#1A1A1A] border border-primary/10 p-5 relative overflow-hidden">
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-[3px] bg-primary rounded-b" />
                      <CheckCircle2 className="w-5 h-5 text-primary mt-2" />
                      <p className="font-body text-white/70 text-sm mt-3 leading-snug">{item}</p>
                    </div>
                  ))}
                </motion.div>

                <motion.p variants={fadeUp} className="font-display text-primary text-base uppercase tracking-wider mt-10">
                  As vagas são limitadas.
                </motion.p>

                <motion.div variants={fadeUp} className="mt-6">
                  <CtaButton onClick={scrollToForm} className="px-10 sm:px-14 py-5 text-base glow-green-strong">
                    Quero Participar do Evento
                  </CtaButton>
                </motion.div>
              </motion.div>
            </div>
          </section>

          {/* ══ LOCAL DO EVENTO ══ */}
          <section className="py-16 sm:py-20 relative bg-grid-fade">
            <div className="max-w-5xl mx-auto px-6">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} variants={stagger}>
                <motion.div variants={fadeUp} className="text-center mb-10">
                  <SectionLabel text="Onde irá acontecer" />
                  <SectionHeading>
                    COMO CHEGAR NO NOSSO <span className="text-primary">PONTO DE ENCONTRO</span>
                  </SectionHeading>
                </motion.div>

                <motion.div variants={fadeUp} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  <div className="rounded-2xl bg-[#1A1A1A] border border-white/5 p-5 flex flex-col">
                    <p className="font-display text-sm text-primary">ENDEREÇO</p>
                    <p className="font-body text-white/70 text-xs mt-2 leading-relaxed">Sede da Associação Comercial de São Paulo</p>
                    <p className="font-body text-white/40 text-xs mt-1">Palácio do Comércio — Centro Histórico</p>
                    <p className="font-body text-white/40 text-xs mt-1">São Paulo, SP</p>
                  </div>
                  <div className="rounded-2xl bg-[#1A1A1A] border border-white/5 p-5 flex flex-col">
                    <p className="font-display text-sm text-primary">DATA</p>
                    <p className="font-body text-white/70 text-xs mt-2">24 de Julho de 2026</p>
                    <p className="font-body text-white/40 text-xs mt-1">(Sexta-feira)</p>
                  </div>
                  <div className="rounded-2xl bg-[#1A1A1A] border border-white/5 p-5 flex flex-col">
                    <p className="font-display text-sm text-primary">HORÁRIO</p>
                    <p className="font-body text-white/70 text-xs mt-2">10h00 às 18h00</p>
                    <p className="font-body text-white/40 text-xs mt-1">(8 horas de imersão total)</p>
                  </div>
                  <div className="rounded-2xl bg-[#1A1A1A] border border-white/5 p-5 flex flex-col">
                    <p className="font-display text-sm text-primary">FACILIDADES</p>
                    <p className="font-body text-white/40 text-xs mt-2 leading-relaxed">
                      • Acesso fácil por transporte público<br />
                      • Estacionamento no local<br />
                      • Alimentação disponível<br />
                      • Centro Histórico de SP
                    </p>
                  </div>
                </motion.div>

                <motion.div variants={fadeUp} className="rounded-2xl overflow-hidden border border-white/5">
                  <iframe
                    src="https://maps.google.com/maps?q=Associa%C3%A7%C3%A3o+Comercial+de+S%C3%A3o+Paulo,+Rua+Boa+Vista+51,+Centro,+S%C3%A3o+Paulo,+SP&t=&z=16&ie=UTF8&iwloc=&output=embed"
                    width="100%"
                    height="350"
                    style={{ border: 0, filter: "invert(90%) hue-rotate(180deg) brightness(0.9) contrast(1.1)" }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Local do evento"
                  />
                </motion.div>
              </motion.div>
            </div>
          </section>

          {/* ══ FAQ ══ */}
          <section className="py-16 sm:py-20 section-elevated">
            <div className="max-w-2xl mx-auto px-6">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} variants={stagger}>
                <motion.div variants={fadeUp} className="text-center mb-10">
                  <SectionLabel text="FAQ" />
                  <SectionHeading>PERGUNTAS FREQUENTES</SectionHeading>
                </motion.div>
                <motion.div variants={stagger} className="space-y-3">
                  {faqs.map((faq, i) => (
                    <FaqItem key={i} item={faq} isOpen={openFaq === i} toggle={() => setOpenFaq(openFaq === i ? null : i)} />
                  ))}
                </motion.div>
              </motion.div>
            </div>
          </section>

          {/* ══ FOOTER ══ */}
          <footer className="py-8 border-t border-white/5">
            <div className="max-w-6xl mx-auto px-6 text-center">
              <p className="text-xs text-white/20 font-body">© 2026 Fórum Novo Comércio. Todos os direitos reservados.</p>
            </div>
          </footer>
        </motion.div>
    </>
  );
};

export default Index;
