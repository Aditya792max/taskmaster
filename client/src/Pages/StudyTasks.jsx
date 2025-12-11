import React, { useEffect, useState } from "react";
import "../Styles/StudyTasks.css";

function StudyTasks() {
     const [tasks, setTasks] = useState([]);
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState(null);

     // Form state
     const [title, setTitle] = useState("");
     const [description, setDescription] = useState("");
     const [priority, setPriority] = useState(3);
     const [status, setStatus] = useState(false); // checkbox — if checked it's created as completed
     const [submitting, setSubmitting] = useState(false);
     const [submitError, setSubmitError] = useState(null);

     const GET_URL = "http://localhost:8080/getStudyTasks";
     const POST_URL = "http://localhost:8080/createStudyTask";
     const COMPLETE_URL_BASE = "http://localhost:8080/completeStudyTask"; // PUT /completeStudyTask/:id

     // Fetch tasks
     useEffect(() => {
          fetchTasks();
     }, []);

     async function fetchTasks() {
          setLoading(true);
          setError(null);
          try {
               const res = await fetch(GET_URL);
               if (!res.ok) throw new Error(`Server responded ${res.status}`);
               const data = await res.json();
               setTasks(Array.isArray(data) ? data : []);
          } catch (err) {
               setError(err.message || "Failed to fetch tasks");
          } finally {
               setLoading(false);
          }
     }

     // Submit handler for creating new study task
     async function handleSubmit(e) {
          e.preventDefault();
          setSubmitError(null);

          if (!title.trim() || !description.trim() || priority === "" || priority === null) {
               setSubmitError("Please fill all fields.");
               return;
          }

          const payload = {
               Title: title.trim(),
               Description: description.trim(),
               Status: !!status,
               Priority: Number(priority),
          };

          try {
               setSubmitting(true);
               const res = await fetch(POST_URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
               });

               if (!res.ok) {
                    const text = await res.text();
                    throw new Error(text || `Server error ${res.status}`);
               }

               const json = await res.json();
               // clear form
               setTitle("");
               setDescription("");
               setPriority(3);
               setStatus(false);

               // Refresh list
               await fetchTasks();
          } catch (err) {
               setSubmitError(err.message || "Failed to create task");
          } finally {
               setSubmitting(false);
          }
     }

     // Mark a task as completed (calls backend PUT)
     async function markCompleted(id) {
          // optimistic UI update: mark locally first
          const prev = tasks;
          setTasks((cur) => cur.map(t => (t._id === id ? { ...t, Status: true } : t)));

          try {
               const res = await fetch(`${COMPLETE_URL_BASE}/${id}`, {
                    method: "PUT",
               });
               if (!res.ok) {
                    const text = await res.text();
                    throw new Error(text || `Server responded ${res.status}`);
               }
               // re-fetch to be safe and get latest data (or rely on optimistic)
               await fetchTasks();
          } catch (err) {
               console.error("Error marking task complete:", err);
               // rollback optimistic change on error
               setTasks(prev);
               alert("Could not mark task as complete. Try again.");
          }
     }

     const pendingTasks = tasks.filter((t) => !t.Status);
     const completedTasks = tasks.filter((t) => t.Status);

     return (
          <div className="study-container">
               <h1 className="study-main-heading">Study Tasks</h1>

               <div className="study-layout">
                    {/* LEFT COLUMN - Form */}
                    <aside className="study-left">
                         <div className="form-card">
                              <h2 className="form-heading">Add New Task</h2>

                              <form onSubmit={handleSubmit} className="task-form">
                                   <label>
                                        <span>Title</span>
                                        <input
                                             type="text"
                                             value={title}
                                             onChange={(e) => setTitle(e.target.value)}
                                             placeholder="e.g. Complete DSA Sheet"
                                             required
                                        />
                                   </label>

                                   <label>
                                        <span>Description</span>
                                        <textarea
                                             value={description}
                                             onChange={(e) => setDescription(e.target.value)}
                                             placeholder="Describe the task (what to solve/study)..."
                                             rows={5}
                                             required
                                        />
                                   </label>

                                   <div className="form-row">
                                        <label>
                                             <span>Priority</span>
                                             <select value={priority} onChange={(e) => setPriority(e.target.value)} required>
                                                  <option value={1}>1 — High</option>
                                                  <option value={2}>2 — Medium</option>
                                                  <option value={3}>3 — Low</option>
                                             </select>
                                        </label>

                                        <label className="checkbox-label">
                                             <input
                                                  type="checkbox"
                                                  checked={status}
                                                  onChange={(e) => setStatus(e.target.checked)}
                                             />
                                             <span>Mark as completed</span>
                                        </label>
                                   </div>

                                   {submitError && <div className="form-error">{submitError}</div>}

                                   <button type="submit" className="btn-submit" disabled={submitting}>
                                        {submitting ? "Creating..." : "Create Task"}
                                   </button>
                              </form>
                         </div>
                    </aside>

                    {/* RIGHT COLUMN - Pending / Completed */}
                    <main className="study-right">
                         {/* Pending Tasks */}
                         <section className="tasks-section">
                              <h3 className="section-heading">Pending Tasks ({pendingTasks.length})</h3>

                              {loading ? (
                                   <div className="loader">Loading tasks…</div>
                              ) : error ? (
                                   <div className="error-box">Error: {error}</div>
                              ) : pendingTasks.length === 0 ? (
                                   <div className="empty">No pending tasks — nice!</div>
                              ) : (
                                   <div className="tasks-grid">
                                        {pendingTasks.map((t) => (
                                             <article key={t._id} className="task-card">
                                                  <div className="task-top">
                                                       <h4 className="task-title">{t.Title}</h4>
                                                       <div className={`priority p${t.Priority}`}>P{t.Priority}</div>
                                                  </div>
                                                  <p className="task-desc">{t.Description}</p>
                                                  <div className="task-meta">ID: <small>{t._id}</small></div>

                                                  {/* Button to mark complete */}
                                                  <button
                                                       className="btn-complete"
                                                       onClick={() => markCompleted(t._id)}
                                                  >
                                                       Mark as Complete
                                                  </button>
                                             </article>
                                        ))}
                                   </div>
                              )}
                         </section>

                         {/* Completed Tasks */}
                         <section className="tasks-section">
                              <h3 className="section-heading">Completed Tasks ({completedTasks.length})</h3>

                              {loading ? (
                                   <div className="loader">Loading tasks…</div>
                              ) : completedTasks.length === 0 ? (
                                   <div className="empty">No completed tasks yet.</div>
                              ) : (
                                   <div className="tasks-grid">
                                        {completedTasks.map((t) => (
                                             <article key={t._id} className="task-card done">
                                                  <div className="task-top">
                                                       <h4 className="task-title">{t.Title}</h4>
                                                       <div className={`priority p${t.Priority}`}>P{t.Priority}</div>
                                                  </div>
                                                  <p className="task-desc">{t.Description}</p>
                                                  <div className="task-meta">ID: <small>{t._id}</small></div>
                                             </article>
                                        ))}
                                   </div>
                              )}
                         </section>
                    </main>
               </div>
          </div>
     );
}

export default StudyTasks;