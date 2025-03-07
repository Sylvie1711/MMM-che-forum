export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-800 text-white p-6 mt-auto">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold">CHE MMMUT Forum</h3>
            <p className="text-gray-300 mt-2">A place for Chemical Engineering students to discuss and share knowledge</p>
          </div>
          
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6">
            <a href="#" className="text-gray-300 hover:text-white">About</a>
            <a href="#" className="text-gray-300 hover:text-white">Privacy Policy</a>
            <a href="#" className="text-gray-300 hover:text-white">Terms of Service</a>
            <a href="mailto:saket.cs33@gmail.com" className="text-gray-300 hover:text-white">Contact</a>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-6 pt-6 text-center text-gray-400">
          <p>&copy; {currentYear} CHE MMMUT Forum. All rights reserved.</p>
          <p className="mt-2">Contact us: <a href="mailto:saket.cs33@gmail.com" className="hover:text-white">saket.cs33@gmail.com</a></p>
        </div>
      </div>
    </footer>
  );
} 