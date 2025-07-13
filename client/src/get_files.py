import os

# Configuración
DIRECTORIO_BASE = '.'                # Carpeta raíz a escanear
CARPETAS_IGNORADAS = {
    '.venv', '__pycache__', 'node_modules',
    'static', 'staticfiles', 'notes', 'migrations', 'images'
}
ARCHIVO_SALIDA = 'codigo_contenido.txt'


def debe_ignorar(path: str) -> bool:
    """Devuelve True si la ruta pertenece a una carpeta ignorada."""
    return any(parte in CARPETAS_IGNORADAS for parte in path.split(os.sep))


with open(ARCHIVO_SALIDA, 'w', encoding='utf-8') as salida:
    for root, dirs, files in os.walk(DIRECTORIO_BASE):
        # Excluir las carpetas ignoradas del recorrido
        dirs[:] = [d for d in dirs if d not in CARPETAS_IGNORADAS]

        for nombre_archivo in files:
            ruta_completa = os.path.join(root, nombre_archivo)

            if debe_ignorar(ruta_completa):
                continue  # Se encuentra dentro de una carpeta a ignorar

            try:
                with open(ruta_completa, 'r', encoding='utf-8') as f:
                    contenido = f.read()
                salida.write(f'=== {ruta_completa} ===\n{contenido}\n\n')
            except Exception as e:
                # Por si el archivo no es de texto o la codificación falla
                print(f'No se pudo leer {ruta_completa}: {e}')
