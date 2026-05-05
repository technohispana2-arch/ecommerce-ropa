/**
 * Componente de pie de página
 * Enlaces, información de contacto, copyright
 */
export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">ModaStyle</h3>
            <p className="text-gray-300 text-sm">
              Tu tienda de ropa favorita. Encuentra las mejores prendas al mejor precio.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Enlaces</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="/" className="hover:text-white">Inicio</a></li>
              <li><a href="/shop" className="hover:text-white">Tienda</a></li>
              <li><a href="/cart" className="hover:text-white">Carrito</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contacto</h4>
            <p className="text-sm text-gray-300">
              Email: info@modastyle.com<br />
              Tel: +34 123 456 789<br />
              Dirección: Calle Fashion 123, Madrid
            </p>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-4 text-center text-sm text-gray-400">
          © 2026 ModaStyle. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
