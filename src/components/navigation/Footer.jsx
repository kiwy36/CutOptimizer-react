/**
 * 🦶 FOOTER - Pie de página optimizado
 * 
 * 📍 FUNCIÓN:
 * - Muestra información de copyright y enlaces legales
 * - Proporciona enlaces de navegación secundarios
 * - Información de contacto con enlace al portfolio
 * - Versión de la aplicación
 * 
 * 🎯 CARACTERÍSTICAS:
 * - Diseño limpio y minimalista
 * - Responsive para todos los dispositivos
 * - Modal de términos con SweetAlert2
 * - Enlaces útiles y actualizados
 */

import React from 'react'
import Swal from 'sweetalert2'
import './Footer.css'

const Footer = () => {
  const currentYear = new Date().getFullYear()
  const appVersion = '1.0.0'

  // Función para mostrar los términos de uso
  const handleTermsClick = (e) => {
    e.preventDefault()
    
    Swal.fire({
      title: '⚠️ Términos de Uso',
      html: `
        <div style="text-align: left;">
          <h3>Información Importante</h3>
          <p>Esta aplicación es una herramienta de optimización de cortes diseñada para propósitos educativos y profesionales. Los resultados son aproximaciones matemáticas y deben ser verificados antes de su aplicación real.</p>
          
          <h4>Limitación de Responsabilidad</h4>
          <ul style="margin-left: 20px; margin-bottom: 20px;">
            <li>✓ Los cálculos son estimaciones teóricas</li>
            <li>✓ Verifique siempre las medidas antes de cortar</li>
            <li>✓ Considere márgenes de error en materiales reales</li>
            <li>✓ El desarrollador no se responsabiliza por pérdidas materiales</li>
          </ul>
          
          <h4>Recomendaciones de Uso</h4>
          <p>Para mejores resultados, siempre:</p>
          <ul style="margin-left: 20px;">
            <li>Verifique las especificaciones del material</li>
            <li>Considere el grosor de la hoja de corte</li>
            <li>Realice pruebas en material sobrante primero</li>
            <li>Documente sus proyectos para referencia futura</li>
          </ul>
          
          <p style="margin-top: 20px; font-style: italic; color: #666;">
            <strong>Nota:</strong> Esta herramienta es un asistente, no reemplaza la experiencia profesional ni las medidas de seguridad adecuadas.
          </p>
        </div>
      `,
      width: '700px',
      showCloseButton: true,
      showConfirmButton: true,
      confirmButtonText: 'Entendido',
      confirmButtonColor: '#2ecc71',
      backdrop: 'rgba(0, 0, 0, 0.5)'
    })
  }

  // Función para abrir el portfolio en nueva pestaña
  const handleContactClick = (e) => {
    e.preventDefault()
    window.open('https://port-kw.vercel.app/', '_blank', 'noopener,noreferrer')
  }

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Información principal */}
        <div className="footer-main">
          <div className="footer-brand">
            <div className="footer-logo">
              <span>CO</span>
            </div>
            <div className="footer-text">
              <h3>Cut Optimizer</h3>
              <p>Optimizador de cortes inteligente para carpintería y metalmecánica</p>
            </div>
          </div>
          
          {/* Enlaces rápidos */}
          <div className="footer-links">
            <h4>Enlaces Rápidos</h4>
            <ul>
              <li><a href="/">Inicio</a></li>
              <li><a href="/projects">Proyectos</a></li>
              <li><a href="/projects/new">Nuevo Proyecto</a></li>
            </ul>
          </div>
          
          {/* Soporte actualizado */}
          <div className="footer-support">
            <h4>Contacto & Legal</h4>
            <ul>
              <li>
                <a 
                  href="https://port-kw.vercel.app/" 
                  onClick={handleContactClick}
                  rel="noopener noreferrer"
                  className="portfolio-link"
                >
                  Contactar Desarrollador
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  onClick={handleTermsClick}
                  className="terms-link"
                >
                  Términos de Uso
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Línea separadora */}
        <div className="footer-divider"></div>
        
        {/* Información secundaria */}
        <div className="footer-secondary">
          <div className="footer-copyright">
            <p>&copy; {currentYear} Cut Optimizer. Todos los derechos reservados.</p>
            <span className="version">v{appVersion}</span>
          </div>
          
          <div className="footer-credits">
            <p>⚡ Optimizando el futuro, un corte a la vez</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer