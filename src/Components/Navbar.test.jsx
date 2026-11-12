import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { CartProvider } from '../Context/CartContext'
import { PRODUCTOS } from '../Data/Productos'
import Navbar from './Navbar'

const renderNavbar = (props = {}) => {
  const onLogout = props.onLogout ?? vi.fn()
  render(
    <CartProvider>
      <MemoryRouter>
        <Navbar currentUser={null} {...props} onLogout={onLogout} />
      </MemoryRouter>
    </CartProvider>
  )
  return onLogout
}

describe('Navbar - Sesión', () => {
  it('muestra "Iniciar sesión" cuando no hay usuario', () => {
    renderNavbar()

    expect(screen.getByRole('link', { name: 'Iniciar sesión' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Salir/ })).not.toBeInTheDocument()
  })

  it('muestra un saludo con el primer nombre del usuario y el botón de salida', () => {
    renderNavbar({ currentUser: { nombre: 'Benjamin Castro' } })

    expect(
      screen.getByRole('button', { name: 'Hola, Benjamin (Salir)' })
    ).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Iniciar sesión' })).not.toBeInTheDocument()
  })

  it('usa "Usuario" si el usuario no tiene nombre', () => {
    renderNavbar({ currentUser: {} })

    expect(
      screen.getByRole('button', { name: 'Hola, Usuario (Salir)' })
    ).toBeInTheDocument()
  })

  it('ejecuta onLogout al pulsar el saludo', () => {
    const onLogout = renderNavbar({
      currentUser: { nombre: 'Ana Pérez' },
      onLogout: vi.fn(),
    })

    fireEvent.click(screen.getByRole('button', { name: 'Hola, Ana (Salir)' }))

    expect(onLogout).toHaveBeenCalledTimes(1)
  })
})

describe('Navbar - Contenido general', () => {
  it('muestra los enlaces principales (Inicio, Productos, Admin, Carrito)', () => {
    renderNavbar()

    expect(screen.getByRole('link', { name: 'Inicio' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Productos/ })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Admin/ })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Cart \(/ })).toBeInTheDocument()
  })

  it('muestra la cantidad de productos del carrito', () => {
    localStorage.setItem(
      'cart_items',
      JSON.stringify([
        { ...PRODUCTOS[0], cantidad: 2 },
        { ...PRODUCTOS[1], cantidad: 1 },
      ])
    )
    renderNavbar()

    expect(document.getElementById('cart-count')).toHaveTextContent('3')
  })

  it('muestra 0 en el contador cuando el carrito está vacío', () => {
    renderNavbar()

    expect(document.getElementById('cart-count')).toHaveTextContent('0')
  })
})
