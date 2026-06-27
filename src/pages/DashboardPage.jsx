import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

function DashboardPage() {
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [creating, setCreating] = useState(false);

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

  const handleCreateBoard = async (event) => {
    event.preventDefault();
    setCreating(true);
    setError('');

    try {
      const response = await api.post('/boards', { title, description });
      setBoards((current) => [response.data.data.board, ...current]);
      setTitle('');
      setDescription('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create board.');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
        <Card className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-sky-400">Dashboard</p>
              <h2 className="mt-2 text-3xl font-semibold text-white">Your boards</h2>
            </div>
            <Link to="/tasks/new" className="rounded-full bg-slate-800 px-4 py-2 text-sm text-slate-100 transition hover:bg-slate-700">
              New task
            </Link>
          </div>

          {error && <p className="text-sm text-rose-400">{error}</p>}

          <form onSubmit={handleCreateBoard} className="grid gap-4">
            <div className="grid gap-2">
              <label className="text-sm text-slate-300" htmlFor="boardTitle">Board title</label>
              <input
                id="boardTitle"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100"
                placeholder="Example: Product Launch"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm text-slate-300" htmlFor="boardDescription">Description</label>
              <textarea
                id="boardDescription"
                rows="3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100"
                placeholder="Optional board description"
              />
            </div>
            <button
              type="submit"
              disabled={creating}
              className="inline-flex items-center justify-center rounded-full bg-sky-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {creating ? 'Creating board…' : 'Create board'}
            </button>
          </form>
        </Card>

        <Card className="space-y-4">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-sky-400">Quick start</p>
            <h3 className="mt-2 text-xl font-semibold text-white">Organize work with boards</h3>
          </div>
          <p className="text-slate-400">
            Create boards and tasks, then move cards through the workflow. Use AI suggestions to estimate effort quickly.
          </p>
        </Card>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : boards.length === 0 ? (
        <EmptyState
          title="No boards yet"
          description="Create your first board to structure tasks and plans."
          action={(
            <button
              type="button"
              onClick={() => document.getElementById('boardTitle')?.focus()}
              className="rounded-full bg-slate-800 px-5 py-3 text-sm text-slate-100 transition hover:bg-slate-700"
            >
              Start board
            </button>
          )}
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {boards.map((board) => (
            <Link key={board._id} to={`/boards/${board._id}`} className="group rounded-3xl border border-slate-800 bg-slate-900/80 p-6 transition hover:border-sky-400">
              <div className="mb-4 flex items-center justify-between gap-2">
                <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Board</p>
                <span className="rounded-full bg-slate-800 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-300">Open</span>
              </div>
              <h3 className="text-xl font-semibold text-white group-hover:text-sky-300">{board.title}</h3>
              <p className="mt-4 text-sm leading-6 text-slate-400">{board.description || 'No description yet.'}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default DashboardPage;
