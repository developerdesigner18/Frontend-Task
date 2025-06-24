import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { getTodoById, updateTodo } from '@/actions/TodoActions';
import AddTodoForm from '@/components/AddTodo/AddTodoForm';
import { authOptions } from '@/lib/auth';

interface EditTodoPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function EditTodoPage({ params }: EditTodoPageProps) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) notFound();
    
    const { id } = await params;
    const todo = await getTodoById(id);
    
    if (!todo) notFound();
    
    const handleSubmit = async (formData: FormData) => {
        'use server';
        await updateTodo(id, formData);
    };
    
    return (
        <AddTodoForm
            defaultValues={{
                id: todo.id,
                title: todo.title,
                description: todo.description,
                fileUrl: todo.file_path || undefined,
            }}
            onSubmit={handleSubmit}
        />
    );
}