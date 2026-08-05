import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState, FormEvent, useEffect } from 'react';
import { Calculator, Calendar, Printer, FileCheck, DollarSign, Percent, AlertCircle, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';

interface SocioListItem {
    de_codigo: string;
    nombre: string;
    dni: string;
}

interface CronogramaItem {
    ncuota: number;
    fecha: string;
    principal: number;
    amortiz: number;
    interes: number;
    saldo: number;
    pagomes: number;
}

interface SimulacionResultado {
    monto: number;
    tasa: number;
    ncuotas: number;
    costfin: number;
    principal_total: number;
    total_pago: number;
    cronograma: CronogramaItem[];
}

interface Props {
    socio: {
        de_codigo: string;
        nombre: string;
        dni: string;
        sueldo: number;
    } | null;
    resultado: SimulacionResultado | null;
    sociosList: SocioListItem[];
    filters: {
        de_codigo?: string;
        monto?: string;
        tasa?: string;
        cuotas?: string;
        fecha?: string;
    };
}

export default function Simular({ socio, resultado, sociosList, filters }: Props) {
    const [selectedSocioCode, setSelectedSocioCode] = useState(filters.de_codigo || '');
    const [monto, setMonto] = useState(filters.monto || '1000');
    const [tasa, setTasa] = useState(filters.tasa || '1.5');
    const [cuotas, setCuotas] = useState(filters.cuotas || '12');
    const [fecha, setFecha] = useState(filters.fecha || new Date().toISOString().split('T')[0]);

    // Combobox Autocomplete State
    const [searchQuery, setSearchQuery] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // Sync searchQuery with selectedSocioCode
    useEffect(() => {
        if (selectedSocioCode) {
            const selected = sociosList.find((s) => s.de_codigo === selectedSocioCode);
            if (selected) {
                setSearchQuery(`${selected.nombre} (${selected.de_codigo})`);
            }
        } else {
            setSearchQuery('');
        }
    }, [selectedSocioCode, sociosList]);

    // Check if the search query matches the currently selected socio
    const selectedSocioDisplay = selectedSocioCode
        ? (() => {
              const s = sociosList.find((x) => x.de_codigo === selectedSocioCode);
              return s ? `${s.nombre} (${s.de_codigo})` : '';
          })()
        : '';

    const isSearching = searchQuery && searchQuery !== selectedSocioDisplay;

    // Filtered list of socios for autocomplete
    const filteredSocios = isSearching
        ? sociosList.filter(
              (s) =>
                  s.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  s.de_codigo.includes(searchQuery) ||
                  (s.dni && s.dni.includes(searchQuery))
          ).slice(0, 100)
        : sociosList.slice(0, 100);

    // Formulario de envío (Desembolso Real)
    const { data, setData, post, processing, errors } = useForm({
        de_codigo: selectedSocioCode,
        monto: monto,
        tasa: tasa,
        cuotas: cuotas,
        fecha: fecha,
        cheque: '',
        observacion: '',
    });

    // Actualizar campos del formulario de envío cuando cambien los filtros
    useEffect(() => {
        setData((prev) => ({
            ...prev,
            de_codigo: selectedSocioCode,
            monto: monto,
            tasa: tasa,
            cuotas: cuotas,
            fecha: fecha,
        }));
    }, [selectedSocioCode, monto, tasa, cuotas, fecha]);

    // Recargar la simulación al cambiar parámetros
    const triggerSimulation = () => {
        router.get(
            route('prestamos.simular'),
            {
                de_codigo: selectedSocioCode,
                monto,
                tasa,
                cuotas,
                fecha,
            },
            { preserveState: true, replace: true }
        );
    };

    // Lanzar simulación inicial o al presionar "Calcular"
    const handleCalculate = (e: FormEvent) => {
        e.preventDefault();
        triggerSimulation();
    };

    // Enviar desembolso real
    const handleDisburse = (e: FormEvent) => {
        e.preventDefault();
        post(route('prestamos.store'));
    };

    // Imprimir cronograma
    const handlePrint = () => {
        window.print();
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Simulador Financiero y Desembolsos
                </h2>
            }
        >
            <Head title="Simulador - SUDUNT" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    
                    {/* Sección Principal en Grid */}
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                        
                        {/* Panel de Configuración (Formulario) */}
                        <div className="lg:col-span-1 space-y-6 no-print">
                            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                    <Calculator className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                    Parámetros de Simulación
                                </h3>

                                <form onSubmit={handleCalculate} className="space-y-4">
                                    {/* Selector de Socio Autocomplete Combobox */}
                                    <div className="relative">
                                        <InputLabel htmlFor="de_codigo_search" value="Socio Beneficiario" />
                                        <TextInput
                                            id="de_codigo_search"
                                            type="text"
                                            className="mt-1 block w-full text-sm"
                                            placeholder="Escribe para buscar socio (Nombre, Código o DNI)..."
                                            value={searchQuery}
                                            onChange={(e) => {
                                                setSearchQuery(e.target.value);
                                                setIsDropdownOpen(true);
                                                if (e.target.value === '') {
                                                    setSelectedSocioCode('');
                                                }
                                            }}
                                            onFocus={(e) => {
                                                e.target.select();
                                                setIsDropdownOpen(true);
                                            }}
                                            onBlur={() => {
                                                setTimeout(() => {
                                                    setIsDropdownOpen(false);
                                                    if (selectedSocioCode) {
                                                        const selected = sociosList.find((s) => s.de_codigo === selectedSocioCode);
                                                        if (selected) {
                                                            setSearchQuery(`${selected.nombre} (${selected.de_codigo})`);
                                                        }
                                                    } else {
                                                        setSearchQuery('');
                                                    }
                                                }, 200);
                                            }}
                                        />
                                        
                                        {isDropdownOpen && (
                                            <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-gray-300 bg-white shadow-lg dark:border-gray-600 dark:bg-gray-700">
                                                {filteredSocios.length > 0 ? (
                                                     filteredSocios.map((s) => (
                                                         <button
                                                             key={s.de_codigo}
                                                             type="button"
                                                             className="block w-full text-left px-4 py-2 text-sm text-gray-900 hover:bg-blue-100 hover:text-blue-900 dark:text-white dark:hover:bg-blue-600 border-b border-gray-100 dark:border-gray-600 last:border-0"
                                                             onClick={() => {
                                                                 setSelectedSocioCode(s.de_codigo);
                                                                 setSearchQuery(`${s.nombre} (${s.de_codigo})`);
                                                                 setIsDropdownOpen(false);
                                                             }}
                                                         >
                                                             <div className="font-semibold">{s.nombre}</div>
                                                             <div className="text-[10px] text-gray-500 dark:text-gray-400">Cód: {s.de_codigo} | DNI: {s.dni}</div>
                                                         </button>
                                                     ))
                                                ) : (
                                                    <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                                                        No se encontraron socios
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        <InputError message={errors.de_codigo} className="mt-2" />
                                    </div>

                                    {/* Monto del Préstamo */}
                                    <div>
                                        <InputLabel htmlFor="monto" value="Monto del Préstamo (S/)" />
                                        <div className="relative mt-1">
                                            <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3">
                                                <span className="text-gray-500">S/</span>
                                            </div>
                                            <TextInput
                                                id="monto"
                                                type="number"
                                                className="block w-full ps-9"
                                                value={monto}
                                                onChange={(e) => setMonto(e.target.value)}
                                            />
                                        </div>
                                        <InputError message={errors.monto} className="mt-2" />
                                    </div>

                                    {/* Tasa de Interés */}
                                    <div>
                                        <InputLabel htmlFor="tasa" value="Tasa de Interés Mensual (%)" />
                                        <div className="relative mt-1">
                                            <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3">
                                                <span className="text-gray-500">%</span>
                                            </div>
                                            <TextInput
                                                id="tasa"
                                                type="number"
                                                step="0.01"
                                                className="block w-full ps-9"
                                                value={tasa}
                                                onChange={(e) => setTasa(e.target.value)}
                                            />
                                        </div>
                                        <InputError message={errors.tasa} className="mt-2" />
                                    </div>

                                    {/* Número de Cuotas */}
                                    <div>
                                        <InputLabel htmlFor="cuotas" value="Número de Cuotas (Meses)" />
                                        <TextInput
                                            id="cuotas"
                                            type="number"
                                            className="mt-1 block w-full"
                                            value={cuotas}
                                            onChange={(e) => setCuotas(e.target.value)}
                                        />
                                        <InputError message={errors.cuotas} className="mt-2" />
                                    </div>

                                    {/* Fecha Desembolso */}
                                    <div>
                                        <InputLabel htmlFor="fecha" value="Fecha de Desembolso" />
                                        <TextInput
                                            id="fecha"
                                            type="date"
                                            className="mt-1 block w-full"
                                            value={fecha}
                                            onChange={(e) => setFecha(e.target.value)}
                                        />
                                        <InputError message={errors.fecha} className="mt-2" />
                                    </div>

                                    <PrimaryButton type="submit" className="w-full justify-center mt-2">
                                        <RefreshCw className="h-4 w-4 mr-2" />
                                        Simular / Calcular
                                    </PrimaryButton>
                                </form>
                            </div>

                            {/* Panel de Desembolso Real */}
                            {resultado && selectedSocioCode && (
                                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                        <FileCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                        Finalizar Desembolso
                                    </h3>

                                    <form onSubmit={handleDisburse} className="space-y-4">
                                        <div>
                                            <InputLabel htmlFor="cheque" value="Número de Cheque" />
                                            <TextInput
                                                id="cheque"
                                                type="text"
                                                className="mt-1 block w-full"
                                                value={data.cheque}
                                                onChange={(e) => setData('cheque', e.target.value)}
                                                placeholder="Ej: CHQ-556102"
                                            />
                                            <InputError message={errors.cheque} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="observacion" value="Observaciones" />
                                            <TextInput
                                                id="observacion"
                                                type="text"
                                                className="mt-1 block w-full"
                                                value={data.observacion}
                                                onChange={(e) => setData('observacion', e.target.value)}
                                                placeholder="Ej: PRÉSTAMO ORDINARIO"
                                            />
                                            <InputError message={errors.observacion} className="mt-2" />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="flex w-full items-center justify-center rounded-lg bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50"
                                        >
                                            Generar y Registrar Préstamo
                                        </button>
                                    </form>
                                </div>
                            )}
                        </div>

                        {/* Columna Derecha: Resultados y Cronograma */}
                        <div className="lg:col-span-2 space-y-6">
                            
                            {resultado ? (
                                <motion.div
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-6"
                                >
                                    {/* Resumen de Simulación */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 no-print">
                                        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                                            <span className="text-xs font-semibold tracking-wider text-gray-400 uppercase block mb-1">
                                                Capital / Principal
                                            </span>
                                            <span className="text-3xl font-extrabold text-gray-900 dark:text-white">
                                                S/ {resultado.monto.toFixed(2)}
                                            </span>
                                        </div>

                                        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                                            <span className="text-xs font-semibold tracking-wider text-gray-400 uppercase block mb-1">
                                                Costo Financiero (Intereses)
                                            </span>
                                            <span className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">
                                                S/ {resultado.costfin.toFixed(2)}
                                            </span>
                                        </div>

                                        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                                            <span className="text-xs font-semibold tracking-wider text-gray-400 uppercase block mb-1">
                                                Total a Devolver
                                            </span>
                                            <span className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">
                                                S/ {resultado.total_pago.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Cronograma Detallado */}
                                    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                                        
                                        {/* Cabecera del Documento Imprimible */}
                                        <div className="hidden print:block mb-8 border-b pb-6 text-center">
                                            <h1 className="text-2xl font-bold">SUDUNT - SINDICATO ÚNICO DE DOCENTES</h1>
                                            <h2 className="text-lg text-gray-600 mt-1">Universidad Nacional de Trujillo</h2>
                                            <h3 className="text-md font-bold mt-4">CRONOGRAMA SIMULADO DE PAGOS</h3>
                                            {socio && (
                                                <div className="mt-4 grid grid-cols-2 text-left text-sm gap-2 max-w-xl mx-auto border p-4 rounded-lg bg-gray-50">
                                                    <div><strong>Socio:</strong> {socio.nombre}</div>
                                                    <div><strong>Código:</strong> {socio.de_codigo}</div>
                                                    <div><strong>DNI:</strong> {socio.dni}</div>
                                                    <div><strong>Fecha Desembolso:</strong> {fecha}</div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex justify-between items-center mb-6 no-print">
                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                                Cronograma de Pagos Proyectado
                                            </h3>
                                            <button
                                                onClick={handlePrint}
                                                className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                                            >
                                                <Printer className="h-4 w-4" />
                                                Imprimir Cronograma
                                            </button>
                                        </div>

                                        <div className="overflow-x-auto">
                                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                                <thead>
                                                    <tr className="text-left text-xs font-semibold tracking-wider text-gray-400 uppercase bg-gray-50 dark:bg-gray-700/30">
                                                        <th className="px-4 py-3 text-center">Nº Cuota</th>
                                                        <th className="px-4 py-3">Fecha Venc.</th>
                                                        <th className="px-4 py-3 text-right">Saldo Inicial</th>
                                                        <th className="px-4 py-3 text-right">Amortización (Ceil)</th>
                                                        <th className="px-4 py-3 text-right">Interés (Round)</th>
                                                        <th className="px-4 py-3 text-right">Cuota Mensual</th>
                                                        <th className="px-4 py-3 text-right">Saldo Final</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700 text-sm">
                                                    {resultado.cronograma.map((c) => (
                                                        <tr key={c.ncuota} className="text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/10">
                                                            <td className="px-4 py-3 text-center font-bold">{c.ncuota}</td>
                                                            <td className="px-4 py-3 whitespace-nowrap">
                                                                {new Date(c.fecha + 'T00:00:00').toLocaleDateString('es-PE', {
                                                                    year: 'numeric',
                                                                    month: 'numeric',
                                                                    day: 'numeric',
                                                                })}
                                                            </td>
                                                            <td className="px-4 py-3 text-right font-mono">S/ {c.principal.toFixed(2)}</td>
                                                            <td className="px-4 py-3 text-right font-mono">S/ {c.amortiz.toFixed(2)}</td>
                                                            <td className="px-4 py-3 text-right font-mono">S/ {c.interes.toFixed(2)}</td>
                                                            <td className="px-4 py-3 text-right font-mono font-bold text-blue-600 dark:text-blue-400">
                                                                S/ {c.pagomes.toFixed(2)}
                                                            </td>
                                                            <td className="px-4 py-3 text-right font-mono text-gray-500">S/ {c.saldo.toFixed(2)}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border border-gray-200 dark:bg-gray-800 dark:border-gray-700 h-96">
                                    <Calculator className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4 animate-pulse" />
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Esperando Parámetros</h3>
                                    <p className="text-gray-500 dark:text-gray-400 max-w-sm mt-2 text-sm leading-relaxed">
                                        Introduce un monto, tasa de interés y cuotas a la izquierda, y presiona <strong>Simular / Calcular</strong> para proyectar el cronograma mensual.
                                    </p>
                                </div>
                            )}

                        </div>

                    </div>
                </div>
            </div>

            {/* Estilos adicionales para impresión (print-friendly CSS) */}
            <style>{`
                @media print {
                    body {
                        background: white !important;
                        color: black !important;
                    }
                    .no-print {
                        display: none !important;
                    }
                    .min-h-screen {
                        min-height: auto !important;
                    }
                    nav, header {
                        display: none !important;
                    }
                    .py-12 {
                        padding-top: 0 !important;
                        padding-bottom: 0 !important;
                    }
                    .shadow-sm, .rounded-2xl {
                        box-shadow: none !important;
                        border: none !important;
                    }
                    table {
                        border-collapse: collapse !important;
                        width: 100% !important;
                    }
                    th, td {
                        border: 1px solid #ddd !important;
                        padding: 8px !important;
                    }
                }
            `}</style>
        </AuthenticatedLayout>
    );
}
