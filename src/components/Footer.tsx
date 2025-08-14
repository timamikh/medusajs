const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
        <nav className="-mx-5 -my-2 flex flex-wrap justify-center" aria-label="Footer">
          <div className="px-5 py-2">
            <a href="#" className="text-base text-gray-300 hover:text-white">
              About
            </a>
          </div>
          <div className="px-5 py-2">
            <a href="#" className="text-base text-gray-300 hover:text-white">
              Contact
            </a>
          </div>
          <div className="px-5 py-2">
            <a href="#" className="text-base text-gray-300 hover:text-white">
              Terms
            </a>
          </div>
          <div className="px-5 py-2">
            <a href="#" className="text-base text-gray-300 hover:text-white">
              Privacy
            </a>
          </div>
        </nav>
        <p className="mt-8 text-center text-base text-gray-400">
          &copy; {new Date().getFullYear()} Medusa Store. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer
