import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface CircularAudioVisualizerProps {
  howl: any;
  isPlaying: boolean;
}

export const CircularAudioVisualizer: React.FC<CircularAudioVisualizerProps> = ({ 
  howl, 
  isPlaying 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number>();
  const [initialized, setInitialized] = useState(false);

  // Inicializar AudioContext - Conectar directamente al sonido activo
  useEffect(() => {
    if (!howl) {
      console.log('⚠️ No hay howl disponible');
      return;
    }

    if (!isPlaying) {
      console.log('⏸️ Audio pausado, no inicializar analizador');
      return;
    }

    console.log('🎵 Inicializando visualizador...');

    const initAudioAnalyser = () => {
      try {
        // Obtener el contexto de audio global de Howler
        const ctx = (Howler as any).ctx;
        if (!ctx) {
          console.warn('❌ AudioContext no disponible');
          return;
        }

        // Reanudar contexto si está suspendido
        if (ctx.state === 'suspended') {
          ctx.resume();
        }

        // Si ya existe y funciona, no recrear
        if (analyserRef.current && initialized) {
          const testData = new Uint8Array(analyserRef.current.frequencyBinCount);
          analyserRef.current.getByteFrequencyData(testData);
          const sum = testData.reduce((a, b) => a + b, 0);
          
          if (sum > 0) {
            return; // Ya funciona
          }
          
          // No funciona, recrear
          analyserRef.current = null;
          setInitialized(false);
        }

        // Crear analizador
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 2048;
        analyser.smoothingTimeConstant = 0.65;
        analyser.minDecibels = -85;
        analyser.maxDecibels = -15;

        // Conectar a Howler Web Audio API
        try {
          const masterGain = (Howler as any).masterGain;
          
          if (!masterGain) {
            console.error('❌ MasterGain no disponible');
            return;
          }

          // Limpiar conexión anterior
          if (sourceRef.current) {
            try {
              sourceRef.current.disconnect();
            } catch (e) {
              // Ignorar
            }
          }

          // Crear nodo intermedio
          const intermediateGain = ctx.createGain();
          intermediateGain.gain.value = 1.0;
          
          // Desconectar y reconectar
          try {
            masterGain.disconnect();
          } catch (e) {
            // Ignorar
          }
          
          // Cadena: masterGain -> intermediateGain -> analyser + destination
          masterGain.connect(intermediateGain);
          intermediateGain.connect(analyser);
          intermediateGain.connect(ctx.destination);
          
          sourceRef.current = intermediateGain;
          analyserRef.current = analyser;
          setInitialized(true);
          
          console.log('✅ Visualizador conectado');
          
        } catch (e) {
          console.error('❌ Error conectando:', e);
        }
      } catch (error) {
        console.error('❌ Error fatal:', error);
      }
    };

    // Esperar a que el audio esté realmente sonando
    const timer = setTimeout(initAudioAnalyser, 400);
    return () => clearTimeout(timer);
  }, [howl, isPlaying]); // Reconectar cuando cambia canción O estado de play

  // Efecto de animación mejorado con más diseño
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 40;

    let animationId: number;
    let frameCount = 0;
    let rotationAngle = 0;

    const draw = () => {
      frameCount++;
      rotationAngle += 0.005; // Rotación suave
      
      // Limpiar canvas con efecto de estela
      ctx.fillStyle = 'rgba(29, 32, 33, 0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Si está pausado o no hay analizador, mostrar estado
      if (!isPlaying || !analyserRef.current) {
        drawStatic(ctx, centerX, centerY, radius, rotationAngle);
        animationId = requestAnimationFrame(draw);
        return;
      }

      // Obtener datos de frecuencia
      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyserRef.current.getByteFrequencyData(dataArray);

      // Calcular promedios por banda de frecuencia PRIMERO
      const bass = dataArray.slice(0, 8).reduce((a, b) => a + b, 0) / 8;
      const lowMid = dataArray.slice(8, 32).reduce((a, b) => a + b, 0) / 24;
      const mid = dataArray.slice(32, 64).reduce((a, b) => a + b, 0) / 32;
      const highMid = dataArray.slice(64, 128).reduce((a, b) => a + b, 0) / 64;
      const treble = dataArray.slice(128, 256).reduce((a, b) => a + b, 0) / 128;
      const avgAll = (bass + lowMid + mid + highMid + treble) / 5;

      // Debug solo al inicio para verificar que funciona
      if (frameCount === 60 || frameCount === 180) {
        const sum = dataArray.reduce((a, b) => a + b, 0);
        const avg = sum / bufferLength;
        const max = Math.max(...dataArray);
        const nonZero = dataArray.filter(v => v > 0).length;
        
        console.log('🎵 Visualizer Check - Frame:', frameCount);
        console.log('   Sum:', sum.toFixed(1), '| Max:', max, '| Non-zero:', nonZero);
        console.log('   Bass:', bass.toFixed(1), '| Mid:', mid.toFixed(1), '| Treble:', treble.toFixed(1));
        
        if (frameCount === 180 && sum > 0) {
          console.log('✅ Visualizador funcionando correctamente!');
        }
      }

      // SIEMPRE intentar dibujar con datos reales, incluso si son pequeños
      // Solo usar fallback si realmente está pausado
      const useRealData = isPlaying && analyserRef.current;

      if (!useRealData) {
        // Solo fallback cuando está pausado
        drawAnimatedFallback(ctx, centerX, centerY, radius, frameCount, rotationAngle);
        animationId = requestAnimationFrame(draw);
        return;
      }

      // === DIBUJO CON DATOS REALES ===
      // Amplificar los valores para hacerlos más visibles
      const amplification = 1.5;
      const bass_amp = Math.min(255, bass * amplification);
      const lowMid_amp = Math.min(255, lowMid * amplification);
      const mid_amp = Math.min(255, mid * amplification);
      const highMid_amp = Math.min(255, highMid * amplification);
      const treble_amp = Math.min(255, treble * amplification);
      const avgAll_amp = (bass_amp + lowMid_amp + mid_amp + highMid_amp + treble_amp) / 5;

      // === ESFERA CENTRAL 3D CON MÚLTIPLES CAPAS ===
      const pulseScale = 1 + (bass_amp / 255) * 0.5; // Reacciona a graves
      const sphereRadius = radius * 0.4 * pulseScale;

      // Capa externa de la esfera (glow)
      const outerGlow = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, sphereRadius * 1.3
      );
      outerGlow.addColorStop(0, `rgba(250, 189, 47, ${0.1 + bass_amp / 512})`);
      outerGlow.addColorStop(0.7, `rgba(254, 128, 25, ${0.05 + bass_amp / 768})`);
      outerGlow.addColorStop(1, 'rgba(254, 128, 25, 0)');
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, sphereRadius * 1.3, 0, Math.PI * 2);
      ctx.fillStyle = outerGlow;
      ctx.fill();

      // Capa principal de la esfera
      const mainGradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, sphereRadius
      );
      mainGradient.addColorStop(0, `rgba(142, 192, 124, ${0.8 + lowMid_amp / 512})`);
      mainGradient.addColorStop(0.4, `rgba(250, 189, 47, ${0.6 + mid_amp / 512})`);
      mainGradient.addColorStop(0.7, `rgba(211, 134, 155, ${0.5 + highMid_amp / 512})`);
      mainGradient.addColorStop(1, `rgba(254, 128, 25, ${0.3 + treble_amp / 768})`);

      ctx.beginPath();
      ctx.arc(centerX, centerY, sphereRadius, 0, Math.PI * 2);
      ctx.fillStyle = mainGradient;
      ctx.fill();

      // Highlight 3D (simula iluminación)
      const highlightSize = sphereRadius * 0.6;
      const highlightX = centerX - sphereRadius * 0.25;
      const highlightY = centerY - sphereRadius * 0.25;
      
      const highlight = ctx.createRadialGradient(
        highlightX, highlightY, 0,
        highlightX, highlightY, highlightSize
      );
      highlight.addColorStop(0, 'rgba(255, 255, 255, 0.5)');
      highlight.addColorStop(0.5, 'rgba(255, 255, 255, 0.2)');
      highlight.addColorStop(1, 'rgba(255, 255, 255, 0)');
      
      ctx.beginPath();
      ctx.arc(highlightX, highlightY, highlightSize, 0, Math.PI * 2);
      ctx.fillStyle = highlight;
      ctx.fill();

      // === BARRAS DE FRECUENCIA CIRCULARES MEJORADAS ===
      const barCount = 80; // Más barras para más detalle
      const angleStep = (Math.PI * 2) / barCount;

      for (let i = 0; i < barCount; i++) {
        const angle = angleStep * i + rotationAngle;
        
        // Mapear a diferentes rangos de frecuencia para más variedad
        let dataIndex: number;
        if (i < barCount * 0.2) {
          // Graves (0-20%)
          dataIndex = Math.floor((i / (barCount * 0.2)) * 16);
        } else if (i < barCount * 0.5) {
          // Medios-bajos (20-50%)
          dataIndex = 16 + Math.floor(((i - barCount * 0.2) / (barCount * 0.3)) * 48);
        } else {
          // Agudos (50-100%)
          dataIndex = 64 + Math.floor(((i - barCount * 0.5) / (barCount * 0.5)) * 64);
        }
        
        const value = dataArray[Math.min(dataIndex, bufferLength - 1)] || 0;
        const normalizedValue = value / 255;
        
        // Altura de la barra con más reactividad
        const minHeight = 5;
        const maxHeight = radius * 0.55;
        const barHeight = minHeight + normalizedValue * maxHeight;
        
        // Posiciones
        const innerRadius = radius * 0.55;
        const startX = centerX + Math.cos(angle) * innerRadius;
        const startY = centerY + Math.sin(angle) * innerRadius;
        const endX = centerX + Math.cos(angle) * (innerRadius + barHeight);
        const endY = centerY + Math.sin(angle) * (innerRadius + barHeight);

        // Colores Gruvbox con transiciones suaves
        const colors = [
          { r: 142, g: 192, b: 124 },  // aqua
          { r: 184, g: 187, b: 38 },   // green
          { r: 250, g: 189, b: 47 },   // yellow
          { r: 254, g: 128, b: 25 },   // orange
          { r: 251, g: 73, b: 52 },    // red
          { r: 211, g: 134, b: 155 },  // purple
        ];
        
        const colorProgress = (i / barCount) * (colors.length - 1);
        const colorIndex = Math.floor(colorProgress);
        const colorBlend = colorProgress - colorIndex;
        const color1 = colors[colorIndex];
        const color2 = colors[Math.min(colorIndex + 1, colors.length - 1)];
        
        const r = Math.floor(color1.r + (color2.r - color1.r) * colorBlend);
        const g = Math.floor(color1.g + (color2.g - color1.g) * colorBlend);
        const b = Math.floor(color1.b + (color2.b - color1.b) * colorBlend);
        
        const alpha = 0.5 + normalizedValue * 0.5;
        
        // Dibujar barra con grosor variable
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.lineWidth = 2 + normalizedValue * 3;
        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Glow en puntas para frecuencias altas
        if (value > 160) {
          ctx.save();
          ctx.shadowBlur = 12 + normalizedValue * 8;
          ctx.shadowColor = `rgba(${r}, ${g}, ${b}, 0.8)`;
          ctx.beginPath();
          ctx.arc(endX, endY, 2 + normalizedValue * 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.9)`;
          ctx.fill();
          ctx.restore();
        }
      }

      // === ANILLOS CONCÉNTRICOS REACTIVOS ===
      // Anillo interno (reacciona a graves)
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 0.52, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(142, 192, 124, ${0.3 + bass_amp / 512})`;
      ctx.lineWidth = 2 + (bass_amp / 255) * 2;
      ctx.stroke();

      // Anillo medio (reacciona a medios)
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 0.75, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(250, 189, 47, ${0.2 + mid_amp / 768})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Anillo externo (reacciona a agudos)
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 0.95, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(211, 134, 155, ${0.15 + treble_amp / 1024})`;
      ctx.lineWidth = 1;
      ctx.stroke();

      // === PARTÍCULAS EXPLOSIVAS (bass reactivo) ===
      if (bass_amp > 100) {
        const particleCount = Math.floor((bass_amp / 255) * 12);
        for (let i = 0; i < particleCount; i++) {
          const particleAngle = (Math.PI * 2 * i) / particleCount + rotationAngle * 2;
          const particleRadius = radius * 0.7 + (Math.random() * 60 - 30);
          const particleX = centerX + Math.cos(particleAngle) * particleRadius;
          const particleY = centerY + Math.sin(particleAngle) * particleRadius;
          const particleSize = 1.5 + Math.random() * 3;
          
          ctx.save();
          ctx.shadowBlur = 10;
          ctx.shadowColor = 'rgba(250, 189, 47, 0.9)';
          ctx.beginPath();
          ctx.arc(particleX, particleY, particleSize, 0, Math.PI * 2);
          const particleGradient = ctx.createRadialGradient(
            particleX, particleY, 0,
            particleX, particleY, particleSize
          );
          particleGradient.addColorStop(0, 'rgba(250, 189, 47, 1)');
          particleGradient.addColorStop(1, 'rgba(254, 128, 25, 0.5)');
          ctx.fillStyle = particleGradient;
          ctx.fill();
          ctx.restore();
        }
      }

      // === PARTÍCULAS FLOTANTES (treble reactivo) ===
      if (treble_amp > 60) {
        const floatingCount = Math.floor((treble_amp / 255) * 8);
        for (let i = 0; i < floatingCount; i++) {
          const floatAngle = Math.random() * Math.PI * 2;
          const floatDistance = radius * 0.3 + Math.random() * (radius * 0.3);
          const floatX = centerX + Math.cos(floatAngle) * floatDistance;
          const floatY = centerY + Math.sin(floatAngle) * floatDistance;
          
          ctx.beginPath();
          ctx.arc(floatX, floatY, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(211, 134, 155, ${0.4 + Math.random() * 0.4})`;
          ctx.fill();
        }
      }

      animationId = requestAnimationFrame(draw);
    };

    const drawAnimatedFallback = (ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, frame: number, rotation: number) => {
      // Animación simulada mejorada
      const time = frame * 0.03;
      
      // Círculo central pulsante
      const pulseScale = 1 + Math.sin(time * 2) * 0.15;
      const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 0.4 * pulseScale);
      gradient.addColorStop(0, 'rgba(142, 192, 124, 0.7)');
      gradient.addColorStop(0.5, 'rgba(250, 189, 47, 0.5)');
      gradient.addColorStop(1, 'rgba(254, 128, 25, 0.3)');

      ctx.beginPath();
      ctx.arc(cx, cy, r * 0.4 * pulseScale, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Highlight
      const highlightSize = r * 0.3 * pulseScale;
      const highlightX = cx - r * 0.15;
      const highlightY = cy - r * 0.15;
      
      const highlight = ctx.createRadialGradient(
        highlightX, highlightY, 0,
        highlightX, highlightY, highlightSize
      );
      highlight.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
      highlight.addColorStop(1, 'rgba(255, 255, 255, 0)');
      
      ctx.beginPath();
      ctx.arc(highlightX, highlightY, highlightSize, 0, Math.PI * 2);
      ctx.fillStyle = highlight;
      ctx.fill();

      // Barras animadas
      const barCount = 80;
      const angleStep = (Math.PI * 2) / barCount;

      for (let i = 0; i < barCount; i++) {
        const angle = angleStep * i + rotation;
        const waveValue = (Math.sin(time + i * 0.15) * 0.5 + 0.5) * 
                         (Math.cos(time * 0.7 + i * 0.1) * 0.3 + 0.7);
        const barHeight = 10 + waveValue * (r * 0.35);
        
        const innerRadius = r * 0.55;
        const startX = cx + Math.cos(angle) * innerRadius;
        const startY = cy + Math.sin(angle) * innerRadius;
        const endX = cx + Math.cos(angle) * (innerRadius + barHeight);
        const endY = cy + Math.sin(angle) * (innerRadius + barHeight);

        const colors = [
          { r: 142, g: 192, b: 124 },
          { r: 184, g: 187, b: 38 },
          { r: 250, g: 189, b: 47 },
          { r: 254, g: 128, b: 25 },
          { r: 251, g: 73, b: 52 },
          { r: 211, g: 134, b: 155 },
        ];
        
        const colorProgress = (i / barCount) * (colors.length - 1);
        const colorIndex = Math.floor(colorProgress);
        const colorBlend = colorProgress - colorIndex;
        const color1 = colors[colorIndex];
        const color2 = colors[Math.min(colorIndex + 1, colors.length - 1)];
        
        const red = Math.floor(color1.r + (color2.r - color1.r) * colorBlend);
        const green = Math.floor(color1.g + (color2.g - color1.g) * colorBlend);
        const blue = Math.floor(color1.b + (color2.b - color1.b) * colorBlend);
        const alpha = 0.5 + waveValue * 0.3;
        
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.lineWidth = 2 + waveValue * 2;
        ctx.strokeStyle = `rgba(${red}, ${green}, ${blue}, ${alpha})`;
        ctx.lineCap = 'round';
        ctx.stroke();
      }

      // Anillos
      ctx.beginPath();
      ctx.arc(cx, cy, r * 0.52, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(142, 192, 124, 0.4)';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cx, cy, r * 0.75, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(250, 189, 47, 0.3)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cx, cy, r * 0.95, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(211, 134, 155, 0.2)';
      ctx.lineWidth = 1;
      ctx.stroke();
    };

    const drawStatic = (ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, rotation: number) => {
      // Estado pausado - diseño minimalista
      const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 0.4);
      gradient.addColorStop(0, 'rgba(142, 192, 124, 0.4)');
      gradient.addColorStop(0.5, 'rgba(211, 134, 155, 0.3)');
      gradient.addColorStop(1, 'rgba(254, 128, 25, 0.2)');

      ctx.beginPath();
      ctx.arc(cx, cy, r * 0.4, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Barras estáticas
      const barCount = 80;
      const angleStep = (Math.PI * 2) / barCount;

      for (let i = 0; i < barCount; i++) {
        const angle = angleStep * i + rotation;
        const barHeight = 8;
        
        const innerRadius = r * 0.55;
        const startX = cx + Math.cos(angle) * innerRadius;
        const startY = cy + Math.sin(angle) * innerRadius;
        const endX = cx + Math.cos(angle) * (innerRadius + barHeight);
        const endY = cx + Math.sin(angle) * (innerRadius + barHeight);

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'rgba(142, 192, 124, 0.3)';
        ctx.lineCap = 'round';
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.arc(cx, cy, r * 0.95, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(142, 192, 124, 0.2)';
      ctx.lineWidth = 1;
      ctx.stroke();
    };

    draw();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isPlaying]);

  return (
    <div className="relative w-full h-64 flex items-center justify-center bg-gruvbox-bg0-hard/50 rounded-lg overflow-hidden">
      <motion.canvas
        ref={canvasRef}
        width={320}
        height={256}
        className="w-full h-full"
        animate={{
          filter: isPlaying && initialized
            ? [
                'drop-shadow(0 0 20px rgba(142, 192, 124, 0.4))',
                'drop-shadow(0 0 30px rgba(211, 134, 155, 0.5))',
                'drop-shadow(0 0 20px rgba(142, 192, 124, 0.4))',
              ]
            : 'drop-shadow(0 0 10px rgba(142, 192, 124, 0.2))'
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      
      {/* Indicador de estado */}
      {!isPlaying && (
        <motion.div 
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="bg-gruvbox-bg0/80 px-4 py-2 rounded-full backdrop-blur-sm">
            <span className="text-gruvbox-fg4 text-sm font-semibold">Pausado</span>
          </div>
        </motion.div>
      )}

      {!initialized && isPlaying && (
        <motion.div 
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="bg-gruvbox-bg0/80 px-4 py-2 rounded-full backdrop-blur-sm">
            <span className="text-gruvbox-yellow text-sm font-semibold">Inicializando...</span>
          </div>
        </motion.div>
      )}
    </div>
  );
};
