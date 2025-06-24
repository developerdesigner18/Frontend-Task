'use server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { CONFIG } from '@/config';
import { PaginatedTodos, Todo } from '@/types';
import { authOptions } from '@/lib/auth';

export async function deleteTodo(id: string) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.accessToken) {
      throw new Error('Not authenticated');
    }

    const res = await fetch(`${CONFIG.BASE_URL}/api/todos/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    });

    if (!res.ok) {
      throw new Error('Failed to delete todo');
    }

    // Revalidate the page to reflect the changes
    revalidatePath('/');
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting todo:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to delete todo' 
    };
  }
}

export async function createTodo(formData: FormData) {
const session = await getServerSession(authOptions);
    const accessToken = session?.accessToken;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const file = formData.get('file') as File;

    if (!title?.trim()) {
        throw new Error('Title is required');
    }

    try {
        const submitData = new FormData();
        submitData.append('title', title);
        submitData.append('description', description || '');

        // Only append file if it's a valid PDF file
        if (file && file.size > 0 && file.type === 'application/pdf') {
            submitData.append('file', file);
        }

        const res = await fetch(`${CONFIG.BASE_URL}/api/todos`, {
            method: 'POST',
            body: submitData,
               headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || 'Failed to create todo');
        }

        redirect('/');
    } catch (error) {
        console.error('Error creating todo:', error);
        throw error;
    }
}

export async function updateTodo(id:string,formData: FormData) {
    const session = await getServerSession(authOptions);
    const accessToken = session?.accessToken;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const file = formData.get('file') as File;

    if (!title?.trim()) {
        throw new Error('Title is required');
    }

    try {
        const submitData = new FormData();
        submitData.append('title', title);
        submitData.append('description', description || '');

        if (file && file.size > 0 && file.type === 'application/pdf') {
            submitData.append('file', file);
        }

        const res = await fetch(`${CONFIG.BASE_URL}/api/todos/${id}?_method=PUT`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: submitData,
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || 'Failed to update todo');
        }

        console.log('Todo updated successfully');

        redirect('/');
    } catch (error) {
        console.error('Error updating todo:', error);
        throw error;
    }
}

export async function getTodoById(id: string): Promise<Todo | null> {
    const session = await getServerSession(authOptions);
    const accessToken = session?.accessToken;
    try {
        const res = await fetch(`${CONFIG.BASE_URL}/api/todos/${id}`, {
            cache: 'no-store',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (res.ok) {
            return await res.json().then((data) => data.data);
        }
        return null;
    } catch (error) {
        console.error('Error fetching todo:', error);
        return null;
    }
}

export async function getTodos(token: string,page:string): Promise<PaginatedTodos> {
  try {
    const res = await fetch(`${CONFIG.BASE_URL}/api/todos?per_page=10&page=${page}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`
      },
      cache: 'no-store',
    });
    if (!res.ok) {
      throw new Error('Failed to fetch todos');``
    }

    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching todos:', error);
    return {
    current_page: 1,
    data: [],
    first_page_url: '',
    from: 0,
    last_page: 1,
    last_page_url: '',
    links: [],
    next_page_url: null,
    path: '',
    per_page: 10,
    prev_page_url: null,
    to: 0,
    total: 0,
  };
  }
}
