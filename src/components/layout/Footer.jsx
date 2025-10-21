/**
 * 🦶 FOOTER - Pie de página de la aplicación
 * 
 * 📍 FUNCIÓN:
 * - Muestra información de copyright y enlaces legales
 * - Proporciona enlaces de navegación secundarios
 * - Información de contacto y soporte
 * - Versión de la aplicación
 * 
 * 🎯 CARACTERÍSTICAS:
 * - Diseño limpio y minimalista
 * - Responsive para todos los dispositivos
 * - Información relevante sin distracciones
 * - Enlaces útiles para el usuario
 */

import React from 'react'
import './Footer.css'

const Footer = () => {
  const currentYear = new Date().getFullYear()
  const appVersion = '1.0.0' // Puedes hacer esto dinámico si quieres

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
              <li><a href="/news">Noticias</a></li>
            </ul>
          </div>
          
          {/* Soporte */}
          <div className="footer-support">
            <h4>Soporte</h4>
            <ul>
              <li><a href="/help">Centro de ayuda</a></li>
              <li><a href="/contact">Contacto</a></li>
              <li><a href="/privacy">Privacidad</a></li>
              <li><a href="/terms">Términos</a></li>
            </ul>
          </div>
        </div>
        
        {/* Línea separadora */}
        <div className="footer-divider"></div>
        
        {/* Información secundaria */}
        <div className="footer-secondary">
          <div className="footer-copyright">
            <p>&copy; {currentYear} Cut Optimizer. Todos los derechos reservados.</p>
            <p className="version">v{appVersion}</p>
          </div>
          
          <div className="footer-credits">
            <p>Hecho con ❤️ para optimizar tus proyectos</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer