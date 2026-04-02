/**
 * ═══════════════════════════════════════════════════════════════════════════
 * MAHAM EXPO — HR Attendance & Time Tracking System
 * ═══════════════════════════════════════════════════════════════════════════
 * Attendance tracking: check-in/out, overtime, late arrivals, absence
 * management, biometric integration, geolocation, shift management
 * ═══════════════════════════════════════════════════════════════════════════
 */
import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Clock, Search, CheckCircle2, XCircle, AlertTriangle, MapPin,
  Calendar, Users, TrendingUp, BarChart3, Filter, Eye, Timer,
  LogIn, LogOut, Fingerprint, Wifi, Smartphone
} from 'lucide-react'
import { cn, formatDate } from '@/lib/utils'
import { EmployeeAvatar, MiniProgress, MetricBox, ActionButton, EmptyState, SectionCard } from './HrShared'
import type { AttendanceRecord } from '../hrTypes'
import { attendanceStatusLabels } from '../hrTypes'

interface HrAttendanceProps {
  records: AttendanceRecord[]
}

export default function HrAttendance({ records }: HrAttendanceProps) {
  const [search, setSearch] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [viewMode, setViewMode] = useState<'daily' | 'summary'>('daily')

  const filtered = useMemo(() => {
    return records.filter(r => {
      const matchSearch = !search || r.employee_name.includes(search) || r.department.includes(search)
      const matchDate = !dateFilter || r.date === dateFilter
      const matchStatus = statusFilter === 'all' || r.status === statusFilter
      return matchSearch && matchDate && matchStatus
    })
  }, [records, search, dateFilter, statusFilter])

  const statusColors: Record<string, string> = {
    present: 'bg-success/10 text-success border-success/20',
    absent: 'bg-danger/10 text-danger border-danger/20',
    late: 'bg-warning/10 text-warning border-warning/20',
    early_leave: 'bg-info/10 text-info border-info/20',
    on_leave: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    remote: 'bg-gold/10 text-gold border-gold/20',
    holiday: 'bg-muted-foreground/10 text-muted-foreground border-muted-foreground/20'
  }

  // Stats
  const presentCount = filtered.filter(r => r.status === 'present').length
  const absentCount = filtered.filter(r => r.status === 'absent').length
  const lateCount = filtered.filter(r => r.status === 'late').length
  const remoteCount = filtered.filter(r => r.status === 'remote').length
  const avgHours = filtered.length > 0 ? (filtered.reduce((s, r) => s + r.working_hours, 0) / filtered.length).toFixed(1) : '0'
  const totalOvertime = filtered.reduce((s, r) => s + r.overtime_hours, 0)

  // Employee summary (group by employee)
  const employeeSummary = useMemo(() => {
    const map = new Map<string, { name: string; dept: string; present: number; absent: number; late: number; totalHours: number; count: number }>()
    records.forEach(r => {
      const existing = map.get(r.employee_id) || { name: r.employee_name, dept: r.department, present: 0, absent: 0, late: 0, totalHours: 0, count: 0 }
      existing.count++
      existing.totalHours += r.working_hours
      if (r.status === 'present') existing.present++
      if (r.status === 'absent') existing.absent++
      if (r.status === 'late') existing.late++
      map.set(r.employee_id, existing)
    })
    return Array.from(map.entries()).map(([id, data]) => ({ id, ...data, avgHours: data.count > 0 ? data.totalHours / data.count : 0, attendanceRate: data.count > 0 ? Math.round(((data.present + data.late) / data.count) * 100) : 0 }))
  }, [records])

  return (
    <div className="space-y-4">
      {/* ─── KPI Stats ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
        <div className="glass-card p-3">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle2 size={14} className="text-success" />
            <span className="text-[10px] text-muted-foreground">حاضر</span>
          </div>
          <p className="text-lg font-bold font-mono text-foreground">{presentCount}</p>
        </div>
        <div className="glass-card p-3">
          <div className="flex items-center gap-2 mb-1">
            <XCircle size={14} className="text-danger" />
            <span className="text-[10px] text-muted-foreground">غائب</span>
          </div>
          <p className="text-lg font-bold font-mono text-foreground">{absentCount}</p>
        </div>
        <div className="glass-card p-3">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle size={14} className="text-warning" />
            <span className="text-[10px] text-muted-foreground">متأخر</span>
          </div>
          <p className="text-lg font-bold font-mono text-foreground">{lateCount}</p>
        </div>
        <div className="glass-card p-3">
          <div className="flex items-center gap-2 mb-1">
            <Wifi size={14} className="text-gold" />
            <span className="text-[10px] text-muted-foreground">عن بُعد</span>
          </div>
          <p className="text-lg font-bold font-mono text-foreground">{remoteCount}</p>
        </div>
        <div className="glass-card p-3">
          <div className="flex items-center gap-2 mb-1">
            <Timer size={14} className="text-info" />
            <span className="text-[10px] text-muted-foreground">متوسط الساعات</span>
          </div>
          <p className="text-lg font-bold font-mono text-foreground">{avgHours}h</p>
        </div>
        <div className="glass-card p-3">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={14} className="text-gold" />
            <span className="text-[10px] text-muted-foreground">ساعات إضافية</span>
          </div>
          <p className="text-lg font-bold font-mono text-foreground">{totalOvertime}h</p>
        </div>
      </div>

      {/* ─── View Toggle + Search ──────────────────────────────────────── */}
      <div className="glass-card p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex items-center bg-surface2/50 rounded-xl border border-border/30 overflow-hidden shrink-0">
            <button onClick={() => setViewMode('daily')}
              className={cn('h-9 px-4 text-xs transition-all', viewMode === 'daily' ? 'bg-gold/10 text-gold font-bold' : 'text-muted-foreground')}>
              سجل يومي
            </button>
            <button onClick={() => setViewMode('summary')}
              className={cn('h-9 px-4 text-xs transition-all', viewMode === 'summary' ? 'bg-gold/10 text-gold font-bold' : 'text-muted-foreground')}>
              ملخص الموظفين
            </button>
          </div>
          <div className="relative flex-1">
            <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input type="text" placeholder="بحث بالاسم أو القسم..."
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-full h-9 pr-9 pl-3 rounded-xl bg-surface2/50 border border-border/30 text-xs text-foreground placeholder:text-muted-foreground/50 focus:border-gold/50 outline-none" />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)}
              className="h-9 px-3 rounded-xl bg-surface2/50 border border-border/30 text-xs text-foreground outline-none" />
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
              className="h-9 px-3 rounded-xl bg-surface2/50 border border-border/30 text-xs text-foreground outline-none">
              <option value="all">كل الحالات</option>
              {Object.entries(attendanceStatusLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* ─── Daily View ────────────────────────────────────────────────── */}
      {viewMode === 'daily' && (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="border-b border-border/20">
                  {['الموظف', 'القسم', 'التاريخ', 'الدخول', 'الخروج', 'الساعات', 'إضافي', 'الحالة', 'الطريقة', 'الموقع'].map(h => (
                    <th key={h} className="p-3 text-right text-[10px] font-bold text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.slice(0, 50).map(record => (
                  <tr key={record.id} className="border-b border-border/10 hover:bg-surface2/20 transition-colors">
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <EmployeeAvatar name={record.employee_name} size="sm" />
                        <p className="text-xs font-medium text-foreground">{record.employee_name}</p>
                      </div>
                    </td>
                    <td className="p-3 text-[11px] text-muted-foreground">{record.department}</td>
                    <td className="p-3 text-[11px] text-muted-foreground">{formatDate(record.date)}</td>
                    <td className="p-3">
                      <span className="text-[11px] font-mono text-success flex items-center gap-1">
                        <LogIn size={10} /> {record.check_in || '—'}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="text-[11px] font-mono text-danger flex items-center gap-1">
                        <LogOut size={10} /> {record.check_out || '—'}
                      </span>
                    </td>
                    <td className="p-3 text-[11px] font-mono text-foreground">{record.working_hours}h</td>
                    <td className="p-3 text-[11px] font-mono text-gold">{record.overtime_hours > 0 ? `+${record.overtime_hours}h` : '—'}</td>
                    <td className="p-3">
                      <span className={cn('text-[9px] px-2 py-0.5 rounded-full border', statusColors[record.status])}>
                        {attendanceStatusLabels[record.status]}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                        {record.method === 'biometric' && <><Fingerprint size={10} /> بصمة</>}
                        {record.method === 'mobile' && <><Smartphone size={10} /> جوال</>}
                        {record.method === 'web' && <><Wifi size={10} /> ويب</>}
                        {record.method === 'manual' && <><Users size={10} /> يدوي</>}
                      </span>
                    </td>
                    <td className="p-3">
                      {record.location && (
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <MapPin size={10} /> {record.location}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── Summary View ──────────────────────────────────────────────── */}
      {viewMode === 'summary' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {employeeSummary.map(emp => (
            <motion.div key={emp.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="glass-card p-3 sm:p-4 hover:border-gold/20 transition-all">
              <div className="flex items-center gap-3 mb-3">
                <EmployeeAvatar name={emp.name} size="md" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-foreground truncate">{emp.name}</p>
                  <p className="text-[10px] text-muted-foreground">{emp.dept}</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold font-mono text-gold">{emp.attendanceRate}%</p>
                  <p className="text-[8px] text-muted-foreground">نسبة الحضور</p>
                </div>
              </div>
              <MiniProgress value={emp.attendanceRate} color={emp.attendanceRate >= 90 ? 'success' : emp.attendanceRate >= 75 ? 'gold' : 'danger'} size="sm" />
              <div className="grid grid-cols-3 gap-1.5 mt-3">
                <MetricBox label="حاضر" value={emp.present} color="success" />
                <MetricBox label="غائب" value={emp.absent} color="danger" />
                <MetricBox label="متأخر" value={emp.late} color="warning" />
              </div>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/10">
                <span className="text-[9px] text-muted-foreground">متوسط الساعات: {emp.avgHours.toFixed(1)}h</span>
                <span className="text-[9px] text-muted-foreground">إجمالي الأيام: {emp.count}</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* ─── Integration Methods ───────────────────────────────────────── */}
      <SectionCard title="طرق تسجيل الحضور المدعومة" icon={Fingerprint}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { icon: Fingerprint, label: 'البصمة البيومترية', desc: 'ZKTeco / Hikvision', status: 'متصل' },
            { icon: Smartphone, label: 'تطبيق الجوال', desc: 'GPS + Face ID', status: 'متصل' },
            { icon: Wifi, label: 'تسجيل عن بُعد', desc: 'VPN + Geofencing', status: 'متصل' },
            { icon: MapPin, label: 'تحديد الموقع', desc: 'Geolocation API', status: 'نشط' },
          ].map(method => (
            <div key={method.label} className="p-3 rounded-xl bg-surface2/30 border border-border/20">
              <method.icon size={16} className="text-gold mb-2" />
              <p className="text-[10px] font-bold text-foreground">{method.label}</p>
              <p className="text-[9px] text-muted-foreground">{method.desc}</p>
              <span className="text-[8px] text-success mt-1 inline-block">{method.status}</span>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  )
}
