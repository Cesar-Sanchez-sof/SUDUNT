import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState, FormEvent, useEffect } from 'react';
import { Landmark, Search, FileText, CheckCircle2, AlertCircle, Calendar, CreditCard, User, HelpCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';

interface SocioListItem {
    de_codigo: string;
    nombre: string;
    dni: string;
}

interface CuotaPendiente {
    idpagff: number;
    de_codigo: string;
    pre_codigo: string;
    ncuota: number;
    principal: number;
    fecha: string;
    amortiz: number;
    interes: number;
    saldo: number;
    pagomes: number;
    estado: string;
}

interface Props {
    socio: {
        de_codigo: string;
        nombre: string;
        dni: string;
    } | null;
    cuotasPendientes: CuotaPendiente[];
    sociosList: SocioListItem[];
    filters: {
        de_codigo?: string;
    };
}

export default function Caja({ socio, cuotasPendientes, sociosList, filters }: Props) {
    const [selectedSocioCode, setSelectedSocioCode] = useState(filters.de_codigo || '');
    const [selectedCuota, setSelectedCuota] = useState<CuotaPendiente | null>(null);
    const [showModal, setShowModal] = useState(false);

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

    // Formulario de Cobro
    const { data, setData, post, processing, errors, reset } = useForm({
        idpagff: '',
        documento: '',
        observaciones: '',
        de_codigo: selectedSocioCode,
    });

    // Actualizar de_codigo en el formulario cuando cambie el socio
    useEffect(() => {
        setData('de_codigo', selectedSocioCode);
    }, [selectedSocioCode]);

    // Recargar la página al seleccionar socio
    const handleSocioChange = (code: string) => {
        setSelectedSocioCode(code);
        router.get(
            route('cobros.index'),
            { de_codigo: code },
            { preserveState: true, replace: true }
        );
    };

    // Abrir Modal de Confirmación
    const openPaymentModal = (cuota: CuotaPendiente) => {
        setSelectedCuota(cuota);
        setData('idpagff', cuota.idpagff.toString());
        setShowModal(true);
    };

    // Cerrar Modal
    const closeModal = () => {
        setSelectedCuota(null);
        reset('idpagff', 'documento', 'observaciones');
        setShowModal(false);
    };

    // Confirmar y Procesar Pago
    const submitPayment = (e: FormEvent) => {
        e.preventDefault();
        post(route('cobros.pagar'), {
            onSuccess: () => {
                closeModal();
            },
        });
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr + 'T00:00:00').toLocaleDateString('es-PE', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Caja - Registro de Cobros en Efectivo
                </h2>
            }
        >
            <Head title="Caja - SUDUNT" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    
                    {/* Buscador de Socio con Deudas */}
                    <div className="mb-8 bg-white/80 p-6 shadow-sm backdrop-blur-md sm:rounded-xl dark:bg-gray-800/80 dark:border dark:border-gray-700/50">
                        <div className="max-w-xl">
                            <InputLabel htmlFor="select-socio-search" value="Seleccione un socio con cuotas pendientes" />
                            <div className="relative mt-2">
                                <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3">
                                    <Search className="h-5 w-5 text-gray-400" />
                                </div>
                                <TextInput
                                    id="select-socio-search"
                                    type="text"
                                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-3 ps-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                    placeholder="Escribe para buscar socio (Nombre, Código o DNI)..."
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                        setIsDropdownOpen(true);
                                        if (e.target.value === '') {
                                            handleSocioChange('');
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
                                                        handleSocioChange(s.de_codigo);
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
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                        {/* Detalle del Socio Seleccionado */}
                        <div className="lg:col-span-1">
                            {socio ? (
                                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                                    <h3 className="text-md font-bold tracking-wider text-gray-400 uppercase mb-4">
                                        Información del Aportante
                                    </h3>
                                    <div className="flex items-center gap-4 pb-4 border-b border-gray-100 dark:border-gray-700 mb-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 font-bold">
                                            {socio.nombre.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 dark:text-white leading-tight">
                                                {socio.nombre}
                                            </h4>
                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                                Cód: {socio.de_codigo} | DNI: {socio.dni}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-800 dark:bg-blue-950/20 dark:text-blue-300">
                                        <div className="flex gap-2">
                                            <HelpCircle className="h-5 w-5 shrink-0 mt-0.5" />
                                            <div>
                                                <p className="font-semibold">Instrucciones de Caja</p>
                                                <p className="mt-1 text-xs leading-relaxed">
                                                    Seleccione la cuota correspondiente en la tabla de la derecha y haga clic en <strong>Registrar Pago</strong>. El sistema recalculará automáticamente los saldos del socio de forma inmediata.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center p-6 text-center bg-white rounded-2xl border border-gray-200 dark:bg-gray-800 dark:border-gray-700 h-64">
                                    <User className="h-10 w-10 text-gray-300 dark:text-gray-600 mb-2" />
                                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Ningún socio seleccionado</h4>
                                    <p className="text-xs text-gray-400 mt-1 max-w-xs">
                                        Selecciona un socio en la lista superior para ver sus deudas e installments pendientes de cobro.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Listado de Cuotas Pendientes */}
                        <div className="lg:col-span-2">
                            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
                                    Cuotas Pendientes de Pago
                                </h3>

                                {selectedSocioCode ? (
                                    cuotasPendientes.length > 0 ? (
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                                <thead>
                                                    <tr className="text-left text-xs font-semibold tracking-wider text-gray-400 uppercase bg-gray-50 dark:bg-gray-700/30">
                                                        <th className="px-4 py-3">Cód. Préstamo</th>
                                                        <th className="px-4 py-3 text-center">Nº Cuota</th>
                                                        <th className="px-4 py-3">Vencimiento</th>
                                                        <th className="px-4 py-3 text-right">Capital</th>
                                                        <th className="px-4 py-3 text-right">Interés</th>
                                                        <th className="px-4 py-3 text-right">Total</th>
                                                        <th className="px-4 py-3 text-center">Acciones</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700 text-sm">
                                                    {cuotasPendientes.map((c) => (
                                                        <tr key={c.idpagff} className="text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/10">
                                                            <td className="px-4 py-3 font-mono font-bold text-blue-600 dark:text-blue-400">
                                                                {c.pre_codigo}
                                                            </td>
                                                            <td className="px-4 py-3 text-center font-semibold">{c.ncuota}</td>
                                                            <td className="px-4 py-3 whitespace-nowrap">{formatDate(c.fecha)}</td>
                                                            <td className="px-4 py-3 text-right font-mono">S/ {c.amortiz.toFixed(2)}</td>
                                                            <td className="px-4 py-3 text-right font-mono">S/ {c.interes.toFixed(2)}</td>
                                                            <td className="px-4 py-3 text-right font-mono font-bold text-gray-900 dark:text-white">
                                                                S/ {c.pagomes.toFixed(2)}
                                                            </td>
                                                            <td className="px-4 py-3 text-center whitespace-nowrap">
                                                                <button
                                                                    onClick={() => openPaymentModal(c)}
                                                                    className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
                                                                >
                                                                    <Landmark className="h-3 w-3" />
                                                                    Registrar Pago
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <div className="text-center py-12 text-gray-500">
                                            <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto mb-3" />
                                            <h4 className="font-bold text-gray-900 dark:text-white">Al Día</h4>
                                            <p className="text-xs text-gray-400 mt-1">
                                                Este socio no cuenta con ninguna cuota de préstamo pendiente de pago.
                                            </p>
                                        </div>
                                    )
                                ) : (
                                    <div className="text-center py-12 text-gray-400">
                                        <AlertCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                                        <span>Seleccione un socio para ver las cuotas</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de Pago en Caja (Glassmorphic) */}
            <AnimatePresence>
                {showModal && selectedCuota && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="w-full max-w-md overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-xl dark:border-gray-700 dark:bg-gray-800"
                        >
                            {/* Modal Header */}
                            <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-700 mb-6">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                    Confirmación de Pago
                                </h3>
                                <button
                                    onClick={closeModal}
                                    className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            {/* Resumen de la Cuota a Pagar */}
                            <div className="mb-6 rounded-lg bg-gray-50 p-4 text-sm dark:bg-gray-700/30 space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Préstamo:</span>
                                    <span className="font-mono font-bold text-gray-900 dark:text-white">{selectedCuota.pre_codigo}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Cuota Nº:</span>
                                    <span className="font-bold text-gray-900 dark:text-white">{selectedCuota.ncuota}</span>
                                </div>
                                <div className="flex justify-between border-t border-gray-100 dark:border-gray-700 pt-2 font-semibold">
                                    <span className="text-gray-900 dark:text-white">Total a Cobrar:</span>
                                    <span className="text-blue-600 dark:text-blue-400">S/ {selectedCuota.pagomes.toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Formulario de Entrada */}
                            <form onSubmit={submitPayment} className="space-y-4">
                                <div>
                                    <InputLabel htmlFor="documento" value="Nº de Recibo / Documento de Caja" />
                                    <TextInput
                                        id="documento"
                                        type="text"
                                        className="mt-1 block w-full"
                                        value={data.documento}
                                        onChange={(e) => setData('documento', e.target.value)}
                                        placeholder="Ej: REC-002159"
                                        required
                                        isFocused={true}
                                    />
                                    <InputError message={errors.documento} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="observaciones" value="Observaciones (Opcional)" />
                                    <TextInput
                                        id="observaciones"
                                        type="text"
                                        className="mt-1 block w-full"
                                        value={data.observaciones}
                                        onChange={(e) => setData('observaciones', e.target.value)}
                                        placeholder="Ej: PAGO DE CUOTA EN VENTANILLA"
                                    />
                                    <InputError message={errors.observaciones} className="mt-2" />
                                </div>

                                <div className="mt-6 flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                                    >
                                        Procesar Pago
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </AuthenticatedLayout>
    );
}
