import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { createTodo } from '@/actions/TodoActions';
import AddTodoForm from '@/components/AddTodo/AddTodoForm';
import { authOptions } from '@/lib/auth';

export default async function AddTodoPage() {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect('/auth/signin')
    }
    return (
        <div className="container mx-auto px-4 py-8">
            <AddTodoForm onSubmit={createTodo} />
        </div>
    );
}