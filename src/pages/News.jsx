/**
 * 📰 NEWS - Componente de noticias y actualizaciones
 * 
 * 📍 FUNCIÓN:
 * - Muestra noticias y actualizaciones de la aplicación
 * - Placeholder simple que puede expandirse en el futuro
 * - Se integra en el Home para usuarios autenticados
 * - Puede usarse como página independiente también
 * 
 * 🎯 CARACTERÍSTICAS:
 * - Diseño de tarjetas para noticias
 * - Contenido estático por ahora (puede ser dinámico después)
 * - Responsive y visualmente atractivo
 */

import React from 'react'
import './News.css'

const Noticias = () => {
  // Datos de ejemplo para noticias (pueden venir de una API en el futuro)
  const newsItems = [
    {
      id: 1,
      title: '🎉 Cut Optimizer ya está en línea',
      date: '2024-01-15',
      content: 'La primera vrsión de Cut Optimizer está disponible. Comienza a optimizar tus proyectos de corte hoy mismo.',
      type: 'announcement'
    },
    {
      id: 2,
      title: '📊 Nuevas métricas de eficiencia',
      date: '2024-01-10',
      content: 'Hemos mejorado el cálculo de eficiencia para que sea más preciso y útil para tus proyectos.',
      type: 'improvement'
    },
    {
      id: 3,
      title: '🛠️ Próximas características',
      date: '2024-01-05',
      content: 'Estamos trabajando en la importación/exportación de proyectos y más algoritmos de optimización.',
      type: 'upcoming'
    }
  ]

  /**
   * 🎨 Obtiene la clase CSS según el tipo de noticia
   * @param {string} type - Tipo de noticia
   * @returns {string} Clase CSS correspondiente
   */
  const getNewsTypeClass = (type) => {
    const typeClasses = {
      announcement: 'news-announcement',
      improvement: 'news-improvement',
      upcoming: 'news-upcoming'
    }
    return typeClasses[type] || 'news-default'
  }

  /**
   * 🎨 Obtiene el icono según el tipo de noticia
   * @param {string} type - Tipo de noticia
   * @returns {string} Emoji o icono correspondiente
   */
  const getNewsIcon = (type) => {
    const typeIcons = {
      announcement: '🎉',
      improvement: '📊',
      upcoming: '🛠️'
    }
    return typeIcons[type] || '📰'
  }

  return (
    <div className="news-component">
      {/* Header de noticias */}
      <div className="news-header">
        <h2>Últimas Noticias</h2>
        <p>Mantente informado sobre las actualizaciones de Cut Optimizer</p>
      </div>

      {/* Lista de noticias */}
      <div className="news-list">
        {newsItems.map((news) => (
          <article 
            key={news.id} 
            className={`news-item ${getNewsTypeClass(news.type)}`}
          >
            <div className="news-icon">
              {getNewsIcon(news.type)}
            </div>
            
            <div className="news-content">
              <h3 className="news-title">{news.title}</h3>
              <div className="news-meta">
                <span className="news-date">{news.date}</span>
                <span className="news-type">{news.type}</span>
              </div>
              <p className="news-text">{news.content}</p>
            </div>
          </article>
        ))}
      </div>

      {/* Mensaje cuando no hay noticias (futura implementación) */}
      {newsItems.length === 0 && (
        <div className="news-empty">
          <div className="empty-icon">📰</div>
          <h3>No hay noticias por ahora</h3>
          <p>Vuelve pronto para ver las últimas actualizaciones</p>
        </div>
      )}
    </div>
  )
}

export default Noticias
