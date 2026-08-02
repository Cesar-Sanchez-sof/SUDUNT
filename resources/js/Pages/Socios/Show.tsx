import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import { ArrowLeft, User, Phone, Mail, MapPin, Award, Shield, FileText, PiggyBank, History, Landmark, CheckCircle, Clock, AlertTriangle, Printer } from 'lucide-react';
import { motion } from 'framer-motion';

interface Socio {
    de_codigo: string;
    nombre: string;
    dni: string;
    direccion: string;
    correo: string;
    fe_nac: string;
    fe_ing: string;
    telf_part: string;
    telf_trab: string;
    telf_movil: string;
    n_beni1: string;
    n_beni2: string;
    cesante: boolean;
    facultad: string;
    depacad: string;
    des_cargo: string;
    cat_cargo: string;
    abr_cargo: string; // Añadido
    sueldo: number;
    cuota: number;
    Observaciones: string;
    sindical: boolean;
    soc_ff: boolean;
}

interface ConsFf {
    saldo: number;
    anterior: number;
    ult_aporte: number;
    fec_aporte: string;
    ult_retiro: number;
    fec_retiro: string;
    actual: number;
}

interface ConsAfm {
    ult_aporte: number;
    fec_aporte: string;
    ult_retiro: number;
    fec_retiro: string;
    actual: number;
}

interface AporteFf {
    idaportes: number;
    monto: number;
    fecha: string;
    recibo: string;
    observaciones: string;
}

interface RetiroFf {
    idretiro: number;
    monto: number;
    fecha: string;
    cheque: string;
    observaciones: string;
}

interface Prestamo {
    idprestamo: number;
    pre_codigo: string;
    fecha: string;
    cheque: string;
    monto: number;
    costfin: number;
    tasa: number;
    saldo: number;
    principal: number;
    cancelado: boolean;
    observacion: string;
}

interface Props {
    socio: Socio;
    consFf: ConsFf;
    consAfm: ConsAfm;
    aportes: AporteFf[];
    retiros: RetiroFf[];
    prestamos: Prestamo[];
}

type TabType = 'aportes' | 'retiros' | 'prestamos';

