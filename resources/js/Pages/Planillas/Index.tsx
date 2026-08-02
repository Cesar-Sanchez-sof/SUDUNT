import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState, FormEvent, useEffect } from 'react';
import { Calendar, FileSpreadsheet, Lock, Unlock, Play, RefreshCw, Layers, CheckCircle2, TrendingUp, DollarSign, PiggyBank, ArrowDownCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface DescFf {
    de_codigo: string;
    nombre: string;
    fec_mes: string;
    fondo_ff: number;
    prestamo: number;
    interes: number;
    de_import: number;
    confirmado: number;
    cesante: number;
}

interface DescOrd {
    de_codigo: string;
    nombre: string;
    fec_mes: string;
    asamblea: number;
    encargos: number;
    cuota: number;
    fondo_mort: number;
    canasta: number;
    salud: number;
    otros: number;
    fondom: number;
    de_import: number;
    confirmado: number;
    cesante: number;
}

interface Resumen {
    total_ahorro?: number;
    total_prestamo?: number;
    total_interes?: number;
    total_cuota?: number;
    total_mortuorio?: number;
    total_otros?: number;
    total_deducido: number;
}

interface Props {
    planillasFf: DescFf[];
    planillasOrd: DescOrd[];
    isGenerated: boolean;
    isConfirmed: boolean;
    resumenFf: Resumen;
    resumenOrd: Resumen;
    selectedMonth: string;
}

type TabType = 'fondofijo' | 'ordinaria';

export default function Index({
    planillasFf,
    planillasOrd,
    isGenerated,
    isConfirmed,
    resumenFf,
    resumenOrd,
    selectedMonth,
}: Props) {
    // Extraer año-mes para el input HTML (e.g. 2026-08-01 -> 2026-08)
    const [monthInput, setMonthInput] = useState(selectedMonth.substring(0, 7));
    const [activeTab, setActiveTab] = useState<TabType>('fondofijo');

    const { post, processing } = useForm({
        month: selectedMonth,
    });

    // Recargar al cambiar de mes
    const handleMonthChange = (val: string) => {
        setMonthInput(val);
        const fullDate = `${val}-01`;
        router.get(route('planillas.index'), { month: fullDate }, { preserveState: true });
    };

    // Generar planillas
    const handleGenerate = (e: FormEvent) => {
        e.preventDefault();
        router.post(route('planillas.generar'), { month: `${monthInput}-01` });
    };

    // Confirmar y cerrar mes
    const handleConfirm = (e: FormEvent) => {
        e.preventDefault();
        if (confirm('¿Estás seguro de confirmar y cerrar la planilla de este mes? Esta acción aplicará los saldos a las cuentas de los socios y cobrará las cuotas pendientes de forma irreversible.')) {
            router.post(route('planillas.confirmar'), { month: `${monthInput}-01` });
        }
    };

    const getMonthLabel = (dateStr: string) => {
        return new Date(dateStr + 'T00:00:00').toLocaleDateString('es-PE', {
            year: 'numeric',
            month: 'long',
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Control de Planillas de Descuento
                </h2>
            }
        >
            <Head title="Planillas - SUDUNT" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    
                    {/* Filtro de Mes y Acciones de Control */}
                    <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3 overflow-hidden bg-white/80 p-6 shadow-sm backdrop-blur-md sm:rounded-xl dark:bg-gray-800/80 dark:border dark:border-gray-700/50">
                        {/* Selector de Mes */}
                        <div className="flex flex-col justify-center">
                            <label className="text-xs font-semibold uppercase text-gray-400 mb-2">Seleccione Periodo</label>
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3">
                                    <Calendar className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="month"
                                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-3 ps-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                    value={monthInput}
                                    onChange={(e) => handleMonthChange(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Estado General */}
                        <div className="flex flex-col justify-center">
                            <span className="text-xs font-semibold uppercase text-gray-400 mb-2">Estado del Periodo</span>
                            <div className="flex items-center gap-2">
                                {isConfirmed ? (
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-400">
                                        <Lock className="h-4 w-4" />
                                        Cerrado y Confirmado
                                    </span>
                                ) : isGenerated ? (
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 ring-1 ring-inset ring-amber-600/20 dark:bg-amber-400/10 dark:text-amber-400">
                                        <Unlock className="h-4 w-4" />
                                        Borrador Preliminar
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-50 px-3 py-1.5 text-xs font-semibold text-gray-600 ring-1 ring-inset ring-gray-200 dark:bg-gray-700 dark:text-gray-400">
                                        <Layers className="h-4 w-4" />
                                        Sin Generar
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Botones de Control de Proceso */}
                        <div className="flex items-center gap-3 justify-start md:justify-end">
                            {!isGenerated ? (
                                <button
                                    onClick={handleGenerate}
                                    disabled={processing}
                                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-blue-700 disabled:opacity-50"
                                >
                                    <Play className="h-4 w-4" />
                                    Generar Planilla
                                </button>
                            ) : (
                                <>
                                    {!isConfirmed && (
                                        <button
                                            onClick={handleConfirm}
                                            disabled={processing}
                                            className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-emerald-700 disabled:opacity-50"
                                        >
                                            <CheckCircle2 className="h-4 w-4" />
                                            Cerrar Planilla
                                        </button>
                                    )}
                                    <button
                                        onClick={handleGenerate}
                                        disabled={processing || isConfirmed}
                                        className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                                    >
                                        <RefreshCw className="h-4 w-4" />
                                        Regenerar
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Resumen de Montos Proyectados */}
                    {isGenerated && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            {/* Resumen Fondo Fijo */}
                            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <PiggyBank className="h-4 w-4 text-blue-500" />
                                    Proyección Fondo Fijo ({getMonthLabel(selectedMonth)})
                                </h3>
                                <div className="grid grid-cols-2 gap-4 text-xs">
                                    <div className="bg-gray-50 p-3 rounded-lg dark:bg-gray-700/20">
                                        <span className="text-gray-400 block">Total Ahorro</span>
                                        <span className="text-lg font-bold text-gray-900 dark:text-white">S/ {(resumenFf.total_ahorro || 0).toFixed(2)}</span>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-lg dark:bg-gray-700/20">
                                        <span className="text-gray-400 block">Retorno Préstamos (Capital)</span>
                                        <span className="text-lg font-bold text-gray-900 dark:text-white">S/ {(resumenFf.total_prestamo || 0).toFixed(2)}</span>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-lg dark:bg-gray-700/20">
                                        <span className="text-gray-400 block">Retorno Intereses</span>
                                        <span className="text-lg font-bold text-gray-900 dark:text-white">S/ {(resumenFf.total_interes || 0).toFixed(2)}</span>
                                    </div>
                                    <div className="bg-blue-50 p-3 rounded-lg dark:bg-blue-900/20">
                                        <span className="text-blue-500 dark:text-blue-400 block">Total Deducción FF</span>
                                        <span className="text-lg font-extrabold text-blue-600 dark:text-blue-400">S/ {resumenFf.total_deducido.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Resumen Ordinario */}
                            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <ArrowDownCircle className="h-4 w-4 text-indigo-500" />
                                    Proyección Planilla Ordinaria ({getMonthLabel(selectedMonth)})
                                </h3>
                                <div className="grid grid-cols-2 gap-4 text-xs">
                                    <div className="bg-gray-50 p-3 rounded-lg dark:bg-gray-700/20">
                                        <span className="text-gray-400 block">Cuota Gremial</span>
                                        <span className="text-lg font-bold text-gray-900 dark:text-white">S/ {(resumenOrd.total_cuota || 0).toFixed(2)}</span>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-lg dark:bg-gray-700/20">
                                        <span className="text-gray-400 block">Fondo Mortuorio</span>
                                        <span className="text-lg font-bold text-gray-900 dark:text-white">S/ {(resumenOrd.total_mortuorio || 0).toFixed(2)}</span>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-lg dark:bg-gray-700/20">
                                        <span className="text-gray-400 block">Otros Aportes / Encargos</span>
                                        <span className="text-lg font-bold text-gray-900 dark:text-white">S/ {(resumenOrd.total_otros || 0).toFixed(2)}</span>
                                    </div>
                                    <div className="bg-indigo-50 p-3 rounded-lg dark:bg-indigo-900/20">
                                        <span className="text-indigo-500 dark:text-indigo-400 block">Total Deducción ORD</span>
                                        <span className="text-lg font-extrabold text-indigo-600 dark:text-indigo-400">S/ {resumenOrd.total_deducido.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Contenedor de Listados */}
                    {isGenerated ? (
                        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            {/* Tabs Navigation */}
                            <div className="border-b border-gray-200 dark:border-gray-700">
                                <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
                                    {(['fondofijo', 'ordinaria'] as TabType[]).map((tab) => (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveTab(tab)}
                                            className={`whitespace-nowrap border-b-2 py-4 px-1 text-sm font-semibold transition-all ${
                                                activeTab === tab
                                                    ? 'border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-500'
                                                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                                            }`}
                                        >
                                            {tab === 'fondofijo' && `Fondo Fijo (${planillasFf.length} socios)`}
                                            {tab === 'ordinaria' && `Planilla Ordinaria (${planillasOrd.length} socios)`}
                                        </button>
                                    ))}
                                </nav>
                            </div>

                            {/* Tab Content */}
                            <div className="p-6">
                                {/* TAB 1: FONDO FIJO LIST */}
                                {activeTab === 'fondofijo' && (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                            <thead>
                                                <tr className="text-left text-xs font-semibold tracking-wider text-gray-400 uppercase bg-gray-50 dark:bg-gray-700/30">
                                                    <th className="px-4 py-3">Código</th>
                                                    <th className="px-4 py-3">Socio</th>
                                                    <th className="px-4 py-3 text-right">Ahorro FF</th>
                                                    <th className="px-4 py-3 text-right">Préstamo (Cap)</th>
                                                    <th className="px-4 py-3 text-right">Interés</th>
                                                    <th className="px-4 py-3 text-right font-bold text-gray-900 dark:text-white">Total Descuento</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700 text-sm">
                                                {planillasFf.map((p) => (
                                                    <tr key={p.de_codigo} className="text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/10">
                                                        <td className="px-4 py-3 font-mono">{p.de_codigo}</td>
                                                        <td className="px-4 py-3 font-semibold">{p.nombre}</td>
                                                        <td className="px-4 py-3 text-right font-mono">S/ {p.fondo_ff.toFixed(2)}</td>
                                                        <td className="px-4 py-3 text-right font-mono">S/ {p.prestamo.toFixed(2)}</td>
                                                        <td className="px-4 py-3 text-right font-mono">S/ {p.interes.toFixed(2)}</td>
                                                        <td className="px-4 py-3 text-right font-mono font-bold text-blue-600 dark:text-blue-400">
                                                            S/ {p.de_import.toFixed(2)}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}

                                {/* TAB 2: ORDINARIA LIST */}
                                {activeTab === 'ordinaria' && (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                            <thead>
                                                <tr className="text-left text-xs font-semibold tracking-wider text-gray-400 uppercase bg-gray-50 dark:bg-gray-700/30">
                                                    <th className="px-4 py-3">Código</th>
                                                    <th className="px-4 py-3">Socio</th>
                                                    <th className="px-4 py-3 text-right">Cuota Gremial</th>
                                                    <th className="px-4 py-3 text-right">Fondo Mort.</th>
                                                    <th className="px-4 py-3 text-right">Otros / Encargos</th>
                                                    <th className="px-4 py-3 text-right font-bold text-gray-900 dark:text-white">Total Descuento</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700 text-sm">
                                                {planillasOrd.map((po) => {
                                                    const otrosCalculados = po.asamblea + po.encargos + po.canasta + po.salud + po.otros + po.fondom;
                                                    return (
                                                        <tr key={po.de_codigo} className="text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/10">
                                                            <td className="px-4 py-3 font-mono">{po.de_codigo}</td>
                                                            <td className="px-4 py-3 font-semibold">{po.nombre}</td>
                                                            <td className="px-4 py-3 text-right font-mono">S/ {po.cuota.toFixed(2)}</td>
                                                            <td className="px-4 py-3 text-right font-mono">S/ {po.fondo_mort.toFixed(2)}</td>
                                                            <td className="px-4 py-3 text-right font-mono">S/ {otrosCalculados.toFixed(2)}</td>
                                                            <td className="px-4 py-3 text-right font-mono font-bold text-indigo-600 dark:text-indigo-400">
                                                                S/ {po.de_import.toFixed(2)}
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border border-gray-200 dark:bg-gray-800 dark:border-gray-700 h-96">
                            <FileSpreadsheet className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4 animate-pulse" />
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Sin planillas generadas</h3>
                            <p className="text-gray-500 dark:text-gray-400 max-w-md mt-2 text-sm leading-relaxed">
                                No se ha generado la pre-planilla de deducciones para el mes de <strong>{getMonthLabel(selectedMonth)}</strong>. Haz clic en el botón <strong>Generar Planilla</strong> superior para procesar las cuotas proyectadas.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
