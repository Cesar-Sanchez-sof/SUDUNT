import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { LogIn, LayoutDashboard, Users, Calculator, Landmark, Shield, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Welcome({
    auth,
    laravelVersion,
    phpVersion,
}: PageProps<{ laravelVersion: string; phpVersion: string }>) {
    return (
        <>
            <Head title="Bienvenido a SUDUNT" />
            <div className="relative flex min-h-screen flex-col justify-between overflow-hidden bg-gradient-to-br from-blue-900 via-indigo-950 to-gray-950 text-white select-none">
                
                {/* Fondo decorativo con luces abstractas */}
                <div className="absolute top-[-20%] left-[-10%] h-[60%] w-[60%] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />
                <div className="absolute bottom-[-20%] right-[-10%] h-[60%] w-[60%] rounded-full bg-amber-600/10 blur-[120px] pointer-events-none" />

                {/* Navbar Superior */}
                <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img 
                            src="/images/unt_logo.png" 
                            alt="UNT Logo" 
                            className="h-10 w-auto object-contain"
                        />
                        <div>
                            <span className="block font-black text-xl tracking-tight text-white">SUDUNT</span>
                            <span className="hidden sm:block text-[10px] tracking-widest text-amber-500 font-semibold uppercase">
                                Universidad Nacional de Trujillo
                            </span>
                        </div>
                    </div>
                    
                    <nav>
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg hover:bg-blue-500 transition duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                            >
                                <LayoutDashboard className="h-4 w-4" />
                                Ir al Dashboard
                            </Link>
                        ) : (
                            <Link
                                href={route('login')}
                                className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-5 py-2.5 text-sm font-bold text-white backdrop-blur-md border border-white/10 hover:bg-white/20 transition duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                            >
                                <LogIn className="h-4 w-4" />
                                Iniciar Sesión
                            </Link>
                        )}
                    </nav>
                </header>

                {/* Hero Section */}
                <main className="relative z-10 w-full max-w-7xl mx-auto px-6 py-12 my-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Mensaje de Bienvenida */}
                    <div className="space-y-6">
                        <motion.span 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-400 ring-1 ring-inset ring-amber-500/20"
                        >
                            <Shield className="h-3.5 w-3.5" />
                            Portal Administrativo Oficial
                        </motion.span>
                        
                        <motion.h1 
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl sm:text-5xl font-black tracking-tight leading-none text-white"
                        >
                            Sindicato Único de Docentes <br />
                            <span className="bg-gradient-to-r from-blue-400 to-amber-400 bg-clip-text text-transparent">
                                Universidad Nacional de Trujillo
                            </span>
                        </motion.h1>

                        <motion.p 
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-gray-400 text-base max-w-lg leading-relaxed"
                        >
                            Bienvenido al sistema unificado de gestión de SUDUNT. Desde este portal podrá administrar la ficha consolidada de socios, realizar simulación y desembolsos de préstamos con cronograma mensual, y registrar cobros en caja de forma segura.
                        </motion.p>

                        <motion.div 
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="pt-4"
                        >
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3.5 text-sm font-bold text-white shadow-xl hover:from-blue-500 hover:to-indigo-500 transition duration-150"
                                >
                                    Ingresar al Panel Administrativo
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            ) : (
                                <Link
                                    href={route('login')}
                                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3.5 text-sm font-bold text-white shadow-xl hover:from-blue-500 hover:to-indigo-500 transition duration-150"
                                >
                                    Ingresar al Sistema
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            )}
                        </motion.div>
                    </div>

                    {/* Tarjetas de Módulos (Visualización Rápida) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        
                        {/* Módulo 1: Socios */}
                        <motion.div 
                            whileHover={{ y: -4 }}
                            className="rounded-2xl border border-white/5 bg-white/[0.03] p-6 backdrop-blur-md shadow-lg"
                        >
                            <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4">
                                <Users className="h-5 w-5 text-blue-400" />
                            </div>
                            <h3 className="font-bold text-md text-white mb-2">Fichas de Socios</h3>
                            <p className="text-xs text-gray-400 leading-relaxed">
                                Historial completo de aportaciones, retiros consolidados y ficha de datos personales de docentes.
                            </p>
                        </motion.div>

                        {/* Módulo 2: Simulador */}
                        <motion.div 
                            whileHover={{ y: -4 }}
                            className="rounded-2xl border border-white/5 bg-white/[0.03] p-6 backdrop-blur-md shadow-lg"
                        >
                            <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-4">
                                <Calculator className="h-5 w-5 text-emerald-400" />
                            </div>
                            <h3 className="font-bold text-md text-white mb-2">Simulador Financiero</h3>
                            <p className="text-xs text-gray-400 leading-relaxed">
                                Simulación matemática precisa con redondeos legacy, impresión de cronograma y desembolsos rápidos.
                            </p>
                        </motion.div>

                        {/* Módulo 3: Caja */}
                        <motion.div 
                            whileHover={{ y: -4 }}
                            className="rounded-2xl border border-white/5 bg-white/[0.03] p-6 backdrop-blur-md shadow-lg"
                        >
                            <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center mb-4">
                                <Landmark className="h-5 w-5 text-amber-400" />
                            </div>
                            <h3 className="font-bold text-md text-white mb-2">Cobro en Caja</h3>
                            <p className="text-xs text-gray-400 leading-relaxed">
                                Cobro en efectivo de cuotas pendientes con auditoría y actualización automática de saldos de préstamos.
                            </p>
                        </motion.div>

                        {/* Módulo 4: Planillas */}
                        <motion.div 
                            whileHover={{ y: -4 }}
                            className="rounded-2xl border border-white/5 bg-white/[0.03] p-6 backdrop-blur-md shadow-lg"
                        >
                            <div className="h-10 w-10 rounded-lg bg-indigo-500/10 flex items-center justify-center mb-4">
                                <Landmark className="h-5 w-5 text-indigo-400" />
                            </div>
                            <h3 className="font-bold text-md text-white mb-2">Planillas Mensuales</h3>
                            <p className="text-xs text-gray-400 leading-relaxed">
                                Generación mensual de planillas de descuentos ordinarias y de fondo con cierre de periodo automático.
                            </p>
                        </motion.div>

                    </div>
                </main>

                {/* Footer Inferior */}
                <footer className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500">
                    <span>
                        © {new Date().getFullYear()} SUDUNT - Universidad Nacional de Trujillo. Todos los derechos reservados.
                    </span>
                    <span className="mt-2 sm:mt-0">
                        Laravel v{laravelVersion} (PHP v{phpVersion})
                    </span>
                </footer>

            </div>
        </>
    );
}
