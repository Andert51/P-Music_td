"""
Script para generar un archivo MP3 silencioso de prueba
Esto permite probar el reproductor mientras se suben archivos reales
"""
from pathlib import Path
import subprocess
import sys

def create_silent_mp3_with_ffmpeg(duration_seconds=30, output_file="sample.mp3"):
    """Crea un archivo MP3 silencioso usando ffmpeg directamente"""
    
    # Verificar si existe ffmpeg
    try:
        result = subprocess.run(['ffmpeg', '-version'], capture_output=True, text=True)
        if result.returncode != 0:
            return False, "ffmpeg no funciona correctamente"
    except FileNotFoundError:
        return False, "ffmpeg no está instalado"
    
    # Crear MP3 silencioso directamente con ffmpeg
    try:
        subprocess.run([
            'ffmpeg',
            '-f', 'lavfi',
            '-i', f'anullsrc=r=44100:cl=stereo:d={duration_seconds}',
            '-codec:a', 'libmp3lame',
            '-b:a', '128k',
            '-y',  # Sobrescribir si existe
            output_file
        ], check=True, capture_output=True)
        
        return True, None
        
    except subprocess.CalledProcessError as e:
        return False, f"Error al crear MP3: {e}"

def download_sample_mp3(output_file):
    """Descarga un MP3 de prueba de internet como alternativa"""
    import urllib.request
    
    # MP3 de prueba público (silencio de 30 segundos)
    url = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
    
    try:
        print("   Descargando MP3 de prueba desde internet...")
        urllib.request.urlretrieve(url, output_file)
        return True, None
    except Exception as e:
        return False, f"Error al descargar: {e}"

if __name__ == "__main__":
    # Crear directorio de uploads si no existe
    upload_dir = Path(__file__).parent / "uploads" / "songs"
    upload_dir.mkdir(parents=True, exist_ok=True)
    
    output_path = upload_dir / "sample.mp3"
    
    print("🎵 Generando archivo MP3 de prueba...")
    print("   Este archivo permite probar el reproductor mientras subes MP3s reales")
    print()
    
    # Intentar con ffmpeg primero
    success, error = create_silent_mp3_with_ffmpeg(30, str(output_path))
    
    if success:
        print("✅ Archivo MP3 creado con ffmpeg")
    else:
        print(f"⚠️  ffmpeg no disponible: {error}")
        print("   Intentando descargar MP3 de prueba...")
        print()
        
        success, error = download_sample_mp3(str(output_path))
        
        if success:
            print("✅ MP3 de prueba descargado desde internet")
        else:
            print(f"❌ Error: {error}")
            print()
            print("⚠️  No se pudo crear el MP3 automáticamente.")
            print()
            print("💡 Soluciones manuales:")
            print("   1. Descarga cualquier MP3 de prueba de internet")
            print(f"   2. Guárdalo en: {output_path}")
            print("   3. O usa la UI de upload para subir tus propios MP3s")
            sys.exit(1)
    
    print()
    print("🎉 ¡Listo! Ahora puedes probar el reproductor")
    print(f"   Archivo: {output_path}")
    print(f"   Tamaño: {output_path.stat().st_size / 1024:.1f} KB")
    print()
    print("📝 Próximos pasos:")
    print("   1. El backend debería estar sirviendo este archivo en /uploads/songs/sample.mp3")
    print("   2. Abre el frontend y reproduce cualquier canción")
    print("   3. Verifica que el reproductor funcione (play/pause/seek/volumen)")
    print("   4. Prueba el Now Playing Panel haciendo click en el cover")
    print()
    print("💡 Para usar MP3s reales:")
    print("   - Usaremos la UI de upload que crearemos a continuación")
    print("   - O copia MP3s manualmente a: src/backend/uploads/songs/")

