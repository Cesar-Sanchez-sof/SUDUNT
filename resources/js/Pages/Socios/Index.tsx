import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Search, User, Building, CreditCard, ChevronRight, ChevronLeft, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Socio {
    de_codigo: string;
    nombre: string;
    dni: string;
    facultad: string;
    depacad: string;
    des_cargo: string;
    sueldo: number;
    cuota: number;
    cesante: boolean;
    fe_ing: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedSocios {
    data: Socio[];
    links: PaginationLink[];
    current_page: number;
    last_page: number;
    total: number;
    from: number;
    to: number;
}

interface Props {
    socios: PaginatedSocios;
    filters: {
        search?: string;
    };
}

export default function Index({ socios, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');

    // Manejar la búsqueda en tiempo real con debouncing
    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (search !== (filters.search || '')) {
                router.get(
                    route('socios.index'),
                    { search },
                    { preserveState: true, replace: true }
                );
            }
        }, 300);

        return () => clearTimeout(delayDebounce);
    }, [search]);

    const handlePageChange = (url: string | null) => {
        if (url) {
            try {
                // Convert absolute URL to relative path to prevent HTTP/HTTPS protocol mismatch errors
                const parsedUrl = new URL(url);
                const relativeUrl = parsedUrl.pathname + parsedUrl.search;
                router.get(relativeUrl, {}, { preserveState: true });
            } catch (e) {
                router.get(url, {}, { preserveState: true });
            }
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Buscador de Socios
                </h2>
            }
        >
            <Head title="Socios - SUDUNT" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Buscador Superior */}
                    <div className="mb-8 overflow-hidden bg-white/80 p-6 shadow-sm backdrop-blur-md sm:rounded-xl dark:bg-gray-800/80 dark:border dark:border-gray-700/50">
                        <div className="relative max-w-xl">
                            <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-3 ps-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                placeholder="Buscar por Nombre, DNI o Código..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Grid de Socios */}
                    <AnimatePresence mode="wait">
                        {socios.data.length > 0 ? (
                            <motion.div
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -15 }}
                                transition={{ duration: 0.3 }}
                                className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
                            >
                                {socios.data.map((socio) => (
                                    <motion.div
                                        key={socio.de_codigo}
                                        whileHover={{ y: -4, scale: 1.01 }}
                                        className="relative flex flex-col justify-between overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all dark:border-gray-700/60 dark:bg-gray-800"
                                    >
                                        <div>
                                            {/* Cabecera Tarjeta */}
                                            <div className="flex items-center justify-between mb-4">
                                                <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-700/10 dark:bg-blue-400/10 dark:text-blue-400 dark:ring-blue-400/35">
                                                    Cód: {socio.de_codigo}
                                                </span>
                                                <span
                                                    className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold ring-1 ring-inset ${
                                                        socio.cesante
                                                            ? 'bg-amber-50 text-amber-800 ring-amber-600/20 dark:bg-amber-400/10 dark:text-amber-400 dark:ring-amber-400/20'
                                                            : 'bg-emerald-50 text-emerald-700 ring-emerald-600/10 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20'
                                                    }`}
                                                >
                                                    {socio.cesante ? 'Cesante' : 'Activo'}
                                                </span>
                                            </div>

                                            {/* Nombre Socio */}
                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-1">
                                                {socio.nombre}
                                            </h3>

                                            {/* Información General */}
                                            <div className="mt-4 space-y-2 text-sm text-gray-500 dark:text-gray-400">
                                                <div className="flex items-center gap-2">
                                                    <User className="h-4 w-4 shrink-0 text-gray-400" />
                                                    <span>DNI: {socio.dni}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Building className="h-4 w-4 shrink-0 text-gray-400" />
                                                    <span className="line-clamp-1">{socio.facultad || 'No asignada'}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <CreditCard className="h-4 w-4 shrink-0 text-gray-400" />
                                                    <span>Sueldo: S/ {socio.sueldo.toFixed(2)}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Botón Ver Ficha */}
                                        <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                                            <Link
                                                href={route('socios.show', socio.de_codigo)}
                                                className="flex w-full items-center justify-between rounded-lg bg-gray-50 px-4 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-50 dark:bg-gray-700/30 dark:text-blue-400 dark:hover:bg-blue-900/20"
                                            >
                                                <span>Ver Ficha del Socio</span>
                                                <ChevronRight className="h-4 w-4" />
                                            </Link>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-xl shadow-sm dark:bg-gray-800 dark:border dark:border-gray-700"
                            >
                                <User className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Sin Resultados</h3>
                                <p className="text-gray-500 dark:text-gray-400 max-w-sm mt-1">
                                    No encontramos ningún socio registrado con el nombre o DNI "{search}".
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Paginación */}
                    {socios.total > socios.data.length && (
                        <div className="mt-8 flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6 dark:border-gray-700">
                            <div className="flex flex-1 justify-between sm:hidden">
                                <button
                                    onClick={() => handlePageChange(socios.links[0].url)}
                                    disabled={!socios.links[0].url}
                                    className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
                                >
                                    Anterior
                                </button>
                                <button
                                    onClick={() => handlePageChange(socios.links[socios.links.length - 1].url)}
                                    disabled={!socios.links[socios.links.length - 1].url}
                                    className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
                                >
                                    Siguiente
                                </button>
                            </div>
                            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-gray-700 dark:text-gray-300">
                                        Mostrando <span className="font-medium">{socios.from}</span> a <span className="font-medium">{socios.to}</span> de{' '}
                                        <span className="font-medium">{socios.total}</span> socios
                                    </p>
                                </div>
                                <div>
                                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                                        {socios.links.map((link, idx) => {
                                            // Limpiar etiquetas de flechas
                                            const label = link.label
                                                .replace('&laquo; Previous', '')
                                                .replace('Next &raquo;', '')
                                                .trim();

                                            const isArrow = link.label.includes('&laquo;') || link.label.includes('&raquo;');
                                            const isPrevious = link.label.includes('&laquo;');

                                            return (
                                                <button
                                                    key={idx}
                                                    disabled={!link.url}
                                                    onClick={() => handlePageChange(link.url)}
                                                    className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold focus:z-20 ${
                                                        link.active
                                                            ? 'z-10 bg-blue-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                                                            : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0 dark:text-gray-300 dark:ring-gray-600 dark:hover:bg-gray-700'
                                                    } ${idx === 0 ? 'rounded-l-md' : ''} ${
                                                        idx === socios.links.length - 1 ? 'rounded-r-md' : ''
                                                    } disabled:opacity-50`}
                                                >
                                                    {isArrow ? (
                                                        isPrevious ? (
                                                            <ChevronLeft className="h-5 w-5" />
                                                        ) : (
                                                            <ChevronRight className="h-5 w-5" />
                                                        )
                                                    ) : (
                                                        label || link.label
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </nav>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
