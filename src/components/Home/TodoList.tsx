'use client';
import { useState, useTransition } from 'react';
import Link from 'next/link';
import { PaginatedTodos, Todo } from '@/types';
import { deleteTodo } from '@/actions/TodoActions';
import Button from '../ui/Button';
import Pagination from '../common/Pagination';

interface TodoListProps {
  paginatedTodos: PaginatedTodos;
}

export default function TodoList({ paginatedTodos }: TodoListProps) {
    const [todos, setTodos] = useState<Todo[]>(paginatedTodos.data);
    const [isPending, startTransition] = useTransition();
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const handleDelete = async (id: string): Promise<void> => {
        if (!confirm('Are you sure you want to delete this todo?')) return;

        setDeletingId(id);
        
        startTransition(async () => {
            try {
                const result = await deleteTodo(id);
                
                if (result.success) {
                    // Optimistically update the UI
                    setTodos(todos.filter(todo => todo.id !== id));
                } else {
                    alert(result.error || 'Failed to delete todo');
                }
            } catch (error) {
                console.error('Error deleting todo:', error);
                alert('Error deleting todo');
            } finally {
                setDeletingId(null);
            }
        });
    };

    const handleViewPdf = (fileUrl?: string): void => {
        if (fileUrl) {
            window.open(fileUrl, '_blank');
        }
    };

    if (todos.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500 text-lg mb-4">No todos found</p>
                <Link
                    href="/add"
                    className="text-blue-500 hover:text-blue-600 underline"
                >
                    Create your first todo
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {todos.map((todo) => (
                <div key={todo.id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                    <div className="flex justify-between items-start mb-3">
                        <h3 className="text-xl font-semibold text-gray-800">{todo.title}</h3>
                        <div className="flex space-x-2">
                            <Link
                                href={`/edit/${todo.id}`}
                                className=""
                            >
                                <Button className='!px-3 !py-1 cursor-pointer '>
Edit
                                </Button>
                                
                            </Link>
                            <Button
                                onClick={() => handleDelete(todo.id)}
                                disabled={isPending || deletingId === todo.id}
                                variant='danger'
                                className=" text-white !px-3 !py-1 cursor-pointer "
                            >
                                {deletingId === todo.id ? 'Deleting...' : 'Delete'}
                            </Button>
                        </div>
                    </div>

                    {todo.description && (
                        <p className="text-gray-600 mb-4">{todo.description}</p>
                    )}

                    {todo.file_path && (
                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-500">PDF Attachment:</span>
                            <Button
                                onClick={() => handleViewPdf(todo.file_path)}
                                variant='success'
                                className="!px-3 !py-1 !text-sm cursor-pointer"
                            >
                                View PDF
                            </Button>
                        </div>
                    )}
                </div>
            ))}

              <Pagination
        currentPage={paginatedTodos.current_page}
        lastPage={paginatedTodos.last_page}
        total={paginatedTodos.total}
        perPage={paginatedTodos.per_page}
        from={paginatedTodos.from}
        to={paginatedTodos.to}
      />
        </div>
    );
}