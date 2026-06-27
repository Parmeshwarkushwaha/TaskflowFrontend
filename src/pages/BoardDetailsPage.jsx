import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../services/api';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

const statusColumns = [
  { id: 'todo', label: 'To Do' },
  { id: 'in-progress', label: 'In Progress' },
  { id: 'done', label: 'Done' },
];

const priorityStyles = {
  low: 'bg-emerald-500 text-slate-950',
  medium: 'bg-amber-400 text-slate-950',
  high: 'bg-rose-500 text-white',
};

function BoardDetailsPage() {
  const { id } = useParams();
  const [board, setBoard] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBoardAndTasks = async () => {
      try {
        const [boardResponse, taskResponse] = await Promise.all([
          api.get('/boards'),
          api.get('/tasks'),
        ]);

        const foundBoard = boardResponse.data.data.boards.find((item) => item._id === id);
        setBoard(foundBoard || null);
        setTasks(taskResponse.data.data.tasks.filter((task) => task.board?._id === id));
      } catch (err) {
        setError('Unable to load board details.');
      } finally {
        setLoading(false);
      }
    };

    fetchBoardAndTasks();
  }, [id]);

  const groupedTasks = useMemo(
    () => statusColumns.reduce((groups, column) => {
      groups[column.id] = tasks.filter((task) => task.status === column.id);
      return groups;
    }, {}),
    [tasks],
  );

  const updateStatus = async (taskId, status) => {
    try {
      const response = await api.patch(`/tasks/${taskId}/status`, { status });
      setTasks((current) => current.map((task) => (task._id === taskId ? response.data.data.task : task)));
    } catch {
      setError('Unable to update task status.');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks((current) => current.filter((task) => task._id !== taskId));
    } catch {
      setError('Unable to remove task.');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!board) {
    return (
      <EmptyState
        title="Board unavailable"
        description="That board could not be found."
        action={(
          <Link to="/dashboard" className="rounded-full bg-slate-800 px-5 py-3 text-sm text-slate-100 transition hover:bg-slate-700">
            Go back
          </Link>
        )}
      />
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-sky-400">Board</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">{board.title}</h1>
          <p className="mt-2 text-slate-400">{board.description || 'No description provided.'}</p>
        </div>
        <Link to="/tasks/new" className="rounded-full bg-sky-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400">
          Add task
        </Link>
      </div>

      {error && <p className="text-sm text-rose-400">{error}</p>}

      <div className="grid gap-5 xl:grid-cols-3">
        {statusColumns.map((column) => (
          <div key={column.id} className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5">
            <h2 className="mb-5 text-lg font-semibold text-white">{column.label}</h2>
            {groupedTasks[column.id].length === 0 ? (
              <p className="text-sm text-slate-500">No tasks yet.</p>
            ) : (
              <div className="space-y-4">
                {groupedTasks[column.id].map((task) => (
                  <div key={task._id} className="rounded-3xl border border-slate-800 bg-slate-950 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-base font-semibold text-white">{task.title}</h3>
                        <p className="mt-2 text-sm text-slate-400">{task.description || 'No description available.'}</p>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${priorityStyles[task.priority]}`}>
                        {task.priority}
                      </span>
                    </div>
                    <div className="mt-4 flex flex-col gap-3 text-sm text-slate-400">
                      <p>Due {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'Not set'}</p>
                      <p>Effort {task.estimatedEffort ?? 'N/A'} hrs</p>
                    </div>
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => updateStatus(task._id, column.id === 'todo' ? 'in-progress' : column.id === 'in-progress' ? 'done' : 'todo')}
                        className="rounded-full bg-slate-800 px-3 py-2 text-xs text-slate-100 transition hover:bg-slate-700"
                      >
                        Move
                      </button>
                      <Link
                        to={`/tasks/${task._id}/edit`}
                        className="rounded-full bg-slate-800 px-3 py-2 text-xs text-slate-100 transition hover:bg-slate-700"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDeleteTask(task._id)}
                        className="rounded-full bg-rose-500 px-3 py-2 text-xs text-white transition hover:bg-rose-400"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default BoardDetailsPage;
