'use client'

import React, { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { ListChecks } from 'lucide-react'

interface Task {
    id: number;
    label: string;
    status: string;
    color: string;
}

export function PreparednessTasks() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const res = await fetch('/api/admin/tasks');
                const json = await res.json();
                if (json.success) {
                    setTasks(json.data);
                }
            } catch (err) {
                console.error('Failed to fetch admin tasks:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
        const interval = setInterval(fetchTasks, 60000); // Refresh every minute
        return () => clearInterval(interval);
    }, []);

    return (
        <Card className="p-6 border border-slate-100 shadow-sm rounded-2xl bg-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none">
                <ListChecks className="w-24 h-24 rotate-12" />
            </div>

            <h3 className="text-xl font-bold text-slate-900 mb-6 relative z-10">Post-Event & Recovery Tasks</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 relative z-10">Pending Items</p>

            <div className="space-y-2 relative z-10">
                {loading ? (
                    [1, 2, 3, 4].map(i => <Skeleton key={i} className="h-14 w-full rounded-xl" />)
                ) : (
                    tasks.map((task) => (
                        <div key={task.id} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                            <span className="text-sm font-medium text-slate-600">{task.label}</span>
                            <div className={cn("px-3 py-1 rounded-full", task.color)}>
                                <span className="text-[10px] font-black uppercase tracking-tight">{task.status}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </Card>
    )
}
