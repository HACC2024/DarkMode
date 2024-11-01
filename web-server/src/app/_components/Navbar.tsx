export default function Navbar() {
  return (
    <nav className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between border-b border-gray-200 bg-white p-4 text-xl">
      <div className="flex space-x-6">
        <a href="/" className={`text-xl font-bold hover:text-blue-600`}>
          Home
        </a>
        <a href="/device" className={`text-xl font-bold hover:text-blue-600`}>
          Device
        </a>
        <a href="/chat" className={`text-xl font-bold hover:text-blue-600`}>
          Chat
        </a>
      </div>
    </nav>
  );
}
