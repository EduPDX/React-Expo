export interface Paciente {
    id?: number;
    nome: string;
    telefone: string;
    idade: number;
}
export interface Consulta {
    id?: number;
    paciente_id: number;
    data: string;
    descricao: string;
    paciente_nome?: string;
}
