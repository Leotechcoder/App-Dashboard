import React from 'react'

const WorkComponent = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen p-8 text-center">
      <img 
        src="https://media.giphy.com/media/Lny6Rw04nsOOc/giphy.gif" 
        alt="Developer working" 
        className="w-64 h-64 mb-6 rounded-lg shadow-lg"
      />
      <h1 className="text-4xl font-bold mb-1">Inicio</h1>
      <p className="text-lg text-gray-500">Actualmente estoy trabajando sobre esta sección. Aca se podran ver estadisticas y metricas de tu negocio.</p>
      
    </div>
  )
}

export default WorkComponent
