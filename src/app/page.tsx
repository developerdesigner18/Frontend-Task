import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { getTodos } from '@/actions/TodoActions';
import Button from '@/components/ui/Button';
import { Plus, CheckSquare, User, LogOut } from 'lucide-react';
import TodoList from '@/components/Home/TodoList';
import { authOptions } from '@/lib/auth';

interface HomePageProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const session = await getServerSession(authOptions);

  if (!session || !session?.accessToken) {
    redirect('/auth/signin');
  }

  const { page = '1' } = await searchParams;
  const todos = await getTodos(session.accessToken, page);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Background decoration */}
        <div className="fixed -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full opacity-10 animate-pulse pointer-events-none"></div>
        <div className="fixed -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-500 to-blue-700 rounded-full opacity-10 animate-pulse delay-1000 pointer-events-none"></div>
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-blue-300 to-purple-500 rounded-full opacity-5 pointer-events-none animate-pulse delay-500"></div>

      <div className="relative">
        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Welcome Section */}
            <div className="mb-8">
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8">
                <div className="text-center">
                  <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
                    Welcome back, {session.user?.name?.split(' ')[0]}! 👋
                  </h2>
                  <p className="text-lg text-gray-600 mb-6">
                    Ready to tackle your tasks? Let's make today productive!
                  </p>
                </div>
              </div>
            </div>

            {/* Todo List Section */}
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
              {/* Section Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="inline-flex items-center justify-center w-10 h-10 bg-white/20 rounded-xl mr-4">
                      <CheckSquare className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">Your Tasks</h3>
                      <p className="text-blue-100 text-sm">Manage and track your daily activities</p>
                    </div>
                  </div>
                  
                  <Link href="/add" className="md:hidden">
                    <Button variant="secondary" size="sm" className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                      <Plus className="w-4 h-4 mr-2" />
                      Add
                    </Button>
                  </Link>
                </div>
              </div>
                <div className="flex justify-end px-8 mt-4">
  <Link href="/add" className='pb-8'>
    <Button variant="primary" size="lg" className="shadow-lg cursor-pointer ">
      <Plus className="w-5 h-5 mr-2" />
      Add Todo
    </Button>
  </Link>
</div>

              {/* Todo List Content */}
              <div className="pb-8">
          
                {todos && todos.data.length > 0 ? (
                  <TodoList paginatedTodos={todos} />
                ) : (
                  <div className="text-center py-16">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl mb-6">
                      <CheckSquare className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">No tasks yet</h3>
                    <p className="text-gray-600 mb-8 max-w-md mx-auto">
                      Start your productivity journey by creating your first task. 
                      Every great achievement begins with a single step!
                    </p>
                    <Link href="/add">
                      <Button variant="primary" size="lg" className="shadow-lg">
                        <Plus className="w-5 h-5 mr-2" />
                        Create Your First Task
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="text-center mt-8">
              <p className="text-sm text-gray-500">
                Stay productive, stay focused. You've got this! 💪
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}