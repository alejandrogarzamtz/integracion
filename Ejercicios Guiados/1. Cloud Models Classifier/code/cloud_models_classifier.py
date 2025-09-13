#!/usr/bin/env python3
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
                pattern = r'\b' + re.escape(keyword) + r'\b'
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
    print(f"\n{'='*60}")
    print(f"TEXTO: {text}")
    print(f"{'='*60}")
    
    if verbose:
        # Análisis detallado
        analysis = classifier.get_detailed_analysis(text)
        print(f"TIPO DE SERVICIO: {analysis['tipo_servicio']}")
        print(f"CONFIANZA: {analysis['confianza']:.1%}")
        print(f"EXPLICACIÓN: {analysis['explicacion']}")
        
        print(f"\nSCORES POR TIPO:")
        for service, score in analysis['scores_completos'].items():
            print(f"  {service}: {score}")
        
        print(f"\nPALABRAS CLAVE ENCONTRADAS:")
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
    
    print("=== EJEMPLOS PREDEFINIDOS ===\n")
    
    for i, example in enumerate(examples, 1):
        print(f"Ejemplo {i}:")
        print_classification_result(example, classifier, verbose)
        print()

def run_interactive(classifier: CloudServiceClassifier, verbose: bool = False):
    """Ejecuta el modo interactivo"""
    print("\n=== MODO INTERACTIVO ===")
    print("Escribe 'salir' para terminar")
    print("Escribe 'ejemplos' para ver ejemplos predefinidos")
    
    while True:
        try:
            user_input = input("\nIngresa un texto para clasificar: ").strip()
            
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
            print("\n\nSaliendo del modo interactivo...")
            break
        except EOFError:
            print("\n\nSaliendo del modo interactivo...")
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
        print("\n\nOperación cancelada por el usuario.")
        sys.exit(0)
    except Exception as e:
        print(f"\nError inesperado: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
