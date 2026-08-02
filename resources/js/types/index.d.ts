export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
    // Campos de Usuario (SUDUNT)
    id_usuario?: number;
    dni_usuario?: string;
    nom_usuario?: string;
    car_usuario?: string;
    niv_usuario?: number;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
};
