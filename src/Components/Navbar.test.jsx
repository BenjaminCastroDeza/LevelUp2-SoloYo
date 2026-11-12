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
    expect(screen.getByRole('button', { name: /Cart \(/ })).toBeInTheDocument()
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

  it('al pulsar el botón del carrito abre un menú desplegable con productos y botón para ir al carrito', () => {
    localStorage.setItem(
      'cart_items',
      JSON.stringify([{ ...PRODUCTOS[0], cantidad: 2 }])
    )
    renderNavbar()

    const cartBtn = screen.getByRole('button', { name: /Cart \(/ })
    fireEvent.click(cartBtn)

    expect(screen.getByText(PRODUCTOS[0].nombre)).toBeInTheDocument()
    expect(screen.getByText(/2 x/)).toBeInTheDocument()

    const linkCarrito = screen.getByRole('link', { name: /Ir a la página del carrito/i })
    expect(linkCarrito).toBeInTheDocument()
    expect(linkCarrito).toHaveAttribute('href', '/carrito')
  })

  it('muestra mensaje de carrito vacío en el desplegable cuando no hay artículos', () => {
    renderNavbar()

    const cartBtn = screen.getByRole('button', { name: /Cart \(/ })
    fireEvent.click(cartBtn)

    expect(screen.getByText(/Tu carrito está vacío/i)).toBeInTheDocument()
  })

  it('renderiza la barra de búsqueda y permite buscar productos', () => {
    renderNavbar()

    const searchInput = screen.getByRole('searchbox', { name: /Buscar productos/i })
    expect(searchInput).toBeInTheDocument()

    fireEvent.change(searchInput, { target: { value: 'teclado' } })
    expect(searchInput).toHaveValue('teclado')

    const clearButton = screen.getByRole('button', { name: /Limpiar búsqueda/i })
    expect(clearButton).toBeInTheDocument()

    fireEvent.click(clearButton)
    expect(searchInput).toHaveValue('')
  })
})
