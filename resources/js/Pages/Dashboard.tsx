import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Users, TrendingUp, PiggyBank, Landmark, Activity, ArrowUpRight, DollarSign } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { motion } from 'framer-motion';

interface Stats {
    totalSocios: number;
    sociosActivos: number;
    sociosCesantes: number;
    carteraActiva: number;
    totalDesembolsado: number;
    ahorroFondoFijo: number;
    ahorroFondoMortuorio: number;
}

interface ChartItem {
    name: string;
    Ahorros: number;
    Préstamos: number;
}

interface Props {
    stats: Stats;
    chartData: ChartItem[];
}

export default function Dashboard({ stats, chartData }: Props) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Panel de Control y Analíticas
                </h2>
            }
        >
            <Head title="Dashboard - SUDUNT" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
                    
                    {/* Sección 1: Tarjetas de Estadísticas Principales */}
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        
                        {/* Tarjeta 1: Total Socios */}
                        <motion.div
                            whileHover={{ y: -3 }}
                            className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700/60 dark:bg-gray-800"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <span className="text-xs font-semibold tracking-wider text-gray-400 uppercase">
                                        Total Socios
                                    </span>
                                    <h3 className="mt-1 text-3xl font-extrabold text-gray-900 dark:text-white">
                                        {stats.totalSocios}
                                    </h3>
                                </div>
                                <div className="rounded-xl bg-blue-50 p-3 dark:bg-blue-900/20">
                                    <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                </div>
                            </div>
                            <div className="mt-4 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                                    {stats.sociosActivos} Activos
                                </span>
                                <span>•</span>
                                <span>{stats.sociosCesantes} Cesantes</span>
                            </div>
                        </motion.div>

                        {/* Tarjeta 2: Cartera Activa de Préstamos */}
                        <motion.div
                            whileHover={{ y: -3 }}
                            className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700/60 dark:bg-gray-800"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <span className="text-xs font-semibold tracking-wider text-gray-400 uppercase">
                                        Cartera Activa
                                    </span>
                                    <h3 className="mt-1 text-3xl font-extrabold text-gray-900 dark:text-white">
                                        S/ {stats.carteraActiva.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                                    </h3>
                                </div>
                                <div className="rounded-xl bg-emerald-50 p-3 dark:bg-emerald-900/20">
                                    <TrendingUp className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                                </div>
                            </div>
                            <div className="mt-4 flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                <span className="text-gray-400">Desembolsos Históricos:</span>
                                <span className="font-semibold text-gray-900 dark:text-white">
                                    S/ {stats.totalDesembolsado.toLocaleString('es-PE', { maximumFractionDigits: 0 })}
                                </span>
                            </div>
                        </motion.div>

                        {/* Tarjeta 3: Fondo Fijo */}
                        <motion.div
                            whileHover={{ y: -3 }}
                            className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700/60 dark:bg-gray-800"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <span className="text-xs font-semibold tracking-wider text-gray-400 uppercase">
                                        Ahorros Fondo Fijo
                                    </span>
                                    <h3 className="mt-1 text-3xl font-extrabold text-gray-900 dark:text-white">
                                        S/ {stats.ahorroFondoFijo.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                                    </h3>
                                </div>
                                <div className="rounded-xl bg-indigo-50 p-3 dark:bg-indigo-900/20">
                                    <PiggyBank className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                                </div>
                            </div>
                            <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                                Capital social acumulado de socios
                            </div>
                        </motion.div>

                        {/* Tarjeta 4: Fondo Mortuorio */}
                        <motion.div
                            whileHover={{ y: -3 }}
                            className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700/60 dark:bg-gray-800"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <span className="text-xs font-semibold tracking-wider text-gray-400 uppercase">
                                        Ahorros Fondo Mortuorio
                                    </span>
                                    <h3 className="mt-1 text-3xl font-extrabold text-gray-900 dark:text-white">
                                        S/ {stats.ahorroFondoMortuorio.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                                    </h3>
                                </div>
                                <div className="rounded-xl bg-amber-50 p-3 dark:bg-amber-900/20">
                                    <Landmark className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                                </div>
                            </div>
                            <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                                Fondo de ayuda social consolidado
                            </div>
                        </motion.div>
                    </div>

                    {/* Sección 2: Gráfico y Accesos Rápidos */}
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                        
                        {/* Gráfico Recharts de Tendencias */}
                        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700/60 dark:bg-gray-800 lg:col-span-2">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                Tendencias Mensuales (Últimos 6 meses)
                            </h3>
                            
                            <div className="h-80 w-full text-xs">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorAhorros" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2}/>
                                                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                                            </linearGradient>
                                            <linearGradient id="colorPrestamos" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                        <XAxis dataKey="name" stroke="#9CA3AF" tickLine={false} axisLine={false} />
                                        <YAxis stroke="#9CA3AF" tickLine={false} axisLine={false} tickFormatter={(v) => `S/ ${v}`} />
                                        <Tooltip formatter={(value) => value !== undefined ? [`S/ ${Number(value).toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, ''] : ['']} />
                                        <Legend />
                                        <Area type="monotone" dataKey="Ahorros" stroke="#4f46e5" strokeWidth={2} fillOpacity={1} fill="url(#colorAhorros)" />
                                        <Area type="monotone" dataKey="Préstamos" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorPrestamos)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Accesos Rápidos Premium */}
                        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700/60 dark:bg-gray-800 lg:col-span-1 flex flex-col justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
                                    Accesos Rápidos
                                </h3>
                                <div className="space-y-4">
                                    <a
                                        href={route('socios.index')}
                                        className="flex items-center justify-between rounded-xl bg-gray-50 p-4 text-sm font-semibold text-gray-800 hover:bg-blue-50 hover:text-blue-700 dark:bg-gray-700/20 dark:text-gray-200 dark:hover:bg-blue-900/10 dark:hover:text-blue-400 transition-colors"
                                    >
                                        <span>Buscador y Ficha de Socios</span>
                                        <ArrowUpRight className="h-4 w-4 text-gray-400" />
                                    </a>

                                    <a
                                        href={route('prestamos.simular')}
                                        className="flex items-center justify-between rounded-xl bg-gray-50 p-4 text-sm font-semibold text-gray-800 hover:bg-blue-50 hover:text-blue-700 dark:bg-gray-700/20 dark:text-gray-200 dark:hover:bg-blue-900/10 dark:hover:text-blue-400 transition-colors"
                                    >
                                        <span>Simular Préstamo y Desembolso</span>
                                        <ArrowUpRight className="h-4 w-4 text-gray-400" />
                                    </a>

                                    <a
                                        href={route('cobros.index')}
                                        className="flex items-center justify-between rounded-xl bg-gray-50 p-4 text-sm font-semibold text-gray-800 hover:bg-blue-50 hover:text-blue-700 dark:bg-gray-700/20 dark:text-gray-200 dark:hover:bg-blue-900/10 dark:hover:text-blue-400 transition-colors"
                                    >
                                        <span>Registro de Cobro en Caja</span>
                                        <ArrowUpRight className="h-4 w-4 text-gray-400" />
                                    </a>

                                    <a
                                        href={route('planillas.index')}
                                        className="flex items-center justify-between rounded-xl bg-gray-50 p-4 text-sm font-semibold text-gray-800 hover:bg-blue-50 hover:text-blue-700 dark:bg-gray-700/20 dark:text-gray-200 dark:hover:bg-blue-900/10 dark:hover:text-blue-400 transition-colors"
                                    >
                                        <span>Generación y Confirmación Planillas</span>
                                        <ArrowUpRight className="h-4 w-4 text-gray-400" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
