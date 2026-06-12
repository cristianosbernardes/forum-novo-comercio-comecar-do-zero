import { useEffect } from "react";
import { m } from "framer-motion";
import { CheckCircle2, Calendar, ArrowRight } from "lucide-react";

const Obrigado = () => {
  useEffect(() => {
    if (typeof window.fbq === "function") {
      window.fbq("track", "PageView");
      // Lead qualificado: só dispara aqui (a /obrigado só é alcançada por quem passa
      // na lógica condicional do formulário). Mantemos "Lead" por continuidade e
      // disparamos "CompleteRegistration" como o evento limpo e dedicado para otimizar
      // os anúncios novos — sem o histórico contaminado do "Lead" antigo.
      const params = {
        content_name: "Fórum Novo Comércio 2026",
        content_category: "Evento",
        value: 0,
        currency: "BRL",
      };
      window.fbq("track", "Lead", params);
      window.fbq("track", "CompleteRegistration", params);
    }
  }, []);

  return (
  <m.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="min-h-screen bg-background flex items-center justify-center px-4 py-16"
  >
    <m.div
      initial={{ opacity: 0, scale: 0.85, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center max-w-lg"
    >
      <m.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring" }}
        className="w-24 h-24 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center mx-auto mb-8"
      >
        <CheckCircle2 className="w-12 h-12 text-primary" />
      </m.div>

      <h2 className="font-display text-[1.75rem] sm:text-[2rem] text-white mb-3">
        Parabéns pela decisão!
      </h2>

      <p className="text-primary font-body font-bold text-lg mb-4">
        Você acaba de dar o primeiro passo que a maioria das pessoas nunca dá.
      </p>

      <p className="text-white/50 font-body text-[15px] leading-relaxed mb-2">
        Enquanto a maioria continua só consumindo online,{" "}
        <span className="text-white font-medium">
          você escolheu aprender a lucrar com o mercado que movimenta bilhões.
        </span>
      </p>

      <p className="text-white/50 font-body text-[15px] leading-relaxed mb-6">
        O Fórum Novo Comércio vai ser{" "}
        <span className="text-primary font-semibold">
          o marco que separa o antes e o depois
        </span>{" "}
        da sua entrada nos marketplaces. As estratégias de quem opera de verdade
        vão estar ao seu alcance — e o seu jogo nunca mais será o mesmo.
      </p>

      {/* Date badge */}
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded bg-primary/5 border border-primary/20 text-primary text-sm font-body font-semibold mb-8">
        <Calendar className="w-4 h-4" /> 24 de Julho, 2026 — São Paulo, SP
      </div>

      {/* Separator */}
      <div className="w-16 h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent mx-auto mb-8" />

      {/* Next step text */}
      <p className="text-white/40 font-body text-sm mb-6">
        Nosso time comercial entrará em contato com você em breve.
        <br />
        <span className="text-white/70 font-medium">
          Mas se preferir, você já pode falar diretamente com nossa equipe agora:
        </span>
      </p>

      {/* WhatsApp CTA */}
      <a
        href="https://wa.me/5511994087347?text=Acabei%20de%20preencher%20o%20formul%C3%A1rio%20do%20evento%2C%20quero%20mais%20informa%C3%A7%C3%B5es"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-3 bg-gradient-to-r from-[#b8860b] via-[#d4af37] to-[#f4df8e] text-black font-body font-bold text-sm uppercase tracking-[0.1em] px-8 py-4 rounded hover:brightness-110 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 glow-green"
      >
        Falar com a Equipe Agora
        <ArrowRight className="w-5 h-5" />
      </a>

      <p className="text-white/25 font-body text-xs mt-4">
        Atendimento rápido via WhatsApp
      </p>
    </m.div>
  </m.div>
  );
};

export default Obrigado;