export default function Show({ socio, consFf, consAfm, aportes, retiros, prestamos }: Props) {
    const [activeTab, setActiveTab] = useState<TabType>('aportes');

    const formatDate = (dateStr: string) => {
        if (!dateStr || dateStr.startsWith('1900') || dateStr.startsWith('1970')) {
            return 'Sin registro';
        }
        return new Date(dateStr + 'T00:00:00').toLocaleDateString('es-PE', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link
                            href={route('socios.index')}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:text-gray-900 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                        <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                            Ficha del Socio
                        </h2>
                    </div>
                </div>
            }
        >
            <Head title={`Socio ${socio.nombre} - SUDUNT`} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Fila Principal de Información y Resumen */}
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                        
                        {/* Columna Izquierda: Tarjeta de Datos Personales */}
                        <div className="lg:col-span-1 space-y-6">
                            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                                {/* Encabezado: Avatar con Iniciales */}
                                <div className="flex flex-col items-center text-center pb-6 border-b border-gray-100 dark:border-gray-700">
                                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-2xl font-bold text-white shadow-md">
                                        {socio.nombre.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                                    </div>
                                    <h3 className="mt-4 text-xl font-bold text-gray-900 dark:text-white leading-tight">
                                        {socio.nombre}
                                    </h3>
                                    <span className="mt-1.5 inline-flex items-center rounded-md bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-700/10 dark:bg-blue-400/10 dark:text-blue-400 dark:ring-blue-400/35">
                                        Código: {socio.de_codigo}
                                    </span>
                                </div>

                                {/* Datos Generales de la Ficha */}
                                <div className="mt-6 space-y-4">
                                    <h4 className="text-xs font-semibold tracking-wider text-gray-400 uppercase">
                                        Información Personal
                                    </h4>
                                    
                                    <div className="flex items-start gap-3 text-sm">
                                        <User className="h-5 w-5 text-gray-400 shrink-0 mt-0.5" />
                                        <div>
                                            <span className="block text-xs text-gray-400">DNI</span>
                                            <span className="font-medium text-gray-900 dark:text-white">{socio.dni}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3 text-sm">
                                        <MapPin className="h-5 w-5 text-gray-400 shrink-0 mt-0.5" />
                                        <div>
                                            <span className="block text-xs text-gray-400">Dirección</span>
                                            <span className="font-medium text-gray-900 dark:text-white">{socio.direccion || 'Sin dirección registrada'}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3 text-sm">
                                        <Mail className="h-5 w-5 text-gray-400 shrink-0 mt-0.5" />
                                        <div>
                                            <span className="block text-xs text-gray-400">Correo Electrónico</span>
                                            <span className="font-medium text-gray-900 dark:text-white break-all">{socio.correo || 'Sin correo registrado'}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3 text-sm">
                                        <Phone className="h-5 w-5 text-gray-400 shrink-0 mt-0.5" />
                                        <div>
                                            <span className="block text-xs text-gray-400">Teléfonos</span>
                                            <span className="font-medium text-gray-900 dark:text-white">
                                                {socio.telf_movil && `Cel: ${socio.telf_movil}`}
                                                {socio.telf_part && ` / Fijo: ${socio.telf_part}`}
                                                {!socio.telf_movil && !socio.telf_part && 'Sin teléfonos'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Datos de Afiliación Laboral */}
                                <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700 space-y-4">
                                    <h4 className="text-xs font-semibold tracking-wider text-gray-400 uppercase">
                                        Detalle Laboral
                                    </h4>

                                    <div className="flex items-start gap-3 text-sm">
                                        <Award className="h-5 w-5 text-gray-400 shrink-0 mt-0.5" />
                                        <div>
                                            <span className="block text-xs text-gray-400">Cargo Académico</span>
                                            <span className="font-medium text-gray-900 dark:text-white">
                                                {socio.des_cargo} ({socio.abr_cargo || socio.cat_cargo})
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3 text-sm">
                                        <Landmark className="h-5 w-5 text-gray-400 shrink-0 mt-0.5" />
                                        <div>
                                            <span className="block text-xs text-gray-400">Facultad / Dpto. Académico</span>
                                            <span className="font-medium text-gray-900 dark:text-white leading-tight">
                                                {socio.facultad} <br />
                                                <span className="text-xs text-gray-500">{socio.depacad}</span>
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3 text-sm">
                                        <Shield className="h-5 w-5 text-gray-400 shrink-0 mt-0.5" />
                                        <div>
                                            <span className="block text-xs text-gray-400">Afiliación</span>
                                            <span className="font-medium text-gray-900 dark:text-white">
                                                {socio.sindical ? 'Socio Sindicato' : 'No sindicalizado'}
                                                {socio.soc_ff && ' + Aportante FF'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Tarjeta de Beneficiarios */}
                            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                                <h4 className="text-xs font-semibold tracking-wider text-gray-400 uppercase mb-4">
                                    Beneficiarios Declarados
                                </h4>
                                <div className="space-y-3">
                                    <div className="rounded-lg bg-gray-50 p-3 text-sm dark:bg-gray-700/20">
                                        <span className="block text-xs text-gray-400">Beneficiario Principal</span>
                                        <span className="font-medium text-gray-900 dark:text-white">{socio.n_beni1 || 'No declarado'}</span>
                                    </div>
                                    <div className="rounded-lg bg-gray-50 p-3 text-sm dark:bg-gray-700/20">
                                        <span className="block text-xs text-gray-400">Beneficiario Secundario</span>
                                        <span className="font-medium text-gray-900 dark:text-white">{socio.n_beni2 || 'No declarado'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Columna Derecha: Saldos Consolidados e Historiales */}
                        <div className="lg:col-span-2 space-y-6">
                            
                            {/* Panel de Ahorros Consolidados */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Tarjeta 1: Aporte Fondo Fijo (FF) */}
                                <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <span className="text-xs font-semibold tracking-wider text-gray-400 uppercase block mb-1">
                                                Fondo de Financiamiento
                                            </span>
                                            <span className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">
                                                S/ {consFf.actual.toFixed(2)}
                                            </span>
                                        </div>
                                        <div className="rounded-lg bg-blue-50 p-2 dark:bg-blue-900/20">
                                            <PiggyBank className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                        </div>
                                    </div>
                                    <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700 grid grid-cols-2 gap-4 text-xs">
                                        <div>
                                            <span className="text-gray-400 block">Último Aporte</span>
                                            <span className="font-bold text-gray-800 dark:text-gray-200">S/ {consFf.ult_aporte.toFixed(2)}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-400 block">Fecha Aporte</span>
                                            <span className="font-bold text-gray-800 dark:text-gray-200">{formatDate(consFf.fec_aporte)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Tarjeta 2: Fondo Mortuorio (AFM) */}
                                <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <span className="text-xs font-semibold tracking-wider text-gray-400 uppercase block mb-1">
                                                Fondo Mortuorio
                                            </span>
                                            <span className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">
                                                S/ {consAfm.actual.toFixed(2)}
                                            </span>
                                        </div>
                                        <div className="rounded-lg bg-indigo-50 p-2 dark:bg-indigo-900/20">
                                            <Landmark className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                                        </div>
                                    </div>
                                    <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700 grid grid-cols-2 gap-4 text-xs">
                                        <div>
                                            <span className="text-gray-400 block">Último Aporte</span>
                                            <span className="font-bold text-gray-800 dark:text-gray-200">S/ {consAfm.ult_aporte.toFixed(2)}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-400 block">Fecha Aporte</span>
                                            <span className="font-bold text-gray-800 dark:text-gray-200">{formatDate(consAfm.fec_aporte)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Contenedor de Historiales con Tabs */}
                            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
                                {/* Navegación de Tabs */}
                                <div className="border-b border-gray-200 dark:border-gray-700">
                                    <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
                                        {(['aportes', 'retiros', 'prestamos'] as TabType[]).map((tab) => (
                                            <button
                                                key={tab}
                                                onClick={() => setActiveTab(tab)}
                                                className={`whitespace-nowrap border-b-2 py-4 px-1 text-sm font-semibold transition-all ${
                                                    activeTab === tab
                                                        ? 'border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-500'
                                                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                                                }`}
                                            >
                                                {tab === 'aportes' && 'Historial Aportes'}
                                                {tab === 'retiros' && 'Historial Retiros'}
                                                {tab === 'prestamos' && `Historial Préstamos (${prestamos.length})`}
                                            </button>
                                        ))}
                                    </nav>
                                </div>

                                {/* Contenido de Tabs */}
                                <div className="p-6">
                                    {/* TAB: APORTES */}
                                    {activeTab === 'aportes' && (
                                        <div className="overflow-x-auto">
                                            {aportes.length > 0 ? (
                                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                                    <thead>
                                                        <tr className="text-left text-xs font-semibold tracking-wider text-gray-400 uppercase bg-gray-50 dark:bg-gray-700/30">
                                                            <th className="px-4 py-3">Fecha</th>
                                                            <th className="px-4 py-3">Nº Recibo</th>
                                                            <th className="px-4 py-3">Observaciones</th>
                                                            <th className="px-4 py-3 text-right">Monto</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700 text-sm">
                                                        {aportes.map((aporte) => (
                                                            <tr key={aporte.idaportes} className="text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/10">
                                                                <td className="px-4 py-3 whitespace-nowrap">{formatDate(aporte.fecha)}</td>
                                                                <td className="px-4 py-3 whitespace-nowrap font-mono">{aporte.recibo || 'S/N'}</td>
                                                                <td className="px-4 py-3">{aporte.observaciones || '-'}</td>
                                                                <td className="px-4 py-3 whitespace-nowrap text-right font-bold text-gray-900 dark:text-white">
                                                                    S/ {aporte.monto.toFixed(2)}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            ) : (
                                                <div className="text-center py-10 text-gray-400">
                                                    <History className="h-10 w-10 mx-auto mb-2 text-gray-300" />
                                                    <span>No existen registros de aportes</span>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* TAB: RETIROS */}
                                    {activeTab === 'retiros' && (
                                        <div className="overflow-x-auto">
                                            {retiros.length > 0 ? (
                                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                                    <thead>
                                                        <tr className="text-left text-xs font-semibold tracking-wider text-gray-400 uppercase bg-gray-50 dark:bg-gray-700/30">
                                                            <th className="px-4 py-3">Fecha</th>
                                                            <th className="px-4 py-3">Nº Cheque</th>
                                                            <th className="px-4 py-3">Observaciones</th>
                                                            <th className="px-4 py-3 text-right">Monto</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700 text-sm">
                                                        {retiros.map((retiro) => (
                                                            <tr key={retiro.idretiro} className="text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/10">
                                                                <td className="px-4 py-3 whitespace-nowrap">{formatDate(retiro.fecha)}</td>
                                                                <td className="px-4 py-3 whitespace-nowrap font-mono">{retiro.cheque || 'S/N'}</td>
                                                                <td className="px-4 py-3">{retiro.observaciones || '-'}</td>
                                                                <td className="px-4 py-3 whitespace-nowrap text-right font-bold text-red-600 dark:text-red-400">
                                                                    S/ {retiro.monto.toFixed(2)}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            ) : (
                                                <div className="text-center py-10 text-gray-400">
                                                    <History className="h-10 w-10 mx-auto mb-2 text-gray-300" />
                                                    <span>No existen registros de retiros</span>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* TAB: PRÉSTAMOS */}
                                    {activeTab === 'prestamos' && (
                                        <div className="overflow-x-auto">
                                            {prestamos.length > 0 ? (
                                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                                    <thead>
                                                        <tr className="text-left text-xs font-semibold tracking-wider text-gray-400 uppercase bg-gray-50 dark:bg-gray-700/30">
                                                            <th className="px-4 py-3">Cód. Préstamo</th>
                                                            <th className="px-4 py-3">Fecha</th>
                                                            <th className="px-4 py-3">Monto Desemb.</th>
                                                            <th className="px-4 py-3">Tasa %</th>
                                                            <th className="px-4 py-3 text-right">Saldo Restante</th>
                                                            <th className="px-4 py-3 text-center">Estado</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700 text-sm">
                                                        {prestamos.map((prestamo) => (
                                                            <tr key={prestamo.idprestamo} className="text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/10">
                                                                <td className="px-4 py-3 whitespace-nowrap font-mono font-bold text-blue-600 dark:text-blue-400">
                                                                    {prestamo.pre_codigo}
                                                                </td>
                                                                <td className="px-4 py-3 whitespace-nowrap">{formatDate(prestamo.fecha)}</td>
                                                                <td className="px-4 py-3 whitespace-nowrap">S/ {prestamo.monto.toFixed(2)}</td>
                                                                <td className="px-4 py-3 whitespace-nowrap font-mono">{prestamo.tasa.toFixed(1)}%</td>
                                                                <td className="px-4 py-3 whitespace-nowrap text-right font-bold text-gray-900 dark:text-white">
                                                                    S/ {prestamo.saldo.toFixed(2)}
                                                                </td>
                                                                <td className="px-4 py-3 whitespace-nowrap text-center">
                                                                    {prestamo.saldo <= 0 || prestamo.cancelado ? (
                                                                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                                                                            <CheckCircle className="h-3 w-3" />
                                                                            Cancelado
                                                                        </span>
                                                                    ) : (
                                                                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-xs font-medium text-amber-800 dark:bg-amber-400/10 dark:text-amber-400">
                                                                            <Clock className="h-3 w-3" />
                                                                            Pendiente
                                                                        </span>
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            ) : (
                                                <div className="text-center py-10 text-gray-400">
                                                    <History className="h-10 w-10 mx-auto mb-2 text-gray-300" />
                                                    <span>No existen registros de préstamos</span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
