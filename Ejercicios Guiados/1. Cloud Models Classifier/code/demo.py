#!/usr/bin/env python3
"""
Script de demostración del Clasificador de Servicios en la Nube
Muestra todas las funcionalidades disponibles
"""

import subprocess
import sys
import os

def run_command(command, description):
    """Ejecuta un comando y muestra su descripción"""
    print(f"\n{'='*80}")
    print(f"DEMOSTRACIÓN: {description}")
    print(f"{'='*80}")
    print(f"Comando: {command}")
    print(f"{'='*80}")
    
    try:
        result = subprocess.run(command, shell=True, capture_output=True, text=True)
        if result.stdout:
            print(result.stdout)
        if result.stderr:
            print("ERROR:", result.stderr)
    except Exception as e:
        print(f"Error ejecutando comando: {e}")

def main():
    """Función principal de demostración"""
    
    print("🚀 DEMOSTRACIÓN COMPLETA DEL CLASIFICADOR DE SERVICIOS EN LA NUBE")
    print("=" * 80)
    
    # Verificar que estamos en el directorio correcto
    if not os.path.exists("cloud_models_classifier.py"):
        print("❌ Error: No se encontró cloud_models_classifier.py")
        print("   Asegúrate de ejecutar este script desde el directorio 'Cloud Models Classifier'")
        sys.exit(1)
    
    # 1. Mostrar ayuda
    run_command(
        "python3 cloud_models_classifier.py --help",
        "Mostrar ayuda y opciones disponibles"
    )
    
    # 2. Clasificar texto directo (simple)
    run_command(
        'python3 cloud_models_classifier.py --text "Necesito servidores virtuales con almacenamiento"',
        "Clasificar texto directo (modo simple)"
    )
    
    # 3. Clasificar texto directo (verbose)
    run_command(
        'python3 cloud_models_classifier.py --text "Plataforma para desarrollo y deployment de aplicaciones" --verbose',
        "Clasificar texto directo (modo verbose)"
    )
    
    # 4. Clasificar archivo IaaS
    run_command(
        "python3 cloud_models_classifier.py --file ejemplo_iaas.txt --verbose",
        "Clasificar archivo de ejemplo IaaS (modo verbose)"
    )
    
    # 5. Clasificar archivo PaaS
    run_command(
        "python3 cloud_models_classifier.py --file ejemplo_paas.txt --verbose",
        "Clasificar archivo de ejemplo PaaS (modo verbose)"
    )
    
    # 6. Ejecutar ejemplos predefinidos
    run_command(
        "python3 cloud_models_classifier.py --examples",
        "Ejecutar ejemplos predefinidos (modo simple)"
    )
    
    # 7. Ejecutar ejemplos con análisis detallado
    run_command(
        "python3 cloud_models_classifier.py --examples --verbose",
        "Ejecutar ejemplos predefinidos (modo verbose)"
    )
    
    # 8. Mostrar versión
    run_command(
        "python3 cloud_models_classifier.py --version",
        "Mostrar versión del programa"
    )
    
    print(f"\n{'='*80}")
    print("🎉 DEMOSTRACIÓN COMPLETADA")
    print("=" * 80)
    print("\nPara probar el modo interactivo, ejecuta:")
    print("  python3 cloud_models_classifier.py --interactive")
    print("\nPara probar con tu propio texto:")
    print("  python3 cloud_models_classifier.py --text 'Tu texto aquí' --verbose")
    print("\nPara clasificar un archivo:")
    print("  python3 cloud_models_classifier.py --file tu_archivo.txt --verbose")

if __name__ == "__main__":
    main()
