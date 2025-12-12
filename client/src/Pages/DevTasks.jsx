import React, { useEffect, useState } from "react";
import "../Styles/DevTasks.css";

function DevTasks() {
     const [tasks, setTasks] = useState([]);
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState(null);

     // Form state
     const [title, setTitle] = useState("");
     const [description, setDescription] = useState("");
     const [priority, setPriority] = useState(3);
     const [deadline, setDeadline] = useState("");
     const [status, setStatus] = useState(false);
     const [submitting, setSubmitting] = useState(false);
     const [submitError, setSubmitError] = useState(null);

     const GET_URL = "http://localhost:8080/getDevTasks";
     const POST_URL = "http://localhost:8080/createDevTask";
     const COMPLETE_URL = "http://localhost:8080/completeDevTask";

     useEffect(() => {
          fetchTasks();
     }, []);

     async function fetchTasks() {
          setLoading(true);
          try {
               const res = await fetch(GET_URL);
               const data = await res.json();
               setTasks(Array.isArray(data) ? data : []);
          } catch (err) {
               setError("Failed to load tasks");
          } finally {
               setLoading(false);
          }
     }

     async function handleSubmit(e) {
          e.preventDefault();
          setSubmitError(null);

          if (!title.trim() || !description.trim() || !deadline) {
               setSubmitError("Please fill all fields.");
               return;
          }

          const payload = {
               Title: title.trim(),
               Description: description.trim(),
               Status: status,
               Priority: Number(priority),
               deadline,
          };

          try {
               setSubmitting(true);

               const res = await fetch(POST_URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
               });

               if (!res.ok) throw new Error("Server error");

               // Clear form
               setTitle("");
               setDescription("");
               setPriority(3);
               setDeadline("");
               setStatus(false);

               await fetchTasks();
          } catch (err) {
               setSubmitError("Error creating task");
          } finally {
               setSubmitting(false);
          }
     }

     // Mark a task as completed
     async function markCompleted(id) {
          try {
               const res = await fetch(`${COMPLETE_URL}/${id}`, {
                    method: "PUT",
               });

               if (!res.ok) throw new Error("Error completing task");
               await fetchTasks();
          } catch (err) {
               alert("Could not mark task as complete.");
          }
     }

     const pendingTasks = tasks.filter((t) => !t.Status);
     const completedTasks = tasks.filter((t) => t.Status);

     return (
          <div className="dev-container">
               <h1 className="dev-main-heading">Dev Tasks</h1>

               <div className="dev-layout">
                    {/* FORM */}
                    <aside className="dev-left">
                         <div className="form-card">
                              <h2>Add New Dev Task</h2>

                              <form onSubmit={handleSubmit}>
                                   <label>
                                        <span>Title</span>
                                        <input
                                             type="text"
                                             value={title}
                                             onChange={(e) => setTitle(e.target.value)}
                                             placeholder="e.g. Create CRUD APIs @ Backend..."
                                             required
                                        />
                                   </label>

                                   <label>
                                        <span>Description</span>
                                        <textarea
                                             value={description}
                                             onChange={(e) => setDescription(e.target.value)}
                                             placeholder="Describe the task (what to code/debug)..."
                                             rows={5}
                                             required
                                        />
                                   </label>

                                   <label>
                                        <span>Deadline</span>
                                        <input
                                             type="date"
                                             value={deadline}
                                             onChange={(e) => setDeadline(e.target.value)}
                                             required
                                        />
                                   </label>

                                   <div className="form-row">
                                        <label>
                                             <span>Priority</span>
                                             <select
                                                  value={priority}
                                                  onChange={(e) => setPriority(e.target.value)}
                                             >
                                                  <option value={1}>1 — High</option>
                                                  <option value={2}>2 — Medium</option>
                                                  <option value={3}>3 — Low</option>
                                             </select>
                                        </label>

                                        <label>
                                             <input
                                                  type="checkbox"
                                                  checked={status}
                                                  onChange={(e) => setStatus(e.target.checked)}
                                             />
                                             <span>Completed</span>
                                        </label>
                                   </div>

                                   {submitError && (
                                        <p className="form-error">{submitError}</p>
                                   )}

                                   <button disabled={submitting}>
                                        {submitting ? "Creating..." : "Create Task"}
                                   </button>
                              </form>
                         </div>
                    </aside>

                    {/* RIGHT SECTION WITH CARDS */}
                    <main className="dev-right">

                         {/* PENDING TASKS */}
                         <section className="tasks-section">
                              <h3>Pending Tasks ({pendingTasks.length})</h3>

                              {loading ? (
                                   <p className="loader">Loading…</p>
                              ) : pendingTasks.length === 0 ? (
                                   <p className="empty">No pending tasks</p>
                              ) : (
                                   <div className="tasks-grid">
                                        {pendingTasks.map((t) => (
                                             <article key={t._id} className="task-card">
                                                  <div className="task-top">
                                                       <h4>{t.Title}</h4>
                                                       <div className={`priority p${t.Priority}`}>
                                                            P{t.Priority}
                                                       </div>
                                                  </div>

                                                  <p>{t.Description}</p>
                                                  <p className="task-meta">Deadline: {t.deadline}</p>

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

                         {/* COMPLETED TASKS */}
                         <section className="tasks-section">
                              <h3>Completed Tasks ({completedTasks.length})</h3>

                              {loading ? (
                                   <p className="loader">Loading…</p>
                              ) : completedTasks.length === 0 ? (
                                   <p className="empty">No completed tasks yet</p>
                              ) : (
                                   <div className="tasks-grid">
                                        {completedTasks.map((t) => (
                                             <article key={t._id} className="task-card done">
                                                  <div className="task-top">
                                                       <h4>{t.Title}</h4>
                                                       <div className={`priority p${t.Priority}`}>
                                                            P{t.Priority}
                                                       </div>
                                                  </div>

                                                  <p>{t.Description}</p>
                                                  <p className="task-meta">Deadline: {t.deadline}</p>
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

export default DevTasks;