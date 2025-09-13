// Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');

    // Navigation click handlers
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all nav links and sections
            navLinks.forEach(l => l.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));
            
            // Add active class to clicked nav link
            this.classList.add('active');
            
            // Show corresponding section
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.add('active');
            }
        });
    });

    // Tab functionality in modal
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Remove active class from all tabs and contents
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            this.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });

    // Close modal when clicking outside
    const modal = document.getElementById('project-modal');
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
});

// Project data
const projects = {
    'cloud-models': {
        title: 'Cloud Models Classifier',
        objectives: 'Desarrollar un clasificador de servicios en la nube que pueda determinar automáticamente si un texto corresponde a IaaS, PaaS, SaaS o FaaS usando reglas básicas y análisis de palabras clave. El objetivo principal es crear una herramienta que ayude a entender y categorizar los diferentes modelos de servicios en la nube.',
        tools: 'Python 3.x, argparse para línea de comandos, expresiones regulares (regex), programación orientada a objetos, manejo de archivos de texto, y técnicas de procesamiento de lenguaje natural básico.',
        learnings: 'Aprendí a estructurar un clasificador basado en reglas, implementar análisis de palabras clave con pesos, usar argparse para interfaces de línea de comandos, aplicar expresiones regulares para búsquedas de texto, y desarrollar un sistema modular y extensible. También comprendí mejor las diferencias entre los modelos de servicios en la nube.',
        reflection: 'DESARROLLO DEL CLASIFICADOR DE SERVICIOS EN LA NUBE\n\nEste proyecto representó mi primera inmersión en el desarrollo de herramientas de clasificación automática utilizando inteligencia artificial como punto de partida. El objetivo principal era crear un sistema que pudiera identificar automáticamente el tipo de servicio en la nube (IaaS, PaaS, SaaS o FaaS) basándose en el análisis de texto y palabras clave.\n\nPROCESO DE DESARROLLO CON IA\n\nLa experiencia de usar Cursor y prompts de IA para generar la arquitectura inicial fue reveladora. Comenzé con un prompt simple: "Genera un código en Python que reciba un texto y clasifique si corresponde a IaaS, PaaS, SaaS o FaaS usando reglas básicas." La IA generó una estructura básica que sirvió como excelente punto de partida, pero rápidamente me di cuenta de que necesitaba mejoras significativas.\n\nIMPLEMENTACIÓN DE MEJORAS\n\nCon la ayuda del asistente de IA, implementé varias mejoras cruciales:\n\n1. Validación de entrada robusta: Agregué verificaciones para asegurar que el texto de entrada sea válido y no esté vacío.\n\n2. Sistema de puntuación ponderado: Desarrollé un sistema donde cada palabra clave tiene un peso específico, permitiendo clasificaciones más precisas basadas en la relevancia de los términos.\n\n3. Funciones modulares: Separé la lógica de clasificación en funciones específicas para cada tipo de servicio, mejorando la mantenibilidad del código.\n\n4. Interfaz de línea de comandos: Integré argparse para permitir la ejecución del clasificador desde terminal, con opciones para archivos de entrada y diferentes modos de salida.\n\n5. Pruebas exhaustivas: Desarrollé más de 5 casos de prueba que cubrían diferentes escenarios y complejidades de texto.\n\nANÁLISIS TÉCNICO\n\nEl clasificador utiliza un enfoque híbrido que combina:\n\n- Análisis de palabras clave: Cada tipo de servicio tiene un conjunto específico de términos relacionados con diferentes pesos.\n- Expresiones regulares: Para detectar patrones específicos y variaciones de términos técnicos.\n- Puntuación acumulativa: El sistema suma los pesos de todas las palabras clave encontradas para determinar la clasificación más probable.\n\nREFLECCIÓN COMO ESTUDIANTE DE ITC\n\nComo estudiante de Ingeniería en Tecnologías Computacionales, esta experiencia me permitió comprender varios aspectos fundamentales del desarrollo de software moderno:\n\nColaboración Humano-IA: La IA no reemplaza al desarrollador, sino que actúa como un colaborador inteligente. Mi rol fue guiar, refinar y mejorar lo que la IA generó inicialmente. Esto me enseñó que el futuro del desarrollo de software será una colaboración estrecha entre humanos y máquinas.\n\nImportancia del Diseño de Sistemas: Aunque la IA generó código funcional, tuve que aplicar principios de ingeniería de software para mejorarlo: modularidad, validación, manejo de errores y usabilidad.\n\nProcesamiento de Lenguaje Natural Básico: Este proyecto me introdujo a conceptos fundamentales de PLN, como análisis de palabras clave, ponderación de términos y clasificación basada en reglas.\n\nArquitectura de Software: Aprendí a diseñar sistemas que sean tanto funcionales como mantenibles, con una clara separación de responsabilidades.\n\nCONCLUSIONES Y APRENDIZAJES\n\nEste proyecto me demostró que la IA es una herramienta poderosa para acelerar el desarrollo, pero requiere supervisión y refinamiento humano para alcanzar su máximo potencial. La experiencia de iterar sobre el código generado por IA me enseñó la importancia del pensamiento crítico en el desarrollo de software.\n\nComo futuro ingeniero en tecnologías computacionales, esta experiencia me preparó para un mundo donde la colaboración con IA será fundamental. Aprendí que las habilidades más valiosas no serán solo la capacidad de programar, sino la habilidad de dirigir, refinar y aplicar criterio técnico a las soluciones generadas por sistemas inteligentes.\n\nEl proyecto también me ayudó a entender mejor los diferentes modelos de servicios en la nube, no solo desde una perspectiva teórica, sino desde la implementación práctica de sistemas que pueden identificar y clasificar estos servicios automáticamente. Esta comprensión profunda será invaluable en mi carrera profesional en el campo de las tecnologías computacionales.',
        images: [
            './Ejercicios Guiados/1. Cloud Models Classifier/media/1.png',
            './Ejercicios Guiados/1. Cloud Models Classifier/media/2.png',
            './Ejercicios Guiados/1. Cloud Models Classifier/media/3.png',
            './Ejercicios Guiados/1. Cloud Models Classifier/media/4.png',
            './Ejercicios Guiados/1. Cloud Models Classifier/media/5.png'
        ],
        codeFiles: [
            {
                name: 'cloud_models_classifier.py',
                content: `#!/usr/bin/env python3
"""
Clasificador de Servicios en la Nube
Clasifica texto según si corresponde a IaaS, PaaS, SaaS o FaaS usando reglas básicas
"""

import re
import argparse
import sys
import os
from typing import Dict, List, Tuple

class CloudServiceClassifier:
    """
    Clasificador que determina el tipo de servicio en la nube basado en palabras clave y patrones
    """
    
    def __init__(self):
        # Definir palabras clave para cada tipo de servicio
        self.keywords = {
            'IaaS': {
                'infraestructura': 3,
                'servidor': 3,
                'vm': 2,
                'virtual machine': 2,
                'storage': 2,
                'red': 2,
                'network': 2,
                'computo': 2,
                'cpu': 2,
                'ram': 2,
                'disco': 2,
                'hardware': 3,
                'bare metal': 3,
                'instancia': 2,
                'container': 2,
                'docker': 2,
                'kubernetes': 2,
                'load balancer': 2,
                'firewall': 2,
                'vpc': 2,
                'subnet': 2
            },
            'PaaS': {
                'plataforma': 3,
                'desarrollo': 3,
                'aplicacion': 2,
                'deployment': 2,
                'despliegue': 2,
                'runtime': 2,
                'middleware': 2,
                'database': 2,
                'base de datos': 2,
                'api': 2,
                'framework': 2,
                'build': 2,
                'compilacion': 2,
                'testing': 2,
                'pruebas': 2,
                'monitoring': 2,
                'monitoreo': 2,
                'logging': 2,
                'registro': 2,
                'cicd': 2,
                'ci/cd': 2,
                'pipeline': 2
            },
            'SaaS': {
                'software': 3,
                'aplicacion': 3,
                'usuario final': 3,
                'end user': 3,
                'web': 2,
                'mobile': 2,
                'movil': 2,
                'crm': 2,
                'erp': 2,
                'office': 2,
                'productividad': 2,
                'colaboracion': 2,
                'comunicacion': 2,
                'email': 2,
                'correo': 2,
                'chat': 2,
                'video conferencia': 2,
                'almacenamiento': 2,
                'backup': 2,
                'respaldo': 2,
                'analytics': 2,
                'reportes': 2
            },
            'FaaS': {
                'function': 3,
                'funcion': 3,
                'serverless': 3,
                'sin servidor': 3,
                'evento': 2,
                'event': 2,
                'trigger': 2,
                'disparador': 2,
                'lambda': 2,
                'azure functions': 2,
                'google cloud functions': 2,
                'microservicio': 2,
                'microservice': 2,
                'stateless': 2,
                'sin estado': 2,
                'ephemeral': 2,
                'efimero': 2,
                'cold start': 2,
                'arranque frio': 2,
                'timeout': 2,
                'tiempo limite': 2
            }
        }
    
    def classify_text(self, text: str) -> Tuple[str, float, Dict[str, float]]:
        """
        Clasifica el texto de entrada y retorna el tipo de servicio más probable
        
        Args:
            text (str): Texto a clasificar
            
        Returns:
            Tuple[str, float, Dict[str, float]]: (tipo_servicio, confianza, scores_todos)
        """
        if not text or not text.strip():
            return "No clasificable", 0.0, {}
        
        # Normalizar texto
        text_lower = text.lower()
        
        # Calcular scores para cada tipo de servicio
        scores = {}
        for service_type, keywords in self.keywords.items():
            score = 0
            for keyword, weight in keywords.items():
                # Buscar coincidencias exactas y parciales
                if keyword in text_lower:
                    score += weight
                # Buscar coincidencias con regex para palabras completas
                pattern = r'\\b' + re.escape(keyword) + r'\\b'
                if re.search(pattern, text_lower):
                    score += weight * 0.5  # Bonus por coincidencia exacta de palabra
            
            scores[service_type] = score
        
        # Encontrar el tipo con mayor score
        if not scores or max(scores.values()) == 0:
            return "No clasificable", 0.0, scores
        
        best_type = max(scores, key=scores.get)
        best_score = scores[best_type]
        
        # Calcular confianza (normalizada)
        total_possible = sum(max(weights.values()) for weights in self.keywords.values())
        confidence = min(best_score / total_possible, 1.0)
        
        return best_type, confidence, scores
    
    def get_detailed_analysis(self, text: str) -> Dict:
        """
        Obtiene un análisis detallado de la clasificación
        
        Args:
            text (str): Texto a analizar
            
        Returns:
            Dict: Análisis detallado con clasificación y explicación
        """
        service_type, confidence, scores = self.classify_text(text)
        
        # Encontrar palabras clave encontradas
        found_keywords = {}
        text_lower = text.lower()
        
        for service_type_name, keywords in self.keywords.items():
            found_keywords[service_type_name] = []
            for keyword, weight in keywords.items():
                if keyword in text_lower:
                    found_keywords[service_type_name].append((keyword, weight))
        
        # Generar explicación
        explanation = self._generate_explanation(service_type, found_keywords, confidence)
        
        return {
            'texto_original': text,
            'tipo_servicio': service_type,
            'confianza': confidence,
            'scores_completos': scores,
            'palabras_clave_encontradas': found_keywords,
            'explicacion': explanation
        }
    
    def _generate_explanation(self, service_type: str, found_keywords: Dict, confidence: float) -> str:
        """Genera una explicación de la clasificación"""
        if service_type == "No clasificable":
            return "No se encontraron palabras clave suficientes para clasificar el texto."
        
        keywords_found = found_keywords.get(service_type, [])
        if not keywords_found:
            return f"Clasificado como {service_type} basado en el análisis general del texto."
        
        # Ordenar palabras clave por peso
        keywords_found.sort(key=lambda x: x[1], reverse=True)
        
        top_keywords = [kw[0] for kw in keywords_found[:3]]  # Top 3 palabras clave
        
        explanation = f"El texto fue clasificado como {service_type} "
        explanation += f"con una confianza del {confidence:.1%}. "
        explanation += f"Se encontraron las siguientes palabras clave relevantes: {', '.join(top_keywords)}."
        
        return explanation

def print_classification_result(text: str, classifier: CloudServiceClassifier, verbose: bool = False):
    """Imprime el resultado de la clasificación con formato"""
    print(f"\\n{'='*60}")
    print(f"TEXTO: {text}")
    print(f"{'='*60}")
    
    if verbose:
        # Análisis detallado
        analysis = classifier.get_detailed_analysis(text)
        print(f"TIPO DE SERVICIO: {analysis['tipo_servicio']}")
        print(f"CONFIANZA: {analysis['confianza']:.1%}")
        print(f"EXPLICACIÓN: {analysis['explicacion']}")
        
        print(f"\\nSCORES POR TIPO:")
        for service, score in analysis['scores_completos'].items():
            print(f"  {service}: {score}")
        
        print(f"\\nPALABRAS CLAVE ENCONTRADAS:")
        for service, keywords in analysis['palabras_clave_encontradas'].items():
            if keywords:
                print(f"  {service}: {', '.join([kw[0] for kw in keywords])}")
    else:
        # Clasificación simple
        service_type, confidence, scores = classifier.classify_text(text)
        print(f"TIPO DE SERVICIO: {service_type}")
        print(f"CONFIANZA: {confidence:.1%}")

def run_examples(classifier: CloudServiceClassifier, verbose: bool = False):
    """Ejecuta ejemplos predefinidos"""
    examples = [
        "Necesito servidores virtuales con almacenamiento y capacidad de red para ejecutar aplicaciones",
        "Quiero una plataforma para desarrollar y desplegar aplicaciones web con base de datos",
        "Busco un software CRM para gestionar clientes y ventas de la empresa",
        "Necesito funciones serverless que se ejecuten cuando lleguen eventos de la base de datos",
        "Solo quiero usar aplicaciones web sin preocuparme por la infraestructura subyacente"
    ]
    
    print("=== EJEMPLOS PREDEFINIDOS ===\\n")
    
    for i, example in enumerate(examples, 1):
        print(f"Ejemplo {i}:")
        print_classification_result(example, classifier, verbose)
        print()

def run_interactive(classifier: CloudServiceClassifier, verbose: bool = False):
    """Ejecuta el modo interactivo"""
    print("\\n=== MODO INTERACTIVO ===")
    print("Escribe 'salir' para terminar")
    print("Escribe 'ejemplos' para ver ejemplos predefinidos")
    
    while True:
        try:
            user_input = input("\\nIngresa un texto para clasificar: ").strip()
            
            if user_input.lower() in ['salir', 'exit', 'quit']:
                break
            
            if user_input.lower() == 'ejemplos':
                run_examples(classifier, verbose)
                continue
            
            if not user_input:
                print("Por favor ingresa algún texto.")
                continue
            
            # Clasificar entrada del usuario
            print_classification_result(user_input, classifier, verbose)
            
        except KeyboardInterrupt:
            print("\\n\\nSaliendo del modo interactivo...")
            break
        except EOFError:
            print("\\n\\nSaliendo del modo interactivo...")
            break

def read_file_content(file_path: str) -> str:
    """Lee el contenido de un archivo de texto"""
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            return file.read().strip()
    except FileNotFoundError:
        print(f"Error: El archivo '{file_path}' no fue encontrado.")
        sys.exit(1)
    except PermissionError:
        print(f"Error: No tienes permisos para leer el archivo '{file_path}'.")
        sys.exit(1)
    except Exception as e:
        print(f"Error al leer el archivo '{file_path}': {e}")
        sys.exit(1)

def main():
    """Función principal con soporte para argumentos de línea de comandos"""
    
    # Configurar argumentos de línea de comandos
    parser = argparse.ArgumentParser(
        description='Clasificador de Servicios en la Nube (IaaS, PaaS, SaaS, FaaS)',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Ejemplos de uso:
  %(prog)s --text "Necesito servidores virtuales"
  %(prog)s --file input.txt
  %(prog)s --interactive --verbose
  %(prog)s --examples
  %(prog)s --text "Plataforma de desarrollo" --verbose
        """
    )
    
    # Grupo de opciones de entrada
    input_group = parser.add_mutually_exclusive_group()
    input_group.add_argument(
        '-t', '--text',
        type=str,
        help='Texto a clasificar'
    )
    input_group.add_argument(
        '-f', '--file',
        type=str,
        help='Archivo de texto a clasificar'
    )
    input_group.add_argument(
        '-i', '--interactive',
        action='store_true',
        help='Modo interactivo'
    )
    input_group.add_argument(
        '-e', '--examples',
        action='store_true',
        help='Ejecutar ejemplos predefinidos'
    )
    
    # Opciones adicionales
    parser.add_argument(
        '-v', '--verbose',
        action='store_true',
        help='Mostrar análisis detallado'
    )
    parser.add_argument(
        '--version',
        action='version',
        version='%(prog)s 1.0'
    )
    
    # Parsear argumentos
    args = parser.parse_args()
    
    # Si no se proporcionaron argumentos, mostrar ayuda
    if len(sys.argv) == 1:
        parser.print_help()
        return
    
    # Crear instancia del clasificador
    classifier = CloudServiceClassifier()
    
    try:
        if args.text:
            # Clasificar texto proporcionado
            print_classification_result(args.text, classifier, args.verbose)
            
        elif args.file:
            # Clasificar contenido de archivo
            file_content = read_file_content(args.file)
            print_classification_result(file_content, classifier, args.verbose)
            
        elif args.interactive:
            # Modo interactivo
            run_interactive(classifier, args.verbose)
            
        elif args.examples:
            # Ejecutar ejemplos
            run_examples(classifier, args.verbose)
            
        else:
            # Modo por defecto (interactivo)
            run_interactive(classifier, args.verbose)
            
    except KeyboardInterrupt:
        print("\\n\\nOperación cancelada por el usuario.")
        sys.exit(0)
    except Exception as e:
        print(f"\\nError inesperado: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()`
            },
            {
                name: 'demo.py',
                content: `#!/usr/bin/env python3
"""
Script de demostración del Clasificador de Servicios en la Nube
Muestra todas las funcionalidades disponibles
"""

import subprocess
import sys
import os

def run_command(command, description):
    """Ejecuta un comando y muestra su descripción"""
    print(f"\\n{'='*80}")
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
    
    print(f"\\n{'='*80}")
    print("🎉 DEMOSTRACIÓN COMPLETADA")
    print("=" * 80)
    print("\\nPara probar el modo interactivo, ejecuta:")
    print("  python3 cloud_models_classifier.py --interactive")
    print("\\nPara probar con tu propio texto:")
    print("  python3 cloud_models_classifier.py --text 'Tu texto aquí' --verbose")
    print("\\nPara clasificar un archivo:")
    print("  python3 cloud_models_classifier.py --file tu_archivo.txt --verbose")

if __name__ == "__main__":
    main()`
            }
        ]
    },
    'chatbot': {
        title: 'Chatbot con Ollama',
        objectives: 'Desarrollar una aplicación web interactiva que permita conversar con modelos de lenguaje local usando Ollama como servidor de IA. El objetivo principal es comprender cómo integrar modelos de IA locales en aplicaciones web mediante APIs REST, explorando diferentes arquitecturas de API como REST, GraphQL, SOAP y gRPC para futuras implementaciones.',
        tools: 'Flask (Python), Ollama (servidor de modelos de IA local), HTML/CSS/JavaScript para el frontend, Docker y Docker Compose para containerización, API REST para comunicación entre frontend y backend, requests library para peticiones HTTP, y modelos de lenguaje como DeepSeek, Llama y Phi3.',
        learnings: 'Aprendí a integrar modelos de IA local en aplicaciones web, implementar APIs REST con Flask, usar Docker para containerizar servicios, manejar peticiones HTTP asíncronas en el frontend, trabajar con diferentes modelos de lenguaje local, y entender las ventajas de usar IA local vs servicios en la nube. También comprendí los conceptos de microservicios y diferentes tipos de APIs.',
        reflection: 'La aplicación desarrollada tiene como base Flask, un framework ligero de Python que facilita la construcción de aplicaciones web de manera rápida y organizada. A través de Flask se implementó la lógica que permite manejar rutas, procesar solicitudes y devolver respuestas en formato JSON, lo cual la convierte en una interfaz clara entre el usuario y los modelos de inteligencia artificial que corren en segundo plano.\n\nEl proyecto se conecta con Ollama, un servidor local que funciona como puente para interactuar con distintos modelos de lenguaje, entre ellos Llama y DeepSeek. Gracias a esta integración, la aplicación puede ofrecer un entorno en el que el usuario escribe un mensaje y recibe una respuesta generada por IA, sin necesidad de depender de servicios externos en la nube. En este sentido, se aprovechan lenguajes y modelos locales, lo que mejora tanto la privacidad como el control del despliegue.\n\nLa comunicación se logra mediante endpoints de la API de Ollama (/chat, /generate, /tags), que permiten enviar prompts, mantener conversaciones o consultar los modelos disponibles. La aplicación Flask actúa como capa intermedia, gestionando errores, formateando respuestas y ofreciendo una estructura sencilla para que el frontend se conecte de manera intuitiva.\n\nEn resumen, se trata de un proyecto que demuestra cómo unir Flask, Ollama y modelos de IA locales como DeepSeek o Llama, para crear una plataforma conversacional práctica, escalable y controlada directamente desde el entorno del usuario.',
        images: [
            './Ejercicios Guiados/2. Chatbot/media/hola.png'
        ],
        codeFiles: [
            {
                name: 'app.py',
                content: `from flask import Flask, render_template, request, jsonify, abort
import requests

# Inicialización de la aplicación Flask
flask_app = Flask(__name__)

# Configuración base para Ollama
OLLAMA_BASE_URL = "http://localhost:11434/api"
DEFAULT_MODEL = "deepseek-coder"


@flask_app.route("/")
def home():
    """Renderiza la página principal"""
    return render_template("index.html")


@flask_app.route("/models", methods=["GET"])
def list_models():
    """
    Devuelve los modelos disponibles desde Ollama
    """
    try:
        resp = requests.get(f"{OLLAMA_BASE_URL}/tags", timeout=30)
        if resp.status_code != 200:
            abort(502, description="No se pudieron obtener los modelos de Ollama")
        models_info = resp.json().get("models", [])
        model_names = [m.get("name") for m in models_info]
        return jsonify({"models": model_names})
    except requests.exceptions.ConnectionError:
        abort(503, description="No hay conexión con Ollama")
    except Exception as err:
        abort(500, description=f"Error inesperado: {err}")


@flask_app.route("/generate", methods=["POST"])
def generate_text():
    """
    Usa el endpoint /generate de Ollama para obtener texto a partir de un prompt
    """
    payload = request.get_json(force=True)
    prompt = payload.get("prompt")
    model = payload.get("model", DEFAULT_MODEL)

    if not prompt:
        abort(400, description="El campo 'prompt' está vacío")

    request_data = {
        "model": model,
        "prompt": prompt,
        "stream": False
    }

    try:
        resp = requests.post(
            f"{OLLAMA_BASE_URL}/generate",
            json=request_data,
            headers={"Content-Type": "application/json"},
            timeout=60
        )
        if resp.status_code == 200:
            result = resp.json().get("response", "")
            return jsonify({"response": result, "model": model})
        else:
            abort(resp.status_code, description=f"Error en Ollama: {resp.text}")
    except requests.exceptions.ConnectionError:
        abort(503, description="No se puede conectar a Ollama")
    except Exception as err:
        abort(500, description=f"Fallo interno: {err}")


@flask_app.route("/chat", methods=["POST"])
def chat_with_model():
    """
    Usa el endpoint /chat de Ollama para mantener un estilo conversacional
    """
    payload = request.get_json(force=True)
    message = payload.get("message")
    model = payload.get("model", DEFAULT_MODEL)

    if not message:
        abort(400, description="El campo 'message' está vacío")

    chat_body = {
        "model": model,
        "messages": [{"role": "user", "content": message}],
        "stream": False
    }

    try:
        resp = requests.post(
            f"{OLLAMA_BASE_URL}/chat",
            json=chat_body,
            headers={"Content-Type": "application/json"},
            timeout=60
        )
        if resp.status_code == 200:
            reply = resp.json().get("message", {}).get("content", "")
            return jsonify({"response": reply, "model": model})
        else:
            abort(resp.status_code, description=f"Error en Ollama: {resp.text}")
    except requests.exceptions.Timeout:
        abort(408, description="Timeout: Ollama no respondió a tiempo")
    except Exception as err:
        abort(500, description=f"Error inesperado: {err}")


if __name__ == "__main__":
    flask_app.run(host="0.0.0.0", port=5000, debug=True)`
            },
            {
                name: 'index.html',
                content: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Terminal Chat - Ollama</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: "Courier New", monospace;
      background: #0d0d0d;
      color: #00ff00;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 10px;
    }

    .console {
      background: #111;
      border: 2px solid #00ff00;
      border-radius: 6px;
      width: 100%;
      max-width: 900px;
      height: 90vh;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      box-shadow: 0 0 20px rgba(0,255,0,0.4);
    }

    .header {
      background: #000;
      color: #0f0;
      padding: 10px 15px;
      border-bottom: 2px solid #00ff00;
      font-weight: bold;
      letter-spacing: 1px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .header span {
      font-size: 0.9rem;
      color: #ff00ff;
    }

    .chat-window {
      flex: 1;
      overflow-y: auto;
      padding: 15px;
      background: #0d0d0d;
      font-size: 0.95rem;
      line-height: 1.4;
    }

    .message {
      margin-bottom: 15px;
    }

    .message.user {
      color: #00ffff;
    }

    .message.assistant {
      color: #0f0;
    }

    .status {
      padding: 5px 10px;
      font-size: 0.8rem;
      border-radius: 3px;
    }

    .status.connected {
      background: #003300;
      color: #0f0;
    }

    .status.disconnected {
      background: #330000;
      color: #f33;
    }

    .controls {
      border-top: 2px solid #00ff00;
      padding: 10px;
      background: #111;
      display: flex;
      gap: 8px;
      align-items: center;
    }

    select, textarea, button {
      font-family: "Courier New", monospace;
      background: #000;
      color: #0f0;
      border: 2px solid #0f0;
      border-radius: 4px;
    }

    select, textarea {
      padding: 8px;
    }

    textarea {
      flex: 1;
      resize: none;
      height: 50px;
    }

    button {
      padding: 10px 15px;
      cursor: pointer;
      font-weight: bold;
      transition: all 0.2s ease;
    }

    button:hover {
      background: #0f0;
      color: #000;
    }

    .typing-indicator {
      font-size: 0.8rem;
      color: #ff0;
      margin-bottom: 10px;
    }

    @media (max-width: 768px) {
      .console {
        height: 95vh;
      }
      .controls {
        flex-direction: column;
        align-items: stretch;
      }
      textarea {
        width: 100%;
      }
    }
  </style>
</head>
<body>
  <div class="console">
    <div class="header">
      <div>💻 Ollama Chat Terminal</div>
      <span id="status">Verificando conexión...</span>
    </div>

    <div class="chat-window" id="chat-window">
      <div class="message assistant">[AI] Hola, soy tu asistente local. Escribe un mensaje para comenzar.</div>
    </div>

    <div class="typing-indicator" id="typing-indicator" style="display:none;">
      [AI está escribiendo...]
    </div>

    <div class="controls">
      <select id="model-select">
        <option value="deepseek-coder">deepseek-coder</option>
        <option value="llama3">llama3</option>
        <option value="phi3">phi3</option>
      </select>
      <textarea id="message-input" placeholder="Escribe tu mensaje..."></textarea>
      <button id="send-button">Enviar</button>
    </div>
  </div>

  <script>
    const chatWindow = document.getElementById("chat-window");
    const messageInput = document.getElementById("message-input");
    const sendButton = document.getElementById("send-button");
    const modelSelect = document.getElementById("model-select");
    const statusElement = document.getElementById("status");
    const typingIndicator = document.getElementById("typing-indicator");

    function addMessage(content, isUser=false) {
      const msg = document.createElement("div");
      msg.className = "message " + (isUser ? "user" : "assistant");
      msg.textContent = (isUser ? "[Tú] " : "[AI] ") + content;
      chatWindow.appendChild(msg);
      chatWindow.scrollTop = chatWindow.scrollHeight;
    }

    async function checkConnection() {
      try {
        const res = await fetch("/models");
        if (res.ok) {
          statusElement.textContent = "Conectado";
          statusElement.className = "status connected";
        } else {
          throw new Error("API Error");
        }
      } catch {
        statusElement.textContent = "Desconectado";
        statusElement.className = "status disconnected";
      }
    }

    sendButton.addEventListener("click", async () => {
      const text = messageInput.value.trim();
      if (!text) return;

      addMessage(text, true);
      messageInput.value = "";

      typingIndicator.style.display = "block";

      try {
        const response = await fetch("/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: text,
            model: modelSelect.value
          })
        });
        const data = await response.json();
        if (response.ok) {
          addMessage(data.response);
        } else {
          addMessage("Error: " + data.error);
        }
      } catch {
        addMessage("Error: no se pudo conectar al servidor.");
      } finally {
        typingIndicator.style.display = "none";
      }
    });

    checkConnection();
    setInterval(checkConnection, 30000);
  </script>
</body>
</html>`
            },
            {
                name: 'docker_compose.yml',
                content: `version: "3.9"

services:
  flask-app:
    build: .
    container_name: flask_service
    ports:
      - "5000:5000"
    environment:
      FLASK_ENV: development
    depends_on:
      - ollama
    restart: always   

  ollama:
    image: ollama/ollama:latest
    container_name: ollama_service
    ports:
      - "11434:11434"
    volumes:
      - ollama_storage:/root/.ollama
    restart: always   

volumes:
  ollama_storage:`
            }
        ]
    },
    'xml-exercise': {
        title: 'Catálogo de Libros XML',
        objectives: 'Crear un sistema de gestión de biblioteca digital utilizando XML como base de datos estructurada, XSL para transformaciones de datos y CSS para estilización. El objetivo es demostrar cómo XML puede funcionar como una base de datos ligera y cómo las transformaciones XSL permiten presentar los datos de manera dinámica y funcional.',
        tools: 'XML (Extensible Markup Language) para estructuración de datos, XSL (Extensible Stylesheet Language) para transformaciones, CSS para estilización visual, HTML para la interfaz de usuario, JavaScript para funcionalidad interactiva, y Python HTTP Server para servir los archivos localmente.',
        learnings: 'Aprendí a estructurar datos jerárquicamente con XML, crear transformaciones XSL para convertir XML a HTML, aplicar estilos CSS a elementos XML, implementar búsquedas dinámicas con JavaScript, y entender cómo XML puede funcionar como una base de datos ligera. También comprendí la importancia de la separación entre datos (XML), transformación (XSL) y presentación (CSS).',
        reflection: 'Introducción\n\nEn la actualidad, la gestión de información digital es fundamental para organizar y acceder de manera eficiente a grandes volúmenes de datos. Una de las formas más simples pero efectivas de hacerlo es mediante el uso de XML (Extensible Markup Language), un lenguaje que permite estructurar datos de forma jerárquica y legible tanto para humanos como para máquinas. Complementando a XML, se emplea XSL (Extensible Stylesheet Language) para transformar esos datos y presentarlos en un formato comprensible para el usuario. En este proyecto, el objetivo principal es construir una biblioteca digital en la que se almacenen datos de libros (como título, autor, género, precio e ISBN), utilizando XML como base de datos y XSL para generar visualizaciones dinámicas, junto con un apoyo opcional de CSS para dar estilo.\n\nDesarrollo\n\nEl punto de partida es el archivo XML, que funciona como un contenedor estructurado de información. Cada libro se representa dentro de etiquetas <book>, con atributos como isbn y elementos hijos que definen título, autor, año, género, precio y formato. Esta estructura garantiza un almacenamiento ordenado, independiente del diseño visual, lo que permite concentrarse únicamente en los datos.\n\nPara que esta información no se quede en un simple listado de etiquetas, se utiliza XSL, cuyo propósito es transformar el contenido del XML en un formato más útil, como páginas web en HTML o tablas interactivas. A través de plantillas (<xsl:template>) y expresiones XPath, se puede filtrar, ordenar y mostrar únicamente la información deseada. Por ejemplo, se puede implementar una búsqueda que localice un libro específico a partir de su ISBN, generando automáticamente una vista con sus detalles. De esta manera, XSL funciona como el puente entre los datos crudos y la presentación final.\n\nFinalmente, para mejorar la experiencia visual, se integra CSS. Aunque no es el núcleo del proyecto, el CSS permite darle identidad a la biblioteca digital, ya sea con un estilo minimalista, clásico o incluso con temáticas más llamativas como un diseño "cyberpunk". El CSS no altera la lógica ni el contenido, pero aporta una capa estética que facilita la lectura y la interacción del usuario con la biblioteca.\n\nConclusión\n\nLa construcción de una biblioteca digital con XML y XSL demuestra cómo tecnologías relativamente simples pueden resolver problemas prácticos de organización y presentación de información. XML asegura un almacenamiento ordenado y estandarizado, mientras que XSL ofrece la flexibilidad de transformar y mostrar los datos según las necesidades del usuario, como en búsquedas por ISBN o listados temáticos. CSS, por su parte, complementa al dotar de un aspecto visual atractivo y funcional. En conjunto, estas herramientas permiten diseñar soluciones ligeras, portables y fáciles de mantener, que cumplen con el objetivo de organizar y dar acceso a información de manera eficiente.',
        images: [
            './Ejercicios Guiados/3. Ejercicio XML/media/imagencat1.png',
            './Ejercicios Guiados/3. Ejercicio XML/media/imagencat2.png'
        ],
        codeFiles: [
            {
                name: 'catalogo_libros.xml',
                content: `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="transformaciones.xsl"?>
<?xml-stylesheet type="text/css" href="catalogo_libros.css"?>
<catalog>
    <book isbn="978-0451524935">
        <title>1984</title>
        <author>Alejandro Garza</author>
        <year>1949</year>
        <genre>Distopía</genre>
        <price>12.99</price>
        <stock>45</stock>
        <format>Físico</format>
    </book>
    
    <book isbn="978-0141439518">
        <title>Orgullo y prejuicio</title>
        <author>Jane Austen</author>
        <year>1813</year>
        <genre>Romance</genre>
        <price>9.50</price>
        <stock>28</stock>
        <format>Digital</format>
    </book>
    
    <book isbn="978-8497593795">
        <title>El nombre del viento</title>
        <author>Patrick Rothfuss</author>
        <year>2007</year>
        <genre>Fantasía</genre>
        <price>18.75</price>
        <stock>15</stock>
        <format>Físico</format>
    </book>
    
    <book isbn="978-8408180408">
        <title>La sombra del viento</title>
        <author>Carlos Ruiz Zafón</author>
        <year>2001</year>
        <genre>Misterio</genre>
        <price>14.99</price>
        <stock>32</stock>
        <format>Digital</format>
    </book>
    
    <book isbn="978-8466338141">
        <title>Juego de tronos</title>
        <author>George R. R. Martin</author>
        <year>1996</year>
        <genre>Fantasía épica</genre>
        <price>22.50</price>
        <stock>8</stock>
        <format>Físico</format>
    </book>
    
    <book isbn="978-6073116498">
        <title>Cien años de soledad</title>
        <author>Gabriel García Márquez</author>
        <year>1967</year>
        <genre>Realismo mágico</genre>
        <price>16.25</price>
        <stock>20</stock>
        <format>Físico</format>
    </book>
    
    <book isbn="978-0307474278">
        <title>El código Da Vinci</title>
        <author>Dan Brown</author>
        <year>2003</year>
        <genre>Suspense</genre>
        <price>11.99</price>
        <stock>50</stock>
        <format>Digital</format>
    </book>
    
    <book isbn="978-8499088099">
        <title>Los pilares de la Tierra</title>
        <author>Ken Follett</author>
        <year>1989</year>
        <genre>Novela histórica</genre>
        <price>19.95</price>
        <stock>12</stock>
        <format>Físico</format>
    </book>
</catalog>`
            },
            {
                name: 'catalogo_libros.html',
                content: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Catálogo de Libros</title>
  <style>
    body {
      font-family: "Courier New", monospace;
      background: #000;
      color: #00ff00;
      padding: 30px;
    }

    .catalog-title {
      text-align: center;
      font-size: 2.5rem;
      margin-bottom: 20px;
      color: #00ff00;
      text-shadow: 0 0 10px #00ff00, 0 0 20px #ff00ff;
    }

    .search-bar {
      text-align: center;
      margin-bottom: 30px;
    }

    .search-bar input {
      padding: 10px;
      font-size: 1rem;
      border: 1px solid #00ff00;
      border-radius: 5px;
      width: 250px;
      background: #111;
      color: #00ff00;
    }

    .books-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
    }

    .book-card {
      background: #111;
      border: 1px solid #00ff00;
      border-radius: 8px;
      padding: 15px;
      box-shadow: 0 0 15px rgba(0,255,0,0.4);
    }

    .book-title {
      font-size: 1.4rem;
      font-weight: bold;
      color: #ffea00;
      margin-bottom: 8px;
    }

    .book-author {
      font-style: italic;
      color: #33ff33;
      margin-bottom: 10px;
    }

    .book-details {
      font-size: 0.9rem;
      margin-bottom: 12px;
    }

    .book-detail-label {
      font-weight: bold;
      color: #ff00ff;
    }

    .price {
      font-size: 1.2rem;
      font-weight: bold;
      color: #00ffcc;
    }

    .stock.low { color: #ff3333; font-weight: bold; }
    .stock.medium { color: #ffaa00; font-weight: bold; }
    .stock.high { color: #33ff66; font-weight: bold; }

    .format-badge {
      display: inline-block;
      margin-bottom: 8px;
      padding: 4px 8px;
      border-radius: 8px;
      font-size: 0.8rem;
      font-weight: bold;
      text-transform: uppercase;
      color: #fff;
    }

    .format-fisico { background: #ff00ff; }
    .format-digital { background: #00ccff; }

    .isbn {
      font-size: 0.75rem;
      margin-top: 8px;
      color: #aaa;
    }
  </style>
</head>
<body>
  <div class="catalog">
    <h1 class="catalog-title">Catálogo de Libros</h1>

    <!-- Barra de búsqueda -->
    <div class="search-bar">
      <input type="text" id="isbnInput" placeholder="Buscar por ISBN..." oninput="filterByISBN()">
    </div>

    <div class="books-grid" id="booksGrid">
      <!-- Libros se cargan desde XML -->
    </div>
  </div>

  <script>
    let allBooks = [];

    async function loadBooks() {
      try {
        const response = await fetch('catalogo_libros.xml');
        const xmlText = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
        const books = Array.from(xmlDoc.getElementsByTagName('book'));
        allBooks = books;
        renderBooks(allBooks);
      } catch (err) {
        console.error('Error al cargar XML:', err);
        document.getElementById('booksGrid').innerHTML =
          '<p style="color: #ff3333; text-align: center;">Error al cargar catálogo</p>';
      }
    }

    function renderBooks(books) {
      const booksGrid = document.getElementById('booksGrid');
      booksGrid.innerHTML = "";
      if (books.length === 0) {
        booksGrid.innerHTML = '<p style="color: #ff3333; text-align: center;">No se encontraron libros</p>';
        return;
      }
      books.forEach(book => {
        const card = createBookCard(book);
        booksGrid.appendChild(card);
      });
    }

    function createBookCard(book) {
      const card = document.createElement('div');
      card.className = 'book-card';

      const title = book.getElementsByTagName('title')[0].textContent;
      const author = book.getElementsByTagName('author')[0].textContent;
      const year = book.getElementsByTagName('year')[0].textContent;
      const genre = book.getElementsByTagName('genre')[0].textContent;
      const price = book.getElementsByTagName('price')[0].textContent;
      const stock = parseInt(book.getElementsByTagName('stock')[0].textContent);
      const format = book.getElementsByTagName('format')[0].textContent;
      const isbn = book.getAttribute('isbn');

      let stockClass = 'high';
      if (stock <= 15) stockClass = 'low';
      else if (stock <= 30) stockClass = 'medium';

      let formatClass = format === 'Físico' ? 'format-fisico' : 'format-digital';

      card.innerHTML = \`
        <div class="format-badge \${formatClass}">\${format}</div>
        <h2 class="book-title">\${title}</h2>
        <p class="book-author">\${author}</p>
        <div class="book-details">
          <span class="book-detail-label">Año:</span> \${year} <br>
          <span class="book-detail-label">Género:</span> \${genre}
        </div>
        <div class="price">€\${price}</div>
        <div class="stock \${stockClass}">Stock: \${stock}</div>
        <div class="isbn">ISBN: \${isbn}</div>
      \`;
      return card;
    }

    function filterByISBN() {
      const query = document.getElementById('isbnInput').value.trim();
      if (!query) {
        renderBooks(allBooks);
        return;
      }
      const filtered = allBooks.filter(book => {
        const isbn = book.getAttribute('isbn');
        return isbn.includes(query);
      });
      renderBooks(filtered);
    }

    document.addEventListener('DOMContentLoaded', loadBooks);
  </script>
</body>
</html>`
            },
            {
                name: 'catalogo_libros.css',
                content: `/* 📟 Estilo Retro Terminal para Biblioteca */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: "Courier New", monospace;
    background: #000;
    color: #00ff00;
    padding: 20px;
}

/* Título */
.catalog-title {
    text-align: center;
    font-size: 2rem;
    color: #00ff00;
    border-bottom: 2px dashed #00ff00;
    padding-bottom: 10px;
    margin-bottom: 30px;
    text-transform: uppercase;
    letter-spacing: 4px;
}

/* Grid en columna, no tarjetas */
.books-grid {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

/* Cada libro se ve como bloque de consola */
.book-card {
    background: #000;
    border: 1px solid #00ff00;
    padding: 15px;
    font-size: 0.95rem;
    line-height: 1.4;
    position: relative;
}

/* Animación de parpadeo en borde */
.book-card::before {
    content: "> ";
    color: #00ff00;
    position: absolute;
    left: -20px;
    top: 15px;
}

/* Título y autor */
.book-title {
    font-weight: bold;
    font-size: 1.2rem;
    color: #00ff00;
    margin-bottom: 8px;
}

.book-author {
    font-style: italic;
    color: #33ff33;
    margin-bottom: 10px;
}

/* Detalles simples en formato "clave: valor" */
.book-details {
    display: flex;
    flex-direction: column;
    gap: 3px;
    margin-bottom: 10px;
}

.book-detail-label {
    color: #00cc00;
    font-weight: bold;
}

.book-detail-value {
    color: #99ff99;
}

/* Precio y stock como texto plano */
.price {
    color: #00ffcc;
    font-weight: bold;
}

.stock {
    font-weight: bold;
}

.stock.low {
    color: #ff3333;
}

.stock.medium {
    color: #ffaa00;
}

.stock.high {
    color: #33ff33;
}

/* Insignia de formato como texto */
.format-badge {
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 0.8rem;
    color: #ff00ff;
    background: none;
    border: none;
}

/* ISBN en esquina */
.isbn {
    position: absolute;
    bottom: 5px;
    right: 10px;
    font-size: 0.7rem;
    color: #666;
}

/* Animación de escritura */
@keyframes typing {
    from { width: 0; }
    to { width: 100%; }
}

.book-title {
    overflow: hidden;
    white-space: nowrap;
    border-right: 2px solid #00ff00;
    animation: typing 2s steps(20, end) 1;
}`
            },
            {
                name: 'transformaciones.xsl',
                content: `<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:output method="html" encoding="UTF-8" indent="yes"/>

    <!-- Plantilla raíz -->
    <xsl:template match="/">
        <html lang="es">
            <head>
                <meta charset="UTF-8"/>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <title>Biblioteca - Inventario</title>
                <!-- Aquí enlazamos el CSS externo -->
                <link rel="stylesheet" href="catalogo_libros.css"/>
            </head>
            <body>
                <h1>Inventario de Libros</h1>
                <table>
                    <thead>
                        <tr>
                            <th>ISBN</th>
                            <th>Título</th>
                            <th>Autor</th>
                            <th>Género</th>
                            <th>Año</th>
                            <th>Precio</th>
                            <th>Stock</th>
                            <th>Formato</th>
                        </tr>
                    </thead>
                    <tbody>
                        <xsl:apply-templates select="catalog/book"/>
                    </tbody>
                </table>
            </body>
        </html>
    </xsl:template>

    <!-- Plantilla para cada libro -->
    <xsl:template match="book">
        <tr>
            <td><xsl:value-of select="@isbn"/></td>
            <td><xsl:value-of select="title"/></td>
            <td><xsl:value-of select="author"/></td>
            <td><xsl:value-of select="genre"/></td>
            <td><xsl:value-of select="year"/></td>
            <td>$<xsl:value-of select="price"/></td>
            <td>
                <xsl:attribute name="class">
                    <xsl:choose>
                        <xsl:when test="number(stock) &lt;= 10">low</xsl:when>
                        <xsl:when test="number(stock) &lt;= 30">medium</xsl:when>
                        <xsl:otherwise>high</xsl:otherwise>
                    </xsl:choose>
                </xsl:attribute>
                <xsl:value-of select="stock"/>
            </td>
            <td>
                <xsl:value-of select="format"/>
            </td>
        </tr>
    </xsl:template>

</xsl:stylesheet>`
            },
            {
                name: 'comando.txt',
                content: `python3 -m http.server 8080`
            }
        ]
    },
    'microservices': {
        title: 'Microservicio Flask con MariaDB',
        objectives: 'Desarrollar un microservicio completo usando Flask como framework principal, con una base de datos MariaDB normalizada y una API REST robusta. El objetivo es crear un sistema escalable que demuestre la integración entre diferentes tecnologías y la importancia de un diseño bien estructurado, incluyendo operaciones CRUD completas y respuestas en formato XML.',
        tools: 'Flask (Python) como framework principal, MariaDB como base de datos relacional, MySQLdb para conexiones de base de datos, XML.etree.ElementTree para generación de respuestas XML, Google Cloud Platform (GCP) para despliegue, CORS para manejo de peticiones cross-origin, y HTML/CSS/JavaScript para la interfaz web.',
        learnings: 'Aprendí a diseñar arquitecturas de microservicios escalables, implementar bases de datos normalizadas con múltiples tablas y relaciones, crear APIs REST completas con 7 endpoints CRUD, generar respuestas XML estructuradas, manejar conexiones de base de datos de forma segura, implementar manejo robusto de errores, y desplegar aplicaciones en la nube con GCP.',
        reflection: 'MICROSERVICIO FLASK CON MARIADB - DESARROLLO DE API REST\n\nEste proyecto representa un paso significativo en mi aprendizaje de arquitecturas de microservicios y desarrollo de APIs REST. A través de Google Cloud Platform (GCP), logré crear un microservicio completo que demuestra la integración entre diferentes tecnologías y la importancia de un diseño bien estructurado.\n\nDESARROLLO DEL MICROSERVICIO\n\nEl microservicio fue desarrollado usando Flask como framework principal, aprovechando su simplicidad y flexibilidad para crear una API REST robusta. Implementé siete endpoints específicos que cubren todas las operaciones CRUD necesarias para la gestión de un catálogo de libros:\n\n- GET /api/books: Obtiene todos los libros disponibles\n- GET /api/books/{isbn}: Busca un libro específico por su ISBN\n- GET /api/books/format: Filtra libros por formato (físico o digital)\n- GET /api/books/author: Busca libros por autor\n- POST /api/books/create: Crea nuevos libros en el catálogo\n- PUT /api/books/update: Actualiza información de libros existentes\n- DELETE /api/books/delete: Elimina libros del sistema\n\nINTEGRACIÓN CON BASE DE DATOS\n\nUna de las partes más desafiantes fue diseñar y conectar la base de datos MariaDB. Decidí implementar una estructura normalizada con múltiples tablas para optimizar el almacenamiento y evitar redundancia:\n\n- Tabla \'autores\': Almacena información de los escritores\n- Tabla \'géneros\': Catálogo de géneros literarios disponibles\n- Tabla \'formatos\': Tipos de formato (Libro de bolsillo, De tapa dura)\n- Tabla \'libros\': Información principal de cada libro\n- Tabla \'book_authors\': Relación muchos a muchos entre libros y autores\n- Vista \'catálogo_de_libros\': Combina toda la información para consultas eficientes\n\nEsta normalización me permitió entender mejor cómo las bases de datos relacionales manejan las relaciones complejas y cómo optimizar las consultas para obtener mejor rendimiento.\n\nIMPLEMENTACIÓN DE XML\n\nUn aspecto técnico interesante fue la implementación de respuestas en formato XML. Aunque JSON es más común en APIs modernas, trabajar con XML me ayudó a entender la importancia de la interoperabilidad y cómo diferentes sistemas pueden comunicarse usando estándares establecidos. Utilicé xml.etree.ElementTree para generar respuestas estructuradas que siguen el formato del archivo catalogo_libros.xml existente.\n\nCONEXIÓN CON INTERFAZ\n\nEl microservicio fue diseñado para ser consumido por interfaces web, lo que me permitió experimentar con la separación de responsabilidades entre backend y frontend. Aunque en este caso me enfoqué principalmente en el desarrollo del microservicio, la arquitectura permite que cualquier aplicación cliente consuma la API sin conocer los detalles internos de implementación.\n\nAPRENDIZAJES CLAVE\n\n1. Arquitectura de Microservicios: Comprendí cómo los microservicios permiten escalabilidad y mantenimiento independiente de componentes.\n\n2. Normalización de Bases de Datos: Aprendí a diseñar esquemas de base de datos eficientes que evitan redundancia y mejoran la integridad de los datos.\n\n3. APIs REST: Dominé los principios de diseño de APIs RESTful, incluyendo el uso correcto de métodos HTTP y códigos de estado.\n\n4. Manejo de Errores: Implementé un sistema robusto de manejo de errores que proporciona respuestas consistentes y útiles.\n\n5. Documentación: Creé documentación completa que facilita el mantenimiento y la comprensión del código.\n\n6. Integración de Tecnologías: Experiencia práctica en conectar Flask, MariaDB, XML y sistemas de despliegue en la nube.\n\nCONCLUSIONES\n\nEste proyecto me demostró la importancia de pensar en sistemas completos, no solo en código individual. La integración entre Flask, MariaDB, XML y GCP me enseñó cómo las tecnologías modernas se complementan para crear soluciones robustas y escalables.\n\nLa experiencia de trabajar con una base de datos normalizada me hizo apreciar la importancia del diseño de datos desde el inicio del proyecto. Cada decisión de diseño tiene implicaciones en el rendimiento, mantenibilidad y escalabilidad del sistema.\n\nEl uso de XML, aunque menos común que JSON, me ayudó a entender la flexibilidad de los microservicios para adaptarse a diferentes necesidades de interoperabilidad. Esto es especialmente valioso en entornos empresariales donde diferentes sistemas pueden requerir diferentes formatos de datos.\n\nFinalmente, este proyecto reforzó mi comprensión de que el desarrollo de software moderno no es solo escribir código, sino diseñar sistemas que sean mantenibles, escalables y fáciles de entender. La documentación, las pruebas y la arquitectura son tan importantes como el código mismo.\n\nLa experiencia con GCP me abrió los ojos a las posibilidades de la computación en la nube y cómo puede simplificar el despliegue y mantenimiento de aplicaciones complejas. Estoy emocionado de continuar explorando estas tecnologías y aplicarlas en proyectos más ambiciosos.',
        images: [
            './Ejercicios Guiados/4. Microservicios/media/2.png',
            './Ejercicios Guiados/4. Microservicios/media/3.png',
            './Ejercicios Guiados/4. Microservicios/media/4.png',
            './Ejercicios Guiados/4. Microservicios/media/5.png',
            './Ejercicios Guiados/4. Microservicios/media/6.png'
        ],
        codeFiles: [
            {
                name: 'app.py',
                content: `from flask import Flask, request, jsonify
import MySQLdb
import xml.etree.ElementTree as ET
from xml.dom import minidom

app = Flask(__name__)

# Database configuration
DB_CONFIG = {
    'host': 'localhost',
    'user': 'Libros_user',
    'passwd': '666',
    'db': 'librería',
    'charset': 'utf8'
}

def get_db_connection():
    """Create database connection"""
    try:
        connection = MySQLdb.connect(**DB_CONFIG)
        return connection
    except MySQLdb.Error as e:
        print(f"Error connecting to database: {e}")
        return None

def create_xml_response(data, root_name="catalog"):
    """Create XML response from data"""
    root = ET.Element(root_name)
    
    if isinstance(data, list):
        for item in data:
            book = ET.SubElement(root, "book")
            book.set("isbn", str(item.get('isbn', '')))
            
            # Add all book fields
            for field in ['título', 'autores', 'año', 'género', 'precio', 'stock', 'formato']:
                element = ET.SubElement(book, field)
                element.text = str(item.get(field, ''))
    elif isinstance(data, dict):
        book = ET.SubElement(root, "book")
        book.set("isbn", str(data.get('isbn', '')))
        
        for field in ['título', 'autores', 'año', 'género', 'precio', 'stock', 'formato']:
            element = ET.SubElement(book, field)
            element.text = str(data.get(field, ''))
    
    # Format XML nicely
    rough_string = ET.tostring(root, encoding='unicode')
    reparsed = minidom.parseString(rough_string)
    return reparsed.toprettyxml(indent="    ")

@app.route('/api/books', methods=['GET'])
def get_all_books():
    """Display all existing books in XML"""
    connection = get_db_connection()
    if not connection:
        return create_xml_response([]), 500, {'Content-Type': 'application/xml'}
    
    try:
        cursor = connection.cursor(MySQLdb.cursors.DictCursor)
        cursor.execute("SELECT * FROM catálogo_de_libros")
        books = cursor.fetchall()
        
        xml_response = create_xml_response(books)
        return xml_response, 200, {'Content-Type': 'application/xml'}
    
    except MySQLdb.Error as e:
        print(f"Database error: {e}")
        return create_xml_response([]), 500, {'Content-Type': 'application/xml'}
    finally:
        connection.close()

# [Resto de endpoints CRUD - GET, POST, PUT, DELETE]
# Código completo disponible en el archivo original

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)`
            },
            {
                name: 'requirements.txt',
                content: `Flask==2.3.3
MySQLdb==2.0.3`
            },
            {
                name: 'database_setup.sql',
                content: `-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS librería CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE librería;

-- Tabla de autores
CREATE TABLE autores (
autor_id INT AUTO_INCREMENT PRIMARY KEY,
nombre VARCHAR(100) NOT NULL UNIQUE
);

-- Tabla de géneros
CREATE TABLE géneros (
genre_id INT AUTO_INCREMENT PRIMARY KEY,
nombre VARCHAR(50) NOT NULL UNIQUE
);

-- Tabla de formatos
CREATE TABLE formatos (
format_id INT AUTO_INCREMENT PRIMARY KEY,
nombre VARCHAR(20) NOT NULL UNIQUE
);

-- Tabla principal de libros
CREATE TABLE libros (
isbn VARCHAR(17) PRIMARY KEY,
título VARCHAR(255) NOT NULL,
año INT NOT NULL,
precio DECIMAL(10, 2) NOT NULL,
stock INT NOT NULL DEFAULT 0,
genre_id INT NOT NULL,
format_id INT NOT NULL,
FOREIGN KEY (genre_id) REFERENCES géneros(genre_id),
FOREIGN KEY (format_id) REFERENCES formatos(format_id)
);

-- Tabla de relación entre libros y autores (muchos a muchos)
CREATE TABLE book_authors (
libro_isbn VARCHAR(17),
autor_id INT,
PRIMARY KEY (libro_isbn, autor_id),
FOREIGN KEY (libro_isbn) REFERENCES libros(isbn) ON DELETE CASCADE,
FOREIGN KEY (autor_id) REFERENCES autores(autor_id) ON DELETE CASCADE
);

-- [Datos de ejemplo y vista catálogo_de_libros]
-- Código completo disponible en el archivo original`
            },
            {
                name: 'templates/index.html',
                content: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Catálogo de Libros</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; background: #f9f9f9; }
    h1 { color: #333; }
    .section { margin-bottom: 20px; padding: 15px; border: 1px solid #ccc; background: #fff; border-radius: 8px; }
    label { display: block; margin-top: 5px; }
    input { margin-bottom: 10px; padding: 5px; width: 300px; }
    button { margin: 5px; padding: 8px; cursor: pointer; }
    .result { margin-top: 10px; background: #eef; padding: 10px; border-radius: 5px; }
    ul { list-style: none; padding-left: 0; }
    li { margin-bottom: 8px; padding: 6px; background: #fdfdfd; border: 1px solid #ddd; border-radius: 5px; }
    strong { color: #2c3e50; }
  </style>
</head>
<body>
  <h1>📚 Catálogo de Libros</h1>

  <!-- Secciones para cada endpoint de la API -->
  <div class="section">
    <h2>Mostrar todos los libros</h2>
    <button onclick="getAllBooks()">Mostrar</button>
    <div id="resultAll" class="result"></div>
  </div>

  <!-- [Resto de secciones para búsqueda, creación, actualización y eliminación] -->
  <!-- Código completo disponible en el archivo original -->

  <script>
    // Funciones JavaScript para interactuar con la API REST
    // Código completo disponible en el archivo original
  </script>
</body>
</html>`
            }
        ]
    },
    'tarea-1': {
        title: 'Mapa Conceptual Comparativo',
        objectives: '',
        tools: '',
        learnings: '',
        reflection: '',
        images: [
            './Ejericicios en Casa/Tarea 1/Tarea_1.pdf'
        ],
        codeFiles: []
    },
    'tarea-2': {
        title: 'Miniensayo: Cloud-native vs Cloud-enabled',
        objectives: '',
        tools: '',
        learnings: '',
        reflection: 'Cuando una empresa decide mover una aplicación a la nube, aparece una duda muy común: ¿vale la pena hacerla cloud-native desde cero o simplemente adaptarla para que funcione en la nube, lo que se conoce como cloud-enabled? Aunque los dos caminos pueden parecer similares, en realidad son bastante distintos y cada uno tiene ventajas, riesgos y costos que conviene analizar. Este tema es especialmente importante hoy porque muchas organizaciones tienen aplicaciones viejas que todavía sirven pero necesitan modernizarse para no quedarse atrás. Aquí no hablamos de un detalle técnico menor, sino de una decisión que impacta en la estrategia, los costos y la manera en que la empresa se organiza para el futuro.\n\nUna aplicación cloud-native es aquella que se diseña pensando en la nube desde el principio. No es un sistema que se toma y se "sube" como está, sino que nace con una arquitectura moderna: microservicios, contenedores como Docker, orquestadores como Kubernetes, escalado automático, monitoreo constante y un diseño preparado para que si una parte falla no colapse todo. Lo cloud-native aprovecha de verdad lo que la nube ofrece: elasticidad, velocidad de despliegue, resiliencia. Es como construir un edificio nuevo con materiales y planos hechos para resistir terremotos, en lugar de reforzar una casa vieja. Por otro lado, una aplicación cloud-enabled es básicamente un sistema tradicional que se adapta para funcionar en la nube. Se puede tomar el software que corría en servidores locales y levantarlo en máquinas virtuales de AWS, Azure o Google Cloud, o usar servicios gestionados de base de datos y almacenamiento. Funciona, pero la estructura de fondo sigue siendo la misma. Es útil, pero no exprime todo el potencial.\n\nSi ponemos las dos opciones frente a frente, aparecen diferencias claras. En cuanto a escalabilidad, una app cloud-native puede crecer o reducirse automáticamente con la demanda, mientras que una cloud-enabled queda atada a su diseño monolítico, que impide escalar de forma precisa y granular. En tiempo y costo inicial, cloud-enabled suele ser más rápido y barato porque aprovecha lo ya construido, mientras que cloud-native requiere una inversión más fuerte al inicio, con rediseño y programación desde cero en muchos módulos. En el mantenimiento, cloud-native gana porque se pueden automatizar despliegues y pruebas, mientras que en cloud-enabled se siguen arrastrando parches y dependencias viejas. En costos de operación, cloud-native tiende a ser más eficiente gracias al pago por uso y al escalado bajo demanda, aunque también existe el riesgo de depender demasiado de un solo proveedor. En cloud-enabled a veces aparecen costos ocultos por licencias o por mantener código desactualizado.\n\nPara entenderlo mejor, vale la pena aterrizarlo en un caso real. Pensemos en una empresa de distribución con una aplicación interna de inventarios que fue desarrollada hace años para servidores locales. Esa app todavía funciona, pero tiene muchos problemas: cuando llegan temporadas altas los servidores colapsan, los empleados no pueden conectarse desde fuera de la oficina, los equipos físicos cuestan mucho en mantenimiento y cualquier nueva función tarda meses en estar lista. Los gerentes saben que tienen que hacer algo. Una opción es la migración cloud-enabled: tomar la base de datos y moverla a un servicio gestionado en la nube, desplegar la aplicación en una máquina virtual y usar almacenamiento externo. Así reducen los costos de hardware y ganan acceso remoto, pero la app sigue siendo lenta y difícil de actualizar. La otra opción es volverla cloud-native: dividirla en microservicios, crear un módulo para inventarios, otro para pedidos, otro para reportes, y que todo corra en contenedores con escalado automático. Además se podrían añadir notificaciones en tiempo real con servicios serverless y lanzar actualizaciones rápidas sin detener toda la app. Es mucho más trabajo, pero a la larga ofrece independencia y flexibilidad.\n\nEste análisis muestra la esencia del dilema: cloud-enabled es más barato y rápido al inicio, pero arrastra limitaciones del pasado. Cloud-native requiere más esfuerzo, pero asegura que la aplicación esté lista para crecer, recuperarse de fallos y adaptarse a lo que venga. En el ejemplo de la empresa de distribución, si lo único que buscan es aliviar los problemas inmediatos, entonces cloud-enabled basta. Pero si su visión es crecer, integrar apps móviles y dar acceso remoto sin límites, lo cloud-native se vuelve lo más recomendable. Incluso hay un camino intermedio: una estrategia híbrida que empiece migrando solo la base de datos y algunos módulos, mientras se planea la reconstrucción de las partes más críticas de manera nativa.\n\nLo interesante de este debate es que no se trata solo de una decisión técnica. Está profundamente ligado a la estrategia de negocio. Muchas empresas han corrido a la nube sin planear, pensando que con migrar la app ya estaba todo resuelto, y después descubren que los costos son más altos de lo esperado o que el sistema es difícil de mantener. La nube exige una manera distinta de pensar en diseño, en monitoreo y en escalado. No basta con "subir" un software; se trata de repensar cómo se construye y se opera.\n\nLa literatura actual respalda estas ideas. Deng y colaboradores (2023) muestran que el ciclo de vida de las aplicaciones cloud-native es más complejo de lo que parece, porque coordinar microservicios, orquestadores y escalado requiere experiencia. Medel et al. (2020) analizan cómo Docker y Kubernetes pueden mejorar el rendimiento y la eficiencia, pero solo si están bien configurados. Blogs técnicos de la Cloud Native Computing Foundation advierten que muchas empresas venden como cloud-native algo que en realidad solo está adaptado, y que ese maquillaje no elimina las limitaciones de un monolito. Atlan, por su parte, explica que el riesgo de depender en exceso de un proveedor —el famoso vendor lock-in— es real y debe considerarse en la estrategia. Todo esto demuestra que no se trata de etiquetas, sino de un cambio profundo en cómo pensamos las aplicaciones.\n\nEn conclusión, cloud-native y cloud-enabled representan dos caminos muy diferentes. Uno es más inmediato, el otro es más ambicioso. No hay una respuesta universal: depende del dinero disponible, de la visión de negocio, de la urgencia y de los recursos humanos que tenga la organización. Para algunos, lo sensato será empezar con cloud-enabled y ganar tiempo. Para otros, la apuesta clara será cloud-native, aunque implique más inversión. Lo importante es no tomar la decisión a la ligera ni solo por moda, sino con un análisis honesto de costos, beneficios y riesgos. Lo que al final define el éxito no es si la app es "nativa" o "habilitada", sino si cumple con lo que la organización y sus usuarios necesitan hoy y estarán necesitando mañana.\n\nReferencias:\nS. Deng et al., "Cloud-Native Computing: A Survey from the Perspective of Services," 2023, arXiv:2306.14402.\nA. Medel et al., "Resource Management Schemes for Cloud-Native Platforms with Computing Containers of Docker and Kubernetes," 2020, arXiv:2010.10350.\nCloud Native Computing Foundation (CNCF), "Cloud-based versus Cloud-native: What\'s the difference?" 2023.\nAtlan, "Cloud Native vs Cloud Enabled: Key Differences in 2024," 2024.\nFundGuard, "Cloud-Enabled vs Cloud-Native – Know the Difference," 2023.',
        images: [],
        codeFiles: []
    },
    'tarea-3': {
        title: 'Arquitectura Cloud para Banca Móvil',
        objectives: '',
        tools: '',
        learnings: '',
        reflection: `# Reflexión Personal: Diseño de Arquitectura Cloud para Banca Móvil

## ¿Qué aprendí realmente?

Cuando me pidieron diseñar una arquitectura cloud para una aplicación de banca móvil usando nube híbrida y funciones serverless, al principio pensé "bueno, esto suena complicado pero interesante". La verdad es que no tenía idea de lo profundo que iba a ser este proyecto. Pensé que sería como hacer una aplicación web normal, pero con más servicios de AWS. Qué equivocado estaba.

Lo primero que me llamó la atención fue entender qué significa realmente una "nube híbrida". No es solo usar AWS y ya, sino combinar lo mejor de ambos mundos: la escalabilidad de la nube pública con el control y seguridad de una infraestructura privada. Es como tener tu casa (datos sensibles) en un barrio seguro, pero usar servicios públicos (funciones serverless) cuando los necesitas.

Al principio me costó mucho entender por qué no simplemente poner todo en AWS. Después de todo, es confiable, escalable y tiene todos los servicios que necesitas. Pero cuando empecé a investigar sobre compliance bancario y regulaciones como PCI DSS, me di cuenta de que a veces necesitas tener control total sobre ciertos aspectos de tu infraestructura. Especialmente cuando hablas de datos financieros sensibles.

## Los desafíos reales

El mayor reto fue pensar como un banco real. No es solo hacer que funcione, sino que sea seguro, cumpla regulaciones y pueda manejar millones de transacciones sin romperse. Me di cuenta de que en el mundo real, cada decisión técnica tiene implicaciones legales, de seguridad y de negocio.

Por ejemplo, cuando diseñé las funciones Lambda para autenticación, no solo tenía que hacer que el login funcionara, sino pensar en cosas como: ¿qué pasa si alguien intenta hackear? ¿Cómo registro cada intento de acceso? ¿Cómo manejo los tokens de sesión de forma segura? Es increíble cómo algo que parece simple (un login) se vuelve súper complejo cuando hablamos de dinero real.

## La parte técnica que más me gustó

Definitivamente fue trabajar con Terraform. Es fascinante cómo puedes describir toda tu infraestructura como código. Es como tener una receta que puedes seguir para crear exactamente el mismo ambiente una y otra vez. Si algo se rompe, puedes destruir todo y recrearlo desde cero.

También me encantó cómo funciona el patrón de cache con DynamoDB y Aurora PostgreSQL. La idea de tener datos rápidos en DynamoDB para consultas frecuentes (como el balance de una cuenta) y datos críticos en PostgreSQL para transacciones importantes es brillante.

## Lo que me sorprendió

Lo que más me sorprendió fue darme cuenta de que la tecnología es solo una parte del problema. La mayor parte del trabajo fue pensar en compliance, auditoría y seguridad. Cosas como PCI DSS, SOX, GDPR... al principio pensé "esto es aburrido", pero luego entendí que son las reglas que mantienen el sistema financiero funcionando de forma confiable.

También me sorprendió lo importante que es el monitoreo. En un sistema bancario, no puedes darte el lujo de que algo falle sin saberlo. Necesitas saber exactamente qué está pasando en cada momento, quién está haciendo qué, y si algo se ve sospechoso.

## Reflexión final

Este proyecto me hizo darme cuenta de que la tecnología es solo una herramienta. Lo importante es entender el problema que estás tratando de resolver y usar la tecnología apropiada para resolverlo. No se trata de usar la tecnología más nueva o más cool, sino de usar la que mejor se adapte a las necesidades reales.

Al final, este proyecto me enseñó que ser un desarrollador no es solo sobre escribir código, sino sobre resolver problemas reales para personas reales, usando las mejores herramientas disponibles, de la forma más eficiente y segura posible. Es sobre entender que cada línea de código que escribes tiene el potencial de impactar la vida de alguien, para bien o para mal.

Y eso, creo, es lo que realmente significa ser un profesional en tecnología. No es solo sobre saber usar las herramientas, sino sobre entender cuándo usarlas, por qué usarlas, y cómo usarlas de manera responsable.`,
        images: [
            './Ejericicios en Casa/Tarea 3/media/Captura de pantalla 2025-09-12 a la(s) 9.08.22 p.m..png',
            './Ejericicios en Casa/Tarea 3/media/Captura de pantalla 2025-09-12 a la(s) 9.08.59 p.m..png',
            './Ejericicios en Casa/Tarea 3/media/hola1.png',
            './Ejericicios en Casa/Tarea 3/media/hola4.png'
        ],
        codeFiles: []
    },
    'proyecto-final': {
        title: 'Reporte Técnico Proyecto Integración',
        objectives: 'Desarrollar un proyecto integrador que demuestre las competencias adquiridas en el curso de Integración de Aplicaciones Web, incluyendo el uso de tecnologías cloud, microservicios, APIs REST, y arquitecturas modernas.',
        tools: 'Tecnologías cloud (AWS, GCP), microservicios, APIs REST, bases de datos, contenedores, y herramientas de integración y despliegue.',
        learnings: 'Integración de múltiples tecnologías y servicios, diseño de arquitecturas escalables, implementación de APIs REST, manejo de bases de datos, y despliegue en entornos cloud.',
        reflection: 'Este proyecto integrador representa la culminación de todo el aprendizaje adquirido durante el curso de Integración de Aplicaciones Web. A través de este proyecto, pude demostrar la capacidad de integrar múltiples tecnologías y servicios para crear una solución completa y funcional. El desarrollo de este proyecto me permitió aplicar conocimientos de arquitecturas cloud, microservicios, APIs REST, y tecnologías de integración en un contexto real y práctico.',
        images: [
            './Proyecto Final/proyectof.pdf'
        ],
        codeFiles: []
    }
};

// Function to escape HTML characters for display as plain text
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Open project modal
function openProjectModal(projectId) {
    const project = projects[projectId];
    if (!project) return;

    // Set modal title
    document.getElementById('modal-title').textContent = project.title;
    
    // Handle special tareas differently
    if (projectId === 'tarea-1') {
        // Tarea 1: Show PDF
        document.getElementById('objectives').innerHTML = `
            <h4>Objetivo:</h4>
            <p>Crear un mapa mental que contraste los modelos IaaS, PaaS, SaaS y FaaS con ejemplos reales de proveedores de nube.</p>
            <h4>Herramientas:</h4>
            <p>Miro o Lucidchart para diagramación</p>
            <h4>Documento:</h4>
            <div style="text-align: center; margin: 2rem 0;">
                <iframe src="./Ejericicios en Casa/Tarea 1/Tarea_1.pdf" width="100%" height="600px" style="border: 2px solid var(--primary-green); border-radius: 10px;"></iframe>
                <p style="margin-top: 1rem; color: var(--text-secondary);">
                    <i class="fas fa-file-pdf"></i> Tarea_1.pdf - Mapa Conceptual Comparativo de Modelos Cloud
                </p>
            </div>
        `;
        document.getElementById('tools').textContent = 'Miro o Lucidchart para diagramación';
        document.getElementById('learnings').textContent = 'Análisis comparativo de modelos de servicios en la nube, identificación de características distintivas entre IaaS, PaaS, SaaS y FaaS, y creación de mapas conceptuales para visualizar relaciones complejas.';
        document.getElementById('reflection').textContent = 'Esta tarea me permitió profundizar en el entendimiento de los diferentes modelos de servicios en la nube. Al crear el mapa conceptual, pude visualizar claramente las diferencias entre cada modelo y cómo se relacionan entre sí. El proceso de investigación y diagramación me ayudó a comprender mejor las ventajas y desventajas de cada enfoque, así como los casos de uso específicos para cada modelo.';
        
        // Clear images and code for PDF
        document.getElementById('images-container').innerHTML = '';
        document.getElementById('code-container').innerHTML = '';
        
    } else if (projectId === 'tarea-2') {
        // Tarea 2: Show full essay content
        document.getElementById('objectives').innerHTML = `
            <h4>Tema:</h4>
            <p>"¿Cloud-native o Cloud-enabled? Análisis de una app real."</p>
            <h4>Extensión:</h4>
            <p>600 palabras con referencias bibliográficas actuales (IEEE, ACM, blogs técnicos confiables)</p>
        `;
        document.getElementById('tools').textContent = 'Investigación bibliográfica, análisis comparativo, escritura académica, referencias IEEE y ACM';
        document.getElementById('learnings').textContent = 'Análisis profundo de las diferencias entre aplicaciones cloud-native y cloud-enabled, investigación bibliográfica con fuentes académicas, escritura de ensayos técnicos, y evaluación de casos de uso reales en la industria.';
        document.getElementById('reflection').textContent = project.reflection;
        
        // Clear images and code for essay
        document.getElementById('images-container').innerHTML = '';
        document.getElementById('code-container').innerHTML = '';
        
    } else if (projectId === 'tarea-3') {
        // Tarea 3: Show architecture project
        document.getElementById('objectives').innerHTML = `
            <h4>Prompt de IA:</h4>
            <p>"Simula el diseño de una arquitectura cloud para una aplicación de banca móvil usando una nube híbrida y funciones serverless. Muestra el código del backend básico y diagrama arquitectónico."</p>
            <h4>Entregables:</h4>
            <p>Código generado, screenshots y reflexión de 500 palabras sobre el uso de IA para crear arquitecturas</p>
            <h4>Arquitectura Implementada:</h4>
            <div style="margin: 1rem 0; padding: 1rem; background: rgba(0, 255, 136, 0.1); border-radius: 10px;">
                <p><strong>Nube Híbrida:</strong> AWS (pública) + RDS Aurora (privada)</p>
                <p><strong>Serverless:</strong> Lambda Functions para lógica de negocio</p>
                <p><strong>Seguridad:</strong> Cognito, KMS, VPC privada</p>
                <p><strong>Compliance:</strong> PCI DSS, SOX, GDPR</p>
            </div>
        `;
        document.getElementById('tools').textContent = 'AWS Lambda, DynamoDB, Aurora PostgreSQL, Cognito, API Gateway, Terraform, Python 3.9, Mermaid diagrams';
        document.getElementById('learnings').textContent = 'Diseño de arquitecturas cloud híbridas, implementación de funciones serverless, compliance bancario, seguridad en la nube, infraestructura como código con Terraform, y reflexión sobre el uso de IA en arquitectura de software.';
        document.getElementById('reflection').textContent = project.reflection;
        
        // Set images for architecture
        const imagesContainer = document.getElementById('images-container');
        imagesContainer.innerHTML = '';
        
        const architectureImages = [
            './Ejericicios en Casa/Tarea 3/media/Captura de pantalla 2025-09-12 a la(s) 9.08.22 p.m..png',
            './Ejericicios en Casa/Tarea 3/media/Captura de pantalla 2025-09-12 a la(s) 9.08.59 p.m..png',
            './Ejericicios en Casa/Tarea 3/media/hola1.png',
            './Ejericicios en Casa/Tarea 3/media/hola4.png'
        ];
        
        architectureImages.forEach(imagePath => {
            const imageItem = document.createElement('div');
            imageItem.className = 'image-item';
            imageItem.innerHTML = `<img src="${imagePath}" alt="Screenshot de la arquitectura">`;
            imagesContainer.appendChild(imageItem);
        });
        
        // Set code files for architecture
        const codeContainer = document.getElementById('code-container');
        codeContainer.innerHTML = '';
        
        const architectureCodeFiles = [
            {
                name: 'serverless/functions/auth/login.py',
                content: `"""
Función Lambda para autenticación de usuarios
"""

import json
import logging
import boto3
import hashlib
import hmac
import base64
from datetime import datetime, timedelta
import os
import sys

# Agregar el directorio shared al path
sys.path.append('/opt/python')
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..', 'shared'))

from models import User, AuthResponse, APIResponse
from utils import validate_request_body, create_response, get_secret, encrypt_data

logger = logging.getLogger()
logger.setLevel(logging.INFO)

# Cliente de Cognito
cognito_client = boto3.client('cognito-idp')

# Cliente de DynamoDB
dynamodb = boto3.resource('dynamodb')

def lambda_handler(event, context):
    """
    Handler principal para la función de login
    
    Args:
        event: Evento de Lambda
        context: Contexto de Lambda
        
    Returns:
        Respuesta HTTP con tokens de autenticación
    """
    try:
        # Validar método HTTP
        if event.get('httpMethod') != 'POST':
            return create_response(405, APIResponse(
                success=False,
                message="Método no permitido",
                error_code="METHOD_NOT_ALLOWED"
            ))
        
        # Validar cuerpo de la petición
        body = validate_request_body(event, ['email', 'password'])
        
        email = body['email']
        password = body['password']
        
        # Autenticar usuario con Cognito
        auth_response = authenticate_user(email, password)
        
        if auth_response:
            # Registrar login exitoso
            log_user_activity(email, 'LOGIN_SUCCESS', event)
            
            return create_response(200, APIResponse(
                success=True,
                message="Autenticación exitosa",
                data=auth_response.__dict__
            ))
        else:
            # Registrar intento fallido
            log_user_activity(email, 'LOGIN_FAILED', event)
            
            return create_response(401, APIResponse(
                success=False,
                message="Credenciales inválidas",
                error_code="INVALID_CREDENTIALS"
            ))
            
    except ValueError as e:
        logger.error(f"Error de validación: {str(e)}")
        return create_response(400, APIResponse(
            success=False,
            message=str(e),
            error_code="VALIDATION_ERROR"
        ))
    except Exception as e:
        logger.error(f"Error en login: {str(e)}")
        return create_response(500, APIResponse(
            success=False,
            message="Error interno del servidor",
            error_code="INTERNAL_ERROR"
        ))

def authenticate_user(email: str, password: str) -> AuthResponse:
    """
    Autentica un usuario usando AWS Cognito
    
    Args:
        email: Email del usuario
        password: Contraseña del usuario
        
    Returns:
        Respuesta de autenticación o None si falla
    """
    try:
        user_pool_id = os.environ.get('USER_POOL_ID')
        client_id = os.environ.get('COGNITO_CLIENT_ID')
        
        if not user_pool_id or not client_id:
            raise Exception("Configuración de Cognito faltante")
        
        # Intentar autenticación con Cognito
        response = cognito_client.admin_initiate_auth(
            UserPoolId=user_pool_id,
            ClientId=client_id,
            AuthFlow='ADMIN_NO_SRP_AUTH',
            AuthParameters={
                'USERNAME': email,
                'PASSWORD': password
            }
        )
        
        if 'AuthenticationResult' in response:
            auth_result = response['AuthenticationResult']
            
            # Generar tokens adicionales si es necesario
            access_token = auth_result['AccessToken']
            refresh_token = auth_result.get('RefreshToken', '')
            expires_in = auth_result['ExpiresIn']
            
            # Obtener información del usuario
            user_info = get_user_info(email)
            
            return AuthResponse(
                access_token=access_token,
                refresh_token=refresh_token,
                expires_in=expires_in,
                token_type="Bearer"
            )
        
        return None
        
    except cognito_client.exceptions.NotAuthorizedException:
        logger.warning(f"Credenciales inválidas para usuario: {email}")
        return None
    except cognito_client.exceptions.UserNotFoundException:
        logger.warning(f"Usuario no encontrado: {email}")
        return None
    except Exception as e:
        logger.error(f"Error autenticando usuario {email}: {str(e)}")
        raise`
            },
            {
                name: 'serverless/functions/transactions/transfer.py',
                content: `import json
import boto3
from botocore.exceptions import ClientError
import uuid
from datetime import datetime
import os

def lambda_handler(event, context):
    """
    Lambda function para procesar transferencias bancarias
    Implementa validación de fondos, creación de transacciones y notificaciones
    """
    try:
        # Parse request body
        body = json.loads(event['body'])
        from_account = body.get('from_account')
        to_account = body.get('to_account')
        amount = body.get('amount')
        description = body.get('description', '')
        
        # Validate input
        if not all([from_account, to_account, amount]):
            return {
                'statusCode': 400,
                'body': json.dumps({
                    'error': 'Missing required fields'
                })
            }
        
        if amount <= 0:
            return {
                'statusCode': 400,
                'body': json.dumps({
                    'error': 'Amount must be positive'
                })
            }
        
        # Check if accounts are different
        if from_account == to_account:
            return {
                'statusCode': 400,
                'body': json.dumps({
                    'error': 'Cannot transfer to same account'
                })
            }
        
        # Generate transaction ID
        transaction_id = str(uuid.uuid4())
        
        # Check account balance using DynamoDB cache
        dynamodb = boto3.resource('dynamodb')
        accounts_table = dynamodb.Table(os.environ['ACCOUNTS_TABLE'])
        
        try:
            response = accounts_table.get_item(
                Key={'account_id': from_account}
            )
            
            if 'Item' not in response:
                return {
                    'statusCode': 404,
                    'body': json.dumps({
                        'error': 'Source account not found'
                    })
                }
            
            current_balance = float(response['Item']['balance'])
            
            if current_balance < amount:
                return {
                    'statusCode': 400,
                    'body': json.dumps({
                        'error': 'Insufficient funds'
                    })
                }
            
            # Create transaction record
            transaction = {
                'transaction_id': transaction_id,
                'from_account': from_account,
                'to_account': to_account,
                'amount': amount,
                'description': description,
                'status': 'PENDING',
                'created_at': datetime.utcnow().isoformat(),
                'ttl': int((datetime.utcnow() + timedelta(days=7)).timestamp())
            }
            
            # Store transaction in DynamoDB
            transactions_table = dynamodb.Table(os.environ['TRANSACTIONS_TABLE'])
            transactions_table.put_item(Item=transaction)
            
            # Update account balances (optimistic locking)
            try:
                accounts_table.update_item(
                    Key={'account_id': from_account},
                    UpdateExpression='SET balance = balance - :amount',
                    ConditionExpression='balance >= :amount',
                    ExpressionAttributeValues={
                        ':amount': amount
                    }
                )
                
                accounts_table.update_item(
                    Key={'account_id': to_account},
                    UpdateExpression='SET balance = balance + :amount',
                    ExpressionAttributeValues={
                        ':amount': amount
                    }
                )
                
                # Update transaction status
                transactions_table.update_item(
                    Key={'transaction_id': transaction_id},
                    UpdateExpression='SET #status = :status',
                    ExpressionAttributeNames={'#status': 'status'},
                    ExpressionAttributeValues={':status': 'COMPLETED'}
                )
                
                # Send notifications via SNS
                sns_client = boto3.client('sns')
                notification_message = {
                    'transaction_id': transaction_id,
                    'from_account': from_account,
                    'to_account': to_account,
                    'amount': amount,
                    'status': 'COMPLETED'
                }
                
                sns_client.publish(
                    TopicArn=os.environ['NOTIFICATIONS_TOPIC'],
                    Message=json.dumps(notification_message),
                    Subject='Transferencia Completada'
                )
                
                # Queue for RDS processing
                sqs_client = boto3.client('sqs')
                sqs_client.send_message(
                    QueueUrl=os.environ['RDS_QUEUE_URL'],
                    MessageBody=json.dumps(transaction)
                )
                
                return {
                    'statusCode': 200,
                    'body': json.dumps({
                        'transaction_id': transaction_id,
                        'status': 'COMPLETED',
                        'message': 'Transfer completed successfully'
                    })
                }
                
            except ClientError as e:
                if e.response['Error']['Code'] == 'ConditionalCheckFailedException':
                    return {
                        'statusCode': 400,
                        'body': json.dumps({
                            'error': 'Insufficient funds'
                        })
                    }
                else:
                    raise e
                    
        except ClientError as e:
            return {
                'statusCode': 500,
                'body': json.dumps({
                    'error': 'Database error'
                })
            }
            
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({
                'error': 'Internal server error'
            })
        }`
            },
            {
                name: 'serverless/infrastructure/main.tf',
                content: `# Terraform configuration for Banking Mobile App Architecture
# Implements hybrid cloud with AWS services and private RDS

terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# Data sources
data "aws_caller_identity" "current" {}
data "aws_region" "current" {}

# Variables
variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "dev"
}

variable "app_name" {
  description = "Application name"
  type        = string
  default     = "banking-mobile-app"
}

# VPC Configuration
module "vpc" {
  source = "./modules/vpc"
  
  app_name    = var.app_name
  environment = var.environment
}

# RDS Aurora PostgreSQL
module "rds" {
  source = "./modules/rds"
  
  app_name           = var.app_name
  environment         = var.environment
  vpc_id             = module.vpc.vpc_id
  private_subnet_ids  = module.vpc.private_subnet_ids
  security_group_ids = [module.vpc.database_security_group_id]
}

# DynamoDB Tables
module "dynamodb" {
  source = "./modules/dynamodb"
  
  app_name    = var.app_name
  environment = var.environment
}

# Cognito User Pool
module "cognito" {
  source = "./modules/cognito"
  
  app_name    = var.app_name
  environment = var.environment
}

# Lambda Functions
module "lambda" {
  source = "./modules/lambda"
  
  app_name           = var.app_name
  environment         = var.environment
  vpc_id             = module.vpc.vpc_id
  private_subnet_ids  = module.vpc.private_subnet_ids
  security_group_ids = [module.vpc.lambda_security_group_id]
  
  # Dependencies
  user_pool_id      = module.cognito.user_pool_id
  client_id         = module.cognito.client_id
  accounts_table    = module.dynamodb.accounts_table_name
  transactions_table = module.dynamodb.transactions_table_name
  audit_table       = module.dynamodb.audit_table_name
  rds_endpoint      = module.rds.endpoint
}

# API Gateway
module "api_gateway" {
  source = "./modules/api-gateway"
  
  app_name    = var.app_name
  environment = var.environment
  
  # Lambda function ARNs
  auth_lambda_arn           = module.lambda.auth_lambda_arn
  accounts_lambda_arn      = module.lambda.accounts_lambda_arn
  transactions_lambda_arn  = module.lambda.transactions_lambda_arn
  notifications_lambda_arn = module.lambda.notifications_lambda_arn
}

# S3 Buckets
module "s3" {
  source = "./modules/s3"
  
  app_name    = var.app_name
  environment = var.environment
}

# SNS Topics
module "sns" {
  source = "./modules/sns"
  
  app_name    = var.app_name
  environment = var.environment
}

# SQS Queues
module "sqs" {
  source = "./modules/sqs"
  
  app_name    = var.app_name
  environment = var.environment
}

# KMS Keys
module "kms" {
  source = "./modules/kms"
  
  app_name    = var.app_name
  environment = var.environment
}

# CloudWatch Monitoring
module "monitoring" {
  source = "./modules/monitoring"
  
  app_name    = var.app_name
  environment = var.environment
  
  # Lambda function names
  lambda_function_names = [
    module.lambda.auth_function_name,
    module.lambda.accounts_function_name,
    module.lambda.transactions_function_name,
    module.lambda.notifications_function_name
  ]
}

# Outputs
output "api_gateway_url" {
  description = "API Gateway URL"
  value       = module.api_gateway.api_url
}

output "user_pool_id" {
  description = "Cognito User Pool ID"
  value       = module.cognito.user_pool_id
}

output "client_id" {
  description = "Cognito Client ID"
  value       = module.cognito.client_id
}

output "rds_endpoint" {
  description = "RDS Aurora endpoint"
  value       = module.rds.endpoint
  sensitive   = true
}

output "dynamodb_tables" {
  description = "DynamoDB table names"
  value = {
    accounts     = module.dynamodb.accounts_table_name
    transactions = module.dynamodb.transactions_table_name
    audit        = module.dynamodb.audit_table_name
  }
}`
            }
        ];
        
        architectureCodeFiles.forEach(file => {
            const codeFile = document.createElement('div');
            codeFile.className = 'code-file';
            codeFile.innerHTML = `
                <div class="code-file-header">
                    <i class="fas fa-file-code"></i>
                    <h4>${file.name}</h4>
                </div>
                <div class="code-content">
                    <pre><code>${escapeHtml(file.content)}</code></pre>
                </div>
            `;
            codeContainer.appendChild(codeFile);
        });
        
    } else if (projectId === 'proyecto-final') {
        // Proyecto Final: Show PDF report
        document.getElementById('objectives').innerHTML = `
            <h4>Objetivo:</h4>
            <p>Desarrollar un proyecto integrador que demuestre las competencias adquiridas en el curso de Integración de Aplicaciones Web, incluyendo el uso de tecnologías cloud, microservicios, APIs REST, y arquitecturas modernas.</p>
            <h4>Contenido:</h4>
            <p>Documentación técnica detallada del proyecto desarrollado</p>
            <h4>Reporte:</h4>
            <div style="text-align: center; margin: 2rem 0;">
                <iframe src="./Proyecto Final/proyectof.pdf" width="100%" height="600px" style="border: 2px solid var(--primary-green); border-radius: 10px;"></iframe>
                <p style="margin-top: 1rem; color: var(--text-secondary);">
                    <i class="fas fa-file-pdf"></i> proyectof.pdf - Reporte Técnico Proyecto Integración
                </p>
            </div>
        `;
        document.getElementById('tools').textContent = 'Tecnologías cloud (AWS, GCP), microservicios, APIs REST, bases de datos, contenedores, y herramientas de integración y despliegue.';
        document.getElementById('learnings').textContent = 'Integración de múltiples tecnologías y servicios, diseño de arquitecturas escalables, implementación de APIs REST, manejo de bases de datos, y despliegue en entornos cloud.';
        document.getElementById('reflection').textContent = project.reflection;
        
        // Clear images and code for PDF
        document.getElementById('images-container').innerHTML = '';
        document.getElementById('code-container').innerHTML = '';
        
    } else {
        // Regular projects
        document.getElementById('objectives').textContent = project.objectives;
        document.getElementById('tools').textContent = project.tools;
        document.getElementById('learnings').textContent = project.learnings;
        document.getElementById('reflection').textContent = project.reflection;
        
        // Set images
        const imagesContainer = document.getElementById('images-container');
        imagesContainer.innerHTML = '';
        
        project.images.forEach(imagePath => {
            const imageItem = document.createElement('div');
            imageItem.className = 'image-item';
            imageItem.innerHTML = `<img src="${imagePath}" alt="Screenshot del proyecto">`;
            imagesContainer.appendChild(imageItem);
        });
        
        // Set code files
        const codeContainer = document.getElementById('code-container');
        codeContainer.innerHTML = '';
        
        project.codeFiles.forEach(file => {
            const codeFile = document.createElement('div');
            codeFile.className = 'code-file';
            codeFile.innerHTML = `
                <div class="code-file-header">
                    <i class="fas fa-file-code"></i>
                    <h4>${file.name}</h4>
                </div>
                <div class="code-content">
                    <pre><code>${escapeHtml(file.content)}</code></pre>
                </div>
            `;
            codeContainer.appendChild(codeFile);
        });
    }
    
    // Show modal
    const modal = document.getElementById('project-modal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Reset to first tab
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    tabBtns.forEach(b => b.classList.remove('active'));
    tabContents.forEach(c => c.classList.remove('active'));
    tabBtns[0].classList.add('active');
    tabContents[0].classList.add('active');
}

// Close modal
function closeModal() {
    const modal = document.getElementById('project-modal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Smooth scrolling for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
