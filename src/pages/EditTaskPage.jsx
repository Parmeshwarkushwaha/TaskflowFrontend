import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import api from '../services/api';
import Card from '../components/Card';

const priorities = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

const statuses = [
  { value: 'todo', label: 'To Do' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
];

function EditTaskPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await api.get('/tasks');
        const task = response.data.data.tasks.find((item) => item._id === id);
        if (!task) {
          navigate('/dashboard');
          return;
        }

        setValue('board', task.board?._id || '');
        setValue('title', task.title);
        setValue('description', task.description);
        setValue('priority', task.priority);
        setValue('status', task.status);
        setValue('dueDate', task.dueDate ? task.dueDate.split('T')[0] : '');
        setValue('estimatedEffort', task.estimatedEffort);
      } catch (err) {
        setError('Unable to load task.');
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id, navigate, setValue]);

  const onSubmit = async (values) => {
    setError('');
    try {
      await api.put(`/tasks/${id}`, values);
      navigate(`/boards/${values.board}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to update task.');
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading…</div>;
  }

  return (
    <Card className="mx-auto max-w-3xl space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.35em] text-sky-400">Edit task</p>
        <h2 className="mt-2 text-3xl font-semibold text-white">Update task details</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5">
        <div className="grid gap-3">
          <label className="text-sm text-slate-300" htmlFor="title">Title</label>
          <input
            id="title"
            {...register('title', { required: 'Task title is required.' })}
            className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100"
          />
          {errors.title && <p className="text-sm text-rose-400">{errors.title.message}</p>}
        </div>

        <div className="grid gap-3">
          <label className="text-sm text-slate-300" htmlFor="description">Description</label>
          <textarea
            id="description"
            rows="4"
            {...register('description')}
            className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-3">
            <label className="text-sm text-slate-300" htmlFor="priority">Priority</label>
            <select
              id="priority"
              {...register('priority')}
              className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100"
            >
              {priorities.map((item) => (
                <option key={item.value} value={item.value}>{item.label}</option>
              ))}
            </select>
          </div>

          <div className="grid gap-3">
            <label className="text-sm text-slate-300" htmlFor="status">Status</label>
            <select
              id="status"
              {...register('status')}
              className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100"
            >
              {statuses.map((item) => (
                <option key={item.value} value={item.value}>{item.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-3">
            <label className="text-sm text-slate-300" htmlFor="dueDate">Due date</label>
            <input
              id="dueDate"
              type="date"
              {...register('dueDate')}
              className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100"
            />
          </div>

          <div className="grid gap-3">
            <label className="text-sm text-slate-300" htmlFor="estimatedEffort">Estimated effort</label>
            <input
              id="estimatedEffort"
              type="number"
              step="0.5"
              min="0"
              {...register('estimatedEffort')}
              className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100"
            />
          </div>
        </div>

        {error && <p className="text-sm text-rose-400">{error}</p>}

        <button type="submit" className="rounded-full bg-sky-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400">
          Update task
        </button>
      </form>
    </Card>
  );
}

export default EditTaskPage;
