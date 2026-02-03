import Link from 'next/link';
import Navigation from '@/components/Navigation';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            🥋 BJJ Technique Tracker
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
            Track your Brazilian Jiu Jitsu progress by rating your proficiency 
            on hundreds of techniques. See your total score and identify areas to improve.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/techniques"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-lg transition-colors"
            >
              Browse Techniques
            </Link>
            <Link
              href="/auth/register"
              className="px-6 py-3 bg-gray-800 hover:bg-gray-900 text-white rounded-lg font-semibold text-lg transition-colors"
            >
              Create Account
            </Link>
          </div>
        </div>

        {/* Rating Scale */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Rating Scale
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { value: 0, label: "Don't know it" },
              { value: 1, label: 'Can execute on white belts' },
              { value: 2, label: 'Can execute on blue belts' },
              { value: 3, label: 'Can execute on purple belts' },
              { value: 4, label: 'Can execute on brown belts' },
              { value: 5, label: 'Can execute on black belts' },
              { value: 6, label: 'Competition black belt level' },
              { value: 7, label: 'World class level' },
            ].map((level) => (
              <div
                key={level.value}
                className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700"
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    level.value === 0 ? 'bg-gray-200 text-gray-900' :
                    level.value === 1 ? 'bg-white border-2 border-gray-300 text-gray-900' :
                    level.value === 2 ? 'bg-blue-500 text-white' :
                    level.value === 3 ? 'bg-purple-500 text-white' :
                    level.value === 4 ? 'bg-amber-700 text-white' :
                    level.value === 5 ? 'bg-gray-900 text-white' :
                    level.value === 6 ? 'bg-gray-900 ring-2 ring-yellow-400 text-white' :
                    'bg-gradient-to-r from-yellow-400 to-yellow-600'
                  }`}
                >
                  {level.value}
                </div>
                <span className="text-gray-700 dark:text-gray-200 text-sm">
                  {level.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Comprehensive Database
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Hundreds of techniques across all positions - guards, passes, sweeps, 
              submissions, and more.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Track Your Progress
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              See your total score, breakdown by position and type, and identify 
              gaps in your game.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Set Goals
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Identify techniques to focus on and track improvement over time 
              as you train.
            </p>
          </div>
        </div>

        {/* Positions Preview */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Positions Covered
          </h2>
          <div className="flex flex-wrap gap-2 justify-center">
            {[
              'Mount', 'Side Control', 'Back Control', 'Closed Guard', 
              'Half Guard', 'Butterfly Guard', 'De La Riva', 'Spider Guard',
              'X-Guard', 'Lasso Guard', '50/50', 'Standing', 'Turtle',
              'North-South', 'Knee on Belly', 'Leg Entanglement'
            ].map((position) => (
              <span
                key={position}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm text-gray-700 dark:text-gray-200"
              >
                {position}
              </span>
            ))}
          </div>
        </div>
      </main>

      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-gray-600 dark:text-gray-400">
          <p>🥋 BJJ Technique Tracker - Track your Jiu Jitsu journey</p>
        </div>
      </footer>
    </div>
  );
}
