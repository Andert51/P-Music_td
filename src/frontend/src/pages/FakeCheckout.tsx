import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Lock, AlertTriangle, Terminal, Skull, Zap, Eye, Shield, Code, WifiOff, Database, MapPin, Phone, Mail, User, Home, Camera, Wifi, Monitor, Chrome } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const FakeCheckout: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'form' | 'processing' | 'hacked'>('form');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [isAutofilling, setIsAutofilling] = useState(false);
  const [hackProgress, setHackProgress] = useState(0);
  const [hackingMessages, setHackingMessages] = useState<string[]>([]);
  const [glitchActive, setGlitchActive] = useState(false);
  const [showSkullPopup, setShowSkullPopup] = useState(false);

  // Datos fijos realistas para mayor credibilidad
  const doxData = {
    ip: '189.203.45.127',
    location: 'Salamanca, Guanajuato, México',
    isp: 'Telmex Telecomunicaciones',
    device: 'Laptop ACER Aspire 5',
    browser: 'Brave 1.62.153',
    os: 'Windows 11 Pro Build 22H2',
    email: 'usuario2847@gmail.com',
    phone: '+52 (473) 845-2193',
  };

  // Generar datos aleatorios de tarjeta
  const generateFakeData = () => {
    const names = ['JOHN DOE', 'JANE SMITH', 'BOB JOHNSON', 'ALICE WILLIAMS', 'MIKE BROWN'];
    const randomName = names[Math.floor(Math.random() * names.length)];
    
    const randomCard = Array(16).fill(0).map(() => Math.floor(Math.random() * 10)).join('');
    const formattedCard = randomCard.match(/.{1,4}/g)?.join(' ') || '';
    
    const randomMonth = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
    const randomYear = String(Math.floor(Math.random() * 8) + 25);
    const randomExpiry = `${randomMonth}/${randomYear}`;
    
    const randomCVV = Array(3).fill(0).map(() => Math.floor(Math.random() * 10)).join('');

    return { randomName, formattedCard, randomExpiry, randomCVV };
  };

  // Autocompletar con efecto de escritura
  const autofillWithTypingEffect = async () => {
    setIsAutofilling(true);
    const { randomName, formattedCard, randomExpiry, randomCVV } = generateFakeData();

    // Efecto de glitch
    setGlitchActive(true);
    setTimeout(() => setGlitchActive(false), 300);

    // Nombre de tarjeta
    for (let i = 0; i <= randomName.length; i++) {
      setCardName(randomName.slice(0, i));
      await new Promise(resolve => setTimeout(resolve, 50));
    }

    await new Promise(resolve => setTimeout(resolve, 200));

    // Número de tarjeta
    for (let i = 0; i <= formattedCard.length; i++) {
      setCardNumber(formattedCard.slice(0, i));
      await new Promise(resolve => setTimeout(resolve, 30));
    }

    await new Promise(resolve => setTimeout(resolve, 200));

    // Expiración
    for (let i = 0; i <= randomExpiry.length; i++) {
      setExpiry(randomExpiry.slice(0, i));
      await new Promise(resolve => setTimeout(resolve, 80));
    }

    await new Promise(resolve => setTimeout(resolve, 200));

    // CVV
    for (let i = 0; i <= randomCVV.length; i++) {
      setCvv(randomCVV.slice(0, i));
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    setIsAutofilling(false);
  };

  // Auto-iniciar proceso cuando se monta el componente
  useEffect(() => {
    if (step === 'form' && !isAutofilling) {
      const timer = setTimeout(() => {
        autofillWithTypingEffect().then(() => {
          setTimeout(() => {
            handleAutoSubmit();
          }, 1500);
        });
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [step]);

  // Proceso de "hackeo" - auto-submit
  const handleAutoSubmit = async () => {
    setStep('processing');
    setGlitchActive(true);
    
    // Efecto de calavera emergente al inicio
    setTimeout(() => {
      setShowSkullPopup(true);
      setTimeout(() => setShowSkullPopup(false), 800);
    }, 2000);

    const messages = [
      '> Iniciando protocolo de pago...',
      '> Estableciendo conexión SSL/TLS...',
      '> Verificando certificados de seguridad...',
      '> [ALERTA] Anomalía detectada en el protocolo',
      '> [ERROR CRÍTICO] Certificado SSL falsificado detectado',
      '> SISTEMA DE SEGURIDAD DESACTIVADO',
      '> FIREWALL DESHABILITADO',
      '> ACCESO ROOT OBTENIDO',
      '> Ejecutando payload malicioso...',
      '> Deshabilitando Windows Defender...',
      '> Instalando backdoor permanente...',
      '> Keylogger activado',
      '> Escaneando sistema de archivos...',
      '> Accediendo a credenciales almacenadas...',
      '> Capturando cookies de sesión activas...',
      '> -------------------------',
      '> DATOS FINANCIEROS CAPTURADOS:',
      '> TARJETA: •••• •••• •••• ' + cardNumber.slice(-4),
      '> TITULAR: ' + cardName,
      '> CVV: •••',
      '> EXPIRACIÓN: ' + expiry,
      '> -------------------------',
      '> Rastreando geolocalización...',
      '> IP IDENTIFICADA: ' + doxData.ip,
      '> UBICACIÓN FÍSICA: ' + doxData.location,
      '> PROVEEDOR ISP: ' + doxData.isp,
      '> Dispositivo: ' + doxData.device,
      '> Navegador: ' + doxData.browser,
      '> -------------------------',
      '> Accediendo a periféricos del sistema...',
      '> Cámara web: ACTIVADA',
      '> Micrófono: ACTIVADO',
      '> Capturando fotografía...',
      '> Imagen almacenada',
      '> -------------------------',
      '> Extrayendo información personal...',
      '> EMAIL: ' + doxData.email,
      '> TELÉFONO: ' + doxData.phone,
      '> Buscando redes sociales asociadas...',
      '> Facebook, Instagram, Twitter: ENCONTRADOS',
      '> -------------------------',
      '> Copiando archivos confidenciales...',
      '> Documentos personales: 247 archivos',
      '> Fotografías privadas: 1,832 archivos',
      '> Videos: 94 archivos',
      '> Historial de navegación: 15,438 entradas',
      '> Contraseñas guardadas: 67 cuentas',
      '> -------------------------',
      '> Estableciendo túnel encriptado...',
      '> Conectando a C&C Server...',
      '> Dirección: 185.220.101.###:8443',
      '> Red TOR establecida',
      '> Ubicación del servidor: Moscú, Rusia',
      '> -------------------------',
      '> Cifrando paquete de datos con RSA-4096...',
      '> Comprimiendo información robada...',
      '> Tamaño total del paquete: 4.7 GB',
      '> -------------------------',
      '> Iniciando transmisión de datos...',
      '> Upload: [==========] 25%',
      '> Upload: [====================] 50%',
      '> Upload: [==============================] 75%',
      '> Upload: [========================================] 98%',
      '> -------------------------',
      '> TRANSFERENCIA COMPLETADA CON ÉXITO',
      '> Datos almacenados en servidor remoto',
      '> -------------------------',
      '> Instalando componente de ransomware...',
      '> Preparando cifrado de archivos del sistema...',
      '> Tiempo hasta cifrado automático: 72 horas',
      '> -------------------------',
      '> Enviando información a mercado negro...',
      '> Dark Web - Marketplace activo',
      '> Su identidad vendida por: $850 USD',
      '> Datos bancarios vendidos por: $1,200 USD',
      '> -------------------------',
      '> Notificando a red de distribución...',
      '> 47 compradores interesados en sus datos',
      '> -------------------------',
      '> Limpiando logs del sistema...',
      '> Eliminando rastros de acceso...',
      '> Ocultando procesos maliciosos...',
      '> -------------------------',
      '> OPERACIÓN COMPLETADA',
      '> SU SISTEMA HA SIDO COMPROMETIDO',
      '> NO HAY MARCHA ATRÁS',
    ];

    for (let i = 0; i < messages.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 100));
      setHackingMessages(prev => [...prev, messages[i]]);
      setHackProgress((i + 1) / messages.length * 100);
      
      // Calavera emergente en momentos críticos
      if (i === 17 || i === 30 || i === 45 || i === 60 || i === 75) {
        setShowSkullPopup(true);
        setTimeout(() => setShowSkullPopup(false), 600);
      }

      // Efecto de glitch ocasional
      if (i % 5 === 0) {
        setGlitchActive(true);
        setTimeout(() => setGlitchActive(false), 200);
      }
    }

    await new Promise(resolve => setTimeout(resolve, 1000));
    setStep('hacked');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // No hace nada, el proceso es automático
  };

  if (step === 'hacked') {
    return (
      <div className="relative bg-black min-h-screen w-full overflow-y-auto overflow-x-hidden font-mono">
        {/* Efecto scanline de terminal */}
        <div className="fixed inset-0 pointer-events-none z-20">
          <div className="absolute inset-0" style={{
            background: 'repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.15) 1px, transparent 1px, transparent 2px)',
          }} />
          <motion.div
            animate={{ opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 bg-gradient-radial from-transparent to-black/30"
          />
        </div>

        {/* Efecto de fondo perturbador */}
        <motion.div
          animate={{
            opacity: [0.1, 0.3, 0.1],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 3, repeat: Infinity }}
          className="fixed inset-0 bg-gradient-to-br from-red-950 via-black to-red-950 -z-10"
        />

        {/* Calaveras flotantes de fondo */}
        {Array(12).fill(0).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0.05, 0.15, 0.05],
              y: [0, -30, 0],
              x: Math.sin(i) * 50,
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              delay: i * 0.5,
            }}
            className="fixed -z-10 pointer-events-none"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          >
            <Skull className="w-12 h-12 md:w-16 md:h-16 text-red-600" />
          </motion.div>
        ))}

        {/* Contenido scrolleable */}
        <div className="relative py-4 px-3 md:py-6 md:px-6">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-5xl w-full mx-auto relative z-10"
          >
          {/* Terminal header */}
          <div className="bg-gray-900 border-b border-red-600/50 px-3 py-2 mb-3 rounded-t-lg flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <span className="text-gray-400 text-xs ml-2">root@COMPROMISED:~# MALWARE_PAYLOAD.exe</span>
          </div>

          <motion.div
            animate={{
              boxShadow: [
                '0 0 30px rgba(220, 38, 38, 0.6)',
                '0 0 80px rgba(220, 38, 38, 0.9)',
                '0 0 30px rgba(220, 38, 38, 0.6)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="bg-black/90 backdrop-blur-sm border-2 md:border-4 border-red-600 rounded-xl md:rounded-2xl p-4 md:p-6 relative max-h-[85vh] overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-red-600 scrollbar-track-gray-900"
            style={{
              boxShadow: '0 0 20px rgba(220, 38, 38, 0.5), inset 0 0 60px rgba(0, 0, 0, 0.5)',
            }}
          >
            {/* Efecto de escaneo */}
            <motion.div
              animate={{ y: [-400, 800] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-x-0 h-32 bg-gradient-to-b from-transparent via-red-500/10 to-transparent pointer-events-none"
            />

            <motion.div
              animate={{ 
                rotate: [0, 5, -5, 5, 0],
                scale: [1, 1.1, 1, 1.1, 1]
              }}
              transition={{ duration: 1, repeat: Infinity }}
              className="relative"
            >
              <Skull className="w-16 h-16 md:w-24 md:h-24 text-red-600 mx-auto mb-3 md:mb-4 drop-shadow-[0_0_30px_rgba(220,38,38,0.8)]" />
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-20 h-20 md:w-28 md:h-28 rounded-full border-2 border-red-600"
                />
              </div>
            </motion.div>

            <div className="text-center mb-3 md:mb-4">
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="text-green-500 text-xs mb-2 font-bold tracking-widest"
              >
                [ SISTEMA INFILTRADO - ACCESO ROOT OBTENIDO ]
              </motion.div>
              <motion.h1 
                className="text-xl md:text-3xl lg:text-4xl font-black text-red-600 mb-2 tracking-wider"
                animate={{
                  textShadow: [
                    '0 0 10px rgba(220, 38, 38, 0.5)',
                    '0 0 30px rgba(220, 38, 38, 0.8)',
                    '0 0 10px rgba(220, 38, 38, 0.5)',
                  ],
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                ⚠️ DISPOSITIVO COMPROMETIDO ⚠️
              </motion.h1>
              <div className="text-yellow-500 text-[10px] md:text-xs tracking-wider">
                &gt;&gt; PROTOCOLO DE EXTRACCION: COMPLETADO &lt;&lt;
              </div>
            </div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="space-y-3 md:space-y-4"
            >
              {/* Alerta principal */}
              <div className="bg-red-950/50 border border-red-600/50 md:border-2 rounded-lg md:rounded-xl p-3 md:p-4 relative overflow-hidden">
                {/* Terminal prompt */}
                <div className="absolute top-2 left-2 text-green-500 text-[8px] md:text-[10px] opacity-50">
                  root@compromised:~$
                </div>
                <div className="flex items-center justify-center gap-2 mb-2 md:mb-3 mt-2">
                  <AlertTriangle className="w-4 h-4 md:w-6 md:h-6 text-red-500 animate-pulse" />
                  <p className="text-base md:text-xl font-black text-red-500 text-center tracking-wider">
                    &gt;&gt; ACCESO ROOT OBTENIDO &lt;&lt;
                  </p>
                  <AlertTriangle className="w-4 h-4 md:w-6 md:h-6 text-red-500 animate-pulse" />
                </div>
                
                <div className="space-y-1 text-left font-mono text-[10px] md:text-xs">
                  <p className="text-red-400 before:content-['>_'] before:text-green-500 before:mr-2">
                    → Backdoor instalado permanentemente en el sistema
                  </p>
                  <p className="text-red-400 before:content-['>_'] before:text-green-500 before:mr-2">
                    → Datos bancarios transmitidos a servidor remoto (Rusia)
                  </p>
                  <p className="text-red-400 before:content-['>_'] before:text-green-500 before:mr-2">
                    → Su identidad vendida en Dark Web por $850 USD
                  </p>
                  <p className="text-yellow-400 font-bold before:content-['>_'] before:text-green-500 before:mr-2">
                    → Ransomware activo: Cifrado automático en 72 horas
                  </p>
                </div>
              </div>

              {/* Información de DOXEO */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
                <div className="bg-gray-900/80 border border-red-500/30 rounded-lg p-3 relative overflow-hidden">
                  {/* CRT glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent pointer-events-none" />
                  <h3 className="text-red-500 font-bold mb-2 flex items-center gap-2 text-sm tracking-wider">
                    <MapPin className="w-4 h-4" />
                    [ GEOLOCALIZACIÓN CAPTURADA ]
                  </h3>
                  <div className="space-y-1 text-[10px] md:text-xs font-mono">
                    <p className="text-gray-400 before:content-['>'] before:text-green-500 before:mr-2">
                      <span className="text-red-400">IP Pública:</span> {doxData.ip}
                    </p>
                    <p className="text-gray-400 before:content-['>'] before:text-green-500 before:mr-2">
                      <span className="text-red-400">Ubicación:</span> {doxData.location}
                    </p>
                    <p className="text-gray-400 before:content-['>'] before:text-green-500 before:mr-2">
                      <span className="text-red-400">ISP:</span> {doxData.isp}
                    </p>
                    <p className="text-gray-400 before:content-['>'] before:text-green-500 before:mr-2">
                      <span className="text-red-400">Dispositivo:</span> {doxData.device}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-900/80 border border-red-500/30 rounded-lg p-3 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent pointer-events-none" />
                  <h3 className="text-red-500 font-bold mb-2 flex items-center gap-2 text-sm tracking-wider">
                    <User className="w-4 h-4" />
                    [ INFORMACIÓN PERSONAL ]
                  </h3>
                  <div className="space-y-1 text-[10px] md:text-xs font-mono">
                    <p className="text-gray-400 before:content-['>'] before:text-green-500 before:mr-2">
                      <span className="text-red-400">Email:</span> {doxData.email}
                    </p>
                    <p className="text-gray-400 before:content-['>'] before:text-green-500 before:mr-2">
                      <span className="text-red-400">Teléfono:</span> {doxData.phone}
                    </p>
                    <p className="text-gray-400 before:content-['>'] before:text-green-500 before:mr-2">
                      <span className="text-red-400">Navegador:</span> {doxData.browser}
                    </p>
                    <p className="text-gray-400 before:content-['>'] before:text-green-500 before:mr-2">
                      <span className="text-red-400">Sistema:</span> {doxData.os}
                    </p>
                  </div>
                </div>
              </div>

              {/* Datos bancarios robados */}
              <div className="bg-gray-900/80 border border-yellow-500/50 rounded-lg p-3">
                <h3 className="text-yellow-500 font-bold mb-2 flex items-center gap-2 text-sm">
                  <CreditCard className="w-4 h-4" />
                  INFORMACIÓN FINANCIERA EXFILTRADA
                </h3>
                <div className="space-y-1 text-[10px] md:text-xs font-mono">
                  <p className="text-gray-400">
                    <span className="text-yellow-400">Tarjeta:</span> •••• •••• •••• {cardNumber.slice(-4)}
                  </p>
                  <p className="text-gray-400">
                    <span className="text-yellow-400">Titular:</span> {cardName}
                  </p>
                  <p className="text-gray-400">
                    <span className="text-yellow-400">Expiración:</span> {expiry} | <span className="text-yellow-400">CVV:</span> •••
                  </p>
                  <p className="text-yellow-400 font-bold mt-2">
                    ⚠️ Datos cifrados con RSA-4096 y enviados a: 185.220.101.### vía TOR
                  </p>
                  <p className="text-red-400 font-bold">
                    💰 Vendido en mercado negro por: $1,200 USD
                  </p>
                </div>
              </div>

              {/* Advertencia legal falsa */}
              <div className="bg-yellow-950/30 border border-yellow-500/50 md:border-2 rounded-lg p-3 md:p-4">
                <h3 className="text-yellow-500 font-bold mb-2 flex items-center gap-2 text-sm">
                  <Shield className="w-4 h-4" />
                  NOTIFICACIÓN LEGAL OBLIGATORIA
                </h3>
                <p className="text-yellow-400 text-[10px] md:text-xs font-mono leading-relaxed mb-1 md:mb-2">
                  Conforme a la Ley Federal 18 U.S.C. § 1030 (Computer Fraud and Abuse Act) 
                  y el Artículo 211 del Código Penal Federal, el acceso no autorizado a sistemas 
                  informáticos constituye un delito federal con penas de hasta 20 años de prisión. 
                  Sus datos personales y financieros han sido comprometidos, cifrados y distribuidos 
                  en mercados ilegales de la Dark Web.
                </p>
                <p className="text-yellow-400 text-xs font-mono leading-relaxed mb-2">
                  La División de Delitos Cibernéticos del FBI ha sido notificada automáticamente. 
                  Su dirección IP ({doxData.ip}) quedó registrada en sistemas de monitoreo federal.
                </p>
                <p className="text-red-500 text-xs font-bold mt-2">
                  ⚠️ NO APAGUE SU DISPOSITIVO - Esto activará el cifrado inmediato de todos sus archivos
                </p>
                <p className="text-red-500 text-xs font-bold">
                  ⚠️ NO CIERRE ESTA VENTANA - El ransomware está en modo de espera
                </p>
              </div>

              {/* Archivos robados */}
              <div className="bg-gray-900/80 border border-red-500/30 rounded-lg p-3">
                <h3 className="text-red-500 font-bold mb-2 flex items-center gap-2 text-sm">
                  <Database className="w-4 h-4" />
                  ARCHIVOS EXFILTRADOS DEL SISTEMA
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[10px] md:text-xs font-mono">
                  <div className="text-center">
                    <p className="text-red-400 font-bold text-2xl">247</p>
                    <p className="text-gray-400">Documentos</p>
                  </div>
                  <div className="text-center">
                    <p className="text-red-400 font-bold text-2xl">1,832</p>
                    <p className="text-gray-400">Imágenes</p>
                  </div>
                  <div className="text-center">
                    <p className="text-red-400 font-bold text-2xl">94</p>
                    <p className="text-gray-400">Videos</p>
                  </div>
                  <div className="text-center">
                    <p className="text-red-400 font-bold text-2xl">67</p>
                    <p className="text-gray-400">Contraseñas</p>
                  </div>
                </div>
                <p className="text-center text-gray-400 mt-3 text-xs">
                  Tamaño total transmitido: <span className="text-red-400 font-bold">4.7 GB</span>
                </p>
              </div>

              {/* Estado del sistema */}
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex flex-wrap items-center justify-center gap-2 md:gap-3 text-red-500 text-[10px] md:text-xs font-bold"
              >
                <div className="flex items-center gap-1 md:gap-2">
                  <WifiOff className="w-3 h-3 md:w-4 md:h-4" />
                  <span>FIREWALL DESHABILITADO</span>
                </div>
                <div className="flex items-center gap-1 md:gap-2">
                  <Camera className="w-3 h-3 md:w-4 md:h-4" />
                  <span>CÁMARA ACTIVADA</span>
                </div>
                <div className="flex items-center gap-1 md:gap-2">
                  <Database className="w-3 h-3 md:w-4 md:h-4" />
                  <span>DATOS EN LA DARK WEB</span>
                </div>
              </motion.div>

              {/* Compradores interesados */}
              <div className="bg-red-950/30 border border-red-500/30 rounded-lg p-3">
                <h3 className="text-red-500 font-bold mb-1 text-xs md:text-sm flex items-center gap-2">
                  <AlertTriangle className="w-3 h-3 md:w-4 md:h-4" />
                  ACTIVIDAD EN MERCADO NEGRO
                </h3>
                <p className="text-red-400 text-[10px] md:text-xs font-mono">
                  → 47 compradores activos interesados en sus datos
                </p>
                <p className="text-red-400 text-xs font-mono">
                  → Última oferta: $2,050 USD (paquete completo)
                </p>
                <p className="text-yellow-400 text-xs font-mono">
                  → Redes sociales identificadas: Facebook, Instagram, Twitter, LinkedIn
                </p>
              </div>

              {/* Información técnica */}
              <div className="pt-2 md:pt-3 space-y-0.5 text-gray-600 text-[9px] md:text-[10px] font-mono border-t border-red-900/30">
                <p className="before:content-['>'] before:text-green-700 before:mr-2">MALWARE_ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}-RANSOMWARE</p>
                <p className="before:content-['>'] before:text-green-700 before:mr-2">PAYLOAD_TYPE: TROJAN.BACKDOOR.WIN32</p>
                <p className="before:content-['>'] before:text-green-700 before:mr-2">C&C_SERVER: 185.220.101.### (Moscow, RU)</p>
                <p className="before:content-['>'] before:text-green-700 before:mr-2">SESSION_TOKEN: COMPROMISED</p>
                <p className="before:content-['>'] before:text-green-700 before:mr-2">ENCRYPTION_STATUS: PENDING (72H)</p>
                <p className="before:content-['>'] before:text-green-700 before:mr-2">FIREWALL_STATUS: DISABLED</p>
                <p className="before:content-['>'] before:text-green-700 before:mr-2">ANTIVIRUS_STATUS: DISABLED</p>
                <p className="before:content-['>'] before:text-green-700 before:mr-2">KEYLOGGER_STATUS: ACTIVE</p>
                <p className="before:content-['>'] before:text-green-700 before:mr-2">EXFILTRATION_STATUS: COMPLETED</p>
                <p className="before:content-['>'] before:text-green-700 before:mr-2">DARK_WEB_LISTING: ACTIVE</p>
                <p className="before:content-['>'] before:text-green-700 before:mr-2">TIMESTAMP: {new Date().toISOString()}</p>
              </div>

              {/* Scroll indicator */}
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-center text-green-500 text-xs mt-4 opacity-50"
              >
                ↓ Desplazar para ver más detalles ↓
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
        </div>
      </div>
    );
  }

  if (step === 'processing') {
    return (
      <div className="bg-black text-green-400 font-mono p-4 md:p-8 min-h-screen overflow-y-auto relative">
        {/* Calavera emergente aterradora */}
        <AnimatePresence>
          {showSkullPopup && (
            <motion.div
              initial={{ scale: 0, rotate: -180, opacity: 0 }}
              animate={{ scale: 1.5, rotate: 0, opacity: 1 }}
              exit={{ scale: 0, rotate: 180, opacity: 0 }}
              transition={{ duration: 0.3, type: 'spring', stiffness: 200 }}
              className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
            >
              <motion.div
                animate={{
                  filter: [
                    'drop-shadow(0 0 20px rgba(220, 38, 38, 0.8))',
                    'drop-shadow(0 0 60px rgba(220, 38, 38, 1))',
                    'drop-shadow(0 0 20px rgba(220, 38, 38, 0.8))',
                  ],
                }}
                transition={{ duration: 0.3, repeat: 2 }}
              >
                <Skull className="w-48 h-48 md:w-64 md:h-64 text-red-600" />
              </motion.div>
              
              {/* Flash rojo de fondo */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.5, 0] }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 bg-red-600 -z-10"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Efecto de glitch en toda la pantalla */}
        {glitchActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0, 1, 0, 1, 0],
              x: [0, -5, 5, -5, 0],
            }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-red-600/20 pointer-events-none z-40"
          />
        )}

        {/* Efecto Matrix de fondo */}
        <div className="fixed inset-0 opacity-10 pointer-events-none">
          {Array(50).fill(0).map((_, i) => (
            <motion.div
              key={i}
              initial={{ y: -100 }}
              animate={{ y: window.innerHeight + 100 }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
              className="absolute text-green-500 text-sm"
              style={{ left: `${Math.random() * 100}%` }}
            >
              {String.fromCharCode(Math.random() * 94 + 33)}
            </motion.div>
          ))}
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          {/* Header de terminal hacker */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 md:mb-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <Terminal className="w-6 h-6 md:w-8 md:h-8" />
              <span className="text-xl md:text-2xl font-bold">MALWARE_PAYLOAD.exe</span>
              <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                _
              </motion.span>
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="text-red-500">[UNAUTHORIZED ACCESS]</span>
              <span className="text-yellow-500">[DATA EXFILTRATION]</span>
              <span className="text-green-400">[ACTIVE]</span>
            </div>
          </motion.div>

          {/* Progress bar hacker style */}
          <div className="mb-6 md:mb-8">
            <div className="flex justify-between mb-2 text-sm md:text-base">
              <span>EXTRACTING SENSITIVE DATA...</span>
              <span>{Math.floor(hackProgress)}%</span>
            </div>
            <div className="h-3 md:h-4 bg-gray-900 border border-green-400 rounded">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${hackProgress}%` }}
                className="h-full bg-gradient-to-r from-red-600 via-yellow-500 to-green-400"
                style={{
                  boxShadow: '0 0 20px rgba(34, 197, 94, 0.8)',
                }}
              />
            </div>
          </div>

          {/* Terminal output */}
          <div className="bg-gray-900 border-2 border-green-400 rounded-lg p-4 md:p-6 mb-4 h-[400px] md:h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-green-400 scrollbar-track-gray-900">
            {hackingMessages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`mb-2 text-xs md:text-sm ${
                  msg.includes('ERROR') || msg.includes('CRÍTICO') || msg.includes('VULNERADO') || msg.includes('NO HAY MARCHA ATRÁS')
                    ? 'text-red-500 font-bold'
                    : msg.includes('ALERTA') || msg.includes('vendida') || msg.includes('COMPLETADA')
                    ? 'text-yellow-500'
                    : msg.includes('-------------------------')
                    ? 'text-gray-600'
                    : msg.includes('DATOS') || msg.includes('INFORMACIÓN')
                    ? 'text-cyan-400'
                    : 'text-green-400'
                }`}
              >
                {msg}
                {idx === hackingMessages.length - 1 && (
                  <motion.span
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  >
                    _
                  </motion.span>
                )}
              </motion.div>
            ))}
          </div>

          {/* Advertencias múltiples */}
          <div className="space-y-3">
            <motion.div
              animate={{
                opacity: [0.5, 1, 0.5],
                scale: [1, 1.05, 1],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex items-center justify-center gap-3 text-red-500 text-sm md:text-lg"
            >
              <AlertTriangle className="w-5 h-5 md:w-6 md:h-6" />
              <span className="font-bold">SYSTEM BREACH DETECTED</span>
              <AlertTriangle className="w-5 h-5 md:w-6 md:h-6" />
            </motion.div>

            <motion.div
              animate={{
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
              className="flex items-center justify-center gap-3 text-yellow-500 text-xs md:text-sm"
            >
              <Skull className="w-4 h-4 md:w-5 md:h-5" />
              <span className="font-bold">RANSOMWARE ACTIVE - 72H COUNTDOWN</span>
              <Skull className="w-4 h-4 md:w-5 md:h-5" />
            </motion.div>

            <motion.div
              animate={{
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{ duration: 1, repeat: Infinity, delay: 1 }}
              className="flex items-center justify-center gap-3 text-red-400 text-xs"
            >
              <WifiOff className="w-4 h-4" />
              <span className="font-mono">DARK WEB UPLOAD IN PROGRESS</span>
              <Database className="w-4 h-4" />
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gruvbox-bg via-gruvbox-bg0 to-gruvbox-bg p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header con advertencias */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <motion.div
            animate={{ rotate: [0, 5, -5, 5, 0] }}
            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
          >
            <Lock className={`w-16 h-16 mx-auto mb-4 ${glitchActive ? 'text-gruvbox-red' : 'text-gruvbox-yellow'}`} />
          </motion.div>
          <h1 className="text-4xl font-black text-gruvbox-fg mb-2">
            Pago Seguro™
          </h1>
          <p className="text-gruvbox-fg4 flex items-center justify-center gap-2">
            <Shield className="w-4 h-4" />
            100% Protegido y Encriptado SSL 256-bit
            <Shield className="w-4 h-4" />
          </p>
        </motion.div>

        {/* Formulario */}
        <motion.form
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          onSubmit={handleSubmit}
          className={`bg-gruvbox-bg0 border-2 rounded-2xl p-8 relative overflow-hidden ${
            glitchActive ? 'border-gruvbox-red' : 'border-gruvbox-aqua/30'
          }`}
        >
          {/* Efecto de glitch */}
          {glitchActive && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-gruvbox-red/10 z-10 pointer-events-none"
            />
          )}

          {/* Mensaje de autocompletado */}
          {isAutofilling && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-gruvbox-yellow/20 border border-gruvbox-yellow/40 rounded-lg flex items-center gap-2"
            >
              <Eye className="w-5 h-5 text-gruvbox-yellow animate-pulse" />
              <span className="text-gruvbox-yellow text-sm font-bold">
                Autocompletando información detectada del navegador...
              </span>
            </motion.div>
          )}

          <div className="space-y-6">
            {/* Número de tarjeta */}
            <div>
              <label className="block text-gruvbox-fg font-bold mb-2">
                Número de Tarjeta
              </label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gruvbox-fg4 w-5 h-5" />
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="0000 0000 0000 0000"
                  disabled={isAutofilling}
                  className="w-full pl-12 pr-4 py-3 bg-gruvbox-bg1 border-2 border-gruvbox-aqua/30 rounded-lg text-gruvbox-fg font-mono text-lg focus:border-gruvbox-aqua focus:outline-none disabled:opacity-70"
                  maxLength={19}
                />
              </div>
            </div>

            {/* Nombre en tarjeta */}
            <div>
              <label className="block text-gruvbox-fg font-bold mb-2">
                Nombre en la Tarjeta
              </label>
              <input
                type="text"
                value={cardName}
                onChange={(e) => setCardName(e.target.value.toUpperCase())}
                placeholder="NOMBRE COMPLETO"
                disabled={isAutofilling}
                className="w-full px-4 py-3 bg-gruvbox-bg1 border-2 border-gruvbox-aqua/30 rounded-lg text-gruvbox-fg font-mono text-lg focus:border-gruvbox-aqua focus:outline-none disabled:opacity-70 uppercase"
              />
            </div>

            {/* Expiración y CVV */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gruvbox-fg font-bold mb-2">
                  Expiración
                </label>
                <input
                  type="text"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  placeholder="MM/YY"
                  disabled={isAutofilling}
                  className="w-full px-4 py-3 bg-gruvbox-bg1 border-2 border-gruvbox-aqua/30 rounded-lg text-gruvbox-fg font-mono text-lg focus:border-gruvbox-aqua focus:outline-none disabled:opacity-70"
                  maxLength={5}
                />
              </div>
              <div>
                <label className="block text-gruvbox-fg font-bold mb-2">
                  CVV
                </label>
                <input
                  type="text"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  placeholder="123"
                  disabled={isAutofilling}
                  className="w-full px-4 py-3 bg-gruvbox-bg1 border-2 border-gruvbox-aqua/30 rounded-lg text-gruvbox-fg font-mono text-lg focus:border-gruvbox-aqua focus:outline-none disabled:opacity-70"
                  maxLength={3}
                />
              </div>
            </div>

            {/* Botones - El submit está oculto ya que todo es automático */}
            <div className="space-y-3 pt-4">
              <motion.div
                animate={{
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-full py-4 bg-gradient-to-r from-gruvbox-yellow via-gruvbox-orange to-gruvbox-red text-gruvbox-bg font-black rounded-xl text-xl shadow-lg flex items-center justify-center gap-2"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                >
                  <Zap className="w-5 h-5" />
                </motion.div>
                Procesando Pago Seguro...
                <Lock className="w-5 h-5" />
              </motion.div>

              <div className="text-center text-gruvbox-fg4 text-sm font-bold">
                <motion.span
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  🔒 Transacción protegida - No cierre esta ventana
                </motion.span>
              </div>
            </div>
          </div>

          {/* Iconos de seguridad falsos */}
          <div className="mt-6 pt-6 border-t border-gruvbox-fg4/20">
            <div className="flex items-center justify-center gap-6 text-gruvbox-fg4 text-sm">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>SSL/TLS</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                <span>256-bit</span>
              </div>
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4" />
                <span>PCI DSS</span>
              </div>
            </div>
          </div>
        </motion.form>

        {/* Advertencia sospechosa */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="mt-6 text-center text-gruvbox-fg4 text-xs"
        >
          <p>* Al procesar el pago, acepta nuestros términos y condiciones de servicio</p>
        </motion.div>
      </div>
    </div>
  );
};
