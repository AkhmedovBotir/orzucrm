import { Link } from 'react-router-dom';
import { HomeIcon } from '@heroicons/react/24/outline';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-lg">
        {/* Animated 404 */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 blur-3xl opacity-20 animate-pulse" />
          <div className="relative">
            <div className="text-center">
              <h1 className="text-[180px] font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 leading-none animate-gradient">
                404
              </h1>
              <div className="mt-2 space-y-2">
                <h2 className="text-3xl font-bold text-gray-900">
                  Sahifa topilmadi
                </h2>
                <p className="text-lg text-gray-600">
                  Kechirasiz, siz qidirayotgan sahifa mavjud emas
                </p>
              </div>
              
              {/* Animated decoration */}
              <div className="absolute top-0 left-0 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
              <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
              <div className="absolute bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />

              {/* Action button */}
              <div className="relative mt-8">
                <Link
                  to="/"
                  className="inline-flex items-center px-6 py-3 text-lg font-medium text-white transition-all duration-200 transform hover:scale-105 hover:shadow-lg rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500"
                >
                  <HomeIcon className="w-6 h-6 mr-2" />
                  Bosh sahifaga qaytish
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 8s linear infinite;
        }
      `}</style>
    </div>
  );
}
