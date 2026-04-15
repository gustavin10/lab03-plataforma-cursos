import { Matricula } from '../model/Matricula.mjs';

const KEY = 'matriculas';

export class MatriculaService {
  #listarRaw() {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]');
  }

  listar() {
    return this.#listarRaw();
  }

  buscarPorUsuarioECurso(idUsuario, idCurso) {
    return this.#listarRaw().find(
      m => m.idUsuario === idUsuario && m.idCurso === idCurso
    ) ?? null;
  }

  salvar(idUsuario, idCurso) {
    if (!idUsuario) throw new Error('Selecione um usuário.');
    if (!idCurso) throw new Error('Selecione um curso.');
    if (this.buscarPorUsuarioECurso(idUsuario, idCurso))
      throw new Error('Usuário já está matriculado neste curso.');
    const matricula = new Matricula(idUsuario, idCurso);
    const lista = this.#listarRaw();
    lista.push(matricula);
    localStorage.setItem(KEY, JSON.stringify(lista));
    return matricula;
  }

  marcarConcluida(idUsuario, idCurso) {
    const lista = this.#listarRaw();
    const idx = lista.findIndex(
      m => m.idUsuario === idUsuario && m.idCurso === idCurso
    );
    if (idx !== -1 && !lista[idx].dataConclusao) {
      lista[idx].dataConclusao = new Date().toLocaleDateString('pt-BR');
      localStorage.setItem(KEY, JSON.stringify(lista));
    }
  }
}
