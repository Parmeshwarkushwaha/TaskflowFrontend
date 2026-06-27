import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

function CreateTaskPage() {
  const navigate = useNavigate();
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState('');
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({ defaultValues: { priority: 'medium', status: 'todo' } });

  const title = watch('title');
  const description = watch('description');

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const response = await api.get('/boards');
        setBoards(response.data.data.boards);
      } catch (err) {
        setError('Unable to load boards.');
      } finally {
        setLoading(false);
      }
    };

    fetchBoards();
  }, []);

  const handleAiSuggestion = async () => {
    if (!title) return;
    setAiLoading(true);
    setError('');

    try {
      const response = await api.post('/ai/suggest', { title, description });
      const { effort, dueDate } = response.data.data;
      setValue('estimatedEffort', effort);
      setValue('dueDate', dueDate);
    } catch {
      setError('AI suggestion could not be retrieved.');
    } finally {
      setAiLoading(false);
    }
  };

  const onSubmit = async (values) => {
    setError('');
    try {
      await api.post('/tasks', values);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to create task.');
    }
  };

  return (
    <div className="space-y-8">
      <Card className="space-y-6">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-sky-400">New task</p>
          <h2 className="mt-2 text-3xl font-semibold text-white">Plan your next task</h2>
        </div>

        {loading ? (
          <p className="text-slate-400">Loading boards…</p>
        ) : boards.length === 0 ? (
          <p className="text-slate-400">Create a board first to add tasks.</p>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5">
            <div className="grid gap-3">
              <label className="text-sm text-slate-300" htmlFor="board">Board</label>
              <select
                id="board"
                {...register('board', { required: 'Board selection is required.' })}
                className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100"
              >
                <option value="">Select board</option>
                {boards.map((board) => (
                  <option key={board._id} value={board._id}>{board.title}</option>
                ))}
              </select>
              {errors.board && <p className="text-sm text-rose-400">{errors.board.message}</p>}
            </div>

            <div className="grid gap-3">
              <label className="text-sm text-slate-300" htmlFor="title">Title</label>
              <input
                id="title"
                {...register('title', { required: 'Task title is required.' })}
                className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100"
              />
              {errors.title && <p className="text-sm text-rose-400">{errors.title.message}</p>}
            </div>

            <div className="grid gap-3">
              <label className="text-sm text-slate-300" htmlFor="description">Description</label>
              <textarea
                id="description"
                rows="4"
                {...register('description')}
                className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100"
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

            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleAiSuggestion}
                disabled={!title || aiLoading}
                className="rounded-full bg-slate-800 px-5 py-3 text-sm text-slate-100 transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {aiLoading ? 'Suggesting…' : 'Suggest estimate'}
              </button>
              <button
                type="submit"
                className="rounded-full bg-sky-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400"
              >
                Create task
              </button>
            </div>

            {error && <p className="text-sm text-rose-400">{error}</p>}
          </form>
        )}
      </Card>
    </div>
  );
}

export default CreateTaskPage;
