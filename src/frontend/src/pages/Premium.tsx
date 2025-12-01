import React from 'react';
import { motion } from 'framer-motion';
import { Crown, Check, Zap, Music, Headphones, Download, CloudOff, Sparkles } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'react-hot-toast';

export const Premium: React.FC = () => {
  const { user } = useAuthStore();

  const features = {
    free: [
      'Acceso a millones de canciones',
      'Calidad de audio estándar',
      'Anuncios ocasionales',
      'Modo online únicamente',
    ],
    premium: [
      'Sin anuncios ni interrupciones',
      'Calidad de audio HD (320kbps)',
      'Descargas ilimitadas',
      'Modo offline',
      'Salta canciones ilimitadas',
      'Letras en tiempo real',
      'Listas personalizadas con IA',
      'Acceso anticipado a funciones',
    ],
  };

  const plans = [
    {
      name: 'Premium Individual',
      price: '9.99',
      period: 'mes',
      description: 'Perfecto para un solo usuario',
      features: features.premium,
      icon: Crown,
      gradient: 'from-gruvbox-aqua to-gruvbox-yellow',
      popular: false,
    },
    {
      name: 'Premium Familiar',
      price: '14.99',
      period: 'mes',
      description: 'Hasta 6 cuentas premium',
      features: [...features.premium, 'Hasta 6 cuentas', 'Control parental', 'Mix familiar'],
      icon: Sparkles,
      gradient: 'from-gruvbox-purple to-gruvbox-orange',
      popular: true,
    },
    {
      name: 'Premium Estudiante',
      price: '4.99',
      period: 'mes',
      description: 'Con verificación estudiantil',
      features: features.premium,
      icon: Zap,
      gradient: 'from-gruvbox-yellow to-gruvbox-orange',
      popular: false,
    },
  ];

  const handleSelectPlan = (planName: string) => {
    toast.success(`¡Seleccionaste ${planName}! Redirigiendo a pago...`, {
      icon: '👑',
      duration: 3000,
    });
    // Aquí iría la integración con el sistema de pagos
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16 relative"
      >
        {/* Background glow effect */}
        <div className="absolute inset-0 flex justify-center items-start">
          <div className="w-96 h-96 bg-gruvbox-aqua/10 rounded-full blur-[120px]" />
        </div>

        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative inline-block mb-6"
        >
          <Crown className="w-24 h-24 text-gruvbox-yellow mx-auto drop-shadow-2xl" />
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 bg-gruvbox-yellow/20 rounded-full blur-xl"
          />
        </motion.div>

        <h1 className="text-6xl font-black mb-4 bg-gradient-to-r from-gruvbox-yellow via-gruvbox-orange to-gruvbox-purple bg-clip-text text-transparent">
          Actualiza a Premium
        </h1>
        <p className="text-xl text-gruvbox-fg4 max-w-2xl mx-auto">
          Disfruta de música sin límites, sin anuncios y con la mejor calidad
        </p>
      </motion.div>

      {/* Comparison Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16 max-w-5xl mx-auto">
        {/* Free Plan */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gruvbox-bg0/50 backdrop-blur-sm border border-gruvbox-fg4/20 rounded-2xl p-8 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-gruvbox-fg4/5 rounded-full blur-3xl" />
          
          <div className="relative">
            <div className="flex items-center gap-3 mb-4">
              <Music className="w-8 h-8 text-gruvbox-fg4" />
              <h3 className="text-2xl font-bold text-gruvbox-fg">Plan Gratuito</h3>
            </div>
            
            <p className="text-4xl font-black text-gruvbox-fg mb-2">
              $0<span className="text-lg text-gruvbox-fg4">/mes</span>
            </p>
            <p className="text-gruvbox-fg4 mb-6">Tu plan actual</p>

            <ul className="space-y-3 mb-6">
              {features.free.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-3 text-gruvbox-fg4">
                  <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* Premium Preview */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-gruvbox-aqua/10 via-gruvbox-purple/10 to-gruvbox-orange/10 backdrop-blur-sm border-2 border-gruvbox-aqua/40 rounded-2xl p-8 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-gruvbox-aqua/10 rounded-full blur-3xl" />
          
          <div className="relative">
            <div className="flex items-center gap-3 mb-4">
              <Crown className="w-8 h-8 text-gruvbox-yellow" />
              <h3 className="text-2xl font-bold text-gruvbox-fg">Premium</h3>
              <span className="ml-auto px-3 py-1 bg-gruvbox-yellow/20 text-gruvbox-yellow text-sm font-bold rounded-full">
                Popular
              </span>
            </div>
            
            <p className="text-4xl font-black text-gruvbox-fg mb-2">
              Desde $4.99<span className="text-lg text-gruvbox-fg4">/mes</span>
            </p>
            <p className="text-gruvbox-aqua mb-6">Actualiza ahora</p>

            <ul className="space-y-3 mb-6">
              {features.premium.slice(0, 6).map((feature, idx) => (
                <li key={idx} className="flex items-start gap-3 text-gruvbox-fg">
                  <Check className="w-5 h-5 text-gruvbox-aqua flex-shrink-0 mt-0.5" />
                  <span className="font-medium">{feature}</span>
                </li>
              ))}
              <li className="text-gruvbox-aqua text-sm font-medium">
                + {features.premium.length - 6} beneficios más
              </li>
            </ul>
          </div>
        </motion.div>
      </div>

      {/* Plans Grid */}
      <div className="mb-16">
        <h2 className="text-4xl font-black text-center mb-12 text-gruvbox-fg">
          Elige tu plan Premium
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, idx) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + idx * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className={`relative bg-gruvbox-bg0/80 backdrop-blur-sm border-2 rounded-2xl p-8 overflow-hidden ${
                plan.popular
                  ? 'border-gruvbox-purple/60 shadow-2xl shadow-gruvbox-purple/20'
                  : 'border-gruvbox-fg4/20'
              }`}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-gruvbox-purple to-gruvbox-orange px-4 py-1 text-xs font-bold text-gruvbox-bg rounded-bl-xl rounded-tr-xl">
                  MÁS POPULAR
                </div>
              )}

              {/* Background gradient */}
              <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${plan.gradient} opacity-5 rounded-full blur-3xl`} />

              <div className="relative">
                {/* Icon */}
                <div className={`w-16 h-16 bg-gradient-to-br ${plan.gradient} rounded-xl flex items-center justify-center mb-6 shadow-lg`}>
                  <plan.icon className="w-8 h-8 text-gruvbox-bg" />
                </div>

                {/* Plan info */}
                <h3 className="text-2xl font-bold text-gruvbox-fg mb-2">
                  {plan.name}
                </h3>
                <p className="text-gruvbox-fg4 mb-6 text-sm">
                  {plan.description}
                </p>

                {/* Price */}
                <div className="mb-6">
                  <p className="text-5xl font-black text-gruvbox-fg">
                    ${plan.price}
                  </p>
                  <p className="text-gruvbox-fg4">por {plan.period}</p>
                </div>

                {/* CTA Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSelectPlan(plan.name)}
                  className={`w-full py-4 rounded-xl font-bold text-gruvbox-bg bg-gradient-to-r ${plan.gradient} shadow-lg hover:shadow-xl transition-all mb-6`}
                >
                  Comenzar ahora
                </motion.button>

                {/* Features list */}
                <ul className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-gruvbox-fg4">
                      <Check className="w-4 h-4 text-gruvbox-aqua flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Benefits Section */}
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-black text-center mb-12 text-gruvbox-fg">
          ¿Por qué Premium?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: CloudOff,
              title: 'Sin Anuncios',
              description: 'Música sin interrupciones',
              color: 'gruvbox-aqua',
            },
            {
              icon: Download,
              title: 'Descarga Todo',
              description: 'Escucha sin conexión',
              color: 'gruvbox-yellow',
            },
            {
              icon: Headphones,
              title: 'Calidad HD',
              description: 'Audio de 320kbps',
              color: 'gruvbox-purple',
            },
            {
              icon: Zap,
              title: 'Funciones Pro',
              description: 'IA y recomendaciones',
              color: 'gruvbox-orange',
            },
          ].map((benefit, idx) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + idx * 0.1 }}
              whileHover={{ y: -4 }}
              className="bg-gruvbox-bg0/50 backdrop-blur-sm border border-gruvbox-fg4/20 rounded-xl p-6 text-center"
            >
              <div className={`w-12 h-12 bg-${benefit.color}/20 rounded-full flex items-center justify-center mx-auto mb-4`}>
                <benefit.icon className={`w-6 h-6 text-${benefit.color}`} />
              </div>
              <h3 className="text-lg font-bold text-gruvbox-fg mb-2">
                {benefit.title}
              </h3>
              <p className="text-sm text-gruvbox-fg4">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="max-w-4xl mx-auto mt-20 text-center"
      >
        <h2 className="text-3xl font-black mb-6 text-gruvbox-fg">
          Preguntas Frecuentes
        </h2>
        <div className="space-y-4 text-left">
          {[
            {
              q: '¿Puedo cancelar en cualquier momento?',
              a: 'Sí, puedes cancelar tu suscripción Premium en cualquier momento sin cargos adicionales.',
            },
            {
              q: '¿Qué métodos de pago aceptan?',
              a: 'Aceptamos tarjetas de crédito, débito, PayPal y transferencias bancarias.',
            },
            {
              q: '¿Hay periodo de prueba gratis?',
              a: 'Sí, ofrecemos 30 días gratis para nuevos usuarios Premium.',
            },
          ].map((faq, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 + idx * 0.1 }}
              className="bg-gruvbox-bg0/50 backdrop-blur-sm border border-gruvbox-fg4/20 rounded-xl p-6"
            >
              <h3 className="text-lg font-bold text-gruvbox-aqua mb-2">
                {faq.q}
              </h3>
              <p className="text-gruvbox-fg4">{faq.a}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
