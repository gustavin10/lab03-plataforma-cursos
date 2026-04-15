import { Trilha, TrilhaCurso } from '../model/Trilha.mjs';

const KEY_TRILHAS = 'trilhas';
const KEY_TRILHAS_CURSOS = 'trilhasCursos';

export class TrilhaService {
  #listarTrilhasRaw() {
    return JSON.parse(localStorage.getItem(KEY_TRILHAS) ?? '[]');
  }

  #listarTrilhasCursosRaw() {
    return JSON.parse(localStorage.getItem(KEY_TRILHAS_CURSOS) ?? '[]');
  }

  listarTrilhas() {
    return this.#listarTrilhasRaw();
  }

  listarTrilhasCursos() {
    return this.#listarTrilhasCursosRaw().sort((a, b) => a.ordem - b.ordem);
  }

  buscarTrilhaPorId(id) {
    return this.#listarTrilhasRaw().find(t => t.id === id) ?? null;
  }

  salvarTrilha(dados) {
    const erros = Trilha.validar(dados);
    if (erros.length) throw new Error(erros.join(' | '));
    const trilha = new Trilha(dados.titulo, dados.descricao, dados.idCategoria);
    const lista = this.#listarTrilhasRaw();
    lista.push(trilha);
    localStorage.setItem(KEY_TRILHAS, JSON.stringify(lista));
    return trilha;
  }

  salvarTrilhaCurso(dados) {
    const erros = TrilhaCurso.validar(dados);
    if (erros.length) throw new Error(erros.join(' | '));
    const lista = this.#listarTrilhasCursosRaw();
    const jaExiste = lista.find(
      tc => tc.idTrilha === dados.idTrilha && tc.idCurso === dados.idCurso
    );
    if (jaExiste) throw new Error('Este curso já foi adicionado a esta trilha.');
    const tc = new TrilhaCurso(dados.idTrilha, dados.idCurso, dados.ordem);
    lista.push(tc);
    localStorage.setItem(KEY_TRILHAS_CURSOS, JSON.stringify(lista));
    return tc;
  }
}
